import { useState } from "react";
import { useParams } from "react-router-dom";

import "./DetailProductEdit.css";

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

const DetailProductEdit = () => {

    const { id } = useParams(); // lấy param của URL

    const product = products.find(
        (item) => item.id === Number(id) // tìm trong ds data
    );

    if (!product) {
        return <h2>Không tìm thấy sản phẩm</h2>;
    }

    // Đưa data vào từng input trong form
    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price,
        thumbnail: product.thumbnail
    });

    // const handleChange = (e) => {
    //     const { name, value } = e.target;

    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     console.log("Dữ liệu sản phẩm:", formData);
    // };

    return (
        <div className="detail-product">

            <h2>
                Chi tiết sản phẩm #{product.id}
            </h2>

            <form>

                <div className="form-group">
                    <label>Tên sản phẩm</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                    />
                </div>

                <div className="form-group">
                    <label>Mô tả</label>

                    <textarea
                        name="description"
                        value={formData.description}
                    />
                </div>

                <div className="form-group">
                    <label>Thương hiệu</label>

                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                    />
                </div>

                <div className="form-group">
                    <label>Giá</label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                    />
                </div>

                <div className="form-group">
                    <label>Thumbnail</label>

                    <input
                        type="text"
                        name="thumbnail"
                        value={formData.thumbnail}
                    />
                </div>

                <button type="submit">
                    Lưu sản phẩm
                </button>

            </form>

        </div>
    );
};

export default DetailProductEdit;
