import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../auth/authcontext';
import { useCart } from '../../contexts/cartcontext';

const CART_API_URL = `${process.env.REACT_APP_API_BASE_URL || 'https://localhost:8443'}/api/cart`;

const CartItem = ({ item, onQuantityChange, onRemove, loading }) => {
    const [quantity, setQuantity] = useState(item?.quantity || 1);

    useEffect(() => {
        if (item?.quantity) {
            setQuantity(item.quantity);
        }
    }, [item?.quantity]);

    const handleQuantity = (qty) => {
        if (qty >= 1 && qty <= 10) {
            setQuantity(qty);
            onQuantityChange(item.productVariantId, qty);
        }
    };

    if (!item) return null;

    return (
        <tr className="cart-item-row">
            <td className="cart-item-cell">
                <div className="cart-item-details">
                    <img
                        src={item.mainImageUrl || item.additionalImageUrls?.[0] || '/img/product/placeholder.jpg'}
                        alt={item.productName || 'Sản phẩm không tên'}
                        className="cart-item-image"
                    />
                    <div className="cart-item-info">
                        <h2 className="cart-item-name">{item.productName || 'Sản phẩm không tên'}</h2>
                        <p className="cart-item-variant">
                            {item.attribute || ''} - {item.variant || ''}
                        </p>
                    </div>
                </div>
            </td>
            <td className="cart-item-price">{(item.price || 0).toLocaleString('vi-VN')}₫</td>
            <td className="cart-item-quantity">
                <div className="cart-quantity-control">
                    <button
                        disabled={loading || quantity <= 1}
                        onClick={() => handleQuantity(quantity - 1)}
                        className="cart-quantity-btn cart-quantity-decrease"
                    >
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantity(parseInt(e.target.value) || 1)}
                        className="cart-quantity-input"
                        min="1"
                        max="10"
                        readOnly
                    />
                    <button
                        disabled={loading || quantity >= 10}
                        onClick={() => handleQuantity(quantity + 1)}
                        className="cart-quantity-btn cart-quantity-increase"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            </td>
            <td className="cart-item-total">
                {((item.price || 0) * quantity).toLocaleString('vi-VN')}₫
            </td>
            <td className="cart-item-remove">
                <button
                    onClick={() => onRemove(item.productVariantId)}
                    disabled={loading}
                    className="cart-remove-btn"
                >
                    X
                </button>
            </td>
        </tr>
    );
};

const Cart = () => {
    const { user } = useAuth();
    const { fetchCart, setCartCount } = useCart();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCartItems = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            setCartCount(0);
            setLoading(false);
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        try {
            const res = await fetch(CART_API_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (res.status === 401) {
                setCartItems([]);
                setCartCount(0);
                setLoading(false);
                navigate('/login', { state: { from: '/cart' } });
                return;
            }

            if (!res.ok) throw new Error('Không thể tải giỏ hàng');

            const data = await res.json();
            const validItems = Array.isArray(data)
                ? data.filter(
                    (item) =>
                        item &&
                        item.productVariantId &&
                        typeof item.quantity === 'number' &&
                        item.price &&
                        item.productName
                )
                : [];

            setCartItems(validItems);
            setCartCount(validItems.length);
        } catch (err) {
            setError(err.message);
            setCartItems([]);
            setCartCount(0);
        } finally {
            setLoading(false);
        }
    }, [user, navigate, setCartCount]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const updateQuantity = useCallback(
        async (productVariantId, newQty) => {
            if (updateLoading) return;
            setUpdateLoading(true);
            setError(null);

            try {
                // Optimistic update
                const updatedItems = cartItems.map((item) =>
                    item.productVariantId === productVariantId
                        ? { ...item, quantity: newQty }
                        : item
                );
                setCartItems(updatedItems);

                const res = await fetch(`${CART_API_URL}/${productVariantId}/quantity`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ quantity: newQty }),
                });

                if (res.status === 401) {
                    setCartItems([]);
                    setCartCount(0);
                    navigate('/login', { state: { from: '/cart' } });
                    return;
                }

                if (!res.ok) {
                    setCartItems(cartItems); // Revert optimistic update
                    throw new Error('Cập nhật số lượng thất bại');
                }

                const updatedItem = await res.json();
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.productVariantId === productVariantId ? updatedItem : item
                    )
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setUpdateLoading(false);
            }
        },
        [cartItems, navigate, setCartCount, updateLoading]
    );

    const removeItem = useCallback(
        async (productVariantId) => {
            if (updateLoading) return;
            setUpdateLoading(true);
            setError(null);

            try {
                // Optimistic update
                const updatedItems = cartItems.filter(
                    (item) => item.productVariantId !== productVariantId
                );
                setCartItems(updatedItems);
                setCartCount(updatedItems.length);

                const res = await fetch(`${CART_API_URL}/${productVariantId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                if (res.status === 401) {
                    setCartItems([]);
                    setCartCount(0);
                    navigate('/login', { state: { from: '/cart' } });
                    return;
                }

                if (!res.ok) {
                    setCartItems(cartItems); // Revert optimistic update
                    setCartCount(cartItems.length);
                    throw new Error('Xóa sản phẩm thất bại');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setUpdateLoading(false);
            }
        },
        [cartItems, navigate, setCartCount, updateLoading]
    );

    if (loading) {
        return (
            <div className="cart-loading-container">
                <div className="cart-loading-spinner"></div>
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="cart-auth-container">
                <div className="cart-auth-box">
                    <h2 className="cart-auth-title">Vui lòng đăng nhập</h2>
                    <p className="cart-auth-message">Bạn cần đăng nhập để xem giỏ hàng</p>
                    <Link to="/login" state={{ from: '/cart' }} className="cart-auth-login-btn">
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty-container">
                <div className="cart-empty-box">
                    <h2 className="cart-empty-title">Giỏ hàng trống</h2>
                    <p className="cart-empty-message">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                    <Link to="/shop" className="cart-empty-shop-btn">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

    return (
        <div className="cart-container">
            <div className="cart-table-wrapper">
                <table className="cart-table">
                    <thead className="cart-table-header">
                    <tr>
                        <th className="cart-table-heading">Sản phẩm</th>
                        <th className="cart-table-heading">Giá</th>
                        <th className="cart-table-heading">Số lượng</th>
                        <th className="cart-table-heading">Tổng</th>
                        <th className="cart-table-heading">Xóa</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.productVariantId}
                            item={item}
                            onQuantityChange={updateQuantity}
                            onRemove={removeItem}
                            loading={updateLoading}
                        />
                    ))}
                    </tbody>
                </table>
                <div className="cart-footer">
                    <div className="cart-footer-content">
                        <Link to="/shop" className="cart-continue-shopping">
                            <FontAwesomeIcon icon={faArrowLeft} className="cart-continue-icon" />
                            Tiếp tục mua sắm
                        </Link>
                        <div className="cart-summary">
                            <p className="cart-summary-label">Tổng tiền:</p>
                            <p className="cart-summary-total">{subtotal.toLocaleString('vi-VN')}₫</p>
                            <Link to="/checkout" className="cart-checkout-btn">
                                Thanh toán
                            </Link>
                        </div>
                    </div>
                </div>
                {error && <div className="cart-error-message">{error}</div>}
            </div>
        </div>
    );
};

export default Cart;