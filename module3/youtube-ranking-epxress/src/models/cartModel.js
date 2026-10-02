import pool from "../config/database.js";

// BEGIN;
// SELECT id, qty, price
// FROM public.products
// WHERE id = 5
// FOR UPDATE;
export const addToCartWithTransaction = async (accountId, productId, quantity) => {
    // Lấy 1 connection riêng biệt từ Pool để quản lý Transaction
    const client = await pool.connect();

    try {
        // Bắt đầu Transaction
        await client.query("BEGIN");

        // Lấy thông tin sản phẩm & Khóa dòng (FOR UPDATE) để tránh race condition
        const checkStockQuery = `
            SELECT id, qty, price
            FROM public.products
            WHERE id = $1
            FOR UPDATE;
        `;
        const productRes = await client.query(checkStockQuery, [productId]);
        const product = productRes.rows[0];

        console.log("Thông tin sản phẩm:", product);

        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }

        if (product.qty < quantity) {
            throw new Error(`Sản phẩm chỉ còn ${product.qty} trong kho, không đủ số lượng yêu cầu!`);
        }

        // Thêm sản phẩm vào giỏ hàng (nếu đã có thì cộng dồn số lượng)
        const insertCartQuery = `
            INSERT INTO public.carts (account_id, product_id, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (account_id, product_id)
            DO UPDATE SET quantity = public.carts.quantity + $3
            RETURNING *;
        `;
        const cartRes = await client.query(insertCartQuery, [accountId, productId, quantity]);

        // Trừ số lượng tồn kho sản phẩm
        const updateStockQuery = `
            UPDATE public.products
            SET qty = qty - $1
            WHERE id = $2;
        `;
        await client.query(updateStockQuery, [quantity, productId]);

        // Nếu tất cả thành công -> COMMIT Transaction
        await client.query("COMMIT");

        return {
            cartItem: cartRes.rows[0],
            remainingStock: product.qty - quantity
        };

    } catch (error) {
        // Nếu có bất kỳ lỗi nào, ROLLBACK (Khôi phục dữ liệu như lúc chưa thực hiện)
        await client.query("ROLLBACK");
        throw error;
    } finally {
        // giải phóng client về lại Pool
        client.release();
    }
};
