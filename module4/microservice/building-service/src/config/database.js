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

  // 2. Tạo 4 bảng: building, block, floor, room
  await pool.query(`
    CREATE TABLE IF NOT EXISTS building (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(500) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS block (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      id_building INT NOT NULL,
      FOREIGN KEY (id_building) REFERENCES building(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS floor (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      floor_number INT NOT NULL,
      id_block INT NOT NULL,
      FOREIGN KEY (id_block) REFERENCES block(id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS room (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      area VARCHAR(100) NOT NULL,
      bedrooms INT NOT NULL,
      id_floor INT NOT NULL,
      FOREIGN KEY (id_floor) REFERENCES floor(id) ON DELETE CASCADE
    );
  `);

  // 3. Seed dữ liệu mẫu nếu bảng building đang trống
  const [buildings] = await pool.query("SELECT COUNT(*) AS count FROM building");
  if (buildings[0].count === 0) {
    await pool.query(`
      INSERT INTO building (id, name, address) VALUES
      (1, 'Landmark 81', '720A Điện Biên Phủ, Bình Thạnh, TP.HCM'),
      (2, 'Sunrise City', '23 Nguyễn Hữu Thọ, Quận 7, TP.HCM');
    `);

    await pool.query(`
      INSERT INTO block (id, name, id_building) VALUES
      (1, 'Block A', 1),
      (2, 'Block B', 1),
      (3, 'Block V1', 2);
    `);

    await pool.query(`
      INSERT INTO floor (id, name, floor_number, id_block) VALUES
      (1, 'Tầng 10', 10, 1),
      (2, 'Tầng 15', 15, 2),
      (3, 'Tầng 5', 5, 3);
    `);

    await pool.query(`
      INSERT INTO room (id, name, area, bedrooms, id_floor) VALUES
      (101, 'A-10.01', '75m2', 2, 1),
      (102, 'B-15.02', '110m2', 3, 2),
      (103, 'V1-05.08', '60m2', 1, 3);
    `);
    console.log("Đã khởi tạo dữ liệu mẫu cho 4 bảng: building, block, floor, room");
  }

  console.log(`Building Service đã kết nối MySQL (database: ${DB_NAME})`);
}
