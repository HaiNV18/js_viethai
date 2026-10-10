import { getAllAccounts } from "../models/accountModel.js";

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllAccounts();

        return res.status(200).json({
            success: true,
            total: users.length,
            data: users
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách người dùng:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách người dùng"
        });
    }
};
