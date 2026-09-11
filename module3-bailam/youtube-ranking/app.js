import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000; // lấy PORT=4000, không được thì lấy port 3000

console.log(process.env.PORT)

app.get("/", (req, res) => {
    res.json({ message: "Server đang chạy!" });
});

app.get("/hello-world", (req, res) => {
    res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});
