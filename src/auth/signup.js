import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        passw: "",
        repassw: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState({
        passw: false,
        repassw: false,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const validateField = (name, value) => {
        let message = "";

        switch (name) {
            case "name":
                message = !value ? "Vui lòng nhập tên" : "";
                break;
            case "email":
                const emailRegex = /^\w+@\w+(\.\w+)+$/;
                message = !value
                    ? "Vui lòng nhập email"
                    : !emailRegex.test(value)
                        ? "Email không đúng định dạng"
                        : "";
                break;
            case "phone":
                const phoneRegex = /^0\d{9}$/;
                message = !value
                    ? "Vui lòng nhập số điện thoại"
                    : !phoneRegex.test(value)
                        ? "Số điện thoại sai định dạng"
                        : "";
                break;
            case "passw":
                if (!value) message = "Vui lòng nhập mật khẩu";
                else if (value.length < 8) message = "Mật khẩu phải chứa 8 kí tự";
                else if (!/[A-Z]/.test(value))
                    message = "Mật khẩu phải chứa ít nhất 1 kí tự viết hoa";
                else if (!/[a-z]/.test(value))
                    message = "Mật khẩu phải chứa ít nhất 1 kí tự viết thường";
                else if (!/[0-9]/.test(value))
                    message = "Mật khẩu phải chứa ít nhất 1 số";
                else if (!/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(value))
                    message = "Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt";
                break;
            case "repassw":
                message = !value
                    ? "Vui lòng xác nhận mật khẩu"
                    : value !== formData.passw
                        ? "Mật khẩu không trùng khớp"
                        : "";
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: message }));
    };

    const validateForm = () => {
        const fieldNames = ["name", "email", "phone", "passw", "repassw"];
        fieldNames.forEach((field) => validateField(field, formData[field]));
        return Object.values(errors).every((msg) => msg === "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch(
                    "https://localhost:8443/api/auth/register",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: formData.name,
                            password: formData.passw,
                            email: formData.email,
                            phone: formData.phone,
                        }),
                    }
                );

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(errText);
                }

                const data = await response.json();
                console.log("Đăng ký thành công:", data);

                localStorage.setItem("accessToken", data.accessToken);
                alert("Đăng ký thành công!");
                navigate("/login");
            } catch (error) {
                console.error("Lỗi đăng ký:", error);
                alert("Đăng ký thất bại: " + error.message);
            }
        } else {
            alert("Vui lòng kiểm tra lại thông tin!");
        }
    };

    return (
        <section className="login-page">
            <div className="login-form">
                <div className="form-content">
                    <header>Đăng ký</header>
                    <form onSubmit={handleSubmit}>
                        <div className="field input-field">
                            <input
                                name="name"
                                type="text"
                                placeholder="Tên"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <span className="notify">{errors.name}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <span className="notify">{errors.email}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                name="phone"
                                type="tel"
                                placeholder="Số điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <span className="notify">{errors.phone}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                name="passw"
                                type={showPassword.passw ? "text" : "password"}
                                placeholder="Mật khẩu"
                                value={formData.passw}
                                onChange={handleChange}
                            />
                            <i
                                className={`bx ${showPassword.passw ? "bx-show" : "bx-hide"} eye-icon`}
                                onClick={() => togglePasswordVisibility("passw")}
                                style={{ cursor: "pointer" }}
                            ></i>
                            <span className="notify">{errors.passw}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                name="repassw"
                                type={showPassword.repassw ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu"
                                value={formData.repassw}
                                onChange={handleChange}
                            />
                            <i
                                className={`bx ${showPassword.repassw ? "bx-show" : "bx-hide"} eye-icon`}
                                onClick={() => togglePasswordVisibility("repassw")}
                                style={{ cursor: "pointer" }}
                            ></i>
                            <span className="notify">{errors.repassw}</span>
                        </div>

                        <div className="field button-field">
                            <button type="submit">Đăng ký</button>
                        </div>
                    </form>

                    <div className="form-link">
            <span>
              Bạn đã có tài khoản?{" "}
                <Link to="/login" className="link login-link">
                Đăng nhập
              </Link>
            </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
