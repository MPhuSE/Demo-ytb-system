import { v4 as uuidv4 } from 'uuid';
import path from 'path';
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
