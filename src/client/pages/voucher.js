import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../components/layout/layout';
import BestSellers from '../components/home/bestsellers';
import Breadcrumb from '../components/layout/breadcrumb';
import VoucherList from '../components/voucher/listvoucher';

// Import CSS
import '../../assets/css/bootstrap.min.css';
import '../../assets/css/animate.css';
import '../../assets/css/owl.carousel.min.css';
import '../../assets/css/all.css';
import '../../assets/css/flaticon.css';
import '../../assets/css/themify-icons.css';
import '../../assets/css/magnific-popup.css';
import '../../assets/css/slick.css';
import '../../assets/css/style.css';
import '../../assets/css/uvoucher.css';

const Voucher = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <Breadcrumb title="Voucher" subtitle="Voucher - Trang chủ" />
            <VoucherList />
        </Layout>
    );
};

export default Voucher;