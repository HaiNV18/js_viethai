import { Router } from "express";
import {ok} from "../error/ApiResponse.js";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import { validate } from "../middleware/validate.js";
import { addToCartWithTransaction } from "../models/cartModel.js";

const router = Router();

router.post("/cart/add", async (req, res) => {
    try {
        const { account_id, product_id, quantity } = req.body;

        if (!account_id || !product_id || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu account_id, product_id và quantity không hợp lệ"
            });
        }

        const result = await addToCartWithTransaction(account_id, product_id, quantity);

        return res.status(200).json({
            success: true,
            message: "Đã thêm sản phẩm vào giỏ hàng thành công",
            data: result
        });

    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể thêm sản phẩm vào giỏ hàng"
        });
    }
});

export default router;
