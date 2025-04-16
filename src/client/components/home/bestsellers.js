import React from "react";
import Slider from "react-slick";
import SectionTitle from "../common/sectiontitle";
import ProductCard from "../common/productcard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BestSellers = () => {
    const bestSellerProducts = [
        { id: 1, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_1.png" },
        { id: 2, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_2.png" },
        { id: 3, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_3.png" },
        { id: 4, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_4.png" },
        { id: 5, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_5.png" },
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <section className="product_list best_seller section_padding">
            <div className="container">
                <SectionTitle title="Best Sellers" spanText="shop" />
                <Slider {...settings} className="best_product_slider">
                    {bestSellerProducts.map((product) => (
                        <div key={product.id}>
                            <ProductCard
                                title={product.title}
                                price={product.price}
                                image={product.image}
                                showAddToCart={false}
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default BestSellers;
