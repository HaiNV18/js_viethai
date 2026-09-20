import express from "express";

import productRoutes from "./src/routes/productRoutes.js";
import listChannelRoutes from "./src/routes/api-youtube/listChannelRoutes.js";
import detailChannelRoutes from "./src/routes/api-youtube/detailChannelRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 3000; // lấy PORT=4000, không được thì lấy port 3000
console.log(process.env.PORT)

// 0. CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

// 1. Built-in middleware — có sẵn trong Express
app.use(express.json());           // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data

function auth(req, res, next) {
    console.log("Middleware auth đang chạy...");
    next();
}
app.use(auth);

// 2. Custom middleware — tự viết
function logger(req, res, next) {
    console.log("Middleware logger đang chạy...");
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}
app.use(logger);

// 3. Error-handling middleware — 4 tham số, đặt cuối cùng
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: "Lỗi server" });
});

// http://localhost:4000/api/v1/products
app.use("/api/v1", productRoutes);

// API YOUTUBE
app.use("/api/v1", listChannelRoutes);
app.use("/api/v1", detailChannelRoutes);








app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});
