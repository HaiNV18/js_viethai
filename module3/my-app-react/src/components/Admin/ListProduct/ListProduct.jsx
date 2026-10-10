// src/components/Admin/ListProduct/ListProduct.jsx
import { useEffect, useMemo, useState } from "react";
import { productService } from "../../../services/productService";
import ListProductItem from "../ListProductItem/ListProductItem";
import "./ListProduct.css";

const brands = ["Apple", "Samsung", "Xiaomi", "Oppo"];
const ITEMS_PER_PAGE = 5;

const ListProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // State Filter and Pagination
    const [searchName, setSearchName] = useState('');
    const [searchBrand, setSearchBrand] = useState("all");
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);

    // Call API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await productService.getProducts();

                if (res.success && res.data) {
                    setProducts(res.data);
                }
            } catch (err) {
                console.error("Lỗi lấy danh sách sản phẩm:", err);
                const msg = err.response?.data?.message || "Không thể tải danh sách sản phẩm";
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Product Filter
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Hỗ trợ cả thuộc tính title_prod hoặc name từ database
            const productName = product.title_prod || product.name || "";
            const productBrand = product.brand || "";

            const matchesName = productName.toLowerCase().includes(searchName.trim().toLowerCase());
            const matchesBrand = searchBrand === 'all' || productBrand.toLowerCase() === searchBrand.toLowerCase();
            const matchesMinPrice = minPrice === '' || Number(product.price) >= Number(minPrice);
            const matchesMaxPrice = maxPrice === '' || Number(product.price) <= Number(maxPrice);

            return matchesName && matchesBrand && matchesMinPrice && matchesMaxPrice;
        });
    }, [products, searchName, searchBrand, minPrice, maxPrice]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const isAllSelected =
        currentProducts.length > 0 &&
        currentProducts.every((product) => selectedIds.includes(product.id));

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const currentPageIds = currentProducts.map((product) => product.id);
            setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
        } else {
            const currentPageIds = currentProducts.map((product) => product.id);
            setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        }
    };

    const handleSelectProduct = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Giao diện khi đang tải dữ liệu hoặc gặp lỗi
    if (loading) return <div className="p-4 text-center">Đang tải danh sách sản phẩm...</div>;
    if (error) return <div className="p-4 text-danger text-center">{error}</div>;

    return (
        <div className="list-product">
            <h2>Danh sách sản phẩm</h2>

            <div className="filter-product">
                <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    value={searchName}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <select
                    value={searchBrand}
                    onChange={(e) => {
                        setSearchBrand(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">Tất cả thương hiệu</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Giá từ"
                    value={minPrice}
                    onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                    }}
                />

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
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <ListProductItem
                                key={product.id}
                                item={product}
                                checked={selectedIds.includes(product.id)}
                                onSelect={handleSelectProduct}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">Không có sản phẩm nào</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
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
                            className={currentPage === index + 1 ? "active" : ""}
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
            )}

            <div className="selected-info">
                Đã chọn: <strong>{selectedIds.length}</strong> sản phẩm
            </div>
        </div>
    );
};

export default ListProduct;
