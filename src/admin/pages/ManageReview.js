import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/authcontext";
import { useNavigate } from "react-router-dom";

const ManageReview = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [formError, setFormError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://localhost:8443";
    const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dp2jfvmlh/image/upload/';

    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn || !user) {
            navigate('/login');
            return;
        }
        const role = user.role;
        if (role !== 'ROLE_ADMIN' && role !== 'ADMIN') {
            navigate('/home');
            return;
        }
        // eslint-disable-next-line
    }, [isLoggedIn, user, navigate]);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/review/admin`, {
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
                setReviews(data);
                setError(null);
            } catch (err) {
                console.error("Lỗi khi fetch reviews:", err);
                setError("Không thể tải danh sách review. " + err.message);
                toast.error("Lỗi tải danh sách review.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [API_BASE_URL]);

    const handleAcceptReview = async (reviewId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/review/${reviewId}/accept`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const updatedReview = await response.json();
            setReviews(reviews.map(review =>
                review.id === reviewId ? updatedReview : review
            ));
            toast.success("Chấp nhận review thành công!");
        } catch (err) {
            console.error("Lỗi khi chấp nhận review:", err);
            toast.error("Lỗi khi chấp nhận review: " + err.message);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        if (!replyText.trim()) {
            setFormError("Vui lòng nhập nội dung trả lời.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/review/${selectedReviewId}/reply`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(replyText),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const updatedReview = await response.json();
            setReviews(reviews.map(review =>
                review.id === selectedReviewId ? updatedReview : review
            ));
            toast.success("Trả lời review thành công!");
            setShowReplyModal(false);
            setReplyText("");
            setSelectedReviewId(null);
        } catch (err) {
            console.error("Lỗi khi trả lời review:", err);
            setFormError("Lỗi khi trả lời review: " + err.message);
            toast.error("Lỗi khi trả lời review: " + err.message);
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
                            <h4 className="fw-bold py-3 mb-4">Quản lý Review</h4>
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Danh sách Review</h5>
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
                                                    <th>Tên người bình luận</th>
                                                    <th>SĐT</th>
                                                    <th>Sản phẩm ID</th>
                                                    <th>Điểm</th>
                                                    <th>Bình luận</th>
                                                    <th>Trả lời</th>
                                                    <th>Ngày tạo</th>
                                                    <th>Ngày trả lời</th>
                                                    <th>Trạng thái</th>
                                                    <th>Hình ảnh</th>
                                                    <th>Hành động</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {reviews.length > 0 ? (
                                                    reviews.map((review) => (
                                                        <tr key={review.id}>
                                                            <td>{review.id}</td>
                                                            <td>{review.commenterName}</td>
                                                            <td>{review.phonenumberCommenter}</td>
                                                            <td>{review.productId}</td>
                                                            <td>{review.rating}</td>
                                                            <td>{review.comment}</td>
                                                            <td>{review.response || 'Chưa trả lời'}</td>
                                                            <td>
                                                                {review.dateCreated
                                                                    ? new Date(review.dateCreated).toLocaleString("vi-VN")
                                                                    : 'N/A'}
                                                            </td>
                                                            <td>
                                                                {review.dateReply
                                                                    ? new Date(review.dateReply).toLocaleString("vi-VN")
                                                                    : 'N/A'}
                                                            </td>
                                                            <td>{review.isAccept ? 'Đã chấp nhận' : 'Chưa chấp nhận'}</td>
                                                            <td>
                                                                {review.imageIds && review.imageIds.length > 0 ? (
                                                                    review.imageIds.map((imgId, index) => (
                                                                        <img
                                                                            key={index}
                                                                            src={`${CLOUDINARY_BASE_URL}/${imgId}.png`}
                                                                            alt="Review"
                                                                            style={{ width: '50px', height: '50px', marginRight: '5px' }}
                                                                        />
                                                                    ))
                                                                ) : 'Không có'}
                                                            </td>
                                                            <td>
                                                                {!review.isAccept && (
                                                                    <button
                                                                        className="btn btn-sm btn-success me-2"
                                                                        onClick={() => handleAcceptReview(review.id)}
                                                                    >
                                                                        Chấp nhận
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => {
                                                                        setSelectedReviewId(review.id);
                                                                        setReplyText(review.response || "");
                                                                        setShowReplyModal(true);
                                                                    }}
                                                                >
                                                                    Trả lời
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="12" className="text-center">
                                                            Không có review nào
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

            {/* Modal trả lời review */}
            {showReplyModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-lg shadow-xl">
                            <div className="modal-header bg-gray-100 border-b border-gray-200">
                                <h5 className="modal-title text-xl font-semibold text-gray-800">Trả lời Review</h5>
                                <button
                                    className="btn-close hover:bg-gray-200 rounded-full p-2 transition-colors"
                                    onClick={() => {
                                        setShowReplyModal(false);
                                        setReplyText("");
                                        setSelectedReviewId(null);
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleReplySubmit}>
                                <div className="modal-body p-6">
                                    {formError && (
                                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                            {formError}
                                        </div>
                                    )}
                                    <div>
                                        <label className="form-label block text-sm font-medium text-gray-700 mb-1">
                                            Nội dung trả lời
                                        </label>
                                        <textarea
                                            className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows="4"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer bg-gray-100 border-t border-gray-200 flex justify-end space-x-2 p-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                        onClick={() => {
                                            setShowReplyModal(false);
                                            setReplyText("");
                                            setSelectedReviewId(null);
                                        }}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Gửi
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

export default ManageReview;