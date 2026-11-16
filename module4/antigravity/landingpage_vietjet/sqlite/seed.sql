-- ============================================================================
-- Vietjet Travel & Flights Demo – Dữ liệu mẫu (seed.sql)
-- Bao gồm: 6 hãng hàng không, 12 chuyến bay, 8 tour nổi bật và 1 đơn đặt mẫu
-- ============================================================================

PRAGMA foreign_keys = ON;

DELETE FROM booking_items;
DELETE FROM bookings;
DELETE FROM tours;
DELETE FROM flights;
DELETE FROM airlines;

-- 1. Seed 6 Hãng hàng không
INSERT INTO airlines (id, name, logo, is_active) VALUES
  ('VJ', 'VietJet Air', 'assets/images/airlines/vj.svg', 1),
  ('VN', 'Vietnam Airlines', 'assets/images/airlines/vn.svg', 1),
  ('SQ', 'Singapore Airlines', 'assets/images/airlines/sq.svg', 1),
  ('TG', 'Thai Airways', 'assets/images/airlines/tg.svg', 1),
  ('AK', 'AirAsia', 'assets/images/airlines/ak.svg', 1),
  ('MH', 'Malaysia Airlines', 'assets/images/airlines/mh.svg', 1);

-- 2. Seed 12 Chuyến bay mẫu (Thông tin và giá mang tính minh họa)
INSERT INTO flights (
  id, airline_id, flight_number, origin_code, origin_name,
  destination_code, destination_name, departure_date, departure_time,
  arrival_time, duration_minutes, stops, aircraft,
  economy_price, business_price, services
) VALUES
  ('FL001', 'VJ', 'VJ122', 'SGN', 'TP. Hồ Chí Minh (SGN)', 'HAN', 'Hà Nội (HAN)', '2026-11-11', '06:30', '08:40', 130, 0, 'Airbus A321neo (Minh họa)', 1490000, 3290000, '7kg hành lý xách tay, Nước suối, Hỗ trợ đổi lịch (có phí)'),
  ('FL002', 'VN', 'VN214', 'SGN', 'TP. Hồ Chí Minh (SGN)', 'HAN', 'Hà Nội (HAN)', '2026-11-11', '09:15', '11:25', 130, 0, 'Boeing 787-9 Dreamliner (Minh họa)', 1950000, 4590000, '10kg xách tay + 23kg ký gửi, Suất ăn nóng, Chọn ghế tiêu chuẩn'),
  ('FL003', 'VJ', 'VJ324', 'SGN', 'TP. Hồ Chí Minh (SGN)', 'PQC', 'Phú Quốc (PQC)', '2026-11-11', '07:45', '08:45', 60, 0, 'Airbus A320 (Minh họa)', 990000, 2350000, '7kg hành lý xách tay, Bảo hiểm Sky Care tham khảo'),
  ('FL004', 'VJ', 'VJ628', 'SGN', 'TP. Hồ Chí Minh (SGN)', 'DAD', 'Đà Nẵng (DAD)', '2026-11-11', '13:20', '14:40', 80, 0, 'Airbus A321 (Minh họa)', 1150000, 2690000, '7kg hành lý xách tay, Ưu tiên làm thủ tục trực tuyến'),
  ('FL005', 'VN', 'VN165', 'HAN', 'Hà Nội (HAN)', 'DAD', 'Đà Nẵng (DAD)', '2026-11-12', '10:30', '11:50', 80, 0, 'Airbus A321 (Minh họa)', 1450000, 3190000, '10kg xách tay + 23kg ký gửi, Thức uống nhẹ trên chuyến bay'),
  ('FL006', 'VJ', 'VJ159', 'HAN', 'Hà Nội (HAN)', 'SGN', 'TP. Hồ Chí Minh (SGN)', '2026-11-12', '15:40', '17:50', 130, 0, 'Airbus A321neo (Minh họa)', 1520000, 3350000, '7kg hành lý xách tay, Dịch vụ giải trí cơ bản'),
  ('FL007', 'SQ', 'SQ177', 'SGN', 'TP. Hồ Chí Minh (SGN)', 'SIN', 'Singapore (SIN)', '2026-11-12', '12:15', '15:15', 120, 0, 'Airbus A350-900 (Minh họa)', 3450000, 7890000, '30kg hành lý ký gửi, Suất ăn quốc tế, Giải trí KrisWorld'),
  ('FL008', 'TG', 'TG551', 'SGN', 'TP. Hồ Chí Minh (SGN)', 'BKK', 'Bangkok (BKK)', '2026-11-14', '19:35', '21:05', 90, 0, 'Boeing 777-200ER (Minh họa)', 2680000, 5950000, '20kg hành lý ký gửi, Suất ăn Thái Lan, Chọn chỗ ngồi trước'),
  ('FL009', 'AK', 'AK521', 'SGN', 'TP. Hồ Chí Minh (SGN)', 'KUL', 'Kuala Lumpur (KUL)', '2026-11-14', '16:10', '19:00', 110, 0, 'Airbus A320neo (Minh họa)', 1890000, 3990000, '7kg hành lý xách tay, Tùy chọn suất ăn Santan'),
  ('FL010', 'MH', 'MH751', 'HAN', 'Hà Nội (HAN)', 'KUL', 'Kuala Lumpur (KUL)', '2026-11-14', '13:00', '18:20', 260, 1, 'Boeing 737-800 (Minh họa)', 2950000, 6450000, '20kg ký gửi, 1 điểm dừng kỹ thuật, Suất ăn nóng'),
  ('FL011', 'VJ', 'VJ803', 'SGN', 'TP. Hồ Chí Minh (SGN)', 'BKK', 'Bangkok (BKK)', '2026-11-16', '08:30', '10:05', 95, 0, 'Airbus A321 (Minh họa)', 1750000, 3690000, '7kg hành lý xách tay, Quầy làm thủ tục nhanh (Thương Gia)'),
  ('FL012', 'SQ', 'SQ183', 'HAN', 'Hà Nội (HAN)', 'SIN', 'Singapore (SIN)', '2026-11-16', '20:10', '01:20', 250, 1, 'Boeing 787-10 (Minh họa)', 3790000, 8200000, '30kg ký gửi, Quá cảnh ngắn, Suất ăn cao cấp');

-- 3. Seed 8 Tour du lịch nổi bật (featured = 1)
INSERT INTO tours (
  id, title, destination, origin, airline_id, departure_date,
  departure_time, duration_days, duration_nights, flight_duration_minutes,
  aircraft, price, thumbnail, description, included_services,
  itinerary_json, featured
) VALUES
  (
    'TR001',
    'Tour Phú Quốc 4N3Đ: Thiên Đường Đảo Ngọc - Grand World - Hòn Thơm',
    'Phú Quốc',
    'TP. Hồ Chí Minh',
    'VJ',
    '2026-11-14',
    '07:45',
    4,
    3,
    60,
    'Airbus A320 (Minh họa)',
    5490000,
    'assets/images/tours/tour-1.svg',
    'Hành trình khám phá trọn vẹn Đảo Ngọc Phú Quốc với trải nghiệm cáp treo vượt biển Hòn Thơm, thành phố không ngủ Grand World và ngắm hoàng hôn tuyệt đẹp tại Sunset Sanato.',
    'Vé máy bay khứ hồi VietJet Air + 15kg ký gửi, Khách sạn 4 sao gần biển, Xe đưa đón đời mới, Vé cáp treo Hòn Thơm, 3 bữa sáng buffet + 5 bữa chính, Hướng dẫn viên suốt tuyến',
    '[{"day":1,"title":"TP.HCM – Phú Quốc – Dinh Cậu – Grand World","detail":"Đón đoàn tại sân bay Tân Sơn Nhất, đáp chuyến bay đi Phú Quốc. Nhận phòng khách sạn 4 sao, chiều tham quan Dinh Cậu và khám phá thành phố không ngủ Grand World."},{"day":2,"title":"Cáp treo Hòn Thơm – Công viên nước Aquatopia – Sunset Sanato","detail":"Trải nghiệm cáp treo 3 dây vượt biển dài nhất thế giới tại Hòn Thơm, vui chơi tại Aquatopia và ngắm hoàng hôn tại bãi biển Sunset Sanato."},{"day":3,"title":"Bãi Sao – Nhà tù Phú Quốc – Chợ đêm Dương Đông","detail":"Tắm biển tại Bãi Sao cát trắng mịn, tìm hiểu lịch sử tại Nhà tù Phú Quốc, cơ sở nuôi cấy ngọc trai và tự do thưởng thức hải sản tại chợ đêm."},{"day":4,"title":"Mua sắm đặc sản – Tiễn sân bay Phú Quốc – TP.HCM","detail":"Dùng điểm tâm sáng, tắm biển tự do, mua đặc sản nước mắm/hồ tiêu Phú Quốc và ra sân bay đáp chuyến bay về lại TP.HCM."}]',
    1
  ),
  (
    'TR002',
    'Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ: Con Đường Di Sản Miền Trung',
    'Đà Nẵng',
    'TP. Hồ Chí Minh',
    'VJ',
    '2026-11-15',
    '08:15',
    4,
    3,
    80,
    'Airbus A321 (Minh họa)',
    5890000,
    'assets/images/tours/tour-2.svg',
    'Chuyến du ngoạn miền Trung kết hợp nghỉ dưỡng biển Mỹ Khê, check-in Cầu Vàng trên đỉnh Bà Nà Hills và dạo bước dưới ánh đèn lồng lung linh tại Phố cổ Hội An.',
    'Vé máy bay khứ hồi VietJet Air, Khách sạn 4 sao ven biển Mỹ Khê, Vé cáp treo + Buffet trưa Bà Nà Hills, Vé tham quan Phố cổ Hội An, Bảo hiểm du lịch',
    '[{"day":1,"title":"TP.HCM – Đà Nẵng – Bán đảo Sơn Trà – Biển Mỹ Khê","detail":"Khởi hành đi Đà Nẵng, viếng chùa Linh Ứng tại bán đảo Sơn Trà, nhận phòng khách sạn và tắm biển Mỹ Khê."},{"day":2,"title":"Khu du lịch Bà Nà Hills – Cầu Vàng – Làng Pháp","detail":"Lên đỉnh Bà Nà bằng cáp treo, chụp hình tại Cầu Vàng, vườn hoa Le Jardin D’Amour, khu Làng Pháp và dùng buffet trưa."},{"day":3,"title":"Ngũ Hành Sơn – Làng đá Non Nước – Phố cổ Hội An","detail":"Khám phá danh thắng Ngũ Hành Sơn, chiều bách bộ Phố cổ Hội An thăm Chùa Cầu, thả hoa đăng trên sông Hoài."},{"day":4,"title":"Cầu Tình Yêu – Chợ Hàn – Đà Nẵng – TP.HCM","detail":"Check-in Cầu Rồng, Cá Chép Hóa Rồng, mua sắm đặc sản miền Trung tại Chợ Hàn trước khi ra sân bay về TP.HCM."}]',
    1
  ),
  (
    'TR003',
    'Tour Hà Nội - Vịnh Hạ Long 3N2Đ: Trải Nghiệm Du Thuyền 5 Sao',
    'Hạ Long',
    'TP. Hồ Chí Minh',
    'VN',
    '2026-11-16',
    '09:00',
    3,
    2,
    130,
    'Boeing 787-9 Dreamliner (Minh họa)',
    6750000,
    'assets/images/tours/tour-3.svg',
    'Chiêm ngưỡng kỳ quan thiên nhiên thế giới Vịnh Hạ Long cùng không gian văn hóa ngàn năm văn hiến của Thủ đô Hà Nội.',
    'Vé máy bay khứ hồi Vietnam Airlines (gồm 23kg ký gửi), 1 đêm khách sạn 4 sao Hà Nội + 1 đêm du thuyền Hạ Long, Các bữa ăn theo chương trình, Vé tham quan vịnh',
    '[{"day":1,"title":"TP.HCM – Hà Nội – Hồ Hoàn Kiếm – 36 Phố Phường","detail":"Đáp chuyến bay ra Hà Nội, tham quan Hồ Gươm, Đền Ngọc Sơn, Văn Miếu Quốc Tử Giám và thưởng thức ẩm thực phố cổ."},{"day":2,"title":"Hà Nội – Vịnh Hạ Long – Hang Sửng Sốt – Đảo Titop","detail":"Khởi hành đi Quảng Ninh, lên du thuyền khám phá Vịnh Hạ Long, thăm Hang Sửng Sốt, chèo kayak và ngắm hoàng hôn trên vịnh."},{"day":3,"title":"Ngắm bình minh Vịnh Hạ Long – Hà Nội – TP.HCM","detail":"Tập dưỡng sinh buổi sáng trên boong tàu, dùng bữa brunch, quay về sân bay Nội Bài đáp chuyến bay về lại TP.HCM."}]',
    1
  ),
  (
    'TR004',
    'Tour Singapore 4N3Đ: Gardens By The Bay - Đảo Sentosa - Jewel Changi',
    'Singapore',
    'TP. Hồ Chí Minh',
    'SQ',
    '2026-11-18',
    '12:15',
    4,
    3,
    120,
    'Airbus A350-900 (Minh họa)',
    11990000,
    'assets/images/tours/tour-4.svg',
    'Hành trình khám phá Quốc đảo Sư Tử xanh - sạch - hiện đại bậc nhất châu Á cùng hãng hàng không 5 sao Singapore Airlines.',
    'Vé máy bay khứ hồi Singapore Airlines + 30kg ký gửi, Khách sạn 4 sao trung tâm, Vé Flower Dome, Xe đưa đón và Hướng dẫn viên tiếng Việt nhiệt tình',
    '[{"day":1,"title":"TP.HCM – Sân bay Jewel Changi – Công viên Merlion","detail":"Đáp chuyến bay đến Singapore, chiêm ngưỡng thác nước Rain Vortex tại Jewel Changi và chụp ảnh tại Công viên Sư tử biển Merlion."},{"day":2,"title":"Gardens by the Bay – Marina Bay Sands – Đảo Sentosa","detail":"Tham quan khu vườn siêu cây khổng lồ Gardens by the Bay, nhà kính Flower Dome, chiều vui chơi và chụp ảnh tại đảo Sentosa."},{"day":3,"title":"Chùa Răng Phật – Chinatown – Mua sắm Orchard Road","detail":"Viếng Chùa Răng Phật linh thiêng tại khu Chinatown, khám phá Kampong Glam và tự do mua sắm tại đại lộ Orchard Road."},{"day":4,"title":"Tự do khám phá Singapore – Changi – TP.HCM","detail":"Dùng bữa sáng tại khách sạn, tự do dạo phố cho đến giờ xe đưa đoàn ra sân bay quốc tế Changi về lại TP.HCM."}]',
    1
  ),
  (
    'TR005',
    'Tour Thái Lan Bangkok - Pattaya 5N4Đ: Xứ Sở Chùa Vàng Rực Rỡ',
    'Bangkok',
    'TP. Hồ Chí Minh',
    'TG',
    '2026-11-19',
    '10:00',
    5,
    4,
    90,
    'Boeing 777-200ER (Minh họa)',
    7690000,
    'assets/images/tours/tour-5.svg',
    'Trải nghiệm trọn vẹn văn hóa, ẩm thực và biển đảo Thái Lan từ thành phố biển Pattaya sôi động đến thủ đô Bangkok sầm uất.',
    'Vé máy bay khứ hồi Thai Airways + 20kg ký gửi, Khách sạn 4 sao tại Bangkok & Pattaya, Buffet nhà hàng xoay 86 tầng Baiyoke Sky, Tàu cao tốc đảo Coral',
    '[{"day":1,"title":"TP.HCM – Bangkok – Thành phố biển Pattaya","detail":"Bay đến sân bay Suvarnabhumi, khởi hành đi Pattaya, khám phá chợ đêm Jomtien."},{"day":2,"title":"Đảo San Hô Coral – Trân Bảo Phật Sơn – Chợ nổi Bốn Miền","detail":"Đi cano ra đảo Coral tắm biển, chiều tham quan núi Phật vàng Khao Chee Chan và Chợ nổi Bốn Miền."},{"day":3,"title":"Pattaya – Bangkok – Buffet 86 tầng Baiyoke Sky","detail":"Quay về Bangkok, thưởng thức buffet quốc tế tại tòa nhà Baiyoke Sky 86 tầng và ngắm toàn cảnh thủ đô."},{"day":4,"title":"Dạo thuyền sông Chao Phraya – Chùa Phật Vàng – IconSiam","detail":"Dạo thuyền trên dòng sông huyền thoại Chao Phraya, viếng Chùa Thuyền Wat Yannawa, lễ Phật Bốn Mặt và mua sắm tại IconSiam."},{"day":5,"title":"Tự do mua sắm Big C – Bangkok – TP.HCM","detail":"Dùng điểm tâm sáng, làm thủ tục trả phòng và ra sân bay đáp chuyến bay về TP.HCM."}]',
    1
  ),
  (
    'TR006',
    'Tour Đà Lạt 3N2Đ: Săn Mây Cầu Đất - Đỉnh Langbiang - Thành Phố Ngàn Hoa',
    'Đà Lạt',
    'TP. Hồ Chí Minh',
    'VJ',
    '2026-11-13',
    '06:45',
    3,
    2,
    55,
    'Airbus A320 (Minh họa)',
    3990000,
    'assets/images/tours/tour-6.svg',
    'Tận hưởng không khí se lạnh đặc trưng của cao nguyên Lâm Viên, săn mây đồi chè Cầu Đất và thưởng thức ẩm thực phố núi.',
    'Vé máy bay khứ hồi VietJet Air, Khách sạn 3-4 sao trung tâm gần chợ Đà Lạt, Vé các điểm tham quan, Tiệc tối Lẩu rau Lagim + Cồng chiêng Tây Nguyên',
    '[{"day":1,"title":"TP.HCM – Liên Khương – Quảng trường Lâm Viên – Nhà thờ Domain","detail":"Đáp chuyến bay đến sân bay Liên Khương, check-in nụ hoa Atiso tại Quảng trường Lâm Viên và tham quan Nhà thờ Domain de Marie."},{"day":2,"title":"Đồi chè Cầu Đất – Vườn dâu công nghệ cao – Đỉnh Langbiang","detail":"Đón bình minh tại Đồi chè Cầu Đất, tham quan vườn dâu tây và chinh phục đỉnh Langbiang bằng xe Jeep."},{"day":3,"title":"Thác Datanla – Chợ Đà Lạt – TP.HCM","detail":"Trải nghiệm máng trượt xuyên rừng thông tại Thác Datanla, mua đặc sản mứt và dâu tươi tại Chợ Đà Lạt rồi ra sân bay về TP.HCM."}]',
    1
  ),
  (
    'TR007',
    'Tour Nha Trang 4N3Đ: Vịnh Đảo San Hô - VinWonders - Tắm Bùn Khoáng',
    'Nha Trang',
    'Hà Nội',
    'VN',
    '2026-11-17',
    '14:10',
    4,
    3,
    110,
    'Airbus A321 (Minh họa)',
    5650000,
    'assets/images/tours/tour-7.svg',
    'Kỳ nghỉ dưỡng năng động tại vịnh biển đẹp bậc nhất Việt Nam, kết hợp vui chơi giải trí tại đảo Hòn Tre và thư giãn tắm bùn khoáng nóng.',
    'Vé máy bay khứ hồi Vietnam Airlines, Khách sạn 4 sao đường Trần Phú, Cano tham quan 3 đảo, Vé tắm bùn khoáng I-Resort, Hướng dẫn viên chuyên nghiệp',
    '[{"day":1,"title":"Hà Nội – Cam Ranh – Nha Trang – Tháp Bà Ponagar","detail":"Khởi hành từ sân bay Nội Bài đến Cam Ranh, về trung tâm Nha Trang tham quan Tháp Bà Ponagar và nhận phòng khách sạn."},{"day":2,"title":"Du ngoạn Vịnh Nha Trang – Hòn Mun – Làng Chài – Bãi Tranh","detail":"Đi cano khám phá Vịnh Nha Trang, lặn ngắm san hô tại Hòn Mun, dùng bữa trưa hải sản tại Làng Chài."},{"day":3,"title":"Chùa Long Sơn – Nhà Yến – Tắm bùn khoáng nóng I-Resort","detail":"Viếng Chùa Long Sơn, tìm hiểu nghề khai thác yến sào Khánh Hòa và thư giãn ngâm bùn khoáng nóng tại I-Resort."},{"day":4,"title":"Chợ Đầm – Cam Ranh – Hà Nội","detail":"Tự do tắm biển Nha Trang buổi sáng, mua đặc sản tại Chợ Đầm và ra sân bay Cam Ranh về lại Hà Nội."}]',
    1
  ),
  (
    'TR008',
    'Tour Malaysia Kuala Lumpur - Genting 4N3Đ: Tháp Đôi Petronas & Động Batu',
    'Kuala Lumpur',
    'TP. Hồ Chí Minh',
    'MH',
    '2026-11-20',
    '15:30',
    4,
    3,
    115,
    'Boeing 737-800 (Minh họa)',
    7290000,
    'assets/images/tours/tour-8.svg',
    'Khám phá sự giao thoa văn hóa độc đáo của Malaysia từ biểu tượng Tháp đôi Petronas hiện đại đến cao nguyên giải trí Genting mát mẻ.',
    'Vé máy bay khứ hồi Malaysia Airlines + 20kg ký gửi, Khách sạn 4 sao Bukit Bintang, Vé cáp treo Awana SkyWay lên cao nguyên Genting, Bảo hiểm du lịch quốc tế',
    '[{"day":1,"title":"TP.HCM – Kuala Lumpur – Quảng trường Độc Lập – Saloma Bridge","detail":"Bay đến sân bay KLIA, tham quan Quảng trường Độc Lập và chụp ảnh tại cầu đi bộ Saloma rực rỡ sắc màu về đêm."},{"day":2,"title":"Động Batu 272 bậc thang sắc màu – Cao nguyên Genting","detail":"Check-in cầu thang cầu vồng tại Động Batu, sau đó đi cáp treo Awana SkyWay lên cao nguyên Genting."},{"day":3,"title":"Hoàng Cung Malaysia – Tháp đôi Petronas – Thành phố mới Putrajaya","detail":"Tham quan Hoàng Cung, chụp ảnh lưu niệm tại Tháp đôi Petronas, mua sắm sô-cô-la và khám phá thành phố thông minh Putrajaya."},{"day":4,"title":"Tự do mua sắm Bukit Bintang – Kuala Lumpur – TP.HCM","detail":"Tự do mua sắm tại khu trung tâm Bukit Bintang trước khi xe đưa đoàn ra sân bay đáp chuyến bay về TP.HCM."}]',
    1
  );

-- 4. Seed 1 Yêu cầu đặt dịch vụ mẫu (bookings & booking_items)
INSERT INTO bookings (
  id, customer_name, customer_email, customer_phone, note, total_amount, created_at, email_status
) VALUES (
  'VJ-20261109-1001',
  'Nguyễn Văn Hải (Khách hàng Demo)',
  'khachhang.demo@example.com',
  '0901234567',
  'Yêu cầu mẫu khởi tạo sẵn trong cơ sở dữ liệu SQLite',
  6980000,
  '2026-11-09T12:00:00.000Z',
  'not_configured'
);

INSERT INTO booking_items (
  id, booking_id, item_type, reference_id, selected_option, quantity, unit_price, snapshot_json
) VALUES
  (
    'VJ-20261109-1001_IT1',
    'VJ-20261109-1001',
    'flight',
    'FL001',
    'Hạng Phổ Thông',
    1,
    1490000,
    '{"title":"Chuyến bay VJ122: TP. Hồ Chí Minh (SGN) → Hà Nội (HAN)","flightNumber":"VJ122","airlineName":"VietJet Air"}'
  ),
  (
    'VJ-20261109-1001_IT2',
    'VJ-20261109-1001',
    'tour',
    'TR001',
    'Khởi hành: 2026-11-14',
    1,
    5490000,
    '{"title":"Tour Phú Quốc 4N3Đ: Thiên Đường Đảo Ngọc - Grand World - Hòn Thơm","destination":"Phú Quốc"}'
  );
