# Yêu cầu dự án

## 1. Mục tiêu

Xây dựng một Landing Page một trang (single page) giới thiệu dự án Vinhomes Grand Park, thu hút người xem để lại thông tin đăng ký nhận tư vấn.

## 2. Yêu cầu kỹ thuật

- Chỉ dùng HTML, CSS, JavaScript; Bootstrap 5 nạp qua CDN.
- Không dùng ngôn ngữ backend hay framework khác.
- Mã nguồn chính lưu trong `index.html`; CSS tùy chỉnh trong `style.css`; JavaScript trong `script.js`.
- Giao diện responsive, hiển thị tốt trên điện thoại, máy tính bảng và máy tính.
- Nội dung bằng tiếng Việt.
- Ảnh lấy từ Unsplash (link trực tiếp) hoặc ảnh placeholder, kèm thuộc tính `alt` mô tả.

## 3. Yêu cầu chức năng

### 3.1 Navbar
- Logo dạng chữ "VINHOMES GRAND PARK" ở bên trái.
- Menu: Trang chủ, Tiện ích, Pháp lý, Liên hệ.
- Bấm mục menu thì cuộn mượt tới section tương ứng.
- Thu gọn thành nút hamburger trên mobile.

### 3.2 Hero Section
- Bố cục 2 cột: chữ bên trái, hình ảnh bên phải; trên mobile chữ ở trên, ảnh ở dưới.
- Tiêu đề thu hút, đoạn mô tả 2 đến 3 câu.
- Một nút CTA "Đăng ký nhận tư vấn", bấm vào cuộn xuống form đăng ký.
- Hình ảnh thể hiện nhà phố/biệt thự nghỉ dưỡng và trường Vinschool.

### 3.3 Features Section
- 3 thẻ ngang hàng (xếp dọc trên mobile), mỗi thẻ gồm hình ảnh khác nhau, tiêu đề, mô tả ngắn:
  1. Lối sống thượng lưu
  2. Tiện ích tối ưu
  3. Pháp lý nhanh gọn

### 3.4 Form đăng ký
- Trường: họ tên, số điện thoại.
- JavaScript kiểm tra dữ liệu (không để trống, số điện thoại hợp lệ).
- Hiển thị thông báo cảm ơn sau khi gửi; dữ liệu không gửi đi đâu.

### 3.5 Footer
- Dòng bản quyền.
- Địa chỉ, số điện thoại, email mẫu (dữ liệu giả).

## 4. Ngoài phạm vi

- Backend, cơ sở dữ liệu, gửi email thật.
- Hệ thống quản lý nội dung.
- Số liệu giá, diện tích, cam kết lợi nhuận.

## 5. Tiêu chí hoàn thành

- [ ] Mở `index.html` hiển thị đúng đủ 5 phần.
- [ ] Menu cuộn mượt tới từng section.
- [ ] Hiển thị tốt ở độ rộng điện thoại (khoảng 375px) và máy tính.
- [ ] Form báo lỗi khi nhập sai và báo thành công khi nhập đúng.
- [ ] Màu sắc đúng quy định trong `DESIGN.md`.
