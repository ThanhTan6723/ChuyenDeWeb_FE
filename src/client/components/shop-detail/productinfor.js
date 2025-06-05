import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useCart } from '../../contexts/cartcontext';
import { useAuth } from '../../../auth/authcontext';

const CLOUDINARY_BASE_URL = 'https://localhost:8443/api/products/';
const CART_API_URL = 'https://localhost:8443/api/cart';

const ProductInfo = ({ productId = '1', onVariantChange }) => {
    const { user } = useAuth();
    const { fetchCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

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
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (!data || !data.variants || data.variants.length === 0) {
                    throw new Error('Sản phẩm không có biến thể hoặc dữ liệu không hợp lệ');
                }
                const defaultVariant = data.variants.find(variant =>
                    variant.images.some(img => img.main)
                ) || data.variants[0];
                setProduct(data);
                setSelectedVariant(defaultVariant);
                setQuantity(1);
                if (onVariantChange) onVariantChange(defaultVariant);
            } catch (err) {
                setError(`Không thể tải chi tiết sản phẩm: ${err.message}`);
                console.error('Lỗi khi tải chi tiết sản phẩm:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId, onVariantChange]);

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
                throw new Error('Thêm sản phẩm vào giỏ hàng thất bại!');
            }
            await response.json();
            setSuccessModalOpen(true);
            fetchCart();
        } catch (err) {
            console.error('Lỗi khi thêm vào giỏ hàng:', err);
            alert(err.message);
        }
    };

    const closeModal = () => setShowLoginModal(false);
    const closeSuccessModal = () => setSuccessModalOpen(false);

    if (loading) return <div className="loading text-center py-6 text-gray-500">Đang tải...</div>;
    if (error) return <div className="error text-center py-6 text-red-600 font-medium">Lỗi: {error}</div>;
    if (!product || !selectedVariant) return null;

    return (
        <div className="product-info bg-white p-6 rounded-lg shadow-sm max-w-lg mx-auto">
            <h3 className="product-title text-2xl font-semibold text-gray-800 mb-2"><i>{product.brand}</i> - {product.name}</h3>
            <p className="product-category text-sm text-gray-500 mb-4">Danh mục: {product.category}</p>
            <h2 className="product-price text-xl font-bold text-teal-600 mb-4">
                {selectedVariant.price ? `${selectedVariant.price.toLocaleString()}₫` : 'Liên hệ'}
            </h2>
            <p className="product-description text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
            <div className="variant-selector mb-6">
                <h4 className="variant-title text-base font-medium text-gray-700 mb-3">Công dụng</h4>
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
                    <p className="text-gray-500 text-sm">Không có biến thể.</p>
                )}
            </div>
            {selectedVariant.quantity > 0 && (
                <div className="quantity-cart">
                    <div className="quantity-controls">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                        >
                            -
                        </button>
                        <span>{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className="add-to-cart"
                        onClick={handleAddToCart}
                    >
                        Thêm vào giỏ
                    </button>
                </div>
            )}

            {showLoginModal && (
                <div className="modal fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Yêu cầu đăng nhập</h3>
                        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!</p>
                        <div className="flex justify-end gap-4">
                            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" onClick={closeModal}>Đóng</button>
                            <Link to="/login" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700" onClick={closeModal}>Đăng nhập</Link>
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

export default ProductInfo;