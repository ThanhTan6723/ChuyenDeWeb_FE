import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/authcontext';
import { useCart } from '../../contexts/cartcontext';
import { useTranslation } from 'react-i18next';
import Layout from "../layout/layout";
import Breadcrumb from "../layout/breadcrumb";

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';
const WISHLIST_API_URL = 'https://localhost:8443/api/wishlist';
const CART_API_URL = 'https://localhost:8443/api/cart';

const Wishlist = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { fetchCart } = useCart();
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log(`Fetching wishlist for user ID: ${user.id}`);
            const response = await fetch(`${WISHLIST_API_URL}/${user.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch wishlist: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Wishlist data:', data);
            setWishlistItems(data);
        } catch (err) {
            setError(t('wishlist_fetch_error'));
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        if (!user) {
            alert(t('login_to_view_wishlist'));
            return;
        }

        try {
            console.log(`Removing product ID ${productId} from wishlist for user ID ${user.id}`);
            const response = await fetch(`${WISHLIST_API_URL}/${user.id}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Failed to remove from wishlist: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            console.log('Remove response:', result);
            setWishlistItems(wishlistItems.filter(item => item.productId !== productId));
            setSuccessMessage(t('success_remove_wishlist'));
            setSuccessModalOpen(true);
            setTimeout(() => setSuccessModalOpen(false), 1500);
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            alert(t('wishlist_remove_error'));
        }
    };

    const handleAddToCart = async (productId) => {
        if (!user) {
            alert(t('login_to_view_wishlist'));
            return;
        }

        try {
            const cartItem = {
                productVariantId: productId, // Giả sử productId là productVariantId
                quantity: 1, // Mặc định thêm 1 sản phẩm
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
                throw new Error(t('error_adding_to_cart'));
            }
            await response.json();
            setSuccessMessage(t('success_add_to_cart'));
            setSuccessModalOpen(true);
            setTimeout(() => setSuccessModalOpen(false), 1500);
            fetchCart();
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert(t('error_adding_to_cart'));
        }
    };

    const closeSuccessModal = () => setSuccessModalOpen(false);

    if (!user) {
        return (
            <Layout>
                <Breadcrumb title={t('wishlist_title')} subtitle={t('wishlist_subtitle')} />
                <div className="container text-center py-5">
                    <p>{t('login_to_view_wishlist')}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>
                        {t('login')}
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Breadcrumb title={t('wishlist_title')} subtitle={t('wishlist_subtitle')} />
            <section className="product_list best_seller section_padding">
                <div className="container">
                    <h2 className="section-title">{t('wishlist_title')}<span></span></h2>
                    {loading && <div className="loading">{t('loading')}</div>}
                    {error && <div className="error">{error}</div>}
                    {!loading && !error && wishlistItems.length === 0 && (
                        <div className="text-center">{t('wishlist_empty')}</div>
                    )}
                    {!loading && !error && wishlistItems.length > 0 && (
                        <div className="product-grid">
                            {wishlistItems.map((item) => (
                                <div
                                    className="product-card"
                                    key={item.id}
                                    onClick={() => navigate(`/shop-detail/${item.productId}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={item.mainImageUrl
                                            ? `${CLOUDINARY_BASE_URL}${item.mainImageUrl}.png`
                                            : '/img/product/default.png'}
                                        alt={item.productName}
                                        className="product-image"
                                    />
                                    <div className="product-price">
                                        {item.price ? `${item.price.toLocaleString()}₫` : t('contact')}
                                    </div>
                                    <h3 className="product-name">{item.brandName}</h3>
                                    <p className="product-brand">{item.productName}</p>
                                    <div className="cart-wishlist flex items-center gap-2">
                                        <button
                                            className="add-to-cart bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(item.productId);
                                            }}
                                        >
                                            {t('add_to_cart')}
                                        </button>
                                        <button
                                            className="wishlist-btn active"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFromWishlist(item.productId);
                                            }}
                                            title={t('remove_wishlist')}
                                        >
                                            <i className="fas fa-heart text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                                    <p className="success-text">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default Wishlist;