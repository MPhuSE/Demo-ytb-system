import { db } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

export interface PerformanceMetricEntity {
  id: string;
  video_id: string;
  file_size_bytes: number;
  video_duration_sec: number;
  queue_wait_ms: number;
  transcode_latency_ms: number;
  total_time_to_ready_ms: number;
  output_size_bytes: number;
  compression_ratio: number;
  transcode_speed_factor: number;
  created_at: string;
}

export class PerformanceRepository {
  static record(metric: Omit<PerformanceMetricEntity, 'id' | 'created_at'>): PerformanceMetricEntity {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO performance_metrics (
        id, video_id, file_size_bytes, video_duration_sec,
        queue_wait_ms, transcode_latency_ms, total_time_to_ready_ms,
        output_size_bytes, compression_ratio, transcode_speed_factor, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      metric.video_id,
      metric.file_size_bytes,
      metric.video_duration_sec,
      metric.queue_wait_ms,
      metric.transcode_latency_ms,
      metric.total_time_to_ready_ms,
      metric.output_size_bytes,
      metric.compression_ratio,
      metric.transcode_speed_factor,
      now
    );

    return {
      id,
      ...metric,
      created_at: now,
    };
  }

  static findAll(): PerformanceMetricEntity[] {
    const stmt = db.prepare('SELECT * FROM performance_metrics ORDER BY created_at DESC');
    return stmt.all() as PerformanceMetricEntity[];
  }

  static getSummary() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total_samples,
        AVG(queue_wait_ms) as avg_queue_wait_ms,
        AVG(transcode_latency_ms) as avg_transcode_latency_ms,
        AVG(total_time_to_ready_ms) as avg_time_to_ready_ms,
        AVG(compression_ratio) as avg_compression_ratio,
        AVG(transcode_speed_factor) as avg_speed_factor,
        SUM(file_size_bytes) as total_input_bytes,
        SUM(output_size_bytes) as total_output_bytes
      FROM performance_metrics
    `);
    const summary = stmt.get() as any;

    return {
      totalSamples: summary?.total_samples || 0,
      avgQueueWaitMs: Math.round(summary?.avg_queue_wait_ms || 0),
      avgTranscodeLatencyMs: Math.round(summary?.avg_transcode_latency_ms || 0),
      avgTimeToReadyMs: Math.round(summary?.avg_time_to_ready_ms || 0),
      avgCompressionRatio: parseFloat((summary?.avg_compression_ratio || 0).toFixed(2)),
      avgSpeedFactor: parseFloat((summary?.avg_speed_factor || 0).toFixed(2)),
      totalInputMB: parseFloat(((summary?.total_input_bytes || 0) / (1024 * 1024)).toFixed(2)),
      totalOutputMB: parseFloat(((summary?.total_output_bytes || 0) / (1024 * 1024)).toFixed(2)),
    };
  }
}
