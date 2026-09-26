import pool from "../config/database.js";

export const getLogin = async (username) => {
    const query = `
        SELECT id
            , firstname
            , lastname
            , username
            , email
            , phone
        FROM accounts
        WHERE username = $1
        ;
    `;

    const { rows } = await pool.query(query, [username]);

    return rows;
};
