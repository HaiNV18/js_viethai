import pool from "../config/database.js";

export const getAccountByUsername = async (username) => {
    const query = `
        SELECT id
            , firstname
            , lastname
            , username
            , password
            , email
            , phone
            , role
        FROM accounts
        WHERE username = $1;
    `;

    const { rows } = await pool.query(query, [username]);

    return rows[0];
};

export const getAccountByEmail = async (email) => {
    const query = `
        SELECT id
            , firstname
            , lastname
            , username
            , password
            , email
            , phone
        FROM accounts
        WHERE email = $1;
    `;

    const { rows } = await pool.query(query, [email]);

    return rows[0];
};

export const updateAccountPassword = async (email, hashedPassword) => {
    const query = `
        UPDATE accounts
        SET password = $1
        WHERE email = $2;
    `;

    const { rows } = await pool.query(query, [hashedPassword, email]);

    return rows[0];
};
