import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../../auth/authcontext';
import { useCart } from '../../contexts/cartcontext';
import { useTranslation } from 'react-i18next';  // import hook i18n

const Header = () => {
    const { t, i18n } = useTranslation();  // lấy hàm t và i18n
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
            console.error(t('logout_error'), err);
        }
    };

    const handleCartToggle = () => {
        if (!user) {
            alert(t('login_to_view_cart'));
            navigate('/login', { state: { from: '/cart' } });
            return;
        }
        navigate('/cart');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    if (loading) return <div className="text-center py-3">{t('loading')}...</div>;

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
                                    <li className="nav-item"><Link className="nav-link" to="/home">{t('home')}</Link></li>
                                    <li className="nav-item"><Link className="nav-link" to="/shop">{t('shop')}</Link></li>
                                    <li className="nav-item"><a className="nav-link" href="#">{t('voucher')}</a></li>
                                    <li className="nav-item"><Link className="nav-link" to="/shop-detail">{t('blog')}</Link></li>
                                    <li className="nav-item"><a className="nav-link" href="/contact">{t('contact')}</a></li>
                                </ul>
                            </div>

                            {/* Language switcher */}
                            <div className="language" style={{ marginRight: '20px', cursor: 'pointer' }}>
                                <img
                                    src="/img/usa.png"
                                    alt="English"
                                    style={{ marginRight: '5px', border: i18n.language === 'en' ? '2px solid #000' : 'none' }}
                                    onClick={() => changeLanguage('en')}
                                />
                                <img
                                    src="/img/vietnam.png"
                                    alt="Vietnamese"
                                    style={{ border: i18n.language === 'vi' ? '2px solid #000' : 'none' }}
                                    onClick={() => changeLanguage('vi')}
                                />
                            </div>

                            <div className="hearer_icon d-flex align-items-center">
                                {user ? (
                                    <div className="user-dropdown">
                                        <span className="user-name" style={{color:'black'}}>
                                            {user?.username || user?.email?.split('@')[0]}
                                        </span>
                                        <div className="dropdown-content">
                                            <a href="#" className="auth" onClick={(e) => { e.preventDefault(); handleLogout(); }}>{t('logout')}</a>
                                            <Link to="/vouchers">{t('voucher_store')}</Link>
                                            <Link to="/order-history">{t('order_history')}</Link>
                                            <Link to="/admin">Admin</Link>
                                            <Link to="/update-profile">{t('account_info')}</Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="log">
                                        <img src="/img/login.png" alt="Login" style={{ marginRight: '5px', color:'black' }} />
                                        <Link to="/login">{t('login_signup')}</Link>
                                    </div>
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
