import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from '../../../auth/authcontext';

const VoucherList = () => {
    const [vouchers, setVouchers] = useState([]);
    const [savedVouchers, setSavedVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isLoggedIn } = useAuth();

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    useEffect(() => {
        const fetchVouchers = async () => {
            setLoading(true);
            try {
                const headers = {
                    "Content-Type": "application/json",
                    ...(isLoggedIn && { Authorization: `Bearer ${localStorage.getItem("token")}` }),
                };

                const voucherResponse = await fetch(`${API_BASE_URL}/api/vouchers/user`, {
                    method: "GET",
                    headers,
                    credentials: "include",
                });
                if (!voucherResponse.ok) throw new Error("Lỗi khi lấy danh sách voucher");
                const voucherData = await voucherResponse.json();
                if (voucherData.status === "success") {
                    const today = new Date().toISOString().split("T")[0];
                    const activeVouchers = (voucherData.data || []).filter(
                        (voucher) => voucher.endDate >= today && voucher.isActive
                    );
                    setVouchers(activeVouchers);
                }

                if (isLoggedIn) {
                    const savedResponse = await fetch(`${API_BASE_URL}/api/e-vouchers/user`, {
                        method: "GET",
                        headers,
                        credentials: "include",
                    });
                    if (!savedResponse.ok) throw new Error("Lỗi khi lấy danh sách voucher đã lưu");
                    const savedData = await savedResponse.json();
                    if (savedData.status === "success") {
                        setSavedVouchers(savedData.data || []);
                    }
                } else {
                    setSavedVouchers([]);
                }
            } catch (err) {
                setError(`Lỗi: ${err.message}`);
                toast.error(`Lỗi: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, [API_BASE_URL, isLoggedIn]);

    const handleSaveVoucher = async (voucherId) => {
        if (!isLoggedIn) {
            toast.warn("Vui lòng đăng nhập để lưu voucher!");
            return;
        }

        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            };

            const checkResponse = await fetch(
                `${API_BASE_URL}/api/e-vouchers/check?voucherId=${voucherId}`,
                {
                    method: "GET",
                    headers,
                    credentials: "include",
                }
            );
            const checkData = await checkResponse.json();
            if (checkData.status === "success" && checkData.data) {
                toast.warn("Bạn đã lưu voucher này rồi!");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/e-vouchers`, {
                method: "POST",
                headers,
                credentials: "include",
                body: JSON.stringify({ voucherId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Lỗi khi lưu voucher");
            }

            const data = await response.json();
            if (data.status === "success") {
                toast.success("Lưu voucher thành công!");
                const savedResponse = await fetch(`${API_BASE_URL}/api/e-vouchers/user`, {
                    method: "GET",
                    headers,
                    credentials: "include",
                });
                if (savedResponse.ok) {
                    const savedData = await savedResponse.json();
                    if (savedData.status === "success") {
                        setSavedVouchers(savedData.data || []);
                    }
                }
                setVouchers((prev) =>
                    prev.map((v) => (v.id === voucherId ? { ...v, quantity: v.quantity - 1 } : v))
                );
            }
        } catch (err) {
            toast.error(`Lỗi: ${err.message}`);
        }
    };

    // Gộp tất cả voucher lại thành một danh sách duy nhất để render
    const allVoucherList = [
        ...vouchers.filter((voucher) => voucher.discountType?.id === 1),
        ...vouchers.filter((voucher) => voucher.discountType?.id === 2 && voucher.category),
        ...vouchers.filter((voucher) => voucher.discountType?.id === 3 && voucher.productVariantDTO)
    ];

    return (
        <div className="voucher-container">
            {loading ? (
                <div className="voucher-loading">
                    <div className="voucher-spinner"></div>
                    <span>Đang tải...</span>
                </div>
            ) : (
                <>
                    <div className="voucher-group">
                        <div className="voucher-grid">
                            {allVoucherList.map((voucher) => {
                                const isSaved = savedVouchers.some((sv) => sv.id === voucher.id);
                                const isOutOfStock = voucher.quantity <= 0;
                                const buttonText = isSaved ? "Đã lưu" : isOutOfStock ? "Đã hết mã" : "Lưu mã";
                                const isDisabled = isOutOfStock || isSaved;
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
                                                    <span><b>{voucher.code}</b></span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Giảm tối đa {voucher.maximumDiscount?.toLocaleString("vi-VN")} VNĐ</span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Đơn tối thiểu {voucher.minimumOrderValue?.toLocaleString("vi-VN")} VNĐ</span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Ngày bắt đầu {voucher.startDate}</span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Ngày kết thúc: {voucher.endDate}</span>
                                                </div>
                                                <div className="voucher-info-row">
                                                    <span>Số lượng: {voucher.quantity}</span>
                                                </div>
                                                {/*{voucher.discountType?.id === 1 && (*/}
                                                {/*    <div className="voucher-info-row">*/}
                                                {/*        <span>Áp dụng cho tất cả sản phẩm</span>*/}
                                                {/*    </div>*/}
                                                {/*)}*/}
                                                {/*{voucher.discountType?.id === 2 && voucher.category && (*/}
                                                {/*    <div className="voucher-info-row">*/}
                                                {/*        <span>Danh mục: {voucher.category.name}</span>*/}
                                                {/*    </div>*/}
                                                {/*)}*/}
                                                {/*{voucher.discountType?.id === 3 && voucher.productVariantDTO && (*/}
                                                {/*    <div className="voucher-info-row">*/}
                                                {/*        <span>Sản phẩm: {voucher.productVariantDTO.variant} ({voucher.productVariantDTO.attribute})</span>*/}
                                                {/*    </div>*/}
                                                {/*)}*/}
                                            </div>
                                            <span className="voucher-status">
                                                {isOutOfStock ? "Đã hết mã" : isSaved ? "Đã lưu" : "Có thể sử dụng"}
                                            </span>
                                            <div className="voucher-button-wrapper">
                                                <button
                                                    onClick={() => handleSaveVoucher(voucher.id)}
                                                    disabled={isDisabled}
                                                    className={`voucher-button ${isDisabled ? "disabled" : "enabled"}`}
                                                >
                                                    {buttonText}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {allVoucherList.length === 0 && (
                            <p className="voucher-empty">Không có voucher nào đang hoạt động.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default VoucherList;