export type VideoStatus = 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED';

export interface VideoItem {
  id: string;
  title: string;
  status: VideoStatus;
  progress: number;
  duration: number | null;
  width: number | null;
  height: number | null;
  qualities: string[];
  error_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoStatusResponse {
  id: string;
  status: VideoStatus;
  progress: number;
  error: string | null;
}

export interface PlaybackResponse {
  videoId: string;
  masterUrl: string;
  qualities: string[];
}

export interface AdminStats {
  counts: {
    total: number;
    queued: number;
    processing: number;
    ready: number;
    failed: number;
  };
  queue: {
    queueLength: number;
    isProcessing: boolean;
  };
  storage: {
    totalBytes: number;
    formattedMB: string;
  };
}

export interface VideoFileItem {
  name: string;
  size: number;
  formattedSize: string;
  type: 'master' | 'playlist' | 'segment';
  updatedAt: string;
}

export interface PerformanceSummary {
  totalSamples: number;
  avgQueueWaitMs: number;
  avgTranscodeLatencyMs: number;
  avgTimeToReadyMs: number;
  avgCompressionRatio: number;
  avgSpeedFactor: number;
  totalInputMB: number;
  totalOutputMB: number;
}

export interface PerformanceLogItem {
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

export interface BenchmarkResult {
  videoId: string;
  title: string;
  status: string;
  waterfall: {
    apiIngestionMs: number;
    queueWaitMs: number;
    transcodeLatencyMs: number;
    totalTimeToReadyMs: number;
  };
  metric?: PerformanceLogItem;
}
