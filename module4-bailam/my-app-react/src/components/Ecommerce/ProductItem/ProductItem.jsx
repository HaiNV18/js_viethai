import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import "./ProductItem.css";

// 1. Nhận dữ liệu 'product' được truyền từ component cha qua Props
function ProductItem({ product, onAddToCart }) {
    // 2. Destructuring để lấy các thuộc tính cần dùng
    const { id, name, brand, price, thumbnail, description } = product;

    // Format tiền tệ VNĐ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    // Xử lý sự kiện click "Thêm vào giỏ"
    const handleAddToCart = (e) => {
        // e.stopPropagation() ngăn sự kiện nhảy trang khi bấm nút mua
        e.stopPropagation();

        if (onAddToCart) {
            onAddToCart(product);
        } else {
            alert(`Đã thêm ${name} vào giỏ hàng!`);
        }
    };

    return (
        <div className="product-card">
            {/* Click vào ảnh chuyển hướng sang trang chi tiết /product/:id */}
            <Link to={`/product/${id}`} className="card-image-box">
                <span className="brand-badge">{brand}</span>
                <img
                    src={thumbnail}
                    alt={name}
                    className="card-thumb"
                    onError={(e) => {
                        // Ảnh dự phòng nếu ảnh chính bị lỗi đường dẫn
                        e.target.src = "/asset/img/products/iphone15.jpg";
                    }}
                />
            </Link>

            <div className="card-body">
                {/* Click vào tên sản phẩm chuyển hướng sang trang chi tiết */}
                <h4 className="card-title">
                    <Link to={`/product/${id}`} className="card-title-link" title={name}>
                        {name}
                    </Link>
                </h4>

                <p className="card-desc">{description}</p>
                <div className="card-price">{formatCurrency(price)}</div>

                <button className="btn-add-cart" onClick={handleAddToCart}>
                    <FaShoppingCart /> Thêm vào giỏ
                </button>
            </div>
        </div>
    );
}

export default ProductItem;
