import express from "express";
import swaggerUi from "swagger-ui-express";
import { initDatabase } from "./src/config/database.js";
import { swaggerSpec } from "./src/config/swagger.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/", userRoutes);

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`User Service đang chạy tại: http://localhost:${PORT}`);
      console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("Không thể khởi tạo database tại User Service:", err.message);
  });
