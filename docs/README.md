# THƯ VIỆN TÀI LIỆU DỰ ÁN (PROJECT DOCUMENTATION)

Thư mục này chứa toàn bộ các tài liệu kỹ thuật, kiến trúc và đo lường hiệu năng của hệ thống Mini YouTube.

## Danh mục tài liệu

1. **[Tài liệu Kiến trúc, Các Luồng Xử lý & Mã nguồn Cốt lõi](file:///C:/Users/Administrator/Desktop/Demo-ytb-system/docs/SYSTEM_WORKFLOWS_AND_CODE.md):**
   * Phân tách 2 đường truyền: **Control Path** (JSON API) và **Video Path** (Media Streaming).
   * Phân tích 4 luồng xử lý chính: Async Ingestion, ABR Transcoding Pipeline, Status Polling (Cache-Aside), HLS Playback & CDN Simulation.
   * Danh mục và trích dẫn mã nguồn các hàm quan trọng nhất: `createVideo`, `processNext`, `probe`, `encodeRendition`, `getMiddleware`, `getVideoStatus`, `initializePlayer`.
   * Kiến thức System Design trọng tâm (HTTP 202, HLS 4s segment, chống upscale, cache HIT/MISS).

2. **[Tài liệu Đo lường Hiệu năng & Telemetry Guide](file:///C:/Users/Administrator/Desktop/Demo-ytb-system/docs/PERFORMANCE_METRICS.md):**
   * Định nghĩa toàn diện các chỉ số: `queue_wait_ms`, `transcode_latency_ms`, `total_time_to_ready_ms`, `transcode_speed_factor`, `compression_ratio`.
   * Phân rã luồng thời gian (Waterfall Breakdown: API Ingestion, Queue, Transcode).
   * Kiểm thử chịu tải (Stress Testing: RPS, Latency p50/p90/p99, Throughput, Success Rate).
   * Cơ chế đệm CDN Edge (Cache HIT/MISS ratio) và Redis Status Polling.
   * Ngưỡng đánh giá SLA/SLO và kịch bản trả lời phản biện.

---
*Tham khảo tài liệu thiết kế gốc tại thư mục gốc:*
* [README.md (Hướng dẫn khởi động nhanh)](file:///C:/Users/Administrator/Desktop/Demo-ytb-system/README.md)
* [TEAM_DEVELOPMENT_GUIDE.md (Quy chuẩn phát triển nhóm)](file:///C:/Users/Administrator/Desktop/Demo-ytb-system/TEAM_DEVELOPMENT_GUIDE.md)
* [voicebox-DESIGN.md (Đặc tả thiết kế giao diện)](file:///C:/Users/Administrator/Desktop/Demo-ytb-system/voicebox-DESIGN.md)
