import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/layout/breadcrumb';
import ProductImage from '../components/shop-detail/productimage';
import ProductInfo from '../components/shop-detail/productinfor';
import Layout from '../components/layout/layout';

import '../../assets/css/style.css';
import '../../assets/css/product-info.css';

const ShopDetail = () => {
    const { productId } = useParams();
    const [selectedVariant, setSelectedVariant] = useState(null);

    return (
        <Layout>
            <Breadcrumb title="Chi tiết sản phẩm" subtitle="Trang chủ - Chi tiết sản phẩm" />
            <div className="product_image_area section_padding">
                <div className="container">
                    <div className="row s_product_inner justify-content-between">
                        <div className="col-lg-7 col-xl-7">
                            <ProductImage variant={selectedVariant} />
                        </div>
                        <div className="col-lg-5 col-xl-4">
                            <ProductInfo
                                productId={productId}
                                onVariantChange={setSelectedVariant}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ShopDetail;
