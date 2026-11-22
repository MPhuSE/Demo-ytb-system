import { VideoItem, VideoStatusResponse, PlaybackResponse, AdminStats, VideoFileItem } from '../types.ts';

const API_BASE_URL = 'http://localhost:3001/api/v1';

export const api = {
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async fetchVideos(): Promise<VideoItem[]> {
    const res = await fetch(`${API_BASE_URL}/videos`);
    if (!res.ok) throw new Error('Failed to fetch videos');
    const data = await res.json();
    return data.videos || [];
  },

  async fetchVideoStatus(id: string): Promise<VideoStatusResponse> {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/status`);
    if (!res.ok) throw new Error(`Failed to fetch status for ${id}`);
    return res.json();
  },

  async fetchPlayback(id: string): Promise<PlaybackResponse> {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/playback`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Video is not ready for playback');
    }
    return res.json();
  },

  uploadVideo(
    title: string,
    file: File,
    onProgress: (percent: number) => void
  ): Promise<{ id: string; title: string; status: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);

      xhr.open('POST', `${API_BASE_URL}/videos`, true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 202) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error?.message || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  },

  async deleteVideo(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/videos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to delete video');
    }
  },

  async retryVideo(id: string): Promise<{ id: string; status: string }> {
    const res = await fetch(`${API_BASE_URL}/videos/${id}/retry`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to retry video processing');
    }
    return res.json();
  },

  async fetchAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  async fetchVideoFiles(id: string): Promise<{ videoId: string; files: VideoFileItem[] }> {
    const res = await fetch(`${API_BASE_URL}/admin/videos/${id}/files`);
    if (!res.ok) throw new Error(`Failed to fetch files for video ${id}`);
    return res.json();
  },
};
