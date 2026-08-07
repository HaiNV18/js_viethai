import { useState, useRef, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
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

function Header({ onLogin }) {
    const [openNotify, setOpenNotify] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const notifyRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                notifyRef.current &&
                !notifyRef.current.contains(e.target)
            ) {
                setOpenNotify(false);
            }

            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const isLogin = true;

    const user = {
        name: "Nguyễn Văn A",
        avatar: "/asset/img/avatar/avatar-circle.png",
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLogin) {
        onLogin(user.name);
    }

    return (
        <header className="header">
            <div className="header-left">
                <h2>My App</h2>
            </div>

            <div className="header-right">
                {isLogin ? (
                    <>
                        <div className="notification-menu"
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
                                <span className="username">
                                    {user.name}
                                </span>
                            </div>

                            {openMenu && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-item">
                                        <FaUser />
                                        <span>Profile</span>
                                    </div>

                                    <div className="dropdown-item logout">
                                        <FaSignOutAlt />
                                        <span>Logout</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <button className="login-btn">
                        Đăng nhập
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;
