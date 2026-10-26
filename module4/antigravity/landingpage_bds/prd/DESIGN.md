# Quy cách thiết kế

## Màu sắc

| Vai trò | Mã màu |
|---------|--------|
| Nền trang | `#f2f2f2` |
| Chữ chính / màu chủ đạo | `#2d2d86` |
| Nền thẻ (card), form | `#ffffff` |

Gợi ý khai báo bằng CSS variables:

```css
:root {
  --bg: #f2f2f2;
  --primary: #2d2d86;
  --card: #ffffff;
}
```

## Phong cách

- Sạch sẽ, sang trọng, nhiều khoảng trắng.
- Bo góc nhẹ, bóng đổ tinh tế.
- Tương phản chữ/nền đủ rõ để dễ đọc.

## Bố cục

- Dùng hệ thống lưới Bootstrap 5 (container, row, col).
- Hero: 2 cột (`col-md-6` mỗi cột); mobile xếp dọc.
- Features: 3 cột (`col-md-4`); mobile xếp dọc.
- Footer: nền màu chủ đạo hoặc nền sáng, chữ tương phản.

## Hình ảnh

- Hero: nhà phố/biệt thự nghỉ dưỡng, trường học (Vinschool).
- Features: 3 ảnh khác nhau (lối sống, tiện ích, pháp lý/hợp đồng).
- Ảnh có `alt`, tỷ lệ đồng nhất, `object-fit: cover`.

## Hiệu ứng (JavaScript)

- Cuộn mượt khi bấm menu và nút CTA.
- Hiện dần (fade-in) các thẻ khi cuộn tới.
- Kiểm tra form và hiển thị thông báo.
