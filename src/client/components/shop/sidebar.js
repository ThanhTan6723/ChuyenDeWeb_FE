import React from 'react';

const Sidebar = () => {
    return (
        <div className="left_sidebar_area">
            <aside className="left_widgets p_filter_widgets">
                <div className="l_w_title">
                    <h3>Browse Categories</h3>
                </div>
                <div className="widgets_inner">
                    <ul className="list">
                        <li>
                            <a href="#">Frozen Fish</a>
                            <span>(250)</span>
                        </li>
                        <li>
                            <a href="#">Dried Fish</a>
                            <span>(250)</span>
                        </li>
                        <li>
                            <a href="#">Fresh Fish</a>
                            <span>(250)</span>
                        </li>
                        <li>
                            <a href="#">Meat Alternatives</a>
                            <span>(250)</span>
                        </li>
                        <li>
                            <a href="#">Fresh Fish</a>
                            <span>(250)</span>
                        </li>
                        <li>
                            <a href="#">Meat Alternatives</a>
                            <span>(250)</span>
                        </li>
                        <li>
                            <a href="#">Meat</a>
                            <span>(250)</span>
                        </li>
                    </ul>
                </div>
            </aside>
            <aside className="left_widgets p_filter_widgets">
                <div className="l_w_title">
                    <h3>Product filters</h3>
                </div>
                <div className="widgets_inner">
                    <ul className="list">
                        <li>
                            <a href="#">Apple</a>
                        </li>
                        <li>
                            <a href="#">Asus</a>
                        </li>
                        <li className="active">
                            <a href="#">Gionee</a>
                        </li>
                        <li>
                            <a href="#">Micromax</a>
                        </li>
                        <li>
                            <a href="#">Samsung</a>
                        </li>
                    </ul>
                    <ul className="list">
                        <li>
                            <a href="#">Apple</a>
                        </li>
                        <li>
                            <a href="#">Asus</a>
                        </li>
                        <li className="active">
                            <a href="#">Gionee</a>
                        </li>
                        <li>
                            <a href="#">Micromax</a>
                        </li>
                        <li>
                            <a href="#">Samsung</a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;