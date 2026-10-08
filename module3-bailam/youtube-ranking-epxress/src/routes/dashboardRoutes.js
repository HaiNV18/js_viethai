import { Router } from "express";
import {ok} from "../error/ApiResponse.js";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import { validate } from "../middleware/validate.js";
import { getCategoryStats } from "../models/categoryModel.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeMiddleware } from "../middleware/authorizeMiddleware.js";

const router = Router();

router.get("/dashboard", authMiddleware, authorizeMiddleware(["ADMIN", "USER"]), async (req, res) => {
    try {
        // req.user chứa thông tin lấy từ JWT
        console.log("User:", req.user);

        // Thống kê số lượng sản phẩm theo danh mục
        const categoryStats = await getCategoryStats();
        const grandTotalProducts = categoryStats.reduce((sum, item) => sum + item.total_products, 0);
        const grandTotalStock = categoryStats.reduce((sum, item) => sum + item.total_stock, 0);

        res.status(200).json({
            success: true,
            data: {
                categoryStats,
                grandTotalProducts,
                grandTotalStock
            }
        });

    } catch (error) {
        console.error("Lỗi thống kê:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy thống kê dashboard"
        });
    }
});

export default router;
