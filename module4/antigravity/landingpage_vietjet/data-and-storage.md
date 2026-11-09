# Data & Storage – Vietjet

## 1. SQLite trong website không backend
Trình duyệt không có API SQLite native. Sử dụng `sql.js` (SQLite biên dịch sang WebAssembly) để đọc/ghi database ngay trong browser.

### Hành vi đề xuất
1. Khi khởi động, kiểm tra database binary trong IndexedDB.
2. Nếu chưa có, khởi tạo schema và nạp dữ liệu mẫu.
3. Sau mỗi thay đổi cần lưu, export database từ sql.js và ghi binary vào IndexedDB.
4. Có thể bổ sung chức năng export/import file `.sqlite` để backup.
5. Không dùng một file `.sqlite` trên server static như database dùng chung nhiều người; trình duyệt không thể ghi trực tiếp vào file đó.

Nếu việc dùng sql.js làm dự án quá phức tạp, có thể dùng localStorage cho prototype nhưng phải ghi rõ đây là phương án thay thế, không được gọi localStorage là SQLite.

## 2. Tables
Tạo schema tối thiểu:

### airlines
- `id TEXT PRIMARY KEY`
- `name TEXT NOT NULL`
- `logo TEXT`
- `is_active INTEGER DEFAULT 1`

### flights
- `id TEXT PRIMARY KEY`
- `airline_id TEXT NOT NULL`
- `flight_number TEXT`
- `origin_code TEXT`
- `origin_name TEXT`
- `destination_code TEXT`
- `destination_name TEXT`
- `departure_date TEXT`
- `departure_time TEXT`
- `arrival_time TEXT`
- `duration_minutes INTEGER`
- `stops INTEGER DEFAULT 0`
- `aircraft TEXT`
- `economy_price INTEGER`
- `business_price INTEGER`
- `services TEXT`
- `FOREIGN KEY (airline_id) REFERENCES airlines(id)`

### tours
- `id TEXT PRIMARY KEY`
- `title TEXT NOT NULL`
- `destination TEXT`
- `origin TEXT`
- `airline_id TEXT`
- `departure_date TEXT`
- `departure_time TEXT`
- `duration_days INTEGER`
- `duration_nights INTEGER`
- `flight_duration_minutes INTEGER`
- `aircraft TEXT`
- `price INTEGER`
- `thumbnail TEXT`
- `description TEXT`
- `included_services TEXT`
- `itinerary_json TEXT`
- `featured INTEGER DEFAULT 0`

### bookings
- `id TEXT PRIMARY KEY`
- `customer_name TEXT NOT NULL`
- `customer_email TEXT NOT NULL`
- `customer_phone TEXT NOT NULL`
- `note TEXT`
- `total_amount INTEGER NOT NULL`
- `created_at TEXT NOT NULL`
- `email_status TEXT NOT NULL`

### booking_items
- `id TEXT PRIMARY KEY`
- `booking_id TEXT NOT NULL`
- `item_type TEXT NOT NULL`
- `reference_id TEXT NOT NULL`
- `selected_option TEXT`
- `quantity INTEGER DEFAULT 1`
- `unit_price INTEGER NOT NULL`
- `snapshot_json TEXT`
- `FOREIGN KEY (booking_id) REFERENCES bookings(id)`

## 3. Cart storage
Giỏ hàng lưu trong localStorage hoặc IndexedDB để truy cập nhanh giữa các trang:
- Key gợi ý: `vietjet_cart_v1`.
- Item chuyến bay: `type`, `referenceId`, `fareClass`, `quantity`, `unitPrice`, `snapshot`.
- Item tour: `type`, `referenceId`, `departureDate`, `quantity`, `unitPrice`, `snapshot`.
- Không chỉ lưu giá trị tổng; phải tính lại từ các item.
- Khi load cart, kiểm tra dữ liệu hợp lệ và xử lý item không còn tồn tại.

## 4. Sample data
Tạo tối thiểu:
- 6 hãng hàng không: VietJet Air, Vietnam Airlines, Singapore Airlines, Thai Airways, AirAsia, Malaysia Airlines.
- 10 chuyến bay mẫu, có cả bay thẳng và quá cảnh, nhiều khung giờ.
- 8 tour nổi bật, mỗi tour có thumbnail 600x400 hoặc ảnh có tỷ lệ 3:2.
- Mỗi chuyến bay có giá Phổ Thông và Thương Gia.
- Mỗi tour có lịch trình ít nhất 2 ngày để demo.

Giá và lịch trình là dữ liệu giả lập. Gắn nhãn “Thông tin và giá mang tính minh họa”.

## 5. Formatting
- Lưu giá bằng integer VND, không lưu chuỗi đã format.
- Hiển thị bằng `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`.
- Ngày lưu ISO `YYYY-MM-DD`.
- Thời gian lưu `HH:mm`.
- JSON lịch trình phải parse có kiểm tra lỗi.

## 6. EmailJS
Tạo file `assets/js/config.example.js` hoặc file cấu hình tương tự với placeholder:
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`

Không commit secret/private key. Public key của EmailJS dùng phía client theo hướng dẫn của nhà cung cấp, nhưng vẫn cần cấu hình domain/giới hạn và template phù hợp.

Template email nên có:
- Tên khách hàng.
- Mã yêu cầu.
- Danh sách chuyến bay/tour.
- Ngày khởi hành.
- Tổng tiền tham khảo.
- Thông báo đây là yêu cầu đăng ký, chưa phải vé điện tử hoặc xác nhận chỗ.

Địa chỉ người nhận lấy từ email khách nhập. Sender phải là địa chỉ được EmailJS xác minh/cho phép; `nvhai061993@gmail.com` chỉ dùng làm sender hoặc Reply-To nếu đã xác minh và dịch vụ hỗ trợ. Không bao giờ đặt mật khẩu Gmail trong JavaScript.
