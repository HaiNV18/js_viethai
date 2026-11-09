/**
 * Module khởi tạo giao diện dùng chung (Header, Footer, Toast, Accessible Validation)
 * và xử lý logic Trang chủ (index.html).
 */
import {
  initDB,
  queryAll,
  formatCurrency,
  formatDateVN,
  getFutureDateISO,
  resetDatabase,
  exportSqliteFile
} from './db.js';
import { updateCartBadge, syncCartWithDatabase } from './cart.js';
import { initWeatherWidget } from './weather.js';

/**
 * Hiển thị thông báo Toast góc dưới bên phải (thay thế hoàn toàn alert())
 */
export function showToast(message, type = 'success') {
  let container = document.getElementById('vj-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'vj-toast-container';
    container.className = 'vj-toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const iconMap = {
    success: 'bi-check-circle-fill text-success',
    danger: 'bi-exclamation-triangle-fill text-danger',
    warning: 'bi-info-circle-fill text-warning',
    info: 'bi-info-circle-fill text-primary'
  };

  const toastEl = document.createElement('div');
  toastEl.className = 'card border shadow-sm mb-2';
  toastEl.style.borderRadius = '12px';
  toastEl.innerHTML = `
    <div class="card-body py-2 px-3 d-flex align-items-center justify-content-between gap-2">
      <div class="d-flex align-items-center gap-2">
        <i class="bi ${iconMap[type] || iconMap.info} fs-5"></i>
        <span class="small fw-semibold text-dark">${escapeHtml(message)}</span>
      </div>
      <button type="button" class="btn-close btn-sm" aria-label="Đóng thông báo"></button>
    </div>
  `;

  toastEl.querySelector('.btn-close')?.addEventListener('click', () => toastEl.remove());
  container.appendChild(toastEl);

  setTimeout(() => {
    if (toastEl.isConnected) toastEl.remove();
  }, 4200);
}

/**
 * Escape HTML để phòng chống XSS khi render dữ liệu
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Render Header và Footer thống nhất trên mọi trang
 */
export function renderSharedLayout() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const isHome = path === '' || path === 'index.html';
  const isFlights = path === 'flights.html' || path === 'flight-detail.html';
  const isTours = path === 'tours.html' || path === 'tour-detail.html';
  const isCart = path === 'cart.html';

  const headerPlaceholder = document.getElementById('site-header');
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = `
      <div class="demo-banner-bar">
        <div class="container d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>
            <i class="bi bi-info-circle-fill me-1"></i>
            <strong>Bản mẫu minh họa (Prototype):</strong> Thông tin chuyến bay, tour và giá vé chỉ mang tính chất tham khảo, không phải hệ thống đặt vé thương mại thật.
          </span>
          <span class="badge-demo">SQLite WebAssembly (sql.js)</span>
        </div>
      </div>
      <header class="site-header sticky-top">
        <nav class="navbar navbar-expand-lg py-2" aria-label="Điều hướng chính">
          <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
              <img src="assets/images/logo/logo-vietjet.png" alt="Logo Vietjet" class="brand-logo-img" onerror="this.style.display='none'">
              <span class="brand-text">Vietjet</span>
            </a>

            <div class="d-flex align-items-center gap-2 order-lg-3">
              <a href="cart.html" class="cart-nav-btn ${isCart ? 'active' : ''}" aria-label="Xem giỏ hàng">
                <i class="bi bi-bag-check-fill fs-5 text-danger"></i>
                <span class="d-none d-sm-inline">Giỏ hàng</span>
                <span class="cart-badge" data-cart-badge>0</span>
              </a>
              <button
                class="navbar-toggler border-0 shadow-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavbarCollapse"
                aria-controls="mainNavbarCollapse"
                aria-expanded="false"
                aria-label="Mở menu điều hướng"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
            </div>

            <div class="collapse navbar-collapse order-lg-2" id="mainNavbarCollapse">
              <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1">
                <li class="nav-item">
                  <a class="nav-link ${isHome ? 'active' : ''}" href="index.html">
                    <i class="bi bi-house-door me-1"></i>Trang chủ
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link ${isFlights ? 'active' : ''}" href="flights.html">
                    <i class="bi bi-airplane me-1"></i>Chuyến bay
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link ${isTours ? 'active' : ''}" href="tours.html">
                    <i class="bi bi-compass me-1"></i>Tour du lịch
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    `;
  }

  const footerPlaceholder = document.getElementById('site-footer');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-4">
              <div class="d-flex align-items-center gap-2 mb-2">
                <img src="assets/images/logo/logo-vietjet.png" alt="Logo Vietjet" class="brand-logo-img" onerror="this.style.display='none'">
                <span class="brand-text">Vietjet</span>
              </div>
              <p class="small mb-3">
                Website demo tìm kiếm chuyến bay và đặt tour du lịch được xây dựng bằng HTML5, CSS3, Vanilla JavaScript và cơ sở dữ liệu SQLite (sql.js WebAssembly) lưu trữ ngay trên trình duyệt.
              </p>
              <span class="badge-demo">Thông tin và giá mang tính minh họa</span>
            </div>

            <div class="col-6 col-lg-2">
              <h6 class="text-dark fw-bold mb-3">Điều hướng</h6>
              <ul class="list-unstyled small d-grid gap-2">
                <li><a href="index.html" class="text-secondary">Trang chủ</a></li>
                <li><a href="flights.html" class="text-secondary">Danh sách chuyến bay</a></li>
                <li><a href="tours.html" class="text-secondary">Danh sách tour</a></li>
                <li><a href="cart.html" class="text-secondary">Giỏ hàng & Đăng ký</a></li>
              </ul>
            </div>

            <div class="col-6 col-lg-3">
              <h6 class="text-dark fw-bold mb-3">Thông tin liên hệ (Demo)</h6>
              <ul class="list-unstyled small d-grid gap-2 mb-0">
                <li><i class="bi bi-geo-alt me-1 text-danger"></i> Khu vực thực hành Frontend Demo (Không phải văn phòng hãng)</li>
                <li><i class="bi bi-envelope me-1 text-danger"></i> Email mẫu: nvhai061993@gmail.com (Cấu hình qua EmailJS)</li>
                <li><i class="bi bi-clock me-1 text-danger"></i> Hỗ trợ demo trực tuyến trên trình duyệt</li>
              </ul>
            </div>

            <div class="col-lg-3">
              <h6 class="text-dark fw-bold mb-3">Quản lý dữ liệu SQLite</h6>
              <p class="small mb-2">
                Dữ liệu được lưu trong IndexedDB của trình duyệt. Bạn có thể tải file <code>.sqlite</code> hoặc khôi phục dữ liệu mẫu ban đầu:
              </p>
              <div class="d-flex flex-wrap gap-2">
                <button type="button" id="btn-export-sqlite" class="btn btn-sm btn-vj-outline">
                  <i class="bi bi-download me-1"></i>Tải file .sqlite
                </button>
                <button type="button" id="btn-reset-sqlite" class="btn btn-sm btn-vj-outline text-danger">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Reset dữ liệu mẫu
                </button>
              </div>
            </div>
          </div>

          <hr class="my-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-center small gap-2">
            <div>© ${new Date().getFullYear()} Vietjet Travel Demo Project. Chỉ phục vụ mục đích học tập và trình diễn kỹ thuật.</div>
            <div>Tên hãng hàng không và logo minh họa thuộc bản quyền của từng đơn vị tương ứng.</div>
          </div>
        </div>
      </footer>
    `;

    document.getElementById('btn-export-sqlite')?.addEventListener('click', async () => {
      try {
        await exportSqliteFile();
        showToast('Đã xuất file cơ sở dữ liệu .sqlite thành công!', 'success');
      } catch (err) {
        showToast('Không thể xuất file SQLite: ' + err.message, 'danger');
      }
    });

    document.getElementById('btn-reset-sqlite')?.addEventListener('click', async () => {
      try {
        await resetDatabase();
        showToast('Đã khôi phục dữ liệu mẫu SQLite thành công! Đang tải lại...', 'success');
        setTimeout(() => window.location.reload(), 900);
      } catch (err) {
        showToast('Lỗi khi khôi phục dữ liệu mẫu: ' + err.message, 'danger');
      }
    });
  }

  updateCartBadge();
}

/**
 * Modern Web Guidance (accessible-error-announcement):
 * Đồng bộ trạng thái aria-invalid với :user-invalid và cung cấp fallback bằng WeakMap
 */
export function setupAccessibleFormValidation() {
  const updateAriaState = (event) => {
    const input = event.target;
    if (!input || !input.matches?.('input, textarea, select')) return;

    let isUserInvalid = false;
    try {
      isUserInvalid = input.matches(':user-invalid');
    } catch (_) {
      isUserInvalid = !input.checkValidity();
    }

    if (isUserInvalid) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  };

  document.addEventListener('blur', updateAriaState, true);
  document.addEventListener('focus', updateAriaState, true);
  document.addEventListener('input', (event) => {
    const input = event.target;
    if (!input || !input.matches?.('input, textarea, select')) return;
    if (input.getAttribute('aria-invalid') === 'true') {
      updateAriaState(event);
    }
  });

  // Fallback nếu trình duyệt chưa hỗ trợ selector(:user-invalid)
  const UserInvalidFallback = (() => {
    const dirtyState = new WeakMap();

    const updateState = (input) => {
      const isValid = input.checkValidity();
      input.classList.toggle('user-invalid-fallback', !isValid);
      input.classList.toggle('user-valid-fallback', isValid);
      if (!isValid) {
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.removeAttribute('aria-invalid');
      }
    };

    const handleEvent = (event) => {
      const input = event.target;
      if (event.type === 'reset' && input?.matches?.('form')) {
        const controls = input.elements || [];
        for (const control of controls) {
          dirtyState.delete(control);
          control.classList.remove('user-invalid-fallback', 'user-valid-fallback');
          control.removeAttribute('aria-invalid');
        }
        return;
      }
      if (!input?.matches?.('input, textarea, select')) return;

      if (event.type === 'input' || event.type === 'change') {
        const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
        state.hasInteracted = true;
        dirtyState.set(input, state);
        if (state.hasBlurred) updateState(input);
      } else if (event.type === 'blur') {
        const state = dirtyState.get(input) || { hasInteracted: false, hasBlurred: false };
        state.hasBlurred = true;
        dirtyState.set(input, state);
        if (state.hasInteracted) updateState(input);
      }
    };

    const init = () => {
      if (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('selector(:user-invalid)')) return;
      document.addEventListener('blur', handleEvent, true);
      document.addEventListener('input', handleEvent, true);
      document.addEventListener('change', handleEvent, true);
      document.addEventListener('reset', handleEvent, true);
    };

    return { init };
  })();

  UserInvalidFallback.init();
}

/**
 * Khởi tạo dữ liệu và sự kiện trên Trang chủ (index.html)
 */
async function initHomePage() {
  const searchForm = document.getElementById('home-search-form');
  if (!searchForm) return;

  const originSelect = document.getElementById('search-origin');
  const destSelect = document.getElementById('search-destination');
  const departureInput = document.getElementById('search-departure-date');
  const returnInput = document.getElementById('search-return-date');
  const passengersInput = document.getElementById('search-passengers');
  const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
  const formAlert = document.getElementById('home-search-error');

  const todayISO = getFutureDateISO(0);
  if (departureInput) {
    departureInput.min = todayISO;
    departureInput.value = getFutureDateISO(2);
  }
  if (returnInput) {
    returnInput.min = todayISO;
    returnInput.value = getFutureDateISO(5);
  }

  // Điều khiển bật/tắt trường Ngày về theo Loại hành trình
  const updateReturnDateState = () => {
    const selectedTrip = document.querySelector('input[name="tripType"]:checked')?.value || 'roundtrip';
    if (!returnInput) return;
    if (selectedTrip === 'oneway') {
      returnInput.disabled = true;
      returnInput.required = false;
      returnInput.value = '';
      returnInput.classList.remove('is-invalid-field');
      returnInput.removeAttribute('aria-invalid');
    } else {
      returnInput.disabled = false;
      returnInput.required = true;
      if (!returnInput.value) {
        returnInput.value = getFutureDateISO(5);
      }
    }
  };

  tripTypeRadios.forEach((radio) => {
    radio.addEventListener('change', updateReturnDateState);
  });
  updateReturnDateState();

  try {
    await initDB();

    // 1. Nạp danh sách sân bay từ bảng flights
    const origins = await queryAll(
      'SELECT DISTINCT origin_code as code, origin_name as name FROM flights ORDER BY origin_name'
    );
    const destinations = await queryAll(
      'SELECT DISTINCT destination_code as code, destination_name as name FROM flights ORDER BY destination_name'
    );

    if (originSelect && origins.length > 0) {
      originSelect.innerHTML =
        '<option value="">-- Chọn điểm khởi hành --</option>' +
        origins
          .map((o) => `<option value="${escapeHtml(o.code)}" ${o.code === 'SGN' ? 'selected' : ''}>${escapeHtml(o.name)}</option>`)
          .join('');
    }

    if (destSelect && destinations.length > 0) {
      destSelect.innerHTML =
        '<option value="">-- Chọn điểm đến --</option>' +
        destinations
          .map((d) => `<option value="${escapeHtml(d.code)}" ${d.code === 'HAN' ? 'selected' : ''}>${escapeHtml(d.name)}</option>`)
          .join('');
    }

    // 2. Render 8 Tour nổi bật
    const toursGrid = document.getElementById('featured-tours-grid');
    if (toursGrid) {
      const featuredTours = await queryAll(
        `SELECT t.*, a.name as airline_name
         FROM tours t
         LEFT JOIN airlines a ON t.airline_id = a.id
         WHERE t.featured = 1
         ORDER BY t.id ASC
         LIMIT 8`
      );

      if (featuredTours.length === 0) {
        toursGrid.innerHTML = `<div class="col-12"><div class="alert alert-light border text-center">Hiện chưa có tour nổi bật.</div></div>`;
      } else {
        toursGrid.innerHTML = featuredTours
          .map(
            (tour) => `
            <div class="col-12 col-sm-6 col-lg-3">
              <article class="vj-card">
                <a href="tour-detail.html?id=${encodeURIComponent(tour.id)}" class="tour-thumb-wrapper d-block" aria-label="Xem chi tiết ${escapeHtml(tour.title)}">
                  <img src="${escapeHtml(tour.thumbnail)}" alt="${escapeHtml(tour.title)}" width="600" height="400" loading="lazy">
                </a>
                <div class="p-3 d-flex flex-column flex-grow-1">
                  <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <span class="badge bg-light text-dark border">
                      <i class="bi bi-geo-alt-fill text-danger me-1"></i>${escapeHtml(tour.destination)}
                    </span>
                    <span class="small text-secondary fw-semibold">
                      <i class="bi bi-clock me-1"></i>${tour.duration_days}N${tour.duration_nights}Đ
                    </span>
                  </div>

                  <h3 class="h6 fw-bold mb-2">
                    <a href="tour-detail.html?id=${encodeURIComponent(tour.id)}" class="text-dark">
                      ${escapeHtml(tour.title)}
                    </a>
                  </h3>

                  <div class="small text-secondary mb-3">
                    <div><i class="bi bi-airplane me-1 text-danger"></i>Hãng bay: <strong>${escapeHtml(tour.airline_name || 'Đang cập nhật')}</strong></div>
                    <div><i class="bi bi-calendar3 me-1 text-danger"></i>Khởi hành: ${formatDateVN(tour.departure_date)}</div>
                  </div>

                  <div class="mt-auto pt-2 border-top d-flex align-items-end justify-content-between gap-2">
                    <div>
                      <div class="small text-secondary">Giá tham khảo/khách</div>
                      <div class="price-highlight">${formatCurrency(tour.price)}</div>
                    </div>
                    <a href="tour-detail.html?id=${encodeURIComponent(tour.id)}" class="btn btn-sm btn-vj-primary">
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </article>
            </div>
          `
          )
          .join('');
      }
    }

    // 3. Render danh sách Hãng hàng không
    const airlinesGrid = document.getElementById('airlines-grid');
    if (airlinesGrid) {
      const airlines = await queryAll('SELECT * FROM airlines WHERE is_active = 1 ORDER BY id ASC');
      airlinesGrid.innerHTML = airlines
        .map(
          (airline) => `
          <div class="col-6 col-md-4 col-lg-2">
            <a href="flights.html?airline=${encodeURIComponent(airline.id)}" class="airline-card" aria-label="Lọc chuyến bay hãng ${escapeHtml(airline.name)}">
              <img src="${escapeHtml(airline.logo)}" alt="Logo minh họa ${escapeHtml(airline.name)}" loading="lazy">
              <span class="small fw-bold text-dark mt-2">${escapeHtml(airline.name)}</span>
              <span class="text-secondary" style="font-size: 0.75rem;">Xem chuyến bay →</span>
            </a>
          </div>
        `
        )
        .join('');
    }
  } catch (err) {
    console.error('Lỗi khởi tạo dữ liệu Trang chủ:', err);
    const toursGrid = document.getElementById('featured-tours-grid');
    if (toursGrid) {
      toursGrid.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            Không thể tải dữ liệu từ cơ sở dữ liệu SQLite. Vui lòng thử tải lại trang.
          </div>
        </div>
      `;
    }
  }

  // Xử lý submit form tìm kiếm chuyến bay
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formAlert) {
      formAlert.classList.add('d-none');
      formAlert.textContent = '';
    }

    const tripType = document.querySelector('input[name="tripType"]:checked')?.value || 'roundtrip';
    const origin = originSelect?.value.trim() || '';
    const destination = destSelect?.value.trim() || '';
    const departureDate = departureInput?.value.trim() || '';
    const returnDate = returnInput?.value.trim() || '';
    const passengers = parseInt(passengersInput?.value || '1', 10);

    const errors = [];
    [originSelect, destSelect, departureInput, returnInput, passengersInput].forEach((el) => {
      if (el) {
        el.classList.remove('is-invalid-field');
        el.removeAttribute('aria-invalid');
      }
    });

    if (!origin) {
      errors.push('Vui lòng chọn điểm khởi hành.');
      originSelect?.classList.add('is-invalid-field');
      originSelect?.setAttribute('aria-invalid', 'true');
    }
    if (!destination) {
      errors.push('Vui lòng chọn điểm đến.');
      destSelect?.classList.add('is-invalid-field');
      destSelect?.setAttribute('aria-invalid', 'true');
    }
    if (origin && destination && origin === destination) {
      errors.push('Điểm khởi hành và điểm đến không được trùng nhau.');
      destSelect?.classList.add('is-invalid-field');
      destSelect?.setAttribute('aria-invalid', 'true');
    }
    if (!departureDate) {
      errors.push('Vui lòng chọn ngày khởi hành.');
      departureInput?.classList.add('is-invalid-field');
      departureInput?.setAttribute('aria-invalid', 'true');
    } else if (departureDate < todayISO) {
      errors.push('Ngày khởi hành không được ở trong quá khứ.');
      departureInput?.classList.add('is-invalid-field');
      departureInput?.setAttribute('aria-invalid', 'true');
    }

    if (tripType === 'roundtrip') {
      if (!returnDate) {
        errors.push('Vui lòng chọn ngày về cho hành trình khứ hồi.');
        returnInput?.classList.add('is-invalid-field');
        returnInput?.setAttribute('aria-invalid', 'true');
      } else if (returnDate < todayISO) {
        errors.push('Ngày về không được ở trong quá khứ.');
        returnInput?.classList.add('is-invalid-field');
        returnInput?.setAttribute('aria-invalid', 'true');
      } else if (departureDate && returnDate < departureDate) {
        errors.push('Ngày về không được trước ngày khởi hành.');
        returnInput?.classList.add('is-invalid-field');
        returnInput?.setAttribute('aria-invalid', 'true');
      }
    }

    if (Number.isNaN(passengers) || passengers < 1) {
      errors.push('Số lượng hành khách phải tối thiểu là 1.');
      passengersInput?.classList.add('is-invalid-field');
      passengersInput?.setAttribute('aria-invalid', 'true');
    }

    if (errors.length > 0) {
      if (formAlert) {
        formAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${errors.map(escapeHtml).join(' ')}`;
        formAlert.classList.remove('d-none');
      }
      return;
    }

    const params = new URLSearchParams();
    params.set('tripType', tripType);
    params.set('origin', origin);
    params.set('destination', destination);
    params.set('departureDate', departureDate);
    if (tripType === 'roundtrip' && returnDate) {
      params.set('returnDate', returnDate);
    }
    params.set('passengers', String(passengers));

    window.location.href = `flights.html?${params.toString()}`;
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  renderSharedLayout();
  setupAccessibleFormValidation();
  try {
    await initDB();
    await syncCartWithDatabase();
  } catch (err) {
    console.warn('Khởi tạo DB/Cart cảnh báo:', err);
  }
  await initHomePage();
  initWeatherWidget();
});
