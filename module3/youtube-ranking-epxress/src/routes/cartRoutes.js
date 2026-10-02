// src/routes/productRoutes.ts
import { Router } from "express";
import {ok} from "../error/ApiResponse.js";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import { validate } from "../middleware/validate.js";

const router = Router();


// router.post("/cart/add", async (req, res) => {
//     try {




//     } catch (error) {
//         console.error("Lỗi lấy products:", error);

//         res.status(500).json({
//             success: false,
//             message: "Không thể thêm sản phẩm vào giỏ hàng"
//         });
//     }
// });

export default router;
