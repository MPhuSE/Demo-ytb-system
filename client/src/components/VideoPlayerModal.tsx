import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { X, Play, Sliders, Network, AlertTriangle } from 'lucide-react';
import { VideoItem, PlaybackResponse } from '../types.ts';
import { api } from '../services/api.ts';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackData, setPlaybackData] = useState<PlaybackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<{ id: number; name: string; height: number; bitrate: number }[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1); // -1 = Auto
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!video) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setLevels([]);
    setCurrentLevel(-1);

    api.fetchPlayback(video.id)
      .then((data) => {
        if (!isMounted) return;
        setPlaybackData(data);
        initializePlayer(data.masterUrl);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Không thể tải đường truyền phát video');
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [video]);

  const initializePlayer = (masterUrl: string) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;
      hls.loadSource(masterUrl);
      hls.attachMedia(videoEl);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        const parsedLevels = hls.levels.map((lvl, index) => ({
          id: index,
          name: `${lvl.height}p`,
          height: lvl.height,
          bitrate: lvl.bitrate,
        }));
        setLevels(parsedLevels);
        videoEl.play().catch(() => {
          // Auto-play was prevented by browser policy
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        console.log(`[HLS.js] Level switched to:`, data.level);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.error('[HLS.js] Fatal error:', data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setError('Lỗi không thể giải mã luồng HLS');
              break;
          }
        }
      });
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS support
      videoEl.src = masterUrl;
      videoEl.addEventListener('loadedmetadata', () => {
        setLoading(false);
        videoEl.play().catch(() => {});
      });
    } else {
      setError('Trình duyệt của bạn không hỗ trợ phát HLS');
      setLoading(false);
    }
  };

  const handleQualityChange = (levelIndex: number) => {
    setCurrentLevel(levelIndex);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      console.log(`[HLS] Quality manually set to level ${levelIndex} (${levelIndex === -1 ? 'Auto' : levels[levelIndex]?.name})`);
    }
  };

  if (!video) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Play size={20} color="#ff0000" fill="#ff0000" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{video.title}</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#aaa', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1rem' }}>
          <div className="player-container">
            <video
              ref={videoRef}
              className="video-element"
              controls
              playsInline
            />
            {loading && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: '#fff',
                gap: '0.5rem'
              }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid #ff0000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span>Đang tải HLS Master Playlist...</span>
              </div>
            )}
            {error && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.85)',
                color: '#f87171',
                padding: '1.5rem',
                textAlign: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle size={36} />
                <h4 style={{ fontSize: '1.1rem' }}>Không thể phát video</h4>
                <p style={{ fontSize: '0.85rem', color: '#aaa' }}>{error}</p>
              </div>
            )}
          </div>

          {/* Controls Bar & Resolution Switcher */}
          <div className="player-controls-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Sliders size={16} color="#aaa" />
              <span style={{ fontSize: '0.85rem', color: '#aaa', fontWeight: 500 }}>Chất Lượng (Adaptive Bitrate):</span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => handleQualityChange(-1)}
                  style={{
                    padding: '3px 9px',
                    fontSize: '0.8rem',
                    borderRadius: '4px',
                    background: currentLevel === -1 ? '#3ea6ff' : '#222',
                    color: currentLevel === -1 ? '#000' : '#ddd',
                    fontWeight: currentLevel === -1 ? 700 : 500,
                  }}
                >
                  Auto
                </button>
                {levels.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => handleQualityChange(lvl.id)}
                    style={{
                      padding: '3px 9px',
                      fontSize: '0.8rem',
                      borderRadius: '4px',
                      background: currentLevel === lvl.id ? '#ff0000' : '#222',
                      color: currentLevel === lvl.id ? '#fff' : '#ddd',
                      fontWeight: currentLevel === lvl.id ? 700 : 500,
                    }}
                  >
                    {lvl.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#888' }}>
              Thời lượng: <strong>{video.duration ? `${Math.round(video.duration)}s` : 'N/A'}</strong>
            </div>
          </div>

          {/* Network & Architecture Explanation Box for Demo */}
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#161616',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            fontSize: '0.82rem',
            color: '#ccc',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#3ea6ff', fontWeight: 600 }}>
              <Network size={16} />
              <span>Kiến trúc phân phối dữ liệu (Video Path Demonstration):</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
              <div>
                <span style={{ color: '#888' }}>Master Playlist: </span>
                <span style={{ color: '#4ade80' }}>{playbackData?.masterUrl || 'N/A'}</span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Chế độ stream: </span>
                <span style={{ color: '#facc15' }}>HLS Segmented Streaming (.m3u8 + 4s .ts chunks)</span>
              </div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#999', lineHeight: '1.4' }}>
              💡 <em>Mẹo giải thích cho hội đồng:</em> Mở F12 &gt; Network tab. Bạn sẽ thấy Player tải <code>master.m3u8</code> trước, sau đó kéo tiếp <code>360p.m3u8</code>/<code>720p.m3u8</code> và liên tục tải các file phân đoạn <code>.ts</code> trực tiếp từ Media Server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
