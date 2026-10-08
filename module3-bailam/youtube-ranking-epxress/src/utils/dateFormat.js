/**
 * Chuyển chuỗi "27/9/2026" thành JavaScript Date
 *
 * @param {string} dateString - Format: DD/MM/YYYY
 * @returns {Date}
 */
export const stringToDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);

    return new Date(year, month - 1, day);
};


/**
 * Lấy ngày hiện tại dạng chuỗi
 *
 * Ví dụ:
 * "2026-09-27"
 *
 * @returns {string}
 */
export const getCurrentDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


/**
 * Lấy ngày giờ hiện tại dạng chuỗi
 *
 * Ví dụ:
 * "2026-09-27 10:32:00"
 *
 * @returns {string}
 */
export const getCurrentDateTime = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getCurrentDateTimeVN = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
