import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, ArrowRight, ArrowLeft, 
  CheckCircle2, Zap
} from 'lucide-react';

/* ============================================================
   CUSTOM 3D/ISOMETRIC SYSTEM DESIGN SVG ICONS
============================================================ */

const IconClient = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <radialGradient id="client-bg" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0369a1" />
      </radialGradient>
      <filter id="client-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0284c7" floodOpacity="0.5" />
      </filter>
    </defs>
    <rect x="5" y="6" width="26" height="18" rx="3" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
    <rect x="7" y="8" width="22" height="14" rx="2" fill="url(#client-bg)" fillOpacity="0.35" />
    {/* Screen video player symbol */}
    <polygon points="16,12 16,18 22,15" fill="#38bdf8" />
    {/* Stand */}
    <path d="M14 24L12 29H24L22 24" fill="#334155" stroke="#38bdf8" strokeWidth="1.2" />
    <ellipse cx="18" cy="29" rx="8" ry="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
    {/* Online user beacon */}
    <circle cx="28" cy="7" r="2.5" fill="#4ade80" />
  </svg>
);

const IconOriginalStorage = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <linearGradient id="orig-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
    </defs>
    {/* Top Rim */}
    <ellipse cx="18" cy="9" rx="12" ry="4" fill="#fca5a5" fillOpacity="0.45" stroke="#ef4444" strokeWidth="1.5" />
    {/* Bucket Body */}
    <path d="M6 9V22C6 24.5 11.4 26.5 18 26.5C24.6 26.5 30 24.5 30 22V9" fill="url(#orig-grad)" fillOpacity="0.85" stroke="#ef4444" strokeWidth="1.5" />
    {/* Mid Ring */}
    <path d="M6 15.5C6 17.5 11.4 19.5 18 19.5C24.6 19.5 30 17.5 30 15.5" stroke="#fecaca" strokeWidth="1" strokeDasharray="2 2" />
    {/* Video Tape Slate */}
    <rect x="13" y="14" width="10" height="7" rx="1.5" fill="#18181b" stroke="#fca5a5" strokeWidth="1" />
    <polygon points="16.5,16 16.5,19 20,17.5" fill="#ef4444" />
  </svg>
);

const IconTranscoder = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <linearGradient id="gpu-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    {/* Silicon Substrate */}
    <rect x="6" y="6" width="24" height="24" rx="4" fill="url(#gpu-grad)" stroke="#fcd34d" strokeWidth="1.5" />
    {/* Die Heat Spreader */}
    <rect x="10.5" y="10.5" width="15" height="15" rx="2" fill="#171717" stroke="#fbbf24" strokeWidth="1.2" />
    {/* Circuit traces */}
    <path d="M14 10.5V14H10.5M22 10.5V14H25.5M10.5 22H14V25.5M25.5 22H22V25.5" stroke="#f59e0b" strokeWidth="0.8" />
    {/* Dual Gear Transcode Core */}
    <circle cx="18" cy="18" r="4.5" fill="#f59e0b" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="1.2" />
    <polygon points="18,14.5 19,16.5 21,17 19.5,18.5 20,21 18,19.5 16,21 16.5,18.5 15,17 17,16.5" fill="#fbbf24" />
  </svg>
);

const IconTranscodedStorage = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <linearGradient id="ts-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Disc 3 (Bottom) */}
    <path d="M7 22C7 24 11.9 25.5 18 25.5C24.1 25.5 29 24 29 22V24C29 26 24.1 27.5 18 27.5C11.9 27.5 7 26 7 24V22Z" fill="#065f46" stroke="#34d399" strokeWidth="1" />
    {/* Disc 2 (Middle) */}
    <path d="M7 16C7 18 11.9 19.5 18 19.5C24.1 19.5 29 18 29 16V18C29 20 24.1 21.5 18 21.5C11.9 21.5 7 20 7 18V16Z" fill="url(#ts-grad)" stroke="#34d399" strokeWidth="1" />
    {/* Disc 1 (Top) */}
    <ellipse cx="18" cy="10" rx="11" ry="4" fill="#a7f3d0" fillOpacity="0.4" stroke="#34d399" strokeWidth="1.5" />
    <path d="M7 10V12C7 14 11.9 15.5 18 15.5C24.1 15.5 29 14 29 12V10" stroke="#34d399" strokeWidth="1.5" />
    {/* Multi-profile segments */}
    <circle cx="13" cy="10" r="1.5" fill="#34d399" />
    <circle cx="18" cy="10" r="1.5" fill="#6ee7b7" />
    <circle cx="23" cy="10" r="1.5" fill="#a7f3d0" />
  </svg>
);

const IconCDN = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <radialGradient id="cdn-globe" cx="40%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="#0f766e" />
      </radialGradient>
    </defs>
    {/* Globe Base */}
    <circle cx="18" cy="18" r="12" fill="url(#cdn-globe)" stroke="#5eead4" strokeWidth="1.5" />
    {/* Latitude & Longitude curves */}
    <ellipse cx="18" cy="18" rx="6" ry="12" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    <line x1="6" y1="18" x2="30" y2="18" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
    {/* Orbital Edge Rings */}
    <ellipse cx="18" cy="18" rx="15" ry="5.5" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" transform="rotate(-28 18 18)" />
    {/* Edge Pin Marker */}
    <circle cx="22" cy="13" r="2.5" fill="#facc15" stroke="#fff" strokeWidth="1" />
  </svg>
);

const IconAPIGateway = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <linearGradient id="srv-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Server Blade 1 (Upper) */}
    <rect x="5.5" y="7" width="25" height="9.5" rx="2.5" fill="url(#srv-grad)" stroke="#38bdf8" strokeWidth="1.5" />
    <circle cx="9.5" cy="11.75" r="1.5" fill="#4ade80" />
    <circle cx="14" cy="11.75" r="1.5" fill="#38bdf8" />
    <line x1="18" y1="11.75" x2="27" y2="11.75" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
    {/* Server Blade 2 (Lower) */}
    <rect x="5.5" y="19" width="25" height="9.5" rx="2.5" fill="url(#srv-grad)" stroke="#38bdf8" strokeWidth="1.5" />
    <circle cx="9.5" cy="23.75" r="1.5" fill="#4ade80" />
    <circle cx="14" cy="23.75" r="1.5" fill="#38bdf8" />
    <line x1="18" y1="23.75" x2="27" y2="23.75" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconQueue = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <linearGradient id="q-box" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
    </defs>
    {/* Conveyer / Pipeline Channel */}
    <rect x="4" y="11" width="28" height="14" rx="3.5" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.5" />
    {/* Moving Queue Job Blocks */}
    <rect x="7" y="14" width="6" height="8" rx="1.5" fill="#fde047" stroke="#d97706" strokeWidth="0.8" />
    <rect x="15" y="14" width="6" height="8" rx="1.5" fill="#facc15" stroke="#d97706" strokeWidth="0.8" />
    <rect x="23" y="14" width="6" height="8" rx="1.5" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
    {/* Arrow */}
    <path d="M26 8L30 18L26 28" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconRedis = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <linearGradient id="redis-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
    </defs>
    {/* Isometric Hexagon Diamond Plate */}
    <polygon points="18,4 31,11 31,25 18,32 5,25 5,11" fill="url(#redis-grad)" stroke="#f87171" strokeWidth="1.5" />
    <polygon points="18,8 27,13 27,23 18,28 9,23 9,13" fill="#18181b" stroke="#fca5a5" strokeWidth="1" />
    {/* High Speed In-Memory Lightning */}
    <path d="M19.5 11L13 19.5H18.5L16.5 25L23 16.5H17.5L19.5 11Z" fill="#facc15" stroke="#eab308" strokeWidth="0.8" />
  </svg>
);

const IconSQLite = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto 0.2rem', display: 'block' }}>
    <defs>
      <linearGradient id="db-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    {/* Top Ellipse */}
    <ellipse cx="18" cy="9" rx="11" ry="4" fill="#93c5fd" fillOpacity="0.45" stroke="#60a5fa" strokeWidth="1.5" />
    {/* Tier 1 */}
    <path d="M7 9V15C7 17.2 11.9 19 18 19C24.1 19 29 17.2 29 15V9" fill="url(#db-grad)" stroke="#60a5fa" strokeWidth="1.5" />
    {/* Tier 2 */}
    <path d="M7 15V21C7 23.2 11.9 25 18 25C24.1 25 29 23.2 29 21V15" fill="url(#db-grad)" stroke="#60a5fa" strokeWidth="1.5" />
    {/* WAL Journal indicator LED */}
    <circle cx="24" cy="12.5" r="1.5" fill="#4ade80" />
    <circle cx="24" cy="18.5" r="1.5" fill="#60a5fa" />
  </svg>
);

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
    <div style={{ padding: '1rem 0 3rem' }}>
      {/* Top Banner & Telemetry bar */}
      <div style={{
        background: '#161616',
        border: '1px solid #282828',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button 
              className="btn-secondary" 
              onClick={onBackToHome}
              style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: '14px' }}
            >
              <ArrowLeft size={13} /> Về YouTube
            </button>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              Mô Phỏng Trực Quan Kiến Trúc Hai Tuyến (Interactive Flow)
            </h1>
          </div>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.2rem' }}>
            Quan sát dòng chảy dữ liệu thực tế giữa <strong>Video Data Path</strong> và <strong>Metadata Path</strong> theo từng bước
          </p>
        </div>

        {/* Real-time system metrics pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: '#202020', border: '1px solid #333', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#888' }}>NGƯỜI DÙNG: </span>
            <strong style={{ color: '#fff' }}>100.000 CCU</strong>
          </div>
          <div style={{ background: '#202020', border: '1px solid #333', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#888' }}>THÔNG LƯỢNG: </span>
            <strong style={{ color: '#4ade80' }}>11.934 RPS</strong>
          </div>
          <div style={{ background: '#202020', border: '1px solid #333', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#888' }}>ĐỘ TRỄ API: </span>
            <strong style={{ color: '#3ea6ff' }}>7.8 ms</strong>
          </div>
          <div style={{ background: '#202020', border: '1px solid #333', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#888' }}>CDN HIT: </span>
            <strong style={{ color: '#facc15' }}>98.2%</strong>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '0.35rem', marginLeft: '0.5rem' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? '#2563eb' : '#222',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #383838',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
              title={isPlaying ? 'Tạm dừng mô phỏng' : 'Tự động chạy các bước'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Tạm dừng' : 'Phát'}</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-secondary"
              style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem' }}
              title="Đặt lại về bước 1"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={() => setSpeed(speed === 1 ? 2 : 1)}
              className="btn-secondary"
              style={{ padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}
              title="Tốc độ chuyển bước"
            >
              {speed}x
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Canvas on Left, Details on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(310px, 360px)', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* Left: Interactive Canvas with Responsive SVG Connectors and Percentage-positioned Nodes */}
        <div style={{
          background: '#121212',
          border: '1px solid #282828',
          borderRadius: '12px',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '560px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Subtle Grid Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#282828 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.35,
            pointerEvents: 'none'
          }} />

          {/* Section Labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2, marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              🔴 VIDEO DATA PATH (Xử lý tệp nhị phân nặng)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              🔵 METADATA PATH (API điều khiển siêu nhẹ)
            </span>
          </div>

          {/* Visual Architecture Layout (Responsive Percentage Based) */}
          <div style={{ position: 'relative', height: '460px', width: '100%', zIndex: 3 }}>
            
            {/* SVG Connecting Paths with dynamic animated flowing dashes */}
            <svg 
              viewBox="0 0 1000 480" 
              preserveAspectRatio="none" 
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              <defs>
                <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3ea6ff" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>

              {/* Conn: Client -> Original Storage */}
              <path
                d="M 180 225 C 180 87, 210 87, 250 87"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-client-orig') ? '#f87171' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-client-orig') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-client-orig') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-client-orig') ? 'flow-animated' : ''}
              />

              {/* Conn: Original Storage -> Transcoder */}
              <path
                d="M 450 87 L 500 87"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-orig-worker') ? '#f87171' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-orig-worker') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-orig-worker') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-orig-worker') ? 'flow-animated' : ''}
              />

              {/* Conn: Transcoder -> Transcoded Storage */}
              <path
                d="M 710 87 L 750 87"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-worker-transstorage') ? '#f87171' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-worker-transstorage') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-worker-transstorage') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-worker-transstorage') ? 'flow-animated' : ''}
              />

              {/* Conn: Transcoded Storage -> CDN Edge */}
              <path
                d="M 860 125 L 860 215"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-cdn-transstorage') ? '#4ade80' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-cdn-transstorage') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-cdn-transstorage') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-cdn-transstorage') ? 'flow-animated' : ''}
              />

              {/* Conn: CDN Edge -> Client (Playback) */}
              <path
                d="M 750 255 C 500 290, 300 270, 180 245"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-client-cdn') ? '#4ade80' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-client-cdn') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-client-cdn') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-client-cdn') ? 'flow-animated' : ''}
              />

              {/* Conn: Client -> API Server */}
              <path
                d="M 180 245 C 180 385, 210 385, 250 385"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-client-api') ? '#3ea6ff' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-client-api') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-client-api') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-client-api') ? 'flow-animated' : ''}
              />

              {/* Conn: API Server -> Redis */}
              <path
                d="M 450 380 C 475 350, 485 315, 500 302"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-api-redis') ? '#facc15' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-api-redis') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-api-redis') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-api-redis') ? 'flow-animated' : ''}
              />

              {/* Conn: API Server -> SQLite */}
              <path
                d="M 450 390 L 500 410"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-api-db') ? '#3ea6ff' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-api-db') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-api-db') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-api-db') ? 'flow-animated' : ''}
              />

              {/* Conn: API Server -> Queue */}
              <path
                d="M 350 345 C 350 240, 420 195, 500 195"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-api-queue') ? '#facc15' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-api-queue') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-api-queue') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-api-queue') ? 'flow-animated' : ''}
              />

              {/* Conn: Queue -> Worker */}
              <path
                d="M 605 165 L 605 125"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-queue-worker') ? '#facc15' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-queue-worker') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-queue-worker') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-queue-worker') ? 'flow-animated' : ''}
              />

              {/* Conn: Worker -> Redis / Completion */}
              <path
                d="M 605 125 L 605 270"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-worker-cq') ? '#4ade80' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-worker-cq') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-worker-cq') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-worker-cq') ? 'flow-animated' : ''}
              />
            </svg>

            {/* NODE 1: Client / User (Column 1: left 2%, width 16%) */}
            <div style={{
              position: 'absolute',
              top: '190px',
              left: '2%',
              width: '16%',
              minWidth: '95px',
              padding: '0.65rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('client') 
                ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('client') ? '#38bdf8' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('client') 
                ? '0 0 20px rgba(56, 189, 248, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
              <IconClient />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>User / Client</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '1px', whiteSpace: 'nowrap' }}>Upload & Watch</div>
              {stepData.activeNodes.includes('client') && (
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#38bdf8', color: '#000', fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                  ACTIVE CLIENT
                </div>
              )}
            </div>

            {/* NODE 2: Original Storage (Column 2: left 25%, width 20%) */}
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '25%',
              width: '20%',
              minWidth: '105px',
              padding: '0.6rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('orig-storage') 
                ? 'linear-gradient(145deg, #361717 0%, #1a0b0b 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('orig-storage') ? '#ef4444' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('orig-storage') 
                ? '0 0 20px rgba(239, 68, 68, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
              <IconOriginalStorage />
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f87171', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Original Storage</div>
              <div style={{ fontSize: '0.62rem', color: '#888', whiteSpace: 'nowrap' }}>Raw MP4 Files</div>
              {stepData.activeNodes.includes('orig-storage') && (
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                  RECEIVING
                </div>
              )}
            </div>

            {/* NODE 3: Transcoding Worker FFmpeg (Column 3: left 50%, width 21%) */}
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '50%',
              width: '21%',
              minWidth: '110px',
              padding: '0.6rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('transcoder') 
                ? 'linear-gradient(145deg, #36240d 0%, #1c1206 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('transcoder') ? '#f59e0b' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('transcoder') 
                ? '0 0 20px rgba(245, 158, 11, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
              <IconTranscoder />
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#f59e0b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>FFmpeg Transcoder</div>
              <div style={{ fontSize: '0.62rem', color: '#888', whiteSpace: 'nowrap' }}>360p &bull; 720p HLS</div>
              {stepData.activeNodes.includes('transcoder') && (
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#000', fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                  8.96x SPEED
                </div>
              )}
            </div>

            {/* NODE 4: Transcoded Storage (Column 4: left 75%, width 22% -> ends at 97%!) */}
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '75%',
              width: '22%',
              minWidth: '110px',
              padding: '0.6rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('trans-storage') 
                ? 'linear-gradient(145deg, #103322 0%, #081a11 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('trans-storage') ? '#10b981' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('trans-storage') 
                ? '0 0 20px rgba(16, 185, 129, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <IconTranscodedStorage />
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#34d399', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Transcoded Storage</div>
              <div style={{ fontSize: '0.62rem', color: '#888', whiteSpace: 'nowrap' }}>.m3u8 & .ts Chunks</div>
              {stepData.activeNodes.includes('trans-storage') && (
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#000', fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                  HLS READY
                </div>
              )}
            </div>

            {/* NODE 5: CDN Edge Node (Column 4: left 75%, width 22% -> ends at 97%!) */}
            <div style={{
              position: 'absolute',
              top: '215px',
              left: '75%',
              width: '22%',
              minWidth: '110px',
              padding: '0.6rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('cdn') 
                ? 'linear-gradient(145deg, #133333 0%, #091a1a 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('cdn') ? '#2dd4bf' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('cdn') 
                ? '0 0 20px rgba(45, 212, 191, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '6px', height: '6px', borderRadius: '50%', background: '#2dd4bf', boxShadow: '0 0 6px #2dd4bf' }} />
              <IconCDN />
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2dd4bf', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>CDN Edge Cache</div>
              <div style={{ fontSize: '0.62rem', color: '#888', whiteSpace: 'nowrap' }}>SGN-Edge-01</div>
              {stepData.activeNodes.includes('cdn') && (
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#2dd4bf', color: '#000', fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                  HIT (148MB/s)
                </div>
              )}
            </div>

            {/* NODE 6: API Server (Column 2: left 25%, width 20%) */}
            <div style={{
              position: 'absolute',
              top: '345px',
              left: '25%',
              width: '20%',
              minWidth: '105px',
              padding: '0.6rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('api-server') 
                ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('api-server') ? '#38bdf8' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('api-server') 
                ? '0 0 20px rgba(56, 189, 248, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '7px', right: '7px', width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
              <IconAPIGateway />
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#38bdf8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Express API</div>
              <div style={{ fontSize: '0.62rem', color: '#888', whiteSpace: 'nowrap' }}>Port 3001</div>
              {stepData.activeNodes.includes('api-server') && (
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#38bdf8', color: '#000', fontSize: '0.58rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                  11.9k RPS
                </div>
              )}
            </div>

            {/* NODE 7: Queue (Column 3: left 50%, width 21%) */}
            <div style={{
              position: 'absolute',
              top: '165px',
              left: '50%',
              width: '21%',
              minWidth: '110px',
              padding: '0.5rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('queue') 
                ? 'linear-gradient(145deg, #33230d 0%, #1a1106 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('queue') ? '#f59e0b' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('queue') 
                ? '0 0 20px rgba(245, 158, 11, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '5px', height: '5px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
              <IconQueue />
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#facc15', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Transcode Queue</div>
              <div style={{ fontSize: '0.6rem', color: '#888', whiteSpace: 'nowrap' }}>Concurrency = 1</div>
            </div>

            {/* NODE 8: Redis (Column 3: left 50%, width 21%) */}
            <div style={{
              position: 'absolute',
              top: '270px',
              left: '50%',
              width: '21%',
              minWidth: '110px',
              padding: '0.5rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('redis') 
                ? 'linear-gradient(145deg, #361717 0%, #1a0b0b 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('redis') ? '#ef4444' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('redis') 
                ? '0 0 20px rgba(239, 68, 68, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
              <IconRedis />
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f87171', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Redis Cache</div>
              <div style={{ fontSize: '0.6rem', color: '#888', whiteSpace: 'nowrap' }}>RAM 38k RPS</div>
            </div>

            {/* NODE 9: SQLite (Column 3: left 50%, width 21%) */}
            <div style={{
              position: 'absolute',
              top: '375px',
              left: '50%',
              width: '21%',
              minWidth: '110px',
              padding: '0.5rem 0.4rem',
              boxSizing: 'border-box',
              background: stepData.activeNodes.includes('sqlite') 
                ? 'linear-gradient(145deg, #1a273e 0%, #0c1422 100%)' 
                : 'linear-gradient(145deg, #18191f 0%, #111215 100%)',
              border: `2px solid ${stepData.activeNodes.includes('sqlite') ? '#3b82f6' : '#333'}`,
              borderRadius: '12px',
              boxShadow: stepData.activeNodes.includes('sqlite') 
                ? '0 0 20px rgba(59, 130, 246, 0.45), inset 0 1px 0 rgba(255,255,255,0.2)' 
                : '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '5px', height: '5px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
              <IconSQLite />
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#60a5fa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SQLite DB</div>
              <div style={{ fontSize: '0.6rem', color: '#888', whiteSpace: 'nowrap' }}>WAL Mode &bull; Metadata</div>
            </div>

          </div>

          {/* Legend at bottom of canvas - Responsive Grid Wrapping */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.4rem 0.8rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #222',
            fontSize: '0.72rem',
            color: '#aaa',
            zIndex: 2,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f87171', flexShrink: 0 }} />
              <span>Tệp Video Nặng</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3ea6ff', flexShrink: 0 }} />
              <span>API Request</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#facc15', flexShrink: 0 }} />
              <span>Hàng Đợi & Redis</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', flexShrink: 0 }} />
              <span>CDN HLS Delivery</span>
            </span>
          </div>
        </div>

        {/* Right: Step-by-Step Educational & Explanatory Panel (Like the reference image) */}
        <div style={{
          background: '#161616',
          border: '1px solid #282828',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {/* Step Badge & Title */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#3ea6ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                BƯỚC {stepData.id} / {STEPS.length}
              </span>
              <span style={{ fontSize: '0.7rem', background: '#252525', color: '#4ade80', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                KỸ THUẬT
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              {stepData.title}
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.2rem' }}>
              {stepData.subtitle}
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.6' }}>
            {stepData.desc}
          </p>

          {/* Technical Insight Box (Like "NÊN BIẾT" in image) */}
          <div style={{
            background: 'rgba(234, 179, 8, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.78rem',
            lineHeight: '1.5'
          }}>
            <div style={{ fontWeight: 700, color: '#facc15', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.25rem' }}>
              <Zap size={14} /> NÊN BIẾT TRONG THIẾT KẾ:
            </div>
            <div style={{ color: '#fde047' }}>
              {stepData.insight}
            </div>
          </div>

          {/* Metrics Delta Box (Like "ĐIỀU ĐÃ THAY ĐỔI" in image) */}
          <div style={{ background: '#1c1c1c', border: '1px solid #282828', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              CHỈ SỐ THAY ĐỔI:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {stepData.changes.map((c, i) => (
                <div key={i} style={{ fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ color: '#aaa' }}>{c.label}:</span>
                  <span style={{ color: '#fff', textAlign: 'right' }}>
                    <span style={{ color: '#f87171', textDecoration: 'line-through', marginRight: '6px' }}>{c.from}</span>
                    <strong style={{ color: '#4ade80' }}>{c.to}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Navigation Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="btn-secondary"
              style={{
                flex: 1,
                padding: '0.55rem',
                fontSize: '0.82rem',
                borderRadius: '8px',
                justifyContent: 'center',
                opacity: currentStep === 1 ? 0.4 : 1,
              }}
            >
              <ArrowLeft size={14} /> Quay lại
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === STEPS.length}
              className="btn-primary"
              style={{
                flex: 1.5,
                padding: '0.55rem',
                fontSize: '0.82rem',
                borderRadius: '8px',
                justifyContent: 'center',
                opacity: currentStep === STEPS.length ? 0.4 : 1,
              }}
            >
              <span>{currentStep < STEPS.length ? `Tiếp: Bước ${currentStep + 1}` : 'Hoàn tất'}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Key Takeaways */}
          <div style={{ borderTop: '1px solid #282828', paddingTop: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              BẠN SẼ NẮM ĐƯỢC:
            </div>
            {stepData.takeaways.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.75rem', color: '#bbb', marginBottom: '0.3rem' }}>
                <CheckCircle2 size={13} color="#4ade80" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{t}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Step Timeline at Bottom (Like Steps 1..12 in image) */}
      <div style={{
        marginTop: '1.5rem',
        background: '#161616',
        border: '1px solid #282828',
        borderRadius: '12px',
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            LỘ TRÌNH ĐIỀU PHỐI DỮ LIỆU (WORKFLOW STEPS)
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            Bước {currentStep} / {STEPS.length}
          </div>
        </div>

        {/* Stepper circles */}
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
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  background: isCurrent ? '#ff0000' : isCompleted ? '#2ba640' : '#222',
                  color: isCurrent || isCompleted ? '#fff' : '#666',
                  border: isCurrent ? '2px solid #fff' : isCompleted ? '1px solid #4ade80' : '1px solid #333',
                  boxShadow: isCurrent ? '0 0 12px rgba(255, 0, 0, 0.6)' : 'none',
                }}>
                  {isCompleted ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: isCurrent ? '#fff' : isCompleted ? '#aaa' : '#666',
                  fontWeight: isCurrent ? 700 : 500,
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
