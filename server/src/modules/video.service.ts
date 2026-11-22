import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { VideoRepository } from './video.repository.js';
import { TranscodeQueue } from '../transcoding/queue.js';
import { VideoDTO, VideoEntity } from '../types/index.js';

export class VideoService {
  private queue: TranscodeQueue;
  private storageDir: string;

  constructor(storageDir: string, queue: TranscodeQueue) {
    this.storageDir = storageDir;
    this.queue = queue;
  }

  getAllVideos(): VideoDTO[] {
    const videos = VideoRepository.findAll();
    return videos.map((v) => this.mapToDTO(v));
  }

  getVideoById(id: string): VideoDTO | null {
    const video = VideoRepository.findById(id);
    if (!video) return null;
    return this.mapToDTO(video);
  }

  createVideo(title: string, uploadedFile: Express.Multer.File): { id: string; title: string; status: string } {
    const id = uuidv4();

    // Insert as QUEUED
    VideoRepository.create({
      id,
      title: title.trim() || 'Untitled Video',
      status: 'QUEUED',
      original_path: uploadedFile.path,
    });

    // Enqueue async job
    this.queue.addJob(id, uploadedFile.path);

    return {
      id,
      title: title.trim() || 'Untitled Video',
      status: 'QUEUED',
    };
  }

  getVideoStatus(id: string): { id: string; status: string; progress: number; error: string | null } | null {
    const video = VideoRepository.findById(id);
    if (!video) return null;

    return {
      id: video.id,
      status: video.status,
      progress: video.progress,
      error: video.error_message,
    };
  }

  getVideoPlayback(id: string, baseUrl: string): { videoId: string; masterUrl: string; qualities: string[] } {
    const video = VideoRepository.findById(id);
    if (!video) {
      const err: any = new Error('Video not found');
      err.status = 404;
      err.code = 'VIDEO_NOT_FOUND';
      throw err;
    }

    if (video.status !== 'READY') {
      const err: any = new Error('Video is not ready for playback yet');
      err.status = 409;
      err.code = 'VIDEO_NOT_READY';
      throw err;
    }

    const renditions = VideoRepository.findRenditionsByVideoId(id);
    const qualities = renditions.map((r) => r.quality);

    return {
      videoId: video.id,
      masterUrl: `${baseUrl}/media/videos/${video.id}/master.m3u8`,
      qualities: qualities.length > 0 ? qualities : ['Auto'],
    };
  }

  deleteVideo(id: string): void {
    const video = VideoRepository.findById(id);
    if (!video) {
      const err: any = new Error('Video not found');
      err.status = 404;
      err.code = 'VIDEO_NOT_FOUND';
      throw err;
    }

    // 1. Remove original file
    if (fs.existsSync(video.original_path)) {
      try {
        fs.unlinkSync(video.original_path);
      } catch (e) {
        console.warn(`Failed to delete original file ${video.original_path}:`, e);
      }
    }

    // 2. Remove HLS output folder
    const hlsDir = path.join(this.storageDir, 'videos', id);
    if (fs.existsSync(hlsDir)) {
      try {
        fs.rmSync(hlsDir, { recursive: true, force: true });
      } catch (e) {
        console.warn(`Failed to delete HLS dir ${hlsDir}:`, e);
      }
    }

    // 3. Remove from database
    VideoRepository.delete(id);
  }

  retryVideo(id: string): { id: string; status: string } {
    const video = VideoRepository.findById(id);
    if (!video) {
      const err: any = new Error('Video not found');
      err.status = 404;
      err.code = 'VIDEO_NOT_FOUND';
      throw err;
    }

    if (video.status === 'PROCESSING') {
      const err: any = new Error('Video is currently being processed');
      err.status = 409;
      err.code = 'VIDEO_PROCESSING';
      throw err;
    }

    if (!fs.existsSync(video.original_path)) {
      const err: any = new Error('Original video file no longer exists');
      err.status = 400;
      err.code = 'FILE_MISSING';
      throw err;
    }

    // Reset status to QUEUED
    VideoRepository.updateStatus(id, 'QUEUED', 0);
    this.queue.addJob(id, video.original_path);

    return { id, status: 'QUEUED' };
  }

  getAdminStats() {
    const videos = VideoRepository.findAll();
    const queueStatus = this.queue.getQueueStatus();

    const counts = {
      total: videos.length,
      queued: videos.filter((v) => v.status === 'QUEUED').length,
      processing: videos.filter((v) => v.status === 'PROCESSING').length,
      ready: videos.filter((v) => v.status === 'READY').length,
      failed: videos.filter((v) => v.status === 'FAILED').length,
    };

    let totalStorageBytes = 0;
    const calculateFolderSize = (folderPath: string): number => {
      let size = 0;
      if (fs.existsSync(folderPath)) {
        const entries = fs.readdirSync(folderPath, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(folderPath, entry.name);
          if (entry.isDirectory()) {
            size += calculateFolderSize(full);
          } else if (entry.isFile()) {
            try {
              size += fs.statSync(full).size;
            } catch {}
          }
        }
      }
      return size;
    };

    totalStorageBytes = calculateFolderSize(this.storageDir);

    return {
      counts,
      queue: queueStatus,
      storage: {
        totalBytes: totalStorageBytes,
        formattedMB: (totalStorageBytes / (1024 * 1024)).toFixed(2),
      },
    };
  }

  getVideoFiles(id: string) {
    const video = VideoRepository.findById(id);
    if (!video) {
      const err: any = new Error('Video not found');
      err.status = 404;
      err.code = 'VIDEO_NOT_FOUND';
      throw err;
    }

    const hlsDir = path.join(this.storageDir, 'videos', id);
    if (!fs.existsSync(hlsDir)) {
      return { videoId: id, files: [] };
    }

    const entries = fs.readdirSync(hlsDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => {
        const full = path.join(hlsDir, e.name);
        const stat = fs.statSync(full);
        return {
          name: e.name,
          size: stat.size,
          formattedSize: (stat.size / 1024).toFixed(1) + ' KB',
          type: e.name === 'master.m3u8' ? 'master' : e.name.endsWith('.m3u8') ? 'playlist' : 'segment',
          updatedAt: stat.mtime.toISOString(),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return { videoId: id, files };
  }

  private mapToDTO(v: VideoEntity): VideoDTO {
    const renditions = VideoRepository.findRenditionsByVideoId(v.id);
    return {
      id: v.id,
      title: v.title,
      status: v.status,
      progress: v.progress,
      duration: v.duration,
      width: v.width,
      height: v.height,
      qualities: renditions.map((r) => r.quality),
      error_code: v.error_code,
      created_at: v.created_at,
      updated_at: v.updated_at,
    };
  }
}
