import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';
import { Users, Megaphone, Calendar, AlertTriangle, Shield, Check, X, PlusCircle, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, detail, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4 border">
            <div className={`p-3 rounded-lg ${colors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <div className="flex items-center text-xs text-gray-400 mt-1 gap-2">
                    {detail.map((item, index) => (
                        <span key={index} className={`flex items-center ${item.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-1 ${item.dotColor}`}></div>
                            {item.count} {item.label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AdminDashboardPage = ({ onNavigate }) => {
    const { userInfo } = useAuth();
    const [stats, setStats] = useState(null);

    const fetchData = async () => {
        try {
            const { data } = await API.get('/users/stats');
            setStats(data);
        } catch (error) {
            console.error("Gagal memuat statistik admin:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (!stats) {
        return <div className="text-center p-8">Memuat dashboard admin...</div>;
    }

    return (
        <div className="animate-fade-in-up space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Shield className="text-red-500" /> Selamat Pagi, Admin!
                        </h1>
                        <p className="text-gray-500">Panel kontrol untuk mengelola sistem WargaNet</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="font-medium text-gray-600">Hari ini</p>
                        <p className="text-sm text-gray-500">{today}</p>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} title="Total Warga" value={stats.warga.total} detail={[{ count: stats.warga.total, label: 'terverifikasi', color: 'text-green-600', dotColor: 'bg-green-500' }, { count: stats.warga.pending, label: 'menunggu', color: 'text-orange-600', dotColor: 'bg-orange-500' }]} color="blue" />
                <StatCard icon={Megaphone} title="Pengumuman" value={stats.pengumuman.total} detail={[{ count: stats.pengumuman.total, label: 'dipublikasi', color: 'text-gray-500', dotColor: 'bg-gray-400' }]} color="green" />
                <StatCard icon={Calendar} title="Kegiatan" value={stats.kegiatan.total} detail={[{ count: stats.kegiatan.total, label: 'total terjadwal', color: 'text-gray-500', dotColor: 'bg-gray-400' }]} color="purple" />
                <StatCard icon={AlertTriangle} title="Keluhan" value={stats.keluhan.selesai + stats.keluhan.menunggu} detail={[{ count: stats.keluhan.selesai, label: 'selesai', color: 'text-green-600', dotColor: 'bg-green-500' }, { count: stats.keluhan.menunggu, label: 'menunggu', color: 'text-orange-600', dotColor: 'bg-orange-500' }]} color="orange" />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Menunggu Persetujuan */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Menunggu Persetujuan</h2>
                        <div className="space-y-3">
                            {stats.pendingPersetujuan.length > 0 ? stats.pendingPersetujuan.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <p className="font-semibold">{item.user.email}</p>
                                        <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-md">{item.letterType}</span>
                                        <button className="text-xs text-blue-600 hover:underline">Review →</button>
                                        <button className="p-1.5 rounded-md hover:bg-green-100 text-green-600"><Check size={16} /></button>
                                        <button className="p-1.5 rounded-md hover:bg-red-100 text-red-600"><X size={16} /></button>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-center text-gray-500 py-4">Tidak ada persetujuan yang menunggu.</p>}
                        </div>
                         <div className="text-center mt-4">
                            <button onClick={fetchData} className="text-sm text-gray-500 hover:text-gray-800">Refresh Data</button>
                        </div>
                    </div>

                    {/* Aktivitas Terbaru */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp /> Aktivitas Terbaru</h2>
                         <div className="space-y-4">
                            {stats.recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <Icon name={activity.icon} className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-gray-700">{activity.type}</p>
                                        <p className="text-sm text-gray-600">{activity.title}</p>
                                        <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Aksi Admin */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi Admin</h2>
                    <div className="space-y-3">
                         <ActionButton icon={Users} title="Kelola Warga" description="Verifikasi & kelola data warga" color="blue" onClick={() => onNavigate('admin-manage-residents')} />
                         <ActionButton icon={Megaphone} title="Buat Pengumuman" description="Publikasi informasi baru" color="green" onClick={() => onNavigate('admin-manage-announcements')} />
                         <ActionButton icon={Calendar} title="Kelola Kegiatan" description="Jadwalkan acara warga" color="purple" onClick={() => onNavigate('admin-manage-events')} />
                         <ActionButton icon={AlertTriangle} title="Review Keluhan" description="Tangani laporan warga" color="orange" onClick={() => onNavigate('admin-manage-complaints')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ icon: Icon, title, description, color, onClick }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${colors[color]} hover:bg-opacity-80`}>
            <PlusCircle className="w-5 h-5" />
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-xs">{description}</p>
            </div>
        </button>
    );
};

export default AdminDashboardPage;

