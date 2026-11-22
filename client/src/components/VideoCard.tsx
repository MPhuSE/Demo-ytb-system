import React, { useState } from 'react';
import { Play, Clock, AlertCircle, Loader2, MoreVertical, CheckCircle2, ListPlus } from 'lucide-react';
import { VideoItem } from '../types.ts';

interface VideoCardProps {
  video: VideoItem;
  onPlay: (video: VideoItem) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isReady = video.status === 'READY';
  const isProcessing = video.status === 'PROCESSING';
  const isQueued = video.status === 'QUEUED';
  const isFailed = video.status === 'FAILED';

  // Format Duration into mm:ss
  const formatDuration = (sec: number | null) => {
    if (!sec) return '0:45';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Realistic YouTube-style relative time calculation
  const getRelativeTime = (iso: string) => {
    try {
      const diffMs = Date.now() - new Date(iso).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Vừa xong';
      if (diffMin < 60) return `${diffMin} phút trước`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours} giờ trước`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} ngày trước`;
    } catch {
      return 'Hôm nay';
    }
  };

  // Deterministic realistic view counts based on video id
  const getDeterministicViews = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
    }
    const abs = Math.abs(hash);
    const views = (abs % 850) + 12; // 12k to 862k
    return `${views} N`;
  };

  // Deterministic gradient themes for realistic YouTube thumbnails
  const getThumbnailGradient = (id: string) => {
    const gradients = [
      'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #172554 100%)',
      'linear-gradient(135deg, #450a0a 0%, #18181b 50%, #2e1065 100%)',
      'linear-gradient(135deg, #052e16 0%, #09090b 50%, #064e3b 100%)',
      'linear-gradient(135deg, #311042 0%, #111827 50%, #1e1b4b 100%)',
      'linear-gradient(135deg, #1c1917 0%, #292524 50%, #0c0a09 100%)',
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
    return gradients[hash % gradients.length];
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: isReady ? 'pointer' : 'default',
        width: '100%',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => isReady && onPlay(video)}
    >
      {/* ============================================================
          THUMBNAIL CONTAINER (Standard YouTube 16:9 Aspect Ratio)
      ============================================================ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: isHovered ? '0px' : '12px',
          overflow: 'hidden',
          backgroundColor: '#1f1f1f',
          background: getThumbnailGradient(video.id),
          boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.6)' : 'none',
          transition: 'all 0.25s cubic-bezier(0.2, 0, 0, 1)',
        }}
      >
        {/* Modern Cyberpunk Tech Grid Watermark */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          opacity: 0.6,
        }} />

        {/* Thumbnail Visual Centerpiece */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          textAlign: 'center',
          zIndex: 2,
        }}>
          {isReady && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              {/* YouTube Glowing Play Button */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 0, 0, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHovered ? '0 0 25px rgba(239, 68, 68, 0.8)' : '0 4px 15px rgba(255, 0, 0, 0.4)',
                transition: 'all 0.2s ease',
              }}>
                <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: '3px' }} />
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                opacity: isHovered ? 1 : 0.85
              }}>
                {video.qualities?.includes('720p') ? '720p HD Master HLS' : 'HLS Stream'}
              </span>
            </div>
          )}

          {isProcessing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '85%' }}>
              <Loader2 size={32} color="#facc15" className="animate-spin" />
              <span style={{ fontSize: '12px', color: '#fef08a', fontWeight: 700 }}>
                Đang chuyển mã HLS ({video.progress}%)
              </span>
              <div style={{
                width: '100%',
                height: '5px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${video.progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #eab308, #22c55e)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {isQueued && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <Clock size={28} color="#60a5fa" />
              <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 600 }}>
                Hàng đợi chờ Worker (FIFO)
              </span>
            </div>
          )}

          {isFailed && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={28} color="#f87171" />
              <span style={{ fontSize: '11px', color: '#fca5a5' }}>
                {video.error_code || 'Lỗi mã hóa'}
              </span>
            </div>
          )}
        </div>

        {/* Top-Left Quality Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          zIndex: 3,
          display: 'flex',
          gap: '4px'
        }}>
          {video.qualities?.includes('720p') && (
            <span style={{
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              letterSpacing: '0.3px'
            }}>
              HD 720p
            </span>
          )}
          <span style={{
            backgroundColor: isReady ? 'rgba(22, 163, 74, 0.85)' : 'rgba(0,0,0,0.75)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '4px',
          }}>
            {isReady ? 'HLS ABR' : video.status}
          </span>
        </div>

        {/* Top-Right Quick Action Hover Buttons */}
        {isHovered && isReady && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0,0,0,0.85)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
              title="Xem sau"
            >
              <Clock size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0,0,0,0.85)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
              title="Thêm vào danh sách chờ"
            >
              <ListPlus size={16} />
            </button>
          </div>
        )}

        {/* Bottom-Right Duration Pill Badge (Standard YouTube) */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          zIndex: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.82)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 5px',
          borderRadius: '4px',
          letterSpacing: '0.4px',
        }}>
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* ============================================================
          METADATA ROW (Channel Avatar, Title, Channel Name, Views, 3-dots)
      ============================================================ */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', padding: '0 2px' }}>
        {/* Channel Avatar Circle */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 800,
          color: '#ffffff',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          YT
        </div>

        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, gap: '3px' }}>
          {/* Video Title */}
          <h3
            style={{
              fontSize: '14.5px',
              fontWeight: 600,
              color: isHovered ? '#ffffff' : '#f1f1f1',
              lineHeight: '1.35',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              margin: 0,
              transition: 'color 0.15s ease'
            }}
            title={video.title}
          >
            {video.title}
          </h3>

          {/* Channel Name with YouTube Verified Checkmark */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12.5px',
            color: '#aaaaaa',
            marginTop: '1px'
          }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Studio Channel
            </span>
            <CheckCircle2 size={13} color="#aaa" fill="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
          </div>

          {/* Stats: Views & Relative Time Ago */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: '#aaaaaa'
          }}>
            <span>{getDeterministicViews(video.id)} lượt xem</span>
            <span style={{ fontSize: '10px' }}>&bull;</span>
            <span>{getRelativeTime(video.created_at)}</span>
            {video.qualities?.length > 0 && (
              <>
                <span style={{ fontSize: '10px' }}>&bull;</span>
                <span style={{ color: isReady ? '#4ade80' : '#facc15', fontWeight: 600 }}>
                  {video.qualities.join('/')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 3-Dots Action Button */}
        <button
          onClick={(e) => { e.stopPropagation(); }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            color: '#aaa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.15s ease',
            flexShrink: 0,
          }}
          title="Tùy chọn khác"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};
