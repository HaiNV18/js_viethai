import { pool } from "../config/database.js";

export const getApartmentDetail = async (req, res) => {
  try {
    const idApart = Number(req.params.idApart);

    // 1. Tìm room (căn hộ) theo idApart từ MySQL
    const [rooms] = await pool.query("SELECT * FROM room WHERE id = ?", [
      idApart,
    ]);
    const room = rooms[0];

    if (!room) {
      return res.status(404).json({
        message: `Không tìm thấy căn hộ với id = ${idApart}`,
      });
    }

    // 2. Tìm floor theo room.id_floor
    const [floors] = await pool.query("SELECT * FROM floor WHERE id = ?", [
      room.id_floor,
    ]);
    const floor = floors[0] || null;

    // 3. Tìm block theo floor.id_block
    let block = null;
    if (floor) {
      const [blocks] = await pool.query("SELECT * FROM block WHERE id = ?", [
        floor.id_block,
      ]);
      block = blocks[0] || null;
    }

    // 4. Tìm building theo block.id_building
    let building = null;
    if (block) {
      const [buildings] = await pool.query(
        "SELECT * FROM building WHERE id = ?",
        [block.id_building]
      );
      building = buildings[0] || null;
    }

    return res.status(200).json({
      id: room.id,
      room: {
        id: room.id,
        name: room.name,
        area: room.area,
        bedrooms: room.bedrooms,
      },
      floor: floor
        ? {
            id: floor.id,
            name: floor.name,
            floor_number: floor.floor_number,
          }
        : null,
      block: block
        ? {
            id: block.id,
            name: block.name,
          }
        : null,
      building: building
        ? {
            id: building.id,
            name: building.name,
            address: building.address,
          }
        : null,
    });
  } catch (error) {
    console.error("Error in getApartmentDetail:", error.message);
    return res.status(500).json({
      message: "Lỗi server tại building-service",
    });
  }
};
