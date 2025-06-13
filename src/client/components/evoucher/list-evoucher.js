import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../auth/authcontext";

const MAX_QUANTITY = 100;

const SavedVoucherList = () => {
    const [savedVouchers, setSavedVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    // Lấy danh sách voucher đã lưu
    useEffect(() => {
        const fetchSavedVouchers = async () => {
            setLoading(true);
            try {
                if (!isLoggedIn) {
                    setError("Vui lòng đăng nhập để xem voucher đã lưu!");
                    toast.error("Vui lòng đăng nhập để xem voucher đã lưu!");
                    return;
                }

                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                };

                const response = await fetch(`${API_BASE_URL}/api/e-vouchers/user`, {
                    method: "GET",
                    headers,
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Lỗi khi lấy danh sách voucher đã lưu");
                const data = await response.json();
                if (data.status === "success") {
                    setSavedVouchers(data.data || []);
                }
            } catch (err) {
                setError(`Lỗi: ${err.message}`);
                toast.error(`Lỗi: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedVouchers();
    }, [API_BASE_URL, isLoggedIn]);

    // Tìm số lượng lớn nhất để làm max cho thanh progress
    const getMaxQuantity = () =>
        Math.max(...savedVouchers.map(v => v.quantity || 0), MAX_QUANTITY);

    return (
        <div className="voucher-container">
            {loading ? (
                <div className="voucher-loading">
                    <div className="voucher-spinner"></div>
                    <span>Đang tải...</span>
                </div>
            ) : error ? (
                <p className="voucher-empty">{error}</p>
            ) : (
                <div className="voucher-group">
                    <div className="voucher-grid">
                        {savedVouchers.length > 0 ? (
                            savedVouchers.map((voucher) => {
                                const isOutOfStock = voucher.quantity <= 0;
                                const percent =
                                    getMaxQuantity() > 0
                                        ? Math.min(100, Math.round((voucher.quantity / getMaxQuantity()) * 100))
                                        : 0;
                                return (
                                    <div key={voucher.id} className="voucher-cardd voucher-ticket-uniform">
                                        <div className="voucher-ticket-left-part">
                                            <div className="voucher-left-content">
                                                <div className="voucher-company">SPECIAL GIFT</div>
                                                <div className="voucher-discount-big">
                                                    <span className="voucher-discount-number">{voucher.discountPercentage}%</span>
                                                    <span className="voucher-discount-label">OFF</span>
                                                </div>
                                                <div className="voucher-coupon-label">Coupon</div>
                                            </div>
                                        </div>
                                        <div className="voucher-ticket-right-part">
                                            <div className="voucher-info-list">
                                                <div className="voucher-info-row">
                                                    <span><b>Mã: {voucher.code}</b></span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Giảm tối đa: {voucher.maximumDiscount?.toLocaleString("vi-VN")} VNĐ</span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Đơn tối thiểu: {voucher.minimumOrderValue?.toLocaleString("vi-VN")} VNĐ</span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Ngày bắt đầu: {voucher.startDate}</span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Ngày kết thúc: {voucher.endDate}</span>
                                                </div>
                                            </div>
                                            {/* Thanh số lượng */}
                                            <div className="voucher-quantity-bar-wrap">
                                                <div className="voucher-quantity-bar-bg">
                                                    <div
                                                        className="voucher-quantity-bar-fg"
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                                <span className="voucher-quantity-bar-text">
                                                    {voucher.quantity}
                                                </span>
                                            </div>
                                            <span className="voucher-status">
                                                {isOutOfStock ? "Đã hết mã" : "Đã lưu"}
                                            </span>
                                            <div className="voucher-button-wrapper">
                                                <button
                                                    disabled={true}
                                                    className="voucher-button disabled"
                                                >
                                                    Đã lưu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="voucher-empty">Không có voucher nào đã lưu.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedVoucherList;