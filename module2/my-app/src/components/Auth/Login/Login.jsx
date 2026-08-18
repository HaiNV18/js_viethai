import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const accounts = [
    {
        id: 1,
        firstname: "A",
        lastname: "Nguyễn Văn",
        username: "admin1",
        password: "123456",
        email: "admin@gmail.com",
        role: "ADMIN",
    },
    {
        id: 2,
        firstname: "B",
        lastname: "Trần Thị",
        username: "user1",
        password: "123456",
        email: "user@gmail.com",
        role: "USER",
    },
];

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Validation
    const isValidEmail = email.length >= 8;

    const handleLogin = (e) => {
        e.preventDefault();

        // Tìm tài khoản trong accounts
        const account = accounts.find(
            (item) =>
                item.email === email &&
                item.password === password
        );

        // Nếu tìm thấy tài khoản
        if (account) {
            setError("");

            // Lưu thông tin account đang đăng nhập
            localStorage.setItem(
                "currentUser",
                JSON.stringify(account) // convert object sang string
            );

            navigate("/dashboard");
        } else {
            // Không tìm thấy tài khoản
            setError("Email hoặc password không đúng.");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    return (
        <div className="login-page">
            <form
                className="login"
                onSubmit={handleLogin}
            >
                <h2>Đăng nhập</h2>

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                />

                {email.length > 0 && !isValidEmail && (
                    <p className="error">
                        Email phải có ít nhất 8 ký tự.
                    </p>
                )}

                {isValidEmail && (
                    <p className="success">
                        Email hợp lệ.
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                    }}
                />

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <p className="mt-10"><a href="/forgot-password">Quên mật khẩu?</a></p>

                <button
                    type="submit"
                    disabled={!isValidEmail || password.length === 0}
                >
                    Đăng nhập
                </button>

                <p className="mt-10">Chưa có tài khoản? <a href="/register">Đăng ký</a></p>
            </form>
        </div>
    );
}

export default Login;
