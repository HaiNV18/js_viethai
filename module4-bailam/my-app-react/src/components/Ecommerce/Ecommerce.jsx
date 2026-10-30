import { Outlet } from "react-router-dom";

import Navbar from "./Navbar/Navbar";

import "./Ecommerce.css";

function Ecommerce() {
    return (
        <div>
            <Navbar />

            <Outlet />
        </div>
    );
}

export default Ecommerce;
