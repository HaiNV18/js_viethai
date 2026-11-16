/**
 * Cấu hình mẫu cho dịch vụ gửi email tự động EmailJS và Chatbot OpenRouter.
 * QUY TẮC BẢO MẬT (GEMINI.md):
 * Tuyệt đối KHÔNG ghi mật khẩu, SMTP credentials hoặc API secret thật vào repository.
 * Chỉ để các giá trị placeholder tại đây.
 */
export const EMAILJS_CONFIG = {
  EMAILJS_PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
  EMAILJS_SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',
  EMAILJS_TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',
  DESIRED_SENDER_EMAIL: 'nvhai061993@gmail.com'
};

export const OPENROUTER_CONFIG = {
  API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  MODEL: 'nvidia/nemotron-3-ultra-550b-a55b:free',
  OPENROUTER_API_KEY: 'YOUR_OPENROUTER_API_KEY'
};
