import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/list`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // gửi cookie nếu có
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
                                <div className="card-header">
                                    <h5 className="card-title">Danh sách Người dùng</h5>
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
                                                        <td colSpan="8" className="text-center">
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
        </div>
    );
};

export default ManageUser;
