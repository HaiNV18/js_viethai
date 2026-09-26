import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

router.get("/categories/all", async (req, res) => {
    try {
        const categories = await prisma.categoryProduct.findMany();

        return res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi kết nối cơ sở dữ liệu",
            error: error.message
        });
    }
});

router.get("/categories/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await prisma.categoryProduct.findUnique({
            where: {
                slugCatProd: slug,
            },
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục tương ứng với slug này",
            });
        }

        return res.json({
            success: true,
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi kết nối cơ sở dữ liệu",
            error: error.message
        });
    }
});

export default router;
