import React from 'react';

const ProductItem = ({ image, name, price }) => {
    return (
        <div className="single_product_item">
            <img src={image} alt={name} />
            <div className="single_product_text">
                <h4>{name}</h4>
                <h3>${price}</h3>
                <a href="#" className="add_cart">+ add to cart<i className="ti-heart" /></a>
            </div>
        </div>
    );
};

export default ProductItem;