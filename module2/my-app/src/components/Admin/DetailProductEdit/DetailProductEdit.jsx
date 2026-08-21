import { useState } from "react";
import { useParams } from "react-router-dom";

import "./DetailProductEdit.css";

const products = [
    {
        id: 1,
        name: "Iphone 13",
        description: "Mô tả",
        brand: "apple",
        price: 9000,
        thumbnail: "iphone13.jpg"
    },
    {
        id: 2,
        name: "Iphone 15",
        description: "Mô tả",
        brand: "apple",
        price: 9000,
        thumbnail: "iphone15.jpg"
    },
    {
        id: 3,
        name: "Samsung S24",
        description: "Mô tả",
        brand: "samsung",
        price: 6000,
        thumbnail: "samsung-s24.jpg"
    },
    {
        id: 4,
        name: "Xiaomi 14",
        description: "Mô tả",
        brand: "xiaomi",
        price: 5000,
        thumbnail: "xiaomi14.jpg"
    },
    {
        id: 5,
        name: "Oppo Find X9 Pro",
        description: "Mô tả",
        brand: "oppo",
        price: 9000,
        thumbnail: "oppo-find-x9-pro.jpg"
    }
];

const DetailProductEdit = () => {

    const { id } = useParams();

    const product = products.find(
        (item) => item.id === Number(id)
    );

    if (!product) {
        return <h2>Không tìm thấy sản phẩm</h2>;
    }

    const [formData, setFormData] = useState({
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price,
        thumbnail: product.thumbnail
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Dữ liệu sản phẩm:", formData);
    };

    return (
        <div className="detail-product">

            <h2>
                Chi tiết sản phẩm #{product.id}
            </h2>

            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Tên sản phẩm</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Mô tả</label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Thương hiệu</label>

                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Giá</label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Thumbnail</label>

                    <input
                        type="text"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
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
