# Implementation Plan – Vietjet

Antigravity cần thực hiện tuần tự, kiểm tra từng giai đoạn trước khi sang giai đoạn tiếp theo.

## Phase 1 – Project foundation
- Tạo cấu trúc thư mục:
  - `index.html`
  - `flights.html`
  - `flight-detail.html`
  - `tours.html`
  - `tour-detail.html`
  - `cart.html`
  - `assets/css/styles.css`
  - `assets/js/app.js`
  - `assets/js/db.js`
  - `assets/js/cart.js`
  - `assets/js/flights.js`
  - `assets/js/tours.js`
  - `assets/js/booking.js`
  - `assets/js/email.js`
  - `assets/images/...`
- Tạo header/footer thống nhất.
- Thiết lập Bootstrap CDN, icon, font và CSS variables.
- Kiểm tra responsive cơ bản.

**Nghiệm thu:** tất cả trang mở được, điều hướng hoạt động, không có lỗi console.

## Phase 2 – Database and sample data
- Tích hợp sql.js từ CDN hoặc dependency được ghim phiên bản.
- Khởi tạo schema theo `data-and-storage.md`.
- Seed hãng bay, 10 chuyến bay, 8 tour.
- Lưu database binary trong IndexedDB.
- Tạo helper query/insert/update/delete và format giá/ngày.

**Nghiệm thu:** refresh không mất database; dữ liệu hiển thị đúng.

## Phase 3 – Home page
- Xây dựng form tìm chuyến bay.
- Khứ hồi/một chiều điều khiển trường ngày về.
- Validate điểm đi/đến, ngày và hành khách.
- Hiển thị 8 tour nổi bật.
- Hiển thị logo hãng hàng không.
- Điều hướng sang Flights/Tours đúng query string.

**Nghiệm thu:** tìm kiếm truyền đúng tham số; click hãng lọc đúng hãng; tour mở đúng ID.

## Phase 4 – Flights listing and detail
- Render danh sách chuyến bay từ SQLite.
- Đọc query string từ trang chủ.
- Làm filter kết hợp và sort giá tăng/giảm.
- Responsive filter sidebar/offcanvas.
- Trang chi tiết lấy flight theo ID.
- Chọn Phổ Thông/Thương Gia và thêm vào cart.

**Nghiệm thu:** mọi filter và lựa chọn hạng vé hoạt động; giỏ hàng có đúng item và giá.

## Phase 5 – Tours listing and detail
- Render danh sách tour từ SQLite.
- Làm filter hãng, giờ khởi hành và sort giá.
- Trang chi tiết tour hiển thị lịch trình theo ngày.
- Chọn số khách và thêm tour vào cart.

**Nghiệm thu:** filter hoạt động, chi tiết đúng ID, thêm tour đúng giá/số khách.

## Phase 6 – Cart and booking request
- Render cả flight và tour.
- Xóa từng item, xóa toàn bộ có xác nhận.
- Tính tổng tiền.
- Validate thông tin khách hàng.
- Tạo booking ID; lưu bookings và booking_items vào SQLite.
- Hiển thị màn hình hoàn thành và mã yêu cầu.
- Gửi email bằng EmailJS khi đã cấu hình; nếu chưa, hiển thị trạng thái chưa cấu hình và nút mailto dự phòng.
- Xóa cart sau khi lưu yêu cầu thành công, không xóa nếu lưu thất bại.

**Nghiệm thu:** dữ liệu đặt yêu cầu được lưu; trạng thái email trung thực; tổng tiền chính xác.

## Phase 7 – QA and polish
- Test desktop/tablet/mobile.
- Test query string thiếu hoặc sai ID.
- Test cart trống, item lỗi, database chưa khởi tạo.
- Test form sai email/số điện thoại/thiếu đồng ý điều khoản.
- Kiểm tra keyboard focus, label, alt.
- Kiểm tra console và network.
- Viết hướng dẫn chạy và cấu hình EmailJS.

## Final delivery
Báo cáo:
1. Danh sách file đã tạo.
2. Cách chạy website.
3. Cách seed/reset dữ liệu demo.
4. Cách cấu hình EmailJS.
5. Các giới hạn của ứng dụng frontend-only.
6. Những tính năng chưa hoàn thiện (nếu có).

Không tuyên bố website đã kết nối hãng bay thật, giữ chỗ thật, thanh toán thật hoặc gửi email nếu chưa cấu hình và kiểm thử thành công.
