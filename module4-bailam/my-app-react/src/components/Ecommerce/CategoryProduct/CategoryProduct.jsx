import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaShoppingCart} from "react-icons/fa";

import ProductItem from "../ProductItem/ProductItem";
import "./CategoryProduct.css";

// 1. Dữ liệu sản phẩm mẫu (dùng ảnh sẵn có trong thư mục public/asset/img/products)
const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        brand: "apple",
        price: 29990000,
        thumbnail: "/asset/img/products/iphone15.jpg",
        description: "Khung titan siêu nhẹ, chip A17 Pro mạnh mẽ, camera zoom 5x.",
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        brand: "samsung",
        price: 27990000,
        thumbnail: "/asset/img/products/samsung-s24.jpg",
        description: "Quyền năng Galaxy AI, camera 200MP, kèm bút S-Pen tiện lợi.",
    },
    {
        id: 3,
        name: "Oppo Find X9 Pro",
        brand: "oppo",
        price: 21990000,
        thumbnail: "/asset/img/products/oppo-find-x9-pro.jpg",
        description: "Camera Hasselblad đỉnh cao, sạc nhanh SuperVOOC 100W.",
    },
    {
        id: 4,
        name: "Xiaomi 14",
        brand: "xiaomi",
        price: 18990000,
        thumbnail: "/asset/img/products/xiaomi14.jpg",
        description: "Ống kính quang học Leica Summilux, chip Snapdragon 8 Gen 3.",
    },
    {
        id: 5,
        name: "Samsung Galaxy S26 Ultra",
        brand: "samsung",
        price: 32990000,
        thumbnail: "/asset/img/products/samsung-galaxy-s26.jpg",
        description: "Mẫu flagship tương lai với hiệu năng xử lý đồ họa vượt trội.",
    },
    {
        id: 6,
        name: "Samsung Galaxy A57",
        brand: "samsung",
        price: 8490000,
        thumbnail: "/asset/img/products/samsung-galaxy-a57.jpg",
        description: "Thiết kế trẻ trung, màn hình Super AMOLED 120Hz mượt mà.",
    },
    {
        id: 7,
        name: "Samsung Galaxy S5 Classic",
        brand: "samsung",
        price: 3500000,
        thumbnail: "/asset/img/products/samsung-galaxy-s5.jpg",
        description: "Dòng máy kinh điển bền bỉ, màn hình nhỏ gọn dễ cầm nắm.",
    },
    {
        id: 8,
        name: "iPhone 13 128GB",
        brand: "apple",
        price: 13990000,
        thumbnail: "/asset/img/products/iphone15.jpg",
        description: "Hiệu năng ổn định dài lâu, thời lượng pin ấn tượng.",
    },
];

const BRANDS = [
    { label: "Tất cả thương hiệu", value: "all" },
    { label: "Apple", value: "apple" },
    { label: "Samsung", value: "samsung" },
    { label: "Xiaomi", value: "xiaomi" },
    { label: "Oppo", value: "oppo" },
];

const ITEMS_PER_PAGE = 6; // Số sản phẩm hiển thị trên 1 trang

function CategoryProduct() {
    const { slug } = useParams(); // Lấy param từ URL (/category/:slug)

    // State quản lý bộ lọc
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("name-asc"); // name-asc (A-Z), name-desc (Z-A), price-asc, price-desc
    const [currentPage, setCurrentPage] = useState(1);

    // Đồng bộ brand filter khi URL param thay đổi (ví dụ người dùng bấm từ Menu Dropdown)
    useEffect(() => {
        if (slug) {
            const matched = BRANDS.find((b) => b.value.toLowerCase() === slug.toLowerCase());
            setSelectedBrand(matched ? matched.value : "all");
        } else {
            setSelectedBrand("all");
        }
        setCurrentPage(1);
    }, [slug]);

    // Xử lý Lọc & Sắp xếp dữ liệu (Pipeline)
    const processedProducts = useMemo(() => {
        return INITIAL_PRODUCTS
            // 1. Lọc theo Brand
            .filter((p) => {
                if (selectedBrand === "all") return true;
                return p.brand.toLowerCase() === selectedBrand.toLowerCase();
            })
            // 2. Lọc theo Khoảng giá
            .filter((p) => {
                const matchMin = minPrice === "" || p.price >= Number(minPrice);
                const matchMax = maxPrice === "" || p.price <= Number(maxPrice);
                return matchMin && matchMax;
            })
            // 3. Sắp xếp theo lựa chọn (A-Z, Z-A, Giá)
            .sort((a, b) => {
                if (sortBy === "name-asc") {
                    return a.name.localeCompare(b.name);
                }
                if (sortBy === "name-desc") {
                    return b.name.localeCompare(a.name);
                }
                if (sortBy === "price-asc") {
                    return a.price - b.price;
                }
                if (sortBy === "price-desc") {
                    return b.price - a.price;
                }
                return 0;
            });
    }, [selectedBrand, minPrice, maxPrice, sortBy]);

    // Tính toán phân trang
    const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = processedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Reset toàn bộ bộ lọc
    const handleResetFilters = () => {
        setSelectedBrand("all");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("name-asc");
        setCurrentPage(1);
    };

    // Format tiền tệ VNĐ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
    };

    return (
        <div className="category-page">
            <div className="category-container">

                {/* BREADCRUMB */}
                <div className="breadcrumb">
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <span className="current">
                        Danh mục: {selectedBrand === "all" ? "Tất cả sản phẩm" : selectedBrand.toUpperCase()}
                    </span>
                </div>

                <div className="category-layout">
                    {/* =========================================
                        BÊN TRÁI: BỘ LỌC (SIDEBAR FILTER)
                    ========================================== */}
                    <aside className="filter-sidebar">
                        <div className="filter-header">
                            <h3>Bộ Lọc Tìm Kiếm</h3>
                            <button className="btn-reset" onClick={handleResetFilters} title="Đặt lại bộ lọc">
                                Đặt lại
                            </button>
                        </div>

                        {/* 1. Lọc theo Brand */}
                        <div className="filter-group">
                            <label className="filter-title">Thương hiệu</label>
                            <div className="brand-options">
                                {BRANDS.map((b) => (
                                    <label key={b.value} className="radio-label">
                                        <input
                                            type="radio"
                                            name="brand"
                                            value={b.value}
                                            checked={selectedBrand === b.value}
                                            onChange={(e) => {
                                                setSelectedBrand(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <span>{b.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 2. Lọc theo Khoảng giá */}
                        <div className="filter-group">
                            <label className="filter-title">Khoảng giá (VNĐ)</label>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Từ (VD: 5000000)"
                                    value={minPrice}
                                    onChange={(e) => {
                                        setMinPrice(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Đến (VD: 25000000)"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        setMaxPrice(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {/* 3. Sắp xếp (A-Z / Z-A / Giá) */}
                        <div className="filter-group">
                            <label className="filter-title">
                                Sắp xếp theo
                            </label>
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="name-asc">Tên: A đến Z</option>
                                <option value="name-desc">Tên: Z đến A</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                            </select>
                        </div>
                    </aside>

                    {/* =========================================
                        BÊN PHẢI: DANH SÁCH SẢN PHẨM & PHÂN TRANG
                    ========================================== */}
                    <main className="product-content">
                        {/* Thanh thông tin kết quả */}
                        <div className="results-bar">
                            <p>
                                Hiển thị <strong>{currentProducts.length}</strong> / <strong>{processedProducts.length}</strong> sản phẩm
                            </p>
                        </div>

                        {/* Lưới sản phẩm */}
                        {currentProducts.length > 0 ? (
                            <div className="product-grid">
                                {currentProducts.map((product) => (
                                    <ProductItem
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <h3>Không tìm thấy sản phẩm nào phù hợp</h3>
                                <p>Hãy thử điều chỉnh lại khoảng giá hoặc chọn thương hiệu khác.</p>
                                <button className="btn-reset" onClick={handleResetFilters}>
                                    Xóa bộ lọc
                                </button>
                            </div>
                        )}

                        {/* NÚT PHÂN TRANG */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="page-btn nav-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                >
                                    <FaChevronLeft /> Trước
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <button
                                            key={pageNumber}
                                            className={`page-btn ${currentPage === pageNumber ? "active" : ""}`}
                                            onClick={() => setCurrentPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}

                                <button
                                    className="page-btn nav-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                >
                                    Sau <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default CategoryProduct;
