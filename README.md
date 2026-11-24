# Mini YouTube — System Design Project

> Dự án mô phỏng kiến trúc hệ thống chia sẻ và phát video trực tuyến (dựa trên bài toán **Design YouTube** trong cuốn *System Design Interview* — Alex Xu, Chương 14).  
> Mã nguồn được thiết kế hoàn chỉnh chạy trên `localhost` nhằm giúp người học thực hành và nắm bắt các khái niệm System Design thực tế thay vì chỉ học lý thuyết trừu tượng.

---

## 🎯 1. Các kiến thức cốt lõi học được từ dự án

Dự án này tích hợp và giải quyết các bài toán kỹ thuật thường gặp khi thiết kế hệ thống phân tán:

### 1.1. Phân tách hai luồng dữ liệu (Control Path vs Data Path)
* **Control Path (Metadata Path):** Xử lý các nghiệp vụ nhẹ qua RESTful API bằng JSON (tiêu đề, thời lượng, trạng thái, tiến độ). Luồng này yêu cầu độ trễ thấp và không được để các tác vụ nặng làm nghẽn thread.
* **Video Path (Data Path):** Chịu trách nhiệm tải và truyền phát dữ liệu media nhị phân dung lượng lớn (video segments, playlists). Trong thực tế, luồng này sẽ đi trực tiếp qua Object Storage và mạng CDN, tách biệt hoàn toàn khỏi máy chủ API ứng dụng.

### 1.2. Giao thức Streaming & Adaptive Bitrate (HLS)
* **Tại sao không phát trực tiếp file MP4 nguyên bản?** File MP4 nguyên khối bắt buộc người dùng tải tuần tự hoặc tốn nhiều băng thông tải trước những đoạn chưa xem.
* **Nguyên lý HLS (HTTP Live Streaming):**
  * Video được phân tách thành các đoạn ngắn độc lập có thời lượng 4 giây định dạng `.ts`.
  * **Master Playlist (`master.m3u8`):** Đóng vai trò chỉ mục tổng, liệt kê các profile chất lượng khả dụng (`360p`, `720p`) cùng băng thông tương ứng.
  * **Media Playlists (`360p.m3u8`, `720p.m3u8`):** Danh sách trỏ tuần tự đến từng file chunk `.ts`.
* **Adaptive Bitrate Streaming (ABR):** Phía Client tích hợp thư viện `hls.js` để tự động đo tốc độ mạng hiện thời của người xem và linh hoạt nhảy profile (từ 720p xuống 360p khi mạng yếu hoặc ngược lại) mà không làm ngắt quãng video.

### 1.3. Tiếp nhận bất đồng bộ (Asynchronous Ingestion)
* **HTTP 202 Accepted:** Tác vụ mã hóa video tiêu tốn rất nhiều CPU và thời gian xử lý. Việc giữ kết nối HTTP đồng bộ sẽ gây nghẽn kết nối và timeout. Do đó, API lưu file tạm vào đĩa, ghi nhận trạng thái ban đầu là `QUEUED` và phản hồi ngay mã **HTTP 202 Accepted** cùng `videoId`.
* **Hàng đợi tác vụ (Job Queue):** Quản lý thứ tự chuyển mã, tách biệt khâu nhận request và khâu xử lý CPU-bound.
* **Cập nhật tiến trình qua Polling:** Client gửi request thăm dò định kỳ (mỗi 2 giây) tới endpoint `/api/v1/videos/:id/status` để hiển thị thanh tiến trình phần trăm thực tế cho người dùng.

### 1.4. Xử lý Media với FFmpeg & FFprobe
* **Đọc metadata trước khi nén (Probe):** Sử dụng `ffprobe` trích xuất độ phân giải (`width`, `height`), thời lượng (`duration`) và codec gốc.
* **Tránh upscale video giả tạo:** Hệ thống kiểm tra: chỉ sinh profile `720p` khi video gốc có độ phân giải $\ge 720\text{p}$. Nếu video nguồn có chất lượng thấp hơn, hệ thống chỉ tạo profile `360p` để tiết kiệm tài nguyên tính toán và lưu trữ.
* **Mã hóa đa luồng:** Chuyển đổi video sang chuẩn nén H.264 (`libx264`) và âm thanh AAC (`aac`), định cấu hình khoảng cách keyframe cố định (`-g 48`, `-keyint_min 48`) để đảm bảo các đoạn cắt 4 giây có thể chuyển đổi mượt mà giữa các profile.

### 1.5. Bộ nhớ đệm & Cơ sở dữ liệu (Caching & Concurrency)
* **Redis Cache-Aside:** Lưu tạm trạng thái video (`status:<id>`) trên RAM để phục vụ hàng ngàn request polling từ Client mà không gây quá tải cho ổ đĩa cơ sở dữ liệu.
* **TTL (Time-To-Live) phân tầng:**
  * Video đang xử lý (`PROCESSING`): TTL 2 giây (vì phần trăm tiến độ thay đổi liên tục).
  * Video đã hoàn tất (`READY`): TTL 3600 giây (dữ liệu cố định).
* **Cơ chế Fallback (Graceful Degradation):** Nếu môi trường chưa bật Redis, hệ thống tự động suy giảm nhẹ về bộ nhớ RAM của tiến trình (In-Memory) mà không làm sập ứng dụng.
* **SQLite WAL Mode:** Kích hoạt `PRAGMA journal_mode = WAL` (Write-Ahead Logging) cho phép các truy vấn đọc và ghi thực thi song song, tối ưu hóa I/O trên đĩa.
* **Mô phỏng CDN Edge Caching:** Cung cấp middleware phục vụ media tĩnh, gắn cờ `X-Cache-Status` (`HIT` / `MISS`) để quan sát cơ chế lưu đệm ở tầng biên.

### 1.6. Quan sát & Đánh giá hiệu năng (Observability & Benchmarking)
* Thu thập số liệu hiệu năng sau mỗi lượt chuyển mã:
  * **Queue Wait Time:** Thời gian nằm chờ trong hàng đợi.
  * **Transcode Latency:** Thời gian FFmpeg thực thi.
  * **Speed Factor:** Tốc độ mã hóa so với thời lượng thực tế của video ($> 1\text{x}$ nghĩa là encode nhanh hơn thời gian thực phát video).
  * **Compression Ratio:** Tỉ lệ dung lượng sau khi nén so với dung lượng file gốc.
* Tích hợp công cụ bắn tải **Autocannon** để đo RPS và độ trễ (P95, P99) của hệ thống.

---

## 🛠️ 2. Công nghệ sử dụng trong dự án

* **Backend:** Node.js, Express, TypeScript, Better-SQLite3, ioredis, Multer.
* **Media Engine:** FFmpeg & FFprobe (được nhúng sẵn qua npm, tự động chạy trên mọi máy mà không cần cài thêm cấu hình hệ thống ngoài).
* **Database & Cache:** SQLite (WAL mode), Redis / Memurai.
* **Frontend:** React 18, TypeScript, Vite, HLS.js, Lucide Icons.
* **Đo tải:** Autocannon.

---

## 🚀 3. Hướng dẫn khởi động nhanh (Quick Start)

### Yêu cầu môi trường
* Node.js phiên bản $\ge 18$.
* *(Tùy chọn)* Redis hoặc Memurai trên cổng `6379`. Nếu không có, server tự động dùng bộ nhớ trong.

### Bước 1: Cài đặt thư viện
```bash
# 1. Cài đặt cho Backend
cd server
npm install

# 2. Cài đặt cho Frontend
cd ../client
npm install
```

### Bước 2: Khởi động hệ thống
Mở 2 cửa sổ terminal riêng biệt:

* **Terminal 1 — Khởi động API Server:**
  ```bash
  cd server
  npm run dev
  ```
  * Server lắng nghe tại: `http://localhost:3001`
  * API Health Check: `http://localhost:3001/api/v1/health`
  * Media Origin: `http://localhost:3001/media`

* **Terminal 2 — Khởi động Web Client:**
  ```bash
  cd client
  npm run dev
  ```
  * Mở trình duyệt truy cập: `http://localhost:5173`

---

## 📁 4. Cấu trúc thư mục dự án

```text
Demo-ytb-system/
├── client/                     # Ứng dụng Frontend (React + Vite)
│   └── src/
│       ├── components/         # Giao diện Video Player, Upload, Studio, Mô phỏng 3D
│       ├── services/api.ts     # Đóng gói các hàm gọi API RESTful
│       └── types.ts            # Định nghĩa Interface dữ liệu TypeScript
├── server/                     # Máy chủ Backend (Express + TypeScript)
│   ├── data/                   # Nơi chứa file CSDL SQLite (mini_youtube.db)
│   ├── storage/                # Thư mục lưu trữ media
│   │   ├── originals/          # Video gốc người dùng tải lên
│   │   └── videos/             # Các phân đoạn HLS và playlist (.m3u8, .ts)
│   └── src/
│       ├── db/                 # Cấu hình CSDL SQLite và bảng dữ liệu
│       ├── infra/              # Redis client, CDN Edge Simulator, Stress tester
│       ├── modules/            # Routing, Controller, Service quản lý video
│       └── transcoding/        # Hàng đợi (Queue) & FFmpeg Transcoder
├── docs/                       # Tài liệu hướng dẫn demo và chi tiết kiến trúc
└── fixtures/                   # Video mẫu để chạy seed và đo benchmark
```

---

## 💡 5. Câu hỏi phản biện thường gặp khi học System Design

* **Q: Tại sao phải trả về HTTP 202 Accepted thay vì HTTP 200 OK khi upload video?**  
  *Trả lời:* Mã 202 biểu thị yêu cầu đã được tiếp nhận hợp lệ nhưng quá trình xử lý chưa hoàn tất. Xử lý video là tác vụ nặng, nếu giữ kết nối đồng bộ sẽ làm cạn kiệt connection pool của server và gây timeout phía client.

* **Q: Master playlist đóng vai trò gì trong kiến trúc HLS?**  
  *Trả lời:* `master.m3u8` không chứa dữ liệu video trực tiếp mà là bảng điều hướng, khai báo các luồng video khác nhau kèm thông số kỹ thuật (độ phân giải, bitrate). Video player sẽ đọc file này trước tiên để quyết định nên tải sub-playlist nào phù hợp với tốc độ mạng hiện thời.

* **Q: Hệ thống này khi đưa lên Production quy mô lớn cần nâng cấp những gì?**  
  *Trả lời:*
  1. Thay thư mục ổ cứng cục bộ bằng **Cloud Object Storage** (AWS S3, MinIO) kết hợp cơ chế Multipart Presigned URL để client upload thẳng lên S3 mà không đi qua server API.
  2. Thay in-memory queue bằng hàng đợi phân tán chuẩn công nghiệp (**Kafka, RabbitMQ, Redis BullMQ**).
  3. Cụm Worker chuyển mã video chạy độc lập trên các cụm máy chủ hỗ trợ GPU (NVIDIA NVENC) và tự động co giãn (Autoscaling).
  4. Đặt mạng **CDN thực tế** (Cloudflare, AWS CloudFront) phía trước Media Storage để cache các file chunk `.ts` gần người dùng nhất.
