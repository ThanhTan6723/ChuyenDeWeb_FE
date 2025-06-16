import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { toast } from "react-toastify";
import {useAuth} from "../../auth/authcontext";
import {useNavigate} from "react-router-dom";

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

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
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/list`, {
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
                setUsers(data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi fetch người dùng:", err);
                setError("Không thể tải danh sách người dùng. " + err.message);
                toast.error("Lỗi tải danh sách người dùng.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [API_BASE_URL]);

    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        phoneNumber: '', // Thêm phoneNumber
        roleName: 'ROLE_CLIENT'
    });
    const [formError, setFormError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            toast.success("Thêm người dùng thành công!");
            setShowModal(false);
            setNewUser({ username: '', email: '', password: '', phoneNumber: '', roleName: 'ROLE_CLIENT' });

            const fetchResponse = await fetch(`${API_BASE_URL}/api/admin/list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (fetchResponse.ok) {
                const data = await fetchResponse.json();
                setUsers(data);
            }
        } catch (err) {
            setFormError(`Lỗi khi thêm người dùng: ${err.message}`);
            toast.error(`Lỗi khi thêm người dùng: ${err.message}`);
        }
    };

    const handleDelete = async (userId, username) => {
        if (!window.confirm(`Bạn có chắc muốn xóa người dùng ${username}?`)) {
            return;
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
                            <h4 className="fw-bold py-3 mb-4">Quản lý Người dùng</h4>
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">Danh sách Người dùng</h5>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Thêm người dùng
                                    </button>
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
                                                    <th>Tên người dùng</th>
                                                    <th>Email</th>
                                                    <th>Số điện thoại</th>
                                                    <th>Vai trò</th>
                                                    <th>Số lần đăng nhập thất bại</th>
                                                    <th>Khóa</th>
                                                    <th>Thời gian khóa</th>
                                                    <th>Hành động</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {users.length > 0 ? (
                                                    users.map((user) => (
                                                        <tr key={user.id}>
                                                            <td>{user.id}</td>
                                                            <td>{user.username}</td>
                                                            <td>{user.email}</td>
                                                            <td>{user.phone || 'N/A'}</td>
                                                            <td>{user.role?.roleName || "N/A"}</td>
                                                            <td>{user.failed ?? 0}</td>
                                                            <td>{user.locked ? "Có" : "Không"}</td>
                                                            <td>
                                                                {user.lockTime
                                                                    ? new Date(user.lockTime).toLocaleString("vi-VN")
                                                                    : "N/A"}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-sm btn-primary me-2">Sửa</button>
                                                                <button className="btn btn-sm btn-danger">Xóa</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="9" className="text-center">
                                                            Không có người dùng nào
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
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

            {/* Modal thêm người dùng */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-lg shadow-xl">
                            <div className="modal-header bg-gray-100 border-b border-gray-200">
                                <h5 className="modal-title text-xl font-semibold text-gray-800">Thêm người dùng mới</h5>
                                <button
                                    className="btn-close hover:bg-gray-200 rounded-full p-2 transition-colors"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-6">
                                    {formError && (
                                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                            {formError}
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Tên người dùng
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="username"
                                                value={newUser.username}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="email"
                                                value={newUser.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="phoneNumber"
                                                value={newUser.phoneNumber}
                                                onChange={handleInputChange}
                                                placeholder="VD: 0123456789"
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Mật khẩu
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="password"
                                                value={newUser.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Vai trò
                                            </label>
                                            <select
                                                className="form-select w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="roleName"
                                                value={newUser.roleName}
                                                onChange={handleInputChange}
                                            >
                                                <option value="ROLE_CLIENT">Client</option>
                                                <option value="ROLE_ADMIN">Admin</option>
                                                <option value="ROLE_MANAGE_USER">Manage User</option>
                                                <option value="ROLE_MANAGE_ORDER">Manage Order</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-gray-100 border-t border-gray-200 flex justify-end space-x-2 p-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUser;