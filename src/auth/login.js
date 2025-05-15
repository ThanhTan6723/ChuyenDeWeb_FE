import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import { useAuth } from './authcontext';

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorIdenty, setErrorIdenty] = useState("");
    const [errorP, setErrorP] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    const validateForm = () => {
        let valid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!identifier) {
            setErrorIdenty("Vui lòng nhập email hoặc số điện thoại");
            valid = false;
        } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
            setErrorIdenty("Email hoặc số điện thoại không hợp lệ");
            valid = false;
        } else {
            setErrorIdenty("");
        }

        if (!password) {
            setErrorP("Vui lòng nhập mật khẩu");
            valid = false;
        } else {
            setErrorP("");
        }

        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Tách định danh thành email/phone cho BE
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const payload = {
            email: emailRegex.test(identifier) ? identifier : null,
            phone: !emailRegex.test(identifier) ? identifier : null,
            password
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                login(data.user); // Lưu user vào context
                navigate('/'); // Chuyển về trang chính
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.");
            }
        } catch (err) {
            setError("Không thể kết nối tới máy chủ.");
            console.error("Login error:", err);
        }
    };

    const togglePasswordVisibility = (e) => {
        const input = e.target.previousElementSibling;
        input.type = input.type === "password" ? "text" : "password";
        e.target.classList.toggle("bx-show");
        e.target.classList.toggle("bx-hide");
    };

    return (
        <section className="login-page">
            <div className="login-form">
                <div className="form-content">
                    <header>Đăng nhập</header>
                    <form onSubmit={handleSubmit}>
                        <div className="field input-field">
                            <input
                                type="text"
                                name="identifier"
                                placeholder="Email hoặc số điện thoại"
                                className="input"
                                value={identifier}
                                onChange={(e) => {
                                    setIdentifier(e.target.value);
                                    setErrorIdenty("");
                                    setError("");
                                }}
                            />
                            <span className="error">{errorIdenty}</span>
                        </div>

                        <div className="field input-field">
                            <input
                                type="password"
                                name="password"
                                placeholder="Mật khẩu"
                                className="input"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrorP("");
                                    setError("");
                                }}
                            />
                            <i className="bx bx-hide eye-icon" onClick={togglePasswordVisibility}></i>
                            <span className="error">{errorP}</span>
                        </div>

                        <div className="form-link">
                            <div className="forgot">
                                <Link to="/forgotpassword" className="forgot-pass">
                                    Quên mật khẩu
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="error-box">
                                <span className="error-box">{error}</span>
                            </div>
                        )}

                        <div className="field button-field">
                            <button type="submit">Đăng nhập</button>
                        </div>
                    </form>

                    <div className="form-link">
            <span>
              Bạn chưa có tài khoản?{" "}
                <Link to="/signup" className="link signup-link">
                Đăng ký
              </Link>
            </span>
                    </div>
                </div>

                <div className="media-options">
                    <a
                        href="https://www.facebook.com/v20.0/dialog/oauth?client_id=463688686382911&redirect_uri=http://localhost:8080/login-facebook"
                        className="field facebook"
                    >
                        <i className="bx bxl-facebook facebook-icon"></i>
                        <span>Tiếp tục với Facebook</span>
                    </a>
                </div>

                <div className="media-options">
                    <a
                        href="https://accounts.google.com/o/oauth2/auth?scope=email%20profile&redirect_uri=http://localhost:8080/login-google&response_type=code&client_id=103711909118-kj61sqe0bv8srccvmk7tire0ih1oi87o.apps.googleusercontent.com"
                        className="field google"
                    >
                        <img src="/img/google.png" alt="Google" className="google-img" />
                        <span>Tiếp tục với Google</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Login;
