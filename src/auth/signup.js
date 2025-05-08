import React, { useState, useEffect } from "react";
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

    const [errors, setErrors] = useState({
        error2: "",
        error3: "",
        error4: "",
        error5: "",
        error6: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        clearError(name);
        validateField(name, value);
    };

    const clearError = (name) => {
        setErrors((prev) => ({
            ...prev,
            ["error" + getFieldIndex(name)]: "",
        }));
    };

    const getFieldIndex = (field) => {
        const map = {
            name: "2",
            email: "3",
            phone: "4",
            passw: "5",
            repassw: "6",
        };
        return map[field];
    };

    const validateField = (name, value) => {
        const updatedErrors = { ...errors };

        switch (name) {
            case "name":
                updatedErrors.error2 = !value ? "Vui lòng nhập tên" : "";
                break;
            case "email":
                const emailRegex = /^\w+@\w+(\.\w+)+(\.\w+)*$/;
                updatedErrors.error3 = !value
                    ? "Vui lòng nhập email"
                    : !emailRegex.test(value)
                        ? "Email không đúng định dạng"
                        : "";
                break;
            case "phone":
                const phoneRegex = /^0\d{9}$/;
                updatedErrors.error4 = !value
                    ? "Vui lòng nhập số điện thoại"
                    : !phoneRegex.test(value)
                        ? "Số điện thoại sai định dạng"
                        : "";
                break;
            case "passw":
                if (!value) {
                    updatedErrors.error5 = "Vui lòng nhập mật khẩu";
                } else if (value.length < 8) {
                    updatedErrors.error5 = "Mật khẩu phải chứa 8 kí tự";
                } else if (!/[A-Z]/.test(value)) {
                    updatedErrors.error5 = "Mật khẩu phải chứa ít nhất 1 kí tự viết hoa";
                } else if (!/[a-z]/.test(value)) {
                    updatedErrors.error5 = "Mật khẩu phải chứa ít nhất 1 kí tự viết thường";
                } else if (!/[0-9]/.test(value)) {
                    updatedErrors.error5 = "Mật khẩu phải chứa ít nhất 1 số";
                } else if (!/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(value)) {
                    updatedErrors.error5 = "Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt";
                } else {
                    updatedErrors.error5 = "";
                }
                break;
            case "repassw":
                updatedErrors.error6 = !value
                    ? "Vui lòng xác nhận mật khẩu"
                    : value !== formData.passw
                        ? "Mật khẩu không trùng khớp"
                        : "";
                break;
            default:
                break;
        }
        setErrors(updatedErrors);
    };

    const validateForm = () => {
        Object.entries(formData).forEach(([key, value]) => {
            validateField(key, value);
        });
        return Object.values(errors).every((e) => e === "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: formData.name,
                        password: formData.passw,
                        email: formData.email,
                        phone: formData.phone,
                    }),
                });

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
        }
    };

    useEffect(() => {
        const eyeIcons = document.querySelectorAll(".eye-icon");
        eyeIcons.forEach((eyeIcon) => {
            eyeIcon.addEventListener("click", () => {
                const passwordField = eyeIcon.previousElementSibling;
                if (passwordField.type === "password") {
                    passwordField.type = "text";
                    eyeIcon.classList.replace("bx-hide", "bx-show");
                } else {
                    passwordField.type = "password";
                    eyeIcon.classList.replace("bx-show", "bx-hide");
                }
            });
        });
    }, []);

    return (
        <section className="login-page">
            <div className="login-form">
                <div className="form-content">
                    <header>Signup</header>
                    <form onSubmit={handleSubmit}>
                        <div className="field input-field">
                            <input
                                name="name"
                                type="text"
                                placeholder="Tên"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                            />
                            <span className="notify">{errors.error2}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                            />
                            <span className="notify">{errors.error3}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                name="phone"
                                type="tel"
                                placeholder="Số điện thoại"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input"
                            />
                            <span className="notify">{errors.error4}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                name="passw"
                                type="password"
                                placeholder="Mật khẩu"
                                value={formData.passw}
                                onChange={handleChange}
                                className="password"
                            />
                            <i className="bx bx-hide eye-icon"></i>
                            <span className="notify">{errors.error5}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                name="repassw"
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={formData.repassw}
                                onChange={handleChange}
                                className="password"
                            />
                            <i className="bx bx-hide eye-icon"></i>
                            <span className="notify">{errors.error6}</span>
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
