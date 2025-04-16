import React from 'react';
import Layout from '../components/layout/layout';
import BestSellers from '../components/home/bestsellers';
import Breadcrumb from '../components/shop/breadcrumb';
import CategoryProductArea from '../components/shop/categoryproductarea';

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
import '../../assets/css/productgrid.css';

const Home = () => {
    return (
        <Layout>
            <Breadcrumb title="Shop Category" path="Home - Shop Category" />
            <CategoryProductArea />
            <BestSellers />
        </Layout>
    );
};

export default Home;