import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FileText, Search, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

const AnnouncementsPage = () => {
    const { userInfo } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Semua Kategori');

    const fetchAnnouncements = async () => {
        try {
            const { data } = await API.get('/announcements');
            setAnnouncements(data);
        } catch (error) {
            console.error("Gagal memuat pengumuman:", error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const filteredAnnouncements = announcements.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = filterCategory === 'Semua Kategori' || item.category === filterCategory.toLowerCase();
        return matchSearch && matchCategory;
    });

    const getCategoryPill = (category) => {
        const styles = {
            sosial: 'bg-blue-100 text-blue-700',
            keamanan: 'bg-red-100 text-red-700',
            acara: 'bg-green-100 text-green-700',
            umum: 'bg-gray-100 text-gray-700',
            darurat: 'bg-yellow-100 text-yellow-700 font-bold',
        };
        return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[category] || styles.umum}`}>{category}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Pengumuman"
                subtitle="Informasi terbaru dari komunitas Anda"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Pengumuman', path: '/announcements' }
                ]}
                icon={FileText}
            />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari pengumuman..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    {filteredAnnouncements.map(item => (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6 cursor-pointer">
                            <div className="flex gap-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText size={24} className="text-blue-600" />
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                            <p className="text-gray-700 mt-2">{item.content}</p>
                                        </div>
                                        {getCategoryPill(item.category)}
                                    </div>
                                    
                                    <div className="flex gap-6 mt-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            {item.author}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            {new Date(item.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                     {filteredAnnouncements.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                            <Search className="mx-auto text-gray-300" size={48}/>
                            <h3 className="mt-2 text-lg font-medium text-gray-800">Tidak Ditemukan</h3>
                            <p className="mt-1 text-sm text-gray-500">Pengumuman yang Anda cari tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default AnnouncementsPage;

