import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from '../../../auth/authcontext';

const Header = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            navigate("/home");
        }
    };

    return (
        <header className="main_menu home_menu">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-12">
                        <nav className="navbar navbar-expand-lg navbar-light">
                            <a className="navbar-brand" href="#">
                                <img src="/img/logo.png" alt="logo"/>
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
                                  <i className="fas fa-bars"/>
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
                                        <a className="nav-link">
                                            voucher
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link">
                                            blog
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="contact.html">
                                            Liên hệ
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="language" style={{ marginRight: '20px' }}>
                                <img src="/img/usa.png" style={{marginRight:'5px'}} alt=""/>
                                <img src="/img/vietnam.png" alt=""/>
                            </div>

                            <div className="hearer_icon d-flex">
                                {user ? (
                                    <div className="user-dropdown">
                                        <span className="user-name">{user.username}</span>
                                        <div className="dropdown-content">
                                            {/*<Link to="/profile">Thông tin tài khoản</Link>*/}
                                            <a href="#" onClick={(e) => {
                                                e.preventDefault();
                                                handleLogout();
                                            }}>Đăng xuất</a>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <img src="/img/login.png" style={{ marginRight: '5px' }} alt="" />
                                        <Link className="auth" to="/login">
                                            Đăng nhập/Đăng ký
                                        </Link>
                                    </>
                                )}
                                <a id="search_1" href="javascript:void(0)">
                                    <i className="ti-search"/>
                                </a>
                                <a href="">
                                    <i className="ti-heart"/>
                                </a>
                                <div className="dropdown cart">
                                    <Link
                                        className="dropdown-toggle"
                                        to="/cart"
                                        id="navbarDropdown3"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i className="fas fa-shopping-cart"/>
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="search_input" id="search_input_box">
                <div className="container ">
                    {/*<form className="d-flex justify-content-between search-inner">*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        className="form-control"*/}
                    {/*        id="search_input"*/}
                    {/*        placeholder="Search Here"*/}
                    {/*    />*/}
                    {/*    <button type="submit" className="btn" />*/}
                    {/*    <span className="ti-close" id="close_search" title="Close Search" />*/}
                    {/*</form>*/}
                </div>
            </div>
        </header>
    );
};

export default Header;