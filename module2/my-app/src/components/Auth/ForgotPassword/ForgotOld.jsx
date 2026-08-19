import { useState } from "react";
import { useNavigate } from 'react-router-dom'

import "./ForgotPassword.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "admin@gmail.com") {
            setMessage("Email hợp lệ. Vui lòng kiểm tra hộp thư để đặt lại mật khẩu.");
        } else {
            setMessage("Email không tồn tại trong hệ thống.");
        }
    }

    return (
        <div className="forgot-password">
            <h2>Quên mật khẩu</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {message && (
                    <p className="success">
                        {message}
                    </p>
                )}

                <button type="submit">Gửi mật khẩu mới</button>

                <p className="mt-10">Chưa có tài khoản? <a href="/register">Đăng ký</a></p>

            </form>
        </div>
    );
}

export default ForgotPassword;
