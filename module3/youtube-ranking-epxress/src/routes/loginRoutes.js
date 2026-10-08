import { Router } from "express";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import { validate } from "../middleware/validate.js";

import { forgotPasswordController } from "../controller/forgotPasswordController.js";
import { loginController } from "../controller/loginController.js";
import { logoutController } from "../controller/logoutController.js";
import { refreshTokenController } from "../controller/refreshTokenController.js";
// import { registerController } from "../controller/registerController.js";

const router = Router();

router.post("/login", loginController);

// router.post("/register", registerController);

router.post("/forgot-password", forgotPasswordController);

router.post("/logout", logoutController);

router.post("/refresh-token", refreshTokenController); // tạo access token mới từ refresh token










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
