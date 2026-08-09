import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";
import './App.css';

function App() {

  const [name, setName] = useState("");

  return (
    <BrowserRouter>
        <Routes>

            {/* Trang Login */}
            <Route path="/login" element={<Login />} />

            {/* Trang Register */}
            <Route path="/register" element={<Register />} />

            {/* Trang ForgotPassword */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Trang Admin */}
            <Route path="/admin" element={<Admin />} />

            {/* Route mặc định */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    </BrowserRouter>
  );
}

export default App
