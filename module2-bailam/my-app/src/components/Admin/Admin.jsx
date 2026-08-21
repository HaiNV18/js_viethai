import { Outlet } from "react-router-dom";

import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Content from "./Content/Content";

import "./Admin.css";

function Admin() {

    return (
        <>
            <Header />

            <div className="layout">
                <Sidebar />

                <main className="content">
                    <Content />
                </main>
            </div>
        </>
    );
}

export default Admin;
