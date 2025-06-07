import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { formatDate, formatCurrency } from "../utils/formater";

export default function ManageOrder() {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [noOrdersMessage, setNoOrdersMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";
    const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';

    const statusLabels = {
        PENDING: 'Chờ xác nhận',
        CONFIRMED: 'Đã xác nhận',
        ON_DELIVERY: 'Đang giao hàng',
        DELIVERED: 'Giao thành công',
        CANCELLED: 'Đã hủy',
        REFUSED: 'Bị từ chối',
    };

    const tabs = [
        { key: 'all', label: 'Tất cả' },
        { key: 'PENDING', label: statusLabels.PENDING },
        { key: 'CONFIRMED', label: statusLabels.CONFIRMED },
        { key: 'ON_DELIVERY', label: statusLabels.ON_DELIVERY },
        { key: 'DELIVERED', label: statusLabels.DELIVERED },
        { key: 'CANCELLED', label: statusLabels.CANCELLED },
        { key: 'REFUSED', label: statusLabels.REFUSED },
    ];

    useEffect(() => {
        fetchOrders(activeTab, currentPage);
    }, [activeTab, currentPage]);

    const fetchOrders = async (status, page) => {
        try {
            let url = `${API_BASE_URL}/api/orders/all?page=${page}&size=${pageSize}`;
            if (status !== 'all') {
                url = `${API_BASE_URL}/api/orders/status/${status}?page=${page}&size=${pageSize}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setOrders(data.data.content);
                setTotalPages(data.data.totalPages);
                setCurrentPage(data.data.currentPage);
                if (data.data.content.length === 0) {
                    const tabLabel = tabs.find(tab => tab.key === status)?.label || 'Tất cả';
                    setNoOrdersMessage(`Không có đơn hàng nào trong trạng thái "${tabLabel}".`);
                } else {
                    setNoOrdersMessage('');
                }
            } else {
                console.error('API response unsuccessful:', data.message);
                setNoOrdersMessage(data.message || 'Không thể tải danh sách đơn hàng.');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setNoOrdersMessage('Đã xảy ra lỗi khi tải danh sách đơn hàng.');
        }
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/details`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setOrderDetails(data.data);
                setShowModal(true);
            } else {
                console.error('API response unsuccessful:', data.message);
                setNoOrdersMessage(data.message || 'Không thể tải chi tiết đơn hàng.');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setNoOrdersMessage('Đã xảy ra lỗi khi tải chi tiết đơn hàng.');
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setCurrentPage(0);
        setNoOrdersMessage('');
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        fetchOrderDetails(order.id);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                fetchOrders(activeTab, currentPage);
                setNoOrdersMessage('');
            } else {
                console.error('API response unsuccessful:', data.message);
                setNoOrdersMessage(data.message || 'Không thể cập nhật trạng thái đơn hàng.');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setNoOrdersMessage('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.');
        }
    };

    const handleConfirmOrder = (orderId) => {
        updateOrderStatus(orderId, 'CONFIRMED');
    };

    const handlePrepareDelivery = (orderId) => {
        updateOrderStatus(orderId, 'ON_DELIVERY');
    };

    const handleCancelOrder = (orderId) => {
        updateOrderStatus(orderId, 'CANCELLED');
    };

    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Sidebar />
                <div className="layout-page">
                    <Navbar />
                    <div className="content-wrapper">
                        <div className="container-xxl flex-grow-1 container-p-y">
                            <h4 className="fw-bold py-3 mb-4">Quản lý đơn hàng</h4>
                            <div className="card">
                                <div className="card-header">
                                    <ul className="nav nav-tabs mb-3" role="tablist">
                                        {tabs.map((tab) => (
                                            <li className="nav-item" key={tab.key}>
                                                <button
                                                    className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                                                    onClick={() => handleTabClick(tab.key)}
                                                >
                                                    {tab.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="card-body">
                                    {noOrdersMessage ? (
                                        <div className="alert alert-info text-center" role="alert">
                                            {noOrdersMessage}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered">
                                                    <thead className="table-dark">
                                                    <tr>
                                                        <th>Mã đơn</th>
                                                        <th>Người đặt</th>
                                                        <th>Người nhận</th>
                                                        <th>Số điện thoại</th>
                                                        <th>Ngày đặt</th>
                                                        <th>Ngày giao</th>
                                                        <th>Ghi chú</th>
                                                        <th>Giảm giá</th>
                                                        <th>Phí vận chuyển</th>
                                                        <th>Thành tiền</th>
                                                        <th>Xem chi tiết</th>
                                                        <th>Hành động</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {orders.map((order) => (
                                                        <tr key={order.id}>
                                                            <td>{order.id}</td>
                                                            <td>{order.user?.username || 'N/A'}</td>
                                                            <td>{order.consigneeName || 'N/A'}</td>
                                                            <td>{order.consigneePhone || 'N/A'}</td>
                                                            <td>{formatDate(order.bookingDate) || 'N/A'}</td>
                                                            <td>{formatDate(order.deliveryDate) || 'N/A'}</td>
                                                            <td>{order.orderNotes || 'N/A'}</td>
                                                            <td>{formatCurrency(order.discountValue) || '0'}</td>
                                                            <td>{formatCurrency(order.ship) || '0'}</td>
                                                            <td>{formatCurrency(order.totalMoney) || '0'}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-info btn-sm"
                                                                    onClick={() => handleViewDetails(order)}
                                                                >
                                                                    Xem chi tiết
                                                                </button>
                                                            </td>
                                                            <td>
                                                                {order.orderStatus === 'PENDING' && (
                                                                    <button
                                                                        className="btn btn-primary btn-sm me-2"
                                                                        onClick={() => handleConfirmOrder(order.id)}
                                                                    >
                                                                        Xác nhận
                                                                    </button>
                                                                )}
                                                                {order.orderStatus === 'CONFIRMED' && (
                                                                    <button
                                                                        className="btn btn-warning btn-sm me-2"
                                                                        onClick={() => handlePrepareDelivery(order.id)}
                                                                    >
                                                                        Chuẩn bị giao
                                                                    </button>
                                                                )}
                                                                {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                                                                    <button
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => handleCancelOrder(order.id)}
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <nav aria-label="Page navigation">
                                                <ul className="pagination justify-content-center mt-3">
                                                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                        >
                                                            Trước
                                                        </button>
                                                    </li>
                                                    {[...Array(totalPages).keys()].map((page) => (
                                                        <li
                                                            key={page}
                                                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                                                        >
                                                            <button
                                                                className="page-link"
                                                                onClick={() => handlePageChange(page)}
                                                            >
                                                                {page + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                        >
                                                            Sau
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Footer />
                        <div className="content-backdrop fade"></div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng #{selectedOrder?.id || 'N/A'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table">
                            <thead style={{ background: '#233446', color: '#fafafa' }}>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Sản phẩm</th>
                                <th>Thuộc tính</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Tổng tiền</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orderDetails.length > 0 ? (
                                orderDetails.map((detail) => (
                                    <tr key={detail.id}>
                                        <td>
                                            {detail.mainImage ? (
                                                <img
                                                    src={`${CLOUDINARY_BASE_URL}${detail.mainImage}.png`}
                                                    alt={detail.productName || 'Product'}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <img
                                                    src="/img/product/default.png"
                                                    alt="Default"
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            )}
                                        </td>
                                        <td>{detail.productName || 'N/A'}</td>
                                        <td>
                                            {detail.attribute && detail.variant
                                                ? `${detail.attribute} - ${detail.variant}`
                                                : 'N/A'}
                                        </td>
                                        <td>{formatCurrency(detail.price) || '0'}</td>
                                        <td>{detail.quantity || '0'}</td>
                                        <td>{formatCurrency(detail.price * detail.quantity) || '0'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Không có chi tiết đơn hàng
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}