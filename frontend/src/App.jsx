import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import AuthPage from './components/AuthPage';
import WaitingApprovalPage from './components/WaitingApprovalPage';

// Halaman Warga
import DashboardPage from './pages/DashboardPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ProfilePage from './pages/ProfilePage';
import ActivitiesPage from './pages/ActivitiesPage';
import LettersPage from './pages/LettersPage';
import DirectoryPage from './pages/DirectoryPage';
import ForumPage from './pages/ForumPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import UmkmPage from './pages/UmkmPage';
import FinancialReportPage from './pages/FinancialReportPage';

// Halaman Admin
import FinancePage from './pages/FinancePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminManageResidentsPage from './pages/AdminManageResidentsPage';
import AdminManageAnnouncementsPage from './pages/AdminManageAnnouncementsPage';
import AdminManageEventsPage from './pages/AdminManageEventsPage';
import AdminManageComplaintsPage from './pages/AdminManageComplaintsPage';
import AdminManageLettersPage from './pages/AdminManageLettersPage';
import AdminManageUmkmPage from './pages/AdminManageUmkmPage';

export default function App() {
    const { userInfo, loading, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [pageParams, setPageParams] = useState({});

    const navigate = useCallback((page) => {
        window.location.hash = page;
    }, []);
    
    useEffect(() => {
        if (!loading && userInfo) {
            const hash = window.location.hash.substring(1);
            if (!hash || hash === 'login' || hash === 'register') {
                navigate('dashboard');
            }
        }
    }, [userInfo, loading, navigate]);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1) || (userInfo ? 'dashboard' : 'login');
            const [page, paramString] = hash.split('?');
            
            const pageName = page.split('/')[0];
            const pageId = page.split('/')[1];

            setCurrentPage(pageName);
            
            let params = {};
            if (paramString) {
                params = Object.fromEntries(new URLSearchParams(paramString));
            }
            if (pageId) {
                params.id = pageId;
            }
            setPageParams(params);
        };
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [userInfo]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (!userInfo) {
        return <AuthPage isLogin={currentPage !== 'register'} />;
    }

    if (!userInfo.isApproved) {
        return <WaitingApprovalPage onLogout={logout} />;
    }

    const renderPage = () => {
        if (userInfo.role !== 'admin' && (currentPage.startsWith('admin-') || currentPage === 'finance')) {
            return <DashboardPage onNavigate={navigate} />;
        }
        
        switch (currentPage) {
            // Rute Warga
            case 'dashboard': return <DashboardPage onNavigate={navigate} />;
            case 'announcements': return <AnnouncementsPage />;
            case 'financial-report': return <FinancialReportPage />;
            case 'activities': return <ActivitiesPage onNavigate={navigate} />;
            case 'forum': 
                if (pageParams.id) {
                    return <ThreadDetailPage threadId={pageParams.id} onNavigate={navigate} />;
                }
                return <ForumPage onNavigate={navigate} />;
            case 'complaints': return <ComplaintsPage params={pageParams} />;
            case 'letters': return <LettersPage />;
            case 'directory': return <DirectoryPage />;
            case 'umkm': return <UmkmPage />;
            case 'profile': return <ProfilePage />;

            // Rute Admin
            case 'finance': return <FinancePage />;
            case 'admin-dashboard': return <AdminDashboardPage onNavigate={navigate} />;
            case 'admin-manage-residents': return <AdminManageResidentsPage />;
            case 'admin-manage-announcements': return <AdminManageAnnouncementsPage />;
            case 'admin-manage-events': return <AdminManageEventsPage />;
            case 'admin-manage-complaints': return <AdminManageComplaintsPage />;
            case 'admin-manage-letters': return <AdminManageLettersPage />;
            case 'admin-manage-umkm': return <AdminManageUmkmPage />;
            
            default: return <DashboardPage onNavigate={navigate} />;
        }
    };

    return (
        <Layout onNavigate={navigate} currentPage={currentPage}>
            {renderPage()}
        </Layout>
    );
}

