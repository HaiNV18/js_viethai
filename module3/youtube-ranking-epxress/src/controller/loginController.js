import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {ok} from "../error/ApiResponse.js";
import { getAccountByUsername } from "../models/accountModel.js";

export const loginController = async (req, res) => {
    try {
        const username  = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập tên đăng nhập và mật khẩu"
            });
        }

        const user = await getAccountByUsername(username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Tên đăng nhập hoặc mật khẩu không chính xác"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Tên đăng nhập hoặc mật khẩu không chính xác"
            });
        }

        // Tạo JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        // Không trả password về client
        const { password: _, ...userWithoutPassword } = user;

        return ok(res, {
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể đăng nhập"
        });
    }
}
