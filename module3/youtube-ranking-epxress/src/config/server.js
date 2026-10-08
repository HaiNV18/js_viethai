require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

app.post("/send-email", async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject,
            text,
        });

        res.json({
            success: true,
            messageId: info.messageId,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Gửi email thất bại",
        });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
