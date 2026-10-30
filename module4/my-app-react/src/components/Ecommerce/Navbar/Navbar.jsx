import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { IoIosCart, IoIosNotifications } from "react-icons/io";
import { FaChevronDown, FaUser } from "react-icons/fa";

import "./Navbar.css";

function Navbar() {

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const categoryRef = useRef(null);
    const navigate = useNavigate();

    // Đóng submenu khi click bên ngoài
    useEffect(() => {

        const handleClickOutside = (event) => {
            if (
                categoryRef.current &&
                !categoryRef.current.contains(event.target)
            ) {
                setIsCategoryOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    // Điều hướng đến danh mục
    const handleCategoryClick = (slug) => {
        navigate(`/category/${slug}`);

        setIsCategoryOpen(false);
        setIsMobileMenuOpen(false);
    };

    // Đóng menu mobile
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsCategoryOpen(false);
    };

    return (
        <header className="navbar">

            <div className="navbar-container">

                {/* LEFT: LOGO + MENU */}
                <div className="navbar-left">

                    {/* Logo */}
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        <span className="logo-icon">E</span>
                        <span className="logo-text">E-Commerce</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>

                        <Link
                            to="/about"
                            className="navbar-link"
                            onClick={closeMobileMenu}
                        >
                            About
                        </Link>

                        {/* Category Dropdown */}
                        <div className="navbar-dropdown" ref={categoryRef}>

                            <button
                                className={`navbar-link category-button ${
                                    isCategoryOpen ? "active" : ""
                                }`}
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                aria-expanded={isCategoryOpen}
                            >
                                Category
                                <span className="dropdown-arrow">
                                    <FaChevronDown />
                                </span>
                            </button>

                            {isCategoryOpen && (
                                <div className="dropdown-menu">

                                    <button onClick={() => handleCategoryClick("apple")}>
                                        Apple
                                    </button>

                                    <button onClick={() => handleCategoryClick("oppo")}>
                                        Oppo
                                    </button>

                                    <button onClick={() => handleCategoryClick("samsung")}>
                                        Samsung
                                    </button>

                                </div>
                            )}

                        </div>

                    </nav>

                </div>

                {/* RIGHT: ACTIONS */}
                <div className="navbar-right">

                    {/* Notification */}
                    <button
                        className="navbar-icon-button"
                        aria-label="Notifications"
                        onClick={() => alert("Notifications")}
                    >
                        <IoIosNotifications className="navbar-notification-icon" />
                        <span className="notification-badge"></span>
                    </button>

                    {/* Shopping Cart */}
                    <Link to="/cart" className="navbar-icon-button" aria-label="Shopping cart">
                        <IoIosCart className="navbar-cart-icon" />
                        <span className="cart-badge">0</span>
                    </Link>

                    {/* Login */}
                    <Link to="/login" className="navbar-login">
                        Login
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle navigation"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                </div>

            </div>

        </header>
    );
}

export default Navbar;
