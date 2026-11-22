import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { VideoRepository } from '../modules/video.repository.js';
import { PerformanceRepository } from '../modules/performance.repository.js';
import { Transcoder } from './transcoder.js';
import { redisManager } from '../infra/redis.js';

interface TranscodeJob {
  videoId: string;
  originalPath: string;
  enqueuedAt: number;
}

export class TranscodeQueue {
  private queue: TranscodeJob[] = [];
  private isProcessing = false;
  private storageDir: string;

  constructor(storageDir: string) {
    this.storageDir = storageDir;
  }

  addJob(videoId: string, originalPath: string, enqueuedAt: number = Date.now()): void {
    this.queue.push({ videoId, originalPath, enqueuedAt });
    redisManager.set(`status:${videoId}`, JSON.stringify({ id: videoId, status: 'QUEUED', progress: 0, error: null }), 5);
    console.log(`[Queue] Added job for video ${videoId}. Queue length: ${this.queue.length}`);
    this.processNext();
  }

  getQueueStatus(): { queueLength: number; isProcessing: boolean } {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }

  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const job = this.queue.shift()!;
    const { videoId, originalPath, enqueuedAt } = job;
    const startedAt = Date.now();
    const queueWaitMs = startedAt - enqueuedAt;

    console.log(`[Queue] Starting transcoding job for video: ${videoId} (Queue wait: ${queueWaitMs}ms)`);

    try {
      // 1. Update status to PROCESSING
      VideoRepository.updateStatus(videoId, 'PROCESSING', 5);

      // 2. Probe metadata
      const probe = await Transcoder.probe(originalPath);
      VideoRepository.updateMetadata(videoId, {
        duration: probe.duration,
        width: probe.width,
        height: probe.height,
      });

      // 3. Define output directory
      const outputDir = path.join(this.storageDir, 'videos', videoId);

      // 4. Run transcoding with live progress
      const result = await Transcoder.transcode(videoId, originalPath, outputDir, (progress) => {
        VideoRepository.updateStatus(videoId, 'PROCESSING', progress);
      });

      // 5. Save renditions
      for (const r of result.renditions) {
        VideoRepository.addRendition({
          id: uuidv4(),
          video_id: videoId,
          quality: r.quality,
          width: r.width,
          height: r.height,
          bitrate: r.bandwidth,
          playlist_path: path.join('videos', videoId, `${r.quality}.m3u8`),
        });
      }

      // 6. Mark READY
      VideoRepository.updateStatus(videoId, 'READY', 100);
      const finishedAt = Date.now();
      const transcodeLatencyMs = finishedAt - startedAt;
      const totalTimeToReadyMs = finishedAt - enqueuedAt;

      // 7. Calculate file size & performance metrics
      let originalSizeBytes = 0;
      try {
        originalSizeBytes = fs.statSync(originalPath).size;
      } catch {}

      let outputSizeBytes = 0;
      try {
        const files = fs.readdirSync(outputDir);
        for (const f of files) {
          outputSizeBytes += fs.statSync(path.join(outputDir, f)).size;
        }
      } catch {}

      const compressionRatio = originalSizeBytes > 0 ? parseFloat((outputSizeBytes / originalSizeBytes).toFixed(2)) : 1.0;
      const speedFactor = probe.duration > 0 && transcodeLatencyMs > 0
        ? parseFloat((probe.duration / (transcodeLatencyMs / 1000)).toFixed(2))
        : 1.0;

      PerformanceRepository.record({
        video_id: videoId,
        file_size_bytes: originalSizeBytes,
        video_duration_sec: probe.duration,
        queue_wait_ms: queueWaitMs,
        transcode_latency_ms: transcodeLatencyMs,
        total_time_to_ready_ms: totalTimeToReadyMs,
        output_size_bytes: outputSizeBytes,
        compression_ratio: compressionRatio,
        transcode_speed_factor: speedFactor,
      });

      console.log(`[Queue] Successfully finished video ${videoId}. Transcode: ${transcodeLatencyMs}ms, Total Time-to-Ready: ${totalTimeToReadyMs}ms, Speed factor: ${speedFactor}x`);
    } catch (error: any) {
      console.error(`[Queue] Error processing video ${videoId}:`, error);
      VideoRepository.updateStatus(videoId, 'FAILED', 0, {
        code: 'VIDEO_DECODE_ERROR',
        message: error.message || 'Transcoding failed',
      });
    } finally {
      this.isProcessing = false;
      this.processNext();
    }
  }
}
