/**
 * Tích hợp gửi email xác nhận qua EmailJS (client-side) và tạo liên kết mailto: dự phòng.
 * Tuân thủ quy tắc: Chỉ báo "đã gửi" khi EmailJS thực sự trả về thành công;
 * nếu chưa cấu hình hoặc lỗi, báo rõ trạng thái và cung cấp nút mở ứng dụng email bằng mailto:.
 */
import { EMAILJS_CONFIG } from './config.example.js';
import { formatCurrency, formatDateVN } from './db.js';

const LOCAL_EMAILJS_OVERRIDE_KEY = 'vietjet_emailjs_config_v1';
const EMAILJS_SDK_URL = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

/**
 * Đọc cấu hình EmailJS hiện tại (ưu tiên cấu hình lưu trong localStorage nếu người dùng nhập thử nghiệm,
 * sau đó đến file config.example.js)
 */
export function getActiveEmailConfig() {
  try {
    const saved = localStorage.getItem(LOCAL_EMAILJS_OVERRIDE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.EMAILJS_PUBLIC_KEY && parsed.EMAILJS_SERVICE_ID && parsed.EMAILJS_TEMPLATE_ID) {
        return {
          ...EMAILJS_CONFIG,
          ...parsed
        };
      }
    }
  } catch (_) {}
  return EMAILJS_CONFIG;
}

/**
 * Lưu cấu hình EmailJS tùy chỉnh từ giao diện (nếu người dùng muốn cấu hình nhanh trên trình duyệt)
 */
export function saveCustomEmailConfig({ publicKey, serviceId, templateId }) {
  localStorage.setItem(
    LOCAL_EMAILJS_OVERRIDE_KEY,
    JSON.stringify({
      EMAILJS_PUBLIC_KEY: (publicKey || '').trim(),
      EMAILJS_SERVICE_ID: (serviceId || '').trim(),
      EMAILJS_TEMPLATE_ID: (templateId || '').trim()
    })
  );
}

/**
 * Kiểm tra EmailJS đã được cấu hình hợp lệ hay chưa
 */
export function isEmailJsConfigured() {
  const cfg = getActiveEmailConfig();
  if (!cfg) return false;
  const pub = (cfg.EMAILJS_PUBLIC_KEY || '').trim();
  const srv = (cfg.EMAILJS_SERVICE_ID || '').trim();
  const tpl = (cfg.EMAILJS_TEMPLATE_ID || '').trim();

  if (!pub || !srv || !tpl) return false;
  if (
    pub === 'YOUR_EMAILJS_PUBLIC_KEY' ||
    srv === 'YOUR_EMAILJS_SERVICE_ID' ||
    tpl === 'YOUR_EMAILJS_TEMPLATE_ID'
  ) {
    return false;
  }
  return true;
}

/**
 * Tạo chuỗi tóm tắt danh sách dịch vụ đã đặt cho nội dung email
 */
export function buildItemsTextSummary(items) {
  return items
    .map((item, idx) => {
      const lineTotal = formatCurrency(Number(item.unitPrice) * Number(item.quantity));
      if (item.type === 'flight') {
        const s = item.snapshot || {};
        return `${idx + 1}. [Chuyến bay] ${s.flightNumber || item.referenceId} (${s.originName || ''} -> ${s.destinationName || ''}) | Ngày: ${formatDateVN(s.departureDate)} ${s.departureTime || ''} | ${item.fareLabel || ''} | SL: ${item.quantity} khách | Thành tiền: ${lineTotal}`;
      }
      const s = item.snapshot || {};
      return `${idx + 1}. [Tour] ${s.title || item.referenceId} | Khởi hành: ${formatDateVN(item.departureDate || s.departureDate)} | SL: ${item.quantity} khách | Thành tiền: ${lineTotal}`;
    })
    .join('\n');
}

/**
 * Tạo đường dẫn mailto: dự phòng đầy đủ thông tin đơn hàng
 */
export function createMailtoFallbackUrl(bookingData, items) {
  const subject = `[Vietjet Demo] Yêu cầu đặt dịch vụ #${bookingData.id} - ${bookingData.customer_name}`;
  const itemsText = buildItemsTextSummary(items);
  const bodyLines = [
    `Xin chào ${bookingData.customer_name},`,
    '',
    'Cảm ơn bạn đã gửi yêu cầu đăng ký dịch vụ trên hệ thống Vietjet (Bản Demo).',
    `Mã yêu cầu: ${bookingData.id}`,
    `Thời gian tạo: ${new Date(bookingData.created_at).toLocaleString('vi-VN')}`,
    `Họ và tên: ${bookingData.customer_name}`,
    `Email nhận thông tin: ${bookingData.customer_email}`,
    `Số điện thoại: ${bookingData.customer_phone}`,
    `Ghi chú: ${bookingData.note || 'Không có'}`,
    '',
    '--- DANH SÁCH DỊCH VỤ ĐÃ CHỌN ---',
    itemsText,
    '',
    `TỔNG TIỀN THAM KHẢO: ${formatCurrency(bookingData.total_amount)}`,
    '',
    'Lưu ý quan trọng: Đây là yêu cầu đăng ký dịch vụ trên website demo, chưa phải vé máy bay điện tử hoặc xác nhận giữ chỗ chính thức của hãng.',
    `Liên hệ hỗ trợ / Reply-To tham khảo: ${EMAILJS_CONFIG.DESIRED_SENDER_EMAIL}`
  ];

  const mailto = `mailto:${encodeURIComponent(bookingData.customer_email)}?cc=${encodeURIComponent(
    EMAILJS_CONFIG.DESIRED_SENDER_EMAIL
  )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
  return mailto;
}

/**
 * Nạp EmailJS SDK từ CDN
 */
function ensureEmailJsSdkLoaded() {
  if (window.emailjs && typeof window.emailjs.send === 'function') {
    return Promise.resolve(window.emailjs);
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = EMAILJS_SDK_URL;
    script.onload = () => resolve(window.emailjs);
    script.onerror = () => reject(new Error('Không thể tải SDK EmailJS từ CDN.'));
    document.head.appendChild(script);
  });
}

/**
 * Thực hiện gửi email xác nhận qua EmailJS nếu đã cấu hình
 */
export async function sendBookingConfirmationEmail(bookingData, items) {
  const mailtoUrl = createMailtoFallbackUrl(bookingData, items);

  if (!isEmailJsConfigured()) {
    return {
      sent: false,
      status: 'not_configured',
      message: 'Chưa cấu hình gửi email tự động (EmailJS). Bạn có thể sử dụng nút mở ứng dụng email bên dưới.',
      mailtoUrl
    };
  }

  const cfg = getActiveEmailConfig();
  try {
    const emailjs = await ensureEmailJsSdkLoaded();
    emailjs.init({
      publicKey: cfg.EMAILJS_PUBLIC_KEY
    });

    const templateParams = {
      to_email: bookingData.customer_email,
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: bookingData.customer_phone,
      booking_id: bookingData.id,
      created_at: new Date(bookingData.created_at).toLocaleString('vi-VN'),
      total_amount: formatCurrency(bookingData.total_amount),
      items_summary: buildItemsTextSummary(items),
      note: bookingData.note || 'Không có ghi chú',
      reply_to: cfg.DESIRED_SENDER_EMAIL,
      sender_note:
        'Đây là yêu cầu đăng ký dịch vụ minh họa trên hệ thống demo, chưa phải vé điện tử hoặc xác nhận giữ chỗ chính thức.'
    };

    const response = await emailjs.send(
      cfg.EMAILJS_SERVICE_ID,
      cfg.EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response && response.status >= 200 && response.status < 300) {
      return {
        sent: true,
        status: 'sent',
        message: `Đã gửi email xác nhận tự động tới ${bookingData.customer_email}.`,
        mailtoUrl
      };
    }

    return {
      sent: false,
      status: 'failed',
      message: 'Dịch vụ EmailJS không phản hồi trạng thái thành công. Vui lòng dùng nút mở ứng dụng email dự phòng.',
      mailtoUrl
    };
  } catch (err) {
    console.warn('Gửi email qua EmailJS thất bại:', err);
    return {
      sent: false,
      status: 'failed',
      message: `Không thể gửi email tự động (${err?.text || err?.message || 'Lỗi kết nối EmailJS'}). Vui lòng dùng nút mở ứng dụng email bên dưới.`,
      mailtoUrl
    };
  }
}
