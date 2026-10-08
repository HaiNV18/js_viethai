export const authorizeMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role?.toUpperCase();
            console.log("Vai trò user:", req.user);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Bạn chưa đăng nhập"
                });
            }

            if (!roles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Bạn không có quyền truy cập"
                });
            }

            next();

        } catch (error) {
            console.error("Lỗi phân quyền:", error);

            return res.status(500).json({
                success: false,
                message: "Lỗi phân quyền"
            });
        }
    };
};
