import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../../../services/authService";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState("");

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    // Validation
    var isValid = username.length >= 5;

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log(username);
        console.log(password);
        if (!isValid || password.length === 0) {
            return;
        }

        const controller = new AbortController();
        setError("");
        setLoading(true);

        // call api authService
        try {
            const data = await authService.login(username, password);

            console.log("Login success:", data);
            localStorage.setItem("currentUser",JSON.stringify(data)); // Lưu thông tin data
            localStorage.setItem("accessToken",data.accessToken); // Lưu access token

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

        // dọn dẹp khi component unmount
        return () => controller.abort();
    }

    return (
        <div className="login">
            <h2>Đăng nhập</h2>

            <form onSubmit={handleLogin}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError("");
                    }}
                />

                {username.length > 0 && !isValid && (
                    <p className="error">
                        Tên tài khoản phải có ít nhất 8 ký tự.
                    </p>
                )}

                {isValid && (
                    <p className="error">
                        Tên tài khoản hợp lệ.
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

                <p className="mt-10"><a href="/forgot-password">Quên mật khẩu?</a></p>

                <button
                    type="submit"
                    disabled={
                        !isValid ||
                        password.length === 0 ||
                        loading
                    }
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>

            <p className="mt-10">Chưa có tài khoản? <a href="/register">Đăng ký</a></p>

        </div>
    );
}

export default Login;
