/**
 * Module Trợ lý ảo Chatbot du lịch Vietjet (assets/js/chatbot.js).
 *
 * Tuân thủ quy tắc bảo mật trong GEMINI.md:
 * - "Không ghi mật khẩu, SMTP credentials hoặc secret vào repository."
 * - Tuyệt đối không hardcode khóa `sk-or-v1-...` vào mã nguồn.
 * - Người dùng có thể nhập khóa OpenRouter vào hộp thoại cài đặt phiên làm việc (lưu tạm trong sessionStorage,
 *   tự xóa khi đóng tab), hoặc hệ thống tự động sử dụng Trợ lý tra cứu SQLite nội bộ nếu chưa cấu hình khóa.
 */

import { OPENROUTER_CONFIG } from './config.example.js';
import { queryAll, formatCurrency, formatDateVN } from './db.js';
import { escapeHtml, showToast } from './app.js';

const SESSION_KEY_STORAGE = 'vietjet_openrouter_session_key';
const REQUEST_TIMEOUT_MS = 25000;

let chatHistory = [];

/**
 * Lấy API Key lưu tạm trong sessionStorage (nếu người dùng nhập thử nghiệm trên trình duyệt)
 */
export function getSessionOpenRouterKey() {
  try {
    const fromSession = (sessionStorage.getItem(SESSION_KEY_STORAGE) || '').trim();
    if (fromSession && fromSession !== 'YOUR_OPENROUTER_API_KEY') {
      return fromSession;
    }
  } catch (_) {}
  const fromConfig = (OPENROUTER_CONFIG.OPENROUTER_API_KEY || '').trim();
  if (fromConfig && fromConfig !== 'YOUR_OPENROUTER_API_KEY') {
    return fromConfig;
  }
  return '';
}

/**
 * Lưu hoặc xóa OpenRouter API Key trong sessionStorage của phiên hiện tại
 */
export function setSessionOpenRouterKey(key) {
  try {
    const clean = (key || '').trim();
    if (clean) {
      sessionStorage.setItem(SESSION_KEY_STORAGE, clean);
    } else {
      sessionStorage.removeItem(SESSION_KEY_STORAGE);
    }
  } catch (_) {}
}

/**
 * Tạo ngữ cảnh dữ liệu chuyến bay và tour từ SQLite để cung cấp cho AI hoặc trả lời cục bộ
 */
async function buildTravelDatabaseContext() {
  try {
    const flights = await queryAll(
      `SELECT f.flight_number, a.name as airline_name, f.origin_name, f.destination_name,
              f.departure_date, f.departure_time, f.economy_price, f.business_price
       FROM flights f
       LEFT JOIN airlines a ON f.airline_id = a.id
       ORDER BY f.economy_price ASC
       LIMIT 12`
    );
    const tours = await queryAll(
      `SELECT t.id, t.title, t.destination, t.duration_days, t.duration_nights, t.price, t.departure_date
       FROM tours t
       ORDER BY t.price ASC
       LIMIT 8`
    );

    const flightsSummary = flights
      .map(
        (f) =>
          `- ${f.flight_number} (${f.airline_name}): ${f.origin_name} -> ${f.destination_name}, ngày ${formatDateVN(
            f.departure_date
          )} lúc ${f.departure_time}, Phổ thông: ${formatCurrency(f.economy_price)}, Thương gia: ${formatCurrency(
            f.business_price
          )}`
      )
      .join('\n');

    const toursSummary = tours
      .map(
        (t) =>
          `- [${t.id}] ${t.title} (${t.duration_days}N${t.duration_nights}Đ), khởi hành ${formatDateVN(
            t.departure_date
          )}, giá: ${formatCurrency(t.price)}/khách`
      )
      .join('\n');

    return `Dữ liệu mẫu hiện có trên website Vietjet Demo:\nCHUYẾN BAY:\n${flightsSummary}\n\nTOUR DU LỊCH:\n${toursSummary}`;
  } catch (_) {
    return '';
  }
}

/**
 * Trả lời dự phòng thông minh từ dữ liệu SQLite khi chưa nhập OpenRouter API Key
 */
async function generateLocalSqliteReply(userMessage) {
  const q = userMessage.toLowerCase();
  const flights = await queryAll(
    `SELECT f.*, a.name as airline_name
     FROM flights f
     LEFT JOIN airlines a ON f.airline_id = a.id
     ORDER BY f.economy_price ASC`
  );
  const tours = await queryAll('SELECT * FROM tours ORDER BY price ASC');

  if (q.includes('tour') || q.includes('phú quốc') || q.includes('đà nẵng') || q.includes('hạ long') || q.includes('đà lạt') || q.includes('nha trang') || q.includes('thái lan') || q.includes('singapore') || q.includes('malaysia')) {
    const matchedTours = tours.filter(
      (t) =>
        q.includes(t.destination.toLowerCase()) ||
        q.includes(t.title.toLowerCase())
    );
    const list = (matchedTours.length > 0 ? matchedTours : tours.slice(0, 3))
      .map(
        (t) =>
          `• ${t.title} (${t.duration_days}N${t.duration_nights}Đ) – Giá tham khảo: ${formatCurrency(t.price)}/khách`
      )
      .join('\n');
    return `Dưới đây là các tour nổi bật phù hợp trong cơ sở dữ liệu SQLite:\n${list}\n\n(Gợi ý: Bạn có thể bấm nút 🔑 trên thanh tiêu đề khung chat để nhập OpenRouter API Key và trò chuyện trực tiếp với mô hình AI nvidia/nemotron-3-ultra-550b-a55b:free).`;
  }

  if (q.includes('chuyến bay') || q.includes('vé') || q.includes('bay') || q.includes('giá') || q.includes('hà nội') || q.includes('hồ chí minh')) {
    const topFlights = flights
      .slice(0, 4)
      .map(
        (f) =>
          `• ${f.flight_number} (${f.airline_name}): ${f.origin_name} → ${f.destination_name} (${formatDateVN(
            f.departure_date
          )} ${f.departure_time}) – Từ ${formatCurrency(f.economy_price)}`
      )
      .join('\n');
    return `Các chuyến bay có giá tốt đang có trong hệ thống SQLite:\n${topFlights}\n\nBạn có thể vào mục "Chuyến bay" để lọc theo giờ cất cánh và chọn Hạng Phổ Thông hoặc Hạng Thương Gia.`;
  }

  return `Xin chào! Tôi là Trợ lý du lịch Vietjet Demo. Hiện chưa có OpenRouter API Key trong phiên làm việc (để bảo mật, khóa không được lưu cứng trong mã nguồn).\n\nBạn có thể:\n1. Hỏi tôi về "giá vé chuyến bay", "tour Phú Quốc", "tour Đà Nẵng", "tour Singapore"...\n2. Hoặc nhấn biểu tượng 🔑 ở góc trên khung chat để dán OpenRouter API Key cho phiên hiện tại và kích hoạt mô hình "${OPENROUTER_CONFIG.MODEL}".`;
}

/**
 * Gửi tin nhắn tới OpenRouter API theo cấu trúc cURL đã cung cấp
 */
export async function sendChatMessageToOpenRouter(userContent) {
  const apiKey = getSessionOpenRouterKey();

  // Nếu chưa cấu hình API Key trong session, trả lời bằng dữ liệu SQLite nội bộ
  if (!apiKey) {
    const localReply = await generateLocalSqliteReply(userContent);
    return {
      reply: localReply,
      reasoning: null,
      source: 'local-sqlite'
    };
  }

  const dbContext = await buildTravelDatabaseContext();
  const systemPrompt = [
    'Bạn là trợ lý tư vấn du lịch và chuyến bay thân thiện của website demo Vietjet.',
    'Trả lời ngắn gọn, lịch sự, chính xác bằng tiếng Việt.',
    'Lưu ý luôn nhắc giá vé và lịch trình là dữ liệu tham khảo trên bản demo.',
    dbContext
  ].join('\n\n');

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-6),
    { role: 'user', content: userContent }
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_CONFIG.API_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin || 'http://localhost',
        'X-Title': 'Vietjet Travel Demo'
      },
      body: JSON.stringify({
        model: OPENROUTER_CONFIG.MODEL,
        messages: messagesPayload,
        reasoning: {
          enabled: true
        }
      })
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error('OpenRouter API Key không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại khóa trong mục 🔑.');
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message || `Mã lỗi HTTP ${response.status}`;
      throw new Error(`OpenRouter phản hồi lỗi: ${msg}`);
    }

    const data = await response.json();
    const messageObj = data?.choices?.[0]?.message;
    const replyText = (messageObj?.content || '').trim();
    const reasoningText = (messageObj?.reasoning || '').trim();

    if (!replyText) {
      throw new Error('Mô hình không trả về nội dung phản hồi.');
    }

    chatHistory.push({ role: 'user', content: userContent });
    chatHistory.push({ role: 'assistant', content: replyText });

    return {
      reply: replyText,
      reasoning: reasoningText || null,
      source: 'openrouter'
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Mô hình AI trên OpenRouter phản hồi quá lâu (quá 25 giây). Vui lòng thử lại.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Khởi tạo giao diện Floating Chatbot ở góc dưới bên phải mọi trang
 */
export function initChatbotWidget() {
  if (document.getElementById('vj-chatbot-root')) return;

  const root = document.createElement('div');
  root.id = 'vj-chatbot-root';
  root.innerHTML = `
    <!-- Nút mở Chatbot nổi -->
    <button
      type="button"
      id="vj-chatbot-toggle-btn"
      class="vj-chatbot-fab shadow"
      aria-label="Mở trợ lý ảo Chatbot Vietjet"
      aria-expanded="false"
      aria-controls="vj-chatbot-panel"
    >
      <i class="bi bi-chat-dots-fill fs-4"></i>
      <span class="d-none d-sm-inline fw-bold small ms-1">Trợ lý AI</span>
    </button>

    <!-- Khung cửa sổ Chatbot -->
    <section
      id="vj-chatbot-panel"
      class="vj-chatbot-panel shadow-lg d-none"
      aria-label="Cửa sổ trò chuyện cùng Trợ lý AI Vietjet"
    >
      <div class="vj-chatbot-header d-flex align-items-center justify-content-between px-3 py-2">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-robot fs-5"></i>
          <div>
            <div class="fw-bold small lh-sm">Trợ lý AI Vietjet (Demo)</div>
            <div id="vj-chatbot-mode-badge" style="font-size: 0.7rem; opacity: 0.9;"></div>
          </div>
        </div>
        <div class="d-flex align-items-center gap-1">
          <button
            type="button"
            id="vj-chatbot-key-btn"
            class="btn btn-sm text-white p-1"
            title="Cấu hình OpenRouter API Key tạm thời cho phiên này"
            aria-label="Cấu hình OpenRouter API Key"
          >
            <i class="bi bi-key-fill"></i>
          </button>
          <button
            type="button"
            id="vj-chatbot-close-btn"
            class="btn btn-sm text-white p-1"
            aria-label="Thu gọn khung chat"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- Khung nhập API Key theo phiên (Session-only, không lưu vào code) -->
      <div id="vj-chatbot-key-box" class="p-2 bg-light border-bottom d-none">
        <div class="small fw-bold text-dark mb-1">
          <i class="bi bi-shield-lock text-danger me-1"></i>OpenRouter API Key (Chỉ lưu tạm trong Session)
        </div>
        <div class="input-group input-group-sm mb-1">
          <input
            type="password"
            id="vj-openrouter-key-input"
            class="form-control"
            placeholder="Dán sk-or-v1-... vào đây"
            autocomplete="off"
          >
          <button type="button" id="vj-save-openrouter-key" class="btn btn-vj-primary">Lưu</button>
        </div>
        <div class="text-secondary" style="font-size: 0.72rem;">
          Model: <code>${escapeHtml(OPENROUTER_CONFIG.MODEL)}</code> (Reasoning bật). Không ghi khóa vào mã nguồn.
        </div>
      </div>

      <!-- Danh sách tin nhắn -->
      <div id="vj-chatbot-messages" class="vj-chatbot-messages p-3" aria-live="polite">
        <div class="vj-chat-bubble bot">
          Xin chào! Tôi là trợ lý ảo của <strong>Vietjet Demo</strong>. Tôi có thể tư vấn chuyến bay, gợi ý tour du lịch hoặc giải đáp thắc mắc của bạn!
        </div>
      </div>

      <!-- Form gửi tin nhắn -->
      <form id="vj-chatbot-form" class="p-2 border-top bg-white">
        <div class="input-group input-group-sm">
          <input
            type="text"
            id="vj-chatbot-input"
            class="form-control"
            placeholder="Nhập câu hỏi (VD: Gợi ý tour Phú Quốc)..."
            aria-label="Nội dung tin nhắn"
            required
          >
          <button type="submit" id="vj-chatbot-send-btn" class="btn btn-vj-primary px-3" aria-label="Gửi tin nhắn">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </form>
    </section>
  `;

  document.body.appendChild(root);

  const toggleBtn = document.getElementById('vj-chatbot-toggle-btn');
  const closeBtn = document.getElementById('vj-chatbot-close-btn');
  const keyBtn = document.getElementById('vj-chatbot-key-btn');
  const keyBox = document.getElementById('vj-chatbot-key-box');
  const keyInput = document.getElementById('vj-openrouter-key-input');
  const saveKeyBtn = document.getElementById('vj-save-openrouter-key');
  const modeBadge = document.getElementById('vj-chatbot-mode-badge');
  const panel = document.getElementById('vj-chatbot-panel');
  const messagesEl = document.getElementById('vj-chatbot-messages');
  const form = document.getElementById('vj-chatbot-form');
  const input = document.getElementById('vj-chatbot-input');
  const sendBtn = document.getElementById('vj-chatbot-send-btn');

  const updateModeLabel = () => {
    const hasKey = Boolean(getSessionOpenRouterKey());
    if (modeBadge) {
      modeBadge.textContent = hasKey
        ? 'Đang kết nối: OpenRouter (Nemotron Ultra)'
        : 'Chế độ: Trợ lý SQLite (Nhấn 🔑 để nhập Key)';
    }
    if (keyInput) {
      keyInput.value = getSessionOpenRouterKey();
    }
  };

  updateModeLabel();

  const togglePanel = (forceOpen) => {
    const isHidden = panel.classList.contains('d-none');
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : isHidden;
    panel.classList.toggle('d-none', !shouldOpen);
    toggleBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    if (shouldOpen) {
      input?.focus();
    }
  };

  toggleBtn?.addEventListener('click', () => togglePanel());
  closeBtn?.addEventListener('click', () => togglePanel(false));

  keyBtn?.addEventListener('click', () => {
    keyBox?.classList.toggle('d-none');
    if (!keyBox?.classList.contains('d-none')) {
      keyInput?.focus();
    }
  });

  saveKeyBtn?.addEventListener('click', () => {
    const val = (keyInput?.value || '').trim();
    setSessionOpenRouterKey(val);
    updateModeLabel();
    keyBox?.classList.add('d-none');
    showToast(
      val
        ? 'Đã lưu OpenRouter API Key tạm thời cho phiên làm việc này!'
        : 'Đã xóa OpenRouter API Key khỏi phiên làm việc.',
      'info'
    );
  });

  const appendBubble = (text, sender = 'bot', reasoning = null) => {
    const div = document.createElement('div');
    div.className = `vj-chat-bubble ${sender}`;
    // Dùng textContent / escapeHtml để chống XSS từ phản hồi của LLM
    const formatted = escapeHtml(text).replace(/\n/g, '<br>');
    let reasoningHtml = '';
    if (reasoning) {
      reasoningHtml = `
        <details class="small text-secondary mb-1 border-bottom pb-1">
          <summary class="fw-semibold" style="cursor: pointer; font-size: 0.72rem;">Xem quá trình suy luận (Reasoning)</summary>
          <div class="mt-1 fst-italic" style="font-size: 0.72rem;">${escapeHtml(reasoning).replace(/\n/g, '<br>')}</div>
        </details>
      `;
    }
    div.innerHTML = `${reasoningHtml}<div>${formatted}</div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  };

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = (input?.value || '').trim();
    if (!userText) return;

    input.value = '';
    appendBubble(userText, 'user');

    const loadingBubble = document.createElement('div');
    loadingBubble.className = 'vj-chat-bubble bot text-secondary';
    loadingBubble.innerHTML = '<span class="spinner-border spinner-border-sm text-danger me-2" role="status"></span>Đang suy nghĩ...';
    messagesEl.appendChild(loadingBubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    if (sendBtn) sendBtn.disabled = true;

    try {
      const result = await sendChatMessageToOpenRouter(userText);
      loadingBubble.remove();
      appendBubble(result.reply, 'bot', result.reasoning);
    } catch (err) {
      loadingBubble.remove();
      appendBubble(`⚠️ ${err.message}`, 'bot');
    } finally {
      if (sendBtn) sendBtn.disabled = false;
      input?.focus();
    }
  });
}
