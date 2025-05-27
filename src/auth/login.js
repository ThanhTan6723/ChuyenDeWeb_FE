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
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!identifier.trim()) {
            setErrorIdenty("Vui lòng nhập email hoặc số điện thoại");
            isValid = false;
        } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
            setErrorIdenty("Định dạng email hoặc số điện thoại không hợp lệ");
            isValid = false;
        } else {
            setErrorIdenty("");
        }

        if (!password.trim()) {
            setErrorP("Vui lòng nhập mật khẩu");
            isValid = false;
        } else {
            setErrorP("");
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = emailRegex.test(identifier) ? identifier : "";
        const phone = !emailRegex.test(identifier) ? identifier : "";

        try {
            const success = await login(email, password, phone, navigate);
            if (!success) {
                setError("Đăng nhập thất bại. Vui lòng kiểm tra email/số điện thoại hoặc mật khẩu.");
            }
        } catch (err) {
            setError("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
            console.error("Lỗi đăng nhập:", err);
        } finally {
            setLoading(false);
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
                                disabled={loading}
                            />
                            {errorIdenty && <span className="error">{errorIdenty}</span>}
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
                                disabled={loading}
                            />
                            <i className="bx bx-hide eye-icon" onClick={togglePasswordVisibility}></i>
                            {errorP && <span className="error">{errorP}</span>}
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
                                <span className="error">{error}</span>
                            </div>
                        )}

                        <div className="field button-field">
                            <button type="submit" disabled={loading}>
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
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
                    <a href={`${process.env.REACT_APP_API_BASE_URL || "https://localhost:8443"}/oauth2/authorization/facebook`} className="field facebook">
                        <i className="bx bxl-facebook facebook-icon"></i>
                        <span>Tiếp tục với Facebook</span>
                    </a>
                </div>

                <div className="media-options">
                    <a href={`${process.env.REACT_APP_API_BASE_URL || "https://localhost:8443"}/oauth2/authorization/google`} className="field google">
                        <img src="/img/google.png" alt="Google" className="google-img" />
                        <span>Tiếp tục với Google</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Login;