import { db } from '../db/database.js';
import { VideoEntity, RenditionEntity, VideoStatus } from '../types/index.js';

export class VideoRepository {
  static create(video: Omit<VideoEntity, 'created_at' | 'updated_at' | 'progress' | 'duration' | 'width' | 'height' | 'error_code' | 'error_message'>): VideoEntity {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO videos (id, title, status, progress, original_path, created_at, updated_at)
      VALUES (?, ?, ?, 0, ?, ?, ?)
    `);
    stmt.run(video.id, video.title, video.status, video.original_path, now, now);

    return this.findById(video.id)!;
  }

  static findById(id: string): VideoEntity | null {
    const stmt = db.prepare('SELECT * FROM videos WHERE id = ?');
    const row = stmt.get(id) as VideoEntity | undefined;
    return row || null;
  }

  static findAll(): VideoEntity[] {
    const stmt = db.prepare('SELECT * FROM videos ORDER BY created_at DESC');
    return stmt.all() as VideoEntity[];
  }

  static updateStatus(id: string, status: VideoStatus, progress: number = 0, error?: { code: string; message: string }): void {
    const now = new Date().toISOString();
    if (error) {
      const stmt = db.prepare(`
        UPDATE videos
        SET status = ?, progress = ?, error_code = ?, error_message = ?, updated_at = ?
        WHERE id = ?
      `);
      stmt.run(status, progress, error.code, error.message, now, id);
    } else {
      const stmt = db.prepare(`
        UPDATE videos
        SET status = ?, progress = ?, updated_at = ?
        WHERE id = ?
      `);
      stmt.run(status, progress, now, id);
    }
  }

  static updateMetadata(id: string, metadata: { duration: number; width: number; height: number }): void {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE videos
      SET duration = ?, width = ?, height = ?, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(metadata.duration, metadata.width, metadata.height, now, id);
  }

  static addRendition(rendition: Omit<RenditionEntity, 'created_at'>): void {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO renditions (id, video_id, quality, width, height, bitrate, playlist_path, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      rendition.id,
      rendition.video_id,
      rendition.quality,
      rendition.width,
      rendition.height,
      rendition.bitrate,
      rendition.playlist_path,
      now
    );
  }

  static findRenditionsByVideoId(videoId: string): RenditionEntity[] {
    const stmt = db.prepare('SELECT * FROM renditions WHERE video_id = ? ORDER BY height DESC');
    return stmt.all(videoId) as RenditionEntity[];
  }
}
