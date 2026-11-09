/**
 * Xử lý trang Giỏ hàng & Gửi yêu cầu đặt dịch vụ (cart.html).
 * Lưu đơn đặt dịch vụ vào SQLite (bookings, booking_items) và tích hợp EmailJS + mailto dự phòng.
 */
import {
  initDB,
  runSql,
  queryAll,
  formatCurrency,
  formatDateVN
} from './db.js';
import {
  getCartItems,
  syncCartWithDatabase,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  calculateCartTotals
} from './cart.js';
import {
  sendBookingConfirmationEmail,
  isEmailJsConfigured,
  getActiveEmailConfig,
  saveCustomEmailConfig
} from './email.js';
import { showToast, escapeHtml } from './app.js';

/**
 * Sinh mã yêu cầu đặt dịch vụ duy nhất, ví dụ: VJ-20261109-4821
 */
function generateBookingId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VJ-${y}${m}${d}-${rand}`;
}

/**
 * Hiển thị lịch sử các yêu cầu đặt dịch vụ đã lưu trong SQLite
 */
async function renderSavedBookingsHistory() {
  const historyContainer = document.getElementById('saved-bookings-history');
  if (!historyContainer) return;

  try {
    const bookings = await queryAll('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5');
    if (bookings.length === 0) {
      historyContainer.innerHTML = `
        <p class="small text-secondary mb-0">Chưa có yêu cầu đặt dịch vụ nào được lưu trong cơ sở dữ liệu SQLite của trình duyệt.</p>
      `;
      return;
    }

    historyContainer.innerHTML = `
      <div class="table-responsive">
        <table class="table table-sm align-middle small mb-0">
          <thead class="table-light">
            <tr>
              <th>Mã yêu cầu</th>
              <th>Khách hàng</th>
              <th>Email</th>
              <th>Tổng tiền</th>
              <th>Trạng thái Email</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            ${bookings
              .map((b) => {
                let statusBadge = '<span class="badge bg-secondary">Chưa gửi tự động</span>';
                if (b.email_status === 'sent') {
                  statusBadge = '<span class="badge bg-success">Đã gửi EmailJS</span>';
                } else if (b.email_status === 'not_configured') {
                  statusBadge = '<span class="badge bg-warning text-dark">Chưa cấu hình EmailJS</span>';
                } else if (b.email_status === 'failed') {
                  statusBadge = '<span class="badge bg-danger">Lỗi gửi tự động</span>';
                }
                return `
                  <tr>
                    <td class="fw-bold text-danger">${escapeHtml(b.id)}</td>
                    <td>${escapeHtml(b.customer_name)}</td>
                    <td>${escapeHtml(b.customer_email)}</td>
                    <td class="fw-semibold">${formatCurrency(b.total_amount)}</td>
                    <td>${statusBadge}</td>
                    <td class="text-secondary">${new Date(b.created_at).toLocaleString('vi-VN')}</td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.warn('Không thể tải lịch sử bookings:', err);
  }
}

/**
 * Khởi tạo trang Giỏ hàng (cart.html)
 */
async function initCartPage() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  if (!cartItemsContainer) return;

  const emptyStateSection = document.getElementById('cart-empty-state');
  const activeCartSection = document.getElementById('cart-active-content');
  const bookingSuccessSection = document.getElementById('booking-success-section');
  const totalAmountEl = document.getElementById('cart-summary-total');
  const totalCountEl = document.getElementById('cart-summary-count');
  const clearAllBtn = document.getElementById('btn-confirm-clear-cart');
  const bookingForm = document.getElementById('customer-booking-form');
  const emailConfigStatusBadge = document.getElementById('emailjs-config-status');

  // Cập nhật trạng thái cấu hình EmailJS trên giao diện
  const refreshEmailConfigBadge = () => {
    if (!emailConfigStatusBadge) return;
    if (isEmailJsConfigured()) {
      emailConfigStatusBadge.className = 'badge bg-success-subtle text-success border border-success-subtle';
      emailConfigStatusBadge.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Đã cấu hình EmailJS';
    } else {
      emailConfigStatusBadge.className = 'badge bg-warning-subtle text-dark border border-warning-subtle';
      emailConfigStatusBadge.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i>Chưa cấu hình gửi email tự động';
    }
  };

  await initDB();
  const { removedCount } = await syncCartWithDatabase();
  if (removedCount > 0) {
    showToast(`Đã tự động loại bỏ ${removedCount} dịch vụ không còn tồn tại trong cơ sở dữ liệu.`, 'warning');
  }

  refreshEmailConfigBadge();
  await renderSavedBookingsHistory();

  const renderCartUI = () => {
    const items = getCartItems();
    const totals = calculateCartTotals(items);

    if (items.length === 0) {
      emptyStateSection?.classList.remove('d-none');
      activeCartSection?.classList.add('d-none');
      return;
    }

    emptyStateSection?.classList.add('d-none');
    activeCartSection?.classList.remove('d-none');

    if (totalAmountEl) totalAmountEl.textContent = formatCurrency(totals.totalAmount);
    if (totalCountEl) totalCountEl.textContent = `${totals.itemCount} dịch vụ (${totals.totalPassengersOrGuests} hành khách)`;

    cartItemsContainer.innerHTML = items
      .map((item) => {
        const s = item.snapshot || {};
        const lineTotal = Number(item.unitPrice) * Number(item.quantity);
        const isFlight = item.type === 'flight';

        return `
          <div class="card border shadow-sm mb-3" style="border-radius: 14px;">
            <div class="card-body p-3">
              <div class="row align-items-center g-3">
                <div class="col-12 col-md-6">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    ${
                      isFlight
                        ? '<span class="badge bg-primary-subtle text-primary border border-primary-subtle"><i class="bi bi-airplane-fill me-1"></i>Chuyến bay</span>'
                        : '<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="bi bi-compass-fill me-1"></i>Tour du lịch</span>'
                    }
                    <span class="small text-secondary">Mã: <strong>${escapeHtml(item.referenceId)}</strong></span>
                  </div>

                  <h3 class="h6 fw-bold mb-1">
                    <a href="${isFlight ? `flight-detail.html?id=${encodeURIComponent(item.referenceId)}` : `tour-detail.html?id=${encodeURIComponent(item.referenceId)}`}" class="text-dark">
                      ${escapeHtml(s.title || item.referenceId)}
                    </a>
                  </h3>

                  <div class="small text-secondary d-grid gap-1">
                    ${
                      isFlight
                        ? `
                          <div><i class="bi bi-building me-1 text-danger"></i>Hãng bay: <strong>${escapeHtml(s.airlineName)}</strong> • Hạng vé: <strong class="text-danger">${escapeHtml(item.fareLabel)}</strong></div>
                          <div><i class="bi bi-calendar3 me-1 text-danger"></i>Ngày khởi hành: <strong>${formatDateVN(s.departureDate)}</strong> (${escapeHtml(s.departureTime)} → ${escapeHtml(s.arrivalTime)})</div>
                        `
                        : `
                          <div><i class="bi bi-geo-alt me-1 text-danger"></i>Hành trình: <strong>${escapeHtml(s.origin)} → ${escapeHtml(s.destination)}</strong> (${s.durationDays}N${s.durationNights}Đ)</div>
                          <div><i class="bi bi-calendar3 me-1 text-danger"></i>Ngày khởi hành: <strong>${formatDateVN(item.departureDate || s.departureDate)}</strong> • Hãng bay: <strong>${escapeHtml(s.airlineName)}</strong></div>
                        `
                    }
                  </div>
                </div>

                <div class="col-6 col-md-3">
                  <label class="form-label small text-secondary mb-1" for="qty-${escapeHtml(item.id)}">
                    ${isFlight ? 'Số hành khách' : 'Số khách'}
                  </label>
                  <div class="input-group input-group-sm" style="max-width: 130px;">
                    <button class="btn btn-outline-secondary btn-qty-minus" type="button" data-item-id="${escapeHtml(item.id)}" aria-label="Giảm số lượng">−</button>
                    <input
                      type="number"
                      id="qty-${escapeHtml(item.id)}"
                      class="form-control text-center input-item-qty"
                      min="1"
                      max="30"
                      value="${item.quantity}"
                      data-item-id="${escapeHtml(item.id)}"
                    >
                    <button class="btn btn-outline-secondary btn-qty-plus" type="button" data-item-id="${escapeHtml(item.id)}" aria-label="Tăng số lượng">+</button>
                  </div>
                  <div class="small text-secondary mt-1">Đơn giá: ${formatCurrency(item.unitPrice)}</div>
                </div>

                <div class="col-6 col-md-3 text-end">
                  <div class="small text-secondary">Thành tiền</div>
                  <div class="price-highlight mb-2">${formatCurrency(lineTotal)}</div>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger btn-remove-cart-item"
                    data-item-id="${escapeHtml(item.id)}"
                    aria-label="Xóa dịch vụ này khỏi giỏ hàng"
                  >
                    <i class="bi bi-trash3 me-1"></i>Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    // Sự kiện tăng/giảm/thay đổi số lượng và xóa từng item
    cartItemsContainer.querySelectorAll('.btn-qty-minus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.itemId;
        const current = getCartItems().find((i) => i.id === id);
        if (current && current.quantity > 1) {
          updateCartItemQuantity(id, current.quantity - 1);
          renderCartUI();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.btn-qty-plus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.itemId;
        const current = getCartItems().find((i) => i.id === id);
        if (current) {
          updateCartItemQuantity(id, current.quantity + 1);
          renderCartUI();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.input-item-qty').forEach((inp) => {
      inp.addEventListener('change', () => {
        const id = inp.dataset.itemId;
        const val = Math.max(1, parseInt(inp.value || '1', 10) || 1);
        updateCartItemQuantity(id, val);
        renderCartUI();
      });
    });

    cartItemsContainer.querySelectorAll('.btn-remove-cart-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.itemId;
        removeCartItem(id);
        showToast('Đã xóa dịch vụ khỏi giỏ hàng.', 'info');
        renderCartUI();
      });
    });
  };

  // Xóa toàn bộ giỏ hàng sau khi xác nhận trên Modal
  clearAllBtn?.addEventListener('click', () => {
    clearCart();
    const modalEl = document.getElementById('clearCartConfirmModal');
    if (modalEl && window.bootstrap?.Modal) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }
    showToast('Đã xóa toàn bộ giỏ hàng.', 'info');
    renderCartUI();
  });

  // Lưu cấu hình EmailJS tùy chỉnh từ Modal (nếu người dùng muốn test trực tiếp)
  const emailConfigForm = document.getElementById('form-emailjs-config');
  if (emailConfigForm) {
    const cfg = getActiveEmailConfig();
    const pubInput = document.getElementById('cfg-emailjs-public-key');
    const srvInput = document.getElementById('cfg-emailjs-service-id');
    const tplInput = document.getElementById('cfg-emailjs-template-id');

    if (pubInput && cfg.EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') pubInput.value = cfg.EMAILJS_PUBLIC_KEY;
    if (srvInput && cfg.EMAILJS_SERVICE_ID !== 'YOUR_EMAILJS_SERVICE_ID') srvInput.value = cfg.EMAILJS_SERVICE_ID;
    if (tplInput && cfg.EMAILJS_TEMPLATE_ID !== 'YOUR_EMAILJS_TEMPLATE_ID') tplInput.value = cfg.EMAILJS_TEMPLATE_ID;

    emailConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveCustomEmailConfig({
        publicKey: pubInput?.value || '',
        serviceId: srvInput?.value || '',
        templateId: tplInput?.value || ''
      });
      refreshEmailConfigBadge();
      const modalEl = document.getElementById('emailConfigModal');
      if (modalEl && window.bootstrap?.Modal) {
        window.bootstrap.Modal.getInstance(modalEl)?.hide();
      }
      showToast('Đã lưu cấu hình EmailJS vào trình duyệt.', 'success');
    });
  }

  // Xử lý submit form Đăng ký đặt dịch vụ
  bookingForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const items = getCartItems();
    if (items.length === 0) {
      showToast('Giỏ hàng của bạn đang trống. Vui lòng chọn ít nhất một dịch vụ.', 'danger');
      return;
    }

    const nameInput = document.getElementById('cust-name');
    const emailInput = document.getElementById('cust-email');
    const phoneInput = document.getElementById('cust-phone');
    const noteInput = document.getElementById('cust-note');
    const termsCheckbox = document.getElementById('cust-terms');
    const formErrorAlert = document.getElementById('booking-form-error');
    const submitBtn = document.getElementById('btn-submit-booking');

    const fullName = (nameInput?.value || '').trim();
    const email = (emailInput?.value || '').trim();
    const phone = (phoneInput?.value || '').trim();
    const note = (noteInput?.value || '').trim();
    const agreed = Boolean(termsCheckbox?.checked);

    [nameInput, emailInput, phoneInput, termsCheckbox].forEach((el) => {
      if (el) {
        el.classList.remove('is-invalid-field');
        el.removeAttribute('aria-invalid');
      }
    });
    formErrorAlert?.classList.add('d-none');

    const errors = [];
    if (fullName.length < 2) {
      errors.push('Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự).');
      nameInput?.classList.add('is-invalid-field');
      nameInput?.setAttribute('aria-invalid', 'true');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Vui lòng nhập địa chỉ email đúng định dạng (ví dụ: ten@example.com).');
      emailInput?.classList.add('is-invalid-field');
      emailInput?.setAttribute('aria-invalid', 'true');
    }

    const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
    const cleanedPhone = phone.replace(/[\s.-]/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      errors.push('Vui lòng nhập số điện thoại hợp lệ (9–11 chữ số, bắt đầu bằng 0 hoặc +84).');
      phoneInput?.classList.add('is-invalid-field');
      phoneInput?.setAttribute('aria-invalid', 'true');
    }

    if (!agreed) {
      errors.push('Bạn cần tích chọn đồng ý với điều khoản dịch vụ trước khi gửi yêu cầu.');
      termsCheckbox?.classList.add('is-invalid-field');
      termsCheckbox?.setAttribute('aria-invalid', 'true');
    }

    if (errors.length > 0) {
      if (formErrorAlert) {
        formErrorAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${errors.map(escapeHtml).join('<br>')}`;
        formErrorAlert.classList.remove('d-none');
      }
      return;
    }

    const totals = calculateCartTotals(items);
    const bookingId = generateBookingId();
    const createdAt = new Date().toISOString();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang xử lý yêu cầu...';
    }

    try {
      // 1. Lưu vào bảng bookings trong SQLite
      await runSql(
        `INSERT INTO bookings (id, customer_name, customer_email, customer_phone, note, total_amount, created_at, email_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [bookingId, fullName, email, cleanedPhone, note, totals.totalAmount, createdAt, 'pending']
      );

      // 2. Lưu từng item vào bảng booking_items trong SQLite
      for (let idx = 0; idx < items.length; idx++) {
        const it = items[idx];
        const bookingItemId = `${bookingId}_IT${idx + 1}`;
        const selectedOpt = it.type === 'flight' ? it.fareLabel : `Khởi hành: ${it.departureDate}`;
        await runSql(
          `INSERT INTO booking_items (id, booking_id, item_type, reference_id, selected_option, quantity, unit_price, snapshot_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            bookingItemId,
            bookingId,
            it.type,
            it.referenceId,
            selectedOpt,
            Number(it.quantity) || 1,
            Number(it.unitPrice) || 0,
            JSON.stringify(it.snapshot || {})
          ]
        );
      }

      const bookingRecord = {
        id: bookingId,
        customer_name: fullName,
        customer_email: email,
        customer_phone: cleanedPhone,
        note,
        total_amount: totals.totalAmount,
        created_at: createdAt
      };

      // 3. Thử gửi email xác nhận qua EmailJS (nếu đã cấu hình)
      const emailResult = await sendBookingConfirmationEmail(bookingRecord, items);

      // 4. Cập nhật trạng thái email trung thực vào SQLite
      await runSql('UPDATE bookings SET email_status = ? WHERE id = ?', [emailResult.status, bookingId]);

      // 5. Xóa giỏ hàng sau khi đã lưu SQLite thành công
      clearCart();
      await renderSavedBookingsHistory();

      // 6. Hiển thị màn hình hoàn thành
      activeCartSection?.classList.add('d-none');
      emptyStateSection?.classList.add('d-none');

      if (bookingSuccessSection) {
        const statusAlertClass = emailResult.sent ? 'alert-success' : 'alert-warning';
        const statusTitle = emailResult.sent
          ? 'Đã gửi email xác nhận tự động thành công!'
          : emailResult.status === 'not_configured'
          ? 'Chưa cấu hình gửi email tự động (EmailJS)'
          : 'Gửi email tự động không thành công';

        bookingSuccessSection.innerHTML = `
          <div class="card border shadow-sm p-4 p-md-5" style="border-radius: 16px;">
            <div class="text-center mb-4">
              <div class="d-inline-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success mb-3" style="width: 68px; height: 68px;">
                <i class="bi bi-check2-all fs-1"></i>
              </div>
              <h2 class="h3 fw-bold">Đã tiếp nhận yêu cầu đặt dịch vụ!</h2>
              <p class="text-secondary mb-0">
                Yêu cầu của bạn đã được lưu vào cơ sở dữ liệu SQLite trong trình duyệt.
              </p>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-12 col-md-6">
                <div class="p-3 rounded-3 bg-light border h-100">
                  <div class="small text-secondary">Mã yêu cầu đặt dịch vụ</div>
                  <div class="fs-4 fw-bold text-danger">${escapeHtml(bookingId)}</div>
                  <div class="small text-secondary mt-2">Khách hàng: <strong class="text-dark">${escapeHtml(fullName)}</strong></div>
                  <div class="small text-secondary">Email: <strong class="text-dark">${escapeHtml(email)}</strong></div>
                  <div class="small text-secondary">Số điện thoại: <strong class="text-dark">${escapeHtml(cleanedPhone)}</strong></div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="p-3 rounded-3 bg-light border h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div class="small text-secondary">Tổng chi phí tham khảo</div>
                    <div class="price-highlight fs-3">${formatCurrency(totals.totalAmount)}</div>
                  </div>
                  <div class="small text-secondary mt-2">
                    <i class="bi bi-info-circle me-1"></i>Đây là yêu cầu đăng ký dịch vụ trên bản demo, chưa phải vé máy bay điện tử hay xác nhận giữ chỗ chính thức.
                  </div>
                </div>
              </div>
            </div>

            <!-- Trạng thái gửi Email trung thực -->
            <div class="alert ${statusAlertClass} d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <div class="fw-bold mb-1">
                  <i class="bi ${emailResult.sent ? 'bi-envelope-check-fill' : 'bi-envelope-exclamation-fill'} me-1"></i>
                  ${escapeHtml(statusTitle)}
                </div>
                <div class="small">${escapeHtml(emailResult.message)}</div>
              </div>
              <a href="${escapeHtml(emailResult.mailtoUrl)}" class="btn btn-sm btn-dark flex-shrink-0">
                <i class="bi bi-envelope-paper me-1"></i>Mở ứng dụng Email (mailto:)
              </a>
            </div>

            <div class="d-flex flex-wrap justify-content-center gap-2 mt-3">
              <a href="index.html" class="btn btn-vj-primary">
                <i class="bi bi-house-door me-1"></i>Về trang chủ
              </a>
              <a href="flights.html" class="btn btn-vj-outline">
                Tìm thêm chuyến bay
              </a>
              <a href="tours.html" class="btn btn-vj-outline">
                Khám phá thêm tour
              </a>
            </div>
          </div>
        `;
        bookingSuccessSection.classList.remove('d-none');
        bookingSuccessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      showToast(`Đã tạo yêu cầu đặt dịch vụ #${bookingId} thành công!`, 'success');
    } catch (err) {
      console.error('Lỗi khi lưu đơn đặt dịch vụ:', err);
      showToast('Không thể lưu yêu cầu vào cơ sở dữ liệu: ' + err.message, 'danger');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send-check-fill me-1"></i>Đăng ký đặt dịch vụ';
      }
    }
  });

  renderCartUI();
}

document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
});
