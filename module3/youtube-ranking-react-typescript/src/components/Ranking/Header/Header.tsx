import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
    const [lang, setLang] = useState("en");

    return (
        <header className="bg-white border-bottom shadow-sm px-4 py-3">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-4">
                    <Link
                        className="fw-bold text-primary text-decoration-none fs-5"
                        to="/"
                        style={{ letterSpacing: '0.5px' }}
                    >
                        KAWAII CODE
                    </Link>

                    <Link
                        className="fw-bold text-primary text-decoration-none fs-6 ms-2"
                        to="/login"
                    >
                        LOGIN
                    </Link>
                </div>

                <div className="d-flex align-items-center">
                    <select
                        className="form-select form-select-sm border-0 bg-transparent text-dark fw-medium pe-4"
                        style={{ cursor: "pointer", width: "auto" }}
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="vi">Tiếng Việt</option>
                        <option value="ko">한국어</option>
                    </select>
                </div>
            </div>
        </header>
    );
}

export default Header;
