import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const token = new URLSearchParams(window.location.search).get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notify, setNotify] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotify("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setNotify("Vui lòng nhập đầy đủ mật khẩu.");
            return;
        }

        if (password !== confirmPassword) {
            setNotify("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const res = await fetch("https://localhost:8443/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const message = await res.text();

            if (res.ok) {
                setSuccess("Đặt lại mật khẩu thành công. Đang chuyển hướng...");
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setNotify(message);
            }
        } catch (error) {
            console.error("Reset error:", error);
            setNotify("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <div className="container forms" style={{ paddingBottom: "150px" }}>
            <div className="form login">
                <div className="form-content">
                    <header>Đặt lại mật khẩu</header>
                    <form onSubmit={handleSubmit}>
                        <div className="field input-field">
                            <input
                                type="password"
                                placeholder="Mật khẩu mới"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="field input-field">
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                className="input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {notify && <p style={{ color: "red" }}>{notify}</p>}
                        {success && <p style={{ color: "green" }}>{success}</p>}

                        <div className="field button-field">
                            <button type="submit">Đặt lại mật khẩu</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
