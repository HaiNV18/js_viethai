import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Content from "./Content/Content";
import './Admin.css';

function Admin() {

    const [name, setName] = useState("");

    return (
        <>
            <Header onLogin={setName} />
            <div className="layout">
                <Sidebar />
                <Content name={name} />
            </div>
        </>
    );
}

export default Admin
