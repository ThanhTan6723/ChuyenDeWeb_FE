import React from "react";

const CartItem = ({ product }) => (
    <tr>
        <td>
            <div className="media">
                <div className="d-flex">
                    <img src={product.image} alt="product" />
                </div>
                <div className="media-body">
                    <p>{product.name}</p>
                </div>
            </div>
        </td>
        <td><h5>${product.price}</h5></td>
        <td>
            <div className="product_count">
                <span className="input-number-decrement"><i className="ti-angle-down" /></span>
                <input className="input-number" type="text" value={product.quantity} readOnly />
                <span className="input-number-increment"><i className="ti-angle-up" /></span>
            </div>
        </td>
        <td><h5>${product.total}</h5></td>
    </tr>
);

export default CartItem;
