import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { AiOutlineProduct } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa6";
import { MdDashboard, MdOutlineSettings } from "react-icons/md";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

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

                <li className={`menu-item ${
                  location.pathname == "/list-product" ? "active" : ""
                }`}
                  onClick={handleListProduct}
                >
                  <AiOutlineProduct /> List Product
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
