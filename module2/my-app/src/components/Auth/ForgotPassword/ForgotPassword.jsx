import { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "admin@gmail.com") {
            setMessage("Email hợp lệ. Vui lòng kiểm tra hộp thư để đặt lại mật khẩu.");
        } else {
            setMessage("Email không tồn tại trong hệ thống.");
        }
        console.log(message)
    };

    return (
        <div className="forgot-password-page">
            <div className="forgot-password">
                <h2>Quên mật khẩu</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {message && (
                        <p className="success">
                            {message}
                        </p>
                    )}

                    <button type="submit">Gửi mật khẩu mới</button>

                    <p className="mt-10">Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
