-- ============================================================================
-- Vietjet Travel & Flights Demo – SQLite Database Schema (schema.sql)
-- Theo tài liệu đặc tả: data-and-storage.md
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Bảng Hãng hàng không (airlines)
CREATE TABLE IF NOT EXISTS airlines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  is_active INTEGER DEFAULT 1
);

-- 2. Bảng Chuyến bay (flights)
CREATE TABLE IF NOT EXISTS flights (
  id TEXT PRIMARY KEY,
  airline_id TEXT NOT NULL,
  flight_number TEXT,
  origin_code TEXT,
  origin_name TEXT,
  destination_code TEXT,
  destination_name TEXT,
  departure_date TEXT,
  departure_time TEXT,
  arrival_time TEXT,
  duration_minutes INTEGER,
  stops INTEGER DEFAULT 0,
  aircraft TEXT,
  economy_price INTEGER,
  business_price INTEGER,
  services TEXT,
  FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 3. Bảng Tour du lịch (tours)
CREATE TABLE IF NOT EXISTS tours (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT,
  origin TEXT,
  airline_id TEXT,
  departure_date TEXT,
  departure_time TEXT,
  duration_days INTEGER,
  duration_nights INTEGER,
  flight_duration_minutes INTEGER,
  aircraft TEXT,
  price INTEGER,
  thumbnail TEXT,
  description TEXT,
  included_services TEXT,
  itinerary_json TEXT,
  featured INTEGER DEFAULT 0,
  FOREIGN KEY (airline_id) REFERENCES airlines(id)
);

-- 4. Bảng Yêu cầu đặt dịch vụ (bookings)
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  note TEXT,
  total_amount INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  email_status TEXT NOT NULL
);

-- 5. Bảng Chi tiết dịch vụ trong đơn đặt (booking_items)
CREATE TABLE IF NOT EXISTS booking_items (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  selected_option TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL,
  snapshot_json TEXT,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Indexes tối ưu hóa truy vấn tìm kiếm & lọc
CREATE INDEX IF NOT EXISTS idx_flights_route_date ON flights(origin_code, destination_code, departure_date);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_id);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured);
CREATE INDEX IF NOT EXISTS idx_tours_airline ON tours(airline_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking_items(booking_id);
