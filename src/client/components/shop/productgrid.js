import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';
const API_URL = 'https://localhost:8443/api/products/grid';
const DETAIL_API_URL = 'https://localhost:8443/api/products/';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}?page=${currentPage - 1}&size=${itemsPerPage}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (!data.products || data.products.length === 0) {
                    setProducts([]);
                    setTotalPages(1);
                    return;
                }
                console.log('Data:', JSON.stringify(data, null, 2));
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(`Failed to fetch products: ${err.message}`);
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage]);

    // Effect to toggle modal-active class on body
    useEffect(() => {
        if (modalOpen) {
            document.body.classList.add('modal-active');
        } else {
            document.body.classList.remove('modal-active');
        }
        // Cleanup on component unmount
        return () => {
            document.body.classList.remove('modal-active');
        };
    }, [modalOpen]);

    const fetchProductDetails = async (productId) => {
        setLoading(true);
        try {
            const response = await fetch(`${DETAIL_API_URL}${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
            });
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                let errorMessage = `HTTP error! Status: ${response.status}`;
                if (contentType && contentType.includes('text/html')) {
                    const text = await response.text();
                    errorMessage += ` - Server returned HTML: ${text.substring(0, 50)}...`;
                } else {
                    errorMessage += ` - ${await response.text()}`;
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log('Product Details:', JSON.stringify(data, null, 2));
            if (!data || !data.variants || data.variants.length === 0) {
                throw new Error('Product has no variants or invalid data');
            }
            // Chọn biến thể có ảnh chính (main: true) làm mặc định
            const defaultVariant = data.variants.find(variant =>
                variant.images.some(img => img.main)
            ) || data.variants[0] || null;
            setSelectedProduct(data);
            setSelectedVariant(defaultVariant);
            setQuantity(1);
            setModalOpen(true);
        } catch (err) {
            setError(`Failed to fetch product details: ${err.message}`);
            console.error('Error fetching product details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = (product) => {
        console.log('Fetching product with ID:', product.id);
        fetchProductDetails(product.id);
    };

    const handleVariantChange = (variant) => {
        console.log('Selected variant:', JSON.stringify(variant, null, 2));
        setSelectedVariant(variant);
        setQuantity(1);
    };

    const handleAddToCartFromModal = () => {
        console.log(`Added to cart: ${selectedProduct.name}, Variant: ${selectedVariant.attribute} - ${selectedVariant.variant}, Quantity: ${quantity}`);
        setModalOpen(false);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
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
                    <div
                        className="product-card"
                        key={product.id}
                        onClick={() => navigate(`/shop-detail/${product.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
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
                                <button
                                    className="add-to-cart"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                    }}
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
            {modalOpen && selectedProduct && selectedVariant && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <div className="modal-body">
                            <div className="modal-image">
                                <img
                                    src={
                                        selectedVariant.images?.length > 0
                                            ? `${CLOUDINARY_BASE_URL}${selectedVariant.images[0].publicId}.png`
                                            : '/img/product/default.png'
                                    }
                                    alt={selectedProduct.name}
                                    className="product-image"
                                />
                            </div>
                            <div className="modal-details">
                                <h2 className="modal-title"><i>{selectedProduct.brand}</i> - {selectedProduct.name}</h2>
                                <p className="modal-category">Danh mục: {selectedProduct.category}</p>
                                <p className="modal-description">{selectedProduct.description}</p>
                                <p className="modal-price" style={{color:'red',fontWeight:'bold'}}>
                                   {selectedVariant.price ? `${selectedVariant.price.toLocaleString()}₫` : 'Liên hệ'}
                                </p>
                                <div className="modal-variants">
                                    <h3>Tùy chọn</h3>
                                    {selectedProduct.variants?.length > 0 ? (
                                        <div className="variant-list">
                                            {selectedProduct.variants.map((variant) => (
                                                <label key={variant.id} className="variant-item">
                                                    <input
                                                        type="radio"
                                                        name="variant"
                                                        checked={selectedVariant?.id === variant.id}
                                                        onChange={() => handleVariantChange(variant)}
                                                    />
                                                    <span>
                                                        {variant.attribute} - {variant.variant}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Không có biến thể.</p>
                                    )}
                                </div>
                                {selectedVariant?.quantity > 0 && (
                                    <div className="quantity-cart">
                                        <div className="quantity-controls">
                                            <button onClick={() => handleQuantityChange(-1)}>-</button>
                                            <span>{quantity}</span>
                                            <button onClick={() => handleQuantityChange(1)}>+</button>
                                        </div>
                                        <button
                                            className="add-to-cart"
                                            onClick={handleAddToCartFromModal}
                                        >
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;