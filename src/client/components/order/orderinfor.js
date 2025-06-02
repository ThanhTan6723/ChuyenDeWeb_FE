import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../auth/authcontext";

const ORDER_API_URL = `${process.env.REACT_APP_API_BASE_URL || 'https://localhost:8443'}/api/orders`;
const GHTK_API_URL = 'https://services.giaohangtietkiem.vn/services/shipment/fee';
const GHTK_TOKEN = 'ee42b44d5c4e4824e2f7d0d1cc74af58d328ccee';

const SHOP_INFO = {
    pick_province: 'Hồ Chí Minh',
    pick_district: 'Thủ Đức',
    pick_ward: 'Phường Linh Trung',
    pick_street: 'Khu phố 6'
};

const OrderInfo = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCartItems = location.state?.selectedCartItems || [];
    const currentDateTime = "2025-06-01 17:48:58";
    const currentUser = "ThanhTan6723";

    // State Management
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [shippingFee, setShippingFee] = useState(0);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [formData, setFormData] = useState({
        name: "",
        number: "",
        address: "",
        message: "",
    });
    const [errors, setErrors] = useState({});

    // Calculate total weight
    const calculateTotalWeight = () => {
        return selectedCartItems.reduce((total, item) => {
            const match = item.variant.match(/(\d+)\s*(ml|g|kg|mg)/i);
            if (match) {
                const [, value, unit] = match;
                const numValue = parseFloat(value);
                switch(unit.toLowerCase()) {
                    case 'kg': return total + numValue * item.quantity;
                    case 'g': return total + (numValue/1000) * item.quantity;
                    case 'mg': return total + (numValue/1000000) * item.quantity;
                    case 'ml': return total + (numValue/1000) * item.quantity;
                    default: return total;
                }
            }
            return total;
        }, 0);
    };

    // Calculate subtotal
    const calculateSubtotal = () => {
        return selectedCartItems.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );
    };

    // Fetch provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://provinces.open-api.vn/api/p/");
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
                setErrors(prev => ({...prev, api: "Không thể tải danh sách tỉnh/thành phố"}));
            }
        };
        fetchProvinces();
    }, []);

    // Fetch districts
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                try {
                    const response = await axios.get(
                        `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
                    );
                    setDistricts(response.data.districts);
                    setWards([]);
                    setSelectedDistrict("");
                    setSelectedWard("");
                } catch (error) {
                    console.error("Error fetching districts:", error);
                    setErrors(prev => ({...prev, api: "Không thể tải danh sách quận/huyện"}));
                }
            };
            fetchDistricts();
        }
    }, [selectedProvince]);

    // Fetch wards
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                try {
                    const response = await axios.get(
                        `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
                    );
                    setWards(response.data.wards);
                    setSelectedWard("");
                } catch (error) {
                    console.error("Error fetching wards:", error);
                    setErrors(prev => ({...prev, api: "Không thể tải danh sách phường/xã"}));
                }
            };
            fetchWards();
        }
    }, [selectedDistrict]);

    // Calculate shipping fee when address changes
    useEffect(() => {
        const calculateShipping = async () => {
            if (selectedProvince && selectedDistrict && selectedWard && formData.address) {
                setIsCalculatingShipping(true);
                try {
                    const provinceName = provinces.find(p => p.code === parseInt(selectedProvince))?.name;
                    const districtName = districts.find(d => d.code === parseInt(selectedDistrict))?.name;
                    const wardName = wards.find(w => w.code === parseInt(selectedWard))?.name;

                    if (provinceName && districtName && wardName) {
                        const response = await axios.post(
                            `${process.env.REACT_APP_API_BASE_URL || 'https://localhost:8443'}/api/shipping/fee`,
                            {
                                city: provinceName,
                                district: districtName,
                                ward: wardName,
                                address: formData.address,
                                weight: calculateTotalWeight(),
                                value: calculateSubtotal()
                            },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    credentials: 'include'
                                }
                            }
                        );

                        setShippingFee(response.data);
                    }
                } catch (error) {
                    console.error('Error calculating shipping:', error);
                    setErrors(prev => ({
                        ...prev,
                        shipping: 'Không thể tính phí vận chuyển. Vui lòng thử lại sau.'
                    }));
                } finally {
                    setIsCalculatingShipping(false);
                }
            }
        };

        calculateShipping();
    }, [selectedProvince, selectedDistrict, selectedWard, formData.address]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Vui lòng nhập tên người nhận";
        if (!formData.number) newErrors.number = "Vui lòng nhập số điện thoại";
        if (!/^[0-9]{10}$/.test(formData.number)) {
            newErrors.number = "Số điện thoại phải có 10 chữ số";
        }
        if (!selectedProvince) newErrors.province = "Vui lòng chọn tỉnh/thành phố";
        if (!selectedDistrict) newErrors.district = "Vui lòng chọn quận/huyện";
        if (!selectedWard) newErrors.ward = "Vui lòng chọn phường/xã";
        if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ nhà";
        if (!paymentMethod) newErrors.payment = "Vui lòng chọn phương thức thanh toán";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const orderData = {
                recipientName: formData.name,
                phoneNumber: formData.number,
                address: {
                    province: provinces.find(p => p.code === parseInt(selectedProvince))?.name,
                    district: districts.find(d => d.code === parseInt(selectedDistrict))?.name,
                    ward: wards.find(w => w.code === parseInt(selectedWard))?.name,
                    street: formData.address
                },
                orderDateTime: currentDateTime,
                userId: currentUser,
                note: formData.message,
                paymentMethod,
                items: selectedCartItems,
                totalWeight: calculateTotalWeight(),
                subtotal: calculateSubtotal(),
                shippingFee,
                total: calculateSubtotal() + shippingFee
            };

            const response = await axios.post(ORDER_API_URL, orderData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            navigate('/order-success', {
                state: {
                    order: response.data,
                    orderDateTime: currentDateTime
                }
            });
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login', { state: { from: '/checkout' } });
            } else {
                setErrors(prev => ({
                    ...prev,
                    submit: 'Đặt hàng thất bại. Vui lòng thử lại.'
                }));
            }
        }
    };

    if (!user) {
        return (
            <section className="checkout_area padding_top" style={{ paddingTop: "80px" }}>
                <div className="container">
                    <div className="text-center">
                        <h2>Vui lòng đăng nhập</h2>
                        <p>Bạn cần đăng nhập để đặt hàng</p>
                        <Link to="/login" state={{ from: '/checkout' }} className="btn_1">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    if (selectedCartItems.length === 0) {
        return (
            <section className="checkout_area padding_top" style={{ paddingTop: "80px" }}>
                <div className="container">
                    <div className="text-center">
                        <h2>Không có sản phẩm nào được chọn</h2>
                        <p>Vui lòng quay lại giỏ hàng và chọn sản phẩm để đặt hàng.</p>
                        <Link to="/cart" className="btn_1">
                            Quay lại giỏ hàng
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="checkout_area padding_top" style={{ paddingTop: "80px" }}>
            <div className="container">
                <div className="billing_details">
                    <div className="row">
                        <div className="col-lg-7">
                            <h3>Thông tin đặt hàng</h3>
                            <form className="row contact_form" onSubmit={handleSubmit} noValidate>
                                <div className="col-md-6 form-group p_star">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Tên người nhận"
                                    />
                                    {errors.name && <span className="error">{errors.name}</span>}
                                </div>
                                <div className="col-md-6 form-group p_star">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="number"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleInputChange}
                                        placeholder="Số điện thoại"
                                    />
                                    {errors.number && <span className="error">{errors.number}</span>}
                                </div>
                                <div className="col-md-12 form-group p_star">
                                    <select
                                        className="form-control country_select"
                                        value={selectedProvince}
                                        onChange={(e) => setSelectedProvince(e.target.value)}
                                    >
                                        <option value="">Chọn tỉnh/thành phố</option>
                                        {provinces.map((province) => (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.province && <span className="error">{errors.province}</span>}
                                </div>
                                <div className="col-md-12 form-group p_star">
                                    <select
                                        className="form-control country_select"
                                        value={selectedDistrict}
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                        disabled={!selectedProvince}
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.map((district) => (
                                            <option key={district.code} value={district.code}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district && <span className="error">{errors.district}</span>}
                                </div>
                                <div className="col-md-12 form-group p_star">
                                    <select
                                        className="form-control country_select"
                                        value={selectedWard}
                                        onChange={(e) => setSelectedWard(e.target.value)}
                                        disabled={!selectedDistrict}
                                    >
                                        <option value="">Chọn phường/xã</option>
                                        {wards.map((ward) => (
                                            <option key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.ward && <span className="error">{errors.ward}</span>}
                                </div>
                                <div className="col-md-12 form-group p_star">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Địa chỉ nhà"
                                    />
                                    {errors.address && <span className="error">{errors.address}</span>}
                                </div>
                                <div className="col-md-12 form-group">
                                    <h3>Ghi chú cho đơn hàng</h3>
                                    <textarea
                                        className="form-control"
                                        name="message"
                                        id="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Ghi chú (nếu có)"
                                    />
                                </div>
                            </form>
                        </div>


                        <div className="col-lg-5">
                            <div className="order_box">
                                <h2>Đơn hàng của bạn</h2>
                                <ul className="list">
                                    <li>
                                        <a href="#">
                                            Sản phẩm<span>Tổng</span>
                                        </a>
                                    </li>
                                    {selectedCartItems.map((item) => (
                                        <li key={item.productVariantId || item.id}>
                                            <a href="#">
                                                {item.productName || item.name}
                                                {item.variant && (
                                                    <small style={{ display: 'block', color: '#666' }}>
                                                        {item.variant}
                                                    </small>
                                                )}
                                                <span className="middle">x {item.quantity}</span>
                                                <span className="last">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="list list_2">
                                    <li>
                                        <a href="#">
                                            Tổng khối lượng
                                            <span>{calculateTotalWeight().toFixed(3)} kg</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            Tạm tính
                                            <span>{calculateSubtotal().toLocaleString('vi-VN')}₫</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            Phí vận chuyển
                                            <span>
                                                {isCalculatingShipping ?
                                                    'Đang tính...' :
                                                    shippingFee > 0 ?
                                                        `${shippingFee.toLocaleString('vi-VN')}₫` :
                                                        'Vui lòng nhập đầy đủ địa chỉ'
                                                }
                                            </span>
                                        </a>
                                        {errors.shipping && (
                                            <span className="error-message text-danger">
                                                {errors.shipping}
                                            </span>
                                        )}
                                    </li>
                                    <li>
                                        <a href="#">
                                            <strong>Tổng tiền</strong>
                                            <span className="total-amount">
                                                {(calculateSubtotal() + shippingFee).toLocaleString('vi-VN')}₫
                                            </span>
                                        </a>
                                    </li>
                                </ul>

                                <div className="payment_item">
                                    <div className="radion_btn">
                                        <input
                                            type="radio"
                                            id="cod"
                                            name="payment"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                                        <div className="check"></div>
                                    </div>
                                    <div className="radion_btn">
                                        <input
                                            type="radio"
                                            id="vnpay"
                                            name="payment"
                                            value="VNPAY"
                                            checked={paymentMethod === 'VNPAY'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <label htmlFor="vnpay">VN Pay</label>
                                        <div className="check"></div>
                                    </div>
                                </div>

                                <button
                                    className="btn_3"
                                    onClick={handleSubmit}
                                    disabled={isCalculatingShipping}
                                    style={{
                                        width: '100%',
                                        marginTop: '20px',
                                        opacity: isCalculatingShipping ? 0.7 : 1
                                    }}
                                >
                                    {isCalculatingShipping ? 'Đang xử lý...' : 'Thanh toán'}
                                </button>

                                {errors.submit && (
                                    <div className="error-message text-danger mt-3">
                                        {errors.submit}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderInfo;