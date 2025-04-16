import React from 'react';
import '../../../assets/css/bootstrap.min.css';
import '../../../assets/css/animate.css';
import '../../../assets/css/owl.carousel.min.css';
import '../../../assets/css/all.css';
import '../../../assets/css/flaticon.css';
import '../../../assets/css/themify-icons.css';
import '../../../assets/css/magnific-popup.css';
import '../../../assets/css/magnific-popup.css';
import '../../../assets/css/slick.css';
import '../../../assets/css/style.css';

const Home1 = () => {
    return (
        <>
            {/* Required meta tags */}
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>aranoz</title>
            <link rel="icon" href="/img/favicon.png" />
            {/*::header part start::*/}
            <header className="main_menu home_menu">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <nav className="navbar navbar-expand-lg navbar-light">
                                <a className="navbar-brand" href="#">
                                    {" "}
                                    <img src="/img/logo.png" alt="logo" />{" "}
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
                                            <a className="nav-link" href="">
                                                Home
                                            </a>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a
                                                className="nav-link dropdown-toggle"
                                                href=""
                                                id="navbarDropdown_1"
                                                role="button"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Shop
                                            </a>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="navbarDropdown_1"
                                            >
                                                <a className="dropdown-item" href="">
                                                    {" "}
                                                    shop category
                                                </a>
                                                <a className="dropdown-item" href="">
                                                    product details
                                                </a>
                                            </div>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a
                                                className="nav-link dropdown-toggle"
                                                href=""
                                                id="navbarDropdown_3"
                                                role="button"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                pages
                                            </a>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="navbarDropdown_2"
                                            >
                                                <a className="dropdown-item" href="login.html">
                                                    {" "}
                                                    login
                                                </a>
                                                <a className="dropdown-item" href="tracking.html">
                                                    tracking
                                                </a>
                                                <a className="dropdown-item" href="checkout.html">
                                                    product checkout
                                                </a>
                                                <a className="dropdown-item" href="cart.html">
                                                    shopping cart
                                                </a>
                                                <a className="dropdown-item" href="confirmation.html">
                                                    confirmation
                                                </a>
                                                <a className="dropdown-item" href="elements.html">
                                                    elements
                                                </a>
                                            </div>
                                        </li>
                                        <li className="nav-item dropdown">
                                            <a
                                                className="nav-link dropdown-toggle"
                                                href="blog.html"
                                                id="navbarDropdown_2"
                                                role="button"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                blog
                                            </a>
                                            <div
                                                className="dropdown-menu"
                                                aria-labelledby="navbarDropdown_2"
                                            >
                                                <a className="dropdown-item" href="blog.html">
                                                    {" "}
                                                    blog
                                                </a>
                                                <a className="dropdown-item" href="single-blog.html">
                                                    Single blog
                                                </a>
                                            </div>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="contact.html">
                                                Contact
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="hearer_icon d-flex">
                                    Login/Sign up
                                </div>
                                <div className="hearer_icon d-flex">
                                    <a id="search_1" href="javascript:void(0)">
                                        <i className="ti-search" />
                                    </a>
                                    <a href="">
                                        <i className="ti-heart" />
                                    </a>
                                    <div className="dropdown cart">
                                        <a
                                            className="dropdown-toggle"
                                            href="#"
                                            id="navbarDropdown3"
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="fas fa-cart-plus" />
                                        </a>
                                        {/* <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                              <div class="single_product">

                              </div>
                          </div> */}
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="search_input" id="search_input_box">
                    <div className="container ">
                        <form className="d-flex justify-content-between search-inner">
                            <input
                                type="text"
                                className="form-control"
                                id="search_input"
                                placeholder="Search Here"
                            />
                            <button type="submit" className="btn" />
                            <span className="ti-close" id="close_search" title="Close Search" />
                        </form>
                    </div>
                </div>
            </header>
            {/* Header part end*/}
            {/* banner part start*/}
            <section className="banner_part">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="banner_slider owl-carousel">
                                <div className="single_banner_slider">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-8">
                                            <div className="banner_text">
                                                <div className="banner_text_iner">
                                                    <h1>Wood &amp; Cloth Sofa</h1>
                                                    <p>
                                                        Incididunt ut labore et dolore magna aliqua quis ipsum
                                                        suspendisse ultrices gravida. Risus commodo viverra
                                                    </p>
                                                    <a href="#" className="btn_2">
                                                        buy now
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="banner_img d-none d-lg-block">
                                            <img src="/img/banner_img.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="single_banner_slider">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-8">
                                            <div className="banner_text">
                                                <div className="banner_text_iner">
                                                    <h1>Cloth &amp; Wood Sofa</h1>
                                                    <p>
                                                        Incididunt ut labore et dolore magna aliqua quis ipsum
                                                        suspendisse ultrices gravida. Risus commodo viverra
                                                    </p>
                                                    <a href="#" className="btn_2">
                                                        buy now
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="banner_img d-none d-lg-block">
                                            <img src="/img/banner_img.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="single_banner_slider">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-8">
                                            <div className="banner_text">
                                                <div className="banner_text_iner">
                                                    <h1>Wood &amp; Cloth Sofa</h1>
                                                    <p>
                                                        Incididunt ut labore et dolore magna aliqua quis ipsum
                                                        suspendisse ultrices gravida. Risus commodo viverra
                                                    </p>
                                                    <a href="#" className="btn_2">
                                                        buy now
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="banner_img d-none d-lg-block">
                                            <img src="/img/banner_img.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                {/* <div class="single_banner_slider">
                      <div class="row">
                          <div class="col-lg-5 col-md-8">
                              <div class="banner_text">
                                  <div class="banner_text_iner">
                                      <h1>Cloth $ Wood Sofa</h1>
                                      <p>Incididunt ut labore et dolore magna aliqua quis ipsum
                                          suspendisse ultrices gravida. Risus commodo viverra</p>
                                      <a href="#" class="btn_2">buy now</a>
                                  </div>
                              </div>
                          </div>
                          <div class="banner_img d-none d-lg-block">
                              <img src="img/banner_img.png" alt="">
                          </div>
                      </div>
                  </div> */}
                            </div>
                            <div className="slider-counter" />
                        </div>
                    </div>
                </div>
            </section>
            {/* banner part start*/}
            {/* feature_part start*/}
            <section className="feature_part padding_top">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="section_tittle text-center">
                                <h2>Featured Category</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-7 col-sm-6">
                            <div className="single_feature_post_text">
                                <p>Premium Quality</p>
                                <h3>Latest foam Sofa</h3>
                                <a href="#" className="feature_btn">
                                    EXPLORE NOW <i className="fas fa-play" />
                                </a>
                                <img src="/img/feature/feature_1.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-5 col-sm-6">
                            <div className="single_feature_post_text">
                                <p>Premium Quality</p>
                                <h3>Latest foam Sofa</h3>
                                <a href="#" className="feature_btn">
                                    EXPLORE NOW <i className="fas fa-play" />
                                </a>
                                <img src="/img/feature/feature_2.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-5 col-sm-6">
                            <div className="single_feature_post_text">
                                <p>Premium Quality</p>
                                <h3>Latest foam Sofa</h3>
                                <a href="#" className="feature_btn">
                                    EXPLORE NOW <i className="fas fa-play" />
                                </a>
                                <img src="/img/feature/feature_3.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-7 col-sm-6">
                            <div className="single_feature_post_text">
                                <p>Premium Quality</p>
                                <h3>Latest foam Sofa</h3>
                                <a href="#" className="feature_btn">
                                    EXPLORE NOW <i className="fas fa-play" />
                                </a>
                                <img src="/img/feature/feature_4.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* upcoming_event part start*/}
            {/* product_list start*/}
            <section className="product_list section_padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="section_tittle text-center">
                                <h2>
                                    awesome <span>shop</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product_list_slider owl-carousel">
                                <div className="single_product_list_slider">
                                    <div className="row align-items-center justify-content-between">
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_1.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_2.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_3.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_4.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_5.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_6.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_7.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_8.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="single_product_list_slider">
                                    <div className="row align-items-center justify-content-between">
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_1.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_2.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_3.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_4.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_5.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_6.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_7.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-sm-6">
                                            <div className="single_product_item">
                                                <img src="/img/product/product_8.png" alt="" />
                                                <div className="single_product_text">
                                                    <h4>Quartz Belt Watch</h4>
                                                    <h3>$150.00</h3>
                                                    <a href="#" className="add_cart">
                                                        + add to cart
                                                        <i className="ti-heart" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* product_list part start*/}
            {/* awesome_shop start*/}
            <section className="our_offer section_padding">
                <div className="container">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6 col-md-6">
                            <div className="offer_img">
                                <img src="/img/offer_img.png" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <div className="offer_text">
                                <h2>Weekly Sale on 60% Off All Products</h2>
                                <div className="date_countdown">
                                    <div id="timer">
                                        <div id="days" className="date" />
                                        <div id="hours" className="date" />
                                        <div id="minutes" className="date" />
                                        <div id="seconds" className="date" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="enter email address"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                    />
                                    <div className="input-group-append">
                                        <a
                                            href="#"
                                            className="input-group-text btn_2"
                                            id="basic-addon2"
                                        >
                                            book now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* awesome_shop part start*/}
            {/* product_list part start*/}
            <section className="product_list best_seller section_padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="section_tittle text-center">
                                <h2>
                                    Best Sellers <span>shop</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-between">
                        <div className="col-lg-12">
                            <div className="best_product_slider owl-carousel">
                                <div className="single_product_item">
                                    <img src="/img/product/product_1.png" alt="" />
                                    <div className="single_product_text">
                                        <h4>Quartz Belt Watch</h4>
                                        <h3>$150.00</h3>
                                    </div>
                                </div>
                                <div className="single_product_item">
                                    <img src="/img/product/product_2.png" alt="" />
                                    <div className="single_product_text">
                                        <h4>Quartz Belt Watch</h4>
                                        <h3>$150.00</h3>
                                    </div>
                                </div>
                                <div className="single_product_item">
                                    <img src="/img/product/product_3.png" alt="" />
                                    <div className="single_product_text">
                                        <h4>Quartz Belt Watch</h4>
                                        <h3>$150.00</h3>
                                    </div>
                                </div>
                                <div className="single_product_item">
                                    <img src="/img/product/product_4.png" alt="" />
                                    <div className="single_product_text">
                                        <h4>Quartz Belt Watch</h4>
                                        <h3>$150.00</h3>
                                    </div>
                                </div>
                                <div className="single_product_item">
                                    <img src="/img/product/product_5.png" alt="" />
                                    <div className="single_product_text">
                                        <h4>Quartz Belt Watch</h4>
                                        <h3>$150.00</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* product_list part end*/}
            {/* subscribe_area part start*/}
            <section className="subscribe_area section_padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-7">
                            <div className="subscribe_area_text text-center">
                                <h5>Join Our Newsletter</h5>
                                <h2>Subscribe to get Updated with new offers</h2>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="enter email address"
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"
                                    />
                                    <div className="input-group-append">
                                        <a
                                            href="#"
                                            className="input-group-text btn_2"
                                            id="basic-addon2"
                                        >
                                            subscribe now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*::subscribe_area part end::*/}
            {/* subscribe_area part start*/}
            <section className="client_logo padding_top">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_1.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_2.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_3.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_4.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_5.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_3.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_1.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_2.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_3.png" alt="" />
                            </div>
                            <div className="single_client_logo">
                                <img src="/img/client_logo/client_logo_4.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*::subscribe_area part end::*/}
            {/*::footer_part start::*/}
            <footer className="footer_part">
                <div className="container">
                    <div className="row justify-content-around">
                        <div className="col-sm-6 col-lg-2">
                            <div className="single_footer_part">
                                <h4>Top Products</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="">Managed Website</a>
                                    </li>
                                    <li>
                                        <a href="">Manage Reputation</a>
                                    </li>
                                    <li>
                                        <a href="">Power Tools</a>
                                    </li>
                                    <li>
                                        <a href="">Marketing Service</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-2">
                            <div className="single_footer_part">
                                <h4>Quick Links</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="">Jobs</a>
                                    </li>
                                    <li>
                                        <a href="">Brand Assets</a>
                                    </li>
                                    <li>
                                        <a href="">Investor Relations</a>
                                    </li>
                                    <li>
                                        <a href="">Terms of Service</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-2">
                            <div className="single_footer_part">
                                <h4>Features</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="">Jobs</a>
                                    </li>
                                    <li>
                                        <a href="">Brand Assets</a>
                                    </li>
                                    <li>
                                        <a href="">Investor Relations</a>
                                    </li>
                                    <li>
                                        <a href="">Terms of Service</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-2">
                            <div className="single_footer_part">
                                <h4>Resources</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <a href="">Guides</a>
                                    </li>
                                    <li>
                                        <a href="">Research</a>
                                    </li>
                                    <li>
                                        <a href="">Experts</a>
                                    </li>
                                    <li>
                                        <a href="">Agencies</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-4">
                            <div className="single_footer_part">
                                <h4>Newsletter</h4>
                                <p>Heaven fruitful doesn't over lesser in days. Appear creeping</p>
                                <div id="mc_embed_signup">
                                    <form
                                        target="_blank"
                                        action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&id=92a4423d01"
                                        method="get"
                                        className="subscribe_form relative mail_part"
                                    >
                                        <input
                                            type="email"
                                            name="email"
                                            id="newsletter-form-email"
                                            placeholder="Email Address"
                                            className="placeholder hide-on-focus"
                                            onfocus="this.placeholder = ''"
                                            onblur="this.placeholder = ' Email Address '"
                                        />
                                        <button
                                            type="submit"
                                            name="submit"
                                            id="newsletter-submit"
                                            className="email_icon newsletter-submit button-contactForm"
                                        >
                                            subscribe
                                        </button>
                                        <div className="mt-10 info" />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright_part">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="copyright_text">
                                    <p>
                                        {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                        Copyright © All rights reserved | This template is made with{" "}
                                        <i className="ti-heart" aria-hidden="true" /> by{" "}
                                        <a href="https://colorlib.com" target="_blank">
                                            Colorlib
                                        </a>
                                        {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="footer_icon social_icon">
                                    <ul className="list-unstyled">
                                        <li>
                                            <a href="#" className="single_social_icon">
                                                <i className="fab fa-facebook-f" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="single_social_icon">
                                                <i className="fab fa-twitter" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="single_social_icon">
                                                <i className="fas fa-globe" />
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="single_social_icon">
                                                <i className="fab fa-behance" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/*::footer_part end::*/}
            {/* jquery plugins here*/}
            {/* popper js */}
            {/* bootstrap js */}
            {/* easing js */}
            {/* swiper js */}
            {/* swiper js */}
            {/* particles js */}
            {/* slick js */}
            {/* custom js */}
        </>


    );
};

export default Home1;