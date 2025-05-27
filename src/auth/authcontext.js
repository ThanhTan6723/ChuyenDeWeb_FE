import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        console.log('Khôi phục user từ localStorage:', savedUser);
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Theo dõi trạng thái đăng nhập
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    const restoreSession = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Phản hồi từ refresh-token:', data);
                if (data.user && data.accessToken && data.refreshToken) {
                    const userData = {
                        id: data.user.id,
                        username: data.user.username || data.user.email.split('@')[0],
                        email: data.user.email,
                    };
                    setUser(userData);
                    setIsLoggedIn(true);
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Đã cập nhật user:', userData);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                    localStorage.removeItem('user');
                    console.log('Không có dữ liệu user hợp lệ');
                }
            } else {
                console.log('Refresh token thất bại:', response.status);
                setUser(null);
                setIsLoggedIn(false);
                localStorage.removeItem('user');
            }
        } catch (err) {
            console.error("Lỗi khi khôi phục phiên:", err);
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Chỉ gọi restoreSession nếu chưa đăng nhập
        if (!isLoggedIn && !user) {
            restoreSession();
        } else {
            setLoading(false); // Bỏ qua restoreSession nếu đã đăng nhập
        }
    }, [isLoggedIn, user]);

    const login = async (email, password, phone, navigate) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password, phone }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Phản hồi từ login:', data);
                if (data.user && data.accessToken && data.refreshToken) {
                    const userData = {
                        id: data.user.id,
                        username: data.user.username || data.user.email.split('@')[0],
                        email: data.user.email,
                    };
                    setUser(userData);
                    setIsLoggedIn(true); // Đánh dấu đã đăng nhập
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Đã cập nhật user sau login:', userData);
                    navigate('/home');
                    return true;
                }
                console.log('Dữ liệu login không hợp lệ');
                return false;
            } else {
                console.log('Login thất bại:', response.status);
                return false;
            }
        } catch (err) {
            console.error("Lỗi đăng nhập:", err);
            return false;
        }
    };

    const handleOAuth2Callback = async (navigate) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Phản hồi từ OAuth2 callback:', data);
                if (data.user && data.accessToken && data.refreshToken) {
                    const userData = {
                        id: data.user.id,
                        username: data.user.username || data.user.email.split('@')[0],
                        email: data.user.email,
                    };
                    setUser(userData);
                    setIsLoggedIn(true); // Đánh dấu đã đăng nhập
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Đã cập nhật user sau OAuth2:', userData);
                    navigate('/home');
                    return true;
                }
                console.log('Dữ liệu OAuth2 không hợp lệ');
                return false;
            } else {
                console.log('OAuth2 callback thất bại:', response.status);
                return false;
            }
        } catch (err) {
            console.error("Lỗi xử lý OAuth2 callback:", err);
            return false;
        }
    };

    const logout = async (navigate) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setUser(null);
                setIsLoggedIn(false); // Đánh dấu đã đăng xuất
                localStorage.removeItem('user');
                console.log('Đã đăng xuất, xóa user');
                // navigate('/login');
                return true;
            }
            console.log('Logout thất bại:', response.status);
            return false;
        } catch (err) {
            console.error("Lỗi đăng xuất:", err);
            return false;
        }
    };

    const refreshToken = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Phản hồi từ refreshToken:', data);
                if (data.user && data.accessToken && data.refreshToken) {
                    const userData = {
                        id: data.user.id,
                        username: data.user.username || data.user.email.split('@')[0],
                        email: data.user.email,
                    };
                    setUser(userData);
                    setIsLoggedIn(true);
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Đã cập nhật user sau refreshToken:', userData);
                    return true;
                }
                setUser(null);
                setIsLoggedIn(false);
                localStorage.removeItem('user');
                console.log('Dữ liệu refreshToken không hợp lệ');
                return false;
            } else {
                setUser(null);
                setIsLoggedIn(false);
                localStorage.removeItem('user');
                console.log('Refresh token thất bại:', response.status);
                return false;
            }
        } catch (err) {
            console.error("Lỗi làm mới token:", err);
            setUser(null);
            setIsLoggedIn(false);
            localStorage.removeItem('user');
            return false;
        }
    };

    console.log('Trạng thái user hiện tại:', user);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, refreshToken, handleOAuth2Callback }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};