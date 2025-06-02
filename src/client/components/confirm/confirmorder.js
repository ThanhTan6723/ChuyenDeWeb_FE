import React from "react";
import { useLocation } from "react-router-dom";

const Confirmation = () => {
    const location = useLocation();
    const { order, orderDateTime, selectedCartItems } = location.state || {};

    if (!order || !selectedCartItems) {
        return (
            <section className="confirmation_part padding_top" style={{ paddingTop: '80px' }}>
                <div className="container">
                    <div className="text-center">
                        <h2>Không tìm thấy thông tin đơn hàng</h2>
                        <p>Vui lòng quay lại trang đặt hàng và thử lại.</p>
                    </div>
                </div>
            </section>
        );
    }

    const calculateSubtotal = () => {
        return selectedCartItems.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );
    };

    return (
        <section className="confirmation_part padding_top" style={{ paddingTop: '80px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="confirmation_tittle">
                            <span>Cảm ơn bạn đã đặt hàng. Đơn hàng sẽ được xử lý, vui lòng theo dõi để biết thêm chi tiết</span>
                        </div>
                    </div>
                    <div className="col-lg-6 col-lx-4">
                        <div className="single_confirmation_details">
                            <h4>Thông tin đặt hàng</h4>
                            <ul>
                                <li>
                                    <p>Mã đơn hàng</p><span> {order.id}</span>
                                </li>
                                <li>
                                    <p>Ngày đặt</p><span> {new Date(orderDateTime).toLocaleString('vi-VN')}</span>
                                </li>
                                <li>
                                    <p>Tổng thanh toán</p><span> {order.totalMoney.toLocaleString('vi-VN')}₫</span>
                                </li>
                                <li>
                                    <p>Phương thức thanh toán</p><span> {order.paymentMethod}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6 col-lx-4">
                        <div className="single_confirmation_details">
                            <h4>Địa chỉ giao hàng</h4>
                            <ul>
                                <li>
                                    <p>Số nhà</p><span> {order.address.split(',')[0]}</span>
                                </li>
                                <li>
                                    <p>Phường/Xã</p><span> {order.address.split(',')[1]}</span>
                                </li>
                                <li>
                                    <p>Quận/Huyện</p><span> {order.address.split(',')[2]}</span>
                                </li>
                                <li>
                                    <p>Tỉnh/Thành phố</p><span> {order.address.split(',')[3]}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6 col-lx-4">
                        <div className="single_confirmation_details">
                            <h4>Thông tin bổ sung</h4>
                            <ul>
                                <li>
                                    <p>Ghi chú giao hàng</p><span> {order.orderNotes || 'Không có'}</span>
                                </li>
                                <li>
                                    <p>Trạng thái đơn hàng</p><span> {order.orderStatus}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-12">
                        <div className="order_details_iner">
                            <h3>Sản phẩm đã đặt</h3>
                            <table className="table table-borderless">
                                <thead>
                                <tr>
                                    <th scope="col" colSpan="2">Sản phẩm</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Tổng</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedCartItems.map((item) => (
                                    <tr key={item.productVariantId || item.id}>
                                        <th colSpan="2">
                                                <span>
                                                    {item.productName || item.name}
                                                    {item.variant && (
                                                        <small style={{ display: 'block', color: '#666' }}>
                                                            {item.attribute} - {item.variant}
                                                        </small>
                                                    )}
                                                </span>
                                        </th>
                                        <th>x{item.quantity}</th>
                                        <th><span>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span></th>
                                    </tr>
                                ))}
                                <tr>
                                    <th colSpan="3">Tạm tính</th>
                                    <th><span>{calculateSubtotal().toLocaleString('vi-VN')}₫</span></th>
                                </tr>
                                <tr>
                                    <th colSpan="3">Phí vận chuyển</th>
                                    <th><span>{order.ship.toLocaleString('vi-VN')}₫</span></th>
                                </tr>
                                </tbody>
                                <tfoot>
                                <tr>
                                    <th scope="col" colspan="3">Tổng tiền</th>
                                    <th scope="col" style={{color:'red'}}>{order.totalMoney.toLocaleString('vi-VN')}₫</th>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Confirmation;