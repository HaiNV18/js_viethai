import { useForm } from "react-hook-form";

import "./ForgotPassword.css";

function ForgotPassword() {
    // register: Đăng ký input | handleSubmit: Hàm bọc xử lý submit
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => console.log("Data:", data);

    return (
        <div className="forgot-password">
            <h2>Quên mật khẩu</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input 
                    {...register("email", {
                        required: "Email không được để trống",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Định dạng Email không hợp lệ"
                        }
                    })} 
                    placeholder="Email"
                />

                {errors?.email && <p className="success">{errors.email.message}</p>}

                <button type="submit">Submit</button>
            </form>
            
            <p className="mt-10">Chưa có tài khoản? <a href="/register">Đăng ký</a></p>

        </div>
    );
}

export default ForgotPassword;
