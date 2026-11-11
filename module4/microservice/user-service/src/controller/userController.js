import { pool } from "../config/database.js";

const BUILDING_SERVICE_URL =
  process.env.BUILDING_SERVICE_URL ?? "http://localhost:3002";

export const getUserDetail = async (req, res) => {
  try {
    const idUser = Number(req.params.idUser);

    // 1. Tìm thông tin cá nhân của user từ bảng users trong MySQL
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [
      idUser,
    ]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({
        message: `Không tìm thấy user với id = ${idUser}`,
      });
    }

    // 2. Call API sang building-service để lấy thông tin căn hộ
    let apartment = null;
    if (user.id_apartment) {
      try {
        const response = await fetch(
          `${BUILDING_SERVICE_URL}/apartment/detail/${user.id_apartment}`
        );
        if (response.ok) {
          apartment = await response.json();
        } else {
          console.warn(
            `building-service trả về status ${response.status} cho idApart = ${user.id_apartment}`
          );
        }
      } catch (fetchError) {
        console.error(
          "Không thể kết nối tới building-service:",
          fetchError.message
        );
      }
    }

    // 3. Trả về cho user thông tin cá nhân và thông tin căn hộ
    return res.status(200).json({
      id: user.id,
      name: user.name,
      age: user.age,
      id_apartment: user.id_apartment,
      apartment,
    });
  } catch (error) {
    console.error("Error in getUserDetail:", error.message);
    return res.status(500).json({
      message: "Lỗi server tại user-service",
    });
  }
};
