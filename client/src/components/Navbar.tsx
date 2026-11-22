import React from 'react';
import { Upload, Layers, Search, Video, LayoutDashboard, User } from 'lucide-react';

interface NavbarProps {
  isHealthy: boolean;
  activeView: 'user' | 'admin';
  onToggleView: (view: 'user' | 'admin') => void;
  onOpenUpload: () => void;
  onOpenArchitecture: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  isHealthy, 
  activeView, 
  onToggleView, 
  onOpenUpload, 
  onOpenArchitecture,
  searchQuery = '',
  onSearchChange,
}) => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        {/* Left: Brand Logo & View */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            className="logo" 
            style={{ cursor: 'pointer' }} 
            onClick={() => onToggleView('user')}
            title="Về Trang Chủ YouTube"
          >
            <div className="logo-yt-icon">
              <div className="logo-yt-triangle" />
            </div>
            <span style={{ fontWeight: 800, letterSpacing: '-0.8px' }}>
              YouTube
            </span>
            {activeView === 'admin' ? (
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f87171', marginLeft: '2px' }}>
                Studio
              </span>
            ) : (
              <span className="logo-country-tag">VN</span>
            )}
          </div>

          {/* Status Dot */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.72rem',
              color: isHealthy ? '#4ade80' : '#f87171',
              background: isHealthy ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
              padding: '2px 8px',
              borderRadius: '12px',
              border: `1px solid ${isHealthy ? 'rgba(74, 222, 128, 0.25)' : 'rgba(248, 113, 113, 0.25)'}`,
            }}
            title={isHealthy ? 'Backend API đang hoạt động bình thường trên cổng 3001' : 'Mất kết nối Backend'}
          >
            <span 
              style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: isHealthy ? '#4ade80' : '#f87171',
                boxShadow: isHealthy ? '0 0 6px #4ade80' : 'none'
              }} 
            />
            <span>{isHealthy ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {/* Center: Search Box */}
        {activeView === 'user' && (
          <div className="search-container">
            <div className="search-input-wrap">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm video..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
              <button className="search-btn" title="Tìm kiếm">
                <Search size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="nav-actions">
          {/* Architecture Info Button */}
          <button 
            className="btn-secondary" 
            onClick={onOpenArchitecture}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', borderRadius: '18px' }}
            title="Xem sơ đồ kiến trúc hệ thống"
          >
            <Layers size={15} color="#3ea6ff" />
            <span>Kiến Trúc</span>
          </button>

          {/* Mode Switcher */}
          <button
            onClick={() => onToggleView(activeView === 'user' ? 'admin' : 'user')}
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              borderRadius: '18px',
              background: activeView === 'admin' ? '#2563eb' : '#222',
              color: '#fff',
              border: '1px solid #383838',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title={activeView === 'user' ? 'Mở YouTube Studio' : 'Về Trang Xem Video'}
          >
            {activeView === 'user' ? (
              <>
                <LayoutDashboard size={15} color="#ff4e45" />
                <span>YouTube Studio</span>
              </>
            ) : (
              <>
                <Video size={15} color="#4ade80" />
                <span>Xem Video</span>
              </>
            )}
          </button>

          {/* Upload Button */}
          <button 
            className="btn-primary" 
            onClick={onOpenUpload}
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', borderRadius: '18px' }}
          >
            <Upload size={15} />
            <span>Tải Lên</span>
          </button>

          {/* User Avatar */}
          <div 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              border: '1px solid #444',
              cursor: 'pointer',
            }}
            title="Tài khoản Demo"
          >
            <User size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
};
