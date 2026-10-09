import { getCommentsByUserId } from "../models/commentModel.js";

export const getMyCommentsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const comments = await getCommentsByUserId(userId);

        return res.status(200).json({
            success: true,
            total: comments.length,
            data: comments
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách bình luận:", error);
        return res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách bình luận"
        });
    }
};
