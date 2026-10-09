import pool from "../config/database.js";

export const getCommentsByUserId = async (userId) => {
    const query = `
        SELECT id, user_id, target_type, target_id, content, rating, created_at
        FROM comments
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
};
