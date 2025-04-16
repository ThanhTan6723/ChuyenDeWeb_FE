import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import "boxicons/css/boxicons.min.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [notify, setNotify] = useState("");
    const navigate = useNavigate(); // Nếu muốn redirect sau khi submit

    const validateEmail = (email) => {
        const emailRegex = /^\w+@\w+(\.\w+)+(\.\w+)*$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email.trim() === "") {
            setNotify("Vui lòng nhập email của bạn");
        } else if (!validateEmail(email)) {
            setNotify("Email không đúng định dạng");
        } else {
            setNotify("");
            // 🚀 Gửi request - bạn có thể fetch/axios để gọi API nếu cần
            console.log("Đang gửi email:", email);

            // Ví dụ: redirect hoặc hiển thị thông báo
            // navigate("/success-page");
        }
    };

    return (
        <div className="container forms" style={{ paddingBottom: "150px" }}>
            <div className="form login">
                <div className="form-content">
                    <header>Forgot password</header>
                    <div className="form-link">
            <span style={{ fontSize: "18px", color: "#3472ac" }}>
              <b>Vui lòng nhập email của bạn để lấy lại mật khẩu</b>
            </span>
                    </div>

                    <form id="forgotForm" onSubmit={handleSubmit}>
                        <div className="field input-field">
                            <input
                                type="email"
                                id="mail"
                                name="email"
                                placeholder="Email"
                                className="input"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <span id="notify" style={{ color: "red" }}>
                {notify}
              </span>
                        </div>

                        <div className="form-link"></div>
                        <div className="field button-field">
                            <button type="submit">Gửi</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
