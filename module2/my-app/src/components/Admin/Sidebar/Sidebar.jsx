import { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa6";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
    const [openProduct, setOpenProduct] = useState(false);

    return (
        <aside className="sidebar">
            <ul className="menu">

                <li className="menu-item active">
                    <MdDashboard />
                    <span>Dashboard</span>
                </li>

                <li>
                    <div
                        className="menu-item"
                        onClick={() => setOpenProduct(!openProduct)}
                    >
                        <AiOutlineProduct />

                        <span className="menu-title">
                            Product
                        </span>

                        <span className="menu-arrow">
                            {openProduct
                                ? <FaChevronDown size={12} />
                                : <FaChevronRight size={12} />}
                        </span>
                    </div>

                    {openProduct && (
                        <ul className="submenu">

                            <li className="submenu-item">
                                List Product
                            </li>

                            <li className="submenu-item">
                                Insert Product
                            </li>

                        </ul>
                    )}
                </li>

                <li className="menu-item">
                    <FaRegUser />
                    <span>Users</span>
                </li>

                <li className="menu-item">
                    <MdOutlineSettings />
                    <span>Settings</span>
                </li>

            </ul>
        </aside>
    );
}

export default Sidebar;
