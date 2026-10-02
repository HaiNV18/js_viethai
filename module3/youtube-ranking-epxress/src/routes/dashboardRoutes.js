// src/routes/productRoutes.ts
import { Router } from "express";
import {ok} from "../error/ApiResponse.js";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import { validate } from "../middleware/validate.js";

const router = Router();

// Code này do Copilot đề xuất
router.get("/dashboard", async (req, res) => {
    try {
        // Thống kê số lượng sản phẩm theo danh mục
        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Trả về kết quả thống kê
        res.status(200).json({
            success: true,
            data: categoryStats
        });

    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy thống kê dashboard"
        });
    }
});

export default router;
