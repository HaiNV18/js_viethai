import {ok} from "../error/ApiResponse.js";
import { getAllProducts, getProduct } from "../models/productModel.js";

export const productCtrlGetAllProducts = async (req, res) => {
    try {
        const listProducts = await getAllProducts();

        res.status(200).json({
            success: true,
            data: listProducts
        });
    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách sản phẩm"
        });
    }
}
