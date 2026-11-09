/**
 * Xử lý trang Danh sách chuyến bay (flights.html) và Chi tiết chuyến bay (flight-detail.html).
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
import { addFlightToCart } from './cart.js';
import { showToast, escapeHtml } from './app.js';

/**
 * Phân loại khung giờ cất cánh từ chuỗi HH:mm
 * - morning: 00:00 - 10:59 (Sáng)
 * - noon: 11:00 - 13:59 (Trưa)
 * - afternoon: 14:00 - 17:59 (Chiều)
 * - evening: 18:00 - 23:59 (Tối)
 */
function getTimeSlot(timeStr) {
  if (!timeStr) return 'morning';
  const hour = parseInt(timeStr.split(':')[0], 10) || 0;
  if (hour < 11) return 'morning';
  if (hour < 14) return 'noon';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Khởi tạo trang Danh sách chuyến bay (flights.html)
 */
async function initFlightsListPage() {
  const listContainer = document.getElementById('flights-list-container');
  if (!listContainer) return;

  const countEl = document.getElementById('flights-result-count');
  const activeSearchBanner = document.getElementById('active-search-summary');

  const params = new URLSearchParams(window.location.search);
  const state = {
    sortPrice: params.get('sort') || 'asc',
    tripType: params.get('tripType') || 'all',
    origin: params.get('origin') || '',
    destination: params.get('destination') || '',
    departureDate: params.get('departureDate') || '',
    returnDate: params.get('returnDate') || '',
    passengers: Math.max(1, parseInt(params.get('passengers') || '1', 10) || 1),
    stopType: 'all',
    airlines: params.get('airline') ? [params.get('airline')] : [],
    timeSlots: [],
    fareClass: params.get('fare') === 'business' ? 'business' : 'economy'
  };

  try {
    await initDB();
    const airlines = await queryAll('SELECT * FROM airlines WHERE is_active = 1 ORDER BY id ASC');
    const allFlights = await queryAll(
      `SELECT f.*, a.name as airline_name, a.logo as airline_logo
       FROM flights f
       LEFT JOIN airlines a ON f.airline_id = a.id
       ORDER BY f.departure_date ASC, f.departure_time ASC`
    );

    const origins = await queryAll(
      'SELECT DISTINCT origin_code as code, origin_name as name FROM flights ORDER BY origin_name'
    );
    const destinations = await queryAll(
      'SELECT DISTINCT destination_code as code, destination_name as name FROM flights ORDER BY destination_name'
    );

    // Render danh sách checkbox hãng bay ở cả desktop và mobile offcanvas
    document.querySelectorAll('[data-airline-filter-list]').forEach((container) => {
      container.innerHTML = airlines
        .map(
          (a) => `
          <div class="form-check mb-1">
            <input
              class="form-check-input filter-airline-checkbox"
              type="checkbox"
              value="${escapeHtml(a.id)}"
              id="chk-airline-${container.dataset.airlineFilterList}-${escapeHtml(a.id)}"
              ${state.airlines.includes(a.id) ? 'checked' : ''}
            >
            <label class="form-check-label small" for="chk-airline-${container.dataset.airlineFilterList}-${escapeHtml(a.id)}">
              ${escapeHtml(a.name)}
            </label>
          </div>
        `
        )
        .join('');
    });

    // Render dropdown điểm đi / điểm đến trong bộ lọc
    document.querySelectorAll('.filter-origin-select').forEach((sel) => {
      sel.innerHTML =
        '<option value="">Tất cả điểm đi</option>' +
        origins
          .map((o) => `<option value="${escapeHtml(o.code)}" ${state.origin === o.code ? 'selected' : ''}>${escapeHtml(o.name)}</option>`)
          .join('');
    });

    document.querySelectorAll('.filter-destination-select').forEach((sel) => {
      sel.innerHTML =
        '<option value="">Tất cả điểm đến</option>' +
        destinations
          .map((d) => `<option value="${escapeHtml(d.code)}" ${state.destination === d.code ? 'selected' : ''}>${escapeHtml(d.name)}</option>`)
          .join('');
    });

    const syncControlsFromState = () => {
      document.querySelectorAll('.filter-sort-select').forEach((el) => (el.value = state.sortPrice));
      document.querySelectorAll('.filter-triptype-radio').forEach((el) => {
        el.checked = el.value === state.tripType;
      });
      document.querySelectorAll('.filter-stoptype-radio').forEach((el) => {
        el.checked = el.value === state.stopType;
      });
      document.querySelectorAll('.filter-fareclass-radio').forEach((el) => {
        el.checked = el.value === state.fareClass;
      });
      document.querySelectorAll('.filter-origin-select').forEach((el) => (el.value = state.origin));
      document.querySelectorAll('.filter-destination-select').forEach((el) => (el.value = state.destination));
      document.querySelectorAll('.filter-date-input').forEach((el) => (el.value = state.departureDate));
      document.querySelectorAll('.filter-airline-checkbox').forEach((el) => {
        el.checked = state.airlines.includes(el.value);
      });
      document.querySelectorAll('.filter-timeslot-checkbox').forEach((el) => {
        el.checked = state.timeSlots.includes(el.value);
      });
    };

    const renderFilteredFlights = () => {
      const filtered = allFlights.filter((flight) => {
        if (state.origin && flight.origin_code !== state.origin) return false;
        if (state.destination && flight.destination_code !== state.destination) return false;
        if (state.departureDate && flight.departure_date !== state.departureDate) return false;

        if (state.stopType === 'direct' && Number(flight.stops) !== 0) return false;
        if (state.stopType === 'transit' && Number(flight.stops) === 0) return false;

        if (state.airlines.length > 0 && !state.airlines.includes(flight.airline_id)) return false;

        if (state.timeSlots.length > 0) {
          const slot = getTimeSlot(flight.departure_time);
          if (!state.timeSlots.includes(slot)) return false;
        }

        return true;
      });

      // Sắp xếp theo giá của hạng dịch vụ đang chọn
      filtered.sort((a, b) => {
        const priceA = state.fareClass === 'business' ? Number(a.business_price) : Number(a.economy_price);
        const priceB = state.fareClass === 'business' ? Number(b.business_price) : Number(b.economy_price);
        return state.sortPrice === 'desc' ? priceB - priceA : priceA - priceB;
      });

      if (countEl) {
        countEl.textContent = String(filtered.length);
      }

      // Hiển thị tóm tắt tiêu chí tìm kiếm đang áp dụng
      if (activeSearchBanner) {
        const badges = [];
        if (state.tripType === 'roundtrip') badges.push('Khứ hồi');
        if (state.tripType === 'oneway') badges.push('Một chiều');
        if (state.origin) badges.push(`Điểm đi: ${state.origin}`);
        if (state.destination) badges.push(`Điểm đến: ${state.destination}`);
        if (state.departureDate) badges.push(`Ngày đi: ${formatDateVN(state.departureDate)}`);
        if (state.returnDate && state.tripType === 'roundtrip') badges.push(`Ngày về: ${formatDateVN(state.returnDate)}`);
        if (state.passengers > 1) badges.push(`${state.passengers} hành khách`);
        badges.push(state.fareClass === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông');

        activeSearchBanner.innerHTML = badges
          .map((b) => `<span class="badge bg-light text-dark border me-1 mb-1">${escapeHtml(b)}</span>`)
          .join('');
      }

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="card border-0 shadow-sm p-4 text-center">
            <div class="mb-3 text-danger fs-1"><i class="bi bi-airplane-engines"></i></div>
            <h3 class="h5 fw-bold">Không tìm thấy chuyến bay phù hợp</h3>
            <p class="text-secondary small mb-3">
              Không có chuyến bay nào khớp với toàn bộ điều kiện lọc hiện tại (đặc biệt là ngày khởi hành hoặc chặng bay cụ thể).
            </p>
            <div class="d-flex flex-wrap justify-content-center gap-2">
              ${
                state.departureDate
                  ? `<button type="button" class="btn btn-sm btn-vj-primary" id="btn-clear-date-only">
                       <i class="bi bi-calendar-x me-1"></i>Xem tất cả các ngày cho chặng này
                     </button>`
                  : ''
              }
              <button type="button" class="btn btn-sm btn-vj-outline" id="btn-empty-reset-all">
                <i class="bi bi-arrow-counterclockwise me-1"></i>Xóa toàn bộ bộ lọc
              </button>
            </div>
          </div>
        `;

        document.getElementById('btn-clear-date-only')?.addEventListener('click', () => {
          state.departureDate = '';
          syncControlsFromState();
          renderFilteredFlights();
        });
        document.getElementById('btn-empty-reset-all')?.addEventListener('click', resetAllFilters);
        return;
      }

      listContainer.innerHTML = filtered
        .map((flight) => {
          const displayPrice =
            state.fareClass === 'business' ? Number(flight.business_price) : Number(flight.economy_price);
          const fareLabel = state.fareClass === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';
          const stopBadge =
            Number(flight.stops) === 0
              ? '<span class="badge bg-success-subtle text-success border border-success-subtle">Bay thẳng</span>'
              : `<span class="badge bg-warning-subtle text-dark border border-warning-subtle">Quá cảnh (${flight.stops} điểm dừng)</span>`;

          const detailUrl = new URLSearchParams({
            id: flight.id,
            fare: state.fareClass,
            passengers: String(state.passengers),
            tripType: state.tripType === 'all' ? 'oneway' : state.tripType
          }).toString();

          return `
            <article class="flight-card mb-3">
              <div class="row align-items-center g-3">
                <div class="col-12 col-md-3">
                  <div class="d-flex align-items-center gap-2">
                    <img
                      src="${escapeHtml(flight.airline_logo)}"
                      alt="${escapeHtml(flight.airline_name)}"
                      style="width: 68px; height: 42px; object-fit: contain;"
                    >
                    <div>
                      <div class="fw-bold text-dark">${escapeHtml(flight.airline_name)}</div>
                      <div class="small text-secondary">
                        <span class="badge bg-light text-dark border">${escapeHtml(flight.flight_number)}</span>
                      </div>
                    </div>
                  </div>
                  <div class="small text-secondary mt-2">
                    <i class="bi bi-calendar-event me-1 text-danger"></i>Ngày bay: <strong>${formatDateVN(flight.departure_date)}</strong>
                  </div>
                </div>

                <div class="col-12 col-md-5">
                  <div class="flight-timeline text-center">
                    <div>
                      <div class="fs-5 fw-bold text-dark">${escapeHtml(flight.departure_time)}</div>
                      <div class="small fw-semibold text-secondary">${escapeHtml(flight.origin_code)}</div>
                    </div>
                    <div class="flex-grow-1 px-2">
                      <div class="small text-secondary mb-1">${formatDuration(flight.duration_minutes)}</div>
                      <div class="flight-timeline-line"></div>
                      <div class="mt-2">${stopBadge}</div>
                    </div>
                    <div>
                      <div class="fs-5 fw-bold text-dark">${escapeHtml(flight.arrival_time)}</div>
                      <div class="small fw-semibold text-secondary">${escapeHtml(flight.destination_code)}</div>
                    </div>
                  </div>
                  <div class="small text-secondary text-center mt-2">
                    ${escapeHtml(flight.origin_name)} → ${escapeHtml(flight.destination_name)}
                  </div>
                </div>

                <div class="col-12 col-md-4 border-top border-md-top-0 pt-2 pt-md-0 text-md-end">
                  <div class="small text-secondary">${fareLabel} • Giá tham khảo từ</div>
                  <div class="price-highlight mb-1">${formatCurrency(displayPrice)}<span class="small fw-normal text-secondary">/khách</span></div>
                  <div class="small text-secondary mb-2 text-truncate" title="${escapeHtml(flight.services)}">
                    <i class="bi bi-luggage me-1 text-danger"></i>${escapeHtml(flight.services)}
                  </div>
                  <a href="flight-detail.html?${detailUrl}" class="btn btn-vj-primary w-100 w-md-auto">
                    Xem chuyến bay <i class="bi bi-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>
            </article>
          `;
        })
        .join('');
    };

    const resetAllFilters = () => {
      state.sortPrice = 'asc';
      state.tripType = 'all';
      state.origin = '';
      state.destination = '';
      state.departureDate = '';
      state.returnDate = '';
      state.stopType = 'all';
      state.airlines = [];
      state.timeSlots = [];
      state.fareClass = 'economy';
      window.history.replaceState({}, '', 'flights.html');
      syncControlsFromState();
      renderFilteredFlights();
    };

    // Lắng nghe thay đổi trên toàn bộ control filter (hỗ trợ đồng bộ Desktop & Offcanvas Mobile)
    document.addEventListener('change', (e) => {
      const t = e.target;
      if (!t) return;

      if (t.classList.contains('filter-sort-select')) {
        state.sortPrice = t.value;
        syncControlsFromState();
        renderFilteredFlights();
      } else if (t.classList.contains('filter-triptype-radio')) {
        state.tripType = t.value;
        syncControlsFromState();
        renderFilteredFlights();
      } else if (t.classList.contains('filter-stoptype-radio')) {
        state.stopType = t.value;
        syncControlsFromState();
        renderFilteredFlights();
      } else if (t.classList.contains('filter-fareclass-radio')) {
        state.fareClass = t.value;
        syncControlsFromState();
        renderFilteredFlights();
      } else if (t.classList.contains('filter-origin-select')) {
        state.origin = t.value;
        syncControlsFromState();
        renderFilteredFlights();
      } else if (t.classList.contains('filter-destination-select')) {
        state.destination = t.value;
        syncControlsFromState();
        renderFilteredFlights();
      } else if (t.classList.contains('filter-date-input')) {
        state.departureDate = t.value;
        syncControlsFromState();
        renderFilteredFlights();
      } else if (t.classList.contains('filter-airline-checkbox')) {
        const val = t.value;
        if (t.checked && !state.airlines.includes(val)) {
          state.airlines.push(val);
        } else if (!t.checked) {
          state.airlines = state.airlines.filter((id) => id !== val);
        }
        syncControlsFromState();
        renderFilteredFlights();
      } else if (t.classList.contains('filter-timeslot-checkbox')) {
        const val = t.value;
        if (t.checked && !state.timeSlots.includes(val)) {
          state.timeSlots.push(val);
        } else if (!t.checked) {
          state.timeSlots = state.timeSlots.filter((s) => s !== val);
        }
        syncControlsFromState();
        renderFilteredFlights();
      }
    });

    document.querySelectorAll('.btn-reset-flight-filters').forEach((btn) => {
      btn.addEventListener('click', resetAllFilters);
    });

    syncControlsFromState();
    renderFilteredFlights();
  } catch (err) {
    console.error('Lỗi tải danh sách chuyến bay:', err);
    listContainer.innerHTML = `
      <div class="alert alert-danger">
        Đã xảy ra lỗi khi truy vấn danh sách chuyến bay từ SQLite: ${escapeHtml(err.message)}
      </div>
    `;
  }
}

/**
 * Khởi tạo trang Chi tiết chuyến bay (flight-detail.html)
 */
async function initFlightDetailPage() {
  const detailContainer = document.getElementById('flight-detail-container');
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const flightId = (params.get('id') || '').trim();
  let selectedFare = params.get('fare') === 'business' ? 'business' : 'economy';
  const initialPassengers = Math.max(1, parseInt(params.get('passengers') || '1', 10) || 1);

  if (!flightId) {
    detailContainer.innerHTML = `
      <div class="card border-0 shadow-sm p-5 text-center">
        <div class="text-danger fs-1 mb-2"><i class="bi bi-exclamation-circle"></i></div>
        <h2 class="h4 fw-bold">Thiếu mã chuyến bay</h2>
        <p class="text-secondary mb-4">Không tìm thấy tham số ID chuyến bay trên đường dẫn. Vui lòng chọn một chuyến bay từ danh sách.</p>
        <div>
          <a href="flights.html" class="btn btn-vj-primary"><i class="bi bi-arrow-left me-1"></i>Quay lại danh sách chuyến bay</a>
        </div>
      </div>
    `;
    return;
  }

  try {
    await initDB();
    const flight = await queryOne(
      `SELECT f.*, a.name as airline_name, a.logo as airline_logo
       FROM flights f
       LEFT JOIN airlines a ON f.airline_id = a.id
       WHERE f.id = ?`,
      [flightId]
    );

    if (!flight) {
      detailContainer.innerHTML = `
        <div class="card border-0 shadow-sm p-5 text-center">
          <div class="text-danger fs-1 mb-2"><i class="bi bi-search"></i></div>
          <h2 class="h4 fw-bold">Không tìm thấy chuyến bay #${escapeHtml(flightId)}</h2>
          <p class="text-secondary mb-4">Chuyến bay bạn tìm kiếm không tồn tại trong cơ sở dữ liệu hoặc đã bị xóa.</p>
          <div>
            <a href="flights.html" class="btn btn-vj-primary"><i class="bi bi-arrow-left me-1"></i>Xem danh sách chuyến bay</a>
          </div>
        </div>
      `;
      return;
    }

    const stopText =
      Number(flight.stops) === 0 ? 'Bay thẳng (Không dừng)' : `Quá cảnh (${flight.stops} điểm dừng kỹ thuật)`;

    detailContainer.innerHTML = `
      <nav aria-label="breadcrumb" class="mb-3">
        <ol class="breadcrumb small mb-0">
          <li class="breadcrumb-item"><a href="index.html">Trang chủ</a></li>
          <li class="breadcrumb-item"><a href="flights.html">Chuyến bay</a></li>
          <li class="breadcrumb-item active" aria-current="page">${escapeHtml(flight.flight_number)} (${escapeHtml(flight.origin_code)} → ${escapeHtml(flight.destination_code)})</li>
        </ol>
      </nav>

      <div class="card border shadow-sm mb-4" style="border-radius: 16px;">
        <div class="card-body p-4">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
            <div class="d-flex align-items-center gap-3">
              <img src="${escapeHtml(flight.airline_logo)}" alt="${escapeHtml(flight.airline_name)}" style="width: 90px; height: 52px; object-fit: contain;">
              <div>
                <span class="badge-demo mb-1 d-inline-block">Dữ liệu chuyến bay tham khảo</span>
                <h1 class="h4 fw-bold mb-0">${escapeHtml(flight.origin_name)} → ${escapeHtml(flight.destination_name)}</h1>
                <div class="small text-secondary mt-1">
                  Hãng khai thác: <strong class="text-dark">${escapeHtml(flight.airline_name)}</strong> •
                  Số hiệu: <strong class="text-dark">${escapeHtml(flight.flight_number)}</strong> •
                  Tàu bay: <strong class="text-dark">${escapeHtml(flight.aircraft)}</strong>
                </div>
              </div>
            </div>
            <div class="text-md-end">
              <div class="small text-secondary">Ngày khởi hành</div>
              <div class="fs-5 fw-bold text-danger"><i class="bi bi-calendar3 me-1"></i>${formatDateVN(flight.departure_date)}</div>
            </div>
          </div>

          <!-- Sơ đồ / Timeline hành trình -->
          <div class="row g-4 align-items-center">
            <div class="col-12 col-lg-7">
              <h2 class="h6 fw-bold text-uppercase text-secondary mb-3">Timeline hành trình</h2>
              <div class="p-3 rounded-3 bg-light border">
                <div class="d-flex align-items-start gap-3 mb-3">
                  <div class="fw-bold fs-5 text-dark" style="min-width: 65px;">${escapeHtml(flight.departure_time)}</div>
                  <div>
                    <div class="fw-bold text-dark">Khởi hành từ ${escapeHtml(flight.origin_name)}</div>
                    <div class="small text-secondary">Ngày ${formatDateVN(flight.departure_date)} • Làm thủ tục trước giờ bay ít nhất 90–120 phút</div>
                  </div>
                </div>

                <div class="ps-4 ms-3 border-start border-2 border-danger py-2 my-1">
                  <div class="small text-secondary">
                    <i class="bi bi-clock-history me-1 text-danger"></i>Thời gian bay dự kiến: <strong>${formatDuration(flight.duration_minutes)}</strong> (${stopText})
                  </div>
                  <div class="small text-secondary">
                    <i class="bi bi-airplane me-1 text-danger"></i>Loại máy bay minh họa: <strong>${escapeHtml(flight.aircraft)}</strong>
                  </div>
                </div>

                <div class="d-flex align-items-start gap-3 mt-3">
                  <div class="fw-bold fs-5 text-dark" style="min-width: 65px;">${escapeHtml(flight.arrival_time)}</div>
                  <div>
                    <div class="fw-bold text-dark">Hạ cánh tại ${escapeHtml(flight.destination_name)}</div>
                    <div class="small text-secondary">Nhà ga hành khách theo quy định của cảng hàng không</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 col-lg-5">
              <h2 class="h6 fw-bold text-uppercase text-secondary mb-3">Dịch vụ cơ bản trên chuyến bay</h2>
              <div class="p-3 rounded-3 border bg-white">
                <ul class="list-unstyled small mb-0 d-grid gap-2">
                  <li><i class="bi bi-check2-circle text-success me-2"></i><strong>Tóm tắt dịch vụ:</strong> ${escapeHtml(flight.services)}</li>
                  <li><i class="bi bi-shield-check text-success me-2"></i><strong>Tiêu chuẩn an toàn:</strong> Đội tàu bay ${escapeHtml(flight.aircraft)}</li>
                  <li><i class="bi bi-info-circle text-danger me-2"></i><strong>Lưu ý:</strong> Quyền lợi hành lý, suất ăn và chọn chỗ ngồi cụ thể sẽ phụ thuộc vào <strong>Hạng vé</strong> bạn chọn bên dưới.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chọn hạng vé -->
      <section class="mb-4" aria-labelledby="fare-selection-heading">
        <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <h2 id="fare-selection-heading" class="h5 fw-bold mb-0">Chọn hạng vé của bạn</h2>
          <span class="small text-secondary">Nhấp vào thẻ hạng vé để chọn</span>
        </div>

        <div class="row g-4">
          <!-- Hạng Phổ Thông -->
          <div class="col-12 col-md-6">
            <div
              class="fare-card ${selectedFare === 'economy' ? 'selected' : ''}"
              data-fare-card="economy"
              role="radio"
              aria-checked="${selectedFare === 'economy' ? 'true' : 'false'}"
              tabindex="0"
            >
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span class="badge bg-secondary-subtle text-dark mb-1">Tiết kiệm & Linh hoạt</span>
                  <h3 class="h5 fw-bold mb-0">Hạng Phổ Thông (Economy)</h3>
                </div>
                <span class="fare-check-badge"><i class="bi bi-check-lg"></i></span>
              </div>
              <div class="price-highlight fs-4 mb-3">${formatCurrency(flight.economy_price)} <span class="fs-6 fw-normal text-secondary">/ khách</span></div>
              <hr>
              <ul class="list-unstyled small d-grid gap-2 mb-0">
                <li><i class="bi bi-luggage-fill text-danger me-2"></i><strong>Hành lý:</strong> 07kg hành lý xách tay tiêu chuẩn (hành lý ký gửi tùy hãng hoặc mua thêm).</li>
                <li><i class="bi bi-person-workspace text-danger me-2"></i><strong>Chọn chỗ ngồi:</strong> Ngẫu nhiên khi làm thủ tục hoặc chọn trước có thu phí.</li>
                <li><i class="bi bi-cup-hot text-danger me-2"></i><strong>Suất ăn / Dịch vụ:</strong> Nước uống cơ bản hoặc phục vụ theo tiêu chuẩn hãng.</li>
                <li><i class="bi bi-arrow-repeat text-danger me-2"></i><strong>Điều kiện đổi/hoàn (Demo):</strong> Cho phép đổi ngày/giờ bay trước 24h có tính phí chênh lệch; không hoàn vé.</li>
              </ul>
            </div>
          </div>

          <!-- Hạng Thương Gia -->
          <div class="col-12 col-md-6">
            <div
              class="fare-card ${selectedFare === 'business' ? 'selected' : ''}"
              data-fare-card="business"
              role="radio"
              aria-checked="${selectedFare === 'business' ? 'true' : 'false'}"
              tabindex="0"
            >
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span class="badge bg-warning-subtle text-dark border border-warning mb-1">Đặc quyền ưu tiên</span>
                  <h3 class="h5 fw-bold mb-0">Hạng Thương Gia (Business)</h3>
                </div>
                <span class="fare-check-badge"><i class="bi bi-check-lg"></i></span>
              </div>
              <div class="price-highlight fs-4 mb-3">${formatCurrency(flight.business_price)} <span class="fs-6 fw-normal text-secondary">/ khách</span></div>
              <hr>
              <ul class="list-unstyled small d-grid gap-2 mb-0">
                <li><i class="bi bi-luggage-fill text-success me-2"></i><strong>Hành lý:</strong> 14kg xách tay + 30kg hành lý ký gửi ưu tiên nhận sớm.</li>
                <li><i class="bi bi-person-workspace text-success me-2"></i><strong>Chọn chỗ ngồi:</strong> Miễn phí chọn ghế khoang Thương Gia rộng rãi phía trước.</li>
                <li><i class="bi bi-cup-hot text-success me-2"></i><strong>Suất ăn / Dịch vụ:</strong> Suất ăn nóng cao cấp + Phòng chờ sang trọng tại sân bay.</li>
                <li><i class="bi bi-arrow-repeat text-success me-2"></i><strong>Điều kiện đổi/hoàn (Demo):</strong> Miễn phí đổi ngày/giờ bay (chỉ thu chênh lệch giá nếu có); hỗ trợ bảo lưu định danh.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Khối tổng kết & Thêm vào giỏ hàng -->
      <div class="card border shadow-sm" style="border-radius: 16px;">
        <div class="card-body p-4">
          <div class="row align-items-center g-3">
            <div class="col-12 col-md-4">
              <label for="detail-flight-passengers" class="form-label fw-semibold mb-1">Số lượng hành khách</label>
              <input
                type="number"
                id="detail-flight-passengers"
                class="form-control"
                min="1"
                max="20"
                value="${initialPassengers}"
                aria-errormessage="detail-passengers-err"
              >
              <div id="detail-passengers-err" class="field-error-msg">Số lượng hành khách tối thiểu là 1.</div>
            </div>

            <div class="col-12 col-md-4">
              <div class="small text-secondary">Hạng vé đã chọn: <strong id="summary-selected-fare-name" class="text-dark"></strong></div>
              <div class="small text-secondary">Tạm tính tổng cộng:</div>
              <div id="summary-flight-total-price" class="price-highlight fs-4"></div>
            </div>

            <div class="col-12 col-md-4 text-md-end d-flex flex-wrap gap-2 justify-content-md-end">
              <button type="button" id="btn-add-flight-cart" class="btn btn-vj-primary px-4">
                <i class="bi bi-cart-plus me-1"></i>Thêm vào giỏ hàng
              </button>
              <a href="cart.html" class="btn btn-vj-outline">
                Đến giỏ hàng
              </a>
            </div>
          </div>

          <div id="flight-added-feedback" class="alert alert-success mt-3 mb-0 d-none" role="status"></div>
        </div>
      </div>
    `;

    const fareCards = detailContainer.querySelectorAll('[data-fare-card]');
    const passengersInput = document.getElementById('detail-flight-passengers');
    const fareNameEl = document.getElementById('summary-selected-fare-name');
    const totalPriceEl = document.getElementById('summary-flight-total-price');
    const addBtn = document.getElementById('btn-add-flight-cart');
    const feedbackEl = document.getElementById('flight-added-feedback');

    const updateSummary = () => {
      const qty = Math.max(1, parseInt(passengersInput.value || '1', 10) || 1);
      const unitPrice = selectedFare === 'business' ? Number(flight.business_price) : Number(flight.economy_price);
      fareNameEl.textContent = selectedFare === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';
      totalPriceEl.textContent = formatCurrency(unitPrice * qty);

      fareCards.forEach((card) => {
        const isSelected = card.dataset.fareCard === selectedFare;
        card.classList.toggle('selected', isSelected);
        card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      });
    };

    fareCards.forEach((card) => {
      card.addEventListener('click', () => {
        selectedFare = card.dataset.fareCard;
        updateSummary();
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectedFare = card.dataset.fareCard;
          updateSummary();
        }
      });
    });

    passengersInput?.addEventListener('input', () => {
      const val = parseInt(passengersInput.value, 10);
      if (Number.isNaN(val) || val < 1) {
        passengersInput.classList.add('is-invalid-field');
        passengersInput.setAttribute('aria-invalid', 'true');
      } else {
        passengersInput.classList.remove('is-invalid-field');
        passengersInput.removeAttribute('aria-invalid');
        updateSummary();
      }
    });

    addBtn?.addEventListener('click', () => {
      const qty = parseInt(passengersInput.value, 10);
      if (Number.isNaN(qty) || qty < 1) {
        passengersInput.classList.add('is-invalid-field');
        passengersInput.setAttribute('aria-invalid', 'true');
        showToast('Vui lòng nhập số lượng hành khách tối thiểu là 1.', 'danger');
        return;
      }

      addFlightToCart({
        flight,
        fareClass: selectedFare,
        quantity: qty
      });

      const fareLabel = selectedFare === 'business' ? 'Hạng Thương Gia' : 'Hạng Phổ Thông';
      showToast(`Đã thêm chuyến bay ${flight.flight_number} (${fareLabel}) vào giỏ hàng!`, 'success');

      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <span>
              <i class="bi bi-check-circle-fill me-1"></i>
              Đã thêm <strong>${qty} vé ${fareLabel}</strong> của chuyến bay <strong>${escapeHtml(flight.flight_number)}</strong> vào giỏ hàng!
            </span>
            <a href="cart.html" class="btn btn-sm btn-success">Xem giỏ hàng & Đăng ký →</a>
          </div>
        `;
        feedbackEl.classList.remove('d-none');
      }
    });

    updateSummary();
  } catch (err) {
    console.error('Lỗi tải chi tiết chuyến bay:', err);
    detailContainer.innerHTML = `
      <div class="alert alert-danger">
        Không thể tải thông tin chi tiết chuyến bay: ${escapeHtml(err.message)}
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initFlightsListPage();
  initFlightDetailPage();
});
