import React, {createContext, useContext, useState, useEffect} from 'react';
import {useAuth} from '../auth/authcontext';

const CartContext = createContext(null);
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

export const CartProvider = ({children}) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    const fetchCart = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const data = await response.json();
            setCartItems(data);
        } catch (err) {
            setError('Error fetching cart');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productVariantId, quantity) => {
        if (!user) {
            setError('Please login to add items to cart');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({productVariantId, quantity}),
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            await fetchCart();
            return true;
        } catch (err) {
            setError('Error adding item to cart');
            console.error('Error:', err);
            return false;
        }
    };

    const updateCartItem = async (productVariantId, quantity) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify([{productVariantId, quantity}]),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart');
            }

            await fetchCart();
            return true;
        } catch (err) {
            setError('Error updating cart');
            console.error('Error:', err);
            return false;
        }
    };

    const removeFromCart = async (productVariantId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/${productVariantId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            await fetchCart();
            return true;
        } catch (err) {
            setError('Error removing item from cart');
            console.error('Error:', err);
            return false;
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            error,
            addToCart,
            updateCartItem,
            removeFromCart,
            fetchCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);