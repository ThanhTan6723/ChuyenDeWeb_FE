import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import DashboardContent from '../components/DashboardContent';
import Footer from '../components/layout/Footer';
import { useAuth } from '../../auth/authcontext';
import {useNavigate} from "react-router-dom";

export default function Dashboard() {
    const { user, isLoggedIn } = useAuth(); // Kiểm tra trạng thái login và quyền admin
    const navigate = useNavigate();
    useEffect(() => {
        // Nếu chưa login thì chuyển về login
        if (!isLoggedIn || !user) {
            navigate('/login');
            return;
        }
        // Nếu đã login nhưng không phải admin thì chuyển về trang home (hoặc trang lỗi)
        // Ưu tiên kiểm tra cả role và roleName
        const role = user.role;
        console.log('role: '+role)
        if (role !== 'ROLE_ADMIN' && role !== 'ADMIN') {
            navigate('/home');
            return;
        }
        // eslint-disable-next-line
    }, [isLoggedIn, user, navigate]);

    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Sidebar />
                <div className="layout-page">
                    <Navbar />
                    <div className="content-wrapper">
                        <DashboardContent />
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}