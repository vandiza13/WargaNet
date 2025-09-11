import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, SlidersHorizontal, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
        <div className="animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Pengumuman Resmi</h1>
                <p className="text-gray-500 mt-1">Informasi terbaru dari pengurus untuk seluruh warga.</p>
            </div>

            {/* Filter Section */}
            <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari pengumuman..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative flex-grow sm:flex-grow-0">
                         <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white"
                        >
                            <option>Semua Kategori</option>
                            <option>Sosial</option>
                            <option>Keamanan</option>
                            <option>Acara</option>
                            <option>Umum</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            <div className="mt-6 space-y-4">
                {filteredAnnouncements.map(item => (
                    <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                           <Clock size={16} />
                           <span>{new Date(item.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
                            {getCategoryPill(item.category)}
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-3">{item.content}</p>
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
    );
};
export default AnnouncementsPage;

