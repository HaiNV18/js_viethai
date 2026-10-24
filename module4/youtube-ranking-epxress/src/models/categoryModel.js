import pool from "../config/database.js";
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

export const getCategoryStats = async () => {
    const query = `
        SELECT
            c.id AS category_id,
            c.title_cat_prod AS category_name,
            c.slug_cat_prod AS category_slug,
            COUNT(p.id)::INT AS total_products,
            COALESCE(SUM(p.qty), 0)::INT AS total_stock,
            COALESCE(ROUND(AVG(p.price), 2), 0)::FLOAT AS avg_price, -- giá trung bình
            COALESCE(MIN(p.price), 0)::FLOAT AS min_price,  -- giá thấp nhất
            COALESCE(MAX(p.price), 0)::FLOAT AS max_price  -- giá cao nhất
        FROM category_product c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id, c.title_cat_prod, c.slug_cat_prod
        ORDER BY total_products DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
};

// export const getCategoryStatsPrisma = async () => {
//     const stats = await prisma.product.groupBy({
//         by: ['categoryId'],
//         _count: {
//             id: true,
//         },
//         _sum: {
//             qty: true,
//         },
//         _avg: {
//             price: true,
//         },
//         _min: {
//             price: true,
//         },
//         _max: {
//             price: true,
//         },
//     });

//     return stats;
// };
