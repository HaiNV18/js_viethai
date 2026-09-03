import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { FaRegMoon, FaRegSun, FaSignOutAlt, FaUser } from "react-icons/fa";

import { useTheme } from "../../../context/ThemeContext";

import "./Header.css";

const notifications = [
    {
        id: 1,
        title: "Đơn hàng mới",
        time: "2 phút trước",
    },
    {
        id: 2,
        title: "Có người bình luận",
        time: "15 phút trước",
    },
    {
        id: 3,
        title: "Backup hoàn thành",
        time: "1 giờ trước",
    },
];

function Header() {
    const [openNotify, setOpenNotify] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [account, setAccount] = useState(null);

    const notifyRef = useRef(null);
    const menuRef = useRef(null);

    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    // Lấy account đã đăng nhập
    useEffect(() => {
        const storedAccount =
            localStorage.getItem("currentUser");

        if (storedAccount) {
            const accountData =
                JSON.parse(storedAccount);

            setAccount(accountData);
        }
    }, []);

    const isLogin = !!account;

    const user = {
        name: account
            ? `${account.lastname} ${account.firstname}`
            : "",
        avatar:
            "/asset/img/avatar/avatar-circle.png",
        role: account?.role,
    };

    // Logout
    const handleLogout = () => {
        // Xóa thông tin user
        localStorage.removeItem("currentUser");

        // Xóa access token
        localStorage.removeItem("accessToken");

        // Xóa state
        setAccount(null);

        // Đóng menu
        setOpenMenu(false);

        // Chuyển về trang login
        navigate("/login");
    };

    // Click bên ngoài thì đóng dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                notifyRef.current &&
                !notifyRef.current.contains(e.target) // kiểm tra click bên trong hay ngoài notification
            ) {
                setOpenNotify(false);
            }

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) // kiểm tra click bên trong hay ngoài menu
            ) {
                setOpenMenu(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <header className={`header ${theme}`}>

            <div className="header-left">
                <h2>My App</h2>
            </div>

            <div className="header-right">

                <button
                    className="theme-btn"
                    onClick={toggleTheme}
                    title={ theme === "light" ? "Chuyển sang Dark Mode" : "Chuyển sang Light Mode" }
                >
                    {theme === "light" ? <FaRegMoon /> : <FaRegSun />}
                </button>

                {isLogin ? (
                    <>

                        {/* Notification */}
                        <div
                            className="notification-menu"
                            ref={notifyRef}
                        >
                            <button
                                className="icon-btn"
                                onClick={() => {
                                    setOpenNotify(!openNotify);
                                    setOpenMenu(false);
                                }}
                            >
                                <IoIosNotifications className="notification-icon" />
                            </button>

                            {openNotify && (
                                <div className="notification-dropdown">

                                    <div className="notification-title">
                                        Notifications
                                    </div>

                                    {notifications.map((item) => (
                                        <div
                                            key={item.id}
                                            className="notification-item"
                                        >
                                            <div className="notify-text">
                                                {item.title}
                                            </div>

                                            <small>{item.time}</small>
                                        </div>
                                    ))}

                                    <button className="show-more-btn">
                                        Show More
                                    </button>

                                </div>
                            )}
                        </div>

                        {/* User */}
                        <div
                            className="user-menu"
                            ref={menuRef}
                        >
                            <div
                                className="user-info"
                                onClick={() => {
                                    setOpenMenu(!openMenu);
                                    setOpenNotify(false);
                                }}
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="avatar"
                                />

                                <span className="username">{user.name}</span>

                            </div>


                            {openMenu && (
                                <div className="dropdown-menu">

                                    <div className="dropdown-item">
                                        <FaUser />
                                        <span>Profile</span>
                                    </div>

                                    <div
                                        className="dropdown-item logout"
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt />
                                        <span>Logout</span>
                                    </div>

                                </div>
                            )}
                        </div>

                    </>
                ) : (
                    <button
                        className="login-btn"
                        onClick={() => navigate("/login")}
                    >
                        Đăng nhập
                    </button>
                )}

            </div>

        </header>
    );
}

export default Header;
