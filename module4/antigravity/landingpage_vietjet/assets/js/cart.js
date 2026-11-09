/**
 * Quản lý Giỏ hàng (Cart) lưu trữ bền vững trong localStorage (key: vietjet_cart_v1)
 * và đồng bộ dữ liệu với SQLite.
 */
import { queryOne } from './db.js';

export const CART_STORAGE_KEY = 'vietjet_cart_v1';

/**
 * Đọc danh sách item từ localStorage (có kiểm tra định dạng an toàn)
 */
export function getCartItems() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        (item.type === 'flight' || item.type === 'tour') &&
        typeof item.referenceId === 'string' &&
        Number(item.quantity) >= 1 &&
        Number(item.unitPrice) >= 0
    );
  } catch (err) {
    console.warn('Không thể đọc giỏ hàng từ localStorage:', err);
    return [];
  }
}

/**
 * Lưu danh sách item vào localStorage và phát sự kiện cập nhật badge
 */
export function saveCartItems(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Lỗi khi lưu giỏ hàng:', err);
  }
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('vj:cart-updated', { detail: { items } }));
}

/**
 * Đồng bộ giỏ hàng với SQLite để loại bỏ item không còn tồn tại và đảm bảo đơn giá chính xác
 */
export async function syncCartWithDatabase() {
  const items = getCartItems();
  if (items.length === 0) return { validItems: [], removedCount: 0 };

  const validItems = [];
  let removedCount = 0;

  for (const item of items) {
    if (item.type === 'flight') {
      const flight = await queryOne(
        `SELECT f.*, a.name as airline_name, a.logo as airline_logo
         FROM flights f
         LEFT JOIN airlines a ON f.airline_id = a.id
         WHERE f.id = ?`,
        [item.referenceId]
      );
      if (!flight) {
        removedCount++;
        continue;
      }
      const isBusiness = item.fareClass === 'business';
      const unitPrice = isBusiness ? Number(flight.business_price) : Number(flight.economy_price);
      validItems.push({
        ...item,
        unitPrice,
        fareLabel: isBusiness ? 'Hạng Thương Gia' : 'Hạng Phổ Thông',
        snapshot: {
          title: `Chuyến bay ${flight.flight_number}: ${flight.origin_name} → ${flight.destination_name}`,
          flightNumber: flight.flight_number,
          airlineName: flight.airline_name,
          originCode: flight.origin_code,
          originName: flight.origin_name,
          destinationCode: flight.destination_code,
          destinationName: flight.destination_name,
          departureDate: flight.departure_date,
          departureTime: flight.departure_time,
          arrivalTime: flight.arrival_time,
          aircraft: flight.aircraft
        }
      });
    } else if (item.type === 'tour') {
      const tour = await queryOne(
        `SELECT t.*, a.name as airline_name
         FROM tours t
         LEFT JOIN airlines a ON t.airline_id = a.id
         WHERE t.id = ?`,
        [item.referenceId]
      );
      if (!tour) {
        removedCount++;
        continue;
      }
      validItems.push({
        ...item,
        unitPrice: Number(tour.price),
        departureDate: item.departureDate || tour.departure_date,
        snapshot: {
          title: tour.title,
          destination: tour.destination,
          origin: tour.origin,
          airlineName: tour.airline_name,
          departureDate: item.departureDate || tour.departure_date,
          departureTime: tour.departure_time,
          durationDays: tour.duration_days,
          durationNights: tour.duration_nights,
          thumbnail: tour.thumbnail
        }
      });
    }
  }

  saveCartItems(validItems);
  return { validItems, removedCount };
}

/**
 * Thêm chuyến bay vào giỏ hàng
 */
export function addFlightToCart({ flight, fareClass = 'economy', quantity = 1 }) {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const normalizedFare = fareClass === 'business' ? 'business' : 'economy';
  const unitPrice = normalizedFare === 'business' ? Number(flight.business_price) : Number(flight.economy_price);
  const fareLabel = normalizedFare === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';

  const items = getCartItems();
  const itemKey = `flight_${flight.id}_${normalizedFare}`;
  const existingIndex = items.findIndex((i) => i.id === itemKey);

  const snapshot = {
    title: `Chuyến bay ${flight.flight_number}: ${flight.origin_name} → ${flight.destination_name}`,
    flightNumber: flight.flight_number,
    airlineName: flight.airline_name,
    originCode: flight.origin_code,
    originName: flight.origin_name,
    destinationCode: flight.destination_code,
    destinationName: flight.destination_name,
    departureDate: flight.departure_date,
    departureTime: flight.departure_time,
    arrivalTime: flight.arrival_time,
    aircraft: flight.aircraft
  };

  if (existingIndex > -1) {
    items[existingIndex].quantity += qty;
    items[existingIndex].unitPrice = unitPrice;
    items[existingIndex].snapshot = snapshot;
  } else {
    items.push({
      id: itemKey,
      type: 'flight',
      referenceId: flight.id,
      fareClass: normalizedFare,
      fareLabel,
      quantity: qty,
      unitPrice,
      snapshot
    });
  }

  saveCartItems(items);
  return items;
}

/**
 * Thêm tour du lịch vào giỏ hàng
 */
export function addTourToCart({ tour, departureDate, quantity = 1 }) {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const selectedDate = departureDate || tour.departure_date;
  const unitPrice = Number(tour.price);

  const items = getCartItems();
  const itemKey = `tour_${tour.id}_${selectedDate}`;
  const existingIndex = items.findIndex((i) => i.id === itemKey);

  const snapshot = {
    title: tour.title,
    destination: tour.destination,
    origin: tour.origin,
    airlineName: tour.airline_name,
    departureDate: selectedDate,
    departureTime: tour.departure_time,
    durationDays: tour.duration_days,
    durationNights: tour.duration_nights,
    thumbnail: tour.thumbnail
  };

  if (existingIndex > -1) {
    items[existingIndex].quantity += qty;
    items[existingIndex].unitPrice = unitPrice;
    items[existingIndex].snapshot = snapshot;
  } else {
    items.push({
      id: itemKey,
      type: 'tour',
      referenceId: tour.id,
      departureDate: selectedDate,
      quantity: qty,
      unitPrice,
      snapshot
    });
  }

  saveCartItems(items);
  return items;
}

/**
 * Cập nhật số lượng của 1 item trong giỏ hàng
 */
export function updateCartItemQuantity(itemId, newQuantity) {
  const qty = Math.max(1, parseInt(newQuantity, 10) || 1);
  const items = getCartItems().map((item) => {
    if (item.id === itemId) {
      return { ...item, quantity: qty };
    }
    return item;
  });
  saveCartItems(items);
  return items;
}

/**
 * Xóa 1 item khỏi giỏ hàng
 */
export function removeCartItem(itemId) {
  const items = getCartItems().filter((item) => item.id !== itemId);
  saveCartItems(items);
  return items;
}

/**
 * Xóa toàn bộ giỏ hàng
 */
export function clearCart() {
  saveCartItems([]);
}

/**
 * Tính toán lại tổng số lượng và tổng tiền từ danh sách item
 */
export function calculateCartTotals(items = getCartItems()) {
  let totalCount = 0;
  let totalAmount = 0;
  for (const item of items) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const price = Math.max(0, Number(item.unitPrice) || 0);
    totalCount += qty;
    totalAmount += qty * price;
  }
  return {
    itemCount: items.length,
    totalPassengersOrGuests: totalCount,
    totalAmount
  };
}

/**
 * Cập nhật số lượng trên icon giỏ hàng ở Header
 */
export function updateCartBadge() {
  const badges = document.querySelectorAll('[data-cart-badge]');
  const items = getCartItems();
  const totalItems = items.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  badges.forEach((badge) => {
    badge.textContent = String(totalItems);
  });
}
