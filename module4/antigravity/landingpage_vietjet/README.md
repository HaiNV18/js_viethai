# Vietjet – Antigravity Project Instructions

Bộ tài liệu này hướng dẫn Antigravity xây dựng website du lịch/đặt chuyến bay **Vietjet** bằng HTML, CSS và JavaScript thuần.

## Cách sử dụng
1. Giải nén thư mục `vietjet_antigravity`.
2. Mở thư mục dự án bằng Antigravity.
3. Đọc `GEMINI.md` trước. Đây là file chỉ dẫn chính.
4. Yêu cầu Antigravity triển khai theo từng giai đoạn trong `implementation-plan.md`, không tạo toàn bộ dự án trong một lần.
5. Chạy website bằng Live Server hoặc một static development server.

## Lưu ý quan trọng về công nghệ
- Website không có backend riêng.
- Trình duyệt không thể truy cập trực tiếp một file SQLite tùy ý như ứng dụng desktop. Dùng **sql.js (SQLite chạy bằng WebAssembly)** để chạy SQLite trong trình duyệt; lưu database vào IndexedDB hoặc xuất/nhập file `.sqlite`.
- Nếu cần dữ liệu được chia sẻ giữa nhiều thiết bị/người dùng, phải bổ sung backend hoặc dịch vụ database hosted. Bản demo hiện tại lưu dữ liệu trên trình duyệt.
- Không thể gửi email an toàn trực tiếp bằng HTML/CSS/JS thuần mà không có backend hoặc dịch vụ gửi email. Tích hợp EmailJS (hoặc dịch vụ tương đương) bằng template và public key cấu hình ở phía client; không nhúng SMTP password/API secret vào mã nguồn. Nếu chưa cấu hình EmailJS, dùng `mailto:` làm phương án dự phòng và hiển thị rõ rằng email chưa được gửi tự động.

## Các tài liệu
- `GEMINI.md`: quy tắc bắt buộc cho Antigravity.
- `project-specification.md`: mô tả sản phẩm và chức năng.
- `ui-design.md`: giao diện và trải nghiệm người dùng.
- `data-and-storage.md`: SQLite, dữ liệu mẫu và lưu trữ.
- `implementation-plan.md`: thứ tự triển khai và tiêu chí nghiệm thu.
