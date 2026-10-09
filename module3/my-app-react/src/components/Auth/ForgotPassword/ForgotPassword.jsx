import { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../services/authService";
import "./ForgotPassword.css";

function ForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            // Call API Forgot Password
            const res = await authService.forgotPassword(data.email);

            if (res.success) {
                setSuccessMessage(
                    res.message || "Đặt lại mật khẩu thành công! Kiểm tra email của bạn."
                );
            }
        } catch (err) {
            console.error("Lỗi gửi yêu cầu khôi phục mật khẩu:", err);

            const msg =
                err.response?.data?.message || "Email không tồn tại hoặc có lỗi xảy ra.";
            setErrorMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password">
            <h2>Quên mật khẩu</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("email", {
                        required: "Email không được để trống",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Định dạng Email không hợp lệ",
                        },
                    })}
                    placeholder="Email"
                />

                {errors?.email && (
                    <p className="error">{errors.email.message}</p>
                )}

                {errorMessage && <p className="error">{errorMessage}</p>}

                {successMessage && <p className="success">{successMessage}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Submit"}
                </button>
            </form>

            <p className="mt-10">
                Chưa có tài khoản? <a href="/register">Đăng ký</a>
            </p>
        </div>
    );
}

export default ForgotPassword;
