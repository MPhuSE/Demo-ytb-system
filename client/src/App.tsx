import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { VideoCard } from './components/VideoCard.tsx';
import { UploadModal } from './components/UploadModal.tsx';
import { VideoPlayerModal } from './components/VideoPlayerModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { InteractiveArchitectureSimulator } from './components/InteractiveArchitectureSimulator.tsx';
import { VideoItem } from './types.ts';
import { api } from './services/api.ts';
import { RefreshCw, Film, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHealthy, setIsHealthy] = useState(false);
  const [activeView, setActiveView] = useState<'user' | 'admin' | 'simulator'>('user');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ready' | 'processing' | '720p'>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f0f0f' }}>
      {/* YouTube Standard Fixed Navbar */}
      <Navbar
        isHealthy={isHealthy}
        activeView={activeView}
        onToggleView={(view) => setActiveView(view)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Body with Left Sidebar */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Left Navigation Sidebar */}
        {activeView === 'user' && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            activeView={activeView}
            onToggleView={(view) => setActiveView(view)}
            onOpenArchitecture={() => setIsArchitectureOpen(true)}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        )}

        {/* Content Area */}
        <main
          className={`app-main-content view-${activeView}`}
          style={{
            flex: 1,
            marginLeft: activeView === 'user' ? (isSidebarCollapsed ? '72px' : '240px') : (activeView === 'simulator' ? 'auto' : 0),
            marginRight: activeView === 'simulator' ? 'auto' : undefined,
            width: activeView === 'user' ? (isSidebarCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 240px)') : '100%',
            transition: 'margin-left 0.2s ease, width 0.2s ease',
            padding: activeView === 'simulator' ? '1rem clamp(1rem, 2.5vw, 3rem) 3rem' : '0.5rem 1.75rem 4rem',
            maxWidth: activeView === 'simulator' ? '1800px' : '100%',
            boxSizing: 'border-box',
          }}
        >
          {activeView === 'simulator' ? (
            <InteractiveArchitectureSimulator onBackToHome={() => setActiveView('user')} />
          ) : activeView === 'admin' ? (
            <AdminDashboard
              onBackToUserView={() => setActiveView('user')}
              onPlayVideo={(v) => setSelectedVideo(v)}
            />
          ) : (
            <>
              {/* Category Filter Chips Bar (Sticky Under Navbar) */}
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
                <button className="chip-btn" onClick={() => setSelectedCategory('ready')}>
                  HLS .m3u8 Segments
                </button>
                <button className="chip-btn" onClick={() => setSelectedCategory('all')}>
                  Âm nhạc
                </button>
                <button className="chip-btn" onClick={() => setSelectedCategory('all')}>
                  Trực tiếp
                </button>
                <button className="chip-btn" onClick={() => setSelectedCategory('all')}>
                  Mới tải lên gần đây
                </button>
                <button className="chip-btn" onClick={() => setSelectedCategory('all')}>
                  Đề xuất cho bạn
                </button>
              </div>

              {/* Active Transcoding Notification Bar */}
              {activeProcessingVideo && (
                <div style={{
                  background: 'rgba(234, 179, 8, 0.08)',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  borderRadius: '12px',
                  padding: '0.85rem 1.25rem',
                  margin: '0.75rem 0 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Loader2 size={20} color="#facc15" className="animate-spin" />
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#fef08a', fontWeight: 600 }}>
                        FFmpeg Worker đang phân tách luồng & đóng gói HLS: <strong>"{activeProcessingVideo.title}"</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                        Trạng thái: {activeProcessingVideo.status} &bull; Tiến độ: {activeProcessingVideo.progress}%
                      </div>
                    </div>
                  </div>
                  <div style={{ width: '180px' }}>
                    <div className="progress-bar-container" style={{ width: '100%', height: '6px' }}>
                      <div className="progress-bar-fill" style={{ width: `${activeProcessingVideo.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Header stats & Refresh */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0.25rem 0 1rem',
                padding: '0 4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.88rem', color: '#aaaaaa', fontWeight: 500 }}>
                    {filteredVideos.length} video hiển thị
                  </span>
                  {searchQuery && (
                    <span style={{ fontSize: '0.82rem', color: '#3ea6ff', fontWeight: 600 }}>
                      &bull; Kết quả cho "{searchQuery}"
                    </span>
                  )}
                </div>

                <button
                  className="btn-secondary"
                  onClick={loadVideos}
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.82rem',
                    borderRadius: '18px',
                    backgroundColor: '#272727',
                    border: '1px solid #3f3f46'
                  }}
                  title="Làm mới danh sách video"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                  <span>Làm Mới</span>
                </button>
              </div>

              {/* Video Grid (Responsive YouTube Multi-Column Standard) */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '6rem 0', color: '#888' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #ff0000',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }} />
                  <span style={{ fontSize: '0.92rem', color: '#aaa' }}>Đang tải video từ máy chủ...</span>
                </div>
              ) : filteredVideos.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '5rem 1.5rem',
                  background: '#141414',
                  borderRadius: '16px',
                  border: '1px dashed #333',
                  maxWidth: '560px',
                  margin: '3rem auto'
                }}>
                  <Film size={48} color="#555" style={{ margin: '0 auto 0.75rem' }} />
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: '#eee', fontWeight: 700 }}>
                    {searchQuery ? 'Không tìm thấy video nào phù hợp' : 'Chưa có video nào trên hệ thống'}
                  </h3>
                  <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    {searchQuery
                      ? 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.'
                      : 'Bấm nút "Tạo" hoặc tải video MP4 lên để chạy quy trình phân mảnh HLS tự động.'}
                  </p>
                  {!searchQuery && (
                    <button
                      className="btn-primary"
                      onClick={() => setIsUploadOpen(true)}
                      style={{ borderRadius: '24px', padding: '0.65rem 1.5rem', fontSize: '0.92rem' }}
                    >
                      Tải Video Lên Ngay
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
      </div>

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
        onOpenSimulator={() => setActiveView('simulator')}
      />
    </div>
  );
};
