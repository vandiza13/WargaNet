import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onNavigate, currentPage, isSidebarOpen, setSidebarOpen, onLogout, isAdmin }) => {
    const { userInfo } = useAuth();
    const API_URL = 'http://localhost:4000';
    
    // Menu untuk semua pengguna (Menu "Keuangan" telah dihapus dari sini)
    const navigationItems = [
        { title: "Dashboard", url: "dashboard", icon: "Home" },
        { title: "Pengumuman", url: "announcements", icon: "Megaphone" },
        { title: "Kegiatan", url: "activities", icon: "Calendar" },
        { title: "Forum", url: "forum", icon: "MessageSquare" },
        { title: "Keluhan", url: "complaints", icon: "AlertTriangle" },
        { title: "Layanan Surat", url: "letters", icon: "FileText" },
        { title: "Laporan Keuangan", url: "financial-report", icon: "BookCopy" },
        { title: "Direktori UMKM", url: "umkm", icon: "Store" },
        { title: "Warga", url: "directory", icon: "Users" },
    ];
    
    // Menu khusus untuk admin
    const adminNavigationItems = [
        { title: "Admin Dashboard", url: "admin-dashboard", icon: "BarChart3" },
        { title: "Kelola Warga", url: "admin-manage-residents", icon: "Users" },
        { title: "Kelola Pengumuman", url: "admin-manage-announcements", icon: "Megaphone" },
        { title: "Kelola Kegiatan", url: "admin-manage-events", icon: "Calendar" },
        { title: "Kelola Keluhan", url: "admin-manage-complaints", icon: "AlertTriangle" },
        { title: "Kelola Surat", url: "admin-manage-letters", icon: "FileText" },
        { title: "Kelola Keuangan", url: "finance", icon: "Wallet" }, // Tetap ada di sini
        { title: "Kelola UMKM", url: "admin-manage-umkm", icon: "Store" },
    ];


    const handleNavigation = (page) => {
        onNavigate(page);
        if (window.innerWidth < 1024) { // lg breakpoint
            setSidebarOpen(false);
        }
    };
    
    const isAdminPage = currentPage.startsWith('admin-') || currentPage === 'finance';

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <aside className={`fixed lg:relative inset-y-0 left-0 bg-sidebar w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col shadow-lg lg:shadow-none`}>
                <div className="flex items-center gap-3 p-4 h-20 border-b border-gray-200">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Icon name="Home" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">WargaNet</h2>
                        <p className="text-xs text-gray-500">Komunitas Digital</p>
                    </div>
                    {isAdmin && <span className="ml-auto bg-accent-red text-accent-red-dark text-xs font-semibold px-2 py-1 rounded-md">Admin</span>}
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {(isAdmin && isAdminPage ? adminNavigationItems : navigationItems).map((item) => (
                        <a
                            key={item.title}
                            href={`#${item.url}`}
                            onClick={(e) => { e.preventDefault(); handleNavigation(item.url); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                currentPage === item.url
                                ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        >
                            <Icon name={item.icon} className="w-5 h-5" />
                            <span>{item.title}</span>
                        </a>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                     {isAdmin && (
                        <a
                            href={isAdminPage ? "#dashboard" : "#admin-dashboard"}
                            onClick={(e) => { e.preventDefault(); handleNavigation(isAdminPage ? 'dashboard' : 'admin-dashboard'); }}
                            className="flex items-center gap-3 p-2 mb-2 w-full rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                        >
                            <Shield className="w-5 h-5" />
                            <span className="font-semibold">{isAdminPage ? 'Kembali ke Portal Warga' : 'Masuk ke Panel Admin'}</span>
                        </a>
                    )}
                    <div className="flex items-center justify-between gap-2">
                        <a
                            href="#profile"
                            onClick={(e) => { e.preventDefault(); handleNavigation('profile'); }}
                            className="flex items-center gap-3 rounded-lg hover:bg-gray-100 flex-1 min-w-0 p-2"
                        >
                            {userInfo?.profilePictureUrl ? (
                                 <img src={`${API_URL}${userInfo.profilePictureUrl}`} alt="Profil" className="w-10 h-10 rounded-full object-cover"/>
                            ) : (
                                 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-bold">
                                        {userInfo?.nama?.charAt(0)?.toUpperCase() || 'W'}
                                    </span>
                                </div>
                            )}
                           
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 text-sm truncate">{userInfo?.nama || 'Warga'}</p>
                                <p className="text-xs text-gray-500 truncate">{isAdmin ? 'Administrator' : 'Warga'}</p>
                            </div>
                        </a>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onLogout();
                            }} 
                            className="text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-gray-100"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

