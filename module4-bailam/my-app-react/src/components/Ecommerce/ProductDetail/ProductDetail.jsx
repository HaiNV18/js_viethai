import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaStar,
    FaRegStar,
    FaShoppingCart,
    FaBolt,
    FaGift,
    FaShieldAlt,
    FaTruck,
    FaSyncAlt,
    FaCheckCircle,
    FaArrowRight
} from "react-icons/fa";
import "./ProductDetail.css";

// 1. Dữ liệu kho sản phẩm mẫu
const ALL_PRODUCTS = [
    {
        id: 1,
        name: "Samsung Galaxy S24 Ultra 5G",
        brand: "Samsung",
        price: 27990000,
        originalPrice: 33990000,
        // 1 ảnh thumbnail chính và 3 ảnh góc nhìn khác
        images: [
            "/asset/img/products/samsung-s24.jpg",
            "/asset/img/products/samsung-galaxy-s26.jpg",
            "/asset/img/products/samsung-galaxy-a57.jpg",
            "/asset/img/products/samsung-galaxy-s5.jpg",
        ],
        specs: [
            { label: "Màn hình", value: "6.8 inch, Dynamic AMOLED 2X, QHD+, 120Hz" },
            { label: "Hệ điều hành", value: "Android 14, One UI 6.1 (Tích hợp Galaxy AI)" },
            { label: "Camera sau", value: "Chính 200 MP, Phụ 50 MP, 12 MP, 10 MP" },
            { label: "Camera trước", value: "12 MP, f/2.2, quay video 4K 60fps" },
            { label: "Chipset (CPU)", value: "Snapdragon 8 Gen 3 for Galaxy 8 nhân" },
            { label: "RAM", value: "12 GB" },
            { label: "Dung lượng lưu trữ", value: "256 GB" },
            { label: "SIM", value: "2 Nano SIM hoặc 1 eSIM + 1 Nano SIM, Hỗ trợ 5G" },
            { label: "Pin, Sạc", value: "5.000 mAh, Sạc nhanh có dây 45W" },
        ],
    },
    {
        id: 2,
        name: "iPhone 15 Pro Max 256GB",
        brand: "Apple",
        price: 29490000,
        originalPrice: 34990000,
        images: [
            "/asset/img/products/iphone15.jpg",
            "/asset/img/products/samsung-s24.jpg",
            "/asset/img/products/oppo-find-x9-pro.jpg",
            "/asset/img/products/xiaomi14.jpg",
        ],
        specs: [
            { label: "Màn hình", value: "6.7 inch, Super Retina XDR OLED, 120Hz ProMotion" },
            { label: "Hệ điều hành", value: "iOS 17" },
            { label: "Camera sau", value: "Chính 48 MP, Phụ 12 MP (Ultra Wide), 12 MP (Tele 5x)" },
            { label: "Camera trước", value: "12 MP TrueDepth, khẩu độ f/1.9" },
            { label: "Chipset (CPU)", value: "Apple A17 Pro 6 nhân thế hệ mới" },
            { label: "RAM", value: "8 GB" },
            { label: "Dung lượng lưu trữ", value: "256 GB" },
            { label: "SIM", value: "1 eSIM + 1 Nano SIM" },
            { label: "Pin, Sạc", value: "4.422 mAh, Sạc nhanh 20W, MagSafe 15W" },
        ],
    },
    {
        id: 3,
        name: "Oppo Find X9 Pro 5G",
        brand: "Oppo",
        price: 21990000,
        originalPrice: 24990000,
        images: [
            "/asset/img/products/oppo-find-x9-pro.jpg",
            "/asset/img/products/xiaomi14.jpg",
            "/asset/img/products/samsung-s24.jpg",
            "/asset/img/products/iphone15.jpg",
        ],
        specs: [
            { label: "Màn hình", value: "6.78 inch, AMOLED 1.5K, 120Hz" },
            { label: "Hệ điều hành", value: "ColorOS 14 (Android 14)" },
            { label: "Camera sau", value: "Chính 50 MP, Phụ 50 MP, 50 MP (Hasselblad)" },
            { label: "Camera trước", value: "32 MP, f/2.4" },
            { label: "Chipset (CPU)", value: "MediaTek Dimensity 9300" },
            { label: "RAM", value: "16 GB" },
            { label: "Dung lượng lưu trữ", value: "512 GB" },
            { label: "Pin, Sạc", value: "5.400 mAh, SuperVOOC 100W" },
        ],
    },
    {
        id: 4,
        name: "Xiaomi 14 Leica 5G",
        brand: "Xiaomi",
        price: 18990000,
        originalPrice: 22990000,
        images: [
            "/asset/img/products/xiaomi14.jpg",
            "/asset/img/products/samsung-s24.jpg",
            "/asset/img/products/iphone15.jpg",
            "/asset/img/products/oppo-find-x9-pro.jpg",
        ],
        specs: [
            { label: "Màn hình", value: "6.36 inch, LTPO OLED 120Hz" },
            { label: "Hệ điều hành", value: "Xiaomi HyperOS (Android 14)" },
            { label: "Camera sau", value: "Chính 50 MP, Tele 50 MP, Siêu rộng 50 MP (Leica)" },
            { label: "Camera trước", value: "32 MP" },
            { label: "Chipset (CPU)", value: "Snapdragon 8 Gen 3" },
            { label: "RAM", value: "12 GB" },
            { label: "Dung lượng lưu trữ", value: "256 GB" },
            { label: "Pin, Sạc", value: "4.610 mAh, HyperCharge 90W" },
        ],
    },
    {
        id: 5,
        name: "Samsung Galaxy A57 5G",
        brand: "Samsung",
        price: 8490000,
        originalPrice: 9990000,
        images: [
            "/asset/img/products/samsung-galaxy-a57.jpg",
            "/asset/img/products/samsung-s24.jpg",
            "/asset/img/products/samsung-galaxy-s5.jpg",
            "/asset/img/products/iphone15.jpg",
        ],
        specs: [
            { label: "Màn hình", value: "6.6 inch, Super AMOLED 120Hz" },
            { label: "Hệ điều hành", value: "Android 14" },
            { label: "Camera sau", value: "Chính 50 MP OIS, Phụ 8 MP, 2 MP" },
            { label: "Camera trước", value: "13 MP" },
            { label: "Chipset (CPU)", value: "Exynos 1480" },
            { label: "RAM", value: "8 GB" },
            { label: "Dung lượng lưu trữ", value: "128 GB" },
            { label: "Pin, Sạc", value: "5.000 mAh, Sạc nhanh 25W" },
        ],
    },
];

function ProductDetail() {
    const { id } = useParams();

    // 1. Tìm sản phẩm hiện tại theo ID (fallback về sản phẩm đầu tiên nếu ID không tìm thấy)
    const product = useMemo(() => {
        const found = ALL_PRODUCTS.find((p) => p.id === Number(id));
        return found || ALL_PRODUCTS[0];
    }, [id]);

    // 2. State quản lý hình ảnh được chọn để phóng to
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    // 3. State số lượng
    const [quantity, setQuantity] = useState(1);

    // 4. Danh sách đánh giá mẫu
    const [reviews, setReviews] = useState([
        {
            id: 1,
            author: "Nguyễn Hoàng Nam",
            rating: 5,
            date: "12/10/2026",
            comment: "Máy dùng siêu mượt, camera chụp đêm đỉnh chóp. Giao hàng nội thành chỉ hơn 1 tiếng là nhận được!",
        },
        {
            id: 2,
            author: "Trần Mai Anh",
            rating: 5,
            date: "05/10/2026",
            comment: "Sản phẩm nguyên seal chính hãng, nhân viên tư vấn nhiệt tình, chế độ bảo hành rõ ràng.",
        },
        {
            id: 3,
            author: "Vũ Quốc Bảo",
            rating: 4,
            date: "28/09/2026",
            comment: "Màu sắc rất sang. Pin dùng cả ngày thoải mái tác vụ nặng, rất hài lòng với số tiền bỏ ra.",
        },
    ]);

    // Form thêm đánh giá mới
    const [reviewAuthor, setReviewAuthor] = useState("");
    const [reviewComment, setReviewComment] = useState("");
    const [reviewRating, setReviewRating] = useState(5);

    // Tự động cập nhật ảnh chính & cuộn màn hình lên đầu khi ID thay đổi
    useEffect(() => {
        setSelectedImage(product.images[0]);
        setQuantity(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [product]);

    // 5. Lấy ngẫu nhiên 4 sản phẩm liên quan (khác sản phẩm hiện tại)
    const relatedProducts = useMemo(() => {
        const others = ALL_PRODUCTS.filter((p) => p.id !== product.id);
        // Trộn ngẫu nhiên và lấy 4 phần tử
        return [...others].sort(() => 0.5 - Math.random()).slice(0, 4);
    }, [product.id]);

    // Xử lý gửi đánh giá
    const handleAddReview = (e) => {
        e.preventDefault();
        if (!reviewAuthor.trim() || !reviewComment.trim()) return;

        const newReviewObj = {
            id: Date.now(),
            author: reviewAuthor.trim(),
            rating: Number(reviewRating),
            date: new Date().toLocaleDateString("vi-VN"),
            comment: reviewComment.trim(),
        };

        setReviews([newReviewObj, ...reviews]);
        setReviewAuthor("");
        setReviewComment("");
    };

    // Format tiền tệ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    return (
        <div className="product-detail-page">
            <div className="detail-container">
                {/* BREADCRUMB */}
                <div className="breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <Link to={`/category/${product.brand.toLowerCase()}`}>{product.brand}</Link>
                    <span>/</span>
                    <span className="current">{product.name}</span>
                </div>

                {/* MAIN GRID: 2 CỘT */}
                <div className="product-main-grid">
                    {/* ========================================================
                        CỘT TRÁI: TÊN, ẢNH GALLERY, THÔNG SỐ & ĐÁNH GIÁ
                    ======================================================== */}
                    <div className="left-column">
                        {/* 1. Tên sản phẩm & Brand */}
                        <div className="product-header">
                            <span className="brand-tag">{product.brand}</span>
                            <h1 className="product-title">{product.name}</h1>
                            <div className="rating-summary">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="star-icon filled" />
                                    ))}
                                </div>
                                <span className="review-count">(128 đánh giá)</span>
                                <span className="sku">Mã SP: #{product.id}00{product.id}</span>
                            </div>
                        </div>

                        {/* 2. Gallery Ảnh: 1 Thumbnail lớn + 3 hình nhỏ bên dưới */}
                        <div className="gallery-section">
                            <div className="main-image-container">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="main-preview-image"
                                    onError={(e) => { e.target.src = "/asset/img/products/iphone15.jpg"; }}
                                />
                            </div>

                            <div className="thumbnails-row">
                                {product.images.map((imgSrc, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`thumb-btn ${selectedImage === imgSrc ? "active" : ""}`}
                                        onClick={() => setSelectedImage(imgSrc)}
                                    >
                                        <img
                                            src={imgSrc}
                                            alt={`Thumbnail ${idx + 1}`}
                                            onError={(e) => { e.target.src = "/asset/img/products/iphone15.jpg"; }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. Bảng thông số kỹ thuật (Table 2 cột chuẩn semantic) */}
                        <div className="specs-section">
                            <h2 className="section-heading">Thông số kỹ thuật</h2>
                            <div className="table-wrapper" tabIndex="0" role="region" aria-label="Bảng thông số kỹ thuật">
                                <table className="specs-table">
                                    <tbody>
                                        {product.specs.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{item.label}</th>
                                                <td>{item.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4. Phần đánh giá nhận xét */}
                        <div className="reviews-section">
                            <h2 className="section-heading">Đánh giá & Nhận xét</h2>

                            {/* Form viết đánh giá */}
                            <form className="review-form" onSubmit={handleAddReview}>
                                <h4>Gửi nhận xét của bạn</h4>
                                <div className="form-row">
                                    <input
                                        type="text"
                                        placeholder="Họ và tên của bạn..."
                                        value={reviewAuthor}
                                        onChange={(e) => setReviewAuthor(e.target.value)}
                                        required
                                    />
                                    <select
                                        value={reviewRating}
                                        onChange={(e) => setReviewRating(e.target.value)}
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐ (5 sao - Tuyệt vời)</option>
                                        <option value="4">⭐⭐⭐⭐ (4 sao - Rất tốt)</option>
                                        <option value="3">⭐⭐⭐ (3 sao - Bình thường)</option>
                                        <option value="2">⭐⭐ (2 sao - Chưa hài lòng)</option>
                                        <option value="1">⭐ (1 sao - Rất tệ)</option>
                                    </select>
                                </div>
                                <textarea
                                    rows="3"
                                    placeholder="Chia sẻ cảm nhận về hiệu năng, thiết kế, thời lượng pin..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn-submit-review">Gửi đánh giá</button>
                            </form>

                            {/* Danh sách các review đã có */}
                            <div className="reviews-list">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="review-item">
                                        <div className="review-item-header">
                                            <div className="reviewer-avatar">
                                                {rev.author.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <strong>{rev.author}</strong>
                                                <div className="review-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        i < rev.rating ? (
                                                            <FaStar key={i} className="star-icon filled" />
                                                        ) : (
                                                            <FaRegStar key={i} className="star-icon" />
                                                        )
                                                    ))}
                                                    <span className="review-date">{rev.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="review-body">{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ========================================================
                        CỘT PHẢI: GIÁ, CHƯƠNG TRÌNH KHUYẾN MÃI & NÚT MUA
                    ======================================================== */}
                    <div className="right-column">
                        <div className="sidebar-sticky-box">
                            {/* Khối giá */}
                            <div className="price-box">
                                <div className="current-price">{formatCurrency(product.price)}</div>
                                <div className="original-price-row">
                                    <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                                    <span className="discount-tag">
                                        Tiết kiệm {formatCurrency(product.originalPrice - product.price)}
                                    </span>
                                </div>
                            </div>

                            {/* Khối khuyến mãi */}
                            <div className="promo-box">
                                <div className="promo-title">
                                    <FaGift className="promo-icon" />
                                    <span>Chương trình khuyến mãi đặc quyền</span>
                                </div>
                                <ul className="promo-list">
                                    <li>
                                        <FaCheckCircle className="check-icon" />
                                        <span>Giảm ngay <strong>500.000 VNĐ</strong> khi thanh toán qua VNPay-QR hoặc MoMo.</span>
                                    </li>
                                    <li>
                                        <FaCheckCircle className="check-icon" />
                                        <span>Tặng củ sạc nhanh chính hãng và ốp lưng bảo vệ cao cấp.</span>
                                    </li>
                                    <li>
                                        <FaCheckCircle className="check-icon" />
                                        <span>Thu cũ đổi mới: Trợ giá thêm đến <strong>1.500.000 VNĐ</strong>.</span>
                                    </li>
                                    <li>
                                        <FaCheckCircle className="check-icon" />
                                        <span>Trả góp 0% lãi suất qua thẻ tín dụng (kỳ hạn 6-12 tháng).</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Chọn số lượng */}
                            <div className="quantity-row">
                                <span className="quantity-label">Số lượng:</span>
                                <div className="quantity-controls">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => q + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Nút hành động */}
                            <div className="action-buttons">
                                <button
                                    className="btn-buy-now"
                                    onClick={() => alert(`Đặt mua ngay: ${product.name} (SL: ${quantity})`)}
                                >
                                    MUA NGAY
                                </button>
                                <button
                                    className="btn-add-cart-detail"
                                    onClick={() => alert(`Đã thêm ${quantity} sản phẩm vào giỏ!`)}
                                >
                                    <FaShoppingCart /> THÊM VÀO GIỎ HÀNG
                                </button>
                            </div>

                            {/* Cam kết bán hàng */}
                            <div className="commitments-box">
                                <div className="commitment-item">
                                    <FaShieldAlt className="commit-icon" />
                                    <span>Bảo hành chính hãng 12 tháng tại các trung tâm ủy quyền.</span>
                                </div>
                                <div className="commitment-item">
                                    <FaSyncAlt className="commit-icon" />
                                    <span>Lỗi là đổi mới trong 30 ngày tận nhà.</span>
                                </div>
                                <div className="commitment-item">
                                    <FaTruck className="commit-icon" />
                                    <span>Miễn phí giao hàng trên toàn quốc.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    CUỐI TRANG: RELATED PRODUCTS (4 SẢN PHẨM NGẪU NHIÊN)
                ======================================================== */}
                <section className="related-section">
                    <div className="related-header">
                        <h2>Sản phẩm tương tự bạn có thể thích</h2>
                        <p>Các thiết bị cùng phân khúc nổi bật đang được ưa chuộng</p>
                    </div>

                    <div className="related-grid">
                        {relatedProducts.map((item) => (
                            <Link
                                to={`/product/${item.id}`}
                                key={item.id}
                                className="related-card"
                            >
                                <div className="related-image-box">
                                    <img
                                        src={item.images[0]}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = "/asset/img/products/iphone15.jpg"; }}
                                    />
                                </div>
                                <div className="related-body">
                                    <span className="related-brand">{item.brand}</span>
                                    <h4 className="related-name">{item.name}</h4>
                                    <div className="related-price">{formatCurrency(item.price)}</div>
                                    <span className="btn-view-detail">
                                        Xem chi tiết <FaArrowRight />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ProductDetail;
