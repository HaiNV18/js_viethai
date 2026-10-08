import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Không có Authorization header
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập"
            });
        }

        // Kiểm tra format: Bearer <token>
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization không hợp lệ"
            });
        }

        // Lấy token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token không tồn tại"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Lưu thông tin user vào request
        req.user = decoded; // chuyển token payload sang dạng có thể đọc được
        console.log("Thông tin user từ JWT:", req.user);

        // Cho phép đi tiếp
        next();

    } catch (error) {
        console.error("Lỗi xác thực JWT:", error.message);

        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
};
