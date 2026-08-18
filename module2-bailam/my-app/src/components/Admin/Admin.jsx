import { Outlet } from "react-router-dom";

import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";

import "./Admin.css";

function Admin() {

    return (
        <>
            <Header />

            <div className="layout">
                <Sidebar />

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default Admin;
