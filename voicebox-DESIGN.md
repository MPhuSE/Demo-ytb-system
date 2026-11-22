# Mini YouTube (YTB) UI Component Design System

> **Tài liệu đặc tả:** Chuẩn hóa toàn bộ thành phần giao diện (UI Components) cho hệ thống **Mini YouTube (`system_ytb`)** theo phong cách YouTube Web hiện đại.  
> **Chủ đề mặc định:** Dark Mode (chuẩn video streaming) + Light Mode  
> **Font chủ đạo:** Roboto / System Sans-Serif  
> **Đặc trưng thị giác:** Bo góc tròn (Pill-shape `9999px`, Card `12px`, Chip `8px`), biểu tượng trực quan, thanh điều khiển phát video HLS chuyên dụng.

---

## 1. Bảng Màu (Color Palette)

### 1.1. Dark Theme (Mặc định cho nền tảng Video)

| Token | Hex | Vai trò / Ứng dụng |
| :--- | :--- | :--- |
| **Brand Red** | `#FF0000` | Logo YouTube, thanh tiến trình video (Scrubber), trạng thái nổi bật |
| **Brand Red Hover** | `#CC0000` | Trạng thái hover của các nút/điểm nhấn đỏ |
| **Accent Blue** | `#3EA6FF` | Link, nút "Đăng nhập", nút CTA trong YouTube Studio |
| **Background** | `#0F0F0F` | Nền tổng thể toàn trang (Pure dark) |
| **Surface (Header/Sidebar)**| `#0F0F0F` / `#121212` | Thanh điều hướng trên đỉnh và sidebar |
| **Surface Card / Container** | `#1F1F1F` | Khung mô tả video, dropdown menu, modal popup |
| **Surface Raised / Button** | `#272727` | Nền nút thứ cấp, chip chưa chọn, ô search bar |
| **Surface Hover** | `#3F3F3F` | Trạng thái hover của chip, nút xám và hàng danh sách |
| **Border Subtle** | `#272727` | Viền ngăn cách nhẹ giữa các khu vực |
| **Border Medium** | `#383838` | Viền ô tìm kiếm, viền hộp thoại |
| **Text Primary** | `#F1F1F1` | Tiêu đề video, văn bản chính |
| **Text Secondary** | `#AAAAAA` | Tên kênh, số lượt xem, thời gian đăng video |
| **Text Tertiary / Disabled** | `#717171` | Chữ bị vô hiệu hóa, placeholder |

### 1.2. Light Theme

| Token | Hex | Vai trò / Ứng dụng |
| :--- | :--- | :--- |
| **Background** | `#FFFFFF` | Nền trang sáng |
| **Surface Raised / Chip** | `#F2F2F2` (Hover `#E5E5E5`) | Nền chip, nút phụ |
| **Border** | `#E5E5E5` / `#CCCCCC` | Viền khung và ô search |
| **Text Primary** | `#0F0F0F` | Chữ chính |
| **Text Secondary** | `#606060` | Phụ đề, tên kênh |

### 1.3. Trạng Thái Video (Khớp chuẩn API `contracts/openapi.yaml`)

| Trạng thái Backend | Màu sắc | Mã màu | Hiển thị giao diện (Badge / Chip) |
| :--- | :--- | :--- | :--- |
| `QUEUED` | Vàng hổ phách | `#EAB308` | `⏳ Đang chờ hàng đợi` |
| `PROCESSING` | Xanh dương | `#3EA6FF` | `⚙️ Đang xử lý ({progress}%)` (kèm hiệu ứng xoay/pulse) |
| `READY` | Xanh lá | `#22C55E` | `✓ Đã sẵn sàng` (cho phép phát video) |
| `FAILED` | Đỏ cảnh báo | `#EF4444` | `✕ Thất bại` (kèm tooltip báo lỗi) |

---

## 2. Bo Góc & Hình Khối (Border Radius & Shape Language)

YouTube áp dụng ngôn ngữ bo cong mềm mại (M3 Rounded Language) thay vì các góc sắc nhọn:

| Mức độ | Giá trị | Áp dụng cho thành phần |
| :--- | :--- | :--- |
| **Pill (Full)** | `9999px` / `18px-24px` | Nút hành động (Đăng ký, Like, Chia sẻ), Nút "+ Tạo", Khung Search Bar |
| **Large Rounded** | `12px` | Thumbnail video, Khung Video Player, Hộp mô tả, Dialog/Modal |
| **Medium Rounded** | `8px` | Thanh chip bộ lọc danh mục (Filter Chips), Dropdown menu, Context menu |
| **Small Rounded** | `4px` | Nhãn thời lượng video (Duration badge trên thumbnail), Thanh tiến trình |
| **Circle** | `50%` | Ảnh đại diện kênh (Avatar 36px/40px), Nút Icon (Mic, Chuông, Menu 40x40px) |

---

## 3. Hệ Thống Kiểu Chữ (Typography)

* **Font Stack:** `Roboto, "YouTube Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
* **Quy tắc:** Sử dụng Sentence case (chữ hoa đầu câu), **không dùng ALL CAPS** để tránh cảm giác thô cứng.

| Cấp bậc | Cỡ chữ | Độ đậm | Line Height | Ứng dụng thực tế |
| :--- | :--- | :--- | :--- | :--- |
| **Watch Title** | 20px | 600 (Semi-bold) | 28px | Tiêu đề video chính trên trang xem video |
| **Grid Card Title** | 16px | 500 (Medium) | 22px | Tiêu đề video dạng lưới trang chủ (giới hạn tối đa 2 dòng, `line-clamp: 2`) |
| **Sidebar Card Title** | 14px | 500 (Medium) | 20px | Tiêu đề video gợi ý ở cột bên phải trang xem |
| **Body / Description** | 14px | 400 (Regular) | 20px | Nội dung mô tả video, comment |
| **Metadata / Channel** | 12px | 400 (Regular) | 18px | Tên kênh, số view, ngày đăng (`1.2 Tr lượt xem • 2 ngày trước`) |
| **Button / Chip Label** | 14px | 500 (Medium) | 20px | Nhãn nút hành động, thẻ bộ lọc |
| **Badge / Timestamp** | 12px | 500 (Medium) | 16px | Nhãn thời lượng video trên góc thumbnail (VD: `14:25`) |

---

## 4. Đặc Tả Các Thành Phần Cốt Lõi (Core Components)

### 4.1. Top Navigation Bar (Thanh Điều Hướng Trên Cùng)

* **Chiều cao:** 56px, `background: #0F0F0F`, cố định trên đỉnh (`position: sticky; top: 0; z-index: 100`).
* **Cấu trúc 3 vùng:**
  1. **Trái:**
     * Icon Hamburger Menu (Lucide `Menu`, 24px) đặt trong vùng tròn 40x40px chạm nhẹ hover.
     * Logo Mini YouTube: Biểu tượng tam giác Play đỏ (`#FF0000`) bo cong nhẹ + Chữ "YouTube" hoặc "Mini YTB" trắng.
  2. **Giữa (Thanh tìm kiếm):**
     * Hộp tìm kiếm kết hợp (Pill-shape):
       * Ô Input: Cao 40px, viền trái bo cong `40px 0 0 40px`, nền `#121212`, viền `1px solid #303030`, chữ trắng `#F1F1F1`, placeholder "Tìm kiếm".
       * Nút Search (Kính lúp): Rộng 64px, cao 40px, bo cong `0 40px 40px 0`, nền `#222222`, viền `1px solid #303030`, icon Lucide `Search` 20px.
     * Nút Tìm kiếm giọng nói (Microphone): Nút tròn 40x40px, nền `#272727`, hover `#3F3F3F`, đặt cạnh ô tìm kiếm.
  3. **Phải:**
     * Nút **"+ Tạo" (Upload Video):** Dạng Pill (`border-radius: 9999px`, nền `#272727`, hover `#3F3F3F`, icon Lucide `Plus` hoặc `Video` + chữ "Tạo").
     * Nút Chuông thông báo: Tròn 40x40px.
     * Avatar người dùng: Tròn 32x32px viền mỏng hoặc ảnh mặc định.

---

### 4.2. Filter Chips Bar (Thanh Thẻ Phân Loại Danh Mục)

* **Vị trí:** Ngay dưới Header ở trang chủ, thanh cuộn ngang mượt mà (`overflow-x: auto; no-scrollbar`).
* **Thành phần Chip:**
  * Chiều cao: 32px, `padding: 0 12px`, `border-radius: 8px`, `font-size: 14px`, `font-weight: 500`.
  * **Trạng thái Chưa chọn (Inactive):** Nền `#272727`, chữ `#F1F1F1`, hover `#3F3F3F`.
  * **Trạng thái Đang chọn (Active):** Nền `#F1F1F1`, chữ `#0F0F0F` (đảo màu tương phản cao).

---

### 4.3. Video Card (Thẻ Hiển Thị Video)

#### A. Dạng Lưới Trang Chủ (Grid Card)
* **Thumbnail:**
  * Tỉ lệ vàng `16:9`, `border-radius: 12px`, tràn viền, `object-fit: cover`.
  * **Duration Badge (Thời lượng):** Nằm ở góc dưới cùng bên phải thumbnail, `background: rgba(0, 0, 0, 0.8)`, `color: #FFFFFF`, `font-size: 12px`, `font-weight: 500`, `border-radius: 4px`, `padding: 2px 4px`.
  * **Status Badge (Nếu video chưa READY):**
    * Khi `status === "QUEUED"`: Huy hiệu màu vàng hổ phách ở góc trên trái.
    * Khi `status === "PROCESSING"`: Huy hiệu màu xanh dương kèm phần trăm xử lý `{progress}%`.
    * Khi `status === "FAILED"`: Huy hiệu màu đỏ.
* **Thông tin bên dưới Thumbnail:**
  * Bố cục 2 cột:
    * Cột 1 (Trái): Avatar kênh tròn `36x36px`.
    * Cột 2 (Phải):
      * **Tiêu đề video:** 16px, `font-weight: 500`, màu `#F1F1F1`, tối đa 2 dòng (`display: -webkit-box; -webkit-line-clamp: 2; overflow: hidden;`).
      * **Tên kênh:** 14px, màu `#AAAAAA`, hover màu `#F1F1F1`.
      * **Metadata:** 12px, màu `#AAAAAA` (Ví dụ: `54 N lượt xem • 3 ngày trước`).

#### B. Dạng Danh Sách Cột Phải (Compact Sidebar Card)
* Áp dụng cho cột video liên quan trên trang xem video.
* Bố cục hàng ngang (Flex Row): Thumbnail nhỏ kích thước cố định `168px x 94px` (bo góc 8px) bên trái, thông tin tiêu đề (14px) và metadata bên phải.

---

### 4.4. Video Player & Custom Controls (Trình Phát Video HLS)

Tích hợp thư viện `hls.js` cho luồng stream adaptive bitrate:

```
┌─────────────────────────────────────────────────────────────┐
│  ▶ Video Player Area (16:9 Aspect Ratio / #000000)          │
│                                                             │
│                                                             │
│  [======================●────────────────────────────────]  │ ◄── Scrubber (#FF0000)
│  ▶   🔊 ━━●   02:45 / 10:20                [360p/720p] ⛶ ⛶  │ ◄── Controls Bar
└─────────────────────────────────────────────────────────────┘
```

* **Khung chứa (Container):** Nền đen `#000000`, bo góc `12px` (hoặc góc vuông `0px` khi bật chế độ Rạp chiếu phim / Toàn màn hình).
* **Thanh tiến trình (Progress Scrubber):**
  * Nền rãnh xám mờ (`rgba(255, 255, 255, 0.2)`).
  * Vùng đã buffer (đệm): Màu xám sáng hơn (`rgba(255, 255, 255, 0.4)`).
  * Vùng đã phát: Màu đỏ thương hiệu YouTube (`#FF0000`).
  * Con trỏ kéo (Scrubber Knob): Nút tròn đỏ 12px, tự động phóng to nhẹ khi hover.
* **Thanh điều khiển đáy (Control Bar):** Nền dải gradient đen trong suốt (`linear-gradient(to top, rgba(0,0,0,0.8), transparent)`).
  * **Cụm trái:**
    * Nút Phát / Tạm dừng (Play / Pause).
    * Nút Âm lượng & Thanh trượt âm lượng (Volume Slider xuất hiện khi hover).
    * Hiển thị thời gian: `14px`, màu `#FFFFFF` (`02:30 / 12:45`).
  * **Cụm phải:**
    * **Bộ chọn chất lượng (Quality Selector):** Icon bánh răng cài đặt (Lucide `Settings`), bấm mở menu popup chọn:
      * `Tự động (Auto)`
      * `720p HD`
      * `360p SD`
      *(Khớp với API `GET /videos/{id}/playback` trả về `qualities: ["360p", "720p"]`)*.
    * Nút Chế độ rạp chiếu phim (Theater Mode).
    * Nút Toàn màn hình (Fullscreen toggle).

---

### 4.5. Watch Page Action Bar (Thanh Tương Tác Dưới Video)

* **Cụm thông tin kênh & Nút Đăng ký (Kênh bên trái):**
  * Avatar tròn `40x40px` + Tên kênh (`font-weight: 600`, 16px) + Số người đăng ký (`12px`, `#AAAAAA`).
  * **Nút Đăng Ký (Subscribe Button):**
    * Dạng Pill: Chiều cao 36px, `padding: 0 16px`, `border-radius: 18px`, `font-size: 14px`, `font-weight: 500`.
    * **Chưa đăng ký:** Nền trắng `#F1F1F1`, chữ đen `#0F0F0F`, hover `#D9D9D9`.
    * **Đã đăng ký:** Nền xám `#272727`, chữ trắng `#F1F1F1`, hover `#3F3F3F`.
* **Cụm nút hành động (Bên phải):**
  * **Nút Like / Dislike gộp (Joined Pill):**
    * Nền `#272727`, `border-radius: 18px`, chiều cao 36px.
    * Gồm icon Like + Số lượt thích, đường vạch ngăn cách mỏng 1px (`#3F3F3F`), và icon Dislike.
  * **Nút Chia sẻ (Share Button):** Dạng Pill, nền `#272727`, icon Lucide `Share2` + "Chia sẻ".
  * **Nút Lưu / Khác:** Nút tròn hoặc pill bổ trợ.
* **Hộp mô tả (Description Box):**
  * Đặt ngay dưới thanh hành động: `background: #272727`, `border-radius: 12px`, `padding: 12px`, hover `#333333`.
  * Dòng đầu: Lượt xem và ngày đăng định dạng đậm.
  * Nội dung thu gọn với nút "...thêm" / "Ẩn bớt".

---

### 4.6. Hộp Thoại Tải Lên Video (YouTube Studio Upload Modal)

Trải nghiệm tải video mô phỏng chính xác YouTube Studio, phục vụ API `POST /api/v1/videos`:

```
┌────────────────────────────────────────────────────────┐
│  Tải video lên                                     [X] │
├────────────────────────────────────────────────────────┤
│                                                        │
│               ╭───────────╮                            │
│               │     ▲     │  (Vòng tròn xám #1F1F1F)   │
│               │     │     │                            │
│               ╰───────────╯                            │
│       Kéo và thả tệp video để tải lên                 │
│                                                        │
│             [ CHỌN TỆP ]  ──> Nút xanh #3EA6FF         │
│                                                        │
│       Hỗ trợ: MP4 (Tối đa 100MB cho bản MVP)           │
├────────────────────────────────────────────────────────┤
│  Tiến trình: [████████████░░░░░░░░] 60% Đang xử lý HLS │
└────────────────────────────────────────────────────────┘
```

1. **Khung chứa Modal:** Nền `#282828`, `border-radius: 16px`, có lớp phủ nền mờ `rgba(0, 0, 0, 0.6)`.
2. **Khu vực kéo thả (Dropzone):**
   * Biểu tượng mũi tên tải lên tròn lớn đặt giữa trung tâm.
   * Chữ hướng dẫn: "Kéo và thả tệp video để tải lên".
   * Nút **"Chọn tệp"**: Dạng Pill màu xanh YouTube `#3EA6FF` hoặc trắng sáng.
3. **Màn hình nhập thông tin sau khi chọn tệp:**
   * **Ô nhập Tiêu đề (Bắt buộc):** Chiều cao 56px, viền bo tròn 8px với nhãn nổi kiểu Material, giới hạn ký tự.
   * **Trạng thái xử lý thời gian thực (Polling `/api/v1/videos/{id}/status`):**
     * Thanh tiến trình thanh mảnh chạy từ 0% đến 100%.
     * Hiển thị trạng thái:
       * `QUEUED`: Đang xếp hàng chờ xử lý...
       * `PROCESSING`: Đang chuyển mã đa độ phân giải 360p / 720p ({progress}%)...
       * `READY`: Đã xử lý xong. Video sẵn sàng phát!
       * `FAILED`: Quá trình chuyển mã thất bại. Vui lòng thử lại.

---

## 5. Bảng Đối So sánh: VoiceBox Cũ vs. Chuẩn YouTube Mới

| Yếu tố | VoiceBox Cũ (Tạp chí Báo in) | Chuẩn YouTube Mới (Đã Cập Nhật) |
| :--- | :--- | :--- |
| **Màu chủ đạo** | Trắng ngà `#FAFAFA`, Đen `#0A0A0A` | **Dark Mode `#0F0F0F`**, Đỏ YouTube `#FF0000`, Nền Card `#1F1F1F` |
| **Bo góc (Radius)** | Góc vuông tuyệt đối `0px` | **Bo tròn mềm mại: Pill `9999px`, Card `12px`, Chip `8px`** |
| **Typography** | `Archivo Black` in hoa gắt gỏng | **`Roboto` / Sans-serif mềm mại, Sentence case chuẩn mực** |
| **Thanh tìm kiếm** | Ô vuông viền đen thô | **Search bar dạng Pill tích hợp nút kính lúp + Mic tròn** |
| **Thẻ Video** | Viền đen phẳng `2px`, không có duration | **Thumbnail 16:9 bo góc 12px, có nhãn thời lượng, avatar tròn** |
| **Trình phát video** | Không định nghĩa | **Player HLS hoàn chỉnh: Thanh kéo đỏ `#FF0000`, menu chọn 360p/720p** |
| **Nút hành động** | Nút chữ nhật in hoa, hover đỏ rực | **Nút Pill tròn (Đăng ký, Like/Dislike đôi, Chia sẻ)** |
| **Quy trình Upload** | Input form thông thường | **YouTube Studio Modal: Kéo thả, thanh tiến trình & trạng thái chuyển mã** |
