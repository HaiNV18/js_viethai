import { useMemo, useState } from "react";

import ListProductItem from "../ListProductItem/ListProductItem";
import "./ListProduct.css";

const products = [
    {
        "id": 1,
        "name": "Iphone 13",
        "description": "Mô tả",
        "brand": "apple",
        "price": 9000,
        "thumbnail": "iphone13.jpg"
    },
    {
        "id": 2,
        "name": "Iphone 15",
        "description": "Mô tả",
        "brand": "apple",
        "price": 9000,
        "thumbnail": "iphone15.jpg"
    },
    {
        "id": 3,
        "name": "Samsung S24",
        "description": "<strong>Samsung S24</strong> là mẫu smartphone tầm trung nổi bật với sức mạnh từ chipset Exynos 1330 cùng công nghệ chống rung OIS trên camera chính 50MP, giúp tối ưu hiệu năng và chất lượng ảnh chụp. Thiết bị sở hữu viên pin 5.000mAh bền bỉ kèm sạc nhanh 25W, đáp ứng trọn vẹn nhu cầu sử dụng cả ngày dài. Với thiết kế tinh tế gồm 3 gam màu thời thượng, A17 5G hứa hẹn là lựa chọn hàng đầu trong phân khúc năm 2026.",
        "brand": "samsung",
        "price": 6000,
        "thumbnail": "samsung-s24.jpg"
    },
    {
        "id": 4,
        "name": "Xiaomi 14",
        "description": "Mô tả",
        "brand": "xiaomi",
        "price": 5000,
        "thumbnail": "xiaomi14.jpg"
    },
    {
        "id": 5,
        "name": "Oppo Find X9 Pro",
        "description": "Mô tả",
        "brand": "oppo",
        "price": 9000,
        "thumbnail": "oppo-find-x9-pro.jpg"
    },
    {
        "id": 6,
        "name": "Xiaomi 15",
        "description": "Mô tả",
        "brand": "xiaomi",
        "price": 11000,
        "thumbnail": "xiaomi15.jpg"
    },
    {
        "id": 7,
        "name": "Samsung Galaxy A57",
        "description": "Mô tả",
        "brand": "samsung",
        "price": 8000,
        "thumbnail": "samsung-galaxy-a57.jpg"
    },
    {
        "id": 8,
        "name": "Samsung Galaxy S26",
        "description": "Mô tả",
        "brand": "samsung",
        "price": 12000,
        "thumbnail": "samsung-galaxy-s26.jpg"
    },
    {
        "id": 9,
        "name": "Samsung Galaxy A07",
        "description": "Mô tả",
        "brand": "samsung",
        "price": 2000,
        "thumbnail": "samsung-galaxy-a07.jpg"
    },
    {
        "id": 10,
        "name": "Samsung Galaxy S25",
        "description": "Mô tả",
        "brand": "samsung",
        "price": 17000,
        "thumbnail": "samsung-galaxy-s5.jpg"
    }
];

const ITEMS_PER_PAGE = 5;

const ListProduct = () => {
    // Filter
    const [searchName, setSearchName] = useState('');
    const [searchBrand, setSearchBrand] = useState("all");
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);

    // Danh sách ID sản phẩm đang được chọn
    const [selectedIds, setSelectedIds] = useState([]);

    // Filtered Products Logic
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Filter by Name
            const matchesName = product.name.toLowerCase().includes(searchName.trim().toLowerCase());

            // Filter by Brand
            const matchesBrand =
                searchBrand === 'all' || product.brand.toLowerCase() === searchBrand.toLowerCase();

            // Filter by Price Range (Min & Max)
            const matchesMinPrice = minPrice === '' || product.price >= Number(minPrice);
            const matchesMaxPrice = maxPrice === '' || product.price <= Number(maxPrice);

            return matchesName && matchesBrand && matchesMinPrice && matchesMaxPrice;
        });
    }, [searchName, searchBrand, minPrice, maxPrice]);

    // Tổng số trang (xét theo filteredProducts)
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    // Lấy sản phẩm của trang hiện tại (xét theo filteredProducts)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    // Kiểm tra tất cả sản phẩm trên trang hiện tại đã được chọn chưa
    const isAllSelected =
        currentProducts.length > 0 &&
        currentProducts.every((product) =>
            selectedIds.includes(product.id)
        );

    // Check/uncheck checkbox tổng
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const currentPageIds = currentProducts.map(
                (product) => product.id
            );

            setSelectedIds((prev) => [
                ...new Set([...prev, ...currentPageIds]),
            ]);
        } else {
            const currentPageIds = currentProducts.map(
                (product) => product.id
            );

            setSelectedIds((prev) =>
                prev.filter((id) => !currentPageIds.includes(id))
            );
        }
    };

    // Check/uncheck từng sản phẩm
    const handleSelectProduct = (id) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((itemId) => itemId !== id);
            }

            return [...prev, id];
        });
    };

    // Chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="list-product">
            <h2>Danh sách sản phẩm</h2>

            <div className="filter-product">

                {/* Tìm theo tên */}
                <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    value={searchName}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                {/* Lọc theo brand */}
                <select
                    value={searchBrand}
                    onChange={(e) => {
                        setSearchBrand(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">Tất cả thương hiệu</option>
                    <option value="apple">Apple</option>
                    <option value="samsung">Samsung</option>
                    <option value="xiaomi">Xiaomi</option>
                    <option value="oppo">Oppo</option>
                </select>

                {/* Giá từ */}
                <input
                    type="number"
                    placeholder="Giá từ"
                    value={minPrice}
                    onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                {/* Giá đến */}
                <input
                    type="number"
                    placeholder="Giá đến"
                    value={maxPrice}
                    onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                    }}
                />

            </div>






            <table>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                            />
                        </th>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Thumbnail</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {currentProducts.map((product) => (
                        <ListProductItem
                            key={product.id}
                            item={product}
                            checked={selectedIds.includes(product.id)}
                            onSelect={handleSelectProduct}
                        />
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={
                            currentPage === index + 1
                                ? "active"
                                : ""
                        }
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>

            {/* Hiển thị sản phẩm đang được chọn */}
            <div className="selected-info">
                Đã chọn: <strong>{selectedIds.length}</strong> sản phẩm
            </div>
        </div>
    );
};

export default ListProduct;
