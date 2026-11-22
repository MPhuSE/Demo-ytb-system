import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { VideoCard } from './components/VideoCard.tsx';
import { UploadModal } from './components/UploadModal.tsx';
import { VideoPlayerModal } from './components/VideoPlayerModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { VideoItem } from './types.ts';
import { api } from './services/api.ts';
import { RefreshCw, Film, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHealthy, setIsHealthy] = useState(false);
  const [activeView, setActiveView] = useState<'user' | 'admin'>('user');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ready' | 'processing' | '720p'>('all');

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

  // Filter videos based on category and search query
  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      if (searchQuery.trim() && !v.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
        return false;
      }
      if (selectedCategory === 'ready' && v.status !== 'READY') return false;
      if (selectedCategory === 'processing' && v.status === 'READY') return false;
      if (selectedCategory === '720p' && (!v.qualities || !v.qualities.includes('720p'))) {
        return false;
      }
      return true;
    });
  }, [videos, searchQuery, selectedCategory]);

  const activeProcessingVideo = videos.find((v) => v.status === 'PROCESSING' || v.status === 'QUEUED');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        isHealthy={isHealthy}
        activeView={activeView}
        onToggleView={(view) => setActiveView(view)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeView === 'admin' ? (
          <AdminDashboard
            onBackToUserView={() => setActiveView('user')}
            onPlayVideo={(v) => setSelectedVideo(v)}
          />
        ) : (
          <>
            {/* Category Filter Chips Bar */}
            <div className="chips-container">
              <button
                className={`chip-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                Tất cả ({videos.length})
              </button>
              <button
                className={`chip-btn ${selectedCategory === 'ready' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('ready')}
              >
                Đã sẵn sàng HLS ({videos.filter((v) => v.status === 'READY').length})
              </button>
              <button
                className={`chip-btn ${selectedCategory === '720p' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('720p')}
              >
                720p HD Multi-bitrate
              </button>
              <button
                className={`chip-btn ${selectedCategory === 'processing' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('processing')}
              >
                Đang xử lý ({videos.filter((v) => v.status !== 'READY').length})
              </button>
            </div>

            {/* Active Transcoding Notification Bar */}
            {activeProcessingVideo && (
              <div style={{
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '10px',
                padding: '0.85rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Loader2 size={18} color="#facc15" className="animate-spin" />
                  <span style={{ fontSize: '0.88rem', color: '#fef08a' }}>
                    Worker đang chuyển mã: <strong>"{activeProcessingVideo.title}"</strong> ({activeProcessingVideo.progress}%)
                  </span>
                </div>
                <div style={{ width: '160px' }}>
                  <div className="progress-bar-container" style={{ width: '100%', height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${activeProcessingVideo.progress}%` }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#aaa' }}>
                  {filteredVideos.length} video
                </span>
                {searchQuery && (
                  <span style={{ fontSize: '0.8rem', color: '#3ea6ff' }}>
                    &bull; Kết quả tìm kiếm "{searchQuery}"
                  </span>
                )}
              </div>

              <button
                className="btn-secondary"
                onClick={loadVideos}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '16px' }}
                title="Làm mới danh sách video"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                <span>Làm Mới</span>
              </button>
            </div>

            {/* Video Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
                <div style={{ width: '36px', height: '36px', border: '3px solid #ff0000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <span>Đang tải danh sách video...</span>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: '#161616', borderRadius: '12px', border: '1px dashed #333' }}>
                <Film size={44} color="#555" style={{ margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: '#eee' }}>
                  {searchQuery ? 'Không tìm thấy video nào phù hợp' : 'Chưa có video nào'}
                </h3>
                <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  {searchQuery ? 'Hãy thử tìm kiếm với từ khóa khác.' : 'Tải lên video MP4 để thưởng thức phát trực tuyến HLS.'}
                </p>
                {!searchQuery && (
                  <button className="btn-primary" onClick={() => setIsUploadOpen(true)} style={{ borderRadius: '18px' }}>
                    Tải Video Lên
                  </button>
                )}
              </div>
            ) : (
              <div className="video-grid">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={(v) => setSelectedVideo(v)}
                  />
                ))}
              </div>
            )}
          </>
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
