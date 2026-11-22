import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { VideoRepository } from '../modules/video.repository.js';
import { Transcoder } from './transcoder.js';

interface TranscodeJob {
  videoId: string;
  originalPath: string;
}

export class TranscodeQueue {
  private queue: TranscodeJob[] = [];
  private isProcessing = false;
  private storageDir: string;

  constructor(storageDir: string) {
    this.storageDir = storageDir;
  }

  addJob(videoId: string, originalPath: string): void {
    this.queue.push({ videoId, originalPath });
    console.log(`[Queue] Added job for video ${videoId}. Queue length: ${this.queue.length}`);
    this.processNext();
  }

  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const job = this.queue.shift()!;
    const { videoId, originalPath } = job;

    console.log(`[Queue] Starting transcoding job for video: ${videoId}`);

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
      console.log(`[Queue] Successfully finished video ${videoId}. Generated ${result.renditions.length} renditions.`);
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
