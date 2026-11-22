import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, ArrowRight, ArrowLeft, 
  CheckCircle2, Sun, Moon
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
  iconType?: 'server' | 'storage' | 'cpu' | 'cdn' | 'queue' | 'redis' | 'db';
  isActive?: boolean;
  theme?: 'light' | 'dark';
}

const Isometric3DHexBlock: React.FC<IsometricBlockProps> = ({
  cx,
  cy,
  rx = 52,
  ry = 28,
  depth = 22,
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

      {/* Inner Icon / Micro Hardware Details on Top Face */}
      {iconType === 'server' && (
        <g opacity={theme === 'light' ? '0.75' : '0.9'}>
          <rect x={cx - 15} y={cy - 12} width="30" height="4" rx="1.5" fill={strokeColor} />
          <circle cx={cx - 11} cy={cy - 10} r="1" fill="#4ade80" />
          <rect x={cx - 15} y={cy - 6} width="30" height="4" rx="1.5" fill={strokeColor} />
          <circle cx={cx - 11} cy={cy - 4} r="1" fill="#38bdf8" />
        </g>
      )}

      {iconType === 'storage' && (
        <g opacity={theme === 'light' ? '0.8' : '0.95'}>
          <ellipse cx={cx} cy={cy - 8} rx="12" ry="3.5" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <path d={`M${cx - 12} ${cy - 8} V${cy - 2} C${cx - 12} ${cy + 1} ${cx + 12} ${cy + 1} ${cx + 12} ${cy - 2} V${cy - 8}`} fill="none" stroke={strokeColor} strokeWidth="1.5" />
        </g>
      )}

      {iconType === 'cpu' && (
        <g opacity={theme === 'light' ? '0.85' : '0.95'}>
          <rect x={cx - 10} y={cy - 12} width="20" height="12" rx="2" fill={strokeColor} />
          <circle cx={cx} cy={cy - 6} r="2.5" fill="#facc15" />
        </g>
      )}

      {iconType === 'cdn' && (
        <g opacity={theme === 'light' ? '0.8' : '0.95'}>
          <circle cx={cx} cy={cy - 7} r="7" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <ellipse cx={cx} cy={cy - 7} rx="3.5" ry="7" fill="none" stroke={strokeColor} strokeWidth="1" />
          <line x1={cx - 7} y1={cy - 7} x2={cx + 7} y2={cy - 7} stroke={strokeColor} strokeWidth="1" />
        </g>
      )}

      {iconType === 'redis' && (
        <g opacity={theme === 'light' ? '0.85' : '0.95'}>
          <polygon points={`${cx},${cy - 14} ${cx + 7},${cy - 8} ${cx},${cy - 2} ${cx - 7},${cy - 8}`} fill="#ef4444" stroke={strokeColor} strokeWidth="1" />
          <polygon points={`${cx},${cy - 11} ${cx - 2},${cy - 7} ${cx + 1},${cy - 7} ${cx - 1},${cy - 3} ${cx + 3},${cy - 8} ${cx},${cy - 8}`} fill="#facc15" />
        </g>
      )}

      {iconType === 'db' && (
        <g opacity={theme === 'light' ? '0.8' : '0.95'}>
          <ellipse cx={cx} cy={cy - 11} rx="10" ry="3" fill="none" stroke={strokeColor} strokeWidth="1.3" />
          <path d={`M${cx - 10} ${cy - 11} V${cy - 6} C${cx - 10} ${cy - 4} ${cx + 10} ${cy - 4} ${cx + 10} ${cy - 6} V${cy - 11}`} fill="none" stroke={strokeColor} strokeWidth="1.3" />
          <path d={`M${cx - 10} ${cy - 6} V${cy - 1} C${cx - 10} ${cy + 1} ${cx + 10} ${cy + 1} ${cx + 10} ${cy - 1} V${cy - 6}`} fill="none" stroke={strokeColor} strokeWidth="1.3" />
        </g>
      )}

      {iconType === 'queue' && (
        <g opacity={theme === 'light' ? '0.85' : '0.95'}>
          <rect x={cx - 14} y={cy - 11} width="28" height="8" rx="2" fill="none" stroke={strokeColor} strokeWidth="1.3" />
          <rect x={cx - 11} y={cy - 9} width="4" height="4" rx="1" fill="#f59e0b" />
          <rect x={cx - 4} y={cy - 9} width="4" height="4" rx="1" fill="#f59e0b" />
          <rect x={cx + 3} y={cy - 9} width="4" height="4" rx="1" fill="#f59e0b" />
        </g>
      )}

      {/* Main Label on Top Face */}
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill={textColor}
        fontFamily="inherit"
      >
        {label}
      </text>

      {subLabel && (
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fontSize="8"
          fontWeight="600"
          fill={theme === 'light' ? '#52525b' : '#94a3b8'}
          fontFamily="inherit"
        >
          {subLabel}
        </text>
      )}

      {/* Floating 3D Badge 1 (Above Node) */}
      {badge && (
        <g transform={`translate(${cx}, ${cy - ry - (metric ? 24 : 14)})`}>
          <rect
            x="-44"
            y="-9"
            width="88"
            height="18"
            rx="9"
            fill={pillBg}
            stroke={strokeColor}
            strokeWidth="1.4"
          />
          <text
            x="0"
            y="3.5"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="700"
            fill={textColor}
          >
            {badge}
          </text>
        </g>
      )}

      {/* Floating 3D Badge 2 (Metric / Progress) */}
      {metric && (
        <g transform={`translate(${cx}, ${cy - ry - 6})`}>
          <rect
            x="-38"
            y="-8"
            width="76"
            height="16"
            rx="8"
            fill={pillBg}
            stroke={strokeColor}
            strokeWidth="1.3"
          />
          <circle cx="-26" cy="0" r="2.5" fill="#22c55e" />
          <text
            x="3"
            y="3"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill={textColor}
          >
            {metric}
          </text>
        </g>
      )}
    </g>
  );
};

/* ============================================================
   3D ISOMETRIC CLIENT PLATFORM (Bàn cờ nghiêng với các User Pawns)
============================================================ */

const IsometricClientPlatform: React.FC<{ cx: number; cy: number; theme: 'light' | 'dark' }> = ({ cx, cy, theme }) => {
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

      {/* User Pawns standing on the platform */}
      {pawnColors.map((color, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const px = cx - 35 + col * 24 + (row % 2) * 8;
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

      {/* Floating Badge Below Platform */}
      <g transform={`translate(${cx}, ${cy + depth + 18})`}>
        <rect
          x="-55"
          y="-10"
          width="110"
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
          fontSize="9.5"
          fontWeight="800"
          fill={theme === 'light' ? '#18181b' : '#f8fafc'}
        >
          👥 100.000 người dùng
        </text>
      </g>
    </g>
  );
};

/* ============================================================
   STEP DATA & WORKFLOW CONFIGURATION
============================================================ */

interface StepDetail {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  insight: string;
  changes: { label: string; from: string; to: string }[];
  takeaways: string[];
  activeNodes: string[];
  activeConnections: string[];
  packetType: 'upload' | 'meta' | 'transcode' | 'completion' | 'cdn';
}

const STEPS: StepDetail[] = [
  {
    id: 1,
    title: 'Khởi Tạo Upload & Tách Hai Tuyến',
    subtitle: 'Tách luồng dữ liệu nặng (Video Path) và luồng điều khiển nhẹ (Metadata Path)',
    desc: 'Khi Client bắt đầu tải video lên, kiến trúc phân tách ngay lập tức: Tệp nhị phân video dung lượng lớn được chuyển thẳng vào Original Storage, trong khi metadata (tiêu đề, định dạng, tác giả) gửi qua API Server.',
    insight: 'Sai lầm phổ biến nhất trong hệ thống mới thiết kế là cho API Server nhận toàn bộ video vào RAM rồi mới xử lý, dẫn đến nghẽn socket và cạn kiệt bộ nhớ.',
    changes: [
      { label: 'Luồng dữ liệu', from: 'Gộp chung', to: 'Tách độc lập 2 tuyến' },
      { label: 'Tải API Server', from: 'Gánh cả file 500MB', to: 'Chỉ nhận JSON metadata' },
      { label: 'Băng thông Storage', from: 'Chờ API trung chuyển', to: 'Tiếp nhận trực tiếp' }
    ],
    takeaways: [
      'Video Data Path và Metadata Path hoạt động hoàn toàn độc lập.',
      'API Server được bảo vệ tuyệt đối khỏi tải I/O tệp nặng.'
    ],
    activeNodes: ['client', 'orig-storage', 'api-server'],
    activeConnections: ['conn-client-orig', 'conn-client-api'],
    packetType: 'upload'
  },
  {
    id: 2,
    title: 'Tiếp Nhận Bất Đồng Bộ (HTTP 202 Accepted)',
    subtitle: 'Giải phóng kết nối Client trong vòng ~18ms, tránh giữ kết nối chờ đợi',
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
    activeNodes: ['api-server', 'redis', 'sqlite', 'queue'],
    activeConnections: ['conn-api-db', 'conn-api-redis', 'conn-api-queue'],
    packetType: 'meta'
  },
  {
    id: 3,
    title: 'Hàng Đợi Điều Phối & Worker Kéo Việc',
    subtitle: 'Phân phối tác vụ chuyển mã cho cụm Transcoding Worker theo thứ tự',
    desc: 'Task chuyển mã nằm trong Hàng đợi (Queue). Khi Transcoding Worker sẵn sàng, Worker sẽ lấy task, tải tệp video gốc từ Original Storage về thư mục làm việc để chuẩn bị encode.',
    insight: 'Hàng đợi giúp hấp thụ đột biến tải (traffic spikes). Nếu 100 video tải lên cùng lúc, worker chỉ lấy từng task vừa sức, hệ thống không bao giờ bị sập.',
    changes: [
      { label: 'Hàng đợi Worker', from: '1 task đang chờ', to: 'Worker đã nhận việc' },
      { label: 'Trạng thái Video', from: 'QUEUED', to: 'PROCESSING' },
      { label: 'Độ trễ chờ hàng đợi', from: 'Chờ worker', to: '0 - 5 ms (nếu worker rảnh)' }
    ],
    takeaways: [
      'Worker kéo việc (Pull model) an toàn hơn mô hình đẩy (Push model).',
      'Độc lập mở rộng: có thể cắm thêm 10 worker GPU mà không sửa API.'
    ],
    activeNodes: ['queue', 'transcoder', 'orig-storage'],
    activeConnections: ['conn-queue-worker', 'conn-orig-worker'],
    packetType: 'transcode'
  },
  {
    id: 4,
    title: 'FFmpeg Transcoding Đa Độ Phân Giải (HLS)',
    subtitle: 'Chuyển mã đa bitrate (720p HD + 360p SD) và phân mảnh segment 4s',
    desc: 'FFmpeg thực hiện kiểm tra metadata (ffprobe) và encode video gốc thành 2 rendition (720p & 360p), chia thành các tệp segment .ts dài 4 giây, đồng thời sinh file danh sách phát master.m3u8.',
    insight: 'Tốc độ chuyển mã thực tế đạt 8.96x (xử lý video 5 giây chỉ mất 558ms). Trình phát Client sau này chỉ cần tải segment đầu tiên là đã xem được ngay.',
    changes: [
      { label: 'Định dạng Video', from: '1 file MP4 đơn độc', to: 'HLS Master + 360p + 720p' },
      { label: 'Kích thước tệp', from: '122 KB (File gốc)', to: '1.23 MB (Nhiều profiles)' },
      { label: 'Tốc độ Encode', from: 'N/A', to: '8.96x thời gian thực' }
    ],
    takeaways: [
      'Adaptive Bitrate (ABR) tự động chuyển giữa 360p và 720p theo tốc độ mạng.',
      'Lưu trữ các đoạn .ts phân mảnh vào Transcoded Storage.'
    ],
    activeNodes: ['transcoder', 'trans-storage'],
    activeConnections: ['conn-worker-transstorage'],
    packetType: 'transcode'
  },
  {
    id: 5,
    title: 'Bắn Sự Kiện Hoàn Tất & Cập Nhật READY',
    subtitle: 'Completion Queue điều phối cập nhật trạng thái cuối cùng vào Redis & SQLite',
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
    packetType: 'completion'
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
    packetType: 'cdn'
  }
];

export const InteractiveArchitectureSimulator: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Defaults to warm illustration theme like screenshot
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stepData = STEPS[currentStep - 1];

  // Auto-play steps
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isPlaying) {
      const intervalMs = (speed === 1 ? 4500 : 2500);
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : 1));
      }, intervalMs);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setCurrentStep(1);
  };

  return (
    <div style={{ padding: '0.75rem 0 3rem' }}>
      {/* Top Banner & Telemetry Bar Matching the Reference Screenshot */}
      <div style={{
        background: theme === 'light' ? '#f5f0e8' : '#1e1e24',
        border: `1.5px solid ${theme === 'light' ? '#e2d9cc' : '#333'}`,
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: theme === 'light' ? '#78716c' : '#a1a1aa', fontWeight: 600 }}>
            02. Mở rộng / Bài 2 &bull; Kiến Trúc Hai Tuyến (Dual-Path)
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: theme === 'light' ? '#1c1917' : '#f8fafc', marginTop: '2px' }}>
            Phân Tách Video Data Path vs Metadata Path
          </h1>
          <div style={{ fontSize: '0.78rem', color: theme === 'light' ? '#57534e' : '#94a3b8' }}>
            Một cửa trước cho video và metadata, điều phối luồng bất đồng bộ qua Redis và CDN.
          </div>
        </div>

        {/* Real-time system metrics pills (Like reference image) */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: theme === 'light' ? '#ffffff' : '#27272a', border: '1.2px solid #18181b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#78716c', fontSize: '0.7rem' }}>👥 NGƯỜI DÙNG: </span>
            <strong style={{ color: theme === 'light' ? '#000' : '#fff' }}>100.000</strong>
          </div>
          <div style={{ background: theme === 'light' ? '#ffffff' : '#27272a', border: '1.2px solid #18181b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#78716c', fontSize: '0.7rem' }}>⚡ YÊU CẦU / S: </span>
            <strong style={{ color: '#16a34a' }}>11.934</strong>
          </div>
          <div style={{ background: theme === 'light' ? '#ffffff' : '#27272a', border: '1.2px solid #18181b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#78716c', fontSize: '0.7rem' }}>⏱️ ĐỘ TRỄ P95: </span>
            <strong style={{ color: '#0284c7' }}>7.8 ms</strong>
          </div>
          <div style={{ background: theme === 'light' ? '#ffffff' : '#27272a', border: '1.2px solid #18181b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#78716c', fontSize: '0.7rem' }}>⚠️ LỖI: </span>
            <strong style={{ color: '#16a34a' }}>0%</strong>
          </div>
          <div style={{ background: theme === 'light' ? '#ffffff' : '#27272a', border: '1.2px solid #18181b', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#78716c', fontSize: '0.7rem' }}>💚 SERVER KHỎE: </span>
            <strong style={{ color: '#16a34a' }}>4 / 4</strong>
          </div>

          {/* Controls */}
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
              <span>{isPlaying ? 'Tạm dừng' : 'Phát lại'}</span>
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
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              style={{
                background: '#ffffff',
                color: '#18181b',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1.5px solid #18181b',
                cursor: 'pointer'
              }}
              title={theme === 'light' ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng (Chuẩn hình mẫu)'}
            >
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
            </button>

            <button
              onClick={onBackToHome}
              style={{
                background: '#ffffff',
                color: '#18181b',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid #18181b',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Quay lại danh sách video"
            >
              ← Trang Chủ
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Isometric Canvas on Left, Explanatory Panel on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(320px, 360px)', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* Left: 3D Isometric Canvas with True Hex Blocks and Animated Rolling Balls */}
        <div style={{
          background: theme === 'light' ? '#fbf8f2' : '#0f1117',
          border: `2px solid ${theme === 'light' ? '#e5ddd0' : '#27272a'}`,
          borderRadius: '16px',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '570px',
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

          {/* Dual Path Zone Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2, marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#b91c1c', background: '#fee2e2', border: '1.2px solid #ef4444', padding: '2px 10px', borderRadius: '12px', fontWeight: 800 }}>
              🔴 VIDEO DATA PATH (Xử lý tệp nhị phân nặng qua Worker & CDN)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#1d4ed8', background: '#dbeafe', border: '1.2px solid #3b82f6', padding: '2px 10px', borderRadius: '12px', fontWeight: 800 }}>
              🔵 METADATA PATH (API điều khiển siêu nhẹ qua Redis & SQLite)
            </span>
          </div>

          {/* SVG 3D Canvas Stage */}
          <div style={{ position: 'relative', width: '100%', height: '470px', zIndex: 3 }}>
            <svg
              viewBox="0 0 960 480"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              {/* ============================================================
                  ISOMETRIC CONNECTING PATHWAYS (Black crisp stroke like image)
              ============================================================ */}

              {/* Pathway 1: Client -> Original Storage */}
              <path
                id="wire-client-orig"
                d="M 180 270 C 240 270, 300 130, 370 130"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-client-orig') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-client-orig') ? '6 4' : 'none'}
              />

              {/* Pathway 2: Original Storage -> Transcoder */}
              <path
                id="wire-orig-trans"
                d="M 420 130 L 560 130"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-orig-worker') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-orig-worker') ? '6 4' : 'none'}
              />

              {/* Pathway 3: Transcoder -> Transcoded Storage */}
              <path
                id="wire-trans-storage"
                d="M 660 130 L 790 130"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-worker-transstorage') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-worker-transstorage') ? '6 4' : 'none'}
              />

              {/* Pathway 4: Transcoded Storage -> CDN Edge */}
              <path
                id="wire-storage-cdn"
                d="M 840 160 L 840 260"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-cdn-transstorage') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-cdn-transstorage') ? '6 4' : 'none'}
              />

              {/* Pathway 5: CDN Edge -> Client (Playback) */}
              <path
                id="wire-cdn-client"
                d="M 790 300 C 560 340, 360 310, 200 300"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-client-cdn') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-client-cdn') ? '6 4' : 'none'}
              />

              {/* Pathway 6: Client -> Express API */}
              <path
                id="wire-client-api"
                d="M 180 320 C 240 340, 290 420, 370 420"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-client-api') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-client-api') ? '6 4' : 'none'}
              />

              {/* Pathway 7: Express API -> Transcode Queue */}
              <path
                id="wire-api-queue"
                d="M 400 390 C 440 340, 520 260, 560 260"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-api-queue') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-api-queue') ? '6 4' : 'none'}
              />

              {/* Pathway 8: Queue -> Worker (Pull task) */}
              <path
                id="wire-queue-worker"
                d="M 610 230 L 610 160"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-queue-worker') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-queue-worker') ? '6 4' : 'none'}
              />

              {/* Pathway 9: Express API -> Redis */}
              <path
                id="wire-api-redis"
                d="M 420 410 C 480 395, 510 380, 560 370"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-api-redis') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-api-redis') ? '6 4' : 'none'}
              />

              {/* Pathway 10: Express API -> SQLite DB */}
              <path
                id="wire-api-db"
                d="M 420 430 C 480 445, 520 460, 560 465"
                fill="none"
                stroke="#18181b"
                strokeWidth={stepData.activeConnections.includes('conn-api-db') ? '2.5' : '1.8'}
                strokeDasharray={stepData.activeConnections.includes('conn-api-db') ? '6 4' : 'none'}
              />

              {/* ============================================================
                  ANIMATED ROLLING PACKET BALLS ALONG PATHWAYS
                  (Native SVG animateMotion for 100% smooth continuous roll)
              ============================================================ */}

              {/* Ball 1: Upload video to Storage */}
              {stepData.activeConnections.includes('conn-client-orig') && (
                <circle r="5.5" fill="#ef4444" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.6s" repeatCount="indefinite" path="M 180 270 C 240 270, 300 130, 370 130" />
                </circle>
              )}

              {/* Ball 2: Client sends JSON metadata to API */}
              {stepData.activeConnections.includes('conn-client-api') && (
                <circle r="5.5" fill="#38bdf8" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.4s" repeatCount="indefinite" path="M 180 320 C 240 340, 290 420, 370 420" />
                </circle>
              )}

              {/* Ball 3: API pushes task to Queue */}
              {stepData.activeConnections.includes('conn-api-queue') && (
                <circle r="5" fill="#f59e0b" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.3s" repeatCount="indefinite" path="M 400 390 C 440 340, 520 260, 560 260" />
                </circle>
              )}

              {/* Ball 4: Transcoder pulls video from Storage */}
              {stepData.activeConnections.includes('conn-orig-worker') && (
                <circle r="5.5" fill="#ef4444" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M 420 130 L 560 130" />
                </circle>
              )}

              {/* Ball 5: Transcoder writes chunks to Transcoded Storage */}
              {stepData.activeConnections.includes('conn-worker-transstorage') && (
                <circle r="5.5" fill="#10b981" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M 660 130 L 790 130" />
                </circle>
              )}

              {/* Ball 6: CDN fetches from Storage on cache MISS */}
              {stepData.activeConnections.includes('conn-cdn-transstorage') && (
                <circle r="5" fill="#2dd4bf" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.4s" repeatCount="indefinite" path="M 840 160 L 840 260" />
                </circle>
              )}

              {/* Ball 7: CDN streams HLS chunks to Client */}
              {stepData.activeConnections.includes('conn-client-cdn') && (
                <circle r="5.5" fill="#10b981" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path="M 790 300 C 560 340, 360 310, 200 300" />
                </circle>
              )}

              {/* Ball 8: API saves to SQLite */}
              {stepData.activeConnections.includes('conn-api-db') && (
                <circle r="5" fill="#6366f1" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M 420 430 C 480 445, 520 460, 560 465" />
                </circle>
              )}

              {/* Ball 9: API sets hash to Redis */}
              {stepData.activeConnections.includes('conn-api-redis') && (
                <circle r="5" fill="#ef4444" stroke="#18181b" strokeWidth="1.5">
                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M 420 410 C 480 395, 510 380, 560 370" />
                </circle>
              )}

              {/* ============================================================
                  3D ISOMETRIC CLIENT PLATFORM (Column 1)
              ============================================================ */}
              <IsometricClientPlatform cx={140} cy={290} theme={theme} />

              {/* ============================================================
                  3D ISOMETRIC HEXAGONAL PRISM BLOCKS (Columns 2, 3, 4)
              ============================================================ */}

              {/* 1. Original Storage (Column 2 Top) */}
              <Isometric3DHexBlock
                cx={370}
                cy={110}
                topColor="#fecaca"
                leftColor="#ef4444"
                rightColor="#b91c1c"
                label="Original Storage"
                subLabel="UUID MP4"
                badge="Raw Video Storage"
                iconType="storage"
                isActive={stepData.activeNodes.includes('orig-storage')}
                theme={theme}
              />

              {/* 2. FFmpeg Transcoder Worker (Column 3 Top) */}
              <Isometric3DHexBlock
                cx={610}
                cy={110}
                topColor="#fef08a"
                leftColor="#f59e0b"
                rightColor="#b45309"
                label="FFmpeg Worker"
                subLabel="Multi-Bitrate"
                badge="8.96x Transcoder"
                metric="50% CPU"
                iconType="cpu"
                isActive={stepData.activeNodes.includes('transcoder')}
                theme={theme}
              />

              {/* 3. Transcoded Storage (Column 4 Top) */}
              <Isometric3DHexBlock
                cx={840}
                cy={110}
                topColor="#a7f3d0"
                leftColor="#10b981"
                rightColor="#047857"
                label="Transcoded Storage"
                subLabel=".m3u8 & .ts"
                badge="HLS Segments"
                iconType="storage"
                isActive={stepData.activeNodes.includes('trans-storage')}
                theme={theme}
              />

              {/* 4. CDN Edge Node (Column 4 Mid) */}
              <Isometric3DHexBlock
                cx={840}
                cy={280}
                topColor="#99f6e4"
                leftColor="#14b8a6"
                rightColor="#0f766e"
                label="CDN Edge Node"
                subLabel="SGN-Edge-01"
                badge="Edge Delivery"
                metric="148 MB/s"
                iconType="cdn"
                isActive={stepData.activeNodes.includes('cdn')}
                theme={theme}
              />

              {/* 5. Transcode Queue (Column 3 Mid-Upper) */}
              <Isometric3DHexBlock
                cx={610}
                cy={240}
                rx={46}
                ry={24}
                depth={18}
                topColor="#fde68a"
                leftColor="#d97706"
                rightColor="#92400e"
                label="Transcode Queue"
                subLabel="Concurrency = 1"
                badge="Worker Queue"
                iconType="queue"
                isActive={stepData.activeNodes.includes('queue')}
                theme={theme}
              />

              {/* 6. Redis Cache (Column 3 Mid-Lower) */}
              <Isometric3DHexBlock
                cx={610}
                cy={350}
                rx={48}
                ry={25}
                depth={18}
                topColor="#fecdd3"
                leftColor="#f43f5e"
                rightColor="#be123c"
                label="Redis Cache"
                subLabel="status:id"
                badge="RAM 38k RPS"
                iconType="redis"
                isActive={stepData.activeNodes.includes('redis')}
                theme={theme}
              />

              {/* 7. SQLite DB (Column 3 Bottom) */}
              <Isometric3DHexBlock
                cx={610}
                cy={455}
                rx={48}
                ry={25}
                depth={18}
                topColor="#c7d2fe"
                leftColor="#6366f1"
                rightColor="#3730a3"
                label="SQLite DB"
                subLabel="WAL Mode"
                badge="Video Metadata"
                iconType="db"
                isActive={stepData.activeNodes.includes('sqlite')}
                theme={theme}
              />

              {/* 8. Express API Server (Column 2 Bottom) */}
              <Isometric3DHexBlock
                cx={370}
                cy={410}
                topColor="#bae6fd"
                leftColor="#0284c7"
                rightColor="#0369a1"
                label="Express API"
                subLabel="Port 3001"
                badge="Control Gateway"
                metric="11.9k RPS"
                iconType="server"
                isActive={stepData.activeNodes.includes('api-server')}
                theme={theme}
              />

              {/* Floating Strategy Pill on Wire (Like "ít kết nối nhất" in reference image) */}
              <g transform="translate(265, 360)">
                <rect x="-42" y="-10" width="84" height="20" rx="10" fill={theme === 'light' ? '#ffffff' : '#1e293b'} stroke="#18181b" strokeWidth="1.5" />
                <circle cx="-32" cy="0" r="2.5" fill="#38bdf8" />
                <text x="5" y="3.5" textAnchor="middle" fontSize="8" fontWeight="700" fill={theme === 'light' ? '#18181b' : '#fff'}>
                  HTTP 202 Ingest
                </text>
              </g>

              <g transform="translate(485, 115)">
                <rect x="-44" y="-10" width="88" height="20" rx="10" fill={theme === 'light' ? '#ffffff' : '#1e293b'} stroke="#18181b" strokeWidth="1.5" />
                <circle cx="-34" cy="0" r="2.5" fill="#f59e0b" />
                <text x="5" y="3.5" textAnchor="middle" fontSize="8" fontWeight="700" fill={theme === 'light' ? '#18181b' : '#fff'}>
                  FFmpeg Segment
                </text>
              </g>

            </svg>
          </div>

          {/* Legend Matching Reference Image (Bottom of Canvas) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            paddingTop: '0.65rem',
            borderTop: `1.5px solid ${theme === 'light' ? '#e2d9cc' : '#27272a'}`,
            fontSize: '0.74rem',
            color: theme === 'light' ? '#44403c' : '#a1a1aa',
            flexWrap: 'wrap',
            zIndex: 2,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1.5px solid #18181b' }} />
              <strong>Yêu cầu JSON</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ef4444', border: '1.5px solid #18181b' }} />
              <strong>Video nặng</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#f59e0b', border: '1.5px solid #18181b' }} />
              <strong>Hàng đợi / Encode</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10b981', border: '1.5px solid #18181b' }} />
              <strong>CDN Cache HIT</strong>
            </span>
          </div>
        </div>

        {/* Right: Explanatory & Step-by-Step Panel Matching the Screenshot */}
        <div style={{
          background: theme === 'light' ? '#f5f0e8' : '#18181b',
          border: `1.5px solid ${theme === 'light' ? '#e2d9cc' : '#27272a'}`,
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: theme === 'light' ? '0 8px 30px rgba(0,0,0,0.04)' : '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          {/* Step Header */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                BƯỚC {stepData.id} / {STEPS.length}
              </span>
              <span style={{ fontSize: '0.68rem', background: '#18181b', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                KỸ THUẬT
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: theme === 'light' ? '#1c1917' : '#f8fafc' }}>
              {stepData.title}
            </h2>
            <div style={{ fontSize: '0.78rem', color: theme === 'light' ? '#78716c' : '#94a3b8', marginTop: '2px' }}>
              {stepData.subtitle}
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.84rem', color: theme === 'light' ? '#44403c' : '#cbd5e1', lineHeight: '1.6' }}>
            {stepData.desc}
          </p>

          {/* Technical Insight Box ("NÊN BIẾT" Box like reference image) */}
          <div style={{
            background: theme === 'light' ? '#fffbeb' : 'rgba(234, 179, 8, 0.1)',
            border: `1.5px solid ${theme === 'light' ? '#fde68a' : '#f59e0b'}`,
            borderRadius: '10px',
            padding: '0.75rem',
            fontSize: '0.78rem',
            lineHeight: '1.55'
          }}>
            <div style={{ fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '0.2rem' }}>
              💡 NÊN BIẾT:
            </div>
            <div style={{ color: theme === 'light' ? '#78350f' : '#fef08a' }}>
              {stepData.insight}
            </div>
          </div>

          {/* Metrics Delta Box ("ĐIỀU ĐÃ THAY ĐỔI" Box like reference image) */}
          <div style={{
            background: theme === 'light' ? '#ffffff' : '#27272a',
            border: `1.2px solid ${theme === 'light' ? '#e2d9cc' : '#3f3f46'}`,
            borderRadius: '10px',
            padding: '0.75rem'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#78716c', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              ĐIỀU ĐÃ THAY ĐỔI:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {stepData.changes.map((c, i) => (
                <div key={i} style={{ fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ color: theme === 'light' ? '#78716c' : '#a1a1aa' }}>~ {c.label}:</span>
                  <span style={{ textAlign: 'right' }}>
                    <span style={{ color: '#ef4444', textDecoration: 'line-through', marginRight: '6px' }}>{c.from}</span>
                    <strong style={{ color: '#16a34a' }}>&rarr; {c.to}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Navigation Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.4rem' }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              style={{
                flex: 1,
                padding: '0.55rem',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: '1.5px solid #18181b',
                background: '#ffffff',
                color: '#18181b',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 1 ? 0.4 : 1,
              }}
            >
              <ArrowLeft size={13} /> Quay lại
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === STEPS.length}
              style={{
                flex: 1.5,
                padding: '0.55rem',
                fontSize: '0.8rem',
                borderRadius: '8px',
                border: '1.5px solid #18181b',
                background: '#18181b',
                color: '#ffffff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: currentStep === STEPS.length ? 'not-allowed' : 'pointer',
                opacity: currentStep === STEPS.length ? 0.4 : 1,
              }}
            >
              <span>{currentStep < STEPS.length ? `Tiếp: Bước ${currentStep + 1}` : 'Hoàn tất'}</span>
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

      {/* Step Timeline at Bottom (Numbered Steps 1..6 matching reference screenshot) */}
      <div style={{
        marginTop: '1.25rem',
        background: theme === 'light' ? '#f5f0e8' : '#18181b',
        border: `1.5px solid ${theme === 'light' ? '#e2d9cc' : '#27272a'}`,
        borderRadius: '16px',
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: theme === 'light' ? '#44403c' : '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            TRONG BÀI NÀY:
          </div>
          <div style={{ fontSize: '0.75rem', color: '#78716c', fontWeight: 600 }}>
            Bước {currentStep} / {STEPS.length}
          </div>
        </div>

        {/* Stepper Circles */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: '0.5rem', position: 'relative' }}>
          {STEPS.map((s) => {
            const isCompleted = s.id < currentStep;
            const isCurrent = s.id === currentStep;

            return (
              <div 
                key={s.id} 
                onClick={() => setCurrentStep(s.id)}
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
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
