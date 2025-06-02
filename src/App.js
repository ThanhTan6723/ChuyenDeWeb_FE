import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './auth/authcontext';
import Home from './client/pages/home';
import Shop from './client/pages/shop';
import ShopDetail from './client/pages/shop-detail';
import Login from './auth/login';
import Signup from './auth/signup';
import ForgotPassword from './auth/forgotpassword';
import CartPage from './client/pages/cart';
import ResetPassword from './auth/resetpassword';
import AccountInfo from "./auth/accountinfor";
import {CartProvider} from "./client/contexts/cartcontext";
import OrderPage from "./client/pages/order";

import Dashboard from './admin/pages/Dashboard';
import ManageUser from './admin/pages/ManageUser';
import ManageProduct from './admin/pages/ManageProduct';
import ManageCart from './admin/pages/ManageCart';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/shop" element={<Shop/>}/>
                        <Route path="/shop-detail/:productId" element={<ShopDetail/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route path="/cart" element={<CartPage/>}/>
                        <Route path="/order" element={<OrderPage/>}/>
                        <Route path="/update-profile" element={<AccountInfo/>}/>
                        <Route path="/admin" element={<Dashboard/>}/>
                        <Route path="/admin/pages/manage-user" element={<ManageUser/>}/>
                        <Route path="/admin/pages/manage-product" element={<ManageProduct/>}/>
                        <Route path="/admin/pages/manage-cart" element={<ManageCart/>}/>
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;