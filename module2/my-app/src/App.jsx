import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'

import Auth from "./components/Auth/Auth";

import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";

import Admin from "./components/Admin/Admin";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import ListProduct from "./components/Admin/ListProduct/ListProduct";
import DetailProduct from "./components/Admin/DetailProduct/DetailProduct.jsx";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =====================
                    AUTH LAYOUT
                ====================== */}

                <Route element={<Auth />}>

                    {/* Login */}
                    <Route path="/login" element={<Login/>} />

                    {/* Register */}
                    <Route path="/register" element={<Register/>} />

                    {/* Forgot Password */}
                    <Route path="/forgot-password" element={<ForgotPassword/>} />

                </Route>

                {/* =====================
                    ADMIN LAYOUT
                ====================== */}

                <Route element={<Admin />}>

                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* List Product */}
                    <Route path="/list-product" element={<ListProduct />} />

                    {/* Detail Product */}
                    <Route path="/detail-product/:id" element={<DetailProduct />} />

                </Route>

                {/* =====================
                    DEFAULT
                ====================== */}

                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* URL không tồn tại */}
                <Route path="*" element={<Navigate to="/login" replace/>} />

                {/* <Route path="/error" errorElement={<ErrorPage/>} /> */} // Phù hợp với User Mode, không phù hợp với Dev Mode

            </Routes>
        </BrowserRouter>
    );
}

export default App;
