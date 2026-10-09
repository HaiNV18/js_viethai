-- =========================================================
-- SUPABASE SCHEMA: Website bán điện máy
-- Tables: brand, category_product, products
-- =========================================================

-- -------------------- 1. TABLE: brand --------------------
CREATE TABLE IF NOT EXISTS public.brand (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name_brand   text NOT NULL,
  slug_brand   text NOT NULL UNIQUE,
  enable_brand boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- -------------------- 2. TABLE: category_product --------------------
CREATE TABLE IF NOT EXISTS public.category_product (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title_cat_prod text NOT NULL,
  slug_cat_prod  text NOT NULL UNIQUE,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- -------------------- 3. TABLE: products --------------------
-- Enum cho đơn vị giảm giá
DO $$ BEGIN
  CREATE TYPE discount_unit_type AS ENUM ('PERCENT', 'PRICE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.products (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title_prod     text NOT NULL,
  code           text NOT NULL UNIQUE,
  category_id    bigint REFERENCES public.category_product(id) ON DELETE SET NULL,
  brand_id       bigint REFERENCES public.brand(id) ON DELETE SET NULL,
  price          numeric(14,2) NOT NULL DEFAULT 0,
  discount       numeric(14,2) NOT NULL DEFAULT 0,
  discount_unit  discount_unit_type NOT NULL DEFAULT 'PERCENT',
  qty            integer NOT NULL DEFAULT 0,
  specifications text,
  description    text,
  img_1          text,
  img_2          text,
  img_3          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(code);

-- =========================================================
-- DỮ LIỆU MẪU (INSERT)
-- =========================================================

-- -------------------- brand --------------------
INSERT INTO public.brand (name_brand, slug_brand, enable_brand) VALUES
  ('E-Pro',   'e-pro',   true),
  ('Toshiba', 'toshiba', true),
  ('Arirang', 'arirang', true),
  ('LG', 'lg', true),
  ('Samsung', 'samsung', true)
ON CONFLICT (slug_brand) DO NOTHING;

-- -------------------- category_product --------------------
-- Lưu ý: chỉ 2 danh mục đầu là bạn cho slug sẵn (dien-tu, dien-lanh).
-- Các slug còn lại mình tự sinh theo quy tắc không dấu, cách nhau bằng "-".
INSERT INTO public.category_product (title_cat_prod, slug_cat_prod) VALUES
  ('Điện tử',                                    'dien-tu'),
  ('Điện lạnh',                                   'dien-lanh'),
  ('Điện gia dụng',                               'dien-gia-dung'),
  ('Thiết bị làm đẹp và chăm sóc cá nhân',        'thiet-bi-lam-dep-va-cham-soc-ca-nhan'),
  ('Gia dụng',                                    'gia-dung'),
  ('Phụ kiện',                                    'phu-kien'),
  ('Hàng thanh lý',                               'hang-thanh-ly')
ON CONFLICT (slug_cat_prod) DO NOTHING;

-- -------------------- products --------------------

-- 1. Tủ Lạnh Toshiba Inverter 249 Lít GR-RT325WE-PMV(06)-MG
INSERT INTO public.products
  (title_prod, code, category_id, brand_id, price, discount, discount_unit, qty,
   specifications, description, img_1, img_2, img_3)
VALUES
  (
    'Tủ Lạnh Toshiba Inverter 249 Lít GR-RT325WE-PMV(06)-MG',
    'TLA010402',
    (SELECT id FROM public.category_product WHERE slug_cat_prod = 'dien-lanh'),
    (SELECT id FROM public.brand WHERE slug_brand = 'toshiba'),
    9990000, 0, 'PERCENT', 99,
    '<table><tr><td>Model</td><td>GR-RT325WE-PMV(06)-MG</td></tr><tr><td>Màu sắc</td><td>Xám chống vân tay</td></tr></table>',
    '<h3>Đặc điểm nổi bật</h3><p>Tủ lạnh có dung tích 249 lít thích hợp cho gia đình có khoảng 2 - 3 thành viên</p>',
    'tu-lanh-toshiba-inverter-249-lit-gr-rt325we-pmv-06-mg-1.webp',
    'tu-lanh-toshiba-inverter-249-lit-gr-rt325we-pmv-06-mg-2.webp',
    'tu-lanh-toshiba-inverter-249-lit-gr-rt325we-pmv-06-mg-1.webp'
  );

-- 2. Tủ lạnh di động E-Pro VEP-PF-A-CD45
INSERT INTO public.products
  (title_prod, code, category_id, brand_id, price, discount, discount_unit, qty,
   specifications, description, img_1)
VALUES
  (
    'Tủ lạnh di động E-Pro VEP-PF-A-CD45',
    'TLA010426-2',
    (SELECT id FROM public.category_product WHERE slug_cat_prod = 'dien-lanh'),
    (SELECT id FROM public.brand WHERE slug_brand = 'e-pro'),
    7790000, 0, 'PRICE', 99,
    '<table><tr><td>Số cửa</td><td>1 cửa</td></tr><tr><td>Độ ồn</td><td>< 45dB</td></tr></table>',
    '<h3>Đặc điểm nổi bật</h3><p>Dải nhiệt độ -20°C đến 20°C, vừa làm mát vừa cấp đông.</p>',
    'tu-lanh-di-dong-e-pro-vep-pf-a-cd45-1.webp'
  );

-- 3. Máy giặt Toshiba inverter 10.5kg TW-BL115A2V(SS)
INSERT INTO public.products
  (title_prod, code, category_id, brand_id, price, discount, discount_unit, qty,
   specifications, description, img_1, img_2, img_3)
VALUES
  (
    'Máy giặt Toshiba Inverter 10.5kg TW-BL115A2V(SS)',
    'MGI020043',
    (SELECT id FROM public.category_product WHERE slug_cat_prod = 'dien-lanh'),
    (SELECT id FROM public.brand WHERE slug_brand = 'toshiba'),
    7194000, 40, 'PERCENT', 0,

    -- Thông số kỹ thuật
    '<table>
      <tr><td>Thương hiệu</td><td>Toshiba</td></tr>
      <tr><td>Mã sản phẩm</td><td>MGI020043</td></tr>
      <tr><td>Model</td><td>TW-BL115A2V(SS)</td></tr>
      <tr><td>Khối lượng giặt</td><td>10.5 kg</td></tr>
      <tr><td>Loại máy giặt</td><td>Cửa trước, lồng ngang</td></tr>
      <tr><td>Công nghệ Inverter</td><td>Origin Inverter</td></tr>
      <tr><td>Kiểu động cơ</td><td>Nam châm vĩnh cửu, truyền động dây Curoa</td></tr>
      <tr><td>Tốc độ quay vắt tối đa</td><td>1200 vòng/phút</td></tr>
      <tr><td>Hiệu suất sử dụng điện</td><td>7.98 Wh/kg</td></tr>
      <tr><td>Bảng điều khiển</td><td>Song ngữ Anh - Việt, nút xoay, cảm ứng và màn hình hiển thị</td></tr>
      <tr><td>Chất liệu vỏ máy</td><td>Kim loại sơn tĩnh điện</td></tr>
      <tr><td>Chất liệu nắp máy</td><td>Kính chịu lực</td></tr>
      <tr><td>Chất liệu lồng giặt</td><td>Thép không gỉ</td></tr>
      <tr><td>Nơi sản xuất</td><td>Trung Quốc</td></tr>
      <tr><td>Xuất xứ thương hiệu</td><td>Nhật Bản</td></tr>
      <tr><td>Bảo hành</td><td>24 tháng</td></tr>
      <tr><td>Dòng sản phẩm</td><td>2021</td></tr>
    </table>',

    -- Mô tả sản phẩm
    '<p>Máy giặt Toshiba Inverter 10.5kg TW-BL115A2V(SS) có thiết kế cửa trước, lồng ngang với màu xám bạc hiện đại, phù hợp với gia đình đông thành viên.</p>
    <p><strong>Đặc điểm nổi bật:</strong></p>
    <ul>
      <li>Khối lượng giặt 10.5 kg, phù hợp gia đình trên 7 người.</li>
      <li>Công nghệ Origin Inverter hỗ trợ tiết kiệm điện năng.</li>
      <li>Công nghệ giặt Greatwaves giúp làm sạch quần áo và hạn chế phai màu.</li>
      <li>Công nghệ siêu bọt khí Nano UFB hỗ trợ làm sạch vết bẩn.</li>
      <li>Công nghệ giặt hơi nước Steam Care hỗ trợ vệ sinh quần áo.</li>
      <li>Tốc độ quay vắt tối đa 1200 vòng/phút.</li>
      <li>Bảng điều khiển song ngữ Anh - Việt, kết hợp nút xoay, cảm ứng và màn hình hiển thị.</li>
    </ul>
    <p>Sản phẩm có thời gian bảo hành 24 tháng theo thông tin trên website Điện Máy NK.</p>',

    'may-giat-toshiba-inverter-10-5kg-tw-bl115a2v-ss-2630-1.jpg',
    'may-giat-toshiba-inverter-10-5kg-tw-bl115a2v-ss-2630-2.jpg',
    'may-giat-toshiba-inverter-10-5kg-tw-bl115a2v-ss-2630-3.jpg'
  );

-- 4. Loa thanh Samsung HW-T420
INSERT INTO public.products
  (title_prod, code, category_id, brand_id, price, discount, discount_unit, qty,
   specifications, description, img_1)
VALUES
  (
    'Loa thanh Samsung HW-T420',
    'KTS020002',
    (SELECT id FROM public.category_product WHERE slug_cat_prod = 'dien-tu'),
    (SELECT id FROM public.brand WHERE slug_brand = 'samsung'),
    2039000, 10, 'PERCENT', 99,
    '<table><tr><td></td><td></td></tr></table>',
    '<p></p>',
    'loa-thanh-samsung-hw-t420-1.webp'
  );

-- 5. Ấm siêu tốc chống tràn Toshiba KT-15DRTVN(W)
INSERT INTO public.products
  (title_prod, code, category_id, brand_id, price, discount, discount_unit, qty,
   specifications, description, img_1, img_2)
VALUES
  (
    'Ấm siêu tốc chống tràn Toshiba KT-15DRTVN(W)',
    'BTD020314-1',
    (SELECT id FROM public.category_product WHERE slug_cat_prod = 'dien-gia-dung'),
    (SELECT id FROM public.brand WHERE slug_brand = 'toshiba'),
    1490000, 0, 'PERCENT', 0,
    '<table><tr><td></td><td></td></tr></table>',
    '<p></p>',
    'am-sieu-toc-chong-tran-toshiba-kt-15drtvn-1.webp',
    'am-sieu-toc-chong-tran-toshiba-kt-15drtvn-2.webp'
  );
  
-- 6. Cây nước nóng lạnh Toshiba RWF-W1669BV(W1)
INSERT INTO public.products
  (title_prod, code, category_id, brand_id, price, discount, discount_unit, qty,
   specifications, description, img_1, img_2)
VALUES
  (
    'Cây nước nóng lạnh Toshiba RWF-W1669BV(W1)',
    'LNU010152',
    (SELECT id FROM public.category_product WHERE slug_cat_prod = 'dien-gia-dung'),
    (SELECT id FROM public.brand WHERE slug_brand = 'toshiba'),
    5290000, 0, 'PERCENT', 0,

    -- Thông số kỹ thuật
    '<table><tr><td></td><td></td></tr></table>',
    '<p></p>',

    'cay-nuoc-nong-lanh-toshiba-rwf-w1669bv-w1-1.jpg',
    'cay-nuoc-nong-lanh-toshiba-rwf-w1669bv-w1-2.jpg'
);



-- =========================================================
-- (Tuỳ chọn) BẬT ROW LEVEL SECURITY + POLICY ĐỌC CÔNG KHAI
-- Supabase mặc định KHÔNG bật RLS, nên nếu bảng để public schema
-- và bạn dùng anon key, ai cũng đọc/ghi được nếu không bật RLS.
-- Bỏ comment đoạn dưới nếu muốn cho phép đọc công khai, chỉ ghi qua service_role.
-- =========================================================
-- ALTER TABLE public.brand ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.category_product ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Public read brand" ON public.brand FOR SELECT USING (true);
-- CREATE POLICY "Public read category_product" ON public.category_product FOR SELECT USING (true);
-- CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);