import bcrypt from "bcrypt";
import {ok} from "../error/ApiResponse.js";
import { getAccountByEmail, updateAccountPassword } from "../models/accountModel.js";
import { generatePassword } from "../utils/passwordUtils.js";

export const forgotPasswordController = async (req, res) => {
    try {
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập địa chỉ email"
            });
        }

        const user = await getAccountByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email không tồn tại"
            });
        }

        // Generate new password
        const newPassword = generatePassword(6);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update account
        await updateAccountPassword(email, hashedPassword);

        res.status(200).json({
            success: true,
            message: "Mật khẩu đã được đặt lại. Vui lòng kiểm tra email của bạn.",
            data: { newPassword }
        });
    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể tạo mật khẩu mới"
        });
    }
}
