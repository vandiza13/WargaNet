import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, Megaphone, Calendar, AlertTriangle, PlusCircle, FileText } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, detail, color }) => {
    const colors = {
        blue: { bg: 'bg-primary-50', text: 'text-primary-600' },
        green: { bg: 'bg-accent-green', text: 'text-accent-green-dark' },
        purple: { bg: 'bg-accent-purple', text: 'text-accent-purple-dark' },
        orange: { bg: 'bg-accent-orange', text: 'text-accent-orange-dark' },
    };
    const selectedColor = colors[color] || colors.blue;

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-lg ${selectedColor.bg}`}>
                <Icon className={`w-6 h-6 ${selectedColor.text}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{detail}</p>
            </div>
        </div>
    );
};

const DashboardPage = ({ onNavigate }) => {
    const { userInfo } = useAuth();
    const [stats, setStats] = useState({ warga: 0, pengumuman: 0, kegiatan: 0, keluhan: 0 });
    const [latestAnnouncement, setLatestAnnouncement] = useState(null);
    const [greeting, setGreeting] = useState("Selamat Datang");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Selamat Pagi");
        else if (hour < 15) setGreeting("Selamat Siang");
        else if (hour < 18) setGreeting("Selamat Sore");
        else setGreeting("Selamat Malam");

        const fetchDashboardData = async () => {
             try {
                const [statsRes, announceRes] = await Promise.all([
                    API.get('/users/stats-warga'), // Gunakan endpoint baru
                    API.get('/announcements')
                ]);
                
                setStats(statsRes.data);

                if (announceRes.data.length > 0) {
                    setLatestAnnouncement(announceRes.data[0]);
                }
            } catch (error) {
                console.error("Gagal memuat data dashboard:", error);
            }
        };
        
        fetchDashboardData();
    }, []);

    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="animate-fade-in-up space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{greeting}, {userInfo?.nama}! 👋</h1>
                        <p className="text-gray-500">Selamat datang di WargaNet - Sistem Informasi Komunitas Digital</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="font-medium text-gray-600">Hari ini</p>
                        <p className="text-sm text-gray-500">{today}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} title="Total Warga" value={stats.warga} detail="+ 5 bulan ini" color="blue" />
                <StatCard icon={Megaphone} title="Total Pengumuman" value={stats.pengumuman} detail="Aktif" color="green" />
                <StatCard icon={Calendar} title="Kegiatan Mendatang" value={stats.kegiatan} detail="Mendatang" color="purple" />
                <StatCard icon={AlertTriangle} title="Keluhan Pending" value={stats.keluhan} detail="Pending" color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                     <h2 className="text-lg font-bold text-gray-800 mb-4">Pengumuman Terbaru</h2>
                    {latestAnnouncement ? (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-sm text-gray-500">{new Date(latestAnnouncement.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-blue-100 text-blue-700 capitalize">{latestAnnouncement.category}</span>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">{latestAnnouncement.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-3">{latestAnnouncement.content}</p>
                            <button onClick={() => onNavigate('announcements')} className="text-sm font-semibold text-primary-600 hover:underline mt-4">Baca selengkapnya →</button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Tidak ada pengumuman terbaru.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Aksi Cepat</h2>
                    <div className="space-y-4">
                         <button onClick={() => onNavigate('complaints?action=add')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-accent-red hover:bg-red-200 transition-colors">
                            <PlusCircle className="w-6 h-6 text-accent-red-dark"/>
                            <div>
                                <p className="font-semibold text-accent-red-dark">Buat Laporan</p>
                                <p className="text-xs text-red-600">Laporkan masalah lingkungan</p>
                            </div>
                         </button>
                         <button onClick={() => onNavigate('letters')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-primary-50 hover:bg-blue-200 transition-colors">
                            <FileText className="w-6 h-6 text-primary-700"/>
                            <div>
                                <p className="font-semibold text-primary-700">Ajukan Surat</p>
                                <p className="text-xs text-blue-600">Permohonan surat online</p>
                            </div>
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

