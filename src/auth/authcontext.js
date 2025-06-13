import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:8443';

    const extractUserInfo = (data) => ({
        id: data.user.id,
        username: data.user.username || data.user.email.split('@')[0],
        email: data.user.email,
        phone: data.user.phone
    });

    const setUserAndLogin = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const clearSession = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
    };

    const restoreSession = async () => {
        setLoading(true);
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                if (data.user) {
                    setUserAndLogin(extractUserInfo(data));
                } else {
                    clearSession();
                }
            } else {
                clearSession();
            }
        } catch (err) {
            console.error('Lỗi khi khôi phục phiên:', err);
            clearSession();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        restoreSession();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (user) refreshToken();
        }, 14 * 60 * 1000); // 14 phút

        return () => clearInterval(interval);
    }, [user]);

    const login = async (email, password, phone, navigate) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, phone }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.user) {
                    setUserAndLogin(extractUserInfo(data));
                    navigate('/home');
                    return { success: true };
                }
            }
            return {
                success: false,
                locked: data.locked || false,
                failedAttempts: data.failedAttempts || 0
            };
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            return {
                success: false,
                locked: false,
                failedAttempts: 0
            };
        }
    };

    const logout = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                clearSession();
                return true;
            }
            return false;
        } catch (err) {
            console.error('Lỗi đăng xuất:', err);
            return false;
        }
    };

    const refreshToken = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                method: 'POST',
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                if (data.user) {
                    setUserAndLogin(extractUserInfo(data));
                    return true;
                }
            }
            clearSession();
            return false;
        } catch (err) {
            console.error('Lỗi làm mới token:', err);
            clearSession();
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoggedIn,
                loading,
                login,
                logout,
                refreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);