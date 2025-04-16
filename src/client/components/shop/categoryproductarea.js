import React from 'react';
import Sidebar from './sidebar';
import ProductSorting from './productsorting';
import ProductGrid from './productgrid';

const CategoryProductArea = () => {
    return (
        <section className="cat_product_area section_padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <Sidebar />
                    </div>
                    <div className="col-lg-9">
                        <div className="row">
                            <div className="col-lg-12">
                                <ProductSorting />
                            </div>
                        </div>
                        <ProductGrid />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryProductArea;