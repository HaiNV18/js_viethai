-- 1. Tạo bảng comments
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    target_type VARCHAR(50) NOT NULL DEFAULT 'PRODUCT', -- 'PRODUCT' hoặc 'CHANNEL'
    target_id VARCHAR(255) NOT NULL,                    -- ID của Sản phẩm hoặc Kênh YouTube
    content TEXT NOT NULL,                               -- Nội dung bình luận
    rating INT CHECK (rating >= 1 AND rating <= 5),      -- Đánh giá số sao (1 đến 5 sao)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Khóa ngoại nối đến bảng accounts (nếu xóa account thì tự động xóa comments của user đó)
    CONSTRAINT fk_comments_account 
        FOREIGN KEY (user_id) 
        REFERENCES accounts(id) 
        ON DELETE CASCADE
);

-- 2. Tạo Index giúp tìm kiếm bình luận theo user_id siêu nhanh
CREATE INDEX idx_comments_user_id ON comments(user_id);

INSERT INTO comments (user_id, target_type, target_id, content, rating)
VALUES 
(1, 'PRODUCT', '3', 'Sản phẩm Samsung S24 xài rất mượt, pin trâu!', 5),
(2, 'PRODUCT', '3', 'Sản phẩm không tốt lắm', 2)
;

