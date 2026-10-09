import { FaBoxOpen, FaUsers, FaShoppingCart, FaBox } from "react-icons/fa";
import "./Dashboard.css";

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

function Dashboard() {
    const totalProducts = products.length;

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div className="dashboard-icon">
                        <FaBoxOpen />
                    </div>

                    <div className="dashboard-content">
                        <h3>Tổng sản phẩm</h3>
                        <p>{totalProducts}</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon">
                        <FaUsers />
                    </div>

                    <div className="dashboard-content">
                        <h3>Tổng người dùng</h3>
                        <p>1000</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon">
                        <FaShoppingCart />
                    </div>

                    <div className="dashboard-content">
                        <h3>Đơn hàng mới trong tháng</h3>
                        <p>200</p>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-icon">
                        <FaBox />
                    </div>

                    <div className="dashboard-content">
                        <h3>Sản phẩm mới trong tháng</h3>
                        <p>10</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
