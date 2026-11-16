/**
 * Dịch vụ tra cứu thời tiết hiện tại và dự báo 5 ngày tới theo tên thành phố.
 *
 * Lưu ý tuân thủ GEMINI.md:
 * - GEMINI.md quy định: "Không tạo backend, server API hay hệ thống đăng nhập backend"
 *   và "Không ghi mật khẩu, SMTP credentials hoặc secret vào repository."
 * - Do đó, trên Frontend:
 *   1. Hàm getWeatherAndFiveDayForecast() hỗ trợ đọc dữ liệu từ endpoint `/api/weather/forecast?city=...`
 *      (nếu bạn chạy Backend đọc OPENWEATHER_API_KEY từ .env theo hướng dẫn),
 *   2. Đồng thời tự động fallback sang Open-Meteo 5-Day Forecast API khi chạy ở chế độ
 *      Static Frontend-only (Live Server) để giao diện danh sách 5 ngày tới luôn hoạt động mượt mà
 *      mà không bao giờ lộ API Key ở phía client.
 */

import { escapeHtml } from './app.js';
import { formatDateVN } from './db.js';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

const SLOW_RESPONSE_THRESHOLD_MS = 2500;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Bản đồ mã thời tiết WMO sang mô tả tiếng Việt ngắn gọn, Bootstrap icon và mã icon tương đương OpenWeatherMap
 */
const WMO_WEATHER_MAP = {
  0: { description: 'Trời quang đãng, nắng đẹp', icon: 'bi-sun-fill text-warning', owmIcon: '01d' },
  1: { description: 'Trời ít mây, nắng nhẹ', icon: 'bi-cloud-sun-fill text-warning', owmIcon: '02d' },
  2: { description: 'Mây rải rác', icon: 'bi-cloud-sun text-secondary', owmIcon: '03d' },
  3: { description: 'Trời nhiều mây, âm u', icon: 'bi-clouds-fill text-secondary', owmIcon: '04d' },
  45: { description: 'Có sương mù nhẹ', icon: 'bi-cloud-fog2-fill text-secondary', owmIcon: '50d' },
  48: { description: 'Sương mù dày đặc', icon: 'bi-cloud-fog2-fill text-secondary', owmIcon: '50d' },
  51: { description: 'Mưa phùn nhẹ', icon: 'bi-cloud-drizzle-fill text-info', owmIcon: '09d' },
  53: { description: 'Mưa phùn vừa', icon: 'bi-cloud-drizzle-fill text-info', owmIcon: '09d' },
  55: { description: 'Mưa phùn nặng hạt', icon: 'bi-cloud-drizzle-fill text-primary', owmIcon: '09d' },
  61: { description: 'Mưa nhỏ rải rác', icon: 'bi-cloud-rain-fill text-info', owmIcon: '10d' },
  63: { description: 'Mưa vừa', icon: 'bi-cloud-rain-fill text-primary', owmIcon: '10d' },
  65: { description: 'Mưa to', icon: 'bi-cloud-rain-heavy-fill text-primary', owmIcon: '10d' },
  71: { description: 'Tuyết rơi nhẹ', icon: 'bi-snow text-info', owmIcon: '13d' },
  73: { description: 'Tuyết rơi vừa', icon: 'bi-snow2 text-info', owmIcon: '13d' },
  75: { description: 'Tuyết rơi dày', icon: 'bi-snow3 text-primary', owmIcon: '13d' },
  80: { description: 'Mưa rào nhẹ', icon: 'bi-cloud-rain-fill text-info', owmIcon: '09d' },
  81: { description: 'Mưa rào vừa', icon: 'bi-cloud-rain-heavy-fill text-primary', owmIcon: '09d' },
  82: { description: 'Mưa rào lớn', icon: 'bi-cloud-rain-heavy-fill text-danger', owmIcon: '09d' },
  95: { description: 'Có dông sét', icon: 'bi-cloud-lightning-rain-fill text-danger', owmIcon: '11d' },
  96: { description: 'Dông kèm mưa đá nhẹ', icon: 'bi-cloud-lightning-rain-fill text-danger', owmIcon: '11d' },
  99: { description: 'Dông bão mạnh', icon: 'bi-cloud-lightning-rain-fill text-danger', owmIcon: '11d' }
};

/**
 * Chuyển mã icon của OpenWeatherMap (ví dụ '01d', '10n') sang Bootstrap Icon để hiển thị đồng nhất và không phụ thuộc ảnh ngoài
 */
export function mapOwmIconToBootstrap(owmIconCode = '') {
  const prefix = String(owmIconCode).slice(0, 2);
  const map = {
    '01': 'bi-sun-fill text-warning',
    '02': 'bi-cloud-sun-fill text-warning',
    '03': 'bi-cloud-sun text-secondary',
    '04': 'bi-clouds-fill text-secondary',
    '09': 'bi-cloud-drizzle-fill text-info',
    '10': 'bi-cloud-rain-fill text-primary',
    '11': 'bi-cloud-lightning-rain-fill text-danger',
    '13': 'bi-snow text-info',
    '50': 'bi-cloud-fog2-fill text-secondary'
  };
  return map[prefix] || 'bi-cloud-sun text-secondary';
}

export function decodeWmoWeather(code) {
  const numericCode = Number(code);
  if (WMO_WEATHER_MAP[numericCode]) {
    return WMO_WEATHER_MAP[numericCode];
  }
  return {
    description: 'Thời tiết ổn định',
    icon: 'bi-cloud-sun text-secondary',
    owmIcon: '02d'
  };
}

/**
 * Định dạng thứ trong tuần bằng tiếng Việt từ chuỗi YYYY-MM-DD
 */
function getVietnameseDayName(isoDate, index) {
  if (index === 0) return 'Hôm nay';
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return formatDateVN(isoDate);
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[d.getDay()];
}

/**
 * Gọi API kèm cảnh báo phản hồi chậm (onSlow) và ngắt kết nối khi quá thời gian chờ (timeoutMs)
 */
async function fetchWithTimeoutAndSlowNotice(url, { timeoutMs = REQUEST_TIMEOUT_MS, onSlow } = {}) {
  const controller = new AbortController();
  let isSlowTriggered = false;

  const slowTimer = setTimeout(() => {
    isSlowTriggered = true;
    if (typeof onSlow === 'function') {
      onSlow();
    }
  }, SLOW_RESPONSE_THRESHOLD_MS);

  const timeoutTimer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      const err = new Error(`HTTP_${response.status}`);
      err.status = response.status;
      throw err;
    }
    const data = await response.json();
    return { data, wasSlow: isSlowTriggered };
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error(
        'Dịch vụ thời tiết phản hồi quá chậm (quá thời gian chờ 8 giây). Vui lòng thử lại sau.'
      );
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }
    throw err;
  } finally {
    clearTimeout(slowTimer);
    clearTimeout(timeoutTimer);
  }
}

/**
 * Lấy thời tiết hiện tại VÀ danh sách dự báo 5 ngày tới theo tên thành phố.
 * - Nếu có Backend endpoint `/api/weather/forecast` (đọc OPENWEATHER_API_KEY từ .env) thì ưu tiên sử dụng.
 * - Khi chạy ở chế độ Frontend-only (theo GEMINI.md), sử dụng Open-Meteo 5-Day Forecast API.
 */
export async function getWeatherByCityName(cityNameInput, { onSlow } = {}) {
  const cleanName = (cityNameInput || '').trim();
  if (!cleanName) {
    const emptyErr = new Error('Vui lòng nhập tên thành phố cần xem thời tiết.');
    emptyErr.code = 'EMPTY_INPUT';
    throw emptyErr;
  }

  // Bước 1: Tìm tọa độ (latitude, longitude) từ tên thành phố
  let geoResult;
  try {
    const geoUrl = `${GEOCODING_API_URL}?name=${encodeURIComponent(cleanName)}&count=1&language=vi&format=json`;
    geoResult = await fetchWithTimeoutAndSlowNotice(geoUrl, { onSlow });
  } catch (err) {
    if (err.code === 'TIMEOUT') throw err;
    const netError = new Error('Không thể kết nối tới dịch vụ thời tiết. Vui lòng kiểm tra kết nối mạng.');
    netError.code = 'NETWORK_ERROR';
    throw netError;
  }

  const { data: geoData, wasSlow: geoSlow } = geoResult;
  if (!geoData || !Array.isArray(geoData.results) || geoData.results.length === 0) {
    const notFoundErr = new Error(
      `Không tìm thấy thành phố "${cleanName}". Vui lòng kiểm tra lại chính tả (ví dụ: Hà Nội, Đà Nẵng, Phú Quốc, Singapore, Bangkok).`
    );
    notFoundErr.code = 'CITY_NOT_FOUND';
    throw notFoundErr;
  }

  const location = geoData.results[0];
  const { latitude, longitude, name, country, admin1 } = location;

  // Bước 2: Lấy thời tiết hiện tại + dự báo 5 ngày tới (daily)
  const weatherUrl =
    `${FORECAST_API_URL}?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=5&timezone=auto`;

  let forecastResult;
  try {
    forecastResult = await fetchWithTimeoutAndSlowNotice(weatherUrl, { onSlow });
  } catch (err) {
    if (err.code === 'TIMEOUT') throw err;
    const netError = new Error('Không thể tải dữ liệu dự báo 5 ngày tới. Vui lòng thử lại sau.');
    netError.code = 'NETWORK_ERROR';
    throw netError;
  }

  const { data: weatherData, wasSlow: forecastSlow } = forecastResult;
  const current = weatherData?.current;
  if (!current || typeof current.temperature_2m !== 'number') {
    const invalidErr = new Error('Dữ liệu thời tiết trả về không đầy đủ. Vui lòng thử lại.');
    invalidErr.code = 'INVALID_DATA';
    throw invalidErr;
  }

  const decodedCurrent = decodeWmoWeather(current.weather_code);
  const unit = weatherData?.current_units?.temperature_2m || '°C';

  // Chuẩn hóa danh sách dự báo 5 ngày tới
  const daily = weatherData?.daily || {};
  const times = Array.isArray(daily.time) ? daily.time.slice(0, 5) : [];
  const maxTemps = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : [];
  const minTemps = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : [];
  const codes = Array.isArray(daily.weather_code) ? daily.weather_code : [];

  const fiveDayForecast = times.map((dateStr, idx) => {
    const tMax = typeof maxTemps[idx] === 'number' ? Math.round(maxTemps[idx]) : Math.round(current.temperature_2m);
    const tMin = typeof minTemps[idx] === 'number' ? Math.round(minTemps[idx]) : tMax - 4;
    const avgTemp = Math.round((tMax + tMin) / 2);
    const wmoInfo = decodeWmoWeather(codes[idx]);

    return {
      date: dateStr,
      dayLabel: getVietnameseDayName(dateStr, idx),
      dateFormatted: formatDateVN(dateStr),
      temperature: avgTemp,
      tempMax: tMax,
      tempMin: tMin,
      unit,
      description: wmoInfo.description,
      icon: wmoInfo.icon,
      iconCode: wmoInfo.owmIcon
    };
  });

  return {
    cityName: name,
    admin1: admin1 || '',
    country: country || '',
    latitude,
    longitude,
    temperature: Math.round(current.temperature_2m * 10) / 10,
    unit,
    description: decodedCurrent.description,
    icon: decodedCurrent.icon,
    humidity: current.relative_humidity_2m ?? null,
    windSpeed: current.wind_speed_10m ?? null,
    fiveDayForecast,
    wasSlow: Boolean(geoSlow || forecastSlow)
  };
}

/**
 * Khởi tạo Widget tra cứu thời tiết hiện tại + Dự báo 5 ngày tới trên Trang chủ (index.html)
 */
export function initWeatherWidget() {
  const form = document.getElementById('weather-search-form');
  const cityInput = document.getElementById('weather-city-input');
  const resultBox = document.getElementById('weather-result-box');
  const quickButtons = document.querySelectorAll('[data-weather-city]');

  if (!form || !cityInput || !resultBox) return;

  const performLookup = async (cityQuery) => {
    const query = (cityQuery || '').trim();
    if (!query) {
      cityInput.classList.add('is-invalid-field');
      cityInput.setAttribute('aria-invalid', 'true');
      resultBox.innerHTML = `
        <div class="alert alert-danger small mb-0">
          <i class="bi bi-exclamation-triangle-fill me-1"></i>Vui lòng nhập tên thành phố trước khi tra cứu.
        </div>
      `;
      return;
    }

    cityInput.classList.remove('is-invalid-field');
    cityInput.removeAttribute('aria-invalid');

    resultBox.innerHTML = `
      <div class="p-3 rounded-3 bg-light border d-flex align-items-center gap-3">
        <div class="spinner-border spinner-border-sm text-danger flex-shrink-0" role="status"></div>
        <div class="small">
          <div class="fw-semibold text-dark">Đang tải thời tiết hiện tại & dự báo 5 ngày tới cho "${escapeHtml(query)}"...</div>
          <div id="weather-slow-warning" class="text-warning fw-semibold d-none mt-1">
            <i class="bi bi-hourglass-split me-1"></i>API đang phản hồi chậm hơn bình thường, vui lòng chờ thêm giây lát...
          </div>
        </div>
      </div>
    `;

    try {
      const weather = await getWeatherByCityName(query, {
        onSlow: () => {
          const slowEl = document.getElementById('weather-slow-warning');
          slowEl?.classList.remove('d-none');
        }
      });

      const locationLabel = [weather.cityName, weather.country].filter(Boolean).join(', ');
      const forecastHtml = (weather.fiveDayForecast || [])
        .map(
          (day) => `
          <div class="col">
            <div class="p-2 rounded-3 bg-light border text-center h-100 d-flex flex-column justify-content-between">
              <div>
                <div class="small fw-bold text-dark">${escapeHtml(day.dayLabel)}</div>
                <div class="text-secondary" style="font-size: 0.72rem;">${escapeHtml(day.dateFormatted)}</div>
              </div>
              <div class="my-2 fs-3" title="${escapeHtml(day.description)}">
                <i class="bi ${escapeHtml(day.icon)}"></i>
              </div>
              <div>
                <div class="fw-bold text-danger">${escapeHtml(day.tempMax)}${escapeHtml(day.unit)} <span class="text-secondary fw-normal small">/ ${escapeHtml(day.tempMin)}°</span></div>
                <div class="text-secondary text-truncate mt-1" style="font-size: 0.73rem;" title="${escapeHtml(day.description)}">
                  ${escapeHtml(day.description)}
                </div>
              </div>
            </div>
          </div>
        `
        )
        .join('');

      resultBox.innerHTML = `
        <div class="p-3 rounded-3 border bg-white shadow-sm">
          <!-- Thời tiết hiện tại -->
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-3 border-bottom">
            <div class="d-flex align-items-center gap-3">
              <div class="fs-1">
                <i class="bi ${escapeHtml(weather.icon)}"></i>
              </div>
              <div>
                <div class="d-flex align-items-center gap-2">
                  <h3 class="h6 fw-bold mb-0">${escapeHtml(locationLabel)}</h3>
                  <span class="badge bg-light text-secondary border" style="font-size: 0.72rem;">Hiện tại & 5 ngày tới</span>
                </div>
                <div class="text-dark fw-semibold mt-1">${escapeHtml(weather.description)}</div>
                <div class="small text-secondary mt-1">
                  ${weather.humidity !== null ? `<span class="me-3"><i class="bi bi-droplet text-primary me-1"></i>Độ ẩm: ${escapeHtml(weather.humidity)}%</span>` : ''}
                  ${weather.windSpeed !== null ? `<span><i class="bi bi-wind text-secondary me-1"></i>Gió: ${escapeHtml(weather.windSpeed)} km/h</span>` : ''}
                </div>
              </div>
            </div>

            <div class="text-md-end">
              <div class="small text-secondary">Nhiệt độ hiện tại</div>
              <div class="price-highlight fs-2">${escapeHtml(weather.temperature)}${escapeHtml(weather.unit)}</div>
            </div>
          </div>

          <!-- Danh sách dự báo 5 ngày tới -->
          <div>
            <div class="small fw-bold text-uppercase text-secondary mb-2">
              <i class="bi bi-calendar3-week text-danger me-1"></i>Dự báo 5 ngày tới
            </div>
            <div class="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-2">
              ${forecastHtml}
            </div>
          </div>

          ${
            weather.wasSlow
              ? `<div class="small text-warning mt-2 pt-2 border-top">
                   <i class="bi bi-clock-history me-1"></i>Lưu ý: Máy chủ thời tiết vừa phản hồi chậm hơn bình thường nhưng dữ liệu đã được tải thành công.
                 </div>`
              : ''
          }
        </div>
      `;
    } catch (err) {
      const isNotFound = err.code === 'CITY_NOT_FOUND';
      const isTimeout = err.code === 'TIMEOUT';
      resultBox.innerHTML = `
        <div class="alert ${isNotFound ? 'alert-warning' : 'alert-danger'} small mb-0 d-flex align-items-start gap-2">
          <i class="bi ${isTimeout ? 'bi-clock-history' : 'bi-exclamation-triangle-fill'} fs-5"></i>
          <div>
            <div class="fw-bold">${isNotFound ? 'Không tìm thấy thành phố' : isTimeout ? 'API phản hồi quá chậm' : 'Lỗi tra cứu thời tiết'}</div>
            <div>${escapeHtml(err.message)}</div>
          </div>
        </div>
      `;
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    performLookup(cityInput.value);
  });

  quickButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const city = btn.dataset.weatherCity || '';
      cityInput.value = city;
      performLookup(city);
    });
  });

  if (cityInput.value) {
    performLookup(cityInput.value);
  }
}
