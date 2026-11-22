import React from 'react';
import { Play, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { VideoItem } from '../types.ts';

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const isReady = video.status === 'READY';
  const isProcessing = video.status === 'PROCESSING';
  const isQueued = video.status === 'QUEUED';
  const isFailed = video.status === 'FAILED';

  const formatDuration = (sec: number | null) => {
    if (!sec) return 'N/A';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString();
  };

  return (
    <div className="video-card">
      <div
        className="thumbnail-box"
        style={{ cursor: isReady ? 'pointer' : 'default' }}
        onClick={() => isReady && onPlay(video)}
      >
        <div className="thumbnail-inner">
          {isReady && (
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(255, 0, 0, 0.4)',
              transition: 'transform 0.2s ease',
            }}>
              <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: '3px' }} />
            </div>
          )}

          {isProcessing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
              <Loader2 size={32} color="#facc15" className="animate-spin" />
              <span style={{ fontSize: '0.85rem', color: '#facc15', fontWeight: 600 }}>
                Đang Encode HLS ({video.progress}%)
              </span>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${video.progress}%` }}></div>
              </div>
            </div>
          )}

          {isQueued && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={32} color="#60a5fa" />
              <span style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 500 }}>
                Đang chờ trong hàng đợi (Queued)
              </span>
            </div>
          )}

          {isFailed && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', textAlign: 'center' }}>
              <AlertCircle size={32} color="#f87171" />
              <span style={{ fontSize: '0.8rem', color: '#f87171' }}>
                {video.error_code || 'Transcoding Failed'}
              </span>
            </div>
          )}

          {isReady && video.duration && (
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.8)',
              color: '#fff',
              fontSize: '0.75rem',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 500,
            }}>
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f1f1', lineHeight: '1.4' }}>
            {video.title}
          </h3>
          <span className={`status-badge status-${video.status.toLowerCase()}`}>
            {video.status}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
          {video.qualities.map((q) => (
            <span key={q} className="badge-tag">
              {q}
            </span>
          ))}
          {video.width && video.height && (
            <span className="badge-tag" style={{ color: '#888' }}>
              {video.width}x{video.height}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#666', borderTop: '1px solid #242424', paddingTop: '0.5rem', marginTop: '0.4rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)' }}>ID: {video.id.slice(0, 8)}...</span>
          <span>{formatDate(video.created_at)}</span>
        </div>
      </div>
    </div>
  );
};
