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
