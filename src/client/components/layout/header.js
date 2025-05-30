import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../auth/authcontext';
import { useCart } from '../../contexts/cartcontext';

const Header = () => {
    const { user, logout, loading } = useAuth();
    const { cartCount, fetchCart, setCartCount } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !loading) {
            fetchCart();
        }
    }, [user, loading, fetchCart]);

    const handleLogout = async () => {
        try {
            const success = await logout();
            if (success) {
                setCartCount(0);
            }
        } catch (err) {
            console.error("Lỗi khi đăng xuất:", err);
        }
    };

    const handleCartToggle = () => {
        if (!user) {
            alert('Bạn cần đăng nhập để xem giỏ hàng')
            navigate('/login', { state: { from: '/cart' } });
            return;
        }
        navigate('/cart');
    };

    if (loading) return <div className="text-center py-3">Đang tải...</div>;

    return (
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
                            >
                                <span className="menu_icon">
                                    <i className="fas fa-bars" />
                                </span>
                            </button>
                            <div className="collapse navbar-collapse main-menu-item" id="navbarSupportedContent">
                                <ul className="navbar-nav">
                                    <li className="nav-item"><Link className="nav-link" to="/home">Trang chủ</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/shop">Sản phẩm</Link></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Voucher</a></li>
                                    <li className="nav-item"><Link className="nav-link" to="/shop-detail">Blog</Link></li>
                                    <li className="nav-item"><a className="nav-link" href="/contact">Liên hệ</a></li>
                                </ul>
                            </div>
                            <div className="language" style={{ marginRight: '20px' }}>
                                <img src="/img/usa.png" style={{ marginRight: '5px' }} alt="USA" />
                                <img src="/img/vietnam.png" alt="Vietnam" />
                            </div>

                            <div className="hearer_icon d-flex align-items-center">
                                {user ? (
                                    <div className="user-dropdown">
                                        <span className="user-name" style={{color:'black'}}>{user?.username || user?.email?.split('@')[0]}</span>
                                        <div className="dropdown-content">
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Đăng xuất</a>
                                            <Link to="/vouchers">Kho voucher</Link>
                                            <Link to="/support">Hỗ trợ</Link>
                                            <Link to="/update-profile">Thông tin tài khoản</Link>
                                            <Link to="/admin">Admin</Link>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <img src="/img/login.png" alt="Login" style={{ marginRight: '5px' }} />
                                        <Link className="auth" to="/login">Đăng nhập/Đăng ký</Link>
                                    </>
                                )}
                                <a id="search_1" href="#"><i className="ti-search" /></a>
                                <a href="#"><i className="ti-heart" /></a>
                                <div className="cart position-relative">
                                    <a
                                        className="cart-icon"
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCartToggle();
                                        }}
                                        role="button"
                                    >
                                        <img src="/img/cart-3.svg" style={{height:'26px',marginLeft:'20px'}}/>
                                        <span
                                            className="badge badge-pill badge-danger"
                                            style={{ position: 'absolute', top: '-10px', right: '-10px' }}
                                        >
                                            {cartCount}
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;