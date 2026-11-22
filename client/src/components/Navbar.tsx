import React from 'react';
import { Upload, BookOpen, Activity, PlaySquare, Settings, Home } from 'lucide-react';

interface NavbarProps {
  isHealthy: boolean;
  activeView: 'user' | 'admin';
  onToggleView: (view: 'user' | 'admin') => void;
  onOpenUpload: () => void;
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  isHealthy, 
  activeView, 
  onToggleView, 
  onOpenUpload, 
  onOpenArchitecture 
}) => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => onToggleView('user')}>
            <PlaySquare size={28} color="#FF0000" fill="#FF0000" />
            <span>Mini YouTube</span>
            <span className="logo-badge">System Design</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            background: isHealthy ? 'rgba(43, 166, 64, 0.15)' : 'rgba(255, 78, 69, 0.15)',
            color: isHealthy ? '#4ade80' : '#f87171',
            padding: '3px 8px',
            borderRadius: '12px',
            border: `1px solid ${isHealthy ? 'rgba(43, 166, 64, 0.3)' : 'rgba(255, 78, 69, 0.3)'}`
          }}>
            <Activity size={12} className={isHealthy ? '' : 'animate-pulse'} />
            <span>{isHealthy ? 'API :3001' : 'API Offline'}</span>
          </div>

          {/* Navigation View Switcher */}
          <div style={{ display: 'flex', background: '#1c1c1c', border: '1px solid #333', borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={() => onToggleView('user')}
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                borderRadius: '6px',
                background: activeView === 'user' ? '#ff0000' : 'transparent',
                color: activeView === 'user' ? '#fff' : '#aaa',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <Home size={14} />
              <span>Xem Video</span>
            </button>

            <button
              onClick={() => onToggleView('admin')}
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                borderRadius: '6px',
                background: activeView === 'admin' ? '#2563eb' : 'transparent',
                color: activeView === 'admin' ? '#fff' : '#aaa',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600,
              }}
            >
              <Settings size={14} />
              <span>Trang Admin (Studio)</span>
            </button>
          </div>
        </div>

        <div className="nav-actions">
          <button className="btn-secondary" onClick={onOpenArchitecture}>
            <BookOpen size={16} />
            <span>Giải Thích Kiến Trúc</span>
          </button>

          <button className="btn-primary" onClick={onOpenUpload}>
            <Upload size={16} />
            <span>Tải Video Lên</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
