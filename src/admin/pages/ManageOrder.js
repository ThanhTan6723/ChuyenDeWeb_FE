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
    const [noOrdersMessage, setNoOrdersMessage] = useState(''); // State cho thông báo

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";
    const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';

    // Ánh xạ trạng thái API sang nhãn tiếng Việt
    const statusLabels = {
        PENDING: 'Chờ xác nhận',
        CONFIRMED: 'Đã xác nhận',
        ON_DELIVERY: 'Đang giao hàng',
        DELIVERED: 'Giao thành công',
        CANCELLED: 'Đã hủy',
        REFUSED: 'Bị từ chối',
    };

    // Danh sách các tab dựa trên OrderStatus
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
        fetchOrders(activeTab);
    }, [activeTab]);

    const fetchOrders = async (status) => {
        try {
            let url = `${API_BASE_URL}/api/orders/all`;
            if (status !== 'all') {
                url = `${API_BASE_URL}/api/orders/status/${status}`;
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
                setOrders(data.data);
                // Kiểm tra nếu không có đơn hàng
                if (data.data.length === 0) {
                    const tabLabel = tabs.find(tab => tab.key === status)?.label || 'Tất cả';
                    setNoOrdersMessage(`Không có đơn hàng nào trong trạng thái "${tabLabel}".`);
                } else {
                    setNoOrdersMessage('');
                }
            } else {
                console.error('API response unsuccessful:', data);
                setNoOrdersMessage('Không thể tải danh sách đơn hàng.');
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
                console.error('API response unsuccessful:', data);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setNoOrdersMessage(''); // Reset thông báo khi chuyển tab
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        fetchOrderDetails(order.id);
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
                                                                <button className="btn btn-primary btn-sm me-2">
                                                                    Xác nhận
                                                                </button>
                                                            )}
                                                            {order.orderStatus === 'CONFIRMED' && (
                                                                <button className="btn btn-warning btn-sm me-2">
                                                                    Chuẩn bị giao
                                                                </button>
                                                            )}
                                                            {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
                                                                <button className="btn btn-danger btn-sm">
                                                                    Hủy
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
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
                                            {detail.variantAttribute && detail.variantName
                                                ? `${detail.variantAttribute} - ${detail.variantName}`
                                                : 'N/A'}
                                        </td>
                                        <td>{formatCurrency(detail.productPrice) || '0'}</td>
                                        <td>{detail.quantity || '0'}</td>
                                        <td>{formatCurrency(detail.priceWithQuantity) || '0'}</td>
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