import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './client/pages/home';
import Shop from './client/pages/shop';
import Login from './auth/login'
import Signup from './auth/signup'
import ForgotPassword from "./auth/forgotpassword";
import CartPage from "./client/pages/cart";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/shop" element={<Shop/>} />
                <Route path="/home" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/forgotpassword" element={<ForgotPassword/>} />
                <Route path="/cart" element={<CartPage />} />
            </Routes>
        </Router>
    );
}

export default App;
