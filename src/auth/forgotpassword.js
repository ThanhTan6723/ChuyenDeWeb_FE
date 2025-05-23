import React, { useState } from "react";
import "./auth.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [notify, setNotify] = useState("");
    const [success, setSuccess] = useState("");

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotify("");
        setSuccess("");

        if (!email.trim()) {
            setNotify("Vui lòng nhập email của bạn.");
            return;
        }

        if (!isValidEmail(email)) {
            setNotify("Email không đúng định dạng.");
            return;
        }

        try {
            const res = await fetch("https://localhost:8443/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    frontendUrl: window.location.origin, // gửi đường dẫn FE
                }),
            });

            const data = await res.text();

            if (res.ok) {
                setSuccess(data || "Đã gửi email đặt lại mật khẩu.");
            } else {
                setNotify(data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setNotify("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
        }
    };

    return (
        <div className="container forms" style={{ paddingBottom: "150px" }}>
            <div className="form login">
                <div className="form-content">
                    <header>Quên mật khẩu</header>
                    <p style={{ fontSize: "16px", color: "#3472ac" }}>
                        Vui lòng nhập email để đặt lại mật khẩu
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="field input-field">
                            <input
                                type="email"
                                placeholder="Email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {notify && <p style={{ color: "red" }}>{notify}</p>}
                        {success && <p style={{ color: "green" }}>{success}</p>}

                        <div className="field button-field">
                            <button type="submit">Gửi liên kết</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
