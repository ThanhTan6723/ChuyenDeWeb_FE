import React, { memo } from 'react';
import PropTypes from 'prop-types';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';

const ProductImage = ({ product, variant, selectedImage, onImageClick }) => {
    // Tạo danh sách tất cả hình ảnh từ các variant
    const allImages = product?.variants?.flatMap(variant =>
        variant.images?.map(image => ({
            publicId: image.publicId,
            mainImage: image.main,
            variantId: variant.id,
        })) || []
    ) || [];

    if (!product || !variant?.images?.length) {
        return (
            <div className="modal-image">
                <img
                    src="/img/product/default.png"
                    alt="Default"
                    className="product-image"
                />
            </div>
        );
    }

    const mainImageUrl = selectedImage
        ? `${CLOUDINARY_BASE_URL}${selectedImage}.png`
        : `${CLOUDINARY_BASE_URL}${variant.images[0].publicId}.png`;

    return (
        <div className="modal-image">
            <img
                style={{ height: '460px', width: '460px' }}
                src={mainImageUrl}
                alt="Product"
                className="product-image"
            />
            <div className="thumbnail-container">
                {allImages.map((image, index) => (
                    <img
                        style={{ width: '120px', height: '120px' }}
                        key={`${image.publicId}-${index}`}
                        src={`${CLOUDINARY_BASE_URL}${image.publicId}.png`}
                        alt={`Thumbnail ${index + 1}`}
                        className={`thumbnail ${selectedImage === image.publicId ? 'active' : ''}`}
                        onClick={() => onImageClick(image)}
                    />
                ))}
            </div>
        </div>
    );
};

ProductImage.propTypes = {
    product: PropTypes.shape({
        variants: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                images: PropTypes.arrayOf(
                    PropTypes.shape({
                        publicId: PropTypes.string,
                        main: PropTypes.bool,
                    })
                ),
            })
        ),
    }).isRequired,
    variant: PropTypes.shape({
        id: PropTypes.number,
        images: PropTypes.arrayOf(
            PropTypes.shape({
                publicId: PropTypes.string,
                main: PropTypes.bool,
            })
        ),
    }),
    selectedImage: PropTypes.string,
    onImageClick: PropTypes.func.isRequired,
};

export default memo(ProductImage);