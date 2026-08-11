import { useState } from "react";
import "./Register.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    // Validation

    const isValidUsername = username.length >= 8;

    const isValidPassword = password.length >= 5;

    const isValidPhoneOnlyNumber = /^\d+$/.test(phone);

    const isValidPhoneLength =
        phone.length === 10 || phone.length === 11;

    const isValidAddress = address.length >= 10;

    // Validation Birthday
    let isValidBirthday = false;

    if (day !== "" && month !== "" && year !== "") {
        const selectedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        // Kiểm tra ngày thực sự tồn tại
        isValidBirthday =
            selectedDate.getFullYear() === Number(year) &&
            selectedDate.getMonth() === Number(month) - 1 &&
            selectedDate.getDate() === Number(day);
    }

    const isValid =
        isValidUsername &&
        isValidPassword &&
        isValidPhoneOnlyNumber &&
        isValidPhoneLength &&
        isValidAddress &&
        isValidBirthday;

    // Current Year
    const currentYear = new Date().getFullYear();

    return (
        <div className="register-page">
            <div className="register">

                <h2>Đăng ký</h2>

                {/* Username */}
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
                    <p className="success">
                        Tên tài khoản hợp lệ.
                    </p>
                )}

                {/* Password */}
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
                    <p className="success">
                        Password hợp lệ.
                    </p>
                )}

                {/* Phone */}
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                {phone.length > 0 && !isValidPhoneOnlyNumber && (
                    <p className="error">
                        Số điện thoại chỉ được nhập số.
                    </p>
                )}

                {phone.length > 0 &&
                    isValidPhoneOnlyNumber &&
                    !isValidPhoneLength && (
                        <p className="error">
                            Số điện thoại phải có 10 - 11 ký tự.
                        </p>
                    )}

                {phone.length > 0 &&
                    isValidPhoneOnlyNumber &&
                    isValidPhoneLength && (
                        <p className="success">
                            Số điện thoại hợp lệ.
                        </p>
                    )}

                {/* Address */}
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
                    <p className="success">
                        Địa chỉ hợp lệ.
                    </p>
                )}

                {/* Ngày sinh */}
                <div className="birthday">
                    <label>Ngày tháng năm sinh</label>

                    <div className="birthday-select">

                        {/* Ngày */}
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                        >
                            <option value="">
                                Ngày
                            </option>

                            {Array.from(
                                { length: 31 },
                                (_, index) => (
                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                    >
                                        {index + 1}
                                    </option>
                                )
                            )}
                        </select>

                        {/* Tháng */}
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            <option value="">
                                Tháng
                            </option>

                            {Array.from(
                                { length: 12 },
                                (_, index) => (
                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                    >
                                        {index + 1}
                                    </option>
                                )
                            )}
                        </select>

                        {/* Năm */}
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            <option value="">
                                Năm
                            </option>

                            {Array.from(
                                { length: currentYear - 1900 + 1 },
                                (_, index) => {
                                    const value =
                                        currentYear - index;

                                    return (
                                        <option
                                            key={value}
                                            value={value}
                                        >
                                            {value}
                                        </option>
                                    );
                                }
                            )}
                        </select>

                    </div>
                </div>

                {/* Validation ngày sinh */}

                {(day !== "" ||
                    month !== "" ||
                    year !== "") &&
                    (day === "" ||
                        month === "" ||
                        year === "") && (
                        <p className="error">
                            Vui lòng chọn đầy đủ ngày, tháng và năm sinh.
                        </p>
                    )}

                {day !== "" &&
                    month !== "" &&
                    year !== "" &&
                    !isValidBirthday && (
                        <p className="error">
                            Ngày sinh không hợp lệ.
                        </p>
                    )}

                {isValidBirthday && (
                    <p className="success">
                        Ngày sinh hợp lệ.
                    </p>
                )}

                {/* Button */}
                <button disabled={!isValid}>
                    Register
                </button>

            </div>
        </div>
    );
}

export default Register;
