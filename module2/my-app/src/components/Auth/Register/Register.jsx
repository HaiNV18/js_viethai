import { useState } from "react";
import "./Register.css";

function Register() {
    const [username, setUsername] = useState("");

    // Validation
    const isValid = username.length >= 8;

    return (
        <div className="register">
            <h2>Đăng ký tài khoản</h2>

            <input
                type="text"
                placeholder="Nhập tên tài khoản"
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

            <button disabled={!isValid}>Đăng ký</button>
        </div>
    );
}

export default Register;
