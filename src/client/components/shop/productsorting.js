import React, { useState } from 'react';

const ProductSorting = ({ onSearch, onSort }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('name-asc');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchTerm);
        }
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);
        const [sortBy, sortOrder] = value.split('-');
        onSort(sortBy, sortOrder);
    };

    return (
        <div className="product_top_bar d-flex justify-content-between align-items-center">
            <div className="sort-menu">
                <h5>Sắp xếp theo</h5>
                <select value={sortOption} onChange={handleSortChange}>
                    <option value="name-asc">Tên A đến Z</option>
                    <option value="name-desc">Tên Z đến A</option>
                    <option value="price-asc">Giá Thấp đến Cao</option>
                    <option value="price-desc">Giá Cao đến Thấp</option>
                </select>
            </div>
            <div className="single_product_menu d-flex">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm"
                        aria-describedby="inputGroupPrepend"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchSubmit}
                    />
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupPrepend">
                            <i className="ti-search" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSorting;