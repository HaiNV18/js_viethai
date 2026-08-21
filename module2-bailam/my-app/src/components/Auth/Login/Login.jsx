import { useRef, useState } from "react";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // Validation
    var isValid = username.length >= 8;

    const handleLogin = (e) => {
        e.preventDefault();

        const formData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        
        console.log("Dữ liệu gửi lên Server:", formData)
    }

    return (
        <div className="login">
            <h2>Đăng nhập</h2>

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    ref={emailRef}
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
                    ref={passwordRef}
                />

                <p className="mt-10"><a href="/forgot-password">Quên mật khẩu?</a></p>

                <button type="submit">Login</button>
            </form>

            <p className="mt-10">Chưa có tài khoản? <a href="/register">Đăng ký</a></p>

        </div>
    );
}

export default Login;
