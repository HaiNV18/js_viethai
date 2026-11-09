/**
 * Cấu hình mẫu cho dịch vụ gửi email tự động EmailJS.
 * Hướng dẫn:
 * 1. Đăng ký tài khoản tại https://www.emailjs.com/
 * 2. Tạo Email Service (ví dụ Gmail đã xác minh tài khoản nvhai061993@gmail.com)
 * 3. Tạo Email Template nhận các biến:
 *    {{booking_id}}, {{customer_name}}, {{customer_email}}, {{customer_phone}},
 *    {{total_amount}}, {{items_summary}}, {{created_at}}, {{reply_to}}, {{note}}
 * 4. Điền Public Key, Service ID và Template ID vào bên dưới (không đưa Private Key/SMTP Password vào đây).
 */
export const EMAILJS_CONFIG = {
  EMAILJS_PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
  EMAILJS_SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',
  EMAILJS_TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',
  DESIRED_SENDER_EMAIL: 'nvhai061993@gmail.com'
};
