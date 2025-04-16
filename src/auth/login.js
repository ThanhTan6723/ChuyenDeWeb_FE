import React, {useState} from "react";
import "./auth.css";
import {Link, useNavigate} from "react-router-dom";
import "boxicons/css/boxicons.min.css";

const Login = () => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorIdenty, setErrorIdenty] = useState("");
    const [errorP, setErrorP] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Replace this with your actual API call
            fetch("/LoginControll", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({identifier, password}),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Login failed!");
                    return res.json();
                })
                .then((data) => {
                    navigate("/dashboard"); // Or returnUrl
                })
                .catch((err) => {
                    setError("Tài khoản hoặc mật khẩu không đúng!");
                });
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
                                }}
                            />
                            <i
                                className="bx bx-hide eye-icon"
                                onClick={togglePasswordVisibility}
                            ></i>
                            <span className="error">{errorP}</span>
                        </div>

                        <div className="form-link">
                            <Link to="/forgotpassword" className="forgot-pass">
                                Quên mật khẩu
                            </Link>
                        </div>

                        <div className="form-link">
                            <span className="error-box">{error}</span>
                        </div>

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
                        <img src="assets/img/google.png" alt="Google" className="google-img"/>
                        <span>Tiếp tục với Google</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Login;
