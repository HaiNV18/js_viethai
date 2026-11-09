/**
 * Dịch vụ tra cứu thời tiết hiện tại theo tên thành phố sử dụng Open-Meteo API
 * (Miễn phí, không cần API Key).
 *
 * Lưu ý kiến trúc theo GEMINI.md:
 * Quy tắc dự án bắt buộc "Không tạo backend, server API hay hệ thống đăng nhập backend".
 * Vì vậy module này đóng vai trò tầng dịch vụ dữ liệu (Service Layer) tách biệt,
 * gọi Open-Meteo Geocoding & Forecast API, chuẩn hóa dữ liệu trả về (nhiệt độ + mô tả ngắn gọn),
 * đồng thời xử lý lỗi không tìm thấy thành phố và cảnh báo/ngắt kết nối khi API phản hồi chậm.
 */

import { escapeHtml } from './app.js';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

const SLOW_RESPONSE_THRESHOLD_MS = 2500;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * Bản đồ mã thời tiết WMO (World Meteorological Organization) sang mô tả tiếng Việt ngắn gọn và icon
 */
const WMO_WEATHER_MAP = {
  0: { description: 'Trời quang đãng, nắng đẹp', icon: 'bi-sun-fill text-warning' },
  1: { description: 'Trời ít mây, nắng nhẹ', icon: 'bi-cloud-sun-fill text-warning' },
  2: { description: 'Mây rải rác', icon: 'bi-cloud-sun text-secondary' },
  3: { description: 'Trời nhiều mây, âm u', icon: 'bi-clouds-fill text-secondary' },
  45: { description: 'Có sương mù nhẹ', icon: 'bi-cloud-fog2-fill text-secondary' },
  48: { description: 'Sương mù dày đặc', icon: 'bi-cloud-fog2-fill text-secondary' },
  51: { description: 'Mưa phùn nhẹ', icon: 'bi-cloud-drizzle-fill text-info' },
  53: { description: 'Mưa phùn vừa', icon: 'bi-cloud-drizzle-fill text-info' },
  55: { description: 'Mưa phùn nặng hạt', icon: 'bi-cloud-drizzle-fill text-primary' },
  61: { description: 'Mưa nhỏ rải rác', icon: 'bi-cloud-rain-fill text-info' },
  63: { description: 'Mưa vừa', icon: 'bi-cloud-rain-fill text-primary' },
  65: { description: 'Mưa to', icon: 'bi-cloud-rain-heavy-fill text-primary' },
  71: { description: 'Tuyết rơi nhẹ', icon: 'bi-snow text-info' },
  73: { description: 'Tuyết rơi vừa', icon: 'bi-snow2 text-info' },
  75: { description: 'Tuyết rơi dày', icon: 'bi-snow3 text-primary' },
  80: { description: 'Mưa rào nhẹ', icon: 'bi-cloud-rain-fill text-info' },
  81: { description: 'Mưa rào vừa', icon: 'bi-cloud-rain-heavy-fill text-primary' },
  82: { description: 'Mưa rào lớn', icon: 'bi-cloud-rain-heavy-fill text-danger' },
  95: { description: 'Có dông sét', icon: 'bi-cloud-lightning-rain-fill text-danger' },
  96: { description: 'Dông kèm mưa đá nhẹ', icon: 'bi-cloud-lightning-rain-fill text-danger' },
  99: { description: 'Dông bão mạnh', icon: 'bi-cloud-lightning-rain-fill text-danger' }
};

/**
 * Tra cứu mô tả ngắn gọn và icon từ mã WMO
 */
export function decodeWmoWeather(code) {
  const numericCode = Number(code);
  if (WMO_WEATHER_MAP[numericCode]) {
    return WMO_WEATHER_MAP[numericCode];
  }
  return {
    description: 'Thời tiết ổn định',
    icon: 'bi-cloud-sun text-secondary'
  };
}

/**
 * Gọi API với bộ đếm phát hiện phản hồi chậm (onSlow) và tự động hủy khi quá thời gian chờ (timeoutMs)
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
      throw new Error(`HTTP_${response.status}`);
    }
    const data = await response.json();
    return { data, wasSlow: isSlowTriggered };
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error(
        'Dịch vụ thời tiết Open-Meteo phản hồi quá chậm (quá thời gian chờ 8 giây). Vui lòng thử lại sau.'
      );
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }
    const netError = new Error('Không thể kết nối tới dịch vụ thời tiết Open-Meteo. Vui lòng kiểm tra kết nối mạng.');
    netError.code = 'NETWORK_ERROR';
    throw netError;
  } finally {
    clearTimeout(slowTimer);
    clearTimeout(timeoutTimer);
  }
}

/**
 * Lấy thông tin thời tiết hiện tại theo tên thành phố từ Open-Meteo.
 * Trả về: { cityName, country, admin1, temperature, unit, description, icon, windSpeed, humidity, wasSlow }
 */
export async function getWeatherByCityName(cityNameInput, { onSlow } = {}) {
  const cleanName = (cityNameInput || '').trim();
  if (!cleanName) {
    const emptyErr = new Error('Vui lòng nhập tên thành phố cần xem thời tiết.');
    emptyErr.code = 'EMPTY_INPUT';
    throw emptyErr;
  }

  // Bước 1: Tìm tọa độ (latitude, longitude) từ tên thành phố qua Open-Meteo Geocoding API
  const geoUrl = `${GEOCODING_API_URL}?name=${encodeURIComponent(cleanName)}&count=1&language=vi&format=json`;
  const { data: geoData, wasSlow: geoSlow } = await fetchWithTimeoutAndSlowNotice(geoUrl, { onSlow });

  if (!geoData || !Array.isArray(geoData.results) || geoData.results.length === 0) {
    const notFoundErr = new Error(
      `Không tìm thấy thành phố "${cleanName}". Vui lòng kiểm tra lại chính tả (ví dụ: Hà Nội, Đà Nẵng, Phú Quốc, Singapore, Bangkok).`
    );
    notFoundErr.code = 'CITY_NOT_FOUND';
    throw notFoundErr;
  }

  const location = geoData.results[0];
  const { latitude, longitude, name, country, admin1 } = location;

  // Bước 2: Lấy nhiệt độ hiện tại và mã thời tiết WMO qua Open-Meteo Forecast API
  const weatherUrl = `${FORECAST_API_URL}?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(
    longitude
  )}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

  const { data: weatherData, wasSlow: forecastSlow } = await fetchWithTimeoutAndSlowNotice(weatherUrl, { onSlow });

  const current = weatherData?.current;
  if (!current || typeof current.temperature_2m !== 'number') {
    const invalidErr = new Error('Dữ liệu thời tiết trả về không đầy đủ. Vui lòng thử lại.');
    invalidErr.code = 'INVALID_DATA';
    throw invalidErr;
  }

  const decoded = decodeWmoWeather(current.weather_code);
  const unit = weatherData?.current_units?.temperature_2m || '°C';

  return {
    cityName: name,
    admin1: admin1 || '',
    country: country || '',
    latitude,
    longitude,
    temperature: Math.round(current.temperature_2m * 10) / 10,
    unit,
    description: decoded.description,
    icon: decoded.icon,
    humidity: current.relative_humidity_2m ?? null,
    windSpeed: current.wind_speed_10m ?? null,
    wasSlow: Boolean(geoSlow || forecastSlow)
  };
}

/**
 * Khởi tạo Widget tra cứu thời tiết theo thành phố trên Trang chủ (index.html)
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
          <div class="fw-semibold text-dark">Đang lấy dữ liệu thời tiết cho "${escapeHtml(query)}" từ Open-Meteo...</div>
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

      resultBox.innerHTML = `
        <div class="p-3 rounded-3 border bg-white shadow-sm">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div class="d-flex align-items-center gap-3">
              <div class="fs-1">
                <i class="bi ${escapeHtml(weather.icon)}"></i>
              </div>
              <div>
                <div class="d-flex align-items-center gap-2">
                  <h3 class="h6 fw-bold mb-0">${escapeHtml(locationLabel)}</h3>
                  <span class="badge bg-light text-secondary border" style="font-size: 0.72rem;">Open-Meteo Live</span>
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
          ${
            weather.wasSlow
              ? `<div class="small text-warning mt-2 pt-2 border-top">
                   <i class="bi bi-clock-history me-1"></i>Lưu ý: Máy chủ Open-Meteo vừa phản hồi chậm hơn bình thường nhưng dữ liệu đã được tải thành công.
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

  // Tự động tra cứu mặc định thành phố Hà Nội khi mở trang chủ
  if (cityInput.value) {
    performLookup(cityInput.value);
  }
}
