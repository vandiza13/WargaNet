import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, onNavigate, currentPage }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { userInfo, logout } = useAuth();

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar 
                onNavigate={onNavigate} 
                currentPage={currentPage} 
                isSidebarOpen={isSidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
                onLogout={logout} 
                isAdmin={userInfo?.role === 'admin'} 
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} userData={userInfo} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
