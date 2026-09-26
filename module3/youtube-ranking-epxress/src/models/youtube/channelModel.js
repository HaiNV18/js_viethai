import pool from "../../config/database.js"

export const getListIdChannel = async () => {
    const query = `
        SELECT id
            , name
        FROM channels
        ;
    `;

    const { rows } = await pool.query(query);

    return rows;
};

export const updateChannelSubscribers = async (id, subscribers, subscribersFormatted) => {
    const query = `
        UPDATE channels
        SET subscribers = $1,
            subscribers_formatted = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3;
    `;
    await pool.query(query, [subscribers, subscribersFormatted, id]);
};
