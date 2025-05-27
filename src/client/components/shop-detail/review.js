import React from 'react';

const Reviews = () => {
    return (
        <div className="tab-pane fade show active" id="review" role="tabpanel" aria-labelledby="review-tab">
            <div className="row">
                <div className="col-lg-6">
                    <div className="row total_rate">
                        <div className="col-6">
                            <div className="box_total">
                                <h5>Overall</h5>
                                <h4>4.0</h4>
                                <h6>(03 Reviews)</h6>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="rating_list">
                                <h3>Based on 3 Reviews</h3>
                                <ul className="list">
                                    <li><a href="#">5 Star <i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i> 01</a></li>
                                    <li><a href="#">4 Star <i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i> 01</a></li>
                                    <li><a href="#">3 Star <i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i> 01</a></li>
                                    <li><a href="#">2 Star <i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i> 01</a></li>
                                    <li><a href="#">1 Star <i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i><i className="fa fa-star"></i> 01</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reviews;