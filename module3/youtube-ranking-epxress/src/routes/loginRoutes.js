// src/routes/productRoutes.ts
import { Router } from "express";
import bcrypt from "bcrypt";
import {ok} from "../error/ApiResponse.js";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import { validate } from "../middleware/validate.js";

import { getLogin } from "../models/accountModel.js";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        const username  = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập tên đăng nhập và mật khẩu"
            });
        }

        const user = await getLogin(username);
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

        // login successful
        const { password: _, ...userWithoutPassword } = user;

        // if (!login) throw new AppError(404, "Tên đăng nhập hoặc mật khẩu sai");
        ok(res, userWithoutPassword);
    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể đăng nhập"
        });
    }
});


// 4 APIs
// login
// register
// forgot password
// logout



// function auth(req, res, next) {
//     // Validate dành cho login, register, v.v...
//     console.log("Middleware auth đang chạy...");
//     next();
// }
// app.use(auth);

export default router;
