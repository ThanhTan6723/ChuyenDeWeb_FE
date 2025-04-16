import React from "react";

const Banner = () => {
    return (
        <section className="banner-section">
            <div className="banner-container">
                {/* BANNER TRÁI */}
                <div className="banner-left">
                    <div className="slide-content">
                        <div className="slide-text">
                            <p className="subtitle">100% Natural</p>
                            <h1 className="title">Fresh Smoothie & Summer Juice</h1>
                            <p className="description">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Dignissim massa diam elementum.
                            </p>
                            <button className="shop-button">SHOP COLLECTION</button>
                        </div>
                        <div className="slide-img">
                            <img src="/img/cerave.png" alt="Smoothie" />
                        </div>
                    </div>
                </div>

                {/* BANNER PHẢI */}
                <div className="banner-right">
                    <div className="offer-card green-card">
                        <div className="text">
                            <p className="percent">20% Off</p>
                            <span className="label">SALE</span>
                            <h3 className="name">Fruits & Vegetables</h3>
                            <a href="#">Shop Collection →</a>
                        </div>
                        <img src="/assets/fruits.png" alt="Fruits" />
                    </div>

                    <div className="offer-card pink-card">
                        <div className="text">
                            <p className="percent">15% Off</p>
                            <span className="label">SALE</span>
                            <h3 className="name">Baked Products</h3>
                            <a href="#">Shop Collection →</a>
                        </div>
                        <img src="/assets/bread.png" alt="Bread" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
