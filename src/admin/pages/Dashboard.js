import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import DashboardContent from '../components/DashboardContent';
import Footer from '../components/layout/Footer';

export default function Dashboard() {
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