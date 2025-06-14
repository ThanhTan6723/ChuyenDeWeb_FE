import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/cartcontext';
import { useAuth } from '../../../auth/authcontext';

const CLOUDINARY_BASE_URL = 'https://localhost:8443/api/products/';
const CART_API_URL = 'https://localhost:8443/api/cart';
const WISHLIST_API_URL = 'https://localhost:8443/api/wishlist';

const ProductInfo = ({ productId = '1', onVariantChange }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { fetchCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${CLOUDINARY_BASE_URL}${productId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (!data || !data.variants || data.variants.length === 0) {
                    throw new Error(t('error_loading_product'));
                }
                const defaultVariant = data.variants.find(variant =>
                    variant.images.some(img => img.main)
                ) || data.variants[0];
                setProduct(data);
                setSelectedVariant(defaultVariant);
                setQuantity(1);
                if (onVariantChange) onVariantChange(defaultVariant);
            } catch (err) {
                setError(`${t('error_loading_product')}: ${err.message}`);
                console.error(t('error_loading_product'), err);
            } finally {
                setLoading(false);
            }
        };

        const checkWishlist = async () => {
            if (user) {
                try {
                    const response = await fetch(`${WISHLIST_API_URL}/${user.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                        },
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const wishlist = await response.json();
                        setIsInWishlist(wishlist.some(item => item.productId === parseInt(productId)));
                    }
                } catch (err) {
                    console.error(t('wishlist_fetch_error'), err);
                }
            }
        };

        fetchProductDetails();
        checkWishlist();
    }, [productId, user, onVariantChange, t]);

    useEffect(() => {
        if (successModalOpen) {
            document.body.classList.add('modal-active');
            const timer = setTimeout(() => setSuccessModalOpen(false), 1500);
            return () => clearTimeout(timer);
        } else {
            document.body.classList.remove('modal-active');
        }
        return () => {
            document.body.classList.remove('modal-active');
        };
    }, [successModalOpen]);

    const handleVariantChange = (variant) => {
        setSelectedVariant(variant);
        setQuantity(1);
        if (onVariantChange) onVariantChange(variant);
    };

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = async () => {
        if (!user) {
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
            if (!response.ok) {
                throw new Error(t('error_loading_product'));
            }
            await response.json();
            setSuccessModalOpen(true);
            fetchCart();
        } catch (err) {
            console.error(t('error_loading_product'), err);
            alert(err.message);
        }
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        setWishlistLoading(true);
        try {
            console.log(`Toggling wishlist for product ID ${productId} and user ID ${user.id}`);
            if (isInWishlist) {
                const response = await fetch(`${WISHLIST_API_URL}/${user.id}/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to remove from wishlist');
                }
                console.log('Remove response:', await response.json());
                setIsInWishlist(false);
            } else {
                const response = await fetch(`${WISHLIST_API_URL}/${user.id}/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to add to wishlist');
                }
                console.log('Add response:', await response.json());
                setIsInWishlist(true);
            }
        } catch (err) {
            console.error('Wishlist error:', err);
            alert(`${t('wishlist_error')}: ${err.message}`);
        } finally {
            setWishlistLoading(false);
        }
    };

    const closeModal = () => setShowLoginModal(false);
    const closeSuccessModal = () => setSuccessModalOpen(false);

    if (loading) return <div className="loading text-center py-6 text-gray-500">{t('loading')}...</div>;
    if (error) return <div className="error text-center py-6 text-red-600 font-medium">{t('error_loading_product')}: {error}</div>;
    if (!product || !selectedVariant) return null;

    return (
        <div className="product-info bg-white p-6 rounded-lg shadow-sm max-w-lg mx-auto">
            <h3 className="product-title text-2xl font-semibold text-gray-800 mb-2"><i>{product.brand}</i> - {product.name}</h3>
            <p className="product-category text-sm text-gray-500 mb-4">{t('product_category')}: {product.category}</p>
            <h2 className="product-price text-xl font-bold text-teal-600 mb-4">
                {selectedVariant.price ? `${selectedVariant.price.toLocaleString()}₫` : t('contact_price')}
            </h2>
            <p className="product-description text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
            <div className="variant-selector mb-6">
                <h4 className="variant-title text-base font-medium text-gray-700 mb-3">{t('variant_title')}</h4>
                {product.variants.length > 0 ? (
                    <div className="variant-options flex flex-wrap gap-2">
                        {product.variants.map((variant) => (
                            <label
                                key={variant.id}
                                className={`variant-item border border-gray-200 rounded-md px-3 py-1.5 cursor-pointer text-sm transition-colors ${
                                    selectedVariant.id === variant.id ? 'bg-teal-50 border-teal-500' : 'hover:bg-gray-100'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="variant"
                                    checked={selectedVariant.id === variant.id}
                                    onChange={() => handleVariantChange(variant)}
                                    className="hidden"
                                />
                                <span>{variant.attribute} - {variant.variant}</span>
                            </label>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">{t('no_variants')}</p>
                )}
            </div>
            {selectedVariant.quantity > 0 && (
                <div className="quantity-cart flex flex-col gap-4 mb-6">
                    <div className="quantity-controls flex items-center border border-gray-200 rounded-md w-fit">
                        <button
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(-1)}
                        >
                            -
                        </button>
                        <span className="px-4 py-1 text-gray-800">{quantity}</span>
                        <button
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => handleQuantityChange(1)}
                        >
                            +
                        </button>
                    </div>
                    <div className="cart-wishlist flex items-center gap-2">
                        <button
                            className="add-to-cart bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                            onClick={handleAddToCart}
                        >
                            {t('add_to_cart')}
                        </button>
                        <button
                            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                            onClick={handleWishlistToggle}
                            disabled={wishlistLoading}
                            title={isInWishlist ? t('remove_wishlist') : t('add_wishlist')}
                        >
                            <i className={`${isInWishlist ? 'fas fa-heart' : 'far fa-heart'} text-xl`}></i>
                        </button>
                    </div>
                </div>
            )}
            {showLoginModal && (
                <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">{t('login_required')}</h3>
                        <p className="text-gray-600 mb-6">{t('login_prompt')}</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                onClick={closeModal}
                            >
                                {t('close')}
                            </button>
                            <Link
                                to="/login"
                                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                                onClick={closeModal}
                            >
                                {t('login')}
                            </Link>
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

export default ProductInfo;