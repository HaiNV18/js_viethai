import jwt from "jsonwebtoken";

export const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token không tồn tại"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const accessToken = jwt.sign(
            {
                id: decoded.id,
                username: decoded.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "15m"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Tạo access token thành công",
            data: {
                access_token: accessToken
            }
        });

    } catch (error) {
        console.error("Refresh token error:", error);

        return res.status(401).json({
            success: false,
            message: "Refresh token không hợp lệ hoặc đã hết hạn"
        });
    }
};
