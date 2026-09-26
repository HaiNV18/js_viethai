import prisma from "../config/prisma.js";

export const getAllCategoryProducts = async () => {
    try {
        const categories = await prisma.categoryProduct.findMany();
        return categories;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách category_product:", error);
        throw error;
    }
};

export const getProductByCategory = async (category, id) => {
    const product = await prisma.product.findFirst({
        where: {
            id: Number(id),
            category: {
                name: category,
            },
        },
    });

    return product;
};
