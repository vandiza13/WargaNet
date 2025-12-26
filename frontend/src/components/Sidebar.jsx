import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, FileText, AlertCircle, Mail, Users, ShoppingBag, 
  TrendingUp, MessageSquare, Menu, X, LogOut, Settings,
  ChevronDown
} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandAdmin, setExpandAdmin] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Menu untuk warga biasa
  const wargaMenu = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Pengumuman', path: '/announcements', icon: FileText },
    { label: 'Aktivitas', path: '/activities', icon: ShoppingBag },
    { label: 'Forum', path: '/forum', icon: MessageSquare },
    { label: 'Pengaduan', path: '/complaints', icon: AlertCircle },
    { label: 'Surat', path: '/letters', icon: Mail },
    { label: 'Direktori', path: '/directory', icon: Users },
    { label: 'UMKM', path: '/umkm', icon: TrendingUp },
    { label: 'Laporan Keuangan', path: '/financial-report', icon: TrendingUp },
  ];

  // Menu untuk admin
  const adminMenu = [
    { label: 'Kelola Warga', path: '/admin/residents', icon: Users },
    { label: 'Kelola Pengumuman', path: '/admin/announcements', icon: FileText },
    { label: 'Kelola Acara', path: '/admin/events', icon: ShoppingBag },
    { label: 'Kelola Pengaduan', path: '/admin/complaints', icon: AlertCircle },
    { label: 'Kelola Surat', path: '/admin/letters', icon: Mail },
    { label: 'Kelola UMKM', path: '/admin/umkm', icon: TrendingUp },
    { label: 'Keuangan', path: '/finance', icon: TrendingUp },
  ];

  // Cek apakah path aktif
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Render menu item
  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <Link
        to={item.path}
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
          active
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-gray-200 hover:bg-blue-600'
        }`}
      >
        <Icon size={20} className="flex-shrink-0" />
        <span className="text-sm font-medium truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed md:hidden top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-blue-700 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-lg">
              W
            </div>
            <h2 className="text-2xl font-bold">WargaNet</h2>
          </div>
          <p className="text-xs text-blue-300">Sistem Informasi Warga</p>
        </div>

        {/* User Info Card */}
        <div className="p-4 m-4 bg-blue-700 rounded-lg border border-blue-600 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-900">{user?.nama?.[0]?.toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{user?.nama || 'User'}</p>
              <p className="text-xs text-blue-200 truncate">{user?.noRumah || 'N/A'}</p>
            </div>
          </div>
          <div className="text-xs text-blue-300 px-3 py-1 bg-blue-600 rounded w-fit">
            {user?.role === 'admin' ? '👤 Administrator' : '👥 Warga'}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {/* Warga Menu */}
          {wargaMenu.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}

          {/* Admin Menu (Only if user is admin) */}
          {user?.role === 'admin' && (
            <>
              <div className="my-4 border-t border-blue-700"></div>
              
              {/* Admin Section Header */}
              <button
                onClick={() => setExpandAdmin(!expandAdmin)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-blue-200 hover:bg-blue-600 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <Settings size={20} />
                  <span className="text-sm font-semibold">Admin Panel</span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`transform transition-transform duration-200 ${expandAdmin ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Admin Menu Items */}
              {expandAdmin && (
                <div className="mt-1 pl-2 space-y-1 bg-blue-900 bg-opacity-50 rounded-lg p-2">
                  {adminMenu.map((item) => (
                    <MenuItem key={item.path} item={item} />
                  ))}
                </div>
              )}
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-700 flex-shrink-0">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

