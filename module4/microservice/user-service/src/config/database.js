import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root",
};

const DB_NAME = process.env.DB_NAME ?? "microservice_db";

export const pool = mysql.createPool({
  ...DB_CONFIG,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function initDatabase() {
  // 1. Kết nối tới MySQL để tạo database nếu chưa tồn tại
  const tempConn = await mysql.createConnection(DB_CONFIG);
  await tempConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await tempConn.end();

  // 2. Tạo bảng users
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      id_apartment INT NOT NULL
    );
  `);

  // 3. Seed dữ liệu mẫu nếu bảng users đang trống
  const [users] = await pool.query("SELECT COUNT(*) AS count FROM users");
  if (users[0].count === 0) {
    await pool.query(`
      INSERT INTO users (id, name, age, id_apartment) VALUES
      (1, 'Nguyễn Văn A', 28, 101),
      (2, 'Trần Thị B', 32, 102),
      (3, 'Lê Văn C', 25, 103);
    `);
    console.log("Đã khởi tạo dữ liệu mẫu cho bảng: users");
  }

  console.log(`User Service đã kết nối MySQL (database: ${DB_NAME})`);
}
