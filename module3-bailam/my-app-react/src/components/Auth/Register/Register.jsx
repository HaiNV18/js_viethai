import { useForm } from "react-hook-form";
import "./Register.css";

function Register() {
    const currentYear = new Date().getFullYear();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            username: "",
            password: "",
            phone: "",
            address: "",
            day: "",
            month: "",
            year: "",
        },
    });

    const day = watch("day");
    const month = watch("month");
    const year = watch("year");

    // Validation ngày sinh
    const isValidBirthday = () => {
        if (!day || !month || !year) {
            return false;
        }

        const selectedDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        return (
            selectedDate.getFullYear() === Number(year) &&
            selectedDate.getMonth() === Number(month) - 1 &&
            selectedDate.getDate() === Number(day)
        );
    };

    const onSubmit = (data) => {
        console.log("Register data:", data);
        // Call API
    };

    return (
        <div className="register-page">
            <div className="register">
                <h2>Đăng ký</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Username */}
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username", {
                            required: "Vui lòng nhập tên tài khoản.",
                            minLength: {
                                value: 8,
                                message: "Tên tài khoản phải có ít nhất 8 ký tự.",
                            },
                        })}
                    />

                    {errors.username && (
                        <p className="error">
                            {errors.username.message}
                        </p>
                    )}

                    {!errors.username && watch("username") && (
                        <p className="success">Tên tài khoản hợp lệ.</p>
                    )}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Vui lòng nhập password.",
                            minLength: {
                                value: 5,
                                message: "Password phải có ít nhất 5 ký tự.",
                            },
                        })}
                    />

                    {errors.password && (
                        <p className="error">
                            {errors.password.message}
                        </p>
                    )}

                    {!errors.password && watch("password") && (
                        <p className="success">
                            Password hợp lệ.
                        </p>
                    )}

                    {/* Phone */}
                    <input
                        type="text"
                        placeholder="Phone"
                        {...register("phone", {
                            required: "Vui lòng nhập số điện thoại.",
                            pattern: {
                                value: /^\d+$/,
                                message: "Số điện thoại chỉ được nhập số.",
                            },
                            minLength: {
                                value: 10,
                                message: "Số điện thoại phải có 10 - 11 ký tự.",
                            },
                            maxLength: {
                                value: 11,
                                message: "Số điện thoại phải có 10 - 11 ký tự.",
                            },
                        })}
                    />

                    {errors.phone && (
                        <p className="error">
                            {errors.phone.message}
                        </p>
                    )}

                    {!errors.phone && watch("phone") && (
                        <p className="success">
                            Số điện thoại hợp lệ.
                        </p>
                    )}

                    {/* Address */}
                    <input
                        type="text"
                        placeholder="Address"
                        {...register("address", {
                            required: "Vui lòng nhập địa chỉ.",
                            minLength: {
                                value: 10,
                                message:
                                    "Địa chỉ phải có ít nhất 10 ký tự.",
                            },
                        })}
                    />

                    {errors.address && (
                        <p className="error">
                            {errors.address.message}
                        </p>
                    )}

                    {!errors.address && watch("address") && (
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
                                {...register("day", {
                                    required: "Vui lòng chọn ngày sinh.",
                                    validate: () =>
                                        isValidBirthday() ||
                                        "Ngày sinh không hợp lệ.",
                                })}
                            >
                                <option value="">Ngày</option>

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
                                {...register("month", {
                                    required:
                                        "Vui lòng chọn tháng sinh.",
                                    validate: () =>
                                        isValidBirthday() ||
                                        "Ngày sinh không hợp lệ.",
                                })}
                            >
                                <option value="">Tháng</option>

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
                                {...register("year", {
                                    required:
                                        "Vui lòng chọn năm sinh.",
                                    validate: () =>
                                        isValidBirthday() ||
                                        "Ngày sinh không hợp lệ.",
                                })}
                            >
                                <option value="">Năm</option>

                                {Array.from(
                                    {
                                        length: currentYear - 1900 + 1,
                                    },
                                    (_, index) => {
                                        const value = currentYear - index;

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
                    {(day || month || year) &&
                        (!day || !month || !year) && (
                            <p className="error">
                                Vui lòng chọn đầy đủ ngày, tháng và
                                năm sinh.
                            </p>
                        )}

                    {day &&
                        month &&
                        year &&
                        !isValidBirthday() && (
                            <p className="error">
                                Ngày sinh không hợp lệ.
                            </p>
                        )}

                    {day &&
                        month &&
                        year &&
                        isValidBirthday() && (
                            <p className="success">
                                Ngày sinh hợp lệ.
                            </p>
                        )}

                    {/* Button */}
                    <button type="submit" disabled={!isValid}>
                        Register
                    </button>
                </form>

                <p className="mt-10">
                    Đã có tài khoản?{" "}
                    <a href="/login">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
