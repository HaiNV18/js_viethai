// src/routes/productRoutes.ts
import { Router } from "express";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import { validate } from "../middleware/validate.js";

import { forgotPasswordController } from "../controller/forgotPasswordController.js";
import { loginController } from "../controller/loginController.js";
// import { registerController } from "../controller/registerController.js";

const router = Router();

router.post("/login", loginController);

// router.post("/register", registerController);

router.post("/forgot-password", forgotPasswordController);

// router.post("/logout", logoutController);











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
