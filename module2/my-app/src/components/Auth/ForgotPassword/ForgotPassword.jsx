import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

import "./ForgotPassword.css";

function ForgotPassword() {

    // register: Đăng ký input | handleSubmit: Hàm bọc xử lý submit
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => console.log("Data:", data);

    return (
        <div className="forgot-password">
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("username")} placeholder="Username" />
                <input {...register("email")} placeholder="Email" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );

}

export default ForgotPassword;
