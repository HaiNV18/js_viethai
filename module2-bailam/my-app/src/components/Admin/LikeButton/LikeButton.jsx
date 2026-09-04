import { memo, useState } from "react";
import "./LikeButton.css";

const LikeButton = memo(() => {
    console.log("Kiểm tra LikeButton render");

    // State lưu số lượng lượt thích
    const [likes, setLikes] = useState(0);

    // Biến phụ thuộc
    const isLiked = likes > 0;

    function randomString(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }

    console.log(randomString());



    return (
        <div className="like-container">
            <button
                className={isLiked ? "liked" : ""}
                onClick={() => setLikes(likes + 1)}
            >
                {isLiked ? "❤️ Đã Thích" : "🤍 Chưa Thích"}
            </button>

            <p>Số lượt thích: {likes}</p>

        </div>
    );
});

export default LikeButton;
