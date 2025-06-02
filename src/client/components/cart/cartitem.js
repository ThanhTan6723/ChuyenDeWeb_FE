import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../auth/authcontext';
import { useCart } from '../../contexts/cartcontext';

const CART_API_URL = `${process.env.REACT_APP_API_BASE_URL || 'https://localhost:8443'}/api/cart`;

const CartItem = () => {
    const { user } = useAuth();
    const { fetchCart, setCartCount } = useCart();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
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
            setError(null);
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

            if (!res.ok) {
                throw new Error('Không thể tải giỏ hàng');
            }

            const data = await res.json();
            const validItems = Array.isArray(data)
                ? data.filter(
                    (item) =>
                        item &&
                        (item.productVariantId || item.id) &&
                        typeof item.quantity === 'number' &&
                        item.price &&
                        (item.productName || item.name)
                )
                : [];

            setCartItems(validItems);
            setCartCount(validItems.length);
            setSelectedItems(new Array(validItems.length).fill(false));
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
                const updatedItems = cartItems.map((item) =>
                    (item.productVariantId || item.id) === productVariantId
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
                    setCartItems(cartItems);
                    throw new Error('Cập nhật số lượng thất bại');
                }

                const updatedItem = await res.json();
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        (item.productVariantId || item.id) === productVariantId ? updatedItem : item
                    )
                );
            } catch (err) {
                setError(err.message);
                fetchCartItems();
            } finally {
                setUpdateLoading(false);
            }
        },
        [cartItems, navigate, setCartCount, updateLoading, fetchCartItems]
    );

    const removeItem = useCallback(
        async (productVariantId) => {
            if (updateLoading) return;
            setUpdateLoading(true);
            setError(null);

            try {
                const updatedItems = cartItems.filter(
                    (item) => (item.productVariantId || item.id) !== productVariantId
                );
                setCartItems(updatedItems);
                setCartCount(updatedItems.length);
                const updatedSelected = selectedItems.filter(
                    (_, i) => (cartItems[i].productVariantId || cartItems[i].id) !== productVariantId
                );
                setSelectedItems(updatedSelected);

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
                    setCartItems(cartItems);
                    setCartCount(cartItems.length);
                    setSelectedItems(new Array(cartItems.length).fill(false));
                    throw new Error('Xóa sản phẩm thất bại');
                }
            } catch (err) {
                setError(err.message);
                fetchCartItems();
            } finally {
                setUpdateLoading(false);
            }
        },
        [cartItems, selectedItems, navigate, setCartCount, updateLoading, fetchCartItems]
    );

    const incrementQuantity = (index) => {
        const item = cartItems[index];
        if (item && item.quantity < 10) {
            updateQuantity(item.productVariantId || item.id, item.quantity + 1);
        }
    };

    const decrementQuantity = (index) => {
        const item = cartItems[index];
        if (item && item.quantity > 1) {
            updateQuantity(item.productVariantId || item.id, item.quantity - 1);
        }
    };

    const getItemTotal = (price, quantity) => (price * quantity);

    const getSelectedSubtotal = () => {
        return cartItems.reduce((acc, item, index) => {
            if (selectedItems[index]) {
                return acc + (item.price || 0) * (item.quantity || 0);
            }
            return acc;
        }, 0);
    };

    const updateCart = () => {
        fetchCartItems();
    };

    const handleSelectItem = (index) => {
        const newSelected = [...selectedItems];
        newSelected[index] = !newSelected[index];
        setSelectedItems(newSelected);
    };

    const handleSelectAll = () => {
        setSelectedItems(new Array(cartItems.length).fill(!selectedItems.every(Boolean)));
    };

    const handleDeleteSelected = () => {
        selectedItems.forEach((selected, index) => {
            if (selected) {
                removeItem(cartItems[index].productVariantId || cartItems[index].id);
            }
        });
    };

    const handleAddToWishlist = () => {
        console.log('Added to wishlist:', cartItems.filter((_, i) => selectedItems[i]));
    };

    const handleCheckout = () => {
        const selectedCartItems = cartItems.filter((_, index) => selectedItems[index]);
        if (selectedCartItems.length === 0) {
            setError('Vui lòng chọn ít nhất một sản phẩm để đặt hàng');
            return;
        }
        navigate('/order', { state: { selectedCartItems } });
    };

    if (loading) {
        return (
            <section className="cart_area padding_top">
                <div className="container">
                    <div className="cart_inner">
                        <div className="text-center">
                            <p>Đang tải giỏ hàng...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="cart_area padding_top">
                <div className="container">
                    <div className="cart_inner">
                        <div className="text-center">
                            <h2>Vui lòng đăng nhập</h2>
                            <p>Bạn cần đăng nhập để xem giỏ hàng</p>
                            <Link to="/login" state={{ from: '/cart' }} className="btn_1">
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (cartItems.length === 0) {
        return (
            <section className="cart_area padding_top" style={{paddingTop:'160px'}}>
                <div className="container" style={{ marginBottom: '80px' }}>
                    <div className="cart_inner">
                        <div className="text-center">
                            <img src="/img/empty-cart.svg" />
                            <h2>Giỏ hàng trống</h2>
                            <p>Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                            <Link to="/shop" className="btn_1">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="cart_area padding_top">
            <div className="container">
                <div className="cart_inner" style={{ marginBottom: '40px' }}>
                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}
                    <div className="table-responsive">
                        <table className="table">
                            <thead style={{ background: '#ecfdff' }}>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Tổng</th>
                                <th scope="col" style={{paddingLeft:'50px'}}>Xóa</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={item.productVariantId || item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="custom-checkbox choosen"
                                            checked={selectedItems[index] || false}
                                            onChange={() => handleSelectItem(index)}
                                        />
                                    </td>
                                    <td>
                                        <div className="media">
                                            <div className="d-flex">
                                                <img
                                                    src={
                                                        item.mainImageUrl ||
                                                        item.imageUrl ||
                                                        item.additionalImageUrls?.[0] ||
                                                        'img/product/single-product/cart-1.jpg'
                                                    }
                                                    alt={item.productName || item.name || 'product'}
                                                    onError={(e) => {
                                                        e.target.src = 'img/product/single-product/cart-1.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="media-body">
                                                <p>{item.productName || item.name || 'Sản phẩm không tên'}</p>
                                                {(item.attribute || item.variant) && (
                                                    <small style={{ color: '#666' }}>
                                                        {item.attribute && `${item.attribute}`}
                                                        {item.attribute && item.variant && ' - '}
                                                        {item.variant && `${item.variant}`}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5>{(item.price || 0).toLocaleString('vi-VN')}₫</h5>
                                    </td>
                                    <td>
                                        <div className="product_count">
                                                <span
                                                    className={`input-number-decrement ${
                                                        item.quantity <= 1 || updateLoading ? 'disabled' : ''
                                                    }`}
                                                    onClick={() => !updateLoading && decrementQuantity(index)}
                                                    style={{
                                                        cursor:
                                                            item.quantity <= 1 || updateLoading
                                                                ? 'not-allowed'
                                                                : 'pointer',
                                                        opacity: item.quantity <= 1 || updateLoading ? 0.5 : 1,
                                                    }}
                                                >
                                                    <i className="ti-angle-down"></i>
                                                </span>
                                            <input
                                                className="input-number"
                                                type="text"
                                                value={item.quantity || 1}
                                                min="1"
                                                max="10"
                                                readOnly
                                            />
                                            <span
                                                className={`input-number-increment ${
                                                    item.quantity >= 10 || updateLoading ? 'disabled' : ''
                                                }`}
                                                onClick={() => !updateLoading && incrementQuantity(index)}
                                                style={{
                                                    cursor:
                                                        item.quantity >= 10 || updateLoading
                                                            ? 'not-allowed'
                                                            : 'pointer',
                                                    opacity: item.quantity >= 10 || updateLoading ? 0.5 : 1,
                                                }}
                                            >
                                                    <i className="ti-angle-up"></i>
                                                </span>
                                        </div>
                                    </td>
                                    <td style={{width:'110px'}}>
                                        <h5>
                                            {getItemTotal(item.price || 0, item.quantity || 0).toLocaleString(
                                                'vi-VN'
                                            )}₫
                                        </h5>
                                    </td>
                                    <td style={{paddingLeft:'50px'}}>
                                        <button
                                            onClick={() => removeItem(item.productVariantId || item.id)}
                                            disabled={updateLoading}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#dc3545',
                                                cursor: updateLoading ? 'not-allowed' : 'pointer',
                                                opacity: updateLoading ? 0.5 : 1,
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    <div className="cupon_text float-right">
                                        <a className="btn_1" href="#" >
                                            Voucher
                                        </a>
                                    </div>
                                </td>
                                <td><h5 style={{ fontWeight: 'bold' }}>Tổng tiền</h5></td>
                                <td style={{width:'110px'}}>
                                    <h5 style={{ fontWeight: 'bold', color: 'red' }}>
                                        {getSelectedSubtotal().toLocaleString('vi-VN')}₫
                                    </h5>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div
                            className="checkout_btn_inner float-right"
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: '40px',
                                marginTop: '20px',
                            }}
                        >
                            <div className="options">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox choosen"
                                    onChange={handleSelectAll}
                                    checked={selectedItems.every(Boolean)}
                                />
                                <span className="choosen">Chọn Tất Cả ({cartItems.length})</span>
                                <a
                                    className="choosen"
                                    onClick={handleDeleteSelected}
                                    style={{
                                        color:
                                            updateLoading || !selectedItems.some(Boolean) ? '#ccc' : 'red',
                                        cursor:
                                            updateLoading || !selectedItems.some(Boolean)
                                                ? 'not-allowed'
                                                : 'pointer',
                                    }}
                                >
                                    Xóa
                                </a>
                                <a
                                    className="choosen"
                                    onClick={handleAddToWishlist}
                                    style={{
                                        color:
                                            updateLoading || !selectedItems.some(Boolean) ? '#ccc' : '#505050',
                                        cursor:
                                            updateLoading || !selectedItems.some(Boolean)
                                                ? 'not-allowed'
                                                : 'pointer',
                                        marginLeft: '10px',
                                    }}
                                >
                                    Thêm vào mục yêu thích
                                </a>
                            </div>
                            <div className="buttonn" style={{ marginRight: '20px' }}>
                                <Link className="btn_1" to="/shop">
                                    Tiếp tục mua sắm
                                </Link>
                                <button
                                    className="btn_1 checkout_btn_1"
                                    onClick={handleCheckout}
                                    disabled={updateLoading}
                                >
                                    Đặt hàng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartItem;