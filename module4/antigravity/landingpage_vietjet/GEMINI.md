# GEMINI.md – Vietjet Project Rules

## 1. Vai trò
Bạn là senior frontend engineer kiêm UI/UX designer. Hãy xây dựng website du lịch/đặt chuyến bay tên **Vietjet** theo các tài liệu Markdown trong dự án. Đọc `README.md`, `project-specification.md`, `ui-design.md`, `data-and-storage.md` và `implementation-plan.md` trước khi code.

## 2. Công nghệ bắt buộc
- HTML5, CSS3 và Vanilla JavaScript (ES6+).
- Không dùng React, Vue, Angular, jQuery, TypeScript hoặc framework frontend.
- Không tạo backend, server API hay hệ thống đăng nhập backend.
- Dùng Bootstrap 5 qua CDN nếu cần grid/component; tùy chỉnh giao diện bằng CSS riêng.
- Dùng Bootstrap Icons hoặc Font Awesome qua CDN cho icon.
- Dùng sql.js (SQLite WebAssembly) để thao tác database trong trình duyệt.
- Dùng local assets trong thư mục `assets/`; không phụ thuộc ảnh hotlink không ổn định.
- Tách HTML, CSS, JS và dữ liệu; không viết toàn bộ ứng dụng trong một file.

## 3. Quy tắc thiết kế
- Giao diện sáng, nền trắng, sạch sẽ, hiện đại, dễ sử dụng.
- Màu thương hiệu chính: `#ed1d23`. Có thể dùng đỏ đậm hơn cho hover.
- Nội dung tiếng Việt, dấu tiếng Việt hiển thị chính xác.
- Responsive desktop, tablet và mobile.
- Ưu tiên khả năng đọc, khoảng trắng hợp lý, trạng thái hover/focus rõ ràng.
- Không dùng dark mode.
- Không tự ý thêm các chức năng ngoài phạm vi nếu làm phức tạp luồng đặt dịch vụ.

## 4. Điều hướng
Các trang chính:
- `index.html`: Trang chủ
- `flights.html`: Danh sách chuyến bay
- `flight-detail.html`: Chi tiết chuyến bay
- `tours.html`: Danh sách tour
- `tour-detail.html`: Chi tiết tour
- `cart.html`: Giỏ hàng và thông tin khách hàng

Dùng query string để truyền ID, ví dụ `flight-detail.html?id=FL001`. Dữ liệu chi tiết phải lấy theo ID từ database, không hardcode một bản sao dữ liệu trên từng trang.

## 5. Chất lượng code
- Dùng tên biến/hàm dễ hiểu, nhất quán.
- Chia JavaScript thành module theo chức năng; dùng `type="module"` khi phù hợp.
- Tránh lặp code; tạo header/footer dùng chung bằng JS hoặc cấu trúc component HTML đơn giản.
- Validate form ở client, hiển thị lỗi gần trường nhập liệu.
- Không dùng `alert()` làm giao diện chính; ưu tiên toast, inline message hoặc modal Bootstrap.
- Có loading, empty state, error state và trạng thái thành công.
- Không để nút/link chết. Nếu chưa triển khai được, ghi rõ trạng thái và không giả vờ đã hoàn tất.
- Không ghi mật khẩu, SMTP credentials hoặc secret vào repository.
- Viết comment cho phần xử lý quan trọng, không comment từng dòng hiển nhiên.

## 6. Quy tắc dữ liệu và email
- Dùng sql.js để thực thi SQLite trong browser; lưu database binary vào IndexedDB.
- Cung cấp dữ liệu mẫu để website hoạt động ngay lần đầu.
- Giỏ hàng phải tồn tại sau khi refresh trang.
- Email xác nhận chỉ được báo “đã gửi” khi dịch vụ email trả về kết quả thành công.
- Email người gửi hiển thị theo cấu hình dịch vụ được xác minh. Không giả định có thể giả mạo địa chỉ `nvhai061993@gmail.com`.
- Nếu EmailJS chưa được cấu hình, hiển thị “Chưa cấu hình gửi email tự động” và cung cấp nút mở ứng dụng email bằng `mailto:`.

## 7. Cách làm việc
- Trước tiên kiểm tra cấu trúc thư mục hiện tại, không xóa file người dùng nếu chưa được yêu cầu.
- Triển khai theo từng giai đoạn trong `implementation-plan.md`.
- Sau mỗi giai đoạn, chạy kiểm tra cơ bản và sửa lỗi trước khi tiếp tục.
- Khi hoàn thành, cung cấp hướng dẫn chạy, cấu hình EmailJS và những giới hạn của bản frontend-only.
