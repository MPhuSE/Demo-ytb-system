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
