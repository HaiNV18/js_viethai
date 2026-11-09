# UI/UX Design Guide – Vietjet

## 1. Design direction
Thiết kế website du lịch hiện đại, đáng tin cậy, gọn gàng, lấy cảm hứng từ giao diện đặt vé máy bay. Không sao chép nguyên mẫu nhận diện hoặc giao diện độc quyền của hãng.

## 2. Color palette
- Primary: `#ed1d23`
- Primary hover: `#c9151b`
- Text: `#252525`
- Secondary text: `#6b7280`
- Page background: `#ffffff`
- Soft background: `#f7f7f8`
- Border: `#e5e7eb`
- Success: `#16834a`
- Warning: `#b7791f`

## 3. Typography
- Ưu tiên system font hoặc Google Font hỗ trợ tiếng Việt như Be Vietnam Pro.
- Heading đậm, ngắn gọn.
- Body 14–16px; line-height thoáng.
- Giá tiền cần nổi bật, dùng màu đỏ thương hiệu.

## 4. Components
### Buttons
- Primary đỏ, chữ trắng.
- Secondary nền trắng, viền xám.
- Hover/focus rõ ràng.
- Disabled có độ tương phản đủ.

### Cards
- Nền trắng, border nhẹ, radius 12–16px.
- Shadow nhẹ khi hover.
- Ảnh tour dùng tỷ lệ 3:2, object-fit cover.
- Thông tin quan trọng có hierarchy rõ ràng.

### Search panel
- Nổi bật ở đầu trang chủ.
- Trên desktop bố trí loại vé, điểm đi/đến, ngày đi/ngày về và hành khách.
- Trên mobile xếp dọc.
- Nút tìm kiếm đủ lớn, dễ chạm.

### Flight result card
- Desktop: logo/hãng, timeline giờ bay, thời lượng, giá và CTA.
- Mobile: xếp thành các khối dọc, không tràn ngang.
- Giá và CTA dễ nhận biết.

### Filter sidebar
- Desktop sticky nếu không gây khó chịu.
- Mobile chuyển thành offcanvas.
- Nhóm filter có tiêu đề và khoảng cách hợp lý.

### Fare selection
- Hai card Phổ Thông và Thương Gia.
- Card được chọn có border đỏ và dấu check.
- So sánh quyền lợi bằng danh sách ngắn.

### Cart
- Danh sách item rõ ràng, tổng tiền dễ thấy.
- Form khách hàng đặt ở dưới hoặc cột bên phải.
- Khi trống, có icon minh họa và CTA quay lại.

## 5. Responsive breakpoints
Dùng Bootstrap breakpoints:
- Mobile: dưới 576px.
- Tablet: 576px–991px.
- Desktop: từ 992px.

## 6. Accessibility
- Label gắn với input.
- Có focus-visible.
- Không chỉ dùng màu để biểu thị trạng thái.
- Ảnh có alt phù hợp.
- Nút có tên dễ hiểu.
- Dialog/offcanvas có thể đóng bằng bàn phím.

## 7. Assets
Cấu trúc gợi ý:
- `assets/images/logo/`
- `assets/images/airlines/`
- `assets/images/tours/`
- `assets/images/banners/`

Nếu chưa có ảnh thật, dùng ảnh placeholder phù hợp, đồng nhất kích thước. Không để ảnh lỗi hoặc link ảnh không tồn tại. Tên hãng và logo chỉ dùng cho mục đích minh họa trong prototype; không ngụ ý quan hệ đối tác.
