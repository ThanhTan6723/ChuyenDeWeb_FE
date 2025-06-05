import React, { useState } from 'react';

const ProductSorting = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

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

    return (
        <div className="product_top_bar d-flex justify-content-between align-items-center">
            <div className="single_product_menu d-flex">
                <h5>sort by : </h5>
                <select>
                    <option data-display="Select">name</option>
                    <option value={1}>price</option>
                    <option value={2}>product</option>
                </select>
            </div>
            <div className="single_product_menu d-flex">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="search"
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