import React from 'react';

const ProductSorting = () => {
    return (
        <div className="product_top_bar d-flex justify-content-between align-items-center">
            <div className="single_product_menu">
                <p><span>10000 </span> Prodict Found</p>
            </div>
            <div className="single_product_menu d-flex">
                <h5>short by : </h5>
                <select>
                    <option data-display="Select">name</option>
                    <option value={1}>price</option>
                    <option value={2}>product</option>
                </select>
            </div>
            <div className="single_product_menu d-flex">
                <h5>show :</h5>
                <div className="top_pageniation">
                    <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                </div>
            </div>
            <div className="single_product_menu d-flex">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="search" aria-describedby="inputGroupPrepend" />
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupPrepend"><i className="ti-search" /></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSorting;