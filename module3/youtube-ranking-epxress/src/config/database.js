import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // cài npm install dotenv

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_LOCAL,
});

// const pool = new Pool({
//   host:     process.env.DB_HOST     ?? "localhost",
//   port:     Number(process.env.DB_PORT) ?? 5432,
//   user:     process.env.DB_USER     ?? "postgres",
//   password: process.env.DB_PASSWORD ?? "",
//   database: process.env.DB_NAME     ?? "school_db",
//   max:                 10,   // tối đa 10 connection đồng thời
//   idleTimeoutMillis:   30000,
//   connectionTimeoutMillis: 2000,
// });

pool.connect()
    .then(() => console.log("Kết nối PostgreSQL thành công"))
    .catch((err) => console.error("Lỗi kết nối:", err.message));

export default pool;
