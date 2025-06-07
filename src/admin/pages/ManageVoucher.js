import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../../assets/css/voucher.css";
import { toast } from "react-toastify";

const ManageVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productVariants, setProductVariants] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";

    const [newVoucher, setNewVoucher] = useState({
        code: "",
        discountType: { id: 1, type: "All" },
        discountPercentage: "",
        productVariantDTO: null,
        category: null,
        quantity: "",
        startDate: "",
        endDate: "",
        minimumOrderValue: "",
        maximumDiscount: "",
        isActive: true,
    });

    // Fetch categories and product variants
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                };

                const categoryResponse = await fetch(`${API_BASE_URL}/api/categories`, {
                    method: "GET",
                    headers,
                    credentials: "include",
                });
                if (!categoryResponse.ok) throw new Error("Lỗi khi lấy danh mục");
                const categoryData = await categoryResponse.json();
                if (categoryData.status === "success") setCategories(categoryData.data || []);

                const productResponse = await fetch(`${API_BASE_URL}/api/product-variants`, {
                    method: "GET",
                    headers,
                    credentials: "include",
                });
                if (!productResponse.ok) throw new Error("Lỗi khi lấy sản phẩm");
                const productData = await productResponse.json();
                if (productData.status === "success") setProductVariants(productData.data || []);
            } catch (err) {
                toast.error(`Lỗi khi tải danh mục hoặc sản phẩm: ${err.message}`);
            }
        };
        fetchDropdownData();
    }, [API_BASE_URL]);

    // Fetch all vouchers for admin
    useEffect(() => {
        const fetchVouchers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/vouchers/admin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                if (data.status === "success") {
                    setVouchers(data.data || []);
                    setError(null);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                setError(`Không thể tải danh sách voucher: ${err.message}`);
                toast.error(`Lỗi tải danh sách voucher: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, [API_BASE_URL]);

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!newVoucher.code.trim()) errors.code = "Mã voucher không được để trống";
        if (!newVoucher.discountPercentage || newVoucher.discountPercentage <= 0 || newVoucher.discountPercentage > 100)
            errors.discountPercentage = "Phần trăm giảm giá phải từ 0.01 đến 100";
        if (newVoucher.discountPercentage && newVoucher.discountPercentage % 5 !== 0)
            errors.discountPercentage = "Phần trăm giảm giá phải là bội số của 5";
        if (!newVoucher.quantity || newVoucher.quantity < 1) errors.quantity = "Số lượng phải lớn hơn 0";
        if (newVoucher.quantity && newVoucher.quantity % 10 !== 0)
            errors.quantity = "Số lượng phải là bội số của 10";
        if (!newVoucher.startDate) errors.startDate = "Ngày bắt đầu là bắt buộc";
        if (!newVoucher.endDate) errors.endDate = "Ngày kết thúc là bắt buộc";
        if (newVoucher.startDate && newVoucher.endDate && newVoucher.endDate < newVoucher.startDate)
            errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
        if (!newVoucher.minimumOrderValue || newVoucher.minimumOrderValue < 0)
            errors.minimumOrderValue = "Giá trị tối thiểu phải lớn hơn hoặc bằng 0";
        if (newVoucher.minimumOrderValue && newVoucher.minimumOrderValue % 20000 !== 0)
            errors.minimumOrderValue = "Giá trị tối thiểu phải là bội số của 20,000";
        if (!newVoucher.maximumDiscount || newVoucher.maximumDiscount <= 0)
            errors.maximumDiscount = "Số tiền giảm tối đa phải lớn hơn 0";
        if (newVoucher.maximumDiscount && newVoucher.maximumDiscount % 20000 !== 0)
            errors.maximumDiscount = "Số tiền giảm tối đa phải là bội số của 20,000";
        if (newVoucher.discountType.id === 2 && !newVoucher.category)
            errors.category = "Vui lòng chọn danh mục";
        if (newVoucher.discountType.id === 3 && !newVoucher.productVariantDTO)
            errors.productVariantDTO = "Vui lòng chọn sản phẩm";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedVoucher = { ...newVoucher };
        let parsedValue = value;

        if (name === "discountType") {
            const discountTypeMap = { 1: "All", 2: "Category", 3: "Product" };
            updatedVoucher = {
                ...newVoucher,
                discountType: { id: parseInt(value), type: discountTypeMap[value] },
                category: value !== "2" ? null : newVoucher.category,
                productVariantDTO: value !== "3" ? null : newVoucher.productVariantDTO,
            };
        } else if (name === "isActive") {
            updatedVoucher = { ...newVoucher, isActive: value === "true" };
        } else if (name === "category") {
            const selectedCategory = categories.find((cat) => cat.id === parseInt(value));
            updatedVoucher = {
                ...newVoucher,
                category: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : null,
            };
        } else if (name === "productVariantDTO") {
            const selectedProduct = productVariants.find((prod) => prod.id === parseInt(value));
            updatedVoucher = {
                ...newVoucher,
                productVariantDTO: selectedProduct
                    ? {
                        id: selectedProduct.id,
                        attribute: selectedProduct.attribute,
                        variant: selectedProduct.variant,
                        price: selectedProduct.price,
                        quantity: selectedProduct.quantity,
                    }
                    : null,
            };
        } else if (name === "discountPercentage") {
            parsedValue = value ? Math.round(parseFloat(value) / 5) * 5 : "";
            updatedVoucher = { ...newVoucher, [name]: parsedValue };
        } else if (name === "quantity") {
            parsedValue = value ? Math.round(parseInt(value) / 10) * 10 : "";
            updatedVoucher = { ...newVoucher, [name]: parsedValue };
        } else if (name === "minimumOrderValue" || name === "maximumDiscount") {
            parsedValue = value ? Math.round(parseFloat(value) / 20000) * 20000 : "";
            updatedVoucher = { ...newVoucher, [name]: parsedValue };
        } else {
            updatedVoucher = { ...newVoucher, [name]: value };
        }

        setNewVoucher(updatedVoucher);
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/vouchers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                credentials: "include",
                body: JSON.stringify({
                    ...newVoucher,
                    discountPercentage: parseFloat(newVoucher.discountPercentage),
                    quantity: parseInt(newVoucher.quantity),
                    minimumOrderValue: parseFloat(newVoucher.minimumOrderValue),
                    maximumDiscount: parseFloat(newVoucher.maximumDiscount),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            if (data.status === "success") {
                toast.success("Tạo voucher thành công!");
                setShowModal(false);
                resetForm();

                // Refresh voucher list
                const fetchResponse = await fetch(`${API_BASE_URL}/api/vouchers/admin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    credentials: "include",
                });

                if (fetchResponse.ok) {
                    const fetchData = await fetchResponse.json();
                    if (fetchData.status === "success") setVouchers(fetchData.data || []);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setFormErrors({ general: `Lỗi khi tạo voucher: ${err.message}` });
            toast.error(`Lỗi khi tạo voucher: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setNewVoucher({
            code: "",
            discountType: { id: 1, type: "All" },
            discountPercentage: "",
            productVariantDTO: null,
            category: null,
            quantity: "",
            startDate: "",
            endDate: "",
            minimumOrderValue: "",
            maximumDiscount: "",
            isActive: true,
        });
        setFormErrors({});
    };

    // Handle click outside modal to close
    const handleCloseModal = (e) => {
        if (e.target.classList.contains("voucher-modal")) {
            setShowModal(false);
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
                            <h4 className="fw-bold py-3 mb-4">Quản lý Voucher</h4>
                            <div className="voucher-card">
                                <div className="voucher-card-header">
                                    <h5 className="voucher-card-title">Danh sách Voucher</h5>
                                    <button className="voucher-btn voucher-btn-primary" onClick={() => setShowModal(true)}>
                                        Thêm Voucher
                                    </button>
                                </div>
                                <div className="voucher-card-body">
                                    {error && <div className="voucher-alert voucher-alert-danger">{error}</div>}
                                    {loading ? (
                                        <div className="voucher-loading">
                                            <div className="voucher-spinner"></div>
                                            <span>Đang tải...</span>
                                        </div>
                                    ) : (
                                        <div className="voucher-table-responsive">
                                            <table className="voucher-table">
                                                <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Mã</th>
                                                    <th>Loại Giảm Giá</th>
                                                    <th>Sản Phẩm</th>
                                                    <th>Phần Trăm Giảm</th>
                                                    <th>Số Lượng</th>
                                                    <th>Ngày Bắt Đầu</th>
                                                    <th>Ngày Kết Thúc</th>
                                                    <th>Giá Trị Tối Thiểu</th>
                                                    <th>Giảm Tối Đa</th>
                                                    <th>Trạng Thái</th>
                                                    <th>Hành Động</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {vouchers.length > 0 ? (
                                                    vouchers.map((voucher) => (
                                                        <tr key={voucher.id}>
                                                            <td>{voucher.id}</td>
                                                            <td>{voucher.code}</td>
                                                            <td>{voucher.discountType.type}</td>
                                                            <td>
                                                                {voucher.discountType.id === 3 && voucher.productVariantDTO
                                                                    ? voucher.productVariantDTO.productName || "Không xác định"
                                                                    : "-"}
                                                            </td>
                                                            <td>{voucher.discountPercentage}%</td>
                                                            <td>{voucher.quantity}</td>
                                                            <td>{voucher.startDate}</td>
                                                            <td>{voucher.endDate}</td>
                                                            <td>{voucher.minimumOrderValue.toLocaleString("vi-VN")} VNĐ</td>
                                                            <td>{voucher.maximumDiscount.toLocaleString("vi-VN")} VNĐ</td>
                                                            <td>{voucher.isActive ? "Hoạt động" : "Không hoạt động"}</td>
                                                            <td className="voucher-action-cell">
                                                                <button className="voucher-btn voucher-btn-small voucher-btn-primary">Sửa</button>
                                                                <button className="voucher-btn voucher-btn-small voucher-btn-danger">Xóa</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="12" className="voucher-table-empty">
                                                            Không có voucher nào
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

            {/* Modal thêm voucher */}
            {showModal && (
                <div className="voucher-modal" onClick={handleCloseModal}>
                    <div className="voucher-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="voucher-modal-header">
                            <h5 className="voucher-modal-title">Thêm Voucher Mới</h5>
                            <button
                                className="voucher-modal-close"
                                onClick={() => setShowModal(false)}
                                disabled={isSubmitting}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="voucher-modal-body">
                                {formErrors.general && (
                                    <div className="voucher-alert voucher-alert-danger">{formErrors.general}</div>
                                )}
                                <div className="voucher-form-grid">
                                    {/* Mã Voucher */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Mã Voucher <span className="voucher-required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`voucher-form-input ${formErrors.code ? "voucher-form-error" : ""}`}
                                            name="code"
                                            value={newVoucher.code}
                                            onChange={handleInputChange}
                                            placeholder="VD: SALE2025"
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.code && <p className="voucher-form-error-text">{formErrors.code}</p>}
                                    </div>

                                    {/* Loại Giảm Giá */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Loại Giảm Giá <span className="voucher-required">*</span>
                                        </label>
                                        <select
                                            className={`voucher-form-input ${formErrors.discountType ? "voucher-form-error" : ""}`}
                                            name="discountType"
                                            value={newVoucher.discountType.id}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                        >
                                            <option value="1">Tất cả</option>
                                            <option value="2">Danh mục</option>
                                            <option value="3">Sản phẩm</option>
                                        </select>
                                        {formErrors.discountType && (
                                            <p className="voucher-form-error-text">{formErrors.discountType}</p>
                                        )}
                                    </div>

                                    {/* Danh Mục */}
                                    {newVoucher.discountType.id === 2 && (
                                        <div className="voucher-form-group">
                                            <label className="voucher-form-label">
                                                Danh Mục <span className="voucher-required">*</span>
                                            </label>
                                            <select
                                                className={`voucher-form-input ${formErrors.category ? "voucher-form-error" : ""}`}
                                                name="category"
                                                value={newVoucher.category?.id || ""}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.category && (
                                                <p className="voucher-form-error-text">{formErrors.category}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Sản Phẩm */}
                                    {newVoucher.discountType.id === 3 && (
                                        <div className="voucher-form-group">
                                            <label className="voucher-form-label">
                                                Sản Phẩm <span className="voucher-required">*</span>
                                            </label>
                                            <select
                                                className={`voucher-form-input ${formErrors.productVariantDTO ? "voucher-form-error" : ""}`}
                                                name="productVariantDTO"
                                                value={newVoucher.productVariantDTO?.id || ""}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Chọn sản phẩm</option>
                                                {productVariants.map((prod) => (
                                                    <option key={prod.id} value={prod.id}>
                                                        {prod.productName || "Sản phẩm không xác định"} - {prod.variant} ({prod.attribute})
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.productVariantDTO && (
                                                <p className="voucher-form-error-text">{formErrors.productVariantDTO}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Phần Trăm Giảm */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Phần Trăm Giảm (%) <span className="voucher-required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="5"
                                            className={`voucher-form-input ${formErrors.discountPercentage ? "voucher-form-error" : ""}`}
                                            name="discountPercentage"
                                            value={newVoucher.discountPercentage}
                                            onChange={handleInputChange}
                                            placeholder="VD: 10"
                                            min="5"
                                            max="100"
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.discountPercentage && (
                                            <p className="voucher-form-error-text">{formErrors.discountPercentage}</p>
                                        )}
                                    </div>

                                    {/* Số Lượng */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Số Lượng <span className="voucher-required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="10"
                                            className={`voucher-form-input ${formErrors.quantity ? "voucher-form-error" : ""}`}
                                            name="quantity"
                                            value={newVoucher.quantity}
                                            onChange={handleInputChange}
                                            placeholder="VD: 100"
                                            min="10"
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.quantity && (
                                            <p className="voucher-form-error-text">{formErrors.quantity}</p>
                                        )}
                                    </div>

                                    {/* Ngày Bắt Đầu */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Ngày Bắt Đầu <span className="voucher-required">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`voucher-form-input ${formErrors.startDate ? "voucher-form-error" : ""}`}
                                            name="startDate"
                                            value={newVoucher.startDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split("T")[0]}
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.startDate && (
                                            <p className="voucher-form-error-text">{formErrors.startDate}</p>
                                        )}
                                    </div>

                                    {/* Ngày Kết Thúc */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Ngày Kết Thúc <span className="voucher-required">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`voucher-form-input ${formErrors.endDate ? "voucher-form-error" : ""}`}
                                            name="endDate"
                                            value={newVoucher.endDate}
                                            onChange={handleInputChange}
                                            min={newVoucher.startDate || new Date().toISOString().split("T")[0]}
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.endDate && (
                                            <p className="voucher-form-error-text">{formErrors.endDate}</p>
                                        )}
                                    </div>

                                    {/* Giá Trị Tối Thiểu */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Giá Trị Tối Thiểu (VNĐ) <span className="voucher-required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="20000"
                                            className={`voucher-form-input ${formErrors.minimumOrderValue ? "voucher-form-error" : ""}`}
                                            name="minimumOrderValue"
                                            value={newVoucher.minimumOrderValue}
                                            onChange={handleInputChange}
                                            placeholder="VD: 500000"
                                            min="0"
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.minimumOrderValue && (
                                            <p className="voucher-form-error-text">{formErrors.minimumOrderValue}</p>
                                        )}
                                    </div>

                                    {/* Số Tiền Giảm Tối Đa */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Giảm Tối Đa (VNĐ) <span className="voucher-required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="20000"
                                            className={`voucher-form-input ${formErrors.maximumDiscount ? "voucher-form-error" : ""}`}
                                            name="maximumDiscount"
                                            value={newVoucher.maximumDiscount}
                                            onChange={handleInputChange}
                                            placeholder="VD: 100000"
                                            min="20000"
                                            disabled={isSubmitting}
                                        />
                                        {formErrors.maximumDiscount && (
                                            <p className="voucher-form-error-text">{formErrors.maximumDiscount}</p>
                                        )}
                                    </div>

                                    {/* Trạng Thái */}
                                    <div className="voucher-form-group">
                                        <label className="voucher-form-label">
                                            Trạng Thái <span className="voucher-required">*</span>
                                        </label>
                                        <select
                                            className="voucher-form-input"
                                            name="isActive"
                                            value={newVoucher.isActive}
                                            onChange={handleInputChange}
                                            disabled={isSubmitting}
                                        >
                                            <option value="true">Hoạt động</option>
                                            <option value="false">Không hoạt động</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="voucher-modal-footer">
                                <button
                                    type="button"
                                    className="voucher-btn voucher-btn-secondary"
                                    onClick={resetForm}
                                    disabled={isSubmitting}
                                >
                                    Xóa Form
                                </button>
                                <div className="voucher-btn-group">
                                    <button
                                        type="button"
                                        className="voucher-btn voucher-btn-cancel"
                                        onClick={() => setShowModal(false)}
                                        disabled={isSubmitting}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className={`voucher-btn voucher-btn-primary ${isSubmitting ? "voucher-btn-loading" : ""}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="voucher-spinner-small"></span>
                                                Đang tạo...
                                            </>
                                        ) : (
                                            "Thêm"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageVoucher;