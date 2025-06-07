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

    // Lấy danh sách voucher và voucher đã lưu
    useEffect(() => {
        const fetchVouchers = async () => {
            setLoading(true);
            try {
                const headers = {
                    "Content-Type": "application/json",
                    ...(isLoggedIn && { Authorization: `Bearer ${localStorage.getItem("token")}` }),
                };

                // Lấy danh sách voucher đang hoạt động
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

                // Lấy danh sách voucher đã lưu nếu đã đăng nhập
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

    // Xử lý lưu voucher
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

    // Phân loại voucher theo discountType
    const allVouchers = vouchers.filter((voucher) => voucher.discountType?.id === 1);
    const categoryVouchers = vouchers.filter(
        (voucher) => voucher.discountType?.id === 2 && voucher.category
    );
    const productVouchers = vouchers.filter(
        (voucher) => voucher.discountType?.id === 3 && voucher.productVariantDTO
    );

    const renderVoucherGroup = (vouchers, title) => {
        if (vouchers.length === 0) return null;
        return (
            <div className="voucher-group">
                <h3 className="section-title">{title}</h3>
                <div className="voucher-grid">
                    {vouchers.map((voucher) => {
                        const isSaved = savedVouchers.some((sv) => sv.id === voucher.id);
                        const isOutOfStock = voucher.quantity <= 0;
                        const buttonText = isSaved ? "Đã lưu" : isOutOfStock ? "Đã hết mã" : "Lưu Voucher";
                        const isDisabled = isOutOfStock || isSaved;

                        return (
                            <div key={voucher.id} className="voucher-card">
                                <div className="voucher-header">
                                    <span className="voucher-code">{voucher.code}</span>
                                    <span className="voucher-discount">{voucher.discountPercentage}%</span>
                                </div>
                                <div className="voucher-body">
                                    <p className="voucher-info">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zm0 8c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"
                                            />
                                        </svg>
                                        Tối đa: {voucher.maximumDiscount?.toLocaleString("vi-VN")} VNĐ
                                    </p>
                                    <p className="voucher-info">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                            />
                                        </svg>
                                        Đơn tối thiểu: {voucher.minimumOrderValue?.toLocaleString("vi-VN")} VNĐ
                                    </p>
                                    <p className="voucher-info">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        HSD: {voucher.endDate} | Số lượng: {voucher.quantity}
                                    </p>
                                    {voucher.discountType?.id === 2 && voucher.category && (
                                        <p className="voucher-info">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                />
                                            </svg>
                                            Danh mục: {voucher.category.name}
                                        </p>
                                    )}
                                    {voucher.discountType?.id === 3 && voucher.productVariantDTO && (
                                        <p className="voucher-info">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2"
                                                />
                                            </svg>
                                            Sản phẩm: {voucher.productVariantDTO.variant} ({voucher.productVariantDTO.attribute})
                                        </p>
                                    )}
                                    <span className="voucher-status">
                                        {isOutOfStock ? "Đã hết mã" : isSaved ? "Đã lưu" : "Có thể sử dụng"}
                                    </span>
                                    <button
                                        onClick={() => handleSaveVoucher(voucher.id)}
                                        disabled={isDisabled}
                                        className={`voucher-button ${isDisabled ? "disabled" : "enabled"}`}
                                    >
                                        {buttonText}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="voucher-container">
            {loading ? (
                <div className="voucher-loading">
                    <div className="voucher-spinner"></div>
                    <span>Đang tải...</span>
                </div>
            ) : (
                <>
                    {renderVoucherGroup(allVouchers, "Voucher Chung")}
                    {renderVoucherGroup(categoryVouchers, "Voucher Theo Danh Mục")}
                    {renderVoucherGroup(productVouchers, "Voucher Theo Sản Phẩm")}
                    {allVouchers.length === 0 && categoryVouchers.length === 0 && productVouchers.length === 0 && (
                        <p className="voucher-empty">Không có voucher nào đang hoạt động.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default VoucherList;