import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- PERBAIKAN IMPORT PATH DI SINI ---
// Berdasarkan gambar folder Anda, file ini ada di folder 'ui'
import Layout from './components/ui/Layout'; 
import AuthPage from './components/ui/AuthPage'; 
import WaitingApprovalPage from './components/ui/WaitingApprovalPage'; 

// Halaman (Pages) sepertinya tetap di folder 'pages', jadi ini aman
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

// --- KOMPONEN PENGAMAN ---

// 1. ProtectedRoute: Hanya untuk user yang SUDAH LOGIN
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Jika user kosong -> Lempar ke Login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Jika user belum approved -> Lempar ke Halaman Tunggu
  if (!user.isApproved) {
     return <WaitingApprovalPage />;
  }

  // Jika butuh admin tapi bukan admin -> Balikin ke Dashboard Warga
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// 2. PublicRoute: Hanya untuk user yang BELUM LOGIN (Mencegah loop)
// Jika user iseng buka /auth padahal sudah login, lempar ke dashboard
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// --- APLIKASI UTAMA ---

export default function App() {
  return (
    <Routes>
      {/* Route Login (Pakai PublicRoute agar user login tidak bisa masuk sini) */}
      <Route 
        path="/auth" 
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } 
      />

      {/* Route Terproteksi */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* WARGA */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="financial-report" element={<FinancialReportPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="forum" element={<ForumPage />} />
        <Route path="forum/:id" element={<ThreadDetailPage />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="letters" element={<LettersPage />} />
        <Route path="directory" element={<DirectoryPage />} />
        <Route path="umkm" element={<UmkmPage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* ADMIN */}
        <Route path="admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="finance" element={<ProtectedRoute requireAdmin={true}><FinancePage /></ProtectedRoute>} />
        <Route path="admin/residents" element={<ProtectedRoute requireAdmin={true}><AdminManageResidentsPage /></ProtectedRoute>} />
        <Route path="admin/announcements" element={<ProtectedRoute requireAdmin={true}><AdminManageAnnouncementsPage /></ProtectedRoute>} />
        <Route path="admin/events" element={<ProtectedRoute requireAdmin={true}><AdminManageEventsPage /></ProtectedRoute>} />
        <Route path="admin/complaints" element={<ProtectedRoute requireAdmin={true}><AdminManageComplaintsPage /></ProtectedRoute>} />
        <Route path="admin/letters" element={<ProtectedRoute requireAdmin={true}><AdminManageLettersPage /></ProtectedRoute>} />
        <Route path="admin/umkm" element={<ProtectedRoute requireAdmin={true}><AdminManageUmkmPage /></ProtectedRoute>} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}