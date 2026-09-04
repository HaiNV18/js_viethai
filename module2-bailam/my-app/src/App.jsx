import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'

import Auth from "./components/Auth/Auth";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";

import Admin from "./components/Admin/Admin";
import Dashboard from './components/Admin/Dashboard/Dashboard.jsx'
import ListProduct from './components/Admin/ListProduct/ListProduct.jsx'
import DetailProductEdit from './components/Admin/DetailProductEdit/DetailProductEdit.jsx'

import { ThemeProvider } from "./context/ThemeContext";

import './App.css'

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes >

          {/* =====================
              AUTH
          ====================== */}

          <Route element={<Auth />}>

            <Route path="/login" element={<Login/>} />

            <Route path="/register" element={<Register/>} />

            <Route path="/forgot-password" element={<ForgotPassword/>} />

          </Route>

          {/* =====================
              ADMIN
          ====================== */}

          <Route element={<Admin />}>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/list-product" element={<ListProduct />} />

            <Route path="/detail-product/:id/edit" element={<DetailProductEdit />} />

          </Route>

          {/* =====================
              DEFAULT
          ====================== */}

          <Route path="/" element={<Navigate to="/login" replace/>} />

          <Route path="*" element={<Navigate to="/login" replace/>} />

          {/* <Route path="/error" errorElement={<ErrorPage/>} /> */} // Phù hợp với User Mode, không phù hợp với Dev Mode

        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App
