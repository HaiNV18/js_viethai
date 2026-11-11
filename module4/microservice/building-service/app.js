import express from "express";
import { initDatabase } from "./src/config/database.js";
import apartmentRoutes from "./src/routes/apartmentRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", apartmentRoutes);

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Building Service đang chạy tại: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Không thể khởi tạo database tại Building Service:", err.message);
  });
