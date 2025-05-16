import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                    method: "POST",
                    credentials: "include"
                });

                if (response.ok) {
                    // Tuỳ backend trả gì, nhưng nếu backend chưa trả lại user thì nên trả
                    const data = await response.json();
                    console.log("Data khi refresh:", data);
                    setUser(data.user); // <- phải sửa backend trả lại user nếu chưa
                } else {
                    console.warn("Phiên đã hết hạn hoặc token không hợp lệ.");
                }
            } catch (err) {
                console.error("Lỗi khi phục hồi phiên:", err);
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
                console.error("Logout failed.");
                return false;
            }
        } catch (err) {
            console.error("Logout error:", err);
            return false;
        }
    };

    const authValue = { user, setUser, login, logout };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
