import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { toast } from "react-toastify";
import {useAuth} from "../../auth/authcontext";
import {useNavigate} from "react-router-dom";

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";
    const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';

    const { user, isLoggedIn } = useAuth(); // Kiểm tra trạng thái login và quyền admin
    const navigate = useNavigate();
    useEffect(() => {
        // Nếu chưa login thì chuyển về login
        if (!isLoggedIn || !user) {
            navigate('/login');
            return;
        }
        // Nếu đã login nhưng không phải admin thì chuyển về trang home (hoặc trang lỗi)
        // Ưu tiên kiểm tra cả role và roleName
        const role = user.role;
        console.log('role: '+role)
        if (role !== 'ROLE_ADMIN' && role !== 'ADMIN') {
            navigate('/home');
            return;
        }
        // eslint-disable-next-line
    }, [isLoggedIn, user, navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/products?page=${currentPage}&size=6`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                setProducts(data.products || []);
                setTotalPages(data.totalPages || 0);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi fetch sản phẩm:", err);
                setError("Không thể tải danh sách sản phẩm. " + err.message);
                toast.error("Lỗi tải danh sách sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [API_BASE_URL, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

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
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">Danh sách Sản phẩm</h5>
                                </div>
                                <div className="card-body">
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    {loading ? (
                                        <div className="text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Đang tải...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered">
                                                <thead className="table-dark">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Tên</th>
                                                    <th>Giá</th>
                                                    <th>Thương hiệu</th>
                                                    <th>Danh mục</th>
                                                    <th>Tồn kho</th>
                                                    <th>Hình ảnh</th>
                                                    <th>Hành động</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {products.length > 0 ? (
                                                    products.map((product) => (
                                                        <tr key={product.id}>
                                                            <td>{product.id}</td>
                                                            <td>{product.name}</td>
                                                            <td>{product.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                                            <td>{product.brand}</td>
                                                            <td>{product.category}</td>
                                                            <td>{product.stock}</td>
                                                            <td>
                                                                {product.mainImageUrl ? (
                                                                    <img src={product.mainImageUrl
                                                                        ? `${CLOUDINARY_BASE_URL}${product.mainImageUrl}.png`
                                                                        : '/img/product/default.png'}
                                                                         alt={product.name} width="50" />
                                                                ) : 'N/A'}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-sm btn-primary me-2">Sửa</button>
                                                                <button className="btn btn-sm btn-danger">Xóa</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            Không có sản phẩm nào
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                            <nav>
                                                <ul className="pagination justify-content-center mt-3">
                                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                                            Trước
                                                        </button>
                                                    </li>
                                                    {[...Array(totalPages).keys()].map((page) => (
                                                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                            <button className="page-link" onClick={() => handlePageChange(page)}>
                                                                {page + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                                                            Sau
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    )}
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
};

export default ManageProduct;