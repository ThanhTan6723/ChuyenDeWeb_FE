import React from 'react';
import {Link} from "react-router-dom";

const Header = () => {
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
                                        <a
                                            className="nav-link">
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
                            {/*<div className="hearer_icon d-flex">*/}
                            {/*    <li className="nav-item">*/}
                            {/*       */}
                            {/*    </li>*/}
                            {/*</div>*/}

                            <div className="hearer_icon d-flex">
                                <Link className="auth" to="/login">
                                    Đăng nhập/Đăng ký
                                </Link>
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
                                        <i className="fas fa-cart-plus"/>
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