import api from "./api";

// API Lấy danh sách người dùng (dành cho ADMIN)
export const userService = {
    getUsers: async () => {
        const response = await api.get("/admin/users");
        return response.data; // result { success: true, total: ..., data: [...] }
    },
};

export default userService;
