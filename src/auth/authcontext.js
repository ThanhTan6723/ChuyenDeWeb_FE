import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Thêm trạng thái tải
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Dữ liệu khi làm mới:", data);
                    setUser(data.user); // Đảm bảo data.user tồn tại
                } else {
                    console.warn("Phiên đã hết hạn hoặc token không hợp lệ.");
                    setUser(null);
                }
            } catch (err) {
                console.error("Lỗi khi khôi phục phiên:", err);
                setUser(null);
            } finally {
                setLoading(false); // Đặt loading thành false khi hoàn tất
            }
        };

        restoreSession();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setUser(null);
                return true;
            } else {
                console.error("Đăng xuất thất bại.");
                return false;
            }
        } catch (err) {
            console.error("Lỗi đăng xuất:", err);
            return false;
        }
    };

    const authValue = { user, setUser, login, logout, loading }; // Bao gồm loading trong context

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};