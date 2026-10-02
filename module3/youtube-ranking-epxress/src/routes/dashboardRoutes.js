// src/routes/productRoutes.ts
import { Router } from "express";
import {ok} from "../error/ApiResponse.js";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import { validate } from "../middleware/validate.js";
import { getCategoryStats } from "../models/categoryModel.js";

const router = Router();

router.get("/dashboard", async (req, res) => {
    try {
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
