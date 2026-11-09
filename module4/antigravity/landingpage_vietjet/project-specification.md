# Project Specification – Vietjet

## 1. Tổng quan
**Tên website:** Vietjet  
**Lĩnh vực:** Du lịch, tìm kiếm chuyến bay và tour du lịch  
**Mục tiêu:** Website demo cho phép người dùng tìm chuyến bay, xem tour, chọn dịch vụ, thêm vào giỏ hàng và gửi yêu cầu đặt dịch vụ.

### Công nghệ
- HTML, CSS, JavaScript thuần.
- Bootstrap 5 qua CDN.
- SQLite thông qua sql.js/WebAssembly chạy trong trình duyệt.
- Không có backend riêng.

### Phong cách giao diện
- Light mode, nền trắng.
- Màu chủ đạo: `#ed1d23`.
- Màu chữ chính: `#252525`; chữ phụ: `#6b7280`.
- Card bo góc vừa phải, bóng nhẹ, bố cục thoáng.
- Responsive.

## 2. Cấu trúc trang
1. Trang chủ – `index.html`
2. Chuyến bay – `flights.html`
3. Chi tiết chuyến bay – `flight-detail.html`
4. Tour du lịch – `tours.html`
5. Chi tiết tour – `tour-detail.html`
6. Giỏ hàng – `cart.html`

Mỗi trang có header điều hướng và footer thống nhất.

## 3. Header và footer
### Header
- Logo chữ “Vietjet” hoặc logo asset được cung cấp.
- Menu: Trang chủ, Chuyến bay, Tour du lịch.
- Icon giỏ hàng kèm số lượng sản phẩm.
- Mobile có menu thu gọn.
- Header sticky khi cuộn nếu phù hợp.

### Footer
- Tên thương hiệu và mô tả ngắn.
- Liên kết điều hướng.
- Thông tin liên hệ dạng dữ liệu demo, không tự tạo số điện thoại/email chính thức.
- Copyright.

## 4. Trang chủ
### 4.1 Tìm chuyến bay
Tạo khối tìm kiếm nổi bật gồm:
- Loại hành trình: Khứ hồi / Một chiều.
- Điểm đi.
- Điểm đến.
- Ngày khởi hành.
- Ngày về (chỉ bật khi chọn khứ hồi).
- Số hành khách (tối thiểu 1).
- Nút “Tìm kiếm”.

Validation:
- Điểm đi và điểm đến không được trùng nhau.
- Điểm đi, điểm đến và ngày khởi hành là bắt buộc.
- Ngày về bắt buộc và không được trước ngày đi khi chọn khứ hồi.
- Ngày không được ở quá khứ.

Khi bấm “Tìm kiếm”, chuyển đến `flights.html` và truyền tiêu chí bằng query string. Trang Flights phải đọc query string và áp dụng bộ lọc.

### 4.2 Tour nổi bật
- Hiển thị đúng 8 tour nổi bật.
- Mỗi card có thumbnail tỷ lệ 3:2, kích thước ảnh mục tiêu 600x400.
- Thông tin: tên tour, hãng/đơn vị tổ chức, số ngày/đêm, giá, điểm đến.
- CTA “Xem chi tiết”.
- Click card/CTA mở `tour-detail.html?id=<tourId>`.
- Có trạng thái giá demo và ghi rõ giá tham khảo nếu là dữ liệu mẫu.

### 4.3 Hãng hàng không
- Hiển thị logo dạng grid hoặc carousel responsive.
- Có các hãng mẫu: VietJet Air, Vietnam Airlines, Singapore Airlines, Thai Airways, AirAsia, Malaysia Airlines.
- Click logo chuyển đến `flights.html?airline=<airlineId>` và áp dụng filter hãng.
- Chỉ sử dụng logo có quyền sử dụng hoặc asset placeholder tự thiết kế; không hotlink ảnh không rõ nguồn.

## 5. Trang Chuyến bay – Flights
Bố cục hai cột:
- Trái: sidebar filter.
- Phải: danh sách chuyến bay.

### 5.1 Bộ lọc
- Sắp xếp giá: thấp đến cao / cao đến thấp.
- Loại hành trình: khứ hồi / một chiều.
- Loại chuyến: bay thẳng / quá cảnh hoặc nhiều chặng.
- Hãng hàng không: checkbox theo hãng.
- Thời gian cất cánh: sáng / trưa / chiều / tối hoặc khoảng giờ.
- Hạng dịch vụ: phổ thông / thương gia.
- Nút xóa bộ lọc.

Bộ lọc phải thực sự thay đổi kết quả, kết hợp được nhiều điều kiện và cập nhật số kết quả. Trên mobile, hiển thị bộ lọc trong offcanvas/modal.

### 5.2 Thẻ chuyến bay
Mỗi kết quả hiển thị:
- Logo/tên hãng.
- Mã chuyến bay.
- Sân bay/điểm đi và điểm đến.
- Ngày, giờ cất cánh và hạ cánh.
- Thời gian bay.
- Bay thẳng/quá cảnh.
- Giá từ.
- Tóm tắt dịch vụ.
- Nút “Xem chuyến bay”.

Click mở `flight-detail.html?id=<flightId>`.

## 6. Chi tiết chuyến bay – Detail Flights
Hiển thị:
- Điểm đi, điểm đến.
- Ngày và giờ khởi hành/đến.
- Thời gian bay.
- Hãng hàng không và mã chuyến bay.
- Loại máy bay (ví dụ Boeing hoặc Airbus; chỉ dùng dữ liệu minh họa).
- Sơ đồ/timeline hành trình.
- Hành lý và dịch vụ bao gồm.

### Chọn hạng vé
Có hai lựa chọn dạng card/radio:
- Hạng Phổ Thông.
- Hạng Thương Gia.

Mỗi hạng hiển thị:
- Giá.
- Hành lý.
- Chọn chỗ (nếu có).
- Suất ăn/dịch vụ.
- Điều kiện đổi/hoàn dạng mô tả demo.

Khi người dùng chọn hạng và bấm “Thêm vào giỏ hàng”, lưu item gồm flight ID, fare class, giá, thông tin chuyến bay và số lượng/hành khách cần thiết vào giỏ hàng. Hiển thị thông báo thành công và cập nhật badge giỏ hàng.

## 7. Trang Tour – Tours
Bố cục hai cột:
- Trái: sidebar filter.
- Phải: danh sách tour.

### 7.1 Bộ lọc
- Sắp xếp giá tăng/giảm.
- Hãng hàng không.
- Thời gian khởi hành (giờ).
- Có thể bổ sung điểm đến nếu phù hợp.
- Nút xóa bộ lọc.

### 7.2 Thẻ tour
Hiển thị:
- Ảnh thumbnail.
- Tên tour và điểm đến.
- Hãng hàng không.
- Ngày khởi hành.
- Số ngày/đêm.
- Giá.
- Tóm tắt dịch vụ.
- Nút “Xem chi tiết”.

Click mở `tour-detail.html?id=<tourId>`.

## 8. Chi tiết Tour
Trang này là chi tiết một tour du lịch, không phải chỉ là trang chi tiết chuyến bay. Hiển thị:
- Tên tour, ảnh cover, điểm đi và điểm đến.
- Ngày khởi hành.
- Hãng hàng không, giờ bay, thời gian bay, loại máy bay nếu tour có thông tin chuyến bay.
- Số ngày/đêm.
- Giá/người.
- Dịch vụ bao gồm và không bao gồm.
- Lịch trình theo ngày (Ngày 1, Ngày 2...).
- Điều kiện và lưu ý.

Nút “Chọn tour / Thêm vào giỏ hàng” lưu tour ID, giá, ngày khởi hành và số khách vào giỏ hàng. Nếu có lựa chọn số khách, validate tối thiểu 1.

## 9. Giỏ hàng – Cart
- Hiển thị các chuyến bay và tour đã chọn.
- Phân biệt loại item: Chuyến bay / Tour.
- Hiển thị tên, lịch trình/ngày, hạng vé hoặc số khách, giá và tổng tiền.
- Cho phép xóa từng item.
- Cho phép xóa toàn bộ giỏ hàng sau khi xác nhận.
- Tự động tính tổng tiền.
- Giỏ hàng lưu bền qua refresh bằng localStorage hoặc IndexedDB; đồng bộ với dữ liệu SQLite.
- Có empty state và nút quay lại tìm dịch vụ.

### Thông tin khách hàng
Form gồm:
- Họ và tên (bắt buộc).
- Email (bắt buộc, validate định dạng).
- Số điện thoại (bắt buộc).
- Ghi chú (không bắt buộc).
- Checkbox đồng ý điều khoản (bắt buộc).

Khi bấm “Đăng ký”:
1. Validate form và giỏ hàng.
2. Tạo mã yêu cầu đặt dịch vụ.
3. Lưu đơn/yêu cầu và chi tiết item vào SQLite.
4. Hiển thị trang/thông báo hoàn thành gồm mã yêu cầu và tổng tiền.
5. Gửi email xác nhận đến email khách hàng qua EmailJS nếu đã cấu hình.
6. Chỉ báo gửi email thành công khi EmailJS trả về thành công. Nếu chưa cấu hình hoặc lỗi, vẫn lưu yêu cầu và báo rõ trạng thái email; cung cấp nút `mailto:` dự phòng.

Email người gửi mong muốn: `nvhai061993@gmail.com`. Việc dùng địa chỉ này làm sender phụ thuộc xác minh tài khoản/domain trên dịch vụ gửi email. Không được giả mạo địa chỉ From. Có thể dùng địa chỉ này làm Reply-To nếu dịch vụ cho phép và chủ tài khoản xác nhận.

## 10. Dữ liệu và nội dung
- Tạo dữ liệu mẫu có tính nhất quán cho ít nhất 10 chuyến bay và 8 tour.
- Tạo dữ liệu hãng hàng không.
- Tạo dữ liệu hạng vé.
- Dùng giá VND, định dạng `vi-VN`.
- Dữ liệu demo phải được đánh dấu là dữ liệu tham khảo, không phải giá/giờ bay thật.
- Không trình bày website như hệ thống đặt vé thật hoặc xác nhận vé của hãng.

## 11. Tiêu chí nghiệm thu
- Tất cả 6 trang hoạt động và liên kết đúng.
- Tìm kiếm từ trang chủ truyền tiêu chí sang Flights.
- Bộ lọc/sắp xếp hoạt động kết hợp.
- Chi tiết chuyến bay và tour lấy đúng dữ liệu theo ID.
- Chọn chuyến bay/tour thêm vào giỏ hàng.
- Giỏ hàng còn dữ liệu sau refresh, xóa từng item và xóa tất cả hoạt động.
- Tổng tiền chính xác.
- Form kiểm tra dữ liệu và tạo yêu cầu.
- Email có trạng thái trung thực, không báo gửi thành công giả.
- Responsive, không có link/nút chết và không có lỗi console nghiêm trọng.
