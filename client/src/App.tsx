import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { VideoCard } from './components/VideoCard.tsx';
import { UploadModal } from './components/UploadModal.tsx';
import { VideoPlayerModal } from './components/VideoPlayerModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { VideoItem } from './types.ts';
import { api } from './services/api.ts';
import { RefreshCw, Play, Film, Server, Database, Video } from 'lucide-react';

export const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHealthy, setIsHealthy] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const loadVideos = useCallback(async () => {
    try {
      const data = await api.fetchVideos();
      setVideos(data);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      await api.checkHealth();
      setIsHealthy(true);
    } catch {
      setIsHealthy(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    loadVideos();

    const healthInterval = setInterval(checkHealth, 5000);
    return () => clearInterval(healthInterval);
  }, [checkHealth, loadVideos]);

  // Polling for processing/queued videos
  useEffect(() => {
    const hasActiveJobs = videos.some(
      (v) => v.status === 'QUEUED' || v.status === 'PROCESSING'
    );

    if (!hasActiveJobs) return;

    const timer = setInterval(async () => {
      let shouldReloadAll = false;

      for (const v of videos) {
        if (v.status === 'QUEUED' || v.status === 'PROCESSING') {
          try {
            const statusData = await api.fetchVideoStatus(v.id);
            if (statusData.status !== v.status || statusData.progress !== v.progress) {
              if (statusData.status === 'READY' || statusData.status === 'FAILED') {
                shouldReloadAll = true;
              } else {
                setVideos((prev) =>
                  prev.map((item) =>
                    item.id === v.id
                      ? { ...item, status: statusData.status, progress: statusData.progress }
                      : item
                  )
                );
              }
            }
          } catch (err) {
            console.error(`Error polling status for ${v.id}:`, err);
          }
        }
      }

      if (shouldReloadAll) {
        loadVideos();
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [videos, loadVideos]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        isHealthy={isHealthy}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        {/* Architecture Highlight Banner */}
        <div className="hero-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem', color: '#fff' }}>
                Hệ Thống Mô Phỏng YouTube — Thiết Kế Alex Xu
              </h1>
              <p style={{ color: '#aaa', fontSize: '0.9rem', maxWidth: '750px', lineHeight: '1.5' }}>
                Minh họa chuỗi vận hành thực tế: <strong>Tải lên bất đồng bộ (HTTP 202)</strong> &rarr; <strong>Hàng đợi xử lý</strong> &rarr; <strong>FFmpeg cắt đa độ phân giải HLS</strong> &rarr; <strong>Trình phát thích ứng Adaptive Bitrate</strong>.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div className="workflow-pill">
                <Server size={14} color="#60a5fa" />
                <span>Express API (Control Path)</span>
              </div>
              <div className="workflow-pill">
                <Database size={14} color="#facc15" />
                <span>SQLite (Metadata)</span>
              </div>
              <div className="workflow-pill">
                <Film size={14} color="#f87171" />
                <span>FFmpeg Transcoder</span>
              </div>
              <div className="workflow-pill">
                <Video size={14} color="#4ade80" />
                <span>HLS.js (Video Path)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Danh Sách Video Demo</h2>
            <span style={{ fontSize: '0.8rem', color: '#888', background: '#222', padding: '2px 8px', borderRadius: '10px' }}>
              {videos.length} videos
            </span>
          </div>

          <button
            className="btn-secondary"
            onClick={loadVideos}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} />
            <span>Làm Mới</span>
          </button>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #ff0000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
            <span>Đang tải danh sách video...</span>
          </div>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#161616', borderRadius: '12px', border: '1px dashed #333' }}>
            <Film size={48} color="#555" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Chưa có video nào</h3>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Hãy tải lên một video MP4 để quan sát chuỗi xử lý HLS.
            </p>
            <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
              Tải Video Đầu Tiên
            </button>
          </div>
        ) : (
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={(v) => setSelectedVideo(v)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          loadVideos();
        }}
      />

      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
};
