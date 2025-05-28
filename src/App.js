import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './auth/authcontext';
import {CartProvider} from './client/contexts/cartcontext';
import Home from './client/pages/home';
import Shop from './client/pages/shop';
import ShopDetail from './client/pages/shop-detail';
import Login from './auth/login';
import Signup from './auth/signup';
import ForgotPassword from './auth/forgotpassword';
import CartPage from './client/pages/cart';
import ResetPassword from './auth/ResetPassword';
import AccountInfo from "./auth/accountinfor";

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
                        <Route path="/update-profile" element={<AccountInfo/>}/>
                        <Route path="/cart" element={<CartPage/>}/>
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;