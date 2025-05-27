import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../auth/authcontext';

const CART_API_URL = 'https://localhost:8443/api/cart';

const Header = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartError, setCartError] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate("/home");
        }
    };

    // Fetch cart and calculate total quantity for badge
    const fetchCart = useCallback(async () => {
        setCartLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setShowLoginModal(true);
                setCartItems([]);
                setCartCount(0);
                return;
            }

            const response = await fetch(CART_API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            if (response.status === 401) {
                setShowLoginModal(true);
                setCartItems([]);
                setCartCount(0);
                return;
            }

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${text.slice(0, 100)}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                throw new Error("Phản hồi không phải JSON! Server trả về: " + text.slice(0, 100));
            }

            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                setCartItems([]);
                setCartCount(0);
                return;
            }
            // Chuẩn hóa dữ liệu đúng với CartItemDTO
            let totalQty = 0;
            const items = data.map(item => {
                totalQty += item.quantity || 0;
                return {
                    productVariantId: item.productVariantId,
                    name: item.productName,
                    image: item.mainImageUrl || '/img/product/placeholder.jpg',
                    price: item.price,
                    quantity: item.quantity,
                    total: (item.price || 0) * (item.quantity || 1),
                    attribute: item.attribute,
                    variant: item.variant,
                    brandName: item.brandName,
                    categoryName: item.categoryName,
                };
            });
            setCartItems(items);
            setCartCount(totalQty);
        } catch (err) {
            setCartError('Không thể tải giỏ hàng. ' + err.message);
            setCartItems([]);
            setCartCount(0);
            console.error('Error fetching cart:', err);
        } finally {
            setCartLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchCart();
    }, [user, fetchCart]);

    const handleCartToggle = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        if (!showCartDropdown) {
            fetchCart();
        }
        setShowCartDropdown(!showCartDropdown);
    };

    const closeModal = () => setShowLoginModal(false);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <>
            <header className="main_menu home_menu">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg navbar-light">
                                <a className="navbar-brand" href="/">
                                    <img src="/img/logo.png" alt="logo" />
                                </a>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#navbarSupportedContent"
                                    aria-controls="navbarSupportedContent"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                >
                                    <span className="menu_icon">
                                        <i className="fas fa-bars" />
                                    </span>
                                </button>
                                <div
                                    className="collapse navbar-collapse main-menu-item"
                                    id="navbarSupportedContent"
                                >
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/home">
                                                Trang chủ
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/shop">
                                                Sản Phẩm
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">
                                                Voucher
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/shop-detail">
                                                Blog
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="/contact">
                                                Liên hệ
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="language" style={{ marginRight: '20px' }}>
                                    <img src="/img/usa.png" style={{ marginRight: '5px' }} alt="USA" />
                                    <img src="/img/vietnam.png" alt="Vietnam" />
                                </div>

                                <div className="hearer_icon d-flex align-items-center">
                                    {user ? (
                                        <div className="user-dropdown">
                                            <span className="user-name">{user.username}</span>
                                            <div className="dropdown-content">
                                                <a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleLogout();
                                                    }}
                                                >
                                                    Đăng xuất
                                                </a>
                                                <a href="#">Kho voucher</a>
                                                <a href="#">Hỗ trợ</a>
                                                <a href="#">Thông tin tài khoản</a>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <img src="/img/login.png" style={{ marginRight: '5px' }} alt="Login" />
                                            <Link className="auth" to="/login">
                                                Đăng nhập/Đăng ký
                                            </Link>
                                        </>
                                    )}
                                    <a id="search_1" href="#">
                                        <i className="ti-search" />
                                    </a>
                                    <a href="#">
                                        <i className="ti-heart" />
                                    </a>
                                    <div className="dropdown cart position-relative">
                                        <a
                                            className="dropdown-toggle"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleCartToggle();
                                            }}
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded={showCartDropdown}
                                        >
                                            <i className="fas fa-shopping-cart" />
                                            {cartCount > 0 && (
                                                <span className="badge badge-pill badge-danger" style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
                                                    {cartCount}
                                                </span>
                                            )}
                                        </a>
                                        {user && (
                                            <div
                                                className={`dropdown-menu dropdown-menu-right ${showCartDropdown ? 'show' : ''}`}
                                                style={{ minWidth: '300px', padding: '10px' }}
                                            >
                                                {cartLoading ? (
                                                    <div className="text-center py-3">Đang tải...</div>
                                                ) : cartError ? (
                                                    <div className="text-center py-3 text-danger">{cartError}</div>
                                                ) : cartItems.length === 0 ? (
                                                    <div className="text-center py-3">Giỏ hàng trống</div>
                                                ) : (
                                                    <>
                                                        {cartItems.map((item) => (
                                                            <div
                                                                key={item.productVariantId}
                                                                className="cart-item d-flex align-items-center mb-3 border-bottom pb-2"
                                                            >
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    style={{ width: '50px', marginRight: '10px' }}
                                                                />
                                                                <div className="flex-grow-1">
                                                                    <p className="mb-1">{item.name}</p>
                                                                    <small>
                                                                        {item.quantity} x {item.price?.toLocaleString()}₫
                                                                    </small>
                                                                </div>
                                                                <div className="text-right">
                                                                    <strong>{item.total?.toLocaleString()}₫</strong>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                                            <strong>Tổng: </strong>
                                                            <strong>
                                                                {cartItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}₫
                                                            </strong>
                                                        </div>
                                                        <Link
                                                            to="/cart"
                                                            className="btn btn-primary btn-block mt-3"
                                                            onClick={() => setShowCartDropdown(false)}
                                                        >
                                                            Xem giỏ hàng
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal yêu cầu đăng nhập */}
            {showLoginModal && (
                <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Yêu cầu đăng nhập</h3>
                        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn!</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={closeModal}
                            >
                                Đóng
                            </button>
                            <Link
                                to="/login"
                                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                                onClick={closeModal}
                            >
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;