import React, { useState } from 'react';
import Sidebar from './sidebar';
import ProductSorting from './productsorting';
import ProductGrid from './productgrid';

const CategoryProductArea = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleSort = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

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
                                <ProductSorting onSearch={handleSearch} onSort={handleSort} />
                            </div>
                        </div>
                        <ProductGrid searchTerm={searchTerm} sortBy={sortBy} sortOrder={sortOrder} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryProductArea;