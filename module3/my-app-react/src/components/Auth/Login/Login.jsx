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
            const res = await authService.login(
                username,
                password
            );

            console.log("Login success:", res);

            if (res.success && res.data) {
                const { user, access_token } = res.data;

                // Lưu thông tin user vào localStorage
                localStorage.setItem("currentUser", JSON.stringify(user));

                // Lưu access token vào localStorage
                localStorage.setItem("accessToken", access_token);

                // Chuyển hướng sang trang Dashboard
                navigate("/dashboard");
            }
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
                    <a href="/register">Đăng ký</a>
                </p>

                <p className="mt-10">emilys / emilyspass</p>
            </form>
        </div>
    );
}

export default Login;
