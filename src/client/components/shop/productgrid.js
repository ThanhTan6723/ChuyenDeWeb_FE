import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useCart } from '../../contexts/cartcontext';
import { useAuth } from '../../../auth/authcontext';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';
const API_URL = 'https://localhost:8443/api/products';
const DETAIL_API_URL = 'https://localhost:8443/api/products/';
const CART_API_URL = 'https://localhost:8443/api/cart';

const ProductGrid = ({ searchTerm, sortBy, sortOrder }) => {
    const { user } = useAuth();
    const { fetchCart } = useCart();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                let url;
                if (sortBy !== 'name' || sortOrder !== 'asc') {
                    // Use sorted endpoint when sorting is applied
                    url = `${API_URL}/sorted?keyword=${encodeURIComponent(searchTerm || '')}&page=${currentPage - 1}&size=${itemsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
                } else if (searchTerm.trim()) {
                    // Use search endpoint when searching without custom sorting
                    url = `${API_URL}/search?keyword=${encodeURIComponent(searchTerm)}&page=${currentPage - 1}&size=${itemsPerPage}`;
                } else {
                    // Use grid endpoint when no search or sorting
                    url = `${API_URL}/grid?page=${currentPage - 1}&size=${itemsPerPage}`;
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                if (!data.products || data.products.length === 0) {
                    setProducts([]);
                    setTotalPages(1);
                    return;
                }

                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(`Lỗi khi tải sản phẩm: ${err.message}`);
                console.error('Lỗi khi tải sản phẩm:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, searchTerm, sortBy, sortOrder]);

    useEffect(() => {
        if (modalOpen || successModalOpen) {
            document.body.classList.add('modal-active');
        } else {
            document.body.classList.remove('modal-active');
        }

        return () => {
            document.body.classList.remove('modal-active');
        };
    }, [modalOpen, successModalOpen]);

    useEffect(() => {
        if (selectedVariant?.images?.length > 0) {
            setSelectedImage(selectedVariant.images.find(img => img.main)?.publicId || selectedVariant.images[0].publicId);
        }
    }, [selectedVariant]);

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

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (!data || !data.variants || data.variants.length === 0) {
                throw new Error('Sản phẩm không có biến thể hoặc dữ liệu không hợp lệ');
            }

            const defaultVariant = data.variants.find(variant =>
                variant.images.some(img => img.main)
            ) || data.variants[0];

            setSelectedProduct(data);
            setSelectedVariant(defaultVariant);
            setQuantity(1);
            setModalOpen(true);
        } catch (err) {
            setError(`Lỗi khi tải chi tiết sản phẩm: ${err.message}`);
            console.error('Lỗi khi tải chi tiết sản phẩm:', err);
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
        console.log('Đang tải sản phẩm với ID:', product.id);
        fetchProductDetails(product.id);
    };

    const handleVariantChange = (variant) => {
        console.log('Đã chọn biến thể:', variant);
        setSelectedVariant(variant);
        setQuantity(1);
    };

    const handleAddToCartFromModal = async () => {
        if (!user) {
            setModalOpen(false);
            setShowLoginModal(true);
            return;
        }

        try {
            const cartItem = {
                productVariantId: selectedVariant.id,
                quantity: quantity,
            };

            const response = await fetch(CART_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
                body: JSON.stringify(cartItem),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Thêm sản phẩm vào giỏ hàng thất bại!');

            await response.json();
            setModalOpen(false);
            setSuccessModalOpen(true);
            fetchCart();
            setTimeout(() => setSuccessModalOpen(false), 1500);
        } catch (err) {
            console.error('Lỗi khi thêm vào giỏ hàng:', err);
            alert(err.message);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
        setSelectedVariant(null);
        setSelectedImage(null);
        setQuantity(1);
    };

    const closeSuccessModal = () => {
        setSuccessModalOpen(false);
    };

    const allImages = selectedProduct?.variants?.flatMap(variant =>
        variant.images?.map(image => ({
            publicId: image.publicId,
            main: image.main,
            variantId: variant.id
        })) || []
    ) || [];

    const handleImageClick = (image) => {
        setSelectedImage(image.publicId);
        const variant = selectedProduct.variants.find(v => v.id === image.variantId);
        if (variant) {
            setSelectedVariant(variant);
            setQuantity(1);
        }
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
                                        selectedImage
                                            ? `${CLOUDINARY_BASE_URL}${selectedImage}.png`
                                            : selectedVariant.images?.length > 0
                                                ? `${CLOUDINARY_BASE_URL}${selectedVariant.images[0].publicId}.png`
                                                : '/img/product/default.png'
                                    }
                                    alt={selectedProduct.name}
                                    className="product-image"
                                />
                                <div className="thumbnail-container">
                                    {allImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`${CLOUDINARY_BASE_URL}${image.publicId}.png`}
                                            alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                                            className={`thumbnail ${selectedImage === image.publicId ? 'active' : ''}`}
                                            onClick={() => handleImageClick(image)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="modal-details">
                                <h2 className="modal-title">
                                    <i>{selectedProduct.brand}</i> - {selectedProduct.name}
                                </h2>
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

            {successModalOpen && (
                <div className={`success-overlay ${successModalOpen ? 'active' : ''}`} onClick={closeSuccessModal}>
                    <div className="success-container" onClick={(e) => e.stopPropagation()}>
                        <div className="success-body">
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                            <p className="success-text">Sản phẩm đã được thêm vào giỏ hàng!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;