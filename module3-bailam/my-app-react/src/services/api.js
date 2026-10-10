// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

// 1. Khởi tạo instance Axios
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Biến cờ kiểm tra xem có đang trong quá trình xin Token mới hay không
let isRefreshing = false;
// Hàng đợi các request bị tạm dừng chờ Token mới
let failedQueue = [];

// Hàm xử lý hàng đợi sau khi đã lấy được Token mới (hoặc thất bại)
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 2. Request Interceptor: Tự động đính kèm accessToken vào mọi Request gửi đi
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Response Interceptor: Bắt lỗi 401 để tự động Refresh Token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu bị lỗi 401 (Unauthorized) và request này chưa bị gọi lại lần nào
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Trường hợp 1: Đang có một request khác xin Token mới -> Cho request này vào hàng đợi chờ
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            // Đánh dấu request này đang retry
            originalRequest._retry = true;
            isRefreshing = true;

            // Lấy refreshToken từ localStorage
            const refreshToken = localStorage.getItem("refreshToken");

            // Nếu không có refreshToken -> Bắt buộc đăng xuất
            if (!refreshToken) {
                handleLogoutForce();
                return Promise.reject(error);
            }

            try {
                // Gọi API xin cấp lại accessToken mới
                // (Truyền refreshToken trong body hoặc header tùy backend của bạn)
                const res = await axios.post(`${API_BASE_URL}/refresh-token`, {
                    refreshToken: refreshToken,
                });

                if (res.data?.success) {
                    const newAccessToken = res.data.data.access_token;

                    // Lưu accessToken mới vào localStorage
                    localStorage.setItem("accessToken", newAccessToken);

                    // Cập nhật Token mới cho instance và request hiện tại
                    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Giải phóng hàng đợi các request đang chờ
                    processQueue(null, newAccessToken);

                    // Gửi lại request bị lỗi trước đó
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Nếu refreshToken cũng hết hạn hoặc không hợp lệ -> Xóa toàn bộ Token & Đăng xuất
                processQueue(refreshError, null);
                handleLogoutForce();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// Hàm hỗ trợ xóa dữ liệu và chuyển về màn hình Login khi Token hoàn toàn hết hạn
const handleLogoutForce = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
};

export default api;
