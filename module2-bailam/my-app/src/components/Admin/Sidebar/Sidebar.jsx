import './Sidebar.css'
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

function Sidebar() {
    return (
        <aside className="sidebar">
            <ul className="menu">
                <li className="menu-item active">
                  <MdDashboard /> Dashboard
                </li>

                <li className="menu-item">
                  <FaRegUser/> Users
                </li>

                <li className="menu-item">
                  <MdOutlineSettings /> Settings
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;

// index.css App.css ProductItem.css
// App copy nội dung trong function App()
// Header copy hết từ source gốc qua
// Sidebar bỏ icon trước chữ Dashboard, Users, Settings
// Content thêm <main className="content">
// ProductItem thêm <div className="product-item">