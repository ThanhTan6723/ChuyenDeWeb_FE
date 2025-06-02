import React from 'react';

const Breadcrumb = ({ title, path }) => {
    return (
        <section className="breadcrumb" style={{maxHeight:'400px', background:'#ECFDFF'}}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-4">
                        <div className="breadcrumb_iner">
                            <div className="breadcrumb_iner_item">
                                <h2>{title}</h2>
                                <p>{path}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Breadcrumb;