import { useState } from "react";
import { useForm } from "react-hook-form";

import "./Register.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Validation
    var isValid = false;
    var isValidUsername = username.length >= 8;
    var isValidPassword = password.length >= 5;
    var isValidPhoneOnlyNumber = /^\d+$/.test(phone);
    var isValidPhoneLength = phone.length == 10 || phone.length == 11;
    var isValidAddress = address.length >= 10;

    if (
        isValidUsername == true
        && isValidPassword == true
        && isValidPhoneLength == true
        && isValidAddress == true
    ) {
        isValid = true;
    }
    
    const onSubmit = (data) => console.log("Data:", data);

    return (
        <div className="register">
            <h2>Đăng ký</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                {username.length > 0 && !isValidUsername && (
                    <p className="error">
                        Tên tài khoản phải có ít nhất 8 ký tự.
                    </p>
                )}

                {isValidUsername && (
                    <p className="error">
                        Tên tài khoản hợp lệ.
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {password.length > 0 && !isValidPassword && (
                    <p className="error">
                        Password phải có ít nhất 5 ký tự.
                    </p>
                )}

                {isValidPassword && (
                    <p className="error">
                        Password hợp lệ.
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                {phone.length > 0 && !isValidPhoneOnlyNumber && (
                    <p className="error">
                        Số điện thoại chỉ được nhập số
                    </p>
                )}

                {phone.length > 0 && !isValidPhoneLength && (
                    <p className="error">
                        Số điện thoại phải có 10 - 11 ký tự.
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                {address.length > 0 && !isValidAddress && (
                    <p className="error">
                        Địa chỉ phải có ít nhất 10 ký tự.
                    </p>
                )}

                {isValidAddress && (
                    <p className="error">
                        Địa chỉ hợp lệ.
                    </p>
                )}

                Ngày tháng năm sinh
                <select>
                    {Array.from({ length: 31 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                        {index + 1}
                        </option>
                    ))}
                </select>

                <select>
                    {Array.from({ length: 12 }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                        {index + 1}
                        </option>
                    ))}
                </select>

                <input {...register("age", { min: { value: 13, message: "Phải trên 13 tuổi" } })} />
                {errors.age && <p style={{ color: 'red' }}>{errors.age.message}</p>}

                <button type="submit">Register</button>
            </form>

            <p className="mt-10">Đã có tài khoản? <a href="/login">Đăng nhập</a></p>

        </div>
    );
}

export default Register;
