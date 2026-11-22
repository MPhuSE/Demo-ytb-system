import React from 'react';
import { Upload, BookOpen, Activity, PlaySquare } from 'lucide-react';

interface NavbarProps {
  isHealthy: boolean;
  onOpenUpload: () => void;
  onOpenArchitecture: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isHealthy, onOpenUpload, onOpenArchitecture }) => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="logo">
            <PlaySquare size={28} color="#FF0000" fill="#FF0000" />
            <span>Mini YouTube</span>
            <span className="logo-badge">System Design Demo</span>
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
            <span>{isHealthy ? 'API Online :3001' : 'API Offline'}</span>
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
