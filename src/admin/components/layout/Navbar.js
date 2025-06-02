import React from 'react';

export default function Navbar() {
    return (
        <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a className="nav-item nav-link px-0 me-xl-4" href="#">
                    <i className="bx bx-menu bx-sm"></i>
                </a>
            </div>
            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                <div className="navbar-nav align-items-center">
                    <div className="nav-item d-flex align-items-center">
                        <i className="bx bx-search fs-4 lh-0"></i>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none"
                            placeholder="Search..."
                            aria-label="Search..."
                        />
                    </div>
                </div>
                <ul className="navbar-nav flex-row align-items-center ms-auto">
                    <li className="nav-item lh-1 me-3">
                        <a
                            className="github-button"
                            href="https://github.com/themeselection/sneat-html-admin-template-free"
                            data-icon="octicon-star"
                            data-size="large"
                            data-show-count="true"
                            aria-label="Star themeselection/sneat-html-admin-template-free on GitHub"
                        >
                            Star
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="/shop" className="menu-link">
                            <i className="menu-icon tf-icons bx bx-layout"></i>
                            <div>Shop</div>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}