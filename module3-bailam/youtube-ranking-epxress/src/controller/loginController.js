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

        console.log(user);

        // Tạo access token và refresh token
        const accessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "15m"
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
            }
        );

        // Cho refresh token vào cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Không trả password về client
        const { password: _, ...userWithoutPassword } = user;

        return ok(res, {
            user: userWithoutPassword,
            access_token: accessToken
            // refresh_token: refreshToken // có thể bỏ refresh token trong response
        });
    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể đăng nhập"
        });
    }
}
