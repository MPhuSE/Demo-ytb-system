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

      <div style={{ padding: '0.9rem', display: 'flex', gap: '0.75rem', flex: 1 }}>
        {/* Channel Avatar */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#272727',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#ff4e45',
          flexShrink: 0,
        }}>
          YT
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#f1f1f1',
            lineHeight: '1.35',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            cursor: isReady ? 'pointer' : 'default',
          }}
          onClick={() => isReady && onPlay(video)}
          >
            {video.title}
          </h3>

          <div style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Studio Channel</span>
            <span style={{ fontSize: '0.65rem' }}>&bull;</span>
            <span style={{ color: isReady ? '#4ade80' : isProcessing ? '#facc15' : '#888' }}>
              {isReady ? 'Đã sẵn sàng HLS' : isProcessing ? `Đang Encode ${video.progress}%` : video.status}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#777', marginTop: '2px' }}>
            <span>{video.qualities.length > 0 ? video.qualities.join(', ') : 'HLS Stream'}</span>
            <span>&bull;</span>
            <span>{formatDate(video.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
