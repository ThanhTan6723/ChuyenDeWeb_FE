import React from 'react';
import Layout from '../components/layout/layout';
import Breadcrumb from '../components/cart/breadcrumb';
import CartTable from "../components/cart/carttable";

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

const CartPage = () => {
    return (
        <Layout>
            <Breadcrumb title="Cart Products" subtitle="Cart Products"/>
            <CartTable/>
        </Layout>
    );
};

export default CartPage;