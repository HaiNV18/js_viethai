export const logoutController = async (req, res) => {
    try {
        // Xóa refresh token khỏi cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công"
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Không thể đăng xuất"
        });
    }
};
