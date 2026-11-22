import React, { useState } from 'react';
import { X, Layers, GitCommit, HardDrive, Cpu, HelpCircle, CheckCircle } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'paths' | 'upload' | 'hls' | 'cheatsheet'>('paths');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Layers size={22} color="#3ea6ff" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Giải Thích Kiến Trúc & Workflows (Alex Xu Ch. 14)</h2>
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
            1. Control vs Video Path
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
            2. Async Ingestion (HTTP 202)
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
            3. Transcoding & HLS
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            style={{
              padding: '0.75rem 1rem',
              background: 'transparent',
              color: activeTab === 'cheatsheet' ? '#facc15' : '#aaa',
              borderBottom: activeTab === 'cheatsheet' ? '2px solid #facc15' : 'none',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            4. Bí Kíp Trả Lời Giảng Viên
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {activeTab === 'paths' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: '#3ea6ff' }}>
                Đường Điều Khiển (Control Path) vs Đường Dữ Liệu (Video Path)
              </h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                Theo thiết kế YouTube của Alex Xu, sai lầm phổ biến nhất của người mới là cho API Server truyền phát video trực tiếp qua các endpoint nghiệp vụ. Trong hệ thống này, ta tách biệt triệt để:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', marginBottom: '0.5rem' }}>
                    <Cpu size={18} /> Control Path (Port 3001)
                  </h4>
                  <ul style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
                    <li>Quản lý metadata: tiêu đề, trạng thái, thời lượng.</li>
                    <li>Cấp quyền và trả về đường dẫn phát (<code>master.m3u8</code> URL).</li>
                    <li>Điều phối hàng đợi Transcoder (Queue).</li>
                    <li>Dữ liệu trao đổi siêu nhẹ (JSON).</li>
                  </ul>
                </div>

                <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', marginBottom: '0.5rem' }}>
                    <HardDrive size={18} /> Video Path (Media Origin)
                  </h4>
                  <ul style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
                    <li>Vận chuyển các file media nặng: <code>.m3u8</code> và các đoạn <code>.ts</code>.</li>
                    <li>Player kết nối thẳng tới Media Origin, hoàn toàn bỏ qua controller nghiệp vụ.</li>
                    <li>Dễ dàng thay thế hoặc đặt NGINX / CDN Edge phía trước để cache.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: '#3ea6ff' }}>
                Luồng Tiếp Nhận Bất Đồng Bộ (Asynchronous Ingestion)
              </h3>
              <div style={{ background: '#171717', border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#ddd' }}>
                <strong>Trình tự thực thi:</strong>
                <ol style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: '1.7' }}>
                  <li>Client gửi <code>POST /api/v1/videos</code> (multipart/form-data).</li>
                  <li>Server lưu file gốc vào ổ đĩa dưới tên an toàn (UUID) để chống path traversal.</li>
                  <li>Tạo bản ghi trong SQLite với trạng thái <code>QUEUED</code>.</li>
                  <li>Đưa task vào hàng đợi xử lý ngầm (TranscodeQueue).</li>
                  <li><strong>Trả ngay HTTP 202 Accepted</strong> về cho Client cùng với <code>videoId</code>.</li>
                  <li>Client bắt đầu Polling <code>GET /videos/:id/status</code> mỗi 2 giây để cập nhật tiến trình.</li>
                </ol>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(241, 196, 15, 0.1)', border: '1px solid rgba(241, 196, 15, 0.3)', borderRadius: '8px', color: '#facc15', fontSize: '0.85rem' }}>
                ⚠️ <strong>Điểm mấu chốt:</strong> Không bao giờ chạy FFmpeg đồng bộ bên trong request upload. Nếu làm vậy, Client sẽ bị treo, trình duyệt timeout (HTTP 504) và API server cạn kiệt thread.
              </div>
            </div>
          )}

          {activeTab === 'hls' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: '#3ea6ff' }}>
                Transcoding & Giao Thức HLS (HTTP Live Streaming)
              </h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                Tại sao không phát trực tiếp file <code>.mp4</code> mà phải phân giải sang HLS?
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ color: '#4ade80' }}>1. Phân đoạn nhỏ (Chunked Segments):</strong>
                  <p style={{ color: '#aaa', marginTop: '0.3rem' }}>
                    FFmpeg cắt video thành các tệp <code>.ts</code> có độ dài 4 giây. Trình phát chỉ tải trước vài đoạn. Nếu người dùng xem 10 giây rồi tắt, server không tốn băng thông tải toàn bộ 100MB video.
                  </p>
                </div>

                <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ color: '#60a5fa' }}>2. Thích ứng băng thông (Adaptive Bitrate - ABR):</strong>
                  <p style={{ color: '#aaa', marginTop: '0.3rem' }}>
                    Tạo nhiều rendition (360p, 720p). File <code>master.m3u8</code> đóng vai trò điều phối. <code>hls.js</code> trên trình duyệt đo tốc độ mạng: mạng chậm tự chuyển sang 360p, mạng nhanh chuyển 720p mà video không bị khựng lại.
                  </p>
                </div>

                <div style={{ background: '#141414', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <strong style={{ color: '#facc15' }}>3. Không Upscale vô nghĩa:</strong>
                  <p style={{ color: '#aaa', marginTop: '0.3rem' }}>
                    Worker dùng <code>ffprobe</code> kiểm tra độ phân giải gốc. Nếu video đầu vào &lt; 720p, hệ thống chỉ tạo bản 360p, loại trừ 720p khỏi <code>master.m3u8</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cheatsheet' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: '#facc15' }}>
                Bộ Câu Hỏi Phản Biện Của Hội Đồng
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: '#181818', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3ea6ff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <HelpCircle size={16} />
                    <span>Hỏi: Tại sao em dùng HTTP 202 Accepted thay vì 200 OK?</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: '#bbb', lineHeight: '1.5' }}>
                    <strong>Trả lời:</strong> <em>"Dạ thưa thầy/cô, mã 202 có nghĩa là yêu cầu đã được chấp nhận để xử lý nhưng chưa hoàn thành. Vì encode video tốn thời gian, hệ thống tiếp nhận và trả quyền điều khiển về cho Client ngay để tránh timeout, sau đó dùng Polling để thông báo trạng thái."</em>
                  </p>
                </div>

                <div style={{ background: '#181818', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3ea6ff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <HelpCircle size={16} />
                    <span>Hỏi: Khi nào video mới được chuyển sang trạng thái READY?</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: '#bbb', lineHeight: '1.5' }}>
                    <strong>Trả lời:</strong> <em>"Dạ hệ thống chỉ đánh dấu READY khi FFmpeg kết thúc với exit code 0 VÀ Worker đã kiểm tra xác thực thực tế rằng file master.m3u8 cùng các file segment .ts đã tồn tại trên đĩa và có dung lượng hợp lệ."</em>
                  </p>
                </div>

                <div style={{ background: '#181818', border: '1px solid #333', borderRadius: '8px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3ea6ff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                    <HelpCircle size={16} />
                    <span>Hỏi: Để scale hệ thống này lên 1 triệu người dùng thì nâng cấp thế nào?</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: '#bbb', lineHeight: '1.5' }}>
                    <strong>Trả lời:</strong> <em>"1. Thay local disk bằng Object Storage (như Amazon S3 / MinIO).<br/>2. Thay in-memory queue bằng Redis BullMQ / Kafka và phân cụm Worker chạy trên nhiều server GPU.<br/>3. Sử dụng CDN (Cloudflare/CloudFront) phía trước Video Path để cache các file .ts tại biên mạng."</em>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: '#141414' }}>
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
