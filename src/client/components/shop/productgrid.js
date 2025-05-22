import React, { useState, useEffect } from 'react';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';
const API_URL = 'https://localhost:8443/api/products/grid';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}?page=${currentPage - 1}&size=${itemsPerPage}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                if (data.products.length === 0) {
                    setProducts([]);
                    setTotalPages(1);
                    return;
                }
                console.log('Data: '+JSON.stringify(data));
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

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

    return (
        <div className="product-grid-container">
            {loading && <div className="loading">Đang tải...</div>}
            {error && <div className="error">Lỗi: {error}</div>}
            {!loading && !error && products.length === 0 && (
                <p>Không có sản phẩm nào để hiển thị.</p>
            )}
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
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
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = i + 1 + Math.max(0, currentPage - 3);
                        if (pageNum <= totalPages) {
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={currentPage === pageNum ? 'active' : ''}
                                >
                                    {pageNum}
                                </button>
                            );
                        }
                        return null;
                    })}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Tiếp
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;