import ProductItem from "../ProductItem/ProductItem"

// Dữ liệu sản phẩm lưu trữ trong một Array
const products = [
    { id: 1, name: "iPhone 15 Pro", price: "28.000.000", img: "iphone15.jpg" },
    { id: 2, name: "Samsung Galaxy A07", price: "24.500.000", img: "samsung-galaxy-a07.jpg" },
    { id: 3, name: "iPad Pro M4", price: "32.000.000", img: "no-thumbnail.jpg" },
];

// 1. Component cha: ProductList
const ProductList = () => {
    
    return (
        <div style={{ padding: '20px' }}>
            <h2>Danh sách sản phẩm</h2>

            {/* 3. Render từng component Product bằng method 'map' */}
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    item={product}
                />
            ))}
        </div>
    );
};

export default ProductList
