import React from 'react';
import { 
  Home, PlaySquare, Clock, History, ThumbsUp, User, 
  Flame, Music2, Gamepad2, Trophy, Newspaper, 
  Layers, Activity, LayoutDashboard, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  activeView: 'user' | 'admin' | 'simulator';
  onToggleView: (view: 'user' | 'admin' | 'simulator') => void;
  onOpenArchitecture: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  activeView,
  onToggleView,
  onOpenArchitecture,
  selectedCategory,
  onSelectCategory
}) => {
  if (isCollapsed) {
    // Mini Sidebar (YouTube standard 72px)
    return (
      <aside style={{
        position: 'fixed',
        top: '56px',
        left: 0,
        bottom: 0,
        width: '72px',
        backgroundColor: '#0f0f0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '0.5rem',
        zIndex: 40,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={() => onToggleView('user')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '74px',
            borderRadius: '10px',
            background: activeView === 'user' ? '#272727' : 'transparent',
            color: activeView === 'user' ? '#fff' : '#aaa',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 0 6px',
            marginBottom: '4px',
            transition: 'background-color 0.15s ease'
          }}
          title="Trang chủ"
        >
          <Home size={22} color={activeView === 'user' ? '#fff' : '#aaa'} />
          <span style={{ fontSize: '10px', marginTop: '6px', fontWeight: activeView === 'user' ? 600 : 400 }}>Trang chủ</span>
        </button>

        <button
          onClick={() => onToggleView('simulator')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '74px',
            borderRadius: '10px',
            background: activeView === 'simulator' ? '#272727' : 'transparent',
            color: activeView === 'simulator' ? '#f59e0b' : '#aaa',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 0 6px',
            marginBottom: '4px',
            transition: 'background-color 0.15s ease'
          }}
          title="Mô Phỏng 2 Tuyến"
        >
          <Activity size={22} color={activeView === 'simulator' ? '#f59e0b' : '#aaa'} />
          <span style={{ fontSize: '10px', marginTop: '6px', fontWeight: activeView === 'simulator' ? 600 : 400 }}>Mô Phỏng</span>
        </button>

        <button
          onClick={onOpenArchitecture}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '74px',
            borderRadius: '10px',
            background: 'transparent',
            color: '#aaa',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 0 6px',
            marginBottom: '4px',
            transition: 'background-color 0.15s ease'
          }}
          title="Kiến Trúc Hệ Thống"
        >
          <Layers size={22} color="#3ea6ff" />
          <span style={{ fontSize: '10px', marginTop: '6px' }}>Kiến Trúc</span>
        </button>

        <button
          onClick={() => onToggleView('admin')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '74px',
            borderRadius: '10px',
            background: activeView === 'admin' ? '#272727' : 'transparent',
            color: activeView === 'admin' ? '#ef4444' : '#aaa',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 0 6px',
            marginBottom: '4px',
            transition: 'background-color 0.15s ease'
          }}
          title="YouTube Studio"
        >
          <LayoutDashboard size={22} color={activeView === 'admin' ? '#ef4444' : '#aaa'} />
          <span style={{ fontSize: '10px', marginTop: '6px', fontWeight: activeView === 'admin' ? 600 : 400 }}>Studio</span>
        </button>

        <button
          onClick={() => onSelectCategory('ready')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '74px',
            borderRadius: '10px',
            background: selectedCategory === 'ready' ? '#272727' : 'transparent',
            color: selectedCategory === 'ready' ? '#22c55e' : '#aaa',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 0 6px',
            marginBottom: '4px',
            transition: 'background-color 0.15s ease'
          }}
          title="Video Sẵn Sàng"
        >
          <PlaySquare size={22} color={selectedCategory === 'ready' ? '#22c55e' : '#aaa'} />
          <span style={{ fontSize: '10px', marginTop: '6px' }}>HLS Video</span>
        </button>
      </aside>
    );
  }

  // Full Expanded Sidebar (YouTube standard 240px)
  return (
    <aside style={{
      position: 'fixed',
      top: '56px',
      left: 0,
      bottom: 0,
      width: '240px',
      backgroundColor: '#0f0f0f',
      overflowY: 'auto',
      padding: '0.75rem 0.65rem 2rem',
      zIndex: 40,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      scrollbarWidth: 'thin',
    }}>
      {/* Section 1: Main Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <SidebarItem
          icon={<Home size={20} />}
          label="Trang chủ"
          isActive={activeView === 'user'}
          onClick={() => onToggleView('user')}
        />
        <SidebarItem
          icon={<Activity size={20} color="#f59e0b" />}
          label="Mô Phỏng 2 Tuyến"
          isActive={activeView === 'simulator'}
          badge="3D"
          badgeColor="#d97706"
          onClick={() => onToggleView('simulator')}
        />
        <SidebarItem
          icon={<Layers size={20} color="#3ea6ff" />}
          label="Sơ Đồ Kiến Trúc"
          onClick={onOpenArchitecture}
        />
        <SidebarItem
          icon={<LayoutDashboard size={20} color="#ef4444" />}
          label="YouTube Studio"
          isActive={activeView === 'admin'}
          badge="Admin"
          badgeColor="#dc2626"
          onClick={() => onToggleView('admin')}
        />
      </div>

      {/* Section 2: Bạn (You) */}
      <div style={{ padding: '0.85rem 0 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.75rem 0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#f1f1f1' }}>
          <span>Bạn</span>
          <ChevronRight size={16} color="#aaa" />
        </div>
        <SidebarItem icon={<User size={19} />} label="Kênh của bạn" onClick={() => onToggleView('user')} />
        <SidebarItem icon={<History size={19} />} label="Video đã xem" onClick={() => onToggleView('user')} />
        <SidebarItem icon={<PlaySquare size={19} />} label="Video của bạn" onClick={() => onToggleView('user')} />
        <SidebarItem icon={<Clock size={19} />} label="Xem sau" onClick={() => onToggleView('user')} />
        <SidebarItem icon={<ThumbsUp size={19} />} label="Video đã thích" onClick={() => onToggleView('user')} />
      </div>

      {/* Section 3: Khám phá (Explore) */}
      <div style={{ padding: '0.85rem 0 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ padding: '0 0.75rem 0.5rem', fontSize: '0.92rem', fontWeight: 600, color: '#f1f1f1' }}>
          Khám phá
        </div>
        <SidebarItem icon={<Flame size={19} color="#ef4444" />} label="Thịnh hành" onClick={() => onToggleView('user')} />
        <SidebarItem icon={<Music2 size={19} color="#f59e0b" />} label="Âm nhạc" onClick={() => onToggleView('user')} />
        <SidebarItem icon={<Gamepad2 size={19} color="#3b82f6" />} label="Trò chơi" onClick={() => onToggleView('user')} />
        <SidebarItem icon={<Newspaper size={19} color="#10b981" />} label="Tin tức" onClick={() => onToggleView('user')} />
        <SidebarItem icon={<Trophy size={19} color="#a855f7" />} label="Thể thao" onClick={() => onToggleView('user')} />
      </div>

      {/* Section 4: Subscriptions Demo */}
      <div style={{ padding: '0.85rem 0 0.75rem' }}>
        <div style={{ padding: '0 0.75rem 0.5rem', fontSize: '0.92rem', fontWeight: 600, color: '#f1f1f1' }}>
          Kênh đăng ký
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          borderRadius: '10px',
          cursor: 'pointer',
          background: 'transparent',
          color: '#f1f1f1',
          fontSize: '0.86rem'
        }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
            YT
          </div>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Studio Channel</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          borderRadius: '10px',
          cursor: 'pointer',
          background: 'transparent',
          color: '#f1f1f1',
          fontSize: '0.86rem'
        }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
            SD
          </div>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>System Design VN</span>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ padding: '1rem 0.75rem 0', fontSize: '11px', color: '#717171', lineHeight: '1.6' }}>
        <p>Giới thiệu &bull; Báo chí &bull; Bản quyền</p>
        <p>Liên hệ &bull; Nhà sáng tạo &bull; Quảng cáo</p>
        <p style={{ marginTop: '0.75rem', color: '#555' }}>&copy; 2026 YouTube LLC &bull; Video HLS</p>
      </div>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive = false,
  badge,
  badgeColor = '#ef4444',
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '9px 12px',
        borderRadius: '10px',
        background: isActive ? '#272727' : 'transparent',
        color: isActive ? '#ffffff' : '#f1f1f1',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.88rem',
        fontWeight: isActive ? 600 : 400,
        textAlign: 'left',
        transition: 'background-color 0.15s ease'
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = '#272727';
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px' }}>
          {icon}
        </span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      </div>
      {badge && (
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          background: badgeColor,
          color: '#fff',
          padding: '1px 6px',
          borderRadius: '4px',
          letterSpacing: '0.4px'
        }}>
          {badge}
        </span>
      )}
    </button>
  );
};
