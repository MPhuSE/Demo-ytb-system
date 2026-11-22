import React, { useState, useRef } from 'react';
import { X, UploadCloud, Film, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api.ts';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string; status: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Vui lòng chọn một file video');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setUploadProgress(0);

      const res = await api.uploadVideo(title, file, (percent) => {
        setUploadProgress(percent);
      });

      setResult(res);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Lỗi tải video');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setFile(null);
    setTitle('');
    setUploadProgress(null);
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Tải Video Lên (Async Ingestion)</h2>
          <button
            onClick={handleResetAndClose}
            style={{ background: 'transparent', color: '#aaa', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {result ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(43, 166, 64, 0.15)', borderRadius: '50%', color: '#4ade80', marginBottom: '1rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>HTTP 202 Accepted!</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                File đã được tiếp nhận và lưu tạm. Video ID: <code style={{ color: '#3ea6ff' }}>{result.id}</code>
              </p>
              <div style={{ background: '#1c1c1c', border: '1px solid #333', borderRadius: '8px', padding: '1rem', fontSize: '0.85rem', color: '#ccc', textAlign: 'left', marginBottom: '1.5rem' }}>
                <strong>Workflow ghi nhận:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
                  <li>API Server nhận file qua multipart/form-data.</li>
                  <li>Lưu metadata vào SQLite với trạng thái <code>QUEUED</code>.</li>
                  <li>Bắn Job vào hàng đợi Transcoder (không chờ FFmpeg để tránh timeout).</li>
                  <li>Worker đang xử lý bất đồng bộ ở phía dưới!</li>
                </ul>
              </div>

              <button className="btn-primary" onClick={handleResetAndClose}>
                Xem Tiến Trình Trong Danh Sách
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                className="dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/mp4,video/quicktime,video/x-matroska"
                  style={{ display: 'none' }}
                />
                {file ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Film size={40} color="#3ea6ff" />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{file.name}</span>
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <UploadCloud size={44} color="#888" />
                    <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>
                      Nhấp hoặc kéo thả file video (MP4, MOV, WebM)
                    </span>
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>
                      Hệ thống tự động chuyển mã đa độ phân giải 360p & 720p HLS
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Tiêu Đề Video</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ví dụ: Demo HLS 720p Adaptive Stream"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {uploadProgress !== null && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.3rem' }}>
                    <span>Đang tải lên server...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar-container" style={{ width: '100%' }}>
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}

              {error && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255, 78, 69, 0.15)', border: '1px solid rgba(255, 78, 69, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetAndClose}
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || !file}
                  style={{ borderRadius: '18px' }}
                >
                  {isSubmitting ? 'Đang Tải Lên...' : 'Tải Video Lên'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
