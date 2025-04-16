import React from "react";
import CartItem from "./cartitem";

const CartTable = () => {
    const cartItems = [
        {
            name: "Minimalistic shop for multipurpose use",
            image: "/img/product/single-product/cart-1.jpg",
            price: 360,
            quantity: 1,
            total: 720,
        },
        // Thêm nhiều item nếu muốn
    ];

    return (
        <section className="cart_area padding_top">
            <div className="container">
                <div className="cart_inner">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Product</th><th>Price</th><th>Quantity</th><th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cartItems.map((item, index) => (
                                <CartItem key={index} product={item} />
                            ))}
                            <tr className="bottom_button">
                                <td><a className="btn_1" href="#">Update Cart</a></td>
                                <td colSpan="2" />
                                <td>
                                    <div className="cupon_text float-right">
                                        <a className="btn_1" href="#">Close Coupon</a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td /><td /><td><h5>Subtotal</h5></td><td><h5>$2160.00</h5></td>
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
