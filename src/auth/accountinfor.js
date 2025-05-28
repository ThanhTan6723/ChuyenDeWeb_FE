import { useAuth } from './authcontext';
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AccountInfo = () => {
    const { user, loading, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });
    const [saving, setSaving] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    if (loading) return <div>Đang tải thông tin tài khoản...</div>;
    if (!user) return <div>Không có thông tin người dùng.</div>;

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);

        try {
            console.log("Gửi yêu cầu cập nhật với dữ liệu:", formData); // Debug
            const response = await fetch(`${API_BASE_URL}/api/user/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Gửi cookie chứa accessToken
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log("Cập nhật thành công:", updatedUser); // Debug
                setUser({
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    role: updatedUser.role?.roleName || user.role,
                });
                setFormData({
                    username: updatedUser.username,
                    email: updatedUser.email,
                    phone: updatedUser.phone || "",
                });
                setIsEditing(false);
                toast.success("Cập nhật thông tin thành công!");
            } else {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage;

                switch (response.status) {
                    case 401:
                        errorMessage = "Không được phép: Vui lòng đăng nhập lại.";
                        break;
                    case 403:
                        errorMessage = errorData.message || "Không có quyền cập nhật thông tin.";
                        break;
                    case 409:
                        errorMessage = errorData.message || "Username hoặc email đã tồn tại.";
                        break;
                    case 400:
                        errorMessage = Object.values(errorData).join(", ") || "Dữ liệu không hợp lệ.";
                        break;
                    default:
                        errorMessage = errorData.message || "Lỗi không xác định.";
                }

                console.error("Cập nhật thất bại:", errorData, "Status:", response.status); // Debug
                toast.error(`Cập nhật thất bại: ${errorMessage}`);
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật thông tin:", err);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="account-info-container">
            <h2>Thông tin tài khoản</h2>
            {isEditing ? (
                <>
                    <p>
                        <strong>Tên người dùng:</strong>{" "}
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </p>
                    <p>
                        <strong>Số điện thoại:</strong>{" "}
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </p>
                    <button disabled={saving} onClick={handleSave}>
                        {saving ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button disabled={saving} onClick={() => setIsEditing(false)}>
                        Hủy
                    </button>
                </>
            ) : (
                <>
                    <p><strong>Tên người dùng:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Số điện thoại:</strong> {user.phone}</p>
                    <button onClick={() => setIsEditing(true)}>Cập nhật thông tin</button>
                </>
            )}
        </div>
    );
};

export default AccountInfo;