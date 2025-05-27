import React from 'react';

const CartItem = ({ product, onQuantityChange, onRemove }) => (
    <tr>
        <td>
            <div className="media">
                <div className="d-flex">
                    <img src={product.image} alt="product" style={{ width: '100px' }} />
                </div>
                <div className="media-body">
                    <p>{product.name}</p>
                </div>
            </div>
        </td>
        <td>
            <h5>{product.price.toLocaleString()}₫</h5>
        </td>
        <td>
            <div className="product_count">
                <button
                    className="input-number-decrement"
                    onClick={() => onQuantityChange(product.productVariantId, -1)}
                >
                    <i className="ti-angle-down" />
                </button>
                <input
                    className="input-number"
                    type="text"
                    value={product.quantity}
                    readOnly
                />
                <button
                    className="input-number-increment"
                    onClick={() => onQuantityChange(product.productVariantId, 1)}
                >
                    <i className="ti-angle-up" />
                </button>
            </div>
        </td>
        <td>
            <h5>{product.total.toLocaleString()}₫</h5>
        </td>
        <td>
            <button
                className="btn_1"
                onClick={() => onRemove(product.productVariantId)}
            >
                Remove
            </button>
        </td>
    </tr>
);

export default CartItem;