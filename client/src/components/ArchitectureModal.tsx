import React, { useState } from 'react';
import { X, Layers, HardDrive, Cpu, Zap, Globe, Database } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulator?: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose, onOpenSimulator }) => {
  const [activeTab, setActiveTab] = useState<'paths' | 'upload' | 'hls' | 'scaling'>('paths');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Layers size={22} color="#3ea6ff" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Kiến Trúc & Quy Trình Kỹ Thuật (System Specifications)</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#aaa', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: '#141414', padding: '0 1rem' }}>
          <button
            onClick={() => setActiveTab('paths')}
            style={{
              padding: '0.75rem 1rem',
              background: 'transparent',
              color: activeTab === 'paths' ? '#3ea6ff' : '#aaa',
              borderBottom: activeTab === 'paths' ? '2px solid #3ea6ff' : 'none',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            1. Phân Tách Hai Tuyến (Dual Path)
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            style={{
              padding: '0.75rem 1rem',
              background: 'transparent',
              color: activeTab === 'upload' ? '#3ea6ff' : '#aaa',
              borderBottom: activeTab === 'upload' ? '2px solid #3ea6ff' : 'none',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            2. Tiếp Nhận Bất Đồng Bộ (HTTP 202)
          </button>

          <button
            onClick={() => setActiveTab('hls')}
            style={{
              padding: '0.75rem 1rem',
              background: 'transparent',
              color: activeTab === 'hls' ? '#3ea6ff' : '#aaa',
              borderBottom: activeTab === 'hls' ? '2px solid #3ea6ff' : 'none',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            3. Chuyển Mã & Phát Sóng HLS
          </button>

          <button
            onClick={() => setActiveTab('scaling')}
            style={{
              padding: '0.75rem 1rem',
              background: 'transparent',
              color: activeTab === 'scaling' ? '#facc15' : '#aaa',
              borderBottom: activeTab === 'scaling' ? '2px solid #facc15' : 'none',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            4. Khả Năng Mở Rộng & CDN Caching
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {activeTab === 'paths' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem', color: '#3ea6ff' }}>
                Đường Điều Khiển (Control Path) vs Đường Dữ Liệu (Video Data Path)
              </h3>
              <p style={{ color: '#ccc', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                Hệ thống tách rời hoàn toàn giữa luồng xử lý dữ liệu truyền phát dung lượng lớn và luồng điều khiển nghiệp vụ siêu nhẹ:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', marginBottom: '0.5rem' }}>
                    <Cpu size={18} /> Control Path (Port 3001)
                  </h4>
                  <ul style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
                    <li>Quản lý metadata: tiêu đề, trạng thái, tiến trình chuyển mã.</li>
                    <li>Cấp quyền và trả về đường dẫn phát trực tuyến (<code>master.m3u8</code>).</li>
                    <li>Điều phối hàng đợi Transcoder (Queue) và lưu cache trạng thái trong Redis.</li>
                    <li>Dữ liệu trao đổi siêu nhẹ (JSON), xử lý hàng chục nghìn RPS.</li>
                  </ul>
                </div>

                <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', marginBottom: '0.5rem' }}>
                    <HardDrive size={18} /> Video Data Path (Media Origin / CDN)
                  </h4>
                  <ul style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
                    <li>Vận chuyển các file media nặng: danh sách phát <code>.m3u8</code> và các đoạn <code>.ts</code>.</li>
                    <li>Trình phát video (hls.js) nạp trực tiếp qua CDN Edge Node.</li>
                    <li>Không đi qua controller nghiệp vụ, giải phóng toàn bộ băng thông cho API server.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem', color: '#3ea6ff' }}>
                Luồng Tiếp Nhận Bất Đồng Bộ (Asynchronous Ingestion Pattern)
              </h3>
              <div style={{ background: '#171717', border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#ddd' }}>
                <strong>Trình tự xử lý chuẩn doanh nghiệp:</strong>
                <ol style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: '1.7' }}>
                  <li>Client gửi <code>POST /api/v1/videos</code> kèm tệp video.</li>
                  <li>Server lưu tệp gốc vào ổ đĩa dưới tên an toàn (UUID) để tránh xung đột và path traversal.</li>
                  <li>Tạo bản ghi trong database với trạng thái ban đầu là <code>QUEUED</code>.</li>
                  <li>Đẩy tác vụ vào hàng đợi chuyển mã ngầm (Worker Job Queue).</li>
                  <li><strong>Trả ngay HTTP 202 Accepted</strong> về cho Client trong vòng ~15-20ms.</li>
                  <li>Client bắt đầu Polling <code>GET /videos/:id/status</code> để nhận cập nhật tiến độ theo thời gian thực.</li>
                </ol>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '8px', color: '#93c5fd', fontSize: '0.82rem' }}>
                💡 <strong>Nguyên tắc kỹ thuật:</strong> Quá trình encode video tiêu tốn rất nhiều CPU/GPU. Không bao giờ chạy FFmpeg đồng bộ bên trong request upload của HTTP Server để tránh giữ kết nối gây nghẽn thread pool.
              </div>
            </div>
          )}

          {activeTab === 'hls' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem', color: '#3ea6ff' }}>
                Chuyển Mã Đa Độ Phân Giải & Phát Sóng Thích Ứng (HLS ABR)
              </h3>
              <p style={{ color: '#ccc', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                Hệ thống sử dụng FFmpeg để chuyển đổi tệp video gốc thành định dạng HTTP Live Streaming (HLS):
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: '#171717', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ color: '#f87171', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>720p HD Rendition</div>
                  <div style={{ fontSize: '0.78rem', color: '#aaa' }}>1280x720 &bull; Bitrate 2,500 kbps &bull; Segments 4s</div>
                </div>
                <div style={{ background: '#171717', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>360p SD Rendition</div>
                  <div style={{ fontSize: '0.78rem', color: '#aaa' }}>640x360 &bull; Bitrate 800 kbps &bull; Segments 4s</div>
                </div>
                <div style={{ background: '#171717', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>Master Playlist</div>
                  <div style={{ fontSize: '0.78rem', color: '#aaa' }}>master.m3u8 định tuyến tự động theo băng thông mạng</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scaling' && (
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.6rem', color: '#facc15' }}>
                Kiến Trúc Mở Rộng Quy Mô Lớn (Scalability & Caching)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: '#181818', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#facc15', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <Database size={16} />
                    <span>Bộ Nhớ Đệm Redis (Metadata & Distributed State)</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: '#bbb', lineHeight: '1.5' }}>
                    Tất cả các truy vấn trạng thái <code>status:&lt;id&gt;</code> được phục vụ trực tiếp từ bộ nhớ RAM của Redis, đạt thông lượng hơn 37,000 RPS với độ trễ 2ms. Giúp database SQLite / PostgreSQL không bao giờ bị nghẽn I/O khi người dùng liên tục polling.
                  </p>
                </div>

                <div style={{ background: '#181818', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3ea6ff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <Globe size={16} />
                    <span>Tầng Phân Phối CDN Edge Cache</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: '#bbb', lineHeight: '1.5' }}>
                    Phân đoạn video tĩnh (<code>.ts</code> chunks) là bất biến (immutable). Khi người dùng đầu tiên xem video, CDN lưu cache tại Edge Node gần nhất. 99% các lượt xem tiếp theo được phục vụ trực tiếp tại biên mạng với tỉ lệ Cache HIT &gt; 95%, giải phóng triệt để băng thông của máy chủ gốc.
                  </p>
                </div>

                <div style={{ background: '#181818', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <Zap size={16} />
                    <span>Hàng Đợi Phân Tán & Cụm Transcoding Workers</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: '#bbb', lineHeight: '1.5' }}>
                    Khi lưu lượng tải lên tăng cao, hàng đợi tác vụ chuyển sang Kafka hoặc RabbitMQ. Các máy chủ worker chuyên dụng trang bị GPU sẽ kéo tác vụ về xử lý song song, cho phép mở rộng quy mô theo chiều ngang không giới hạn (Horizontal Scalability).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#141414' }}>
          {onOpenSimulator ? (
            <button
              onClick={() => {
                onClose();
                onOpenSimulator();
              }}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '16px',
                background: '#d97706',
                color: '#fff',
                border: '1px solid #f59e0b',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={14} /> Mở Trình Mô Phỏng Hoạt Họa (Interactive Flow)
            </button>
          ) : <div />}
          <button className="btn-secondary" onClick={onClose} style={{ borderRadius: '16px' }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
