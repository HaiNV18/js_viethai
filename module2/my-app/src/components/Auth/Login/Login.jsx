import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Validation
    var isValid = username.length >= 8;

    const handleLogin = (e) => {
        e.preventDefault();

        // Kiểm tra tài khoản
        if (
            username === "admin@gmail.com" &&
            password === "123456"
        ) {
            navigate("/admin");
        } else {
            setError("Username hoặc password không đúng.");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <div className="login-page">
            <form className="login" onSubmit={handleLogin}>
                <h2>Đăng nhập</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                {username.length > 0 && !isValid && (
                    <p className="error">
                        Tên tài khoản phải có ít nhất 8 ký tự.
                    </p>
                )}

                {isValid && (
                    <p className="success">
                        Tên tài khoản hợp lệ.
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <p className="mt-10"><a href="/forgot-password">Quên mật khẩu</a></p>

                <button disabled={!isValid}>Đăng nhập</button>

                <p className="mt-10">Chưa có tài khoản? <a href="/register">Đăng ký</a></p>
            </form>
        </div>
    );
}

export default Login;
