import React from 'react';
import SectionTitle from '../common/sectiontitle';
import ProductCard from '../common/productcard';

const ProductList = () => {
    const products = [
        { id: 1, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_1.png" },
        { id: 2, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_2.png" },
        { id: 3, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_3.png" },
        { id: 4, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_4.png" },
        { id: 5, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_5.png" },
        { id: 6, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_6.png" },
        { id: 7, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_7.png" },
        { id: 8, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_8.png" },
        { id: 8, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_1.png" },
        { id: 8, title: "Quartz Belt Watch", price: "150.00", image: "/img/product/product_2.png" },
    ];

    return (
        <section className="product-list section_padding">
            <div className="container">
                <SectionTitle title="Awesome" spanText="Shop" />
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            title={product.title}
                            price={product.price}
                            image={product.image}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductList;
