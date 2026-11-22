export type VideoStatus = 'QUEUED' | 'PROCESSING' | 'READY' | 'FAILED';

export interface VideoEntity {
  id: string;
  title: string;
  status: VideoStatus;
  progress: number;
  original_path: string;
  duration: number | null;
  width: number | null;
  height: number | null;
  error_code: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface RenditionEntity {
  id: string;
  video_id: string;
  quality: string;
  width: number;
  height: number;
  bitrate: number;
  playlist_path: string;
  created_at: string;
}

export interface VideoDTO {
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
