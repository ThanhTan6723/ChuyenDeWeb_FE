import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../auth/authcontext";

const MAX_QUANTITY = 100;

const SavedVoucherList = () => {
    const [savedVouchers, setSavedVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();
    const [alertMessage, setAlertMessage] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";
    const prevQuantities = useRef({});

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

    useEffect(() => {
        const q = {};
        savedVouchers.forEach(v => q[v.id] = v.quantity);
        prevQuantities.current = q;
    }, [savedVouchers]);

    // Tìm số lượng lớn nhất để làm max cho thanh progress
    const getMaxQuantity = () =>
        Math.max(...savedVouchers.map(v => v.quantity || 0), MAX_QUANTITY);

    // Thanh bar width = tổng 100%, phần xám là tỷ lệ còn lại, phần trắng là đã mất
    const getRemainPercent = (quantity) => {
        let percent = (quantity / MAX_QUANTITY) * 100;
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        return percent;
    };

    return (
        <div className="voucher-container">
            <ToastContainer />
            {alertMessage && (
                <div
                    style={{
                        background: "#fffae6",
                        border: "1px solid #ffe58f",
                        color: "#ad6800",
                        padding: "10px",
                        borderRadius: "4px",
                        marginBottom: "16px",
                        textAlign: "center",
                        fontWeight: 500,
                    }}
                >
                    {alertMessage}
                    <button
                        onClick={() => setAlertMessage("")}
                        style={{
                            background: "none",
                            border: "none",
                            marginLeft: "12px",
                            color: "#ad6800",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                        aria-label="Đóng"
                    >
                        ×
                    </button>
                </div>
            )}
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
                                const remainPercent = getRemainPercent(voucher.quantity);

                                let fromDate = voucher.startDate;
                                if (fromDate && fromDate.length === 10) {
                                    fromDate = fromDate.split('-').reverse().join('/');
                                }
                                let toDate = voucher.endDate;
                                if (toDate && toDate.length === 10) {
                                    toDate = toDate.split('-').reverse().join('/');
                                }

                                return (
                                    <div key={voucher.id} className="voucher-image2-card">
                                        <div className="voucher-image2-row voucher-image2-top">
                                            <div className="voucher-image2-discount">
                                                Giảm {(voucher.discountPercentage || 0).toFixed(2)}%
                                            </div>
                                            <div className="voucher-image2-type">
                                                {voucher.category?.name?.toUpperCase() ||
                                                    voucher.productVariantDTO?.name?.toUpperCase() ||
                                                    "ALL"}
                                            </div>
                                        </div>
                                        <div className="voucher-image2-code">
                                            {voucher.code}
                                        </div>
                                        <div className="voucher-image2-desc">
                                            Giảm tối đa: {voucher.maximumDiscount?.toLocaleString("vi-VN")} đ
                                        </div>
                                        <div className="voucher-image2-desc">
                                            Đơn tối thiểu: {voucher.minimumOrderValue?.toLocaleString("vi-VN")} đ
                                        </div>
                                        <div className="voucher-image2-desc">
                                            Có hiệu lực từ {fromDate}
                                        </div>
                                        <div className="voucher-image2-desc">
                                            Đến hết {toDate}
                                        </div>

                                        {/* Thanh số lượng còn lại giống trang voucher */}
                                        <div style={{
                                            width: "90%",
                                            margin: "8px 0 0 0",
                                            height: "20px",
                                            position: "relative",
                                            overflow: "hidden",
                                            borderRadius: "12px",
                                            background: "#ededed",
                                            border: "1px solid #e0e0e0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {/* Phần đã mất (màu trắng) */}
                                            <div style={{
                                                position: "absolute",
                                                left: `${remainPercent}%`,
                                                top: 0,
                                                height: "100%",
                                                width: `${100 - remainPercent}%`,
                                                background: "#fff",
                                                transition: "width 0.7s cubic-bezier(.77,0,.18,1), left 0.7s cubic-bezier(.77,0,.18,1)",
                                                zIndex: 1
                                            }} />
                                            {/* Nội dung luôn nằm giữa */}
                                            <div style={{
                                                width: "100%",
                                                textAlign: "center",
                                                position: "absolute",
                                                left: 0, top: 0, height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                zIndex: 2,
                                                pointerEvents: "none"
                                            }}>
                                                <span style={{
                                                    fontSize: "12px",
                                                    color: "#555",
                                                    fontWeight: 600,
                                                    background: "transparent",
                                                    whiteSpace: "nowrap"
                                                }}>
                                                    Còn {voucher.quantity ?? 0}
                                                </span>
                                            </div>
                                            {/* Phần nền xám nhạt còn lại */}
                                            <div style={{
                                                position: "absolute",
                                                left: 0,
                                                top: 0,
                                                height: "100%",
                                                width: `${remainPercent}%`,
                                                background: "#ededed",
                                                transition: "width 0.7s cubic-bezier(.77,0,.18,1)",
                                                zIndex: 0
                                            }} />
                                        </div>
                                        <button
                                            disabled={true}
                                            className="voucher-image2-btn disabled"
                                            style={{ marginTop: 10 }}
                                        >
                                            Đã lưu
                                        </button>
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