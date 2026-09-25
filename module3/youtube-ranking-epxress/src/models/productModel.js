import pool from "../config/database.js";

export const getAllProducts = async () => {
    const query = `
        SELECT *
        FROM public.products
        ORDER BY id;
    `;

    const { rows } = await pool.query(query); // Run query

    return rows;
};


export const getProduct = async (id) => {
    const query = `
        SELECT *
        FROM public.products
        WHERE id = $1;
    `;

    const { rows } = await pool.query(query, [id]);

    return rows;
};

export const createProduct = async (product) => {
    const {
        title_prod,
        code,
        category_id,
        brand_id,
        price,
        discount,
        discount_unit,
        qty,
        specifications,
        description,
        img_1,
        img_2,
        img_3,
    } = product;

    const queryInsertProduct = `
        INSERT INTO public.products (
            title_prod,
            code,
            category_id,
            brand_id,
            price,
            discount,
            discount_unit,
            qty,
            specifications,
            description,
            img_1,
            img_2,
            img_3
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13
        )
        RETURNING *;
    `;

    const values = [
        title_prod,
        code,
        category_id ?? null,
        brand_id ?? null,
        price ?? 0,
        discount ?? 0,
        discount_unit ?? "PERCENT",
        qty ?? 0,
        specifications ?? null,
        description ?? null,
        img_1 ?? null,
        img_2 ?? null,
        img_3 ?? null,
    ];

    const { rows } = await pool.query(queryInsertProduct, values);

    return rows[0];
};
