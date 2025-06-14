import React, { useEffect, useState, useRef } from 'react';

// Format date to dd/mm/yy
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

// Helper: true nếu voucher đã hết hạn (endDate < hôm nay)
function isVoucherExpired(voucher) {
    if (!voucher.endDate) return false;
    const end = new Date(voucher.endDate);
    end.setHours(23,59,59,999);
    return new Date() > end;
}

// Helper: true nếu voucher chưa tới ngày có hiệu lực (startDate > hôm nay)
function isVoucherNotStarted(voucher) {
    if (!voucher.startDate) return false;
    const start = new Date(voucher.startDate);
    const now = new Date();
    start.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return start > now;
}

const VoucherModal = ({
                          show,
                          onClose,
                          vouchers,
                          cartItems,
                          onApply,
                          loading,
                          error,
                          selectedCartItems = [], // Mảng sản phẩm được chọn (radio)
                      }) => {
    const [searchCode, setSearchCode] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [selectedVoucherId, setSelectedVoucherId] = useState(null);

    const contentRef = useRef(null);

    // Click outside to close modal
    useEffect(() => {
        if (!show) return;
        const handleClickOutside = (event) => {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [show, onClose]);

    // Hide body scroll when modal show
    useEffect(() => {
        if (show) {
            const original = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [show]);

    // Lọc voucher theo search và loại bỏ voucher hết hạn
    useEffect(() => {
        let result = (Array.isArray(vouchers) ? vouchers : []).filter(v => !isVoucherExpired(v));
        if (searchCode.trim() !== '') {
            result = result.filter((v) =>
                v.code.toLowerCase().includes(searchCode.trim().toLowerCase())
            );
        }
        if (searchType !== 'all') {
            result = result.filter(
                (v) =>
                    (searchType === 'category' && v.category) ||
                    (searchType === 'product' && v.productVariantDTO)
            );
        }
        setFilteredVouchers(result);
    }, [vouchers, searchCode, searchType]);

    // Chỉ xét đến sản phẩm đang được chọn (radio), truyền từ selectedCartItems
    const cartProductIds = selectedCartItems.map((item) => item.productId);
    const cartCategoryNames = selectedCartItems.map((item) => item.categoryName);
    const noSelected = !selectedCartItems || selectedCartItems.length === 0;

    // Disable: chưa tới ngày hiệu lực, không có sp phù hợp, voucher ko active hoặc chưa chọn sản phẩm
    const checkVoucherDisabled = (voucher) => {
        if (noSelected) return true;
        if (isVoucherNotStarted(voucher)) return true;
        if (!voucher.isActive) return true;
        if (voucher.category) {
            const catName = voucher.category.name;
            return !cartCategoryNames.includes(catName);
        }
        if (voucher.productVariantDTO) {
            const pid =
                voucher.productVariantDTO.id || voucher.productVariantDTO.productId;
            return !cartProductIds.includes(pid);
        }
        return false;
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleRadioChange = (vid) => {
        setSelectedVoucherId(vid);
    };

    const handleApply = () => {
        const selectedVoucher = filteredVouchers.find((v) => v.id === selectedVoucherId);
        if (selectedVoucher && !checkVoucherDisabled(selectedVoucher)) {
            onApply(selectedVoucher);
        }
    };

    if (!show) return null;

    return (
        <div className="voucher-modal-overlay">
            <div className="voucher-modal-content-arz" ref={contentRef}>
                <div className="voucher-modal-header-arz">
                    <span className="voucher-modal-title-arz">
                        <i className="fa fa-gift" style={{ marginRight: 10, color: '#ff3368' }}></i>
                        Chọn voucher của bạn
                    </span>
                    <button className="voucher-modal-close-arz" onClick={onClose}>
                        <i className="fa fa-times"></i>
                    </button>
                </div>
                <form className="voucher-modal-search-arz" onSubmit={handleSearch}>
                    <div className="voucher-modal-search-wrap-arz">
                        <input
                            type="text"
                            className="voucher-modal-search-input-arz"
                            placeholder="Nhập mã voucher hoặc tìm kiếm..."
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                        />
                        <select
                            className="voucher-modal-search-select-arz"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="all">Tất cả loại</option>
                            <option value="category">Theo danh mục</option>
                            <option value="product">Theo sản phẩm</option>
                        </select>
                        <button type="submit" className="voucher-modal-search-btn-arz">
                            <i className="fa fa-search"></i>
                            <span style={{ marginLeft: 6 }}>Tìm kiếm</span>
                        </button>
                    </div>
                </form>
                <div className="voucher-list-arz">
                    {loading ? (
                        <div className="voucher-loading-arz">
                            <div className="voucher-spinner-arz"></div>
                            <span style={{ marginLeft: 8 }}>Đang tải voucher...</span>
                        </div>
                    ) : error ? (
                        <div className="voucher-modal-error-arz">{error}</div>
                    ) : filteredVouchers.length === 0 ? (
                        <div className="voucher-empty-arz">
                            <img src="/img/void-coupon.svg" style={{ height: 70, marginBottom: 8 }} alt="empty" />
                            <div>Không có voucher phù hợp</div>
                        </div>
                    ) : (
                        filteredVouchers.map((v) => {
                            const isDisabled = checkVoucherDisabled(v);
                            return (
                                <label
                                    key={v.id}
                                    className={`voucher-row-arz${isDisabled ? ' voucher-disabled-arz' : ''} ${selectedVoucherId === v.id ? 'voucher-selected-arz' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="selectedVoucher"
                                        disabled={isDisabled}
                                        checked={selectedVoucherId === v.id}
                                        onChange={() => handleRadioChange(v.id)}
                                    />
                                    <div className="voucher-info-arz">
                                        <div className="voucher-code-header-arz">
                                            <span className="voucher-discount-visual-arz">
                                                <i className="fa fa-ticket" style={{ color: '#ff3368', marginRight: 3 }}></i>
                                                {v.discountPercentage}%
                                            </span>
                                            <span className="voucher-code-arz">
                                                <b>{v.code}</b>
                                            </span>
                                            <span className="voucher-type-arz">
                                                {v.productVariantDTO
                                                    ? <><i className="fa fa-box"></i> Sản phẩm</>
                                                    : v.category
                                                        ? <><i className="fa fa-list"></i> Danh mục</>
                                                        : <><i className="fa fa-store"></i> Toàn shop</>}
                                            </span>
                                            {isVoucherNotStarted(v) && (
                                                <span className="voucher-status-expired-arz" style={{ background: "#faf6e9", color: "#bfa437" }}>
                                                    <i className="fa fa-clock"></i> Chưa hiệu lực
                                                </span>
                                            )}
                                        </div>
                                        <div className="voucher-desc-arz">
                                            <span>
                                                <i className="fa fa-minus-circle" style={{ color: "#666", marginRight: 4 }} />
                                                Giảm tối đa <b>{Number(v.maximumDiscount).toLocaleString('vi-VN')}₫</b>
                                            </span>
                                            <span style={{ marginLeft: 15 }}>
                                                <i className="fa fa-shopping-bag" style={{ color: "#666", marginRight: 4 }} />
                                                Đơn tối thiểu <b>{Number(v.minimumOrderValue).toLocaleString('vi-VN')}₫</b>
                                            </span>
                                        </div>
                                        <div className="voucher-meta-arz">
                                            {v.category && (
                                                <span className="voucher-tag-arz">
                                                    <i className="fa fa-tags" style={{ marginRight: 3 }} /> {v.category.name}
                                                </span>
                                            )}
                                            {v.productVariantDTO && (
                                                <span className="voucher-tag-arz">
                                                    <i className="fa fa-barcode" style={{ marginRight: 3 }} />
                                                    {v.productVariantDTO.attribute} {v.productVariantDTO.variant}
                                                </span>
                                            )}
                                        </div>
                                        <div className="voucher-date-arz">
                                            <span>
                                                <i className="fa fa-calendar-check" style={{ marginRight: 4, color: '#a0a0a0' }} />
                                                {formatDate(v.startDate)}
                                            </span>
                                            <span style={{ margin: "0 5px" }}>-</span>
                                            <span>
                                                <i className="fa fa-calendar-times" style={{ marginRight: 4, color: '#a0a0a0' }} />
                                                {formatDate(v.endDate)}
                                            </span>
                                        </div>
                                    </div>
                                    {isDisabled && noSelected && (
                                        <div className="voucher-disabled-msg-arz">
                                            <i className="fa fa-info-circle"></i> Vui lòng chọn sản phẩm để áp dụng voucher
                                        </div>
                                    )}
                                    {isDisabled && !noSelected && !isVoucherNotStarted(v) && (
                                        <div className="voucher-disabled-msg-arz">
                                            <i className="fa fa-info-circle"></i> Không áp dụng với sản phẩm đang chọn
                                        </div>
                                    )}
                                    {isDisabled && isVoucherNotStarted(v) && (
                                        <div className="voucher-disabled-msg-arz" style={{ color: '#bfa437' }}>
                                            <i className="fa fa-info-circle"></i> Chưa tới ngày sử dụng
                                        </div>
                                    )}
                                </label>
                            );
                        })
                    )}
                </div>
                <div className="voucher-modal-footer-arz">
                    <button
                        className="voucher-modal-apply-btn-arz"
                        disabled={
                            !selectedVoucherId ||
                            checkVoucherDisabled(
                                filteredVouchers.find((v) => v.id === selectedVoucherId)
                            )
                        }
                        onClick={handleApply}
                    >
                        <i className="fa fa-check-circle" style={{ marginRight: 7 }}></i>
                        Áp dụng voucher
                    </button>
                </div>
            </div>
            <style>
                {`
                .voucher-modal-overlay {
                  position: fixed; z-index: 10000; left: 0; top: 0; width: 100vw; height: 100vh;
                  background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;
                }
                .voucher-modal-content-arz {
                  background: #fff; border-radius: 12px; padding: 0; width: 760px; max-width: 98vw; box-shadow: 0 4px 24px rgba(0,0,0,0.09);
                  display: flex; flex-direction: column; animation: fadeInUp 0.3s;
                }
                @keyframes fadeInUp {
                  0% { transform: translateY(60px); opacity: 0;}
                  100% { transform: translateY(0); opacity: 1;}
                }
                .voucher-modal-header-arz {
                  display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f6f6f6; padding: 16px 28px 11px 28px;
                  background: #fff;
                  border-top-left-radius: 12px;
                  border-top-right-radius: 12px;
                }
                .voucher-modal-title-arz {
                  font-size: 20px; font-weight: 600; color: #161d25; letter-spacing: 1px; display: flex; align-items: center;
                }
                .voucher-modal-close-arz {
                  background: none; border: none; font-size: 22px; color: #bdbdbd; cursor: pointer; line-height: 1; transition: color 0.2s;
                }
                .voucher-modal-close-arz:hover { color: #ff3368; }
                .voucher-modal-search-arz { border-bottom: 1px solid #f6f6f6; padding: 13px 28px 8px 28px; }
                .voucher-modal-search-wrap-arz {
                  display: flex; flex-direction: row; gap: 10px;
                }
                .voucher-modal-search-input-arz {
                  font-size: 15px; padding: 7px 10px; border-radius: 7px; border: 1px solid #e2e2e2; flex: 1;
                  background: #fbfbfb;
                  transition: border-color 0.2s;
                }
                .voucher-modal-search-input-arz:focus { border-color: #ff3368; outline: none; }
                .voucher-modal-search-select-arz {
                  font-size: 14px; padding: 7px 8px; border-radius: 7px; border: 1px solid #e2e2e2; background: #fbfbfb;
                }
                .voucher-modal-search-btn-arz {
                  display: flex; align-items: center; background: #ff3368; color: white;
                  border: none; border-radius: 7px; padding: 6px 16px; font-weight: 500; font-size: 15px; cursor: pointer;
                  transition: background 0.18s;
                }
                .voucher-modal-search-btn-arz:hover { background: #d62e5d;}
                .voucher-list-arz {
                  max-height: 350px; overflow-y: auto; padding: 12px 0 0 0;
                }
                .voucher-row-arz {
                  display: flex; align-items: flex-start; gap: 16px;
                  padding: 17px 24px; 
                  background: #fff; cursor: pointer; transition: background 0.14s, box-shadow 0.14s;
                  position: relative;
                  border: 1.5px dashed #e2e2e2;
                  border-radius: 8px;
                  margin: 16px 18px 0 18px;
                }
                .voucher-row-arz input[type="radio"] { margin-top: 7px; accent-color: #ff3368; scale: 1.18;}
                .voucher-row-arz:hover:not(.voucher-disabled-arz) { background: #fdf6fa; border-color: #ff3368; }
                .voucher-selected-arz { border-left: 4px solid #ff3368; background: #fff7fb; box-shadow: 0 2px 8px rgba(255,51,104,0.05);}
                .voucher-disabled-arz { color: #bbb; background: #fafafa; cursor: not-allowed; }
                .voucher-info-arz { flex: 1; font-size: 14px; }
                .voucher-code-header-arz {
                  display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
                }
                .voucher-code-arz { font-size: 16px; font-weight: 700; letter-spacing: 1px; color: #212121;}
                .voucher-discount-visual-arz {
                  font-size: 16px; font-weight: 600; color: #ff3368; background: #fff4fa;
                  border-radius: 8px; padding: 2px 10px 2px 8px; display: flex; align-items: center;
                }
                .voucher-type-arz {
                  background: #f5f7fa; color: #ff3368; font-weight: 500; border-radius: 5px; padding: 2px 10px;
                  font-size: 13px; margin-left: 8px; display: flex; align-items: center; gap: 4px;
                }
                .voucher-status-expired-arz {
                  background: #faf1f1; color: #e57a7a; font-weight: 600; border-radius: 5px; padding: 2px 9px;
                  font-size: 13px; margin-left: 9px; display: flex; align-items: center; gap: 4px;
                }
                .voucher-desc-arz {
                  color: #666; margin-bottom: 3px; font-size: 14px; display: flex; gap: 18px; align-items: center;
                }
                .voucher-meta-arz { font-size: 13px; color: #2d9cdb; margin-bottom: 3px; display: flex; gap: 15px;}
                .voucher-tag-arz {
                  background: #eef6fa;
                  color: #2d9cdb;
                  border-radius: 5px;
                  padding: 2px 8px;
                  margin-right: 6px;
                  font-size: 13px;
                  display: inline-flex;
                  align-items: center;
                }
                .voucher-date-arz {
                  font-size: 13px; color: #999; display: flex; align-items: center; gap: 0 7px;
                }
                .voucher-modal-footer-arz {
                  padding: 14px 28px 14px 28px; border-top: 1px solid #f6f6f6; text-align: right;
                  background: #fff;
                  border-bottom-left-radius: 12px;
                  border-bottom-right-radius: 12px;
                }
                .voucher-modal-apply-btn-arz {
                  background: #ff3368; color: white; border: none;
                  border-radius: 7px; padding: 10px 32px; font-size: 16px; font-weight: bold; cursor: pointer;
                  transition: background 0.17s;
                }
                .voucher-modal-apply-btn-arz:disabled {
                  background: #e4e4e4; color: #bbb; cursor: not-allowed;
                }
                .voucher-modal-error-arz {
                  color: #e57a7a; text-align: center; margin: 16px 0; font-weight: bold; font-size: 16px;
                }
                .voucher-loading-arz {
                  display: flex; align-items: center; justify-content: center; min-height: 110px; font-size: 16px;
                }
                .voucher-spinner-arz {
                  border: 4px solid #f3f3f3;
                  border-top: 4px solid #ff3368;
                  border-radius: 50%;
                  width: 28px;
                  height: 28px;
                  animation: spin 0.75s linear infinite;
                }
                @keyframes spin {
                  0% { transform: rotate(0); }
                  100% { transform: rotate(360deg);}
                }
                .voucher-empty-arz {
                  display: flex; flex-direction: column; align-items: center; color: #888; font-size: 16px; padding: 38px 0;
                }
                .voucher-disabled-msg-arz {
                  position: absolute; right: 24px; top: 19px; font-size: 12.5px; color: #ff3368;
                  background: #fff0f4; border-radius: 6px; padding: 2px 10px;
                  font-weight: 600; display: flex; align-items: center; gap: 4px;
                }
                @media (max-width: 600px) {
                  .voucher-modal-content-arz { width: 98vw; }
                  .voucher-modal-header-arz, .voucher-modal-search-arz, .voucher-modal-footer-arz { padding-left: 10px !important; padding-right: 10px !important; }
                  .voucher-row-arz { padding-left: 10px !important; padding-right: 10px !important; }
                }
                `}
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        </div>
    );
};

export default VoucherModal;