import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';
const API_URL = '/api/products/bestsellers'; // New endpoint for bestsellers

const BestSellers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBestSellers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}?size=6`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (!data.products || data.products.length === 0) {
                    setProducts([]);
                    return;
                }
                console.log('Best Sellers Data:', JSON.stringify(data, null, 2));
                setProducts(data.products);
            } catch (err) {
                setError(`Failed to fetch best sellers: ${err.message}`);
                console.error('Error fetching best sellers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    const handleQuantityChange = (productId, delta) => {
        setProducts(products.map(product =>
            product.id === productId
                ? { ...product, quantity: Math.max(1, (product.quantity || 1) + delta) }
                : product
        ));
    };

    const handleAddToCart = (product) => {
        console.log(`Added to cart: ${product.name}, Quantity: ${product.quantity || 1}`);
    };

    const settings = {
        dots: false,
        infinite: products.length > 4,
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
                <h2 className="section-title">Best Sellers <span>shop</span></h2>
                {loading && <div className="loading">Đang tải...</div>}
                {error && <div className="error">Lỗi: {error}</div>}
                {!loading && !error && products.length === 0 && (
                    <p>Không có sản phẩm bán chạy nào để hiển thị.</p>
                )}
                <Slider {...settings} className="best_product_slider">
                    {products.map((product) => (
                        <div key={product.id} className="product-card-wrapper">
                            <div className="product-card">
                                <img
                                    src={product.mainImageUrl
                                        ? `${CLOUDINARY_BASE_URL}${product.mainImageUrl}.png`
                                        : '/img/product/default.png'}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="product-price">
                                    {product.price ? `${product.price.toLocaleString()}₫` : 'Liên hệ'}
                                </div>
                                <h3 className="product-name">{product.brand}</h3>
                                <p className="product-brand">{product.name}</p>
                                {product.stock > 0 && (
                                    <div className="quantity-cart">
                                        <div className="quantity-controls">
                                            <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                                            <span>{product.quantity || 1}</span>
                                            <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                                        </div>
                                        <button
                                            className="add-to-cart"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
};

export default BestSellers;