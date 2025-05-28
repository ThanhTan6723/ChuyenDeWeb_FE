import React from 'react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ManageProduct() {
    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Sidebar />
                <div className="layout-page">
                    <Navbar />
                    <div className="content-wrapper">
                        <div className="container-xxl flex-grow-1 container-p-y">
                            <h4 className="fw-bold py-3 mb-4">Quản lý Sản phẩm</h4>
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Danh sách Sản phẩm</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Giá</th>
                                                <th>Kho</th>
                                                <th>Hành động</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Áo thun</td>
                                                <td>29.99$</td>
                                                <td>100</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary me-2">Sửa</button>
                                                    <button className="btn btn-sm btn-danger">Xóa</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>2</td>
                                                <td>Quần jeans</td>
                                                <td>59.99$</td>
                                                <td>50</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary me-2">Sửa</button>
                                                    <button className="btn btn-sm btn-danger">Xóa</button>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                        <div className="content-backdrop fade"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}