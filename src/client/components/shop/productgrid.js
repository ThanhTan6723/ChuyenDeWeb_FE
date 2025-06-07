import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/cartcontext';
import { useAuth } from '../../../auth/authcontext';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';
const API_URL = 'https://localhost:8443/api/products';
const DETAIL_API_URL = 'https://localhost:8443/api/products/';
const CART_API_URL = 'https://localhost:8443/api/cart';

const ProductGrid = ({ searchTerm, sortBy, sortOrder, category, brand }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { fetchCart } = useCart();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
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
                if (category || brand) {
                    url = `${API_URL}/filter?keyword=${encodeURIComponent(searchTerm || '')}&category=${encodeURIComponent(category || '')}&brand=${encodeURIComponent(brand || '')}&page=${currentPage - 1}&size=${itemsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
                } else if (sortBy !== 'name' || sortOrder !== 'asc') {
                    url = `${API_URL}/sorted?keyword=${encodeURIComponent(searchTerm || '')}&page=${currentPage - 1}&size=${itemsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
                } else if (searchTerm.trim()) {
                    url = `${API_URL}/search?keyword=${encodeURIComponent(searchTerm)}&page=${currentPage - 1}&size=${itemsPerPage}`;
                } else {
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
                    setTotalPages(0);
                    return;
                }

                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (err) {
                setError(`${t('error_loading_product')}: ${err.message}`);
                console.error(t('error_loading_product'), err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, searchTerm, sortBy, sortOrder, category, brand, t]);

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
            setSelectedImage(selectedVariant.images.find(img => img.mainImage)?.publicId || selectedVariant.images[0].publicId);
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
                throw new Error(t('error_loading_product'));
            }

            const defaultVariant = data.variants.find(variant =>
                variant.images.some(img => img.mainImage)
            ) || data.variants[0];

            setSelectedProduct(data);
            setSelectedVariant(defaultVariant);
            setQuantity(1);
            setModalOpen(true);
        } catch (err) {
            setError(`${t('error_loading_product')}: ${err.message}`);
            console.error(t('error_loading_product'), err);
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
        fetchProductDetails(product.id);
    };

    const handleVariantChange = (variant) => {
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

            if (!response.ok) throw new Error(t('error_loading_product'));

            await response.json();
            setModalOpen(false);
            setSuccessModalOpen(true);
            fetchCart();
            setTimeout(() => setSuccessModalOpen(false), 1500);
        } catch (err) {
            console.error(t('error_loading_product'), err);
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

    const closeLoginModal = () => {
        setShowLoginModal(false);
    };

    const allImages = selectedProduct?.variants?.flatMap(variant =>
        variant.images?.map(image => ({
            publicId: image.publicId,
            mainImage: image.mainImage,
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
            {loading && <div className="loading">{t('loading')}...</div>}
            {error && <div className="error">{t('error_loading_product')}: {error}</div>}
            {!loading && !error && products.length === 0 && (
                <p>{t('no_products')}</p>
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
                            {product.price ? `${product.price.toLocaleString()}₫` : t('contact_price')}
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
                                    {t('add_to_cart')}
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
                        {t('previous')}
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
                        {t('next')}
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
                                <p className="modal-category">{t('product_category')}: {selectedProduct.category}</p>
                                <p className="modal-description">{t('product_description')}: {selectedProduct.description}</p>
                                <p className="modal-price modal-price-highlight">
                                    {selectedVariant.price ? `${selectedVariant.price.toLocaleString()}₫` : t('contact_price')}
                                </p>
                                <div className="modal-variants">
                                    <h3>{t('variants')}</h3>
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
                                                    <span>{variant.attribute} - {variant.variant}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>{t('no_variants')}</p>
                                    )}
                                </div>
                                {selectedVariant?.quantity > 0 && (
                                    <div className="quantity-cart">
                                        <div className="quantity-controls">
                                            <button onClick={() => handleQuantityChange(-1)}>-</button>
                                            <span>{t('quantity')}: {quantity}</span>
                                            <button onClick={() => handleQuantityChange(1)}>+</button>
                                        </div>
                                        <button
                                            className="add-to-cart"
                                            onClick={handleAddToCartFromModal}
                                        >
                                            {t('add_to_cart')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showLoginModal && (
                <div className="modal-overlay" onClick={closeLoginModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeLoginModal}>×</button>
                        <div className="modal-body">
                            <h2>{t('login_required')}</h2>
                            <p>{t('login_prompt')}</p>
                            <button
                                className="login-button"
                                onClick={() => navigate('/login')}
                            >
                                {t('login')}
                            </button>
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
                            <p className="success-text">{t('success_add_to_cart')}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;