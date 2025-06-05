import React from 'react';

const Sidebar = () => {
    return (
        <div className="left_sidebar_area">
            <aside className="left_widgets p_filter_widgets">
                <div className="l_w_title">
                    <h3>Danh mục</h3>
                </div>
                <div className="widgets_inner">
                    <ul className="list">
                        <li>
                            <a href="#">Tẩy trang</a>
                        </li>
                        <li>
                            <a href="#">Sữa rửa mặt</a>
                        </li>
                        <li>
                            <a href="#">Toner</a>
                        </li>
                        <li>
                            <a href="#">Kem chống nắng</a>
                        </li>
                        <li>
                            <a href="#">Kem dưỡng</a>
                        </li>
                        <li>
                            <a href="#">Mặt nạ</a>
                        </li>
                        <li>
                            <a href="#">Serum</a>
                        </li>
                    </ul>
                </div>
            </aside>
            <aside className="left_widgets p_filter_widgets">
                <div className="l_w_title">
                    <h3>Thương hiệu</h3>
                </div>
                <div className="widgets_inner">
                    <ul className="list">
                        <li>
                            <a href="#">CeraVe</a>
                        </li>
                        <li>
                            <a href="#">Bioderma</a>
                        </li>
                        <li className="active">
                            <a href="#">La Roche-Posay</a>
                        </li>
                        <li>
                            <a href="#">Cetaphil</a>
                        </li>
                        <li>
                            <a href="#">SVR</a>
                        </li>
                    </ul>
                    <ul className="list">
                        <li>
                            <a href="#">Loreal</a>
                        </li>
                        <li>
                            <a href="#">Eucerin</a>
                        </li>
                        <li className="active">
                            <a href="#">cocoon</a>
                        </li>
                        <li>
                            <a href="#">Good Skin</a>
                        </li>
                        <li>
                            <a href="#">klairs</a>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;