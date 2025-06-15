import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { toast } from "react-toastify";

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]); // State cho danh sách category
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        brand: "",
        category: "",
        variants: [{ attribute: "", variant: "", price: "", quantity: "", images: [] }],
    });
    const [formError, setFormError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";
    const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dp2jfvmlh/image/upload/";

    // Fetch danh sách brand và category
    useEffect(() => {
        const fetchBrandsAndCategories = async () => {
            try {
                const [brandsResponse, categoriesResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/admin/brands`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }),
                    fetch(`${API_BASE_URL}/api/admin/categories`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }),
                ]);

                if (!brandsResponse.ok) throw new Error(`HTTP ${brandsResponse.status} - Lỗi khi lấy brands`);
                if (!categoriesResponse.ok) throw new Error(`HTTP ${categoriesResponse.status} - Lỗi khi lấy categories`);

                const brandsData = await brandsResponse.json();
                const categoriesData = await categoriesResponse.json();
                setBrands(brandsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách brand hoặc category:", err);
                toast.error("Không thể tải danh sách thương hiệu hoặc danh mục.");
            }
        };

        fetchBrandsAndCategories();
    }, [API_BASE_URL]);

    // Fetch danh sách sản phẩm
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
                console.error("Lỗi khi lấy danh sách sản phẩm:", err);
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

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if (name.includes("variants")) {
            const updatedVariants = [...newProduct.variants];
            const field = name.split(".")[1];
            updatedVariants[index] = { ...updatedVariants[index], [field]: value };
            setNewProduct({ ...newProduct, variants: updatedVariants });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
    };

    const handleImageChange = (e, index) => {
        const files = Array.from(e.target.files);
        const updatedVariants = [...newProduct.variants];
        updatedVariants[index].images = files;
        setNewProduct({ ...newProduct, variants: updatedVariants });
    };

    const handleAddVariant = () => {
        setNewProduct({
            ...newProduct,
            variants: [...newProduct.variants, { attribute: "", variant: "", price: "", quantity: "", images: [] }],
        });
    };

    const handleRemoveVariant = (index) => {
        const updatedVariants = newProduct.variants.filter((_, i) => i !== index);
        setNewProduct({ ...newProduct, variants: updatedVariants });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("description", newProduct.description);
        formData.append("brand", newProduct.brand);
        formData.append("category", newProduct.category);

        newProduct.variants.forEach((variant, index) => {
            formData.append(`variants[${index}].attribute`, variant.attribute || "");
            formData.append(`variants[${index}].variant`, variant.variant || "");
            formData.append(`variants[${index}].price`, variant.price || "0");
            formData.append(`variants[${index}].quantity`, variant.quantity || "0");
            variant.images.forEach((image, imgIndex) => {
                formData.append(`variants[${index}].images`, image);
            });
        });

        // Debug: In ra FormData
        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const responseData = await response.json();
            console.log("POST response:", responseData); // Debug

            if (!response.ok) {
                throw new Error(responseData.error || `HTTP ${response.status}`);
            }

            toast.success("Thêm sản phẩm thành công!");
            setShowModal(false);
            setNewProduct({
                name: "",
                description: "",
                brand: "",
                category: "",
                variants: [{ attribute: "", variant: "", price: "", quantity: "", images: [] }],
            });

            const fetchResponse = await fetch(`${API_BASE_URL}/api/admin/products?page=${currentPage}&size=6`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (fetchResponse.ok) {
                const data = await fetchResponse.json();
                console.log("Products response:", data); // Debug
                setProducts(data.products);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            setFormError(`Lỗi khi thêm sản phẩm: ${err.message}`);
            toast.error(`Lỗi khi thêm sản phẩm: ${err.message}`);
        }
    };
    const variantRows = products.flatMap((product) =>
        product.variants && product.variants.length > 0
            ? product.variants.map((variant) => ({ product, variant }))
            : [{ product, variant: null }]
    );

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
                                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                                        Thêm sản phẩm
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
                                                    <th>ID Sản phẩm</th>
                                                    <th>Tên Sản phẩm</th>
                                                    <th>Mô tả</th>
                                                    <th>Thương hiệu</th>
                                                    <th>Danh mục</th>
                                                    <th>Thuộc tính</th>
                                                    <th>Định lượng</th>
                                                    <th>Giá</th>
                                                    <th>Tồn kho</th>
                                                    <th>Hình ảnh</th>
                                                    <th>Hành động</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {variantRows.length > 0 ? (
                                                    variantRows.map(({ product, variant }, index) => (
                                                        <tr
                                                            key={`${product.id}-${variant ? variant.id : "khong-co-bien-the"}-${index}`}
                                                        >
                                                            <td>{product.id}</td>
                                                            <td>{product.name}</td>
                                                            <td>{product.description || "Không có"}</td>
                                                            <td>{product.brand}</td>
                                                            <td>{product.category}</td>
                                                            <td>{variant ? variant.attribute : "Không có"}</td>
                                                            <td>{variant ? variant.variant : "Không có"}</td>
                                                            <td>
                                                                {variant
                                                                    ? variant.price.toLocaleString("vi-VN", {
                                                                        style: "currency",
                                                                        currency: "VND",
                                                                    })
                                                                    : "Không có"}
                                                            </td>
                                                            <td>{variant ? variant.quantity : "Không có"}</td>
                                                            <td>
                                                                {variant && variant.images && variant.images.length > 0 ? (
                                                                    <div className="d-flex flex-wrap">
                                                                        {variant.images.map((image, imgIndex) => (
                                                                            <img
                                                                                key={imgIndex}
                                                                                src={`${CLOUDINARY_BASE_URL}${image.publicId}.png`}
                                                                                alt={`${product.name} - ${variant ? variant.variant : "không có"}`}
                                                                                width="50"
                                                                                className="me-2 mb-2"
                                                                                title={image.isMain ? "Ảnh chính" : "Ảnh phụ"}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    "Không có hình ảnh"
                                                                )}
                                                            </td>
                                                            <td>
                                                                <button className="btn btn-sm btn-primary me-2">Sửa</button>
                                                                <button className="btn btn-sm btn-danger">Xóa</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="11" className="text-center">
                                                            Không có sản phẩm hoặc biến thể nào
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>
                                            <nav>
                                                <ul className="pagination justify-content-center mt-3">
                                                    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                                                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                                            Trước
                                                        </button>
                                                    </li>
                                                    {[...Array(totalPages).keys()].map((page) => (
                                                        <li
                                                            key={page}
                                                            className={`page-item ${currentPage === page ? "active" : ""}`}
                                                        >
                                                            <button className="page-link" onClick={() => handlePageChange(page)}>
                                                                {page + 1}
                                                            </button>
                                                        </li>
                                                    ))}
                                                    <li
                                                        className={`page-item ${
                                                            currentPage === totalPages - 1 ? "disabled" : ""
                                                        }`}
                                                    >
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

            {/* Modal thêm sản phẩm */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded-lg shadow-xl">
                            <div className="modal-header bg-gray-100 border-b border-gray-200">
                                <h5 className="modal-title text-xl font-semibold text-gray-800">Thêm sản phẩm mới</h5>
                                <button
                                    className="btn-close hover:bg-gray-200 rounded-full p-2 transition-colors"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body p-6">
                                    {formError && (
                                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{formError}</div>
                                    )}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Tên sản phẩm
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="name"
                                                value={newProduct.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Mô tả
                                            </label>
                                            <textarea
                                                className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="description"
                                                value={newProduct.description}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Thương hiệu
                                            </label>
                                            <select
                                                className="form-select w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="brand"
                                                value={newProduct.brand}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Chọn thương hiệu</option>
                                                {brands.map((brand) => (
                                                    <option key={brand.id} value={brand.name}>
                                                        {brand.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                Danh mục
                                            </label>
                                            <select
                                                className="form-select w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                name="category"
                                                value={newProduct.category}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <h6 className="text-lg font-medium text-gray-800 mb-3">Biến thể</h6>
                                            {newProduct.variants.map((variant, index) => (
                                                <div key={index} className="border p-4 mb-3 rounded-md">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                                Thuộc tính
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control w-full p-2 border border-gray-300 rounded-md"
                                                                name={`variants[${index}].attribute`}
                                                                value={variant.attribute}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                                Định lượng
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control w-full p-2 border border-gray-300 rounded-md"
                                                                name={`variants[${index}].variant`}
                                                                value={variant.variant}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                                Giá
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control w-full p-2 border border-gray-300 rounded-md"
                                                                name={`variants[${index}].price`}
                                                                value={variant.price}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                required
                                                                min="0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                                Số lượng tồn kho
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control w-full p-2 border border-gray-300 rounded-md"
                                                                name={`variants[${index}].quantity`}
                                                                value={variant.quantity}
                                                                onChange={(e) => handleInputChange(e, index)}
                                                                required
                                                                min="0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                                                Hình ảnh
                                                            </label>
                                                            <input
                                                                type="file"
                                                                className="form-control w-full p-2 border border-gray-300 rounded-md"
                                                                multiple
                                                                onChange={(e) => handleImageChange(e, index)}
                                                                accept="image/*"
                                                            />
                                                        </div>
                                                        {newProduct.variants.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger mt-2"
                                                                onClick={() => handleRemoveVariant(index)}
                                                            >
                                                                Xóa biến thể
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-secondary mt-2"
                                                onClick={handleAddVariant}
                                            >
                                                Thêm biến thể
                                            </button>
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

export default ManageProduct;