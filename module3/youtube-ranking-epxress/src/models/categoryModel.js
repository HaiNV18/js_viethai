import prisma from "../config/prisma.js";

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
