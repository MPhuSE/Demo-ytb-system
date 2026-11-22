import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, ArrowRight, ArrowLeft, 
  CheckCircle2, HardDrive, Cpu, Database, Globe, 
  Server, Zap, Layers, Activity, Users
} from 'lucide-react';

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
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(320px, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
        
        {/* Left: Interactive Canvas with SVG Connectors and Isometric-styled Nodes */}
        <div style={{
          background: '#121212',
          border: '1px solid #282828',
          borderRadius: '12px',
          padding: '1.5rem',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2, marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              🔴 VIDEO DATA PATH (Xử lý tệp nhị phân nặng)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              🔵 METADATA PATH (API điều khiển siêu nhẹ)
            </span>
          </div>

          {/* Visual Architecture Layout */}
          <div style={{ position: 'relative', height: '460px', width: '100%', zIndex: 3 }}>
            
            {/* SVG Connecting Paths with dynamic animated flowing dashes */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
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
                d="M 120 230 C 120 120, 200 90, 270 90"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-client-orig') ? '#f87171' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-client-orig') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-client-orig') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-client-orig') ? 'flow-animated' : ''}
              />

              {/* Conn: Original Storage -> Transcoder */}
              <path
                d="M 370 90 L 460 90"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-orig-worker') ? '#f87171' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-orig-worker') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-orig-worker') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-orig-worker') ? 'flow-animated' : ''}
              />

              {/* Conn: Transcoder -> Transcoded Storage */}
              <path
                d="M 560 90 L 640 90"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-worker-transstorage') ? '#f87171' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-worker-transstorage') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-worker-transstorage') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-worker-transstorage') ? 'flow-animated' : ''}
              />

              {/* Conn: Transcoded Storage -> CDN Edge */}
              <path
                d="M 685 130 C 685 180, 685 200, 685 240"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-cdn-transstorage') ? '#4ade80' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-cdn-transstorage') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-cdn-transstorage') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-cdn-transstorage') ? 'flow-animated' : ''}
              />

              {/* Conn: CDN Edge -> Client (Playback) */}
              <path
                d="M 640 280 C 450 310, 250 280, 120 260"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-client-cdn') ? '#4ade80' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-client-cdn') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-client-cdn') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-client-cdn') ? 'flow-animated' : ''}
              />

              {/* Conn: Client -> API Server */}
              <path
                d="M 120 260 C 140 370, 200 370, 270 370"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-client-api') ? '#3ea6ff' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-client-api') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-client-api') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-client-api') ? 'flow-animated' : ''}
              />

              {/* Conn: API Server -> Redis */}
              <path
                d="M 370 360 C 420 340, 430 310, 460 300"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-api-redis') ? '#facc15' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-api-redis') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-api-redis') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-api-redis') ? 'flow-animated' : ''}
              />

              {/* Conn: API Server -> SQLite */}
              <path
                d="M 370 380 C 420 400, 430 420, 460 430"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-api-db') ? '#3ea6ff' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-api-db') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-api-db') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-api-db') ? 'flow-animated' : ''}
              />

              {/* Conn: API Server -> Queue */}
              <path
                d="M 320 330 C 320 250, 430 200, 460 200"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-api-queue') ? '#facc15' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-api-queue') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-api-queue') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-api-queue') ? 'flow-animated' : ''}
              />

              {/* Conn: Queue -> Worker */}
              <path
                d="M 510 170 L 510 130"
                fill="none"
                stroke={stepData.activeConnections.includes('conn-queue-worker') ? '#facc15' : '#333'}
                strokeWidth={stepData.activeConnections.includes('conn-queue-worker') ? 3 : 1.5}
                strokeDasharray={stepData.activeConnections.includes('conn-queue-worker') ? '6 4' : 'none'}
                className={stepData.activeConnections.includes('conn-queue-worker') ? 'flow-animated' : ''}
              />
            </svg>

            {/* NODE 1: Client / User */}
            <div style={{
              position: 'absolute',
              top: '200px',
              left: '15px',
              width: '105px',
              padding: '0.75rem',
              background: stepData.activeNodes.includes('client') ? '#1e293b' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('client') ? '#3ea6ff' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('client') ? '0 0 16px rgba(62, 166, 255, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <div style={{ margin: '0 auto 0.25rem', width: '32px', height: '32px', borderRadius: '50%', background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={16} color="#fff" />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>User / Client</div>
              <div style={{ fontSize: '0.65rem', color: '#aaa', marginTop: '2px' }}>Upload & Watch</div>
              {stepData.activeNodes.includes('client') && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#3ea6ff', color: '#000', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                  ACTIVE CLIENT
                </div>
              )}
            </div>

            {/* NODE 2: Original Storage (Upper Left) */}
            <div style={{
              position: 'absolute',
              top: '55px',
              left: '260px',
              width: '115px',
              padding: '0.65rem',
              background: stepData.activeNodes.includes('orig-storage') ? '#261b1b' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('orig-storage') ? '#f87171' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('orig-storage') ? '0 0 16px rgba(248, 113, 113, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <HardDrive size={22} color="#f87171" style={{ margin: '0 auto 0.2rem' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}>Original Storage</div>
              <div style={{ fontSize: '0.65rem', color: '#888' }}>UUID MP4 files</div>
              {stepData.activeNodes.includes('orig-storage') && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f87171', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px' }}>
                  RECEIVING
                </div>
              )}
            </div>

            {/* NODE 3: Transcoding Worker FFmpeg (Upper Center) */}
            <div style={{
              position: 'absolute',
              top: '55px',
              left: '450px',
              width: '125px',
              padding: '0.65rem',
              background: stepData.activeNodes.includes('transcoder') ? '#2b2114' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('transcoder') ? '#f59e0b' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('transcoder') ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <Cpu size={22} color="#f59e0b" style={{ margin: '0 auto 0.2rem' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b' }}>FFmpeg Worker</div>
              <div style={{ fontSize: '0.65rem', color: '#888' }}>360p &bull; 720p HLS</div>
              {stepData.activeNodes.includes('transcoder') && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#000', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                  8.96x ENCODING
                </div>
              )}
            </div>

            {/* NODE 4: Transcoded Storage (Upper Right) */}
            <div style={{
              position: 'absolute',
              top: '55px',
              left: '630px',
              width: '115px',
              padding: '0.65rem',
              background: stepData.activeNodes.includes('trans-storage') ? '#1c261e' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('trans-storage') ? '#4ade80' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('trans-storage') ? '0 0 16px rgba(74, 222, 128, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <Layers size={22} color="#4ade80" style={{ margin: '0 auto 0.2rem' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4ade80' }}>Transcoded Storage</div>
              <div style={{ fontSize: '0.65rem', color: '#888' }}>.m3u8 & .ts chunks</div>
            </div>

            {/* NODE 5: CDN Edge Node (Center Right) */}
            <div style={{
              position: 'absolute',
              top: '235px',
              left: '625px',
              width: '125px',
              padding: '0.65rem',
              background: stepData.activeNodes.includes('cdn') ? '#162828' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('cdn') ? '#2dd4bf' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('cdn') ? '0 0 16px rgba(45, 212, 191, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <Globe size={22} color="#2dd4bf" style={{ margin: '0 auto 0.2rem' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2dd4bf' }}>CDN Edge Cache</div>
              <div style={{ fontSize: '0.65rem', color: '#888' }}>SGN-Edge-01</div>
              {stepData.activeNodes.includes('cdn') && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#2dd4bf', color: '#000', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                  CACHE HIT (148MB/s)
                </div>
              )}
            </div>

            {/* NODE 6: API Server (Lower Left) */}
            <div style={{
              position: 'absolute',
              top: '335px',
              left: '260px',
              width: '115px',
              padding: '0.65rem',
              background: stepData.activeNodes.includes('api-server') ? '#1e283b' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('api-server') ? '#3ea6ff' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('api-server') ? '0 0 16px rgba(62, 166, 255, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <Server size={22} color="#3ea6ff" style={{ margin: '0 auto 0.2rem' }} />
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#3ea6ff' }}>Express API</div>
              <div style={{ fontSize: '0.65rem', color: '#888' }}>Port 3001</div>
              {stepData.activeNodes.includes('api-server') && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#3ea6ff', color: '#000', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                  11.9k RPS (7.8ms)
                </div>
              )}
            </div>

            {/* NODE 7: Queue (Lower Mid-Left) */}
            <div style={{
              position: 'absolute',
              top: '175px',
              left: '450px',
              width: '120px',
              padding: '0.55rem',
              background: stepData.activeNodes.includes('queue') ? '#262016' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('queue') ? '#facc15' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('queue') ? '0 0 16px rgba(250, 204, 21, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <Activity size={18} color="#facc15" style={{ margin: '0 auto 0.2rem' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#facc15' }}>Transcode Queue</div>
              <div style={{ fontSize: '0.62rem', color: '#888' }}>Concurrency = 1</div>
            </div>

            {/* NODE 8: Redis (Lower Center) */}
            <div style={{
              position: 'absolute',
              top: '280px',
              left: '450px',
              width: '120px',
              padding: '0.55rem',
              background: stepData.activeNodes.includes('redis') ? '#2b2114' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('redis') ? '#facc15' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('redis') ? '0 0 16px rgba(250, 204, 21, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <Database size={18} color="#facc15" style={{ margin: '0 auto 0.2rem' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#facc15' }}>Redis Cache</div>
              <div style={{ fontSize: '0.62rem', color: '#888' }}>status:id (38k RPS)</div>
            </div>

            {/* NODE 9: SQLite (Lower Right) */}
            <div style={{
              position: 'absolute',
              top: '395px',
              left: '450px',
              width: '120px',
              padding: '0.55rem',
              background: stepData.activeNodes.includes('sqlite') ? '#1e2430' : '#181818',
              border: `2px solid ${stepData.activeNodes.includes('sqlite') ? '#60a5fa' : '#333'}`,
              borderRadius: '10px',
              boxShadow: stepData.activeNodes.includes('sqlite') ? '0 0 16px rgba(96, 165, 250, 0.4)' : 'none',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}>
              <Database size={18} color="#60a5fa" style={{ margin: '0 auto 0.2rem' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa' }}>SQLite DB</div>
              <div style={{ fontSize: '0.62rem', color: '#888' }}>WAL Mode &bull; Metadata</div>
            </div>

          </div>

          {/* Legend at bottom of canvas */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #222',
            fontSize: '0.72rem',
            color: '#aaa',
            flexWrap: 'wrap',
            zIndex: 2,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f87171' }} />
              Tệp Video Nặng (Video Data Path)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3ea6ff' }} />
              API Request (Metadata Path)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#facc15' }} />
              Queue & Redis State
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
              CDN HLS Delivery
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
