import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../services/authService";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const isValidUsername = username.length >= 3;

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!isValidUsername || password.length === 0) {
            return;
        }

        setError("");
        setLoading(true);

        try {
            // Gọi API login
            const data = await authService.login(
                username,
                password
            );

            console.log("Login success:", data);

            // Lưu thông tin user
            localStorage.setItem(
                "currentUser",
                JSON.stringify(data)
            );

            // Lưu access token
            localStorage.setItem(
                "accessToken",
                data.accessToken
            );

            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Username hoặc password không đúng."
            );
        } finally {
            setLoading(false);
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
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                    }}
                />

                {username.length > 0 && !isValidUsername && (
                    <p className="error">
                        Username phải có ít nhất 3 ký tự.
                    </p>
                )}

                {isValidUsername && (
                    <p className="success">
                        Username hợp lệ.
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

                <p className="mt-10">
                    <a href="/forgot-password">
                        Quên mật khẩu?
                    </a>
                </p>

                <button
                    type="submit"
                    disabled={
                        !isValidUsername ||
                        password.length === 0 ||
                        loading
                    }
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <p className="mt-10">
                    Chưa có tài khoản?{" "}
                    <a href="/register">
                        Đăng ký
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Login;
