import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, ArrowRight, ArrowLeft, 
  CheckCircle2, Sun, Moon, Terminal, Sparkles, Eye, Layers, Target
} from 'lucide-react';

/* ============================================================
   TRUE 3D ISOMETRIC HEXAGONAL PRISM / CUBE COMPONENT
   Drawn with 3 visible faces (Top, Left Extrusion, Right Extrusion),
   crisp black strokes, drop shadow, and floating isometric badges.
============================================================ */

interface IsometricBlockProps {
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  depth?: number;
  topColor: string;
  leftColor: string;
  rightColor: string;
  strokeColor?: string;
  label: string;
  subLabel?: string;
  badge?: string;
  metric?: string;
  iconType?: 'server' | 'storage' | 'cpu' | 'cdn' | 'queue' | 'redis' | 'db' | 'lb' | 'demuxer' | 'checksum' | 'slicer' | 'handler' | 'player';
  isActive?: boolean;
  theme?: 'light' | 'dark';
}

const Isometric3DHexBlock: React.FC<IsometricBlockProps> = ({
  cx,
  cy,
  rx = 58,
  ry = 32,
  depth = 18,
  topColor,
  leftColor,
  rightColor,
  strokeColor = '#18181b',
  label,
  subLabel,
  badge,
  metric,
  iconType = 'server',
  isActive = false,
  theme = 'light',
}) => {
  // Hexagon Top Face Vertices
  const p0 = { x: cx, y: cy - ry };
  const p1 = { x: cx + rx, y: cy - ry * 0.5 };
  const p2 = { x: cx + rx, y: cy + ry * 0.5 };
  const p3 = { x: cx, y: cy + ry };
  const p4 = { x: cx - rx, y: cy + ry * 0.5 };
  const p5 = { x: cx - rx, y: cy - ry * 0.5 };

  const topPoints = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y} ${p5.x},${p5.y}`;
  const leftFacePoints = `${p4.x},${p4.y} ${p3.x},${p3.y} ${p3.x},${p3.y + depth} ${p4.x},${p4.y + depth}`;
  const rightFacePoints = `${p3.x},${p3.y} ${p2.x},${p2.y} ${p2.x},${p2.y + depth} ${p3.x},${p3.y + depth}`;

  const textColor = theme === 'light' ? '#18181b' : '#f8fafc';
  const pillBg = theme === 'light' ? '#ffffff' : '#1e293b';

  return (
    <g style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
      {/* 3D Drop Shadow on Floor */}
      <ellipse
        cx={cx}
        cy={cy + depth + 6}
        rx={rx + 4}
        ry={ry * 0.7}
        fill={theme === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.5)'}
      />

      {/* Glow aura when active */}
      {isActive && (
        <ellipse
          cx={cx}
          cy={cy + depth / 2}
          rx={rx + 12}
          ry={ry + depth / 2 + 6}
          fill="none"
          stroke={topColor}
          strokeWidth="3"
          strokeDasharray="6 4"
          opacity="0.8"
        />
      )}

      {/* Left 3D Extruded Face */}
      <polygon
        points={leftFacePoints}
        fill={leftColor}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Right 3D Extruded Face (Shadow) */}
      <polygon
        points={rightFacePoints}
        fill={rightColor}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Top Isometric Face */}
      <polygon
        points={topPoints}
        fill={topColor}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* ============================================================
          VIBRANT 3D ISOMETRIC SYSTEM DESIGN ICONS
      ============================================================ */}

      {/* 1. Storage Canister Bucket (Alex Xu S3 / Storage Style) */}
      {iconType === 'storage' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <ellipse cx="0" cy="11" rx="13" ry="3.5" fill="rgba(0,0,0,0.22)" />
          {/* Bucket Body */}
          <path
            d="M-13 -3 L-9.5 9 C-9.5 12, 9.5 12, 9.5 9 L13 -3 Z"
            fill={label.toLowerCase().includes('original') || label.toLowerCase().includes('raw') || label.toLowerCase().includes('input') ? 'url(#grad-bucket-red)' : 'url(#grad-bucket-green)'}
            stroke={strokeColor}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Bucket Top Lip */}
          <ellipse
            cx="0"
            cy="-3"
            rx="13"
            ry="4.2"
            fill={label.toLowerCase().includes('original') || label.toLowerCase().includes('raw') || label.toLowerCase().includes('input') ? '#fca5a5' : '#86efac'}
            stroke={strokeColor}
            strokeWidth="1.4"
          />
          {/* Inner Void */}
          <ellipse
            cx="0"
            cy="-3"
            rx="8.5"
            ry="2.4"
            fill={label.toLowerCase().includes('original') || label.toLowerCase().includes('raw') || label.toLowerCase().includes('input') ? '#7f1d1d' : '#14532d'}
          />
          {/* Handle */}
          <path
            d="M-14 -3 C-14 -13, 14 -13, 14 -3"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* Video Play Badge on Front */}
          <rect x="-6" y="2" width="12" height="7.5" rx="1.8" fill="#18181b" stroke="#ffffff" strokeWidth="0.8" />
          <polygon points="-2,3.5 -2,8 3,5.75" fill="#ffffff" />
        </g>
      )}

      {/* 2. CPU / GPU Microchip Transcoder with Gold Pins & Gears */}
      {iconType === 'cpu' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <rect x="-13" y="-7" width="26" height="24" rx="4" fill="rgba(0,0,0,0.22)" />
          {/* Golden Bus Pins */}
          <line x1="-15" y1="-4" x2="-12" y2="-4" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="-15" y1="2" x2="-12" y2="2" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="-15" y1="8" x2="-12" y2="8" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="12" y1="-4" x2="15" y2="-4" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="12" y1="2" x2="15" y2="2" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="12" y1="8" x2="15" y2="8" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
          {/* Silicon Chip Body */}
          <rect x="-12" y="-8" width="24" height="22" rx="3.5" fill="#18181b" stroke={strokeColor} strokeWidth="1.4" />
          {/* Gold Die Heatspreader */}
          <rect x="-8.5" y="-4.5" width="17" height="15" rx="2" fill="url(#grad-gold-chip)" stroke="#d97706" strokeWidth="1" />
          {/* Dual Gear Processing Core */}
          <circle cx="0" cy="3" r="4.8" fill="#18181b" />
          <polygon points="0,-1 1.2,1.2 3.8,0.8 2.6,3 3.8,5.2 1.2,4.8 0,7 -1.2,4.8 -3.8,5.2 -2.6,3 -3.8,0.8 -1.2,1.2" fill="#facc15" />
          <circle cx="0" cy="3" r="1.6" fill="#18181b" />
        </g>
      )}

      {/* 3. CDN Edge Cloud with Golden Lightning & Radio Broadcast */}
      {iconType === 'cdn' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <ellipse cx="0" cy="11" rx="14" ry="3.5" fill="rgba(0,0,0,0.22)" />
          {/* Radio Waves */}
          <path d="M-16 -2 A8 8 0 0 0 -16 6" fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M16 -2 A8 8 0 0 1 16 6" fill="none" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
          {/* Volumetric Cloud Body */}
          <path
            d="M-13 6 C-17 6, -18 1, -15 -2 C-16 -7, -10 -9, -7 -7 C-4 -12, 5 -12, 8 -7 C12 -7, 16 -4, 15 1 C18 3, 17 6, 13 6 Z"
            fill="url(#grad-cdn-cloud)"
            stroke={strokeColor}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Golden 3D Lightning Bolt */}
          <polygon
            points="0.5,-9 -5,-1 0,-1 -3,8 5,-2 0.5,-2 2.5,-9"
            fill="#facc15"
            stroke="#18181b"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* 4. Load Balancer 4-Way Diverging Neon Arrows */}
      {iconType === 'lb' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <rect x="-12" y="-10" width="24" height="22" rx="5" fill="url(#grad-lb-blue)" stroke={strokeColor} strokeWidth="1.4" />
          <circle cx="0" cy="1" r="2.8" fill="#ffffff" stroke={strokeColor} strokeWidth="1" />
          {/* 4 Diverging Arrows */}
          <path d="M0 -2 L0 -7 M-2 -5 L0 -7 L2 -5" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M0 4 L0 9 M-2 7 L0 9 L2 7" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-3 1 L-8 1 M-6 -1 L-8 1 L-6 3" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 1 L8 1 M6 -1 L8 1 L6 3" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* 5. Express API Server Blade Rack */}
      {iconType === 'server' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <rect x="-14" y="-11" width="28" height="23" rx="3" fill="#18181b" stroke={strokeColor} strokeWidth="1.4" />
          {/* Unit 1 */}
          <rect x="-11" y="-8.5" width="22" height="4.5" rx="1.2" fill="#334155" />
          <circle cx="-7.5" cy="-6.2" r="1.1" fill="#4ade80" />
          <circle cx="-4" cy="-6.2" r="1.1" fill="#38bdf8" />
          <line x1="2" y1="-6.2" x2="8" y2="-6.2" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
          {/* Unit 2 */}
          <rect x="-11" y="-2" width="22" height="4.5" rx="1.2" fill="#334155" />
          <circle cx="-7.5" cy="0.3" r="1.1" fill="#4ade80" />
          <circle cx="-4" cy="0.3" r="1.1" fill="#fbbf24" />
          <line x1="2" y1="0.3" x2="8" y2="0.3" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
          {/* Unit 3 */}
          <rect x="-11" y="4.5" width="22" height="4.5" rx="1.2" fill="#334155" />
          <circle cx="-7.5" cy="6.8" r="1.1" fill="#4ade80" />
          <circle cx="-4" cy="6.8" r="1.1" fill="#4ade80" />
          <line x1="2" y1="6.8" x2="8" y2="6.8" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
        </g>
      )}

      {/* 6. Triple Mail Envelopes Completion Queue (Alex Xu Style) */}
      {iconType === 'queue' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          {/* Envelope 1 */}
          <g transform="translate(-7, -4)">
            <rect x="-5" y="-3.5" width="10" height="7" rx="1" fill="#ddd6fe" stroke={strokeColor} strokeWidth="1" />
            <path d="M-5 -3.5 L0 0.5 L5 -3.5" fill="none" stroke="#7c3aed" strokeWidth="1" />
          </g>
          {/* Envelope 2 */}
          <g transform="translate(7, -4)">
            <rect x="-5" y="-3.5" width="10" height="7" rx="1" fill="#ddd6fe" stroke={strokeColor} strokeWidth="1" />
            <path d="M-5 -3.5 L0 0.5 L5 -3.5" fill="none" stroke="#7c3aed" strokeWidth="1" />
          </g>
          {/* Envelope 3 */}
          <g transform="translate(0, 2)">
            <rect x="-10" y="-6" width="20" height="12" rx="1.5" fill="url(#grad-queue-purple)" stroke={strokeColor} strokeWidth="1.3" />
            <polygon points="-10,-6 0,0 10,-6" fill="#f3e8ff" stroke={strokeColor} strokeWidth="1" />
            <path d="M-10 6 L-3.5 0 M10 6 L3.5 0" stroke="#7c3aed" strokeWidth="1" />
          </g>
        </g>
      )}

      {/* 7. Redis 3-Tier Ruby In-Memory Cache with Golden Bolt */}
      {iconType === 'redis' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <rect x="-12" y="6" width="24" height="5" rx="2" fill="#7f1d1d" stroke={strokeColor} strokeWidth="1.2" />
          <rect x="-13" y="0.5" width="26" height="5" rx="2" fill="#b91c1c" stroke={strokeColor} strokeWidth="1.2" />
          <rect x="-14" y="-5" width="28" height="5" rx="2" fill="url(#grad-redis-ruby)" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="1,-9 -4,-3 0,-3 -2,4 5,-2 1,-2 3,-9" fill="#facc15" stroke={strokeColor} strokeWidth="0.9" />
        </g>
      )}

      {/* 8. 3-Tier Metallic Cylindrical Database Disks */}
      {iconType === 'db' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <ellipse cx="0" cy="8.5" rx="12" ry="3.2" fill="#1e3a8a" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M-12 5 V8.5 C-12 11 12 11 12 8.5 V5" fill="#1e40af" stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="-6.5" cy="7.5" r="1.1" fill="#4ade80" />
          <path d="M-12 0.5 V4 C-12 6.5 12 6.5 12 4 V0.5" fill="#2563eb" stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="-6.5" cy="3" r="1.1" fill="#38bdf8" />
          <path d="M-12 -4 V-0.5 C-12 2 12 2 12 -0.5 V-4" fill="#3b82f6" stroke={strokeColor} strokeWidth="1.2" />
          <ellipse cx="0" cy="-4" rx="12" ry="3.2" fill="#93c5fd" stroke={strokeColor} strokeWidth="1.2" />
          <circle cx="-6.5" cy="-1.5" r="1.1" fill="#4ade80" />
        </g>
      )}

      {/* 9. Completion Handler Automation Engine */}
      {iconType === 'handler' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <rect x="-13" y="-9" width="26" height="21" rx="4" fill="url(#grad-handler-violet)" stroke={strokeColor} strokeWidth="1.4" />
          <circle cx="-3" cy="1.5" r="5" fill="#3b0764" stroke="#c084fc" strokeWidth="1.2" />
          <circle cx="6" cy="-2" r="5" fill="#22c55e" stroke={strokeColor} strokeWidth="1.2" />
          <path d="M3.5 -2 L5.5 0 L8.5 -4" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* 10. Optical Prism Demuxer */}
      {iconType === 'demuxer' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <polygon points="0,-10 -11,7 11,7" fill="url(#grad-demux-prism)" stroke={strokeColor} strokeWidth="1.4" />
          <line x1="-15" y1="-1" x2="-3" y2="-1" stroke="#ffffff" strokeWidth="1.8" />
          <line x1="3" y1="-3" x2="14" y2="-7" stroke="#f472b6" strokeWidth="1.8" />
          <line x1="3" y1="1" x2="14" y2="5" stroke="#38bdf8" strokeWidth="1.8" />
        </g>
      )}

      {/* 11. Checksum Security Shield */}
      {iconType === 'checksum' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <path d="M0 -11 L10 -7 V1 C10 7 0 11 0 11 C0 11 -10 7 -10 1 V-7 Z" fill="#facc15" stroke={strokeColor} strokeWidth="1.4" />
          <path d="M-4 0 L-1 3 L5 -3" fill="none" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* 12. Chunk Slicer & Buffer */}
      {iconType === 'slicer' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <rect x="-13" y="-5" width="7.5" height="11" rx="1.5" fill="#38bdf8" stroke={strokeColor} strokeWidth="1.2" />
          <rect x="-3.5" y="-5" width="7.5" height="11" rx="1.5" fill="#f59e0b" stroke={strokeColor} strokeWidth="1.2" />
          <rect x="6" y="-5" width="7.5" height="11" rx="1.5" fill="#22c55e" stroke={strokeColor} strokeWidth="1.2" />
          <line x1="-15" y1="-8" x2="15" y2="-8" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
        </g>
      )}

      {/* 13. ABR Player & HD Video Screen */}
      {iconType === 'player' && (
        <g transform={`translate(${cx}, ${cy - 12})`}>
          <rect x="-13" y="-9" width="26" height="18" rx="2.5" fill="#18181b" stroke="#38bdf8" strokeWidth="1.3" />
          <polygon points="-6,-3 -6,3 0,0" fill="#ef4444" />
          <rect x="3" y="1" width="2" height="4" fill="#4ade80" />
          <rect x="6.5" y="-1" width="2" height="6" fill="#4ade80" />
          <rect x="10" y="-4" width="2" height="9" fill="#4ade80" />
        </g>
      )}

      {/* Main Label on Top Face */}
      <text
        x={cx}
        y={cy + 7}
        textAnchor="middle"
        fontSize="9.2"
        fontWeight="800"
        fill={textColor}
        fontFamily="inherit"
      >
        {label}
      </text>

      {subLabel && (
        <text
          x={cx}
          y={cy + 19}
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="600"
          fill={theme === 'light' ? '#44403c' : '#94a3b8'}
          fontFamily="inherit"
        >
          {subLabel}
        </text>
      )}

      {/* Floating 3D Pill Badge Above Node (Unified Single Non-Colliding Pill) */}
      {(badge || metric) && (
        <g transform={`translate(${cx}, ${cy - ry - 12})`}>
          <rect
            x={-(Math.max(78, Math.min(142, ((badge && metric ? `${badge} • ${metric}` : badge || metric || '').length * 6.8 + 20))) / 2)}
            y="-9.5"
            width={Math.max(78, Math.min(142, ((badge && metric ? `${badge} • ${metric}` : badge || metric || '').length * 6.8 + 20)))}
            height="19"
            rx="9.5"
            fill={pillBg}
            stroke={strokeColor}
            strokeWidth="1.3"
          />
          {metric && (
            <circle
              cx={-(Math.max(78, Math.min(142, ((badge && metric ? `${badge} • ${metric}` : badge || metric || '').length * 6.8 + 20))) / 2) + 10}
              cy="0"
              r="2.5"
              fill="#22c55e"
            />
          )}
          <text
            x={metric ? "5" : "0"}
            y="3.5"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill={textColor}
          >
            {badge && metric ? `${badge} • ${metric}` : badge || metric}
          </text>
        </g>
      )}
    </g>
  );
};

/* ============================================================
   3D ISOMETRIC CLIENT PLATFORM (Bàn cờ nghiêng với các User Pawns)
============================================================ */

const IsometricClientPlatform: React.FC<{ 
  cx: number; 
  cy: number; 
  theme: 'light' | 'dark';
  label?: string;
  badge?: string;
}> = ({ cx, cy, theme, label = '👥 100.000 người dùng', badge = 'User / Client' }) => {
  const w = 150;
  const h = 76;
  const depth = 16;
  const strokeColor = '#18181b';

  const p0 = { x: cx, y: cy - h * 0.5 };
  const p1 = { x: cx + w * 0.5, y: cy };
  const p2 = { x: cx, y: cy + h * 0.5 };
  const p3 = { x: cx - w * 0.5, y: cy };

  const topPoints = `${p0.x},${p0.y} ${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  const leftFace = `${p3.x},${p3.y} ${p2.x},${p2.y} ${p2.x},${p2.y + depth} ${p3.x},${p3.y + depth}`;
  const rightFace = `${p2.x},${p2.y} ${p1.x},${p1.y} ${p1.x},${p1.y + depth} ${p2.x},${p2.y + depth}`;

  // Pawns colors
  const pawnColors = ['#f87171', '#fbbf24', '#38bdf8', '#4ade80', '#c084fc', '#f472b6', '#38bdf8', '#fbbf24'];

  return (
    <g>
      {/* Floor drop shadow */}
      <ellipse
        cx={cx}
        cy={cy + depth + 6}
        rx={w * 0.5 + 4}
        ry={h * 0.35}
        fill={theme === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.5)'}
      />

      {/* Extruded Left Wall */}
      <polygon
        points={leftFace}
        fill={theme === 'light' ? '#d4d4d8' : '#334155'}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Extruded Right Wall */}
      <polygon
        points={rightFace}
        fill={theme === 'light' ? '#a1a1aa' : '#1e293b'}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Top Isometric Grid Plane */}
      <polygon
        points={topPoints}
        fill={theme === 'light' ? '#f4f4f5' : '#475569'}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Isometric Grid Lines */}
      <line x1={cx - w * 0.25} y1={cy - h * 0.25} x2={cx + w * 0.25} y2={cy + h * 0.25} stroke={theme === 'light' ? '#e4e4e7' : '#64748b'} strokeWidth="1" />
      <line x1={cx - w * 0.25} y1={cy + h * 0.25} x2={cx + w * 0.25} y2={cy - h * 0.25} stroke={theme === 'light' ? '#e4e4e7' : '#64748b'} strokeWidth="1" />

      {/* 3D Isometric Retina MacBook Laptop on Platform */}
      <g transform={`translate(${cx - 24}, ${cy - 8})`}>
        {/* Floor Shadow */}
        <ellipse cx="0" cy="14" rx="16" ry="4.5" fill="rgba(0,0,0,0.22)" />
        {/* Base Keyboard Platform */}
        <polygon points="-16,7 0,15 16,7 0,-1" fill="#e2e8f0" stroke={strokeColor} strokeWidth="1.2" />
        <polygon points="-12,6 0,12 12,6 0,0" fill="#0f172a" />
        {/* Trackpad */}
        <polygon points="-4,9 0,11 4,9 0,7" fill="#cbd5e1" />
        {/* Tilted Display Lid */}
        <polygon points="-16,7 -16,-9 0,-17 0,-1" fill="#18181b" stroke={strokeColor} strokeWidth="1.2" />
        {/* Glowing Screen with Video Player */}
        <polygon points="-14,5 -14,-7 -2,-13 -2,-1" fill="#0284c7" />
        {/* Red YouTube Play Badge on Screen */}
        <rect x="-10" y="-6" width="6" height="4" rx="1" fill="#ef4444" />
        <polygon points="-8,-5 -8,-3 -5,-4" fill="#ffffff" />
      </g>

      {/* User Pawns standing on the platform */}
      {pawnColors.map((color, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const px = cx + 8 + col * 12 + (row % 2) * 6;
        const py = cy - 14 + row * 16 - (col % 2) * 4;

        return (
          <g key={i}>
            {/* Pawn shadow */}
            <ellipse cx={px} cy={py + 3} rx="4" ry="1.8" fill="rgba(0,0,0,0.2)" />
            {/* Pawn body */}
            <path
              d={`M${px - 3.5} ${py + 2} L${px} ${py - 6} L${px + 3.5} ${py + 2} Z`}
              fill={color}
              stroke={strokeColor}
              strokeWidth="1"
            />
            {/* Pawn head */}
            <circle cx={px} cy={py - 8} r="3" fill="#ffffff" stroke={strokeColor} strokeWidth="1" />
          </g>
        );
      })}

      {/* Floating 3D Badge on Bottom */}
      <g transform={`translate(${cx}, ${cy + h * 0.5 + depth + 14})`}>
        <rect
          x="-65"
          y="-10"
          width="130"
          height="20"
          rx="10"
          fill={theme === 'light' ? '#ffffff' : '#1e293b'}
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="9"
          fontWeight="800"
          fill={theme === 'light' ? '#18181b' : '#f8fafc'}
        >
          {label}
        </text>
      </g>

      {/* Floating Header Badge */}
      <g transform={`translate(${cx}, ${cy - h * 0.5 - 12})`}>
        <rect
          x="-48"
          y="-9"
          width="96"
          height="18"
          rx="9"
          fill={theme === 'light' ? '#fee2e2' : '#7f1d1d'}
          stroke={strokeColor}
          strokeWidth="1.4"
        />
        <circle cx="-34" cy="0" r="3" fill="#ef4444" />
        <text
          x="4"
          y="3.5"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="800"
          fill={theme === 'light' ? '#991b1b' : '#fecaca'}
        >
          {badge}
        </text>
      </g>
    </g>
  );
};

/* ============================================================
   DATA TYPES & INTERFACES FOR SCENARIOS & DEEP DIVES
============================================================ */

export type ScenarioId = 
  | 'overview' 
  | 'deep_upload' 
  | 'deep_transcode' 
  | 'deep_cache' 
  | 'deep_completion' 
  | 'deep_streaming';

export interface InspectorPayload {
  type: 'http' | 'redis' | 'ffmpeg' | 'hls' | 'event';
  title: string;
  badge: string;
  badgeColor: string;
  latency?: string;
  content: string;
}

export interface StepDefinition {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  insight: string;
  changes: { label: string; from: string; to: string }[];
  takeaways: string[];
  activeNodes: string[];
  activeConnections: string[];
  packetType?: 'upload' | 'meta' | 'worker' | 'cdn' | 'completion';
  inspector?: InspectorPayload;
}

export interface NodeDefinition {
  id: string;
  isPlatform?: boolean;
  platformLabel?: string;
  platformBadge?: string;
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  depth?: number;
  topColor: string;
  leftColor: string;
  rightColor: string;
  label: string;
  subLabel?: string;
  badge?: string;
  metric?: string;
  iconType?: 'server' | 'storage' | 'cpu' | 'cdn' | 'queue' | 'redis' | 'db' | 'lb' | 'demuxer' | 'checksum' | 'slicer' | 'handler' | 'player';
}

export interface ConnectionDefinition {
  id: string;
  pathD: string;
  packetColor?: string;
  strokeWidth?: number;
  speed?: string;
}

export interface SimulationScenario {
  id: ScenarioId;
  menuTitle: string;
  badgeNumber: string;
  title: string;
  category: string;
  tagline: string;
  badgeRed: string;
  badgeBlue: string;
  metrics: { label: string; value: string; color?: string }[];
  nodes: NodeDefinition[];
  connections: ConnectionDefinition[];
  steps: StepDefinition[];
}

/* ============================================================
   SCENARIO 1: OVERVIEW (Kiến Trúc Hai Tuyến Tổng Quan)
============================================================ */
const SCENARIO_OVERVIEW: SimulationScenario = {
  id: 'overview',
  menuTitle: '1. Kiến Trúc 2 Tuyến (Tổng Quan)',
  badgeNumber: 'BÀI 1',
  category: '01. KIẾN TRÚC TỔNG THỂ',
  title: 'Phân Tách Video Data Path vs Metadata Path',
  tagline: 'Tách biệt đường truyền tệp nhị phân nặng khỏi API điều khiển siêu nhẹ qua Redis và CDN.',
  badgeRed: '🔴 VIDEO DATA PATH (Xử lý tệp nhị phân nặng)',
  badgeBlue: '🔵 METADATA PATH (API điều khiển siêu nhẹ)',
  metrics: [
    { label: '👥 NGƯỜI DÙNG', value: '100.000 CCU' },
    { label: '⚡ THÔNG LƯỢNG API', value: '11.934 RPS', color: '#16a34a' },
    { label: '⏱️ ĐỘ TRỄ P95', value: '7.8 ms', color: '#0284c7' },
    { label: '🟢 CDN HIT RATE', value: '98.2%', color: '#16a34a' },
    { label: '💚 SERVER KHỎE', value: '4 / 4', color: '#16a34a' }
  ],
  nodes: [
    {
      id: 'client',
      isPlatform: true,
      cx: 120,
      cy: 280,
      platformLabel: '👥 100.000 người dùng',
      platformBadge: 'User / Client',
      topColor: '', leftColor: '', rightColor: '', label: ''
    },
    {
      id: 'orig-storage',
      cx: 370,
      cy: 100,
      topColor: '#fecaca',
      leftColor: '#ef4444',
      rightColor: '#b91c1c',
      label: 'Original Storage',
      subLabel: 'UUID MP4 files',
      badge: 'Chờ mã hóa • Tệp gốc',
      iconType: 'storage'
    },
    {
      id: 'transcoder',
      cx: 600,
      cy: 100,
      topColor: '#fef08a',
      leftColor: '#eab308',
      rightColor: '#a16207',
      label: 'Transcoding Servers',
      subLabel: '360p • 720p HLS',
      badge: '4 đang chạy • 52% GPU',
      iconType: 'cpu'
    },
    {
      id: 'trans-storage',
      cx: 830,
      cy: 100,
      topColor: '#bbf7d0',
      leftColor: '#22c55e',
      rightColor: '#15803d',
      label: 'Transcoded Storage',
      subLabel: '.m3u8 & .ts chunks',
      badge: 'Sẵn sàng CDN • HLS',
      iconType: 'storage'
    },
    {
      id: 'cdn',
      cx: 830,
      cy: 255,
      topColor: '#bfdbfe',
      leftColor: '#3b82f6',
      rightColor: '#1d4ed8',
      label: 'CDN Edge Cache',
      subLabel: 'SGN-Edge PoP',
      badge: 'HIT: 98.2% • 148 MB/s',
      iconType: 'cdn'
    },
    {
      id: 'api',
      cx: 370,
      cy: 385,
      topColor: '#bae6fd',
      leftColor: '#0ea5e9',
      rightColor: '#0369a1',
      label: 'Express API Server',
      subLabel: 'Port 3100 Node.js',
      badge: '11.9k RPS • HTTP 202',
      iconType: 'server'
    },
    {
      id: 'queue',
      cx: 580,
      cy: 215,
      topColor: '#fed7aa',
      leftColor: '#f97316',
      rightColor: '#c2410c',
      label: 'Transcode Queue',
      subLabel: 'Concurrency = 1',
      badge: 'Van điều tiết FIFO',
      iconType: 'queue'
    },
    {
      id: 'redis',
      cx: 580,
      cy: 325,
      topColor: '#fed7aa',
      leftColor: '#ef4444',
      rightColor: '#991b1b',
      label: 'Redis Cache',
      subLabel: 'status:id (38k RPS)',
      badge: 'Cache HIT: 0.8ms',
      iconType: 'redis'
    },
    {
      id: 'sqlite',
      cx: 580,
      cy: 435,
      topColor: '#e2e8f0',
      leftColor: '#64748b',
      rightColor: '#334155',
      label: 'SQLite DB',
      subLabel: 'WAL Mode • Persistent',
      badge: 'Bền vững ACID',
      iconType: 'db'
    },
    {
      id: 'completion-queue',
      cx: 730,
      cy: 215,
      topColor: '#e9d5ff',
      leftColor: '#a855f7',
      rightColor: '#6b21a8',
      label: 'Completion Queue',
      subLabel: 'Sự kiện hoàn tất',
      badge: 'ACK tin cậy',
      iconType: 'queue'
    },
    {
      id: 'completion-handler',
      cx: 730,
      cy: 385,
      topColor: '#ddd6fe',
      leftColor: '#8b5cf6',
      rightColor: '#5b21b6',
      label: 'Completion Handler',
      subLabel: 'Cập nhật DB & Cache',
      badge: 'Xử lý hậu kỳ',
      iconType: 'handler'
    }
  ],
  connections: [
    { id: 'conn-client-orig', pathD: 'M 180 270 C 240 270, 300 100, 370 100', packetColor: '#ef4444' },
    { id: 'conn-orig-worker', pathD: 'M 425 100 L 545 100', packetColor: '#f59e0b' },
    { id: 'conn-worker-transstorage', pathD: 'M 655 100 L 775 100', packetColor: '#22c55e' },
    { id: 'conn-cdn-transstorage', pathD: 'M 830 135 L 830 220', packetColor: '#3b82f6' },
    { id: 'conn-client-cdn', pathD: 'M 775 255 C 560 300, 360 275, 190 275', packetColor: '#22c55e' },
    { id: 'conn-client-api', pathD: 'M 180 310 C 240 330, 290 385, 315 385', packetColor: '#38bdf8' },
    { id: 'conn-api-queue', pathD: 'M 425 370 C 470 330, 500 220, 525 215', packetColor: '#f59e0b' },
    { id: 'conn-queue-worker', pathD: 'M 580 185 L 590 135', packetColor: '#f59e0b' },
    { id: 'conn-api-redis', pathD: 'M 425 385 C 480 360, 500 330, 525 325', packetColor: '#ef4444' },
    { id: 'conn-api-db', pathD: 'M 425 395 C 480 415, 500 435, 525 435', packetColor: '#64748b' },
    { id: 'conn-worker-cq', pathD: 'M 650 130 C 680 160, 700 190, 710 195', packetColor: '#a855f7' },
    { id: 'conn-cq-handler', pathD: 'M 730 245 L 730 355', packetColor: '#a855f7' },
    { id: 'conn-handler-db', pathD: 'M 675 395 L 635 425', packetColor: '#64748b' },
    { id: 'conn-handler-redis', pathD: 'M 675 375 L 635 335', packetColor: '#ef4444' }
  ],
  steps: [
    {
      id: 1,
      title: 'Khởi Tạo Hai Đường Dữ Liệu Song Song',
      subtitle: 'Tách rời luồng tệp Video nặng khỏi luồng JSON Metadata',
      desc: 'Khi người dùng tải video lên, hệ thống tách thành 2 luồng độc lập: tệp nhị phân được chuyển qua Video Data Path (Original Storage), trong khi thông tin mô tả được gửi qua Metadata Path (API Servers).',
      insight: 'Nếu gộp chung luồng tải video vào API Server, tiến trình mã hóa sẽ chiếm dụng toàn bộ CPU và Socket kết nối, khiến các API đọc/ghi khác bị treo nghẽn.',
      changes: [
        { label: 'Video Data Path', from: 'Không tách rời', to: 'Lưu thẳng vào Storage' },
        { label: 'Metadata Path', from: 'Xử lý đồng bộ', to: 'Gửi API điều khiển nhẹ' },
        { label: 'CPU API Server', from: 'Quá tải 100%', to: 'Nhàn rỗi < 8%' }
      ],
      takeaways: [
        'Tách biệt luồng xử lý giúp mở rộng độc lập từng thành phần (Independent Scalability).',
        'API Server hoàn toàn không bị tắc nghẽn I/O bởi các tệp dung lượng lớn.'
      ],
      activeNodes: ['client', 'orig-storage', 'api'],
      activeConnections: ['conn-client-orig', 'conn-client-api'],
      packetType: 'upload',
      inspector: {
        type: 'http',
        title: 'POST /api/upload (Metadata Header)',
        badge: 'HTTP 200 Multi-stream',
        badgeColor: '#0284c7',
        latency: '18ms',
        content: `POST /api/upload HTTP/1.1\nHost: api.youtube.local\nContent-Type: multipart/form-data; boundary=----WebKitFormBoundary\n\n------WebKitFormBoundary\nContent-Disposition: form-data; name="title"\n\nVideo Hướng Dẫn System Design HLS\n------WebKitFormBoundary\nContent-Disposition: form-data; name="video"; filename="source_4k.mp4"`
      }
    },
    {
      id: 2,
      title: 'Tiếp Nhận Bất Đồng Bộ (HTTP 202 Accepted)',
      subtitle: 'Giải phóng kết nối Client trong vòng ~18ms, lưu trạng thái vào Redis',
      desc: 'API Server tạo bản ghi video với trạng thái QUEUED trong SQLite, lưu hash trạng thái vào Redis, đẩy task vào hàng đợi ngầm và trả ngay mã HTTP 202 Accepted về cho Client.',
      insight: 'Không bao giờ chạy transcode đồng bộ trong request upload. Với HTTP 202, Client nhận phản hồi tức thì và dùng cơ chế Polling để nhận tiến trình.',
      changes: [
        { label: 'Mã phản hồi HTTP', from: '200 OK (Chờ xong)', to: '202 Accepted (Tức thì)' },
        { label: 'Thời gian phản hồi', from: '> 30.000 ms (Timeout)', to: '18 ms' },
        { label: 'Trạng thái bản ghi', from: 'Chưa có', to: 'QUEUED trong DB & Redis' }
      ],
      takeaways: [
        'HTTP 202 Accepted báo cho client: yêu cầu đã được nhận và đang xử lý ngầm.',
        'Redis Cache hấp thụ các request polling trạng thái tiếp theo.'
      ],
      activeNodes: ['api', 'redis', 'sqlite', 'queue'],
      activeConnections: ['conn-api-redis', 'conn-api-db', 'conn-api-queue'],
      packetType: 'meta',
      inspector: {
        type: 'http',
        title: 'HTTP Response: 202 Accepted',
        badge: 'Status: 202 Async',
        badgeColor: '#16a34a',
        latency: '7.8ms',
        content: `HTTP/1.1 202 Accepted\nContent-Type: application/json; charset=utf-8\nETag: W/"9f-b7a48"\n\n{\n  "success": true,\n  "videoId": "v-yt-9182",\n  "status": "QUEUED",\n  "pollUrl": "/api/videos/v-yt-9182/status",\n  "message": "Video queued for background transcoding"\n}`
      }
    },
    {
      id: 3,
      title: 'Hàng Đợi Điều Phối & Worker Rút Tác Vụ',
      subtitle: 'Transcode Queue kiểm soát tải và ngăn cản sập máy chủ',
      desc: 'Transcode Queue xếp hàng các video theo thứ tự FIFO. FFmpeg Transcoder Worker khi có luồng rảnh sẽ rút task ra để xử lý độc lập.',
      insight: 'Hàng đợi đóng vai trò như chiếc van giảm áp, cho phép hệ thống chịu được lưu lượng đột biến mà không bị sập worker.',
      changes: [
        { label: 'Hàng đợi Transcode', from: '0 task', to: '1 task đang chạy' },
        { label: 'Trạng thái Worker', from: 'IDLE', to: 'Đang mã hóa đa độ phân giải' },
        { label: 'Tiến độ trên Redis', from: 'QUEUED', to: 'PROCESSING (15%)' }
      ],
      takeaways: [
        'Hàng đợi bảo vệ tài nguyên tính toán (CPU/GPU) không bị cạn kiệt.',
        'Worker được mở rộng linh hoạt theo số lượng node khả dụng.'
      ],
      activeNodes: ['queue', 'transcoder', 'orig-storage'],
      activeConnections: ['conn-queue-worker', 'conn-orig-worker'],
      packetType: 'worker',
      inspector: {
        type: 'redis',
        title: 'Queue Pop Task: BullMQ / Redis Key',
        badge: 'Job Picked',
        badgeColor: '#f59e0b',
        latency: '1.2ms',
        content: `LPUSH bull:transcode:jobs '{"jobId":"j-41","videoId":"v-yt-9182","source":"/storage/orig/v-yt-9182.mp4"}'\nRPOPLPUSH bull:transcode:jobs bull:transcode:active\n\nWorker assigned: ffmpeg-node-01 (concurrency: 1)`
      }
    },
    {
      id: 4,
      title: 'FFmpeg Transcoding Đa Độ Phân Giải (HLS)',
      subtitle: 'Chuyển đổi MP4 sang Master Playlist và các lát cắt .ts phân đoạn',
      desc: 'Worker tiến hành mã hóa song song 2 luồng chất lượng 720p HD và 360p SD, chia video thành các đoạn 6 giây (.ts) và tạo file index master.m3u8.',
      insight: 'Mã hóa HLS đa độ phân giải cho phép người xem tự động thích ứng với tốc độ mạng (Adaptive Bitrate Streaming - ABR).',
      changes: [
        { label: 'Định dạng Video', from: 'MP4 đơn lẻ', to: 'HLS (.m3u8 + .ts segments)' },
        { label: 'Phân giải hỗ trợ', from: 'Chỉ có bản gốc', to: '360p (800k) & 720p (2500k)' },
        { label: 'Vị trí lưu trữ', from: 'Original Storage', to: 'Transcoded Storage' }
      ],
      takeaways: [
        'Adaptive Bitrate (ABR) loại bỏ hiện tượng giật lag khi đường truyền yếu.',
        'Các phân đoạn .ts nhỏ 6s rất dễ cache trên CDN Edge.'
      ],
      activeNodes: ['transcoder', 'trans-storage'],
      activeConnections: ['conn-worker-transstorage'],
      packetType: 'worker',
      inspector: {
        type: 'ffmpeg',
        title: 'FFmpeg Multi-Variant Transcode Command',
        badge: 'Encoding 720p & 360p',
        badgeColor: '#eab308',
        latency: '348ms',
        content: `ffmpeg -i /storage/orig/v-yt-9182.mp4 \\\n  -map 0:v:0 -map 0:a:0 -b:v:0 2500k -s:v:0 1280x720 -profile:v:0 main \\\n  -map 0:v:0 -map 0:a:0 -b:v:1 800k  -s:v:1 640x360  -profile:v:1 baseline \\\n  -f hls -hls_time 6 -hls_playlist_type vod \\\n  -master_pl_name master.m3u8 /storage/trans/v-yt-9182/stream_%v.m3u8`
      }
    },
    {
      id: 5,
      title: 'Bắn Sự Kiện Hoàn Tất (Completion Pipeline)',
      subtitle: 'Worker thông báo qua Completion Queue để Handler cập nhật DB & Cache',
      desc: 'Sau khi kiểm tra toàn bộ file HLS đã nằm an toàn trên đĩa, Worker gửi sự kiện thành công vào Completion Queue. Completion Handler nhận sự kiện và cập nhật trạng thái video sang READY trong SQLite và Redis.',
      insight: 'Chỉ đánh dấu READY khi xác thực tệp thành công. Client đang poll sẽ lập tức nhận được trạng thái READY và lấy link master.m3u8.',
      changes: [
        { label: 'Trạng thái Video', from: 'PROCESSING', to: 'READY' },
        { label: 'Cache Redis', from: 'Tiến trình 99%', to: 'READY (TTL 1 giờ)' },
        { label: 'Tổng thời gian E2E', from: 'Đang chạy', to: '576 ms hoàn tất' }
      ],
      takeaways: [
        'Completion Queue đảm bảo đồng bộ trạng thái tin cậy giữa Worker và API.',
        'Redis cache được cập nhật ngay lập tức cho các truy vấn của Client.'
      ],
      activeNodes: ['transcoder', 'completion-queue', 'completion-handler', 'sqlite', 'redis'],
      activeConnections: ['conn-worker-cq', 'conn-cq-handler', 'conn-handler-db', 'conn-handler-redis'],
      packetType: 'completion',
      inspector: {
        type: 'event',
        title: 'Completion Event Message Payload',
        badge: 'TRANSCODE_COMPLETE',
        badgeColor: '#a855f7',
        latency: '3.4ms',
        content: `{\n  "event": "TRANSCODE_FINISHED",\n  "videoId": "v-yt-9182",\n  "qualities": ["360p", "720p"],\n  "masterPlaylist": "/hls/v-yt-9182/master.m3u8",\n  "segmentCount": 14,\n  "duration": 84.2,\n  "timestamp": 1732274400000\n}`
      }
    },
    {
      id: 6,
      title: 'Phân Phối & Phát Trực Tuyến Qua CDN Edge',
      subtitle: 'Người xem stream video trực tiếp từ CDN Edge Cache, không tải lên Server gốc',
      desc: 'Khi người xem bấm Play, hls.js nhận link master.m3u8 và gửi yêu cầu tải các segment .ts từ CDN Edge Node. Lượt đầu là Cache MISS, mọi lượt xem sau là Cache HIT với thông lượng 148 MB/s.',
      insight: 'Nhờ CDN Edge, máy chủ Origin chỉ chịu tải < 1% (khi có cache MISS). 99% lượng tải video được hấp thụ tại biên mạng.',
      changes: [
        { label: 'Điểm phục vụ', from: 'Origin Server', to: 'CDN Edge Node (SGN-01)' },
        { label: 'Tỉ lệ Cache HIT', from: '0%', to: '> 95%' },
        { label: 'Băng thông Streaming', from: 'Giới hạn ở Server', to: '148.31 MB/s mượt mà' }
      ],
      takeaways: [
        'HLS video segment là dữ liệu tĩnh, cực kỳ tối ưu cho việc cache tại CDN.',
        'Hệ thống mở rộng phục vụ hàng chục nghìn người xem cùng lúc dễ dàng.'
      ],
      activeNodes: ['client', 'cdn', 'trans-storage'],
      activeConnections: ['conn-client-cdn', 'conn-cdn-transstorage'],
      packetType: 'cdn',
      inspector: {
        type: 'hls',
        title: 'GET /hls/v-yt-9182/master.m3u8 (CDN Edge HIT)',
        badge: 'HTTP 200 (Cache HIT)',
        badgeColor: '#16a34a',
        latency: '3.2ms',
        content: `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720\nstream_720p.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\nstream_360p.m3u8\n\nX-Cache: HIT from SGN-Edge-01\nAge: 1243\nContent-Type: application/vnd.apple.mpegurl`
      }
    }
  ]
};

/* ============================================================
   SCENARIO 2: DEEP DIVE UPLOAD CHUNKING (Upload Phân Mảnh)
============================================================ */
const SCENARIO_DEEP_UPLOAD: SimulationScenario = {
  id: 'deep_upload',
  menuTitle: '2. Đi Sâu: Upload Phân Mảnh (Chunks)',
  badgeNumber: 'BÀI 2',
  category: '02. MỞ RỘNG I/O & TẢI TỆP',
  title: 'Cơ Chế Phân Đoạn & Tự Phục Hồi Khi Rớt Mạng (Resumable Chunks)',
  tagline: 'Cắt nhỏ file 2GB thành các khối 5MB, upload song song qua Pre-signed URL, tự retry chunk lỗi.',
  badgeRed: '📦 CHUNK STREAMING (Tách khối nhị phân 5MB)',
  badgeBlue: '🛡️ INTEGRITY VERIFICATION (SHA-256 Checksum)',
  metrics: [
    { label: '📁 KÍCH THƯỚC FILE', value: '2.14 GB' },
    { label: '🧩 KÍCH THƯỚC CHUNK', value: '5 MB / chunk (428 chunks)', color: '#0284c7' },
    { label: '🔄 KHẢ NĂNG RESUME', value: '100% không mất tệp', color: '#16a34a' },
    { label: '⏱️ THỜI GIAN RETRY', value: '0.6 s (chỉ tải chunk hỏng)', color: '#16a34a' }
  ],
  nodes: [
    {
      id: 'client-slicer',
      isPlatform: true,
      cx: 120,
      cy: 280,
      platformLabel: 'Chunk Slicer (Blob.slice)',
      platformBadge: 'Client Browser',
      topColor: '', leftColor: '', rightColor: '', label: ''
    },
    {
      id: 'upload-controller',
      cx: 370,
      cy: 390,
      topColor: '#bae6fd',
      leftColor: '#0ea5e9',
      rightColor: '#0369a1',
      label: 'Upload Controller',
      subLabel: 'Cấp Pre-signed URL',
      badge: 'Phiên: #ses-891',
      iconType: 'server'
    },
    {
      id: 'chunk-buffer',
      cx: 370,
      cy: 130,
      topColor: '#fecaca',
      leftColor: '#ef4444',
      rightColor: '#b91c1c',
      label: 'Chunk Temp Buffer',
      subLabel: '/tmp/chunks/upload-891',
      badge: 'Nhận 3 luồng đồng thời',
      iconType: 'slicer'
    },
    {
      id: 'redis-session',
      cx: 600,
      cy: 390,
      topColor: '#fed7aa',
      leftColor: '#ef4444',
      rightColor: '#991b1b',
      label: 'Session State (Redis)',
      subLabel: 'BitMap: received_chunks',
      badge: '427/428 hoàn tất',
      iconType: 'redis'
    },
    {
      id: 'checksum-validator',
      cx: 610,
      cy: 130,
      topColor: '#fef08a',
      leftColor: '#eab308',
      rightColor: '#a16207',
      label: 'Checksum Validator',
      subLabel: 'SHA-256 Block Match',
      badge: 'Hash: 0x9f8c... OK',
      iconType: 'checksum'
    },
    {
      id: 'merged-storage',
      cx: 840,
      cy: 130,
      topColor: '#bbf7d0',
      leftColor: '#22c55e',
      rightColor: '#15803d',
      label: 'Original Storage',
      subLabel: 'Merged source.mp4 (2.1GB)',
      badge: 'Toàn vẹn 100%',
      iconType: 'storage'
    }
  ],
  connections: [
    { id: 'conn-init-session', pathD: 'M 180 320 C 240 340, 290 390, 320 390', packetColor: '#38bdf8' },
    { id: 'conn-session-redis', pathD: 'M 420 390 L 550 390', packetColor: '#ef4444' },
    { id: 'conn-upload-chunk', pathD: 'M 180 270 C 240 270, 300 130, 320 130', packetColor: '#ef4444' },
    { id: 'conn-buffer-checksum', pathD: 'M 420 130 L 560 130', packetColor: '#f59e0b' },
    { id: 'conn-checksum-merge', pathD: 'M 660 130 L 790 130', packetColor: '#22c55e' }
  ],
  steps: [
    {
      id: 1,
      title: 'Khởi Tạo Phiên Upload & Cấp Pre-signed URL',
      subtitle: 'Client gửi metadata, Backend sinh Upload ID và khởi tạo Redis BitMap',
      desc: 'Trước khi truyền byte dữ liệu đầu tiên, Client gửi request POST /api/upload/init khai báo tổng dung lượng (2.14GB) và mã checksum SHA-256 của toàn bộ tệp. Backend tạo phiên trong Redis và trả về Upload ID.',
      insight: 'Dùng Redis BitMap hoặc Set để đánh dấu trạng thái từng chunk giúp kiểm tra mảnh nào còn thiếu với tốc độ O(1).',
      changes: [
        { label: 'Phiên Upload', from: 'Chưa có', to: 'Tạo mã ses-891' },
        { label: 'Bộ nhớ đệm Redis', from: 'Trống', to: 'BitMap 428 bits khởi tạo' },
        { label: 'Pre-signed URL', from: 'Chưa cấp', to: 'Token có hiệu lực 2 giờ' }
      ],
      takeaways: [
        'Khởi tạo phiên trước giúp hệ thống sẵn sàng phân bổ tài nguyên lưu trữ.',
        'Pre-signed URL cho phép Client đẩy trực tiếp vào Storage Buffer, giảm tải cho API.'
      ],
      activeNodes: ['client-slicer', 'upload-controller', 'redis-session'],
      activeConnections: ['conn-init-session', 'conn-session-redis'],
      packetType: 'meta',
      inspector: {
        type: 'http',
        title: 'POST /api/upload/init',
        badge: 'Session Initialized',
        badgeColor: '#0284c7',
        latency: '14ms',
        content: `POST /api/upload/init HTTP/1.1\nContent-Type: application/json\n\n{\n  "fileName": "4k_cinematic_nature.mp4",\n  "fileSize": 2296246272,\n  "chunkSize": 5242880,\n  "totalChunks": 428,\n  "fileHash": "sha256-8a3f9e01bc8945..."\n}`
      }
    },
    {
      id: 2,
      title: 'Cắt Phân Đoạn Trên Trình Duyệt (Blob.slice)',
      subtitle: 'Client chia tệp thành các khối 5MB để truyền tải đồng thời',
      desc: 'Sử dụng Web API HTML5 File Blob.slice(start, end), Client cắt nhỏ tệp 2.14GB thành 428 mảnh nhị phân độc lập. Trình duyệt mở 3 worker kết nối HTTP song song để truyền các mảnh.',
      insight: 'Kích thước 5MB là điểm cân bằng vàng (sweet spot) giữa overhead của HTTP headers và dung lượng mất đi nếu phải retry một mảnh khi mạng chập chờn.',
      changes: [
        { label: 'Dung lượng mỗi chunk', from: '2.14 GB nguyên khối', to: '5.24 MB (5,242,880 bytes)' },
        { label: 'Luồng truyền đồng thời', from: '1 kết nối tuần tự', to: '3 worker song song' },
        { label: 'Tiến trình gửi', from: '0%', to: 'Đang stream chunks 1..3' }
      ],
      takeaways: [
        'Cắt nhỏ tệp tại trình duyệt tránh tình trạng Out-Of-Memory trên cả Client lẫn Server.',
        'Truyền đa luồng song song tận dụng tối đa băng thông đường truyền của người dùng.'
      ],
      activeNodes: ['client-slicer', 'chunk-buffer'],
      activeConnections: ['conn-upload-chunk'],
      packetType: 'upload',
      inspector: {
        type: 'http',
        title: 'PUT /api/upload/chunk (Part 1/428)',
        badge: 'HTTP 200 Chunk Received',
        badgeColor: '#16a34a',
        latency: '180ms',
        content: `PUT /api/upload/chunk?uploadId=ses-891&partNumber=1 HTTP/1.1\nContent-Length: 5242880\nContent-Type: application/octet-stream\nContent-Range: bytes 0-5242879/2296246272\n\n[Binary chunk payload 5MB ...]`
      }
    },
    {
      id: 3,
      title: 'Tự Phục Hồi Khi Rớt Mạng (Network Drop & Resume)',
      subtitle: 'Khi mất mạng tại Chunk 42, hệ thống chỉ tải lại đúng 5MB bị lỗi',
      desc: 'Giả lập tình huống kết nối Wifi bị ngắt giữa chừng ở Chunk 42. Client kiểm tra trạng thái với Redis (/status), nhận diện Chunk 1..41 đã an toàn, và chỉ gửi lại duy nhất Chunk 42 thay vì upload lại từ đầu 2.1GB.',
      insight: 'Đây là tính năng quan trọng nhất của hệ thống YouTube/Vimeo. Nếu không có resumable chunking, người dùng mạng yếu ở nông thôn sẽ không bao giờ upload được video dài.',
      changes: [
        { label: 'Sự cố kết nối', from: 'Bình thường', to: 'Rớt mạng tại chunk 42' },
        { label: 'Dung lượng tải lại', from: '2.14 GB (Nếu không có chunk)', to: '5 MB duy nhất' },
        { label: 'Thời gian phục hồi', from: 'Hỏng hoàn toàn', to: '0.6 giây sau khi có mạng' }
      ],
      takeaways: [
        'Resumable upload giúp tăng tỷ lệ thành công khi tải video lên hơn 99.4%.',
        'Redis BitMap trả lời ngay lập tức danh sách các byte offset còn thiếu.'
      ],
      activeNodes: ['client-slicer', 'upload-controller', 'redis-session', 'chunk-buffer'],
      activeConnections: ['conn-init-session', 'conn-session-redis', 'conn-upload-chunk'],
      packetType: 'upload',
      inspector: {
        type: 'redis',
        title: 'Redis Check Missing Chunks: BITPOS / GETBIT',
        badge: 'Resume Check',
        badgeColor: '#ef4444',
        latency: '0.8ms',
        content: `GETBIT upload:ses-891:bitmap 41 -> 1 (OK)\nGETBIT upload:ses-891:bitmap 42 -> 0 (MISSING - Retry)\nGETBIT upload:ses-891:bitmap 43 -> 1 (OK)\n\nClient command: RETRY chunk 42 immediately with exponential backoff.`
      }
    },
    {
      id: 4,
      title: 'Kiểm Tra Toàn Vẹn Checksum Từng Khối',
      subtitle: 'Checksum Validator đối chiếu mã băm MD5/SHA-256 từng chunk',
      desc: 'Tại Chunk Temp Buffer, mỗi mảnh vừa tải lên được Checksum Validator kiểm tra mã hash SHA-256 đối chiếu với giá trị do Client gửi kèm trong header ETag.',
      insight: 'Kiểm tra hash từng mảnh giúp phát hiện ngay lập tức dữ liệu bị hỏng (bit rot) do lỗi truyền dẫn mạng trước khi tiến hành ghép file.',
      changes: [
        { label: 'Mảnh kiểm tra', from: 'Đang truyền', to: '428/428 chunks hợp lệ' },
        { label: 'Mã băm khối', from: 'Đang tính toán', to: 'Match 100% Client ETag' },
        { label: 'Dữ liệu hỏng', from: 'Nguy cơ tiềm ẩn', to: '0 byte corrupt' }
      ],
      takeaways: [
        'Xác thực tính toàn vẹn (Data Integrity) tại tầng chunk ngăn chặn lãng phí tài nguyên ghép tệp.',
        'Mỗi chunk có một chữ ký điện tử độc lập.'
      ],
      activeNodes: ['chunk-buffer', 'checksum-validator'],
      activeConnections: ['conn-buffer-checksum'],
      packetType: 'worker',
      inspector: {
        type: 'event',
        title: 'Chunk Checksum ETag Verification',
        badge: 'Integrity: PASS',
        badgeColor: '#16a34a',
        latency: '1.8ms',
        content: `ETag-Expected: "e-7a91c8430b8d2..."\nETag-Calculated: "e-7a91c8430b8d2..."\nResult: MATCH\n\nMark bit 42 = 1 in Redis BitMap. Total progress: 100% complete.`
      }
    },
    {
      id: 5,
      title: 'Ráp Nối Thành File Gốc & Bàn Giao Mã Hóa',
      subtitle: 'Nối 428 chunks thành file MP4 hoàn chỉnh và kích hoạt Transcoding',
      desc: 'Khi toàn bộ 428 chunks đã xác thực hợp lệ, Storage Engine tiến hành ghép các mảnh nhị phân tuần tự thành source.mp4 (2.14GB) trong Original Storage và xóa bộ đệm tạm.',
      insight: 'Cơ chế Multipart Upload cho phép ghép các chunk ở cấp độ block storage mà không cần copy lại dữ liệu, giúp thời gian ghép diễn ra chỉ trong vài giây.',
      changes: [
        { label: 'Trạng thái tệp', from: '428 chunks rời rạc', to: 'source.mp4 nguyên khối' },
        { label: 'Dung lượng đĩa', from: 'Tốn gấp đôi (Buffer + Gốc)', to: 'Đã giải phóng 2.1GB tạm' },
        { label: 'Bước kế tiếp', from: 'Đang upload', to: 'Bàn giao sang Transcode Queue' }
      ],
      takeaways: [
        'Tệp gốc nằm an toàn tại Original Storage sẵn sàng cho chu trình phân giải.',
        'Phiên upload đóng lại thành công, client nhận phản hồi hoàn tất.'
      ],
      activeNodes: ['checksum-validator', 'merged-storage'],
      activeConnections: ['conn-checksum-merge'],
      packetType: 'completion',
      inspector: {
        type: 'http',
        title: 'POST /api/upload/complete',
        badge: '201 Created & Merged',
        badgeColor: '#16a34a',
        latency: '420ms',
        content: `POST /api/upload/complete HTTP/1.1\n{\n  "uploadId": "ses-891",\n  "parts": [\n    {"partNumber": 1, "etag": "e-7a91..."}, ...\n  ]\n}\n\nResponse 201 Created: File merged successfully. Task enqueued to transcode queue.`
      }
    }
  ]
};

/* ============================================================
   SCENARIO 3: DEEP DIVE TRANSCODE DAG (Kiến Trúc Transcoding FFmpeg)
============================================================ */
const SCENARIO_DEEP_TRANSCODE: SimulationScenario = {
  id: 'deep_transcode',
  menuTitle: '3. Đi Sâu: FFmpeg Transcode DAG & HLS',
  badgeNumber: 'BÀI 3',
  category: '03. MÃ HÓA & ĐÓNG GÓI ĐA PHÂN GIẢI',
  title: 'Tiến Trình Transcoding DAG & Sinh Master Playlist HLS',
  tagline: 'Demuxer tách Video/Audio, mã hóa song song 720p/360p, cắt đoạn 6s và tạo file master.m3u8.',
  badgeRed: '⚡ MULTI-THREAD ENCODING (Song song 720p & 360p)',
  badgeBlue: '📄 HLS PACKAGING (.m3u8 Index & 6s Segments)',
  metrics: [
    { label: '🎞️ CODEC VIDEO', value: 'H.264 (libx264)' },
    { label: '🎵 CODEC AUDIO', value: 'AAC Stereo 128k', color: '#0284c7' },
    { label: '⏱️ ĐỘ DÀI SEGMENT', value: '6.0 giây / .ts', color: '#16a34a' },
    { label: '🚀 TĂNG TỐC TÍNH TOÁN', value: 'Multi-Core Worker', color: '#16a34a' }
  ],
  nodes: [
    {
      id: 'orig-source',
      cx: 120,
      cy: 260,
      topColor: '#fecaca',
      leftColor: '#ef4444',
      rightColor: '#b91c1c',
      label: 'Input Video',
      subLabel: 'source_1080p.mp4',
      badge: 'Tệp MP4 thô',
      iconType: 'storage'
    },
    {
      id: 'demuxer',
      cx: 340,
      cy: 260,
      topColor: '#fed7aa',
      leftColor: '#f97316',
      rightColor: '#c2410c',
      label: 'FFmpeg Demuxer',
      subLabel: 'Split Video & Audio',
      badge: 'Tách luồng dữ liệu',
      iconType: 'demuxer'
    },
    {
      id: 'encoder-720',
      cx: 580,
      cy: 130,
      topColor: '#bbf7d0',
      leftColor: '#22c55e',
      rightColor: '#15803d',
      label: 'Encoder 720p HD',
      subLabel: '2500 kbps • 30fps',
      badge: 'CRF 22 • Main',
      iconType: 'cpu'
    },
    {
      id: 'encoder-360',
      cx: 580,
      cy: 260,
      topColor: '#fef08a',
      leftColor: '#eab308',
      rightColor: '#a16207',
      label: 'Encoder 360p SD',
      subLabel: '800 kbps • 30fps',
      badge: 'CRF 26 • Baseline',
      iconType: 'cpu'
    },
    {
      id: 'encoder-audio',
      cx: 580,
      cy: 390,
      topColor: '#e9d5ff',
      leftColor: '#a855f7',
      rightColor: '#6b21a8',
      label: 'Encoder Audio',
      subLabel: 'AAC 128 kbps Stereo',
      badge: '48 kHz Sampling',
      iconType: 'cpu'
    },
    {
      id: 'hls-segmenter',
      cx: 820,
      cy: 260,
      topColor: '#bae6fd',
      leftColor: '#0ea5e9',
      rightColor: '#0369a1',
      label: 'HLS Segmenter',
      subLabel: 'master.m3u8 + .ts',
      badge: '6s GOP boundary',
      iconType: 'player'
    }
  ],
  connections: [
    { id: 'conn-source-demux', pathD: 'M 170 260 L 290 260', packetColor: '#ef4444' },
    { id: 'conn-demux-720', pathD: 'M 390 240 C 460 210, 500 130, 530 130', packetColor: '#22c55e' },
    { id: 'conn-demux-360', pathD: 'M 390 260 L 530 260', packetColor: '#eab308' },
    { id: 'conn-demux-audio', pathD: 'M 390 280 C 460 310, 500 390, 530 390', packetColor: '#a855f7' },
    { id: 'conn-720-segmenter', pathD: 'M 630 130 C 690 130, 750 230, 770 250', packetColor: '#22c55e' },
    { id: 'conn-360-segmenter', pathD: 'M 630 260 L 770 260', packetColor: '#eab308' },
    { id: 'conn-audio-segmenter', pathD: 'M 630 390 C 690 390, 750 280, 770 270', packetColor: '#a855f7' }
  ],
  steps: [
    {
      id: 1,
      title: 'Rút Tác Vụ & Kéo Tệp Gốc Vào Bộ Đệm Worker',
      subtitle: 'Worker đọc file MP4 thô từ Original Storage và khởi tạo pipeline',
      desc: 'Worker lấy task từ Queue, mở stream đọc tệp gốc 1080p từ Original Storage vào memory buffer và chuẩn bị các tiến trình con FFmpeg xử lý song song.',
      insight: 'Truy cập qua local Unix pipe hoặc NVMe SSD tạm thời giúp tăng tốc độ đọc dữ liệu lên hơn 3000 MB/s, không bị nghẽn mạng.',
      changes: [
        { label: 'Trạng thái Worker', from: 'IDLE', to: 'Khởi tạo pipeline FFmpeg' },
        { label: 'Luồng đọc I/O', from: '0 MB/s', to: 'Stream dữ liệu thô' },
        { label: 'Bộ nhớ cấp phát', from: 'Nhàn rỗi', to: 'RAM đệm 512MB' }
      ],
      takeaways: [
        'Transcoding Worker hoạt động phi trạng thái (Stateless), dễ dàng scale ngang.',
        'Bộ đệm I/O nhanh quyết định 40% hiệu suất tổng thể của worker.'
      ],
      activeNodes: ['orig-source', 'demuxer'],
      activeConnections: ['conn-source-demux'],
      packetType: 'worker',
      inspector: {
        type: 'ffmpeg',
        title: 'FFmpeg Input Probe (ffprobe)',
        badge: 'Demux Input',
        badgeColor: '#f97316',
        latency: '24ms',
        content: `ffprobe -v error -show_entries stream=index,codec_name,codec_type,width,height,bit_rate -of json input.mp4\n\n{\n  "streams": [\n    {"index": 0, "codec_name": "h264", "codec_type": "video", "width": 1920, "height": 1080},\n    {"index": 1, "codec_name": "aac", "codec_type": "audio", "sample_rate": "48000"}\n  ]\n}`
      }
    },
    {
      id: 2,
      title: 'Tách Luồng Dữ Liệu Thô (FFmpeg Demuxing)',
      subtitle: 'Phân rã container MP4 thành luồng Video (YUV) và luồng Audio (PCM)',
      desc: 'Demuxer tách các gói tin đóng trong MP4 container thành luồng khung hình ảnh thô và mẫu âm thanh riêng biệt, gửi sang các tiến trình mã hóa chuyên biệt.',
      insight: 'Tách riêng luồng audio chỉ cần encode một lần duy nhất, sau đó ghép chung vào các phân giải 720p và 360p giúp tiết kiệm 30% tài nguyên CPU.',
      changes: [
        { label: 'Tệp đầu vào', from: 'Container MP4 nguyên khối', to: 'Tách 2 dòng dữ liệu riêng' },
        { label: 'Luồng hình ảnh', from: 'Gắn chung audio', to: 'YUV frames chuyển sang 2 encoder' },
        { label: 'Luồng âm thanh', from: 'Chưa tách', to: 'PCM audio chuyển sang AAC encoder' }
      ],
      takeaways: [
        'Demuxing là bước đầu tiên trong kiến trúc xử lý đa phương tiện chuẩn công nghiệp.',
        'Tái sử dụng cùng một track âm thanh cho mọi độ phân giải hình ảnh.'
      ],
      activeNodes: ['demuxer', 'encoder-720', 'encoder-360', 'encoder-audio'],
      activeConnections: ['conn-demux-720', 'conn-demux-360', 'conn-demux-audio'],
      packetType: 'worker',
      inspector: {
        type: 'ffmpeg',
        title: 'FFmpeg Demux Filter Graph',
        badge: 'Filter Graph',
        badgeColor: '#eab308',
        latency: '12ms',
        content: `[0:v]split=2[v720_in][v360_in];\n[v720_in]scale=w=1280:h=720[v720_out];\n[v360_in]scale=w=640:h=360[v360_out];\n[0:a]aresample=48000[a_out]`
      }
    },
    {
      id: 3,
      title: 'Mã Hóa Đa Phân Giải Song Song (Multi-thread Encoding)',
      subtitle: 'Chạy song song 720p HD (2500kbps) và 360p SD (800kbps)',
      desc: 'Worker kích hoạt các luồng CPU/GPU chạy đồng thời: Thread 1 nén luồng 720p với bitrate 2500kbps (CRF 22), Thread 2 nén luồng 360p với bitrate 800kbps (CRF 26), và Audio Thread nén AAC 128kbps.',
      insight: 'Cài đặt GOP size (Group of Pictures) bằng đúng độ dài segment (180 frames = 6 giây @ 30fps) để đảm bảo mọi segment đều bắt đầu bằng một Keyframe (I-Frame).',
      changes: [
        { label: 'Luồng 720p HD', from: 'Chưa có', to: 'Bitrate 2.5 Mbps • 30fps' },
        { label: 'Luồng 360p SD', from: 'Chưa có', to: 'Bitrate 800 kbps • 30fps' },
        { label: 'Audio Stereo', from: 'Gốc', to: 'AAC 128 kbps chuẩn web' }
      ],
      takeaways: [
        'Đồng bộ Keyframe (I-Frame Alignment) là điều kiện bắt buộc để chuyển đổi độ phân giải mượt mà.',
        'Mã hóa song song rút ngắn thời gian xử lý xuống 2.8 lần so với chạy tuần tự.'
      ],
      activeNodes: ['encoder-720', 'encoder-360', 'encoder-audio'],
      activeConnections: ['conn-demux-720', 'conn-demux-360', 'conn-demux-audio'],
      packetType: 'worker',
      inspector: {
        type: 'ffmpeg',
        title: 'Keyframe & Bitrate Parameters',
        badge: 'I-Frame Aligned',
        badgeColor: '#16a34a',
        latency: '310ms',
        content: `-g 180 -keyint_min 180 -sc_threshold 0 \\\n-c:v:0 libx264 -b:v:0 2500k -maxrate:v:0 2750k -bufsize:v:0 5000k \\\n-c:v:1 libx264 -b:v:1 800k  -maxrate:v:1 880k  -bufsize:v:1 1600k \\\n-c:a aac -b:a 128k`
      }
    },
    {
      id: 4,
      title: 'Phân Đoạn HLS & Đóng Gói .ts Segments (6s)',
      subtitle: 'HLS Segmenter cắt video thành các file 6 giây và xuất bản Playlist',
      desc: 'HLS Segmenter cắt các luồng đã mã hóa thành các file nhị phân nhỏ 6 giây (.ts), đặt tên tuần tự (ví dụ: seg_720p_001.ts, seg_720p_002.ts...) và tạo file chỉ mục cho từng độ phân giải.',
      insight: 'File segment 6 giây cho phép trình duyệt tải trước (prefetch) vừa đủ, không lãng phí băng thông nếu người dùng bấm thoát video giữa chừng.',
      changes: [
        { label: 'Số lượng segments', from: '0 files', to: '14 files .ts cho mỗi phân giải' },
        { label: 'Sub-playlists', from: 'Chưa tạo', to: '720p.m3u8 & 360p.m3u8' },
        { label: 'Kích thước mỗi .ts', from: 'Không có', to: '~1.8MB (720p) / ~600KB (360p)' }
      ],
      takeaways: [
        'HLS phân đoạn hóa video thành các file tĩnh độc lập, dễ dàng lưu trên bất kỳ cloud storage nào.',
        'Mỗi segment chứa đủ cả hình ảnh lẫn âm thanh đã được multiplex hoàn chỉnh.'
      ],
      activeNodes: ['encoder-720', 'encoder-360', 'encoder-audio', 'hls-segmenter'],
      activeConnections: ['conn-720-segmenter', 'conn-360-segmenter', 'conn-audio-segmenter'],
      packetType: 'worker',
      inspector: {
        type: 'hls',
        title: 'Segment Playlist Manifest: 720p.m3u8',
        badge: 'M3U8 Manifest',
        badgeColor: '#0284c7',
        latency: '8.4ms',
        content: `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:6\n#EXT-X-MEDIA-SEQUENCE:0\n\n#EXTINF:6.000000,\nseg_720p_000.ts\n#EXTINF:6.000000,\nseg_720p_001.ts\n#EXTINF:6.000000,\nseg_720p_002.ts\n#EXT-X-ENDLIST`
      }
    },
    {
      id: 5,
      title: 'Xuất Bản Master Playlist Điều Phối Băng Thông',
      subtitle: 'Tạo file master.m3u8 liên kết toàn bộ phân giải cho trình phát ABR',
      desc: 'Segmenter tạo file master.m3u8 ghi rõ thông số bitrate và độ phân giải của các luồng. Đây là file duy nhất mà Client Player (hls.js) cần tải về để bắt đầu phát video.',
      insight: 'Master Playlist hoạt động như một menu lựa chọn. Trình phát video trên điện thoại hay TV sẽ đọc file này để tự quyết định tải 360p hay 720p.',
      changes: [
        { label: 'Master Index File', from: 'Chưa có', to: 'master.m3u8 sẵn sàng' },
        { label: 'Khả năng xem trực tuyến', from: 'Chưa thể xem', to: 'Sẵn sàng phát ABR trên mọi thiết bị' },
        { label: 'Bàn giao hoàn tất', from: 'Đang mã hóa', to: 'Lưu vào Transcoded Storage' }
      ],
      takeaways: [
        'Master Playlist là cầu nối trung tâm giữa bộ mã hóa và trình phát video của người dùng.',
        'Cung cấp trải nghiệm mượt mà không phụ thuộc vào thiết bị đầu cuối.'
      ],
      activeNodes: ['hls-segmenter'],
      activeConnections: ['conn-720-segmenter'],
      packetType: 'completion',
      inspector: {
        type: 'hls',
        title: 'Master Playlist Index: master.m3u8',
        badge: 'Master Index',
        badgeColor: '#16a34a',
        latency: '2.1ms',
        content: `#EXTM3U\n#EXT-X-VERSION:3\n\n#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720,CODECS="avc1.4d401f,mp4a.40.2"\nstream_720p.m3u8\n\n#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.42e01e,mp4a.40.2"\nstream_360p.m3u8`
      }
    }
  ]
};

/* ============================================================
   SCENARIO 4: DEEP DIVE CACHE-ASIDE (Redis Cache & Invalidation)
============================================================ */
const SCENARIO_DEEP_CACHE: SimulationScenario = {
  id: 'deep_cache',
  menuTitle: '4. Đi Sâu: Cache-Aside & DB Invalidation',
  badgeNumber: 'BÀI 4',
  category: '04. BỘ NHỚ ĐỆM & CSDL',
  title: 'Chiến Lược Caching Cache-Aside & Vô Hiệu Hóa Cache (Invalidation)',
  tagline: 'HIT siêu tốc 0.8ms từ RAM Redis, MISS đọc từ SQLite WAL, xóa cache tức thì khi ghi mới.',
  badgeRed: '⚡ REDIS IN-MEMORY (< 1ms Cache HIT)',
  badgeBlue: '💾 SQLITE WAL PERSISTENCE (Bền vững ACID)',
  metrics: [
    { label: '🚀 ĐỘ TRỄ CACHE HIT', value: '0.8 ms', color: '#16a34a' },
    { label: '⏳ ĐỘ TRỄ CACHE MISS', value: '12.4 ms (x15 lần)', color: '#f59e0b' },
    { label: '📈 TỈ LỆ TRÚNG ĐỆM', value: '96.8%', color: '#16a34a' },
    { label: '🧹 CHIẾN LƯỢC CẬP NHẬT', value: 'Invalidate-on-Write' }
  ],
  nodes: [
    {
      id: 'client-query',
      isPlatform: true,
      cx: 120,
      cy: 280,
      platformLabel: 'Query Video Info',
      platformBadge: 'Client Viewers',
      topColor: '', leftColor: '', rightColor: '', label: ''
    },
    {
      id: 'lb-node',
      cx: 340,
      cy: 280,
      topColor: '#bae6fd',
      leftColor: '#0ea5e9',
      rightColor: '#0369a1',
      label: 'Load Balancer',
      subLabel: 'Round Robin / NGINX',
      badge: '11.9k req/s',
      iconType: 'lb'
    },
    {
      id: 'api-core',
      cx: 560,
      cy: 280,
      topColor: '#bae6fd',
      leftColor: '#0284c7',
      rightColor: '#075985',
      label: 'API Server',
      subLabel: 'Cache-Aside Logic',
      badge: 'Port 3100',
      iconType: 'server'
    },
    {
      id: 'redis-memory',
      cx: 810,
      cy: 160,
      topColor: '#fed7aa',
      leftColor: '#ef4444',
      rightColor: '#991b1b',
      label: 'Redis Cache Cluster',
      subLabel: 'Key: video:meta:<id>',
      badge: 'Cache HIT: 0.8ms',
      iconType: 'redis'
    },
    {
      id: 'sqlite-storage',
      cx: 810,
      cy: 400,
      topColor: '#e2e8f0',
      leftColor: '#64748b',
      rightColor: '#334155',
      label: 'SQLite Database',
      subLabel: 'WAL Mode • SSD',
      badge: 'Query: 12.4ms (ACID)',
      iconType: 'db'
    }
  ],
  connections: [
    { id: 'conn-client-lb', pathD: 'M 180 280 L 290 280', packetColor: '#38bdf8' },
    { id: 'conn-lb-api', pathD: 'M 390 280 L 510 280', packetColor: '#38bdf8' },
    { id: 'conn-api-redis', pathD: 'M 610 260 C 680 230, 720 180, 760 170', packetColor: '#ef4444' },
    { id: 'conn-api-db', pathD: 'M 610 300 C 680 330, 720 380, 760 390', packetColor: '#64748b' }
  ],
  steps: [
    {
      id: 1,
      title: 'Client Gửi Yêu Cầu Đọc Metadata Video',
      subtitle: 'GET /api/videos/:id chuyển tiếp qua Load Balancer tới API Server',
      desc: 'Người dùng bấm vào xem video trên YouTube, ứng dụng gửi request GET /api/videos/v-yt-9182. Load Balancer chuyển tiếp yêu cầu tới một instance API Server đang rảnh.',
      insight: 'Tách riêng tầng Caching cho phép API Server xử lý hàng chục nghìn lượt đọc mỗi giây mà không cần tăng cấu hình CPU cơ sở dữ liệu.',
      changes: [
        { label: 'Yêu cầu tới', from: 'Client App', to: 'API Server qua LB' },
        { label: 'Hành vi API', from: 'Chờ xử lý', to: 'Kiểm tra Cache trước tiên' },
        { label: 'Tải trên CSDL', from: 'Nguy cơ quá tải', to: 'Chưa chạm vào DB' }
      ],
      takeaways: [
        'Nguyên tắc Cache-Aside (Lazy Loading): Luôn kiểm tra cache trước khi truy vấn đĩa.',
        'Load Balancer san đều tải giữa các instance API.'
      ],
      activeNodes: ['client-query', 'lb-node', 'api-core'],
      activeConnections: ['conn-client-lb', 'conn-lb-api'],
      packetType: 'meta',
      inspector: {
        type: 'http',
        title: 'GET /api/videos/v-yt-9182',
        badge: 'HTTP Request',
        badgeColor: '#0284c7',
        latency: '2.1ms',
        content: `GET /api/videos/v-yt-9182 HTTP/1.1\nHost: api.youtube.local\nAccept: application/json\nUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)`
      }
    },
    {
      id: 2,
      title: 'Tình Huống 1: Cache HIT Siêu Tốc (0.8ms)',
      subtitle: 'Dữ liệu có sẵn trong RAM Redis, trả về ngay không chạm vào CSDL',
      desc: 'API Server kiểm tra key "video:meta:v-yt-9182" trên Redis. Do video này đang "hot", dữ liệu đã nằm sẵn trong bộ nhớ RAM. Redis phản hồi JSON trong 0.8ms và API trả ngay cho Client.',
      insight: '96.8% các yêu cầu xem video phổ biến đều rơi vào trường hợp Cache HIT. Ổ cứng SQLite hoàn toàn không phải quay đĩa đọc dữ liệu.',
      changes: [
        { label: 'Kết quả Redis', from: 'Kiểm tra Key', to: 'Cache HIT (Có dữ liệu)' },
        { label: 'Độ trễ phản hồi', from: '12.4 ms (DB)', to: '0.8 ms (RAM)' },
        { label: 'Tải trên SQLite', from: 'Bị truy vấn', to: 'Hoàn toàn nhàn rỗi (0 req)' }
      ],
      takeaways: [
        'Cache HIT giúp giảm độ trễ phản hồi tới 15 lần.',
        'Bảo vệ cơ sở dữ liệu gốc khỏi hiện tượng nghẽn cổ chai I/O khi có triệu người truy cập.'
      ],
      activeNodes: ['api-core', 'redis-memory'],
      activeConnections: ['conn-api-redis'],
      packetType: 'meta',
      inspector: {
        type: 'redis',
        title: 'Redis Command: GET video:meta:v-yt-9182',
        badge: 'Cache HIT (0.8ms)',
        badgeColor: '#16a34a',
        latency: '0.8ms',
        content: `GET video:meta:v-yt-9182\n\nResult: 200 OK (Cache HIT)\nPayload: {"id":"v-yt-9182","title":"System Design HLS","status":"READY","views":14820}\nTTL Remaining: 2840 seconds`
      }
    },
    {
      id: 3,
      title: 'Tình Huống 2: Cache MISS & Đọc CSDL (12.4ms)',
      subtitle: 'Khi cache hết hạn, API truy vấn SQLite WAL Mode để lấy dữ liệu gốc',
      desc: 'Nếu key chưa có hoặc TTL 1 giờ đã hết hạn, Redis trả về nil (Cache MISS). API Server buộc phải thực hiện truy vấn SQL xuống bảng videos trong SQLite lưu trên ổ cứng SSD.',
      insight: 'Nhờ SQLite được cấu hình chế độ WAL (Write-Ahead Logging), các câu lệnh đọc không bao giờ bị khóa (lock) bởi các câu lệnh ghi.',
      changes: [
        { label: 'Kết quả Redis', from: 'Kiểm tra Key', to: 'Cache MISS (nil)' },
        { label: 'Nguồn đọc dữ liệu', from: 'RAM Redis', to: 'Đĩa cứng SQLite WAL' },
        { label: 'Thời gian thực thi', from: '0.8 ms', to: '12.4 ms' }
      ],
      takeaways: [
        'Cache MISS là bình thường đối với video mới tạo hoặc video ít người xem (Long-tail content).',
        'WAL mode cho phép đọc đồng thời không giới hạn mà không bị block.'
      ],
      activeNodes: ['api-core', 'sqlite-storage'],
      activeConnections: ['conn-api-db'],
      packetType: 'meta',
      inspector: {
        type: 'http',
        title: 'SQLite SQL Query Execution',
        badge: 'Cache MISS (12.4ms)',
        badgeColor: '#f59e0b',
        latency: '12.4ms',
        content: `SELECT id, title, status, duration, qualities, created_at \nFROM videos \nWHERE id = 'v-yt-9182' LIMIT 1;\n\n[WAL Mode: Read lock acquired -> 1 row returned in 12.4ms]`
      }
    },
    {
      id: 4,
      title: 'Nạp Ngược Lại Cache (Cache Backfill with TTL)',
      subtitle: 'API ghi dữ liệu vừa đọc từ DB vào Redis với hạn dùng TTL 3600 giây',
      desc: 'Sau khi lấy được dòng dữ liệu từ SQLite, API Server lập tức gọi lệnh SETEX ghi ngược vào Redis với thời gian sống TTL = 3600 giây, đảm bảo người xem kế tiếp sẽ nhận được Cache HIT.',
      insight: 'Luôn luôn đặt TTL (Time-To-Live). Nếu không có TTL, dữ liệu rác sẽ tồn tại vĩnh viễn làm cạn kiệt bộ nhớ RAM của cụm Redis.',
      changes: [
        { label: 'Trạng thái Redis', from: 'Trống (MISS)', to: 'Đã nạp bản ghi mới' },
        { label: 'Thời gian sống TTL', from: 'Không có', to: '3600 giây (1 giờ)' },
        { label: 'Lượt xem tiếp theo', from: 'Phải đọc DB', to: 'Trúng Cache HIT 0.8ms' }
      ],
      takeaways: [
        'Tự động làm ấm bộ nhớ đệm theo nhu cầu thực tế của người dùng (On-demand warming).',
        'TTL ngăn ngừa hiện tượng rò rỉ bộ nhớ (Memory Leak) trong Redis.'
      ],
      activeNodes: ['api-core', 'redis-memory'],
      activeConnections: ['conn-api-redis'],
      packetType: 'meta',
      inspector: {
        type: 'redis',
        title: 'Redis Command: SETEX Backfill',
        badge: 'Cache Backfill',
        badgeColor: '#16a34a',
        latency: '1.4ms',
        content: `SETEX video:meta:v-yt-9182 3600 '{"id":"v-yt-9182","title":"System Design HLS","status":"READY"}'\n\nOK: Key cached for 1 hour. Memory overhead: ~412 bytes.`
      }
    },
    {
      id: 5,
      title: 'Vô Hiệu Hóa Cache Khi Cập Nhật (Cache Invalidation)',
      subtitle: 'Tác giả sửa tiêu đề video: Ghi DB trước, xóa key Redis (DEL) sau',
      desc: 'Khi tác giả đổi tên video (PATCH /api/videos/:id), API Server cập nhật DB trước, sau đó phát lệnh DEL video:meta:v-yt-9182 trên Redis. Mọi người xem tiếp theo sẽ lấy tiêu đề mới nhất, tránh đọc phải dữ liệu cũ (Dirty Read).',
      insight: 'Trong khoa học máy tính: "Có 2 bài toán khó nhất: Đặt tên biến và Vô hiệu hóa bộ nhớ đệm (Cache Invalidation)". Xóa cache sau khi ghi DB là giải pháp đơn giản và an toàn nhất.',
      changes: [
        { label: 'Thao tác dữ liệu', from: 'Đọc (Read)', to: 'Cập nhật tiêu đề (Write)' },
        { label: 'Trạng thái trong DB', from: 'Tiêu đề cũ', to: 'Cập nhật thành công vào WAL' },
        { label: 'Trạng thái trên Redis', from: 'Chứa tiêu đề cũ', to: 'Bị xóa hoàn toàn (Key Evicted)' }
      ],
      takeaways: [
        'Chiến lược Cache-Aside: Invalidate on Write (Xóa thay vì cập nhật) ngăn ngừa tình trạng Race Condition.',
        'Đảm bảo tính nhất quán cuối cùng (Eventual Consistency) trên toàn hệ thống.'
      ],
      activeNodes: ['api-core', 'sqlite-storage', 'redis-memory'],
      activeConnections: ['conn-api-db', 'conn-api-redis'],
      packetType: 'completion',
      inspector: {
        type: 'redis',
        title: 'Cache Invalidation Sequence',
        badge: 'DEL Key Executed',
        badgeColor: '#ef4444',
        latency: '0.9ms',
        content: `1. UPDATE videos SET title = 'New 2026 Title' WHERE id = 'v-yt-9182';\n2. DEL video:meta:v-yt-9182\n\nResult: Key deleted from Redis memory. Next read will fetch fresh DB state.`
      }
    }
  ]
};

/* ============================================================
   SCENARIO 5: DEEP DIVE COMPLETION QUEUE (Hàng Đợi Hoàn Tất)
============================================================ */
const SCENARIO_DEEP_COMPLETION: SimulationScenario = {
  id: 'deep_completion',
  menuTitle: '5. Đi Sâu: Completion Queue & Event Pipeline',
  badgeNumber: 'BÀI 5',
  category: '05. GIAO TIẾP SỰ KIỆN BẤT ĐỒNG BỘ',
  title: 'Hàng Đợi Hoàn Tất & Pipeline Thông Báo Real-Time',
  tagline: 'Giải phóng Worker trong 4ms qua Completion Queue, Handler cập nhật DB & đẩy WebSocket tức thì.',
  badgeRed: '📬 MESSAGE BROKER (Giải phóng Worker tức thì)',
  badgeBlue: '🔔 REAL-TIME WEBSOCKET (Đẩy trạng thái không cần F5)',
  metrics: [
    { label: '⏱️ THỜI GIAN NHẢ WORKER', value: '3.8 ms', color: '#16a34a' },
    { label: '🔁 ĐẢM BẢO GIAO HÀNG', value: 'At-least-once (ACK)', color: '#0284c7' },
    { label: '📡 ĐỘ TRỄ WEBSOCKET', value: '14 ms', color: '#16a34a' },
    { label: '🛡️ CHỐNG QUÁ TẢI DB', value: 'Queue Load Levelling' }
  ],
  nodes: [
    {
      id: 'worker-node',
      cx: 120,
      cy: 160,
      topColor: '#fef08a',
      leftColor: '#eab308',
      rightColor: '#a16207',
      label: 'Transcode Worker',
      subLabel: 'FFmpeg Producer',
      badge: 'Hoàn tất HLS',
      iconType: 'cpu'
    },
    {
      id: 'cq-broker',
      cx: 370,
      cy: 160,
      topColor: '#e9d5ff',
      leftColor: '#a855f7',
      rightColor: '#6b21a8',
      label: 'Completion Queue',
      subLabel: 'FIFO Message Broker',
      badge: 'Sự kiện hoàn tất',
      iconType: 'queue'
    },
    {
      id: 'ch-consumer',
      cx: 610,
      cy: 160,
      topColor: '#ddd6fe',
      leftColor: '#8b5cf6',
      rightColor: '#5b21b6',
      label: 'Completion Handler',
      subLabel: 'Event Consumer',
      badge: 'Xử lý hậu kỳ',
      iconType: 'handler'
    },
    {
      id: 'db-writer',
      cx: 840,
      cy: 160,
      topColor: '#e2e8f0',
      leftColor: '#64748b',
      rightColor: '#334155',
      label: 'SQLite Database',
      subLabel: 'UPDATE status = READY',
      badge: 'Ghi bền vững',
      iconType: 'db'
    },
    {
      id: 'redis-warmer',
      cx: 840,
      cy: 360,
      topColor: '#fed7aa',
      leftColor: '#ef4444',
      rightColor: '#991b1b',
      label: 'Redis Cache Warmer',
      subLabel: 'Warm master.m3u8 link',
      badge: 'Sẵn sàng HIT',
      iconType: 'redis'
    },
    {
      id: 'ws-gateway',
      cx: 490,
      cy: 360,
      topColor: '#bae6fd',
      leftColor: '#0ea5e9',
      rightColor: '#0369a1',
      label: 'WebSocket Gateway',
      subLabel: 'Socket.io Server',
      badge: 'Push thông báo',
      iconType: 'server'
    },
    {
      id: 'creator-studio',
      isPlatform: true,
      cx: 140,
      cy: 360,
      platformLabel: 'Studio Dashboard UI',
      platformBadge: 'Creator Client',
      topColor: '', leftColor: '', rightColor: '', label: ''
    }
  ],
  connections: [
    { id: 'conn-worker-queue', pathD: 'M 170 160 L 320 160', packetColor: '#a855f7' },
    { id: 'conn-queue-handler', pathD: 'M 420 160 L 560 160', packetColor: '#a855f7' },
    { id: 'conn-handler-db', pathD: 'M 660 160 L 790 160', packetColor: '#64748b' },
    { id: 'conn-handler-redis', pathD: 'M 640 190 C 700 240, 770 320, 800 350', packetColor: '#ef4444' },
    { id: 'conn-handler-ws', pathD: 'M 590 190 C 560 240, 520 310, 500 330', packetColor: '#38bdf8' },
    { id: 'conn-ws-client', pathD: 'M 440 360 L 210 360', packetColor: '#22c55e' }
  ],
  steps: [
    {
      id: 1,
      title: 'Worker Đẩy Thông Điệp Vào Completion Queue',
      subtitle: 'FFmpeg hoàn tất encode, bắn Event JSON và lập tức nhận job mới',
      desc: 'Khi render xong các file .ts, Worker không gọi trực tiếp API Server (để tránh thắt cổ chai). Thay vào đó, Worker đẩy một thông điệp JSON vào Completion Queue trong 3.8ms rồi lập tức rảnh tay để nhận video kế tiếp.',
      insight: 'Nguyên lý Decoupling: Tách rời thành phần tạo sự kiện (Producer - Worker) khỏi thành phần xử lý kết quả (Consumer - Handler).',
      changes: [
        { label: 'Trạng thái Worker', from: 'Đang giữ kết nối', to: 'Giải phóng sau 3.8ms' },
        { label: 'Completion Queue', from: '0 thông điệp', to: '1 task hoàn tất chờ bốc' },
        { label: 'Nguy cơ sập API', from: 'Cao nếu worker gọi dồn dập', to: '0% (Được queue san tải)' }
      ],
      takeaways: [
        'Hàng đợi bảo vệ cơ sở dữ liệu khỏi các cơn bão ghi đồng thời (Write Spikes).',
        'Worker đạt hiệu suất tính toán tối đa 100% thời gian.'
      ],
      activeNodes: ['worker-node', 'cq-broker'],
      activeConnections: ['conn-worker-queue'],
      packetType: 'completion',
      inspector: {
        type: 'event',
        title: 'Event Published: TRANSCODE_COMPLETE',
        badge: 'Message Queued',
        badgeColor: '#a855f7',
        latency: '3.8ms',
        content: `LPUSH queue:completion '{\n  "videoId": "v-yt-9182",\n  "status": "READY",\n  "qualities": ["360p", "720p"],\n  "duration": 42.5,\n  "hlsPath": "/hls/v-yt-9182/master.m3u8"\n}'`
      }
    },
    {
      id: 2,
      title: 'Completion Handler Nhận Tác Vụ & Gửi Xác Nhận ACK',
      subtitle: 'Consumer rút message từ Queue và xác nhận giao dịch an toàn',
      desc: 'Completion Handler (tiến trình nền độc lập) bốc thông điệp ra khỏi Queue. Handler gửi tín hiệu ACK xác nhận đã nhận, đảm bảo không có thông điệp nào bị mất dù hệ thống có khởi động lại.',
      insight: 'Mô hình At-least-once delivery: Nếu Handler bị crash giữa chừng, Queue sẽ tự động giao lại thông điệp cho một Handler khác sau 30 giây.',
      changes: [
        { label: 'Tiến trình Handler', from: 'IDLE', to: 'Đang xử lý hậu kỳ v-yt-9182' },
        { label: 'Trạng thái Queue', from: 'Pending', to: 'ACK confirmed' },
        { label: 'Độ tin cậy', from: 'Best-effort', to: 'Guaranteed processing' }
      ],
      takeaways: [
        'Cơ chế ACK (Acknowledgment) là nền tảng của hệ thống phân tán chịu lỗi.',
        'Handler có thể nhân bản lên nhiều node để tăng tốc độ xử lý hậu kỳ.'
      ],
      activeNodes: ['cq-broker', 'ch-consumer'],
      activeConnections: ['conn-queue-handler'],
      packetType: 'completion',
      inspector: {
        type: 'event',
        title: 'Queue Acknowledgment (ACK)',
        badge: 'Message ACK',
        badgeColor: '#16a34a',
        latency: '1.2ms',
        content: `RPOPLPUSH queue:completion queue:processing\n[Handler-01] Received job: v-yt-9182\n[Handler-01] Emitted ACK -> Job moved to active processing state.`
      }
    },
    {
      id: 3,
      title: 'Cập Nhật Trạng Thái READY Vào Cơ Sở Dữ Liệu',
      subtitle: 'Ghi nhận phân giải 360p/720p và thời lượng video vào SQLite',
      desc: 'Handler thực thi câu lệnh SQL UPDATE trong SQLite WAL mode: đổi status = READY, ghi nhận danh sách resolutions = ["360p", "720p"] và thời lượng video.',
      insight: 'Chỉ cập nhật DB một lần duy nhất tại bước cuối cùng này giúp giảm tải ghi trên đĩa tới 95%.',
      changes: [
        { label: 'Trạng thái trong DB', from: 'PROCESSING (Tiến trình)', to: 'READY (Sẵn sàng xem)' },
        { label: 'Cột qualities', from: '[]', to: '["360p", "720p"]' },
        { label: 'Quyền hiển thị', from: 'Ẩn trong studio', to: 'Công khai trên trang chủ' }
      ],
      takeaways: [
        'Cơ sở dữ liệu lưu giữ trạng thái bền vững cuối cùng (Single Source of Truth).',
        'Cập nhật thành công mở khóa quyền xem video cho toàn bộ người dùng.'
      ],
      activeNodes: ['ch-consumer', 'db-writer'],
      activeConnections: ['conn-handler-db'],
      packetType: 'worker',
      inspector: {
        type: 'http',
        title: 'SQLite UPDATE SQL Execution',
        badge: 'Status: READY',
        badgeColor: '#16a34a',
        latency: '6.4ms',
        content: `UPDATE videos \nSET status = 'READY', \n    qualities = '["360p","720p"]', \n    duration = 42.5, \n    updated_at = CURRENT_TIMESTAMP \nWHERE id = 'v-yt-9182';`
      }
    },
    {
      id: 4,
      title: 'Làm Ấm Bộ Nhớ Đệm Redis (Cache Warm-Up)',
      subtitle: 'Ghi trước link master.m3u8 vào Redis để Client query là trúng ngay',
      desc: 'Ngay sau khi ghi DB, Handler chủ động ghi trước dữ liệu video vào Redis (Cache Warm-up) với TTL 1 giờ, sẵn sàng đón đầu làn sóng người xem đầu tiên.',
      insight: 'Chủ động nạp cache (Proactive warming) thay vì chờ người dùng gọi đến mới nạp (Lazy loading) giúp loại bỏ hoàn toàn Cache MISS cho các video mới ra lò.',
      changes: [
        { label: 'Trạng thái Cache', from: 'Chưa có', to: 'Đã nạp sẵn (Warmed-up)' },
        { label: 'Dữ liệu lưu', from: 'Rỗng', to: 'Link master.m3u8 và metadata' },
        { label: 'Độ trễ lượt xem đầu', from: '12ms (Phải đọc DB)', to: '0.8ms (Đã nằm trong RAM)' }
      ],
      takeaways: [
        'Proactive Cache Warming mang lại trải nghiệm xem tức thì cho video vừa xuất bản.',
        'Loại bỏ hiện tượng nghẽn mạng do "hiệu ứng đám đông" (Thundering Herd Problem).'
      ],
      activeNodes: ['ch-consumer', 'redis-warmer'],
      activeConnections: ['conn-handler-redis'],
      packetType: 'meta',
      inspector: {
        type: 'redis',
        title: 'Redis Cache Pre-Warming',
        badge: 'Cache Warmed',
        badgeColor: '#16a34a',
        latency: '1.1ms',
        content: `SETEX video:meta:v-yt-9182 3600 '{"id":"v-yt-9182","title":"System Design","status":"READY","hls":"/hls/v-yt-9182/master.m3u8"}'\n\nResult: OK. Ready to serve immediate traffic.`
      }
    },
    {
      id: 5,
      title: 'Bắn Sự Kiện Real-Time Qua WebSocket Tới Trình Duyệt',
      subtitle: 'Creator Studio nhận thông báo và hiện tích xanh READY không cần bấm F5',
      desc: 'Handler gửi tín hiệu tới WebSocket Gateway. Server Socket.io phát sự kiện video_ready tới đúng kênh kết nối của Creator. Trình duyệt nhận sự kiện, lập tức biến icon xoay tròn màu vàng thành nút xem màu xanh lá.',
      insight: 'Thay thế cơ chế Polling (liên tục hỏi server) bằng WebSocket (Server chủ động đẩy) giúp tiết kiệm 98% request rác cho hệ thống backend.',
      changes: [
        { label: 'Giao diện Studio', from: 'Đang transcode (Spinner vàng)', to: 'Sẵn sàng xem (Nút xanh)' },
        { label: 'Phương thức cập nhật', from: 'Phải bấm F5 tải lại', to: 'Real-time WebSocket Push' },
        { label: 'Độ trễ thông báo', from: '> 2.000 ms (Polling interval)', to: '14 ms' }
      ],
      takeaways: [
        'WebSocket cung cấp trải nghiệm sản phẩm mượt mà, chuyên nghiệp chuẩn YouTube Studio.',
        'Giảm thiểu hàng triệu request polling vô nghĩa lên hạ tầng API.'
      ],
      activeNodes: ['ch-consumer', 'ws-gateway', 'creator-studio'],
      activeConnections: ['conn-handler-ws', 'conn-ws-client'],
      packetType: 'completion',
      inspector: {
        type: 'event',
        title: 'WebSocket Broadcast Frame (Socket.io)',
        badge: 'WS Push (14ms)',
        badgeColor: '#22c55e',
        latency: '14ms',
        content: `42["video_status_update",{\n  "videoId": "v-yt-9182",\n  "status": "READY",\n  "progress": 100,\n  "renditions": ["360p", "720p"],\n  "readyAt": 1732274415200\n}]`
      }
    }
  ]
};

/* ============================================================
   SCENARIO 6: DEEP DIVE STREAMING ABR & CDN (Adaptive Bitrate)
============================================================ */
const SCENARIO_DEEP_STREAMING: SimulationScenario = {
  id: 'deep_streaming',
  menuTitle: '6. Đi Sâu: Streaming ABR & CDN Edge',
  badgeNumber: 'BÀI 6',
  category: '06. TRUYỀN DẪN & PHÁT VIDEO THÍCH ỨNG',
  title: 'Phân Phối Biên Mạng CDN Edge & Tự Thích Ứng Băng Thông (ABR)',
  tagline: 'CDN Edge phục vụ 98% lượt xem siêu tốc 3.2ms, trình phát tự hạ 720p xuống 360p khi mạng yếu.',
  badgeRed: '🌐 CDN EDGE POP (Cache HIT 3.2ms tại biên mạng)',
  badgeBlue: '🔄 ADAPTIVE BITRATE (Tự hạ phân giải tránh đứng hình)',
  metrics: [
    { label: '🚀 TỈ LỆ CDN EDGE HIT', value: '98.4%', color: '#16a34a' },
    { label: '🏎️ TỐC ĐỘ PHÂN PHỐI', value: '148.3 MB/s', color: '#16a34a' },
    { label: '📶 ĐỘ TRỄ CHUYỂN LUỒNG', value: '0 frame trễ', color: '#0284c7' },
    { label: '🛑 THỜI GIAN BUFFERING', value: '0 ms (Zero Stutter)', color: '#16a34a' }
  ],
  nodes: [
    {
      id: 'player-client',
      isPlatform: true,
      cx: 120,
      cy: 280,
      platformLabel: 'HLS Player (hls.js)',
      platformBadge: 'Video Player',
      topColor: '', leftColor: '', rightColor: '', label: ''
    },
    {
      id: 'cdn-edge-pop',
      cx: 370,
      cy: 280,
      topColor: '#bfdbfe',
      leftColor: '#3b82f6',
      rightColor: '#1d4ed8',
      label: 'CDN Edge PoP (SGN)',
      subLabel: 'Biên mạng TP.HCM • Cache RAM',
      badge: 'HIT 98.4% • 3.2ms',
      iconType: 'cdn'
    },
    {
      id: 'cdn-origin-shield',
      cx: 610,
      cy: 280,
      topColor: '#bae6fd',
      leftColor: '#0ea5e9',
      rightColor: '#0369a1',
      label: 'Origin Shield CDN',
      subLabel: 'Tầng đệm bảo vệ Server',
      badge: 'Giảm tải Origin 99%',
      iconType: 'server'
    },
    {
      id: 'origin-storage',
      cx: 840,
      cy: 280,
      topColor: '#bbf7d0',
      leftColor: '#22c55e',
      rightColor: '#15803d',
      label: 'Transcoded Storage',
      subLabel: 'S3 Storage Bucket gốc',
      badge: 'Chỉ chịu tải < 1%',
      iconType: 'storage'
    }
  ],
  connections: [
    { id: 'conn-client-edge', pathD: 'M 180 280 L 310 280', packetColor: '#22c55e' },
    { id: 'conn-edge-shield', pathD: 'M 420 280 L 550 280', packetColor: '#38bdf8' },
    { id: 'conn-shield-origin', pathD: 'M 670 280 L 790 280', packetColor: '#64748b' }
  ],
  steps: [
    {
      id: 1,
      title: 'Trình Phát Khởi Động & Tải Master Playlist',
      subtitle: 'hls.js gửi request lấy master.m3u8 từ CDN Edge gần nhất',
      desc: 'Khi người xem bấm nút Play, trình phát hls.js gửi request tới URL CDN Edge gần vị trí địa lý nhất (SGN-Edge PoP tại Việt Nam) để lấy file cấu trúc đa độ phân giải master.m3u8.',
      insight: 'Định tuyến Anycast DNS tự động dẫn hướng người xem đến CDN Edge Server có độ trễ vật lý thấp nhất.',
      changes: [
        { label: 'Hành động người xem', from: 'Bấm Play', to: 'Tải Master Playlist' },
        { label: 'Điểm tiếp nhận', from: 'Máy chủ gốc xa xôi', to: 'Edge PoP ngay tại địa phương' },
        { label: 'Thời gian kết nối', from: '> 180 ms', to: '3.2 ms' }
      ],
      takeaways: [
        'CDN Edge đưa nội dung đến sát người dùng nhất có thể.',
        'File master.m3u8 có dung lượng siêu nhẹ (~400 bytes) tải về trong nháy mắt.'
      ],
      activeNodes: ['player-client', 'cdn-edge-pop'],
      activeConnections: ['conn-client-edge'],
      packetType: 'cdn',
      inspector: {
        type: 'hls',
        title: 'GET /hls/v-yt-9182/master.m3u8',
        badge: 'HTTP 200 (Anycast CDN)',
        badgeColor: '#16a34a',
        latency: '3.2ms',
        content: `GET /hls/v-yt-9182/master.m3u8 HTTP/2\nHost: cdn-edge-sgn.youtube.local\n\nHTTP/2 200 OK\nContent-Type: application/vnd.apple.mpegurl\nCF-Cache-Status: HIT\nCF-Ray: 7f81a90c2-SGN\nServer: cloudflare / cdn-edge`
      }
    },
    {
      id: 2,
      title: 'Cơ Chế Cache HIT & Origin Shield Giảm Tải',
      subtitle: 'Lượt xem đầu kéo từ Origin Shield, mọi lượt xem sau là Cache HIT',
      desc: 'Lần đầu tiên video được phát tại khu vực, CDN Edge bị MISS và kéo từ Origin Shield. Origin Shield lưu cache và trả về. Kể từ người xem thứ 2, 100% request được phục vụ trực tiếp từ RAM của CDN Edge với tốc độ 148 MB/s.',
      insight: 'Origin Shield đóng vai trò như một bức tường trung gian. Dù có 100 node CDN Edge cùng hỏi một lúc, Origin Shield chỉ gửi đúng 1 request về máy chủ lưu trữ gốc (Collapse Forwarding).',
      changes: [
        { label: 'Tỉ lệ Cache HIT', from: '0% (Ban đầu)', to: '98.4% ổn định' },
        { label: 'Tải trên Storage gốc', from: 'Phải gánh mọi lượt xem', to: 'Giảm tới 99.2%' },
        { label: 'Thông lượng truyền tải', from: 'Nghẽn mạng máy chủ', to: '148.31 MB/s từ biên CDN' }
      ],
      takeaways: [
        'Origin Shield ngăn chặn hiện tượng Cache Stampede làm sập kho lưu trữ gốc.',
        'Nội dung tĩnh HLS là loại dữ liệu hoàn hảo nhất cho cơ chế caching biên mạng.'
      ],
      activeNodes: ['cdn-edge-pop', 'cdn-origin-shield', 'origin-storage'],
      activeConnections: ['conn-edge-shield', 'conn-shield-origin'],
      packetType: 'cdn',
      inspector: {
        type: 'http',
        title: 'CDN Cache Status Headers',
        badge: 'X-Cache: HIT',
        badgeColor: '#16a34a',
        latency: '3.2ms',
        content: `X-Cache: HIT\nX-Cache-Hits: 14209\nX-Served-By: cache-sgn01-edge\nCache-Control: public, max-age=86400, immutable\nAccept-Ranges: bytes`
      }
    },
    {
      id: 3,
      title: 'Phát Luồng 720p HD Mượt Mà Khi Mạng Khỏe',
      subtitle: 'Băng thông 15 Mbps: Player chọn tải các phân đoạn 720p HD chất lượng cao',
      desc: 'Thuật toán ABR đo tốc độ tải segment đầu tiên: người dùng đang dùng Wifi mạnh (15 Mbps). Trình phát chọn tải các phân đoạn 720p HD (seg_720p_001.ts, seg_720p_002.ts...) với bitrate sắc nét 2500 kbps.',
      insight: 'Player duy trì một bộ đệm Buffer 30 giây trong trình duyệt. Khi đang xem giây thứ 6 thì giây thứ 36 đã được tải sẵn.',
      changes: [
        { label: 'Độ phân giải hiển thị', from: 'Đang đàm phán', to: '720p HD (1280x720)' },
        { label: 'Băng thông tiêu thụ', from: '0 kbps', to: '2.500 kbps' },
        { label: 'Trạng thái Buffer', from: 'Trống', to: 'Tải sẵn 30s trong RAM' }
      ],
      takeaways: [
        'Buffer Ahead giúp người xem không bị gián đoạn dù mạng chập chờn trong vài giây.',
        'Ưu tiên chất lượng hình ảnh cao nhất tương xứng với đường truyền.'
      ],
      activeNodes: ['player-client', 'cdn-edge-pop'],
      activeConnections: ['conn-client-edge'],
      packetType: 'cdn',
      inspector: {
        type: 'hls',
        title: 'GET seg_720p_001.ts (HD Stream)',
        badge: '720p HD Stream',
        badgeColor: '#22c55e',
        latency: '45ms',
        content: `GET /hls/v-yt-9182/seg_720p_001.ts HTTP/2\nContent-Length: 1874208 bytes (~1.8 MB)\n\nPlayer Buffer Health: 24.0s forward buffer\nMeasured Bandwidth: 14.8 Mbps\nCurrent Quality: 720p HD`
      }
    },
    {
      id: 4,
      title: 'Mạng Người Dùng Suy Giảm Đột Ngột (Network Drop)',
      subtitle: 'Người dùng đi vào vùng sóng yếu: Băng thông tụt từ 15 Mbps xuống 1.2 Mbps',
      desc: 'Giả lập tình huống người dùng đi vào thang máy hoặc sóng 4G chập chờn: tốc độ tải segment giảm xuống chỉ còn 1.2 Mbps, không còn đủ duy trì luồng 720p (đòi hỏi 2.5 Mbps). Buffer bắt đầu sụt giảm từ 30s xuống 8s.',
      insight: 'Nếu là video MP4 truyền thống, màn hình sẽ lập tức bị đứng hình và hiện vòng tròn xoay tải (Buffering Wheel). Nhưng HLS ABR đã chuẩn bị sẵn kịch bản thích ứng.',
      changes: [
        { label: 'Băng thông khả dụng', from: '15.0 Mbps (Wifi)', to: '1.2 Mbps (Sóng yếu)' },
        { label: 'Thời gian tải segment', from: '0.45 giây', to: '4.80 giây' },
        { label: 'Cảnh báo ABR', from: 'An toàn', to: 'Phát hiện nguy cơ cạn Buffer' }
      ],
      takeaways: [
        'ABR liên tục đo lường tốc độ truyền tải thực tế (Throughput-based adaptation).',
        'Phát hiện suy giảm băng thông trước khi video bị đứng hình.'
      ],
      activeNodes: ['player-client', 'cdn-edge-pop'],
      activeConnections: ['conn-client-edge'],
      packetType: 'upload',
      inspector: {
        type: 'event',
        title: 'ABR Controller: Bandwidth Drop Alert',
        badge: 'ABR Warning',
        badgeColor: '#f59e0b',
        latency: '1.2ms',
        content: `[hls.js ABR] Bandwidth dropped: 15,200 kbps -> 1,180 kbps\nTarget Bitrate 720p (2,500 kbps) > Available (1,180 kbps)\nDecision: Downswitch quality to 360p (800 kbps) for next segment.`
      }
    },
    {
      id: 5,
      title: 'Tự Chuyển Phân Giải Thích Ứng (ABR Seamless Downswitch)',
      subtitle: 'Player tự động yêu cầu seg_360p_004.ts: Video phát liên tục không khựng giật',
      desc: 'Thuật toán ABR lập tức can thiệp: phân đoạn kế tiếp được yêu cầu là seg_360p_004.ts (800 kbps) thay vì 720p. Nhờ các I-Frame đã được căn chỉnh đồng bộ từ bước encode, việc đổi phân giải diễn ra hoàn toàn vô hình, người xem không hề bị dừng hình (Zero Rebuffering).',
      insight: 'Người xem sẵn sàng chấp nhận video hơi mờ đi một chút (360p) trong lúc mạng yếu, còn hơn là video bị đứng hình hoàn toàn.',
      changes: [
        { label: 'Phân đoạn tiếp theo', from: 'seg_720p_004.ts', to: 'seg_360p_004.ts' },
        { label: 'Độ trễ chuyển luồng', from: 'Dừng hình quay tròn', to: '0 frame trễ (Chuyển mượt mà)' },
        { label: 'Trải nghiệm người xem', from: 'Bực bội vì đứng hình', to: 'Phát liên tục không ngắt quãng' }
      ],
      takeaways: [
        'Adaptive Bitrate Streaming (ABR) là vũ khí tối thượng mang lại trải nghiệm xem video êm ái trên YouTube.',
        'Đồng bộ I-Frame tại tầng mã hóa phát huy giá trị tuyệt đối tại thời điểm chuyển đổi.'
      ],
      activeNodes: ['player-client', 'cdn-edge-pop'],
      activeConnections: ['conn-client-edge'],
      packetType: 'cdn',
      inspector: {
        type: 'hls',
        title: 'Seamless ABR Switch to 360p Stream',
        badge: 'Seamless Switch (0ms buffer)',
        badgeColor: '#16a34a',
        latency: '22ms',
        content: `GET /hls/v-yt-9182/seg_360p_004.ts HTTP/2\nContent-Length: 598400 bytes (~584 KB)\n\nSwitch Status: SUCCESS\nKeyframe PTS match: 18.000s\nRebuffering Events: 0\nUser Experience: Continuous uninterrupted playback.`
      }
    }
  ]
};

const ALL_SCENARIOS: SimulationScenario[] = [
  SCENARIO_OVERVIEW,
  SCENARIO_DEEP_UPLOAD,
  SCENARIO_DEEP_TRANSCODE,
  SCENARIO_DEEP_CACHE,
  SCENARIO_DEEP_COMPLETION,
  SCENARIO_DEEP_STREAMING
];

/* ============================================================
   MAIN COMPONENT: INTERACTIVE ARCHITECTURE SIMULATOR
============================================================ */

export const InteractiveArchitectureSimulator: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>('overview');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [revealMode, setRevealMode] = useState<'progressive' | 'step_only' | 'all'>('progressive');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = ALL_SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIO_OVERVIEW;
  const stepData = scenario.steps[currentStep - 1] || scenario.steps[0];

  // Progressive Reveal Sets
  const { revealedNodeIds, revealedConnIds } = React.useMemo(() => {
    if (revealMode === 'all') {
      return {
        revealedNodeIds: new Set(scenario.nodes.map((n) => n.id)),
        revealedConnIds: new Set(scenario.connections.map((c) => c.id)),
      };
    }

    if (revealMode === 'step_only') {
      return {
        revealedNodeIds: new Set(stepData.activeNodes),
        revealedConnIds: new Set(stepData.activeConnections),
      };
    }

    // Default 'progressive' mode: accumulate all nodes and connections up to currentStep
    const nodeSet = new Set<string>();
    const connSet = new Set<string>();

    for (let i = 0; i < currentStep; i++) {
      const s = scenario.steps[i];
      if (s) {
        s.activeNodes.forEach((id) => nodeSet.add(id));
        s.activeConnections.forEach((id) => connSet.add(id));
      }
    }

    return { revealedNodeIds: nodeSet, revealedConnIds: connSet };
  }, [scenario, currentStep, stepData, revealMode]);

  // Identify nodes that appear for the FIRST time in the current step
  const newlyRevealedNodes = React.useMemo(() => {
    if (currentStep === 1) return new Set(stepData.activeNodes);
    const priorSet = new Set<string>();
    for (let i = 0; i < currentStep - 1; i++) {
      scenario.steps[i]?.activeNodes.forEach((id) => priorSet.add(id));
    }
    return new Set(stepData.activeNodes.filter((id) => !priorSet.has(id)));
  }, [scenario, currentStep, stepData]);

  // When changing scenario, reset step to 1
  const handleSelectScenario = (id: ScenarioId) => {
    setSelectedScenarioId(id);
    setCurrentStep(1);
    setIsPlaying(true);
  };

  // Auto-play timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isPlaying) {
      const intervalMs = speed === 1 ? 4800 : 2500;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev < scenario.steps.length ? prev + 1 : 1));
      }, intervalMs);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, scenario.steps.length]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, scenario.steps.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  const renderScenarioButtonIcon = (id: ScenarioId, isSelected: boolean) => {
    const stroke = isSelected ? '#ffffff' : '#18181b';
    switch (id) {
      case 'overview':
        return (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" fill={isSelected ? '#3b82f6' : '#dbeafe'} />
            <path d="M7 16 C5 16, 5 13, 7 12 C6 9, 10 8, 12 9 C13 7, 18 7, 19 9 C21 8, 24 10, 23 13 C25 14, 24 16, 22 16 Z" fill="#38bdf8" stroke={stroke} strokeWidth="1.2" />
            <rect x="14" y="19" width="12" height="7" rx="1.5" fill="#22c55e" stroke={stroke} strokeWidth="1.2" />
            <circle cx="17" cy="22.5" r="1" fill="#ffffff" />
            <path d="M12 16 L12 22 L14 22" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        );
      case 'deep_upload':
        return (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" fill={isSelected ? '#ef4444' : '#fee2e2'} />
            <rect x="6" y="18" width="5" height="7" rx="1" fill="#38bdf8" stroke={stroke} strokeWidth="1" />
            <rect x="13.5" y="18" width="5" height="7" rx="1" fill="#f59e0b" stroke={stroke} strokeWidth="1" />
            <rect x="21" y="18" width="5" height="7" rx="1" fill="#22c55e" stroke={stroke} strokeWidth="1" />
            <path d="M16 14 L16 6 M12 9 L16 5 L20 9" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'deep_transcode':
        return (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" fill={isSelected ? '#eab308' : '#fef9c3'} />
            <rect x="7" y="7" width="18" height="18" rx="3" fill="#18181b" stroke={stroke} strokeWidth="1.2" />
            <rect x="10" y="10" width="12" height="12" rx="2" fill="#facc15" />
            <circle cx="16" cy="16" r="3.5" fill="#18181b" />
            <polygon points="16,13.5 17,15 18.5,15.5 17.5,16.5 18,18 16,17 14,18 14.5,16.5 13.5,15.5 15,15" fill="#facc15" />
          </svg>
        );
      case 'deep_cache':
        return (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" fill={isSelected ? '#ef4444' : '#fee2e2'} />
            <polygon points="16,6 24,12 16,18 8,12" fill="#ef4444" stroke={stroke} strokeWidth="1" />
            <polygon points="8,12 16,18 16,24 8,18" fill="#b91c1c" stroke={stroke} strokeWidth="1" />
            <polygon points="16,18 24,12 24,18 16,24" fill="#7f1d1d" stroke={stroke} strokeWidth="1" />
            <polygon points="16.5,8 13.5,14 16,14 14.5,19 19,13 16.5,13" fill="#facc15" stroke={stroke} strokeWidth="0.8" />
          </svg>
        );
      case 'deep_completion':
        return (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" fill={isSelected ? '#a855f7' : '#f3e8ff'} />
            <g transform="translate(4, 2)">
              <rect x="2" y="6" width="10" height="7" rx="1" fill="#ddd6fe" stroke={stroke} strokeWidth="0.8" />
              <path d="M2 6 L7 9.5 L12 6" stroke={stroke} strokeWidth="0.8" />
            </g>
            <g transform="translate(12, 2)">
              <rect x="2" y="6" width="10" height="7" rx="1" fill="#ddd6fe" stroke={stroke} strokeWidth="0.8" />
              <path d="M2 6 L7 9.5 L12 6" stroke={stroke} strokeWidth="0.8" />
            </g>
            <g transform="translate(8, 12)">
              <rect x="0" y="2" width="16" height="10" rx="1.5" fill="#a855f7" stroke={stroke} strokeWidth="1.2" />
              <polygon points="0,2 8,7 16,2" fill="#f3e8ff" stroke={stroke} strokeWidth="1" />
            </g>
          </svg>
        );
      case 'deep_streaming':
        return (
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="2" width="28" height="28" rx="8" fill={isSelected ? '#10b981' : '#d1fae5'} />
            <rect x="6" y="8" width="20" height="14" rx="2.5" fill="#18181b" stroke={stroke} strokeWidth="1.2" />
            <polygon points="10,12 10,18 15,15" fill="#ef4444" />
            <rect x="18" y="16" width="1.5" height="3" fill="#4ade80" />
            <rect x="20.5" y="14" width="1.5" height="5" fill="#4ade80" />
            <rect x="23" y="11" width="1.5" height="8" fill="#4ade80" />
          </svg>
        );
    }
  };

  return (
    <div style={{ padding: '0.75rem 0 3rem' }}>
      {/* ============================================================
          TOP SCENARIOS TAB BAR (Cho phép chọn Tổng Quan hoặc Đi Sâu)
      ============================================================ */}
      <div style={{
        background: theme === 'light' ? '#f5f0e8' : '#18181b',
        border: `1.5px solid ${theme === 'light' ? '#e2d9cc' : '#27272a'}`,
        borderRadius: '16px',
        padding: '0.65rem 0.85rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        boxShadow: theme === 'light' ? '0 4px 16px rgba(0,0,0,0.03)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#ef4444',
            color: '#fff',
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={13} />
            <span>MÔ PHỎNG KIẾN TRÚC & REQUEST</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: theme === 'light' ? '#78716c' : '#a1a1aa', fontWeight: 600 }}>
            Chọn kịch bản để khám phá từ Tổng quan đến Chi tiết từng Request:
          </span>
        </div>

        {/* Action Controls: Theme toggle & Back home */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              background: theme === 'light' ? '#ffffff' : '#27272a',
              color: theme === 'light' ? '#18181b' : '#ffffff',
              padding: '6px 10px',
              borderRadius: '8px',
              border: `1.2px solid ${theme === 'light' ? '#18181b' : '#3f3f46'}`,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
            title={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng chuẩn hình mẫu'}
          >
            {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
            <span>{theme === 'light' ? 'Tối' : 'Sáng'}</span>
          </button>

          <button
            onClick={onBackToHome}
            style={{
              background: '#ffffff',
              color: '#18181b',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1.5px solid #18181b',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Quay lại danh sách video"
          >
            ← Trang Chủ
          </button>
        </div>
      </div>

      {/* Scenario Pill Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        {ALL_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              style={{
                background: isSelected 
                  ? (theme === 'light' ? '#18181b' : '#ffffff') 
                  : (theme === 'light' ? '#ffffff' : '#27272a'),
                color: isSelected 
                  ? (theme === 'light' ? '#ffffff' : '#18181b') 
                  : (theme === 'light' ? '#44403c' : '#cbd5e1'),
                border: isSelected ? '2px solid #18181b' : `1.2px solid ${theme === 'light' ? '#e2d9cc' : '#3f3f46'}`,
                borderRadius: '12px',
                padding: '8px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div style={{ flexShrink: 0 }}>
                {renderScenarioButtonIcon(sc.id, isSelected)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, opacity: 0.7, textTransform: 'uppercase' }}>
                  {sc.badgeNumber}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sc.menuTitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          TOP BANNER & TELEMETRY BAR FOR CURRENT SCENARIO
      ============================================================ */}
      <div style={{
        background: theme === 'light' ? '#f5f0e8' : '#1e1e24',
        border: `1.5px solid ${theme === 'light' ? '#e2d9cc' : '#333'}`,
        borderRadius: '14px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: theme === 'light' ? '#78716c' : '#a1a1aa', fontWeight: 700 }}>
            {scenario.category} &bull; Bước {currentStep} / {scenario.steps.length}
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: theme === 'light' ? '#1c1917' : '#f8fafc', marginTop: '2px' }}>
            {scenario.title}
          </h1>
          <div style={{ fontSize: '0.78rem', color: theme === 'light' ? '#57534e' : '#94a3b8' }}>
            {scenario.tagline}
          </div>
        </div>

        {/* Real-time system metrics pills */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {scenario.metrics.map((m, idx) => (
            <div key={idx} style={{
              background: theme === 'light' ? '#ffffff' : '#27272a',
              border: '1.2px solid #18181b',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.75rem'
            }}>
              <span style={{ color: '#78716c', fontSize: '0.7rem' }}>{m.label}: </span>
              <strong style={{ color: m.color || (theme === 'light' ? '#000' : '#fff') }}>{m.value}</strong>
            </div>
          ))}

          {/* Mode switch: Progressive (Step-by-Step reveal) vs Step-Only vs Full */}
          <div style={{
            display: 'inline-flex',
            background: theme === 'light' ? '#ffffff' : '#27272a',
            border: '1.5px solid #18181b',
            borderRadius: '8px',
            padding: '2px',
            gap: '2px',
            marginLeft: '0.2rem'
          }}>
            <button
              onClick={() => setRevealMode('progressive')}
              style={{
                background: revealMode === 'progressive' ? '#18181b' : 'transparent',
                color: revealMode === 'progressive' ? '#ffffff' : (theme === 'light' ? '#18181b' : '#a1a1aa'),
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              title="Hiện từng bước: Đến bước nào thì khối đó mới hiện ra (Khuyên dùng)"
            >
              <Eye size={11} color={revealMode === 'progressive' ? '#facc15' : 'currentColor'} />
              <span>Hiện từng bước</span>
            </button>

            <button
              onClick={() => setRevealMode('step_only')}
              style={{
                background: revealMode === 'step_only' ? '#18181b' : 'transparent',
                color: revealMode === 'step_only' ? '#ffffff' : (theme === 'light' ? '#18181b' : '#a1a1aa'),
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              title="Chỉ hiển thị các khối tham gia trong bước này"
            >
              <Target size={11} />
              <span>Chỉ bước này</span>
            </button>

            <button
              onClick={() => setRevealMode('all')}
              style={{
                background: revealMode === 'all' ? '#18181b' : 'transparent',
                color: revealMode === 'all' ? '#ffffff' : (theme === 'light' ? '#18181b' : '#a1a1aa'),
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              title="Hiển thị toàn bộ kiến trúc"
            >
              <Layers size={11} />
              <span>Toàn bộ</span>
            </button>
          </div>

          {/* Controls: Play/Pause, Speed, Reset */}
          <div style={{ display: 'flex', gap: '0.35rem', marginLeft: '0.4rem' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? '#18181b' : '#ffffff',
                color: isPlaying ? '#ffffff' : '#18181b',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid #18181b',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title={isPlaying ? 'Tạm dừng mô phỏng' : 'Tự động chạy các bước'}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Tạm dừng' : 'Phát tiếp'}</span>
            </button>

            <button
              onClick={() => setSpeed(speed === 1 ? 1.5 : 1)}
              style={{
                background: '#ffffff',
                color: '#18181b',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1.5px solid #18181b',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Điều chỉnh tốc độ diễn hoạt"
            >
              {speed}x
            </button>

            <button
              onClick={handleReset}
              style={{
                background: '#ffffff',
                color: '#18181b',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1.5px solid #18181b',
                cursor: 'pointer'
              }}
              title="Đặt lại về bước 1"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN GRID: 3D ISOMETRIC CANVAS (LEFT) & EXPLANATORY PANEL (RIGHT)
      ============================================================ */}
      <div className="sim-main-grid" style={{ alignItems: 'start' }}>
        
        {/* Left: 3D Isometric SVG Stage */}
        <div style={{
          background: theme === 'light' ? '#fbf8f2' : '#0f1117',
          border: `2px solid ${theme === 'light' ? '#e5ddd0' : '#27272a'}`,
          borderRadius: '16px',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '520px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: theme === 'light' ? '0 8px 30px rgba(0,0,0,0.04)' : '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          {/* Subtle Isometric Grid Texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(${theme === 'light' ? '#d6cfc4' : '#27272a'} 1.2px, transparent 1.2px)`,
            backgroundSize: '24px 24px',
            opacity: theme === 'light' ? 0.6 : 0.35,
            pointerEvents: 'none'
          }} />

          {/* Scenario Zone Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2, marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#b91c1c', background: '#fee2e2', border: '1.2px solid #ef4444', padding: '2px 10px', borderRadius: '12px', fontWeight: 800 }}>
              {scenario.badgeRed}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#1d4ed8', background: '#dbeafe', border: '1.2px solid #3b82f6', padding: '2px 10px', borderRadius: '12px', fontWeight: 800 }}>
              {scenario.badgeBlue}
            </span>
          </div>

          {/* SVG 3D Canvas Stage */}
          <div className="sim-svg-stage-wrap" style={{ position: 'relative', width: '100%', zIndex: 3 }}>
            <svg
              viewBox="0 0 960 480"
              style={{ width: '100%', height: 'auto', maxHeight: '520px', overflow: 'visible' }}
            >
              {/* ============================================================
                  SUPER-VIBRANT 3D ISOMETRIC COLOR GRADIENTS & SHADOW DEFINITIONS
              ============================================================ */}
              <defs>
                <linearGradient id="grad-bucket-green" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <linearGradient id="grad-bucket-red" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
                <linearGradient id="grad-gold-chip" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="grad-cdn-cloud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="grad-redis-ruby" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id="grad-lb-blue" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="grad-queue-purple" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#6b21a8" />
                </linearGradient>
                <linearGradient id="grad-handler-violet" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#4c1d95" />
                </linearGradient>
                <linearGradient id="grad-demux-prism" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* ============================================================
                  ISOMETRIC CONNECTING PATHWAYS (Progressive Reveal)
              ============================================================ */}
              {scenario.connections.map((conn) => {
                const isRevealed = revealedConnIds.has(conn.id);
                const isActive = stepData.activeConnections.includes(conn.id);

                if (!isRevealed) return null;

                return (
                  <g key={conn.id} style={{
                    opacity: isActive ? 1 : 0.45,
                    transition: 'opacity 0.4s ease'
                  }}>
                    {/* Glowing highlight aura under active wire */}
                    {isActive && (
                      <path
                        d={conn.pathD}
                        fill="none"
                        stroke={conn.packetColor || '#38bdf8'}
                        strokeWidth="5"
                        strokeLinecap="round"
                        opacity="0.3"
                      />
                    )}
                    <path
                      id={`wire-${conn.id}`}
                      d={conn.pathD}
                      fill="none"
                      stroke="#18181b"
                      strokeWidth={isActive ? '2.5' : '1.8'}
                      strokeDasharray={isActive ? '6 4' : 'none'}
                    />
                  </g>
                );
              })}

              {/* ============================================================
                  ANIMATED ROLLING PACKET BALLS ALONG PATHWAYS
                  (Native SVG animateMotion for 100% smooth continuous roll)
              ============================================================ */}
              {scenario.connections.map((conn) => {
                const isRevealed = revealedConnIds.has(conn.id);
                const isActive = stepData.activeConnections.includes(conn.id);
                if (!isRevealed || !isActive) return null;

                const ballColor = conn.packetColor || '#ef4444';
                const duration = speed === 1 ? '1.5s' : '0.9s';

                return (
                  <g key={`ball-${conn.id}`}>
                    <circle r="7.5" fill={ballColor} opacity="0.35">
                      <animateMotion dur={duration} repeatCount="indefinite" path={conn.pathD} />
                    </circle>
                    <circle r="5" fill={ballColor} stroke="#18181b" strokeWidth="1.5">
                      <animateMotion dur={duration} repeatCount="indefinite" path={conn.pathD} />
                    </circle>
                  </g>
                );
              })}

              {/* ============================================================
                  3D ISOMETRIC NODES & PLATFORMS (Progressive Reveal)
              ============================================================ */}
              {scenario.nodes.map((node) => {
                const isRevealed = revealedNodeIds.has(node.id);
                const isActive = stepData.activeNodes.includes(node.id);
                const isNew = newlyRevealedNodes.has(node.id);

                return (
                  <g
                    key={node.id}
                    style={{
                      opacity: isRevealed ? (isActive ? 1 : 0.85) : 0,
                      transform: isRevealed ? 'scale(1) translateY(0px)' : 'scale(0.72) translateY(24px)',
                      transformOrigin: `${node.cx}px ${node.cy}px`,
                      transition: 'all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      pointerEvents: isRevealed ? 'auto' : 'none',
                      visibility: isRevealed ? 'visible' : 'hidden',
                    }}
                  >
                    {node.isPlatform ? (
                      <IsometricClientPlatform
                        cx={node.cx}
                        cy={node.cy}
                        theme={theme}
                        label={node.platformLabel}
                        badge={node.platformBadge}
                      />
                    ) : (
                      <Isometric3DHexBlock
                        cx={node.cx}
                        cy={node.cy}
                        rx={node.rx || 58}
                        ry={node.ry || 32}
                        depth={node.depth || 18}
                        topColor={node.topColor}
                        leftColor={node.leftColor}
                        rightColor={node.rightColor}
                        strokeColor="#18181b"
                        label={node.label}
                        subLabel={node.subLabel}
                        badge={node.badge}
                        metric={node.metric}
                        iconType={node.iconType}
                        isActive={isActive}
                        theme={theme}
                      />
                    )}

                    {/* NEWLY REVEALED POP BADGE (BẬT LÊN KHI VỪA XUẤT HIỆN Ở BƯỚC NÀY) */}
                    {isRevealed && isNew && currentStep > 1 && (
                      <g transform={`translate(${node.cx + (node.rx || 58) - 10}, ${node.cy - (node.ry || 32) - 16})`}>
                        <rect
                          x="-18"
                          y="-8"
                          width="36"
                          height="16"
                          rx="8"
                          fill="#ef4444"
                          stroke="#18181b"
                          strokeWidth="1.2"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fontSize="7.5"
                          fontWeight="900"
                          fill="#ffffff"
                          letterSpacing="0.3px"
                        >
                          MỚI ⭐
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Color Legend (Bottom of Canvas matching reference) */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.25rem',
            paddingTop: '0.6rem',
            borderTop: `1.5px solid ${theme === 'light' ? '#e5ddd0' : '#27272a'}`,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: theme === 'light' ? '#44403c' : '#cbd5e1',
            flexWrap: 'wrap',
            zIndex: 3
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444', border: '1px solid #18181b' }} />
              Dữ liệu Video nhị phân
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#38bdf8', border: '1px solid #18181b' }} />
              API Request JSON (Metadata)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b', border: '1px solid #18181b' }} />
              Tác vụ Hàng đợi Worker
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22c55e', border: '1px solid #18181b' }} />
              HLS Stream Cache HIT
            </span>
          </div>
        </div>

        {/* Right: Explanatory & Step Guidance Panel (Matching user reference layout) */}
        <div style={{
          background: theme === 'light' ? '#fbf8f2' : '#0f1117',
          border: `2px solid ${theme === 'light' ? '#e5ddd0' : '#27272a'}`,
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: theme === 'light' ? '0 8px 30px rgba(0,0,0,0.04)' : '0 8px 30px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Header Step Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              BƯỚC {currentStep} / {scenario.steps.length}
            </span>
            <span style={{
              background: '#18181b',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              letterSpacing: '0.5px'
            }}>
              KỸ THUẬT
            </span>
          </div>

          {/* Step Main Title & Subtitle */}
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: theme === 'light' ? '#18181b' : '#f8fafc', lineHeight: '1.3' }}>
              {stepData.title}
            </h2>
            <p style={{ fontSize: '0.78rem', color: theme === 'light' ? '#57534e' : '#94a3b8', marginTop: '4px', fontWeight: 600 }}>
              {stepData.subtitle}
            </p>
          </div>

          {/* Description */}
          <div style={{ fontSize: '0.8rem', color: theme === 'light' ? '#292524' : '#e2e8f0', lineHeight: '1.5' }}>
            {stepData.desc}
          </div>

          {/* Technical Insight Box (NÊN BIẾT - Lightbulb Box) */}
          <div style={{
            background: theme === 'light' ? '#f5f0e8' : '#18181b',
            border: `1.5px solid ${theme === 'light' ? '#e2d9cc' : '#27272a'}`,
            borderRadius: '10px',
            padding: '0.75rem 0.85rem',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.9rem' }}>💡</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: theme === 'light' ? '#44403c' : '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                NÊN BIẾT TRONG THIẾT KẾ:
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: theme === 'light' ? '#57534e' : '#a1a1aa', lineHeight: '1.45' }}>
              {stepData.insight}
            </div>
          </div>

          {/* LIVE REQUEST / PAYLOAD INSPECTOR BOX */}
          {stepData.inspector && (
            <div style={{
              background: theme === 'light' ? '#1c1917' : '#09090b',
              border: '1.5px solid #18181b',
              borderRadius: '10px',
              padding: '0.75rem 0.85rem',
              color: '#f8fafc',
              fontFamily: 'monospace'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', borderBottom: '1px solid #333', paddingBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={12} color="#38bdf8" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#e2e8f0' }}>
                    {stepData.inspector.title}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {stepData.inspector.latency && (
                    <span style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 700 }}>
                      {stepData.inspector.latency}
                    </span>
                  )}
                  <span style={{
                    fontSize: '0.65rem',
                    background: stepData.inspector.badgeColor,
                    color: '#fff',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {stepData.inspector.badge}
                  </span>
                </div>
              </div>
              <pre style={{
                margin: 0,
                fontSize: '0.7rem',
                lineHeight: '1.4',
                color: '#cbd5e1',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {stepData.inspector.content}
              </pre>
            </div>
          )}

          {/* Changes Delta (ĐIỀU ĐÃ THAY ĐỔI) */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#78716c', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.4px' }}>
              ĐIỀU ĐÃ THAY ĐỔI:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {stepData.changes.map((c, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: theme === 'light' ? '#f5f0e8' : '#18181b',
                  border: `1px solid ${theme === 'light' ? '#e2d9cc' : '#27272a'}`
                }}>
                  <span style={{ color: theme === 'light' ? '#57534e' : '#a1a1aa', fontWeight: 600 }}>{c.label}:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
                    <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>{c.from}</span>
                    <span style={{ color: '#78716c' }}>&rarr;</span>
                    <strong style={{ color: '#16a34a' }}>{c.to}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons (Back & Next) */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: theme === 'light' ? '#ffffff' : '#27272a',
                color: theme === 'light' ? '#18181b' : '#ffffff',
                border: '1.5px solid #18181b',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 1 ? 0.45 : 1
              }}
            >
              <ArrowLeft size={13} />
              <span>Quay lại</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === scenario.steps.length}
              style={{
                flex: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: currentStep === scenario.steps.length ? '#16a34a' : '#ef4444',
                color: '#ffffff',
                border: '1.5px solid #18181b',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: currentStep === scenario.steps.length ? 'default' : 'pointer',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
              }}
            >
              <span>{currentStep < scenario.steps.length ? `Tiếp: Bước ${currentStep + 1}` : 'Hoàn tất kịch bản'}</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Key Takeaways */}
          <div style={{ borderTop: `1px solid ${theme === 'light' ? '#e2d9cc' : '#3f3f46'}`, paddingTop: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#78716c', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              BẠN SẼ HỌC:
            </div>
            {stepData.takeaways.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.76rem', color: theme === 'light' ? '#44403c' : '#cbd5e1', marginBottom: '0.3rem' }}>
                <CheckCircle2 size={13} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          STEP TIMELINE AT BOTTOM (Numbered Stepper 1..N)
      ============================================================ */}
      <div style={{
        marginTop: '1.25rem',
        background: theme === 'light' ? '#f5f0e8' : '#18181b',
        border: `1.5px solid ${theme === 'light' ? '#e2d9cc' : '#27272a'}`,
        borderRadius: '16px',
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: theme === 'light' ? '#44403c' : '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            TRONG BÀI NÀY ({scenario.title}):
          </div>
          <div style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 600 }}>
            Bước {currentStep} / {scenario.steps.length}
          </div>
        </div>

        {/* Stepper Circles */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${scenario.steps.length}, 1fr)`, gap: '0.5rem', position: 'relative' }}>
          {scenario.steps.map((s) => {
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;

            return (
              <div
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  gap: '0.4rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  transition: 'all 0.2s ease',
                  background: isCurrent ? '#ef4444' : isCompleted ? '#22c55e' : (theme === 'light' ? '#ffffff' : '#27272a'),
                  color: isCurrent || isCompleted ? '#ffffff' : '#78716c',
                  border: isCurrent ? '2px solid #18181b' : isCompleted ? '1.5px solid #16a34a' : '1.5px solid #18181b',
                  boxShadow: isCurrent ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none',
                }}>
                  {isCompleted ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: isCurrent ? (theme === 'light' ? '#18181b' : '#ffffff') : '#78716c',
                  fontWeight: isCurrent ? 800 : 600,
                  lineHeight: '1.3'
                }}>
                  {s.title.split('&')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
