import React, { useState, useEffect, useCallback } from 'react';
import { 
  Server, HardDrive, RefreshCw, Trash2, RotateCw, 
  FileText, Cpu, ArrowLeft, X
} from 'lucide-react';
import { VideoItem, AdminStats, VideoFileItem } from '../types.ts';
import { api } from '../services/api.ts';

interface AdminDashboardProps {
  onBackToUserView: () => void;
  onPlayVideo: (video: VideoItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToUserView, onPlayVideo }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedVideoFiles, setSelectedVideoFiles] = useState<{ video: VideoItem; files: VideoFileItem[] } | null>(null);
  const [fileLoading, setFileLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [vList, sData] = await Promise.all([
        api.fetchVideos(),
        api.fetchAdminStats(),
      ]);
      setVideos(vList);
      setStats(sData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa video "${title}"? Mọi file gốc và HLS segments trên đĩa sẽ bị xóa sạch.`)) {
      return;
    }

    try {
      setActionLoading(id);
      await api.deleteVideo(id);
      await loadData();
    } catch (err: any) {
      alert(`Lỗi khi xóa video: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      setActionLoading(id);
      await api.retryVideo(id);
      await loadData();
    } catch (err: any) {
      alert(`Lỗi khi thử lại: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleInspectFiles = async (video: VideoItem) => {
    try {
      setFileLoading(true);
      const res = await api.fetchVideoFiles(video.id);
      setSelectedVideoFiles({ video, files: res.files });
    } catch (err: any) {
      alert(`Không thể lấy danh sách file: ${err.message}`);
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem 0 3rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button 
            className="btn-secondary" 
            onClick={onBackToUserView} 
            style={{ marginBottom: '0.5rem', fontSize: '0.8rem', padding: '4px 10px' }}
          >
            <ArrowLeft size={14} /> Quay về YouTube Web
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Server size={24} color="#ff4e45" />
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>YouTube Studio — Quản Trị Hệ Thống</h1>
            <span style={{ fontSize: '0.75rem', background: '#333', color: '#4ade80', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
              ADMIN CONSOLE
            </span>
          </div>
        </div>

        <button className="btn-secondary" onClick={loadData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Làm Mới Dữ Liệu</span>
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '1.2rem' }}>
            <div style={{ color: '#888', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem' }}>TỔNG SỐ VIDEO</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{stats.counts.total}</div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>Metadata trong SQLite</div>
          </div>

          <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '1.2rem' }}>
            <div style={{ color: '#888', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem' }}>HÀNG ĐỢI XỬ LÝ (QUEUE)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#facc15' }}>
              {stats.counts.queued + stats.counts.processing}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.2rem' }}>
              {stats.queue.isProcessing ? '⚡ Worker đang chạy FFmpeg' : '💤 Worker đang rảnh'}
            </div>
          </div>

          <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '1.2rem' }}>
            <div style={{ color: '#888', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem' }}>SẴN SÀNG PHÁT (READY)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4ade80' }}>{stats.counts.ready}</div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>Đã có HLS segment</div>
          </div>

          <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '1.2rem' }}>
            <div style={{ color: '#888', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem' }}>LỖI TRANSCODE (FAILED)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f87171' }}>{stats.counts.failed}</div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>Có thể bấm Thử Lại (Retry)</div>
          </div>

          <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '1.2rem' }}>
            <div style={{ color: '#888', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.4rem' }}>DUNG LƯỢNG LƯU TRỮ</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3ea6ff' }}>{stats.storage.formattedMB} MB</div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.2rem' }}>/storage (Originals + HLS)</div>
          </div>
        </div>
      )}

      {/* Worker & Architecture Status Card */}
      <div style={{ background: '#151515', border: '1px solid #282828', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Cpu size={20} color="#3ea6ff" />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Bộ Điều Phối Transcoder Worker</div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>
              Kiểm soát concurrency: 1 task/lần &bull; Hàng đợi FIFO &bull; Thư viện: <code>ffprobe + ffmpeg libx264/aac</code>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
          <span style={{ color: '#888' }}>Trạng thái Worker:</span>
          {stats?.queue.isProcessing ? (
            <span style={{ background: 'rgba(241, 196, 15, 0.2)', color: '#facc15', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#facc15', animation: 'pulse 1.5s infinite' }} />
              BUSY (Đang Encode)
            </span>
          ) : (
            <span style={{ background: 'rgba(43, 166, 64, 0.2)', color: '#4ade80', padding: '3px 8px', borderRadius: '4px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
              IDLE (Sẵn Sàng)
            </span>
          )}
        </div>
      </div>

      {/* Videos Management Table */}
      <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #252525', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Bảng Quản Lý Video & Tiến Trình Transcode</h2>
          <span style={{ fontSize: '0.8rem', color: '#777' }}>Tổng cộng: {videos.length} bản ghi</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#1c1c1c', borderBottom: '1px solid #2a2a2a', color: '#888' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Tiêu Đề & Video ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Trạng Thái & Tiến Trình</th>
                <th style={{ padding: '0.85rem 1rem' }}>Renditions</th>
                <th style={{ padding: '0.85rem 1rem' }}>Thời Lượng</th>
                <th style={{ padding: '0.85rem 1rem' }}>Thời Gian Tạo</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao Tác Quản Trị</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                    Chưa có video nào trong cơ sở dữ liệu.
                  </td>
                </tr>
              ) : (
                videos.map((v) => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#f1f1f1' }}>{v.title}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#666' }}>
                        {v.id}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`status-badge status-${v.status.toLowerCase()}`}>
                          {v.status}
                        </span>
                        {v.status === 'PROCESSING' && (
                          <span style={{ color: '#facc15', fontWeight: 600, fontSize: '0.8rem' }}>
                            {v.progress}%
                          </span>
                        )}
                      </div>
                      {v.status === 'PROCESSING' && (
                        <div className="progress-bar-container" style={{ width: '120px', height: '4px', marginTop: '4px' }}>
                          <div className="progress-bar-fill" style={{ width: `${v.progress}%` }}></div>
                        </div>
                      )}
                      {v.error_code && (
                        <div style={{ fontSize: '0.72rem', color: '#f87171', marginTop: '2px' }}>
                          {v.error_code}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {v.qualities.length > 0 ? (
                          v.qualities.map((q) => (
                            <span key={q} className="badge-tag" style={{ background: '#222', color: '#4ade80' }}>
                              {q}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#555', fontSize: '0.75rem' }}>Chưa có</span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#aaa' }}>
                      {v.duration ? `${Math.round(v.duration)}s` : 'N/A'}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', color: '#777', fontSize: '0.75rem' }}>
                      {new Date(v.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                        {v.status === 'READY' && (
                          <button
                            onClick={() => onPlayVideo(v)}
                            style={{
                              padding: '4px 8px',
                              background: '#272727',
                              color: '#fff',
                              fontSize: '0.75rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Phát video HLS"
                          >
                            Phát
                          </button>
                        )}

                        <button
                          onClick={() => handleInspectFiles(v)}
                          disabled={fileLoading}
                          style={{
                            padding: '4px 8px',
                            background: '#1f2937',
                            color: '#60a5fa',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Xem các file .m3u8 và .ts trên ổ đĩa"
                        >
                          <FileText size={12} />
                          <span>Files</span>
                        </button>

                        <button
                          onClick={() => handleRetry(v.id)}
                          disabled={actionLoading === v.id || v.status === 'PROCESSING'}
                          style={{
                            padding: '4px 8px',
                            background: '#2d2815',
                            color: '#facc15',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Thử lại (Re-queue Transcode)"
                        >
                          <RotateCw size={12} className={actionLoading === v.id ? 'animate-spin' : ''} />
                          <span>Retry</span>
                        </button>

                        <button
                          onClick={() => handleDelete(v.id, v.title)}
                          disabled={actionLoading === v.id}
                          style={{
                            padding: '4px 8px',
                            background: '#331a1a',
                            color: '#f87171',
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Xóa video và dọn sạch ổ đĩa"
                        >
                          <Trash2 size={12} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Files Modal */}
      {selectedVideoFiles && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <HardDrive size={20} color="#3ea6ff" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  Kiểm Tra File Lưu Trữ: {selectedVideoFiles.video.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideoFiles(null)}
                style={{ background: 'transparent', color: '#aaa', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ background: '#141414', border: '1px solid #282828', borderRadius: '8px', padding: '0.85rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#bbb' }}>
                <div><strong>Thư mục lưu trữ:</strong> <code>server/storage/videos/{selectedVideoFiles.video.id}/</code></div>
                <div style={{ marginTop: '0.3rem' }}><strong>Tổng số file sinh ra:</strong> {selectedVideoFiles.files.length} files (Manifests + Chunks)</div>
              </div>

              {selectedVideoFiles.files.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Chưa có file HLS nào được sinh ra cho video này (chưa READY hoặc bị lỗi).
                </div>
              ) : (
                <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #262626', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#1f1f1f', borderBottom: '1px solid #333', color: '#888' }}>
                        <th style={{ padding: '0.6rem 0.8rem' }}>Tên File</th>
                        <th style={{ padding: '0.6rem 0.8rem' }}>Phân Loại</th>
                        <th style={{ padding: '0.6rem 0.8rem' }}>Kích Thước</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVideoFiles.files.map((file) => (
                        <tr key={file.name} style={{ borderBottom: '1px solid #222' }}>
                          <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'var(--font-mono)' }}>
                            <span style={{ 
                              color: file.type === 'master' ? '#4ade80' : file.type === 'playlist' ? '#60a5fa' : '#ddd',
                              fontWeight: file.type === 'master' ? 700 : 400
                            }}>
                              {file.name}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem 0.8rem' }}>
                            <span className="badge-tag" style={{
                              background: file.type === 'master' ? 'rgba(43,166,64,0.15)' : file.type === 'playlist' ? 'rgba(62,166,255,0.15)' : '#222',
                              color: file.type === 'master' ? '#4ade80' : file.type === 'playlist' ? '#60a5fa' : '#aaa'
                            }}>
                              {file.type === 'master' ? 'Master Playlist' : file.type === 'playlist' ? 'Sub-Playlist' : 'HLS Segment (.ts)'}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem 0.8rem', color: '#aaa', fontFamily: 'var(--font-mono)' }}>
                            {file.formattedSize}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button className="btn-secondary" onClick={() => setSelectedVideoFiles(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
