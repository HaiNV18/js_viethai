/**
 * Xử lý trang Danh sách tour (tours.html) và Chi tiết tour (tour-detail.html).
 * Dữ liệu truy vấn trực tiếp từ SQLite (sql.js).
 */
import {
  initDB,
  queryAll,
  queryOne,
  formatCurrency,
  formatDateVN,
  formatDuration
} from './db.js';
import { addTourToCart } from './cart.js';
import { showToast, escapeHtml } from './app.js';

function getTourTimeSlot(timeStr) {
  if (!timeStr) return 'morning';
  const hour = parseInt(timeStr.split(':')[0], 10) || 0;
  if (hour < 11) return 'morning';
  if (hour < 14) return 'noon';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Khởi tạo trang Danh sách Tour (tours.html)
 */
async function initToursListPage() {
  const listContainer = document.getElementById('tours-list-container');
  if (!listContainer) return;

  const countEl = document.getElementById('tours-result-count');
  const params = new URLSearchParams(window.location.search);

  const state = {
    sortPrice: params.get('sort') || 'asc',
    destination: params.get('destination') || '',
    airlines: params.get('airline') ? [params.get('airline')] : [],
    timeSlots: []
  };

  try {
    await initDB();
    const airlines = await queryAll('SELECT * FROM airlines WHERE is_active = 1 ORDER BY id ASC');
    const allTours = await queryAll(
      `SELECT t.*, a.name as airline_name, a.logo as airline_logo
       FROM tours t
       LEFT JOIN airlines a ON t.airline_id = a.id
       ORDER BY t.id ASC`
    );
    const destinations = await queryAll('SELECT DISTINCT destination FROM tours ORDER BY destination ASC');

    // Render checkbox hãng hàng không cho cả Desktop & Mobile Offcanvas
    document.querySelectorAll('[data-tour-airline-filter]').forEach((container) => {
      container.innerHTML = airlines
        .map(
          (a) => `
          <div class="form-check mb-1">
            <input
              class="form-check-input tour-filter-airline"
              type="checkbox"
              value="${escapeHtml(a.id)}"
              id="chk-tour-airline-${container.dataset.tourAirlineFilter}-${escapeHtml(a.id)}"
              ${state.airlines.includes(a.id) ? 'checked' : ''}
            >
            <label class="form-check-label small" for="chk-tour-airline-${container.dataset.tourAirlineFilter}-${escapeHtml(a.id)}">
              ${escapeHtml(a.name)}
            </label>
          </div>
        `
        )
        .join('');
    });

    // Render dropdown điểm đến
    document.querySelectorAll('.tour-filter-destination').forEach((sel) => {
      sel.innerHTML =
        '<option value="">Tất cả điểm đến</option>' +
        destinations
          .map(
            (d) =>
              `<option value="${escapeHtml(d.destination)}" ${state.destination === d.destination ? 'selected' : ''}>${escapeHtml(d.destination)}</option>`
          )
          .join('');
    });

    const syncTourControls = () => {
      document.querySelectorAll('.tour-filter-sort').forEach((el) => (el.value = state.sortPrice));
      document.querySelectorAll('.tour-filter-destination').forEach((el) => (el.value = state.destination));
      document.querySelectorAll('.tour-filter-airline').forEach((el) => {
        el.checked = state.airlines.includes(el.value);
      });
      document.querySelectorAll('.tour-filter-timeslot').forEach((el) => {
        el.checked = state.timeSlots.includes(el.value);
      });
    };

    const renderTours = () => {
      const filtered = allTours.filter((tour) => {
        if (state.destination && tour.destination !== state.destination) return false;
        if (state.airlines.length > 0 && !state.airlines.includes(tour.airline_id)) return false;
        if (state.timeSlots.length > 0) {
          const slot = getTourTimeSlot(tour.departure_time);
          if (!state.timeSlots.includes(slot)) return false;
        }
        return true;
      });

      filtered.sort((a, b) => {
        const pA = Number(a.price) || 0;
        const pB = Number(b.price) || 0;
        return state.sortPrice === 'desc' ? pB - pA : pA - pB;
      });

      if (countEl) {
        countEl.textContent = String(filtered.length);
      }

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="col-12">
            <div class="card border-0 shadow-sm p-5 text-center">
              <div class="text-danger fs-1 mb-2"><i class="bi bi-compass"></i></div>
              <h3 class="h5 fw-bold">Không tìm thấy tour phù hợp</h3>
              <p class="text-secondary small mb-3">Hãy thử bỏ bớt điều kiện lọc hãng hàng không hoặc khung giờ khởi hành.</p>
              <div>
                <button type="button" class="btn btn-sm btn-vj-primary" id="btn-empty-reset-tours">
                  <i class="bi bi-arrow-counterclockwise me-1"></i>Xóa bộ lọc tour
                </button>
              </div>
            </div>
          </div>
        `;
        document.getElementById('btn-empty-reset-tours')?.addEventListener('click', resetTourFilters);
        return;
      }

      listContainer.innerHTML = filtered
        .map(
          (tour) => `
          <div class="col-12 col-md-6">
            <article class="vj-card">
              <a href="tour-detail.html?id=${encodeURIComponent(tour.id)}" class="tour-thumb-wrapper d-block" aria-label="Xem chi tiết ${escapeHtml(tour.title)}">
                <img src="${escapeHtml(tour.thumbnail)}" alt="${escapeHtml(tour.title)}" width="600" height="400" loading="lazy">
              </a>
              <div class="p-3 d-flex flex-column flex-grow-1">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                  <span class="badge bg-light text-dark border">
                    <i class="bi bi-geo-alt-fill text-danger me-1"></i>${escapeHtml(tour.origin)} → ${escapeHtml(tour.destination)}
                  </span>
                  <span class="badge bg-danger-subtle text-danger border border-danger-subtle">
                    ${tour.duration_days} ngày ${tour.duration_nights} đêm
                  </span>
                </div>

                <h3 class="h6 fw-bold mb-2">
                  <a href="tour-detail.html?id=${encodeURIComponent(tour.id)}" class="text-dark">
                    ${escapeHtml(tour.title)}
                  </a>
                </h3>

                <div class="small text-secondary mb-2 d-grid gap-1">
                  <div>
                    <i class="bi bi-airplane me-1 text-danger"></i>Hãng hàng không: <strong>${escapeHtml(tour.airline_name)}</strong>
                  </div>
                  <div>
                    <i class="bi bi-calendar-event me-1 text-danger"></i>Khởi hành: <strong>${formatDateVN(tour.departure_date)}</strong> lúc <strong>${escapeHtml(tour.departure_time)}</strong>
                  </div>
                  <div class="text-truncate" title="${escapeHtml(tour.included_services)}">
                    <i class="bi bi-check2-circle me-1 text-success"></i>Dịch vụ: ${escapeHtml(tour.included_services)}
                  </div>
                </div>

                <div class="mt-auto pt-3 border-top d-flex align-items-end justify-content-between gap-2">
                  <div>
                    <div class="small text-secondary">Giá tham khảo / khách</div>
                    <div class="price-highlight">${formatCurrency(tour.price)}</div>
                  </div>
                  <a href="tour-detail.html?id=${encodeURIComponent(tour.id)}" class="btn btn-vj-primary btn-sm px-3">
                    Xem chi tiết <i class="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </article>
          </div>
        `
        )
        .join('');
    };

    const resetTourFilters = () => {
      state.sortPrice = 'asc';
      state.destination = '';
      state.airlines = [];
      state.timeSlots = [];
      window.history.replaceState({}, '', 'tours.html');
      syncTourControls();
      renderTours();
    };

    document.addEventListener('change', (e) => {
      const t = e.target;
      if (!t) return;

      if (t.classList.contains('tour-filter-sort')) {
        state.sortPrice = t.value;
        syncTourControls();
        renderTours();
      } else if (t.classList.contains('tour-filter-destination')) {
        state.destination = t.value;
        syncTourControls();
        renderTours();
      } else if (t.classList.contains('tour-filter-airline')) {
        const val = t.value;
        if (t.checked && !state.airlines.includes(val)) {
          state.airlines.push(val);
        } else if (!t.checked) {
          state.airlines = state.airlines.filter((id) => id !== val);
        }
        syncTourControls();
        renderTours();
      } else if (t.classList.contains('tour-filter-timeslot')) {
        const val = t.value;
        if (t.checked && !state.timeSlots.includes(val)) {
          state.timeSlots.push(val);
        } else if (!t.checked) {
          state.timeSlots = state.timeSlots.filter((s) => s !== val);
        }
        syncTourControls();
        renderTours();
      }
    });

    document.querySelectorAll('.btn-reset-tour-filters').forEach((btn) => {
      btn.addEventListener('click', resetTourFilters);
    });

    syncTourControls();
    renderTours();
  } catch (err) {
    console.error('Lỗi tải danh sách tour:', err);
    listContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">Không thể tải danh sách tour từ SQLite: ${escapeHtml(err.message)}</div>
      </div>
    `;
  }
}

/**
 * Khởi tạo trang Chi tiết Tour (tour-detail.html)
 */
async function initTourDetailPage() {
  const detailContainer = document.getElementById('tour-detail-container');
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const tourId = (params.get('id') || '').trim();

  if (!tourId) {
    detailContainer.innerHTML = `
      <div class="card border-0 shadow-sm p-5 text-center">
        <div class="text-danger fs-1 mb-2"><i class="bi bi-exclamation-circle"></i></div>
        <h2 class="h4 fw-bold">Thiếu mã tour du lịch</h2>
        <p class="text-secondary mb-4">Không tìm thấy tham số ID của tour trên đường dẫn.</p>
        <div>
          <a href="tours.html" class="btn btn-vj-primary"><i class="bi bi-arrow-left me-1"></i>Quay lại danh sách tour</a>
        </div>
      </div>
    `;
    return;
  }

  try {
    await initDB();
    const tour = await queryOne(
      `SELECT t.*, a.name as airline_name, a.logo as airline_logo
       FROM tours t
       LEFT JOIN airlines a ON t.airline_id = a.id
       WHERE t.id = ?`,
      [tourId]
    );

    if (!tour) {
      detailContainer.innerHTML = `
        <div class="card border-0 shadow-sm p-5 text-center">
          <div class="text-danger fs-1 mb-2"><i class="bi bi-search"></i></div>
          <h2 class="h4 fw-bold">Không tìm thấy tour #${escapeHtml(tourId)}</h2>
          <p class="text-secondary mb-4">Tour du lịch bạn tìm kiếm không tồn tại trong cơ sở dữ liệu.</p>
          <div>
            <a href="tours.html" class="btn btn-vj-primary"><i class="bi bi-arrow-left me-1"></i>Xem danh sách tour</a>
          </div>
        </div>
      `;
      return;
    }

    // Parse JSON lịch trình có kiểm tra lỗi an toàn theo data-and-storage.md
    let itineraryList = [];
    try {
      const parsed = JSON.parse(tour.itinerary_json || '[]');
      if (Array.isArray(parsed)) {
        itineraryList = parsed;
      }
    } catch (parseErr) {
      console.warn('Lỗi parse itinerary_json:', parseErr);
      itineraryList = [];
    }

    const servicesArray = (tour.included_services || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    detailContainer.innerHTML = `
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb small mb-0">
          <li class="breadcrumb-item"><a href="index.html">Trang chủ</a></li>
          <li class="breadcrumb-item"><a href="tours.html">Tour du lịch</a></li>
          <li class="breadcrumb-item active" aria-current="page">${escapeHtml(tour.destination)} (${escapeHtml(tour.id)})</li>
        </ol>
      </nav>

      <div class="row g-4">
        <!-- Cột trái: Thông tin chi tiết tour & Lịch trình -->
        <div class="col-12 col-lg-8">
          <div class="card border shadow-sm overflow-hidden mb-4" style="border-radius: 16px;">
            <div class="tour-thumb-wrapper">
              <img src="${escapeHtml(tour.thumbnail)}" alt="${escapeHtml(tour.title)}" width="600" height="400">
            </div>
            <div class="card-body p-4">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span class="badge-demo">Giá & Lịch trình tham khảo (Demo)</span>
                <span class="badge bg-danger-subtle text-danger border border-danger-subtle">
                  ${tour.duration_days} ngày ${tour.duration_nights} đêm
                </span>
                <span class="badge bg-light text-dark border">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i>${escapeHtml(tour.origin)} → ${escapeHtml(tour.destination)}
                </span>
              </div>

              <h1 class="h3 fw-bold mb-3">${escapeHtml(tour.title)}</h1>
              <p class="text-secondary mb-4">${escapeHtml(tour.description)}</p>

              <!-- Thông tin vận chuyển hàng không của Tour -->
              <div class="p-3 rounded-3 bg-light border mb-4">
                <h2 class="h6 fw-bold text-uppercase text-secondary mb-3">
                  <i class="bi bi-airplane-engines text-danger me-1"></i>Thông tin chuyến bay đi kèm trong Tour
                </h2>
                <div class="row g-3 align-items-center">
                  <div class="col-12 col-sm-6 d-flex align-items-center gap-3">
                    <img src="${escapeHtml(tour.airline_logo)}" alt="${escapeHtml(tour.airline_name)}" style="width: 78px; height: 46px; object-fit: contain;">
                    <div>
                      <div class="small text-secondary">Hãng hàng không</div>
                      <div class="fw-bold text-dark">${escapeHtml(tour.airline_name)}</div>
                    </div>
                  </div>
                  <div class="col-6 col-sm-3">
                    <div class="small text-secondary">Giờ bay & Thời lượng</div>
                    <div class="fw-bold text-dark">${escapeHtml(tour.departure_time)} (${formatDuration(tour.flight_duration_minutes)})</div>
                  </div>
                  <div class="col-6 col-sm-3">
                    <div class="small text-secondary">Loại máy bay</div>
                    <div class="fw-bold text-dark small">${escapeHtml(tour.aircraft)}</div>
                  </div>
                </div>
              </div>

              <!-- Dịch vụ bao gồm & Không bao gồm -->
              <div class="row g-4 mb-4">
                <div class="col-12 col-md-6">
                  <h2 class="h6 fw-bold text-dark mb-2">
                    <i class="bi bi-check-circle-fill text-success me-1"></i>Dịch vụ bao gồm
                  </h2>
                  <ul class="list-unstyled small d-grid gap-2 mb-0">
                    ${servicesArray
                      .map((srv) => `<li><i class="bi bi-check2 text-success me-2"></i>${escapeHtml(srv)}</li>`)
                      .join('')}
                  </ul>
                </div>

                <div class="col-12 col-md-6">
                  <h2 class="h6 fw-bold text-dark mb-2">
                    <i class="bi bi-x-circle-fill text-danger me-1"></i>Dịch vụ không bao gồm
                  </h2>
                  <ul class="list-unstyled small d-grid gap-2 mb-0 text-secondary">
                    <li><i class="bi bi-dash-circle me-2"></i>Chi phí cá nhân, giặt ủi, đồ uống gọi thêm ngoài chương trình.</li>
                    <li><i class="bi bi-dash-circle me-2"></i>Phụ thu phòng đơn (nếu khách có nhu cầu ở riêng 1 phòng).</li>
                    <li><i class="bi bi-dash-circle me-2"></i>Tiền bồi dưỡng (tip) cho hướng dẫn viên và tài xế địa phương.</li>
                  </ul>
                </div>
              </div>

              <!-- Lịch trình chi tiết theo ngày -->
              <h2 class="h5 fw-bold mb-3">
                <i class="bi bi-calendar2-week text-danger me-2"></i>Lịch trình chi tiết theo ngày
              </h2>
              <div class="mt-3">
                ${
                  itineraryList.length > 0
                    ? itineraryList
                        .map(
                          (step) => `
                          <div class="itinerary-step">
                            <div class="badge bg-danger mb-1">Ngày ${escapeHtml(step.day)}</div>
                            <h3 class="h6 fw-bold mb-1">${escapeHtml(step.title)}</h3>
                            <p class="small text-secondary mb-0">${escapeHtml(step.detail)}</p>
                          </div>
                        `
                        )
                        .join('')
                    : '<p class="text-secondary small">Lịch trình chi tiết đang được cập nhật.</p>'
                }
              </div>

              <!-- Điều kiện & Lưu ý -->
              <div class="p-3 rounded-3 border bg-light mt-4">
                <h2 class="h6 fw-bold mb-2"><i class="bi bi-shield-exclamation text-warning me-1"></i>Điều kiện & Lưu ý (Demo)</h2>
                <ul class="small text-secondary mb-0 ps-3 d-grid gap-1">
                  <li>Hành khách cần mang theo CCCD/Hộ chiếu còn hạn tối thiểu 6 tháng tính từ ngày kết thúc tour.</li>
                  <li>Thứ tự các điểm tham quan có thể điều chỉnh linh hoạt theo tình hình thời tiết thực tế nhưng vẫn đảm bảo đầy đủ điểm đến.</li>
                  <li>Đây là dữ liệu mẫu phục vụ đồ án thực hành, không phải xác nhận đặt chỗ thương mại.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột phải: Box đặt tour -->
        <div class="col-12 col-lg-4">
          <div class="card border shadow-sm filter-sidebar-sticky" style="border-radius: 16px;">
            <div class="card-body p-4">
              <div class="small text-secondary">Giá trọn gói tham khảo / khách</div>
              <div class="price-highlight fs-3 mb-3">${formatCurrency(tour.price)}</div>

              <div class="small border-top border-bottom py-3 mb-3 d-grid gap-2">
                <div class="d-flex justify-content-between">
                  <span class="text-secondary">Mã tour:</span>
                  <strong class="text-dark">${escapeHtml(tour.id)}</strong>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-secondary">Khởi hành từ:</span>
                  <strong class="text-dark">${escapeHtml(tour.origin)}</strong>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-secondary">Điểm đến:</span>
                  <strong class="text-dark">${escapeHtml(tour.destination)}</strong>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-secondary">Thời gian:</span>
                  <strong class="text-dark">${tour.duration_days} ngày ${tour.duration_nights} đêm</strong>
                </div>
              </div>

              <div class="mb-3">
                <label for="tour-booking-date" class="form-label small fw-semibold">Ngày khởi hành</label>
                <input
                  type="date"
                  id="tour-booking-date"
                  class="form-control"
                  value="${escapeHtml(tour.departure_date)}"
                  min="${escapeHtml(tour.departure_date)}"
                >
              </div>

              <div class="mb-3">
                <label for="tour-booking-guests" class="form-label small fw-semibold">Số lượng khách (tối thiểu 1)</label>
                <input
                  type="number"
                  id="tour-booking-guests"
                  class="form-control"
                  min="1"
                  max="30"
                  value="1"
                  required
                  aria-errormessage="tour-guests-error"
                >
                <div id="tour-guests-error" class="field-error-msg">Số lượng khách phải từ 1 trở lên.</div>
              </div>

              <div class="p-3 rounded-3 bg-light border mb-3 d-flex justify-content-between align-items-center">
                <span class="small fw-semibold text-secondary">Tổng tạm tính:</span>
                <span id="tour-detail-total-price" class="price-highlight fs-5">${formatCurrency(tour.price)}</span>
              </div>

              <div class="d-grid gap-2">
                <button type="button" id="btn-add-tour-cart" class="btn btn-vj-primary">
                  <i class="bi bi-bag-plus-fill me-1"></i>Chọn tour / Thêm vào giỏ hàng
                </button>
                <a href="cart.html" class="btn btn-vj-outline text-center">
                  Xem giỏ hàng hiện tại
                </a>
              </div>

              <div id="tour-added-feedback" class="alert alert-success small mt-3 mb-0 d-none" role="status"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const dateInput = document.getElementById('tour-booking-date');
    const guestsInput = document.getElementById('tour-booking-guests');
    const totalEl = document.getElementById('tour-detail-total-price');
    const addBtn = document.getElementById('btn-add-tour-cart');
    const feedbackEl = document.getElementById('tour-added-feedback');

    const updateTourTotal = () => {
      const qty = Math.max(1, parseInt(guestsInput.value || '1', 10) || 1);
      totalEl.textContent = formatCurrency(Number(tour.price) * qty);
    };

    guestsInput?.addEventListener('input', () => {
      const val = parseInt(guestsInput.value, 10);
      if (Number.isNaN(val) || val < 1) {
        guestsInput.classList.add('is-invalid-field');
        guestsInput.setAttribute('aria-invalid', 'true');
      } else {
        guestsInput.classList.remove('is-invalid-field');
        guestsInput.removeAttribute('aria-invalid');
        updateTourTotal();
      }
    });

    addBtn?.addEventListener('click', () => {
      const qty = parseInt(guestsInput.value, 10);
      if (Number.isNaN(qty) || qty < 1) {
        guestsInput.classList.add('is-invalid-field');
        guestsInput.setAttribute('aria-invalid', 'true');
        showToast('Vui lòng chọn số lượng khách tối thiểu là 1.', 'danger');
        return;
      }

      const chosenDate = dateInput?.value || tour.departure_date;
      addTourToCart({
        tour,
        departureDate: chosenDate,
        quantity: qty
      });

      showToast(`Đã thêm "${tour.title}" (${qty} khách) vào giỏ hàng!`, 'success');
      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div><i class="bi bi-check-circle-fill me-1"></i>Đã lưu <strong>${qty} khách</strong> vào giỏ hàng!</div>
          <a href="cart.html" class="fw-bold text-success d-inline-block mt-1">Đi tới Giỏ hàng & Đăng ký →</a>
        `;
        feedbackEl.classList.remove('d-none');
      }
    });
  } catch (err) {
    console.error('Lỗi tải chi tiết tour:', err);
    detailContainer.innerHTML = `
      <div class="alert alert-danger">Không thể tải thông tin chi tiết tour: ${escapeHtml(err.message)}</div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initToursListPage();
  initTourDetailPage();
});
