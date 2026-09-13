import express from "express";
import DetailYoutubeChannelRouter from "./api-youtube/detail-channel.js";
import ListYoutubeChannelRouter from "./api-youtube/list-channel.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// YouTube Channel APIs
app.use("/api/v1", DetailYoutubeChannelRouter);
app.use("/api/v1", ListYoutubeChannelRouter);

app.get("/", (req, res) => {
    res.json({
        message: "Server is running!"
    });
});

app.get("/hello-world", (req, res) => {
    res.json({
        message: "Hello World!"
    });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
