import { useState } from "react";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Validation
    var isValid = username.length >= 8;

    return (
        <div className="login">
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
                <p className="error">
                    Tên tài khoản hợp lệ.
                </p>
            )}

            <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <p className="mt-10"><a href="/forgot-password">Quên mật khẩu?</a></p>

            <button disabled={!isValid}>Login</button>

            <p className="mt-10">Chưa có tài khoản? <a href="/register">Đăng ký</a></p>

        </div>
    );
}

export default Login;
