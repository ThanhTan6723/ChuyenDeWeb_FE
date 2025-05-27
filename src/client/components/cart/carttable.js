import React, { useState, useEffect } from 'react';
import CartItem from './cartitem';

const CART_API_URL = 'https://localhost:8443/api/cart';
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';

const CartTable = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const response = await fetch(CART_API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const items = await Promise.all(data.map(async (item) => {
                    const variantResponse = await fetch(`https://localhost:8443/api/products/variant/${item.productVariantId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const variant = await variantResponse.json();
                    const product = await fetch(`https://localhost:8443/api/products/${variant.productId}`).then(res => res.json());
                    const image = variant.images.find(img => img.main) || variant.images[0];
                    return {
                        productVariantId: item.productVariantId,
                        name: product.name,
                        image: image ? `${CLOUDINARY_BASE_URL}${image.publicId}` : '/img/product/placeholder.jpg',
                        price: variant.price,
                        quantity: item.quantity,
                        total: variant.price * item.quantity,
                    };
                }));
                setCartItems(items);
            } catch (err) {
                setError(`Failed to fetch cart: ${err.message}`);
                console.error('Error fetching cart:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleUpdateCart = async () => {
        try {
            await fetch(CART_API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartItems.map(item => ({
                    productVariantId: item.productVariantId,
                    quantity: item.quantity,
                }))),
                credentials: 'include',
            });
            // Refresh cart
            const response = await fetch(CART_API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            const items = await Promise.all(data.map(async (item) => {
                const variantResponse = await fetch(`https://localhost:8443/api/products/variant/${item.productVariantId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const variant = await variantResponse.json();
                const product = await fetch(`https://localhost:8443/api/products/${variant.productId}`).then(res => res.json());
                const image = variant.images.find(img => img.main) || variant.images[0];
                return {
                    productVariantId: item.productVariantId,
                    name: product.name,
                    image: image ? `${CLOUDINARY_BASE_URL}${image.publicId}` : '/img/product/placeholder.jpg',
                    price: variant.price,
                    quantity: item.quantity,
                    total: variant.price * item.quantity,
                };
            }));
            setCartItems(items);
        } catch (err) {
            console.error('Error updating cart:', err);
        }
    };

    const handleRemoveItem = async (productVariantId) => {
        try {
            await fetch(`${CART_API_URL}/${productVariantId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            setCartItems(cartItems.filter(item => item.productVariantId !== productVariantId));
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const handleQuantityChange = (productVariantId, delta) => {
        setCartItems(cartItems.map(item =>
            item.productVariantId === productVariantId
                ? { ...item, quantity: Math.max(1, item.quantity + delta), total: item.price * Math.max(1, item.quantity + delta) }
                : item
        ));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);

    if (loading) return <div className="loading text-center py-6 text-gray-500">Đang tải...</div>;
    if (error) return <div className="error text-center py-6 text-red-600 font-medium">Lỗi: {error}</div>;

    return (
        <section className="cart_area padding_top">
            <div className="container">
                <div className="cart_inner">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.productVariantId}
                                    product={item}
                                    onQuantityChange={handleQuantityChange}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                            <tr className="bottom_button">
                                <td>
                                    <button className="btn_1" onClick={handleUpdateCart}>
                                        Update Cart
                                    </button>
                                </td>
                                <td colSpan="3" />
                                <td>
                                    <div className="cupon_text float-right">
                                        <a className="btn_1" href="#">Close Coupon</a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td />
                                <td />
                                <td>
                                    <h5>Subtotal</h5>
                                </td>
                                <td>
                                    <h5>{subtotal.toLocaleString()}₫</h5>
                                </td>
                                <td />
                            </tr>
                            </tbody>
                        </table>
                        <div className="checkout_btn_inner float-right">
                            <a className="btn_1" href="#">Continue Shopping</a>
                            <a className="btn_1 checkout_btn_1" href="#">Proceed to checkout</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CartTable;