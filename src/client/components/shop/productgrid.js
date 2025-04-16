import React, { useState } from 'react';

const products = [
    { id: 1, image: "img/product/product_1.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 2, image: "img/product/product_2.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 3, image: "img/product/product_3.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 4, image: "img/product/product_4.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 5, image: "img/product/product_5.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 6, image: "img/product/product_6.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 7, image: "img/product/product_7.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 8, image: "img/product/product_1.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 9, image: "img/product/product_2.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 10, image: "img/product/product_3.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
    { id: 11, image: "img/product/product_4.png", name: "Sunstar Fresh Melon Juice", price: "18.00" },
];

const itemsPerPage = 5;

const ProductGrid = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className="product-grid">
                {currentProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                        <div className="discount-badge">-30%</div>
                        <div className="wishlist-icon">♡</div>
                        <img src={product.image} alt={product.name} className="product-image" />
                        <h3 className="product-name">{product.name}</h3>
                        <div className="unit-rating">
                            <span>1 UNIT</span>
                            <span className="star">⭐ 4.5</span>
                        </div>
                        <div className="product-price">${product.price}</div>
                        <div className="quantity-cart">
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                            <span className="add-to-cart">Add to Cart</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                        <button
                            key={index}
                            onClick={() => handlePageChange(pageNumber)}
                            className={currentPage === pageNumber ? 'active' : ''}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
            </div>
        </>
    );
};

export default ProductGrid;
