import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

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
