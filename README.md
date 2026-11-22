# MINI YOUTUBE — SYSTEM DESIGN MVP

> Dự án mô phỏng kiến trúc **Design YouTube** (theo *System Design Interview* — Alex Xu, Chương 14) chạy thực tế trên `localhost`.  
> Phục vụ mục đích: **Trình diễn demo hoàn chỉnh (Upload → Transcoding → HLS Playback)** và **giải thích các luồng kiến trúc (Workflows)**.

---

## 1. Kiến trúc hệ thống & Hai đường truyền dữ liệu

```
[React Client :5173]
       │
       ├── (1) Control Path: API Metadata / JSON ──────────► [Express API :3001]
       │   - POST /api/v1/videos (Trả 202 Accepted)                 │
       │   - GET /api/v1/videos/:id/status (Polling)                ▼
       │   - GET /api/v1/videos/:id/playback                [SQLite Metadata]
       │                                                            │
       │                                                            ▼
       │                                                  [Transcode Queue]
       │                                                            │
       │                                                            ▼
       │                                                   [FFmpeg Runner]
       │                                                    (360p & 720p HLS)
       │                                                            │
       └── (2) Video Path: HLS Streaming (.m3u8, .ts) ◄─────────────┘
           - Tải master.m3u8 & segments trực tiếp từ Media Origin
```

### 4 Workflow cốt lõi cần giải thích khi Demo
1. **Control Path vs Video Path:** API Server chỉ xử lý logic nhẹ (JSON), không gánh stream media. Media Origin phục vụ trực tiếp các file `.m3u8` và `.ts`.
2. **Async Ingestion (Tiếp nhận bất đồng bộ):** Client upload MP4 $\to$ Server lưu tạm $\to$ Ghi nhận `QUEUED` $\to$ **Trả ngay HTTP 202 Accepted**. Không chạy FFmpeg đồng bộ để tránh nghẽn thread và timeout HTTP.
3. **Adaptive Bitrate Transcoding (HLS):** Worker dùng `ffprobe` đọc thông số gốc $\to$ Dùng `ffmpeg` cắt ra các segment `.ts` 4 giây cho độ phân giải 360p và 720p (chỉ sinh 720p nếu nguồn $\ge 720\text{p}$) $\to$ Tạo `master.m3u8` $\to$ Xác thực xong mới chuyển trạng thái sang `READY`.
4. **HLS Streaming Playback:** Trình phát `hls.js` đọc `master.m3u8`, tự động đo băng thông mạng để nhảy chất lượng mượt mà (Auto ABR) hoặc cho phép người dùng tự chọn độ phân giải.

---

## 2. Hướng dẫn khởi động nhanh (Quick Start)

### Yêu cầu tiên quyết
* Node.js $\ge 18$
* FFmpeg và FFprobe đã cài trong hệ thống (`ffmpeg -version`)

### Bước 1: Chuẩn bị dữ liệu Demo mẫu (Seed)
Lệnh sau sẽ sinh video test 720p và chạy pipeline transcode sẵn 1 video ở trạng thái `READY`:
```bash
npm run seed
```

### Bước 2: Chạy Server (Terminal 1)
```bash
npm run dev:server
```
* API Health: [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)
* Media Origin: [http://localhost:3001/media](http://localhost:3001/media)

### Bước 3: Chạy Client (Terminal 2)
```bash
npm run dev:client
```
* Truy cập giao diện: [http://localhost:5173](http://localhost:5173)

---

## 3. Kịch bản Demo 90 giây trước Hội Đồng / Giảng Viên

1. **Bước 1 (00s - 20s) — Minh chứng Video Path:**
   * Mở giao diện `http://localhost:5173`.
   * Bấm nút Play trên video mẫu **Demo Ready Video (720p HLS)**.
   * Mở **F12 &gt; Network tab**, lọc `.ts` hoặc `.m3u8`.
   * *Giải thích:* *"Hệ thống dùng giao thức HLS. Thầy/cô thấy trình duyệt đang tải `master.m3u8` và các file `segment.ts` độ dài 4 giây trực tiếp từ Media Server."*
2. **Bước 2 (20s - 35s) — Minh chứng Adaptive Bitrate:**
   * Đổi chất lượng từ **Auto** sang **360p** hoặc **720p** trên thanh điều khiển.
   * *Giải thích:* *"Player chuyển đổi qua lại giữa các sub-playlist mà không cần tải lại toàn bộ video."*
3. **Bước 3 (35s - 55s) — Minh chứng Asynchronous Ingestion:**
   * Bấm **Tải Video Lên**, chọn file `fixtures/sample_720p.mp4` (hoặc video ngắn bất kỳ).
   * Bấm **Bắt Đầu Upload**.
   * *Giải thích:* *"Server trả ngay mã **HTTP 202 Accepted** cùng Video ID. Trạng thái ban đầu là `QUEUED`."*
4. **Bước 4 (55s - 75s) — Minh chứng Queue & Transcoder:**
   * Nhìn thấy trạng thái trên UI đổi sang **`PROCESSING`** kèm thanh tiến trình phần trăm (%).
   * Terminal server hiển thị log FFmpeg đang xử lý ngầm.
5. **Bước 5 (75s - 90s) — Hoàn tất chuỗi:**
   * Trạng thái chuyển sang **`READY`**, video mới xuất hiện sẵn sàng để phát ngay lập tức.
   * Bấm nút **Giải Thích Kiến Trúc** trên thanh menu để mở sơ đồ tổng quan đối chiếu.

---

## 4. Cheat Sheet — Trả lời phản biện

* **Q: Tại sao trả về HTTP 202 thay vì 200?**  
  *A: 202 Accepted biểu thị yêu cầu đã được tiếp nhận nhưng việc xử lý chưa xong. Encode video tốn CPU và thời gian, nếu giữ kết nối đồng bộ sẽ gây timeout và cạn kiệt tài nguyên server.*
* **Q: Tại sao phải dùng HLS thay vì file MP4 nguyên bản?**  
  *A: HLS cắt nhỏ video thành nhiều phân đoạn 4 giây, giúp người dùng xem đến đâu tải đến đó (tiết kiệm băng thông) và hỗ trợ tự động đổi độ phân giải theo tốc độ mạng mà không bị đứng hình.*
* **Q: Làm sao tránh việc upscale video chất lượng thấp lên 720p?**  
  *A: Worker chạy `ffprobe` trước để lấy chiều cao (height). Nếu video gốc $< 720\text{px}$, FFmpeg chỉ tạo profile 360p và `master.m3u8` chỉ liệt kê 360p.*
* **Q: Mở rộng hệ thống này lên quy mô lớn thế nào?**  
  *A: Thay thư mục ổ đĩa bằng Object Storage (S3/MinIO), thay in-memory queue bằng Redis BullMQ / Kafka với cụm Worker GPU riêng, và đặt CDN phía trước để cache các file `.ts`.*
