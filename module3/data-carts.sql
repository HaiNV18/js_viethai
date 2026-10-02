CREATE TABLE public.carts (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Khoá ngoại liên kết tới bảng accounts và products
    CONSTRAINT fk_cart_account FOREIGN KEY (account_id) 
        REFERENCES public.accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) 
        REFERENCES public.products(id) ON DELETE CASCADE,

    -- Ràng buộc UNIQUE để một account chỉ có 1 dòng cho 1 product (Phục vụ ON CONFLICT DO UPDATE)
    CONSTRAINT uq_account_product UNIQUE (account_id, product_id)
);