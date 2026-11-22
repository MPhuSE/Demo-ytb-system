import React from 'react';
import { 
  Menu, Search, Mic, Activity, Layers, 
  LayoutDashboard, Bell, Video, Plus
} from 'lucide-react';

interface NavbarProps {
  isHealthy: boolean;
  activeView: 'user' | 'admin' | 'simulator';
  onToggleView: (view: 'user' | 'admin' | 'simulator') => void;
  onOpenUpload: () => void;
  onOpenArchitecture: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  isHealthy, 
  activeView, 
  onToggleView, 
  onOpenUpload, 
  onOpenArchitecture,
  searchQuery = '',
  onSearchChange,
  onToggleSidebar,
}) => {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#0f0f0f',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1rem',
      justifyContent: 'space-between',
    }}>
      {/* ============================================================
          LEFT: HAMBURGER MENU & YOUTUBE LOGO WITH STATUS
      ============================================================ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '220px' }}>
        {/* Hamburger Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            color: '#f1f1f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#272727'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          title="Mở/Thu gọn thanh điều hướng"
        >
          <Menu size={22} />
        </button>

        {/* YouTube Logo */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '3px', 
            cursor: 'pointer',
            userSelect: 'none',
          }} 
          onClick={() => onToggleView('user')}
          title="Về Trang Chủ YouTube"
        >
          {/* Red YouTube Icon */}
          <div style={{
            width: '30px',
            height: '21px',
            backgroundColor: '#ff0000',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 0,
              height: 0,
              borderTop: '4.5px solid transparent',
              borderBottom: '4.5px solid transparent',
              borderLeft: '8px solid #ffffff',
              marginLeft: '2px',
            }} />
          </div>

          <span style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-1px',
            fontFamily: "'Roboto', 'Inter', sans-serif",
            marginLeft: '3px',
          }}>
            YouTube
          </span>

          <span style={{
            fontSize: '10px',
            color: '#aaaaaa',
            fontWeight: 500,
            alignSelf: 'flex-start',
            marginLeft: '2px',
            marginTop: '2px',
          }}>
            VN
          </span>

          {/* Backend Online Status Indicator */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: isHealthy ? '#4ade80' : '#f87171',
              backgroundColor: isHealthy ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
              padding: '2px 7px',
              borderRadius: '10px',
              border: `1px solid ${isHealthy ? 'rgba(74, 222, 128, 0.25)' : 'rgba(248, 113, 113, 0.25)'}`,
              marginLeft: '8px',
            }}
            title={isHealthy ? 'Backend Express + SQLite WAL đang hoạt động' : 'Mất kết nối server'}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isHealthy ? '#4ade80' : '#f87171',
              boxShadow: isHealthy ? '0 0 6px #4ade80' : 'none'
            }} />
            <span>{isHealthy ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          CENTER: YOUTUBE CAPSULE SEARCH BAR & VOICE SEARCH
      ============================================================ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        maxWidth: '680px',
        margin: '0 1rem',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '540px',
        }}>
          {/* Search Input Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#121212',
            border: '1px solid #303030',
            borderRight: 'none',
            borderRadius: '40px 0 0 40px',
            padding: '0 1rem',
            height: '40px',
            transition: 'border-color 0.2s',
          }}>
            <input
              type="text"
              placeholder="Tìm kiếm video HLS, ABR, transcode..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          {/* Search Glass Button */}
          <button
            style={{
              height: '40px',
              width: '64px',
              backgroundColor: '#222222',
              border: '1px solid #303030',
              borderRadius: '0 40px 40px 0',
              color: '#f1f1f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#222222'; }}
            title="Tìm kiếm"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Voice Search Mic Button */}
        <button
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#222222',
            color: '#f1f1f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '10px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#222222'; }}
          title="Tìm kiếm bằng giọng nói"
        >
          <Mic size={18} />
        </button>
      </div>

      {/* ============================================================
          RIGHT: ACTION CONTROLS & USER AVATAR
      ============================================================ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Mô Phỏng 2 Tuyến Button */}
        <button
          onClick={() => onToggleView(activeView === 'simulator' ? 'user' : 'simulator')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: activeView === 'simulator' ? '#d97706' : '#222222',
            color: activeView === 'simulator' ? '#ffffff' : '#f1f1f1',
            border: activeView === 'simulator' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (activeView !== 'simulator') e.currentTarget.style.backgroundColor = '#2a2a2a';
          }}
          onMouseLeave={(e) => {
            if (activeView !== 'simulator') e.currentTarget.style.backgroundColor = '#222222';
          }}
          title="Mở mô phỏng trực quan 3D kiến trúc 2 tuyến"
        >
          <Activity size={16} color={activeView === 'simulator' ? '#ffffff' : '#f59e0b'} />
          <span>Mô Phỏng 2 Tuyến</span>
        </button>

        {/* Kiến Trúc Sơ Đồ Button */}
        <button
          onClick={onOpenArchitecture}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#222222',
            color: '#f1f1f1',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2a2a2a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#222222'; }}
          title="Xem thông số kỹ thuật kiến trúc"
        >
          <Layers size={16} color="#38bdf8" />
          <span>Kiến Trúc</span>
        </button>

        {/* YouTube Studio Button */}
        <button
          onClick={() => onToggleView(activeView === 'admin' ? 'user' : 'admin')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: activeView === 'admin' ? '#2563eb' : '#222222',
            color: '#ffffff',
            border: activeView === 'admin' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (activeView !== 'admin') e.currentTarget.style.backgroundColor = '#2a2a2a';
          }}
          onMouseLeave={(e) => {
            if (activeView !== 'admin') e.currentTarget.style.backgroundColor = '#222222';
          }}
          title={activeView === 'admin' ? 'Quay lại xem video' : 'Mở bảng điều khiển YouTube Studio'}
        >
          {activeView === 'admin' ? (
            <>
              <Video size={16} color="#4ade80" />
              <span>Xem Video</span>
            </>
          ) : (
            <>
              <LayoutDashboard size={16} color="#ef4444" />
              <span>Studio</span>
            </>
          )}
        </button>

        {/* + Tạo / Tải Lên Button (Standard YouTube "+ Tạo" Pill) */}
        <button
          onClick={onOpenUpload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#272727',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#383838'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#272727'; }}
          title="Tải video mới lên để mã hóa HLS"
        >
          <Plus size={16} color="#fff" strokeWidth={2.5} />
          <span>Tạo</span>
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              color: '#f1f1f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#272727'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            title="Thông báo"
          >
            <Bell size={20} />
          </button>
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#cc0000',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 800,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #0f0f0f',
            pointerEvents: 'none'
          }}>
            3
          </span>
        </div>

        {/* Channel Avatar Profile */}
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444 0%, #7c2d12 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 800,
            color: '#ffffff',
            cursor: 'pointer',
            border: '1.5px solid rgba(255,255,255,0.2)',
            marginLeft: '4px'
          }}
          title="Kênh cá nhân (Studio Channel)"
        >
          YT
        </div>
      </div>
    </nav>
  );
};
