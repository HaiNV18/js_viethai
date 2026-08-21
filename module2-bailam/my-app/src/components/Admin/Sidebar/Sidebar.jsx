import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { AiOutlineProduct } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa6";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
  const [openProduct, setOpenProduct] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDashboard = () => {
    navigate("/dashboard");
  }

  const handleListProduct = () => {
      navigate("/list-product");
  };

    return (
        <aside className="sidebar">
            <ul className="menu">
                <li className={`menu-item ${
                  location.pathname == "/dashboard" ? "active" : ""
                }`}
                  onClick={handleDashboard}
                >
                  <MdDashboard /> Dashboard
                </li>

                {/* Product */}
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
                                : <FaChevronRight size={12} />
                            }
                        </span>
                    </div>


                    {openProduct && (
                        <ul className="submenu">

                            <li
                                className={`submenu-item ${
                                    location.pathname === "/list-product"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={handleListProduct}
                            >
                                List Product
                            </li>

                            <li className="submenu-item">
                                Insert Product
                            </li>

                        </ul>
                    )}
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
