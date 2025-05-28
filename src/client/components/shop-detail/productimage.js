import React from 'react';
import PropTypes from 'prop-types';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';

const ProductImage = ({ variant }) => {
    const imageUrl = variant?.images?.length > 0
        ? `${CLOUDINARY_BASE_URL}${variant.images.find(img => img.main)?.publicId || variant.images[0].publicId}.png`
        : 'Loading';

    return (
        <div className="product_slider_img">
            <div id="vertical">
                <div data-thumb={imageUrl}>
                    <img src={imageUrl} alt="Product" className="w-full h-auto object-cover" />
                </div>
            </div>
        </div>
    );
};

ProductImage.propTypes = {
    variant: PropTypes.shape({
        images: PropTypes.arrayOf(
            PropTypes.shape({
                publicId: PropTypes.string,
                main: PropTypes.bool,
            })
        ),
    }),
};

export default ProductImage;