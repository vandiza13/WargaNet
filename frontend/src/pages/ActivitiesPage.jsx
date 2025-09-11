import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, SlidersHorizontal, Clock, MapPin, UserCheck } from 'lucide-react';

const ActivitiesPage = () => {
    const { userInfo } = useAuth();
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua'); // 'Semua', 'Upcoming', 'Selesai'

    const fetchActivities = async () => {
        try {
            const { data } = await API.get('/activities');
            setActivities(data);
        } catch (error) {
            console.error("Gagal memuat kegiatan:", error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleRsvp = async (activityId) => {
        try {
            await API.put(`/activities/${activityId}/rsvp`);
            alert('Anda berhasil mendaftar untuk ikut kegiatan ini!');
            fetchActivities();
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal mendaftar');
        }
    };

    const filteredActivities = activities.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        const today = new Date();
        today.setHours(0,0,0,0);
        const eventDate = new Date(item.date);
        
        let matchStatus = true;
        if (filterStatus === 'Upcoming') {
            matchStatus = eventDate >= today;
        } else if (filterStatus === 'Selesai') {
            matchStatus = eventDate < today;
        }

        return matchSearch && matchStatus;
    });

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Agenda Kegiatan</h1>
                <p className="text-gray-500 mt-1">Jadwal dan informasi kegiatan untuk seluruh warga.</p>
            </div>

            {/* Filter Section */}
            <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari nama kegiatan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
                <div className="relative flex-grow sm:flex-grow-0">
                     <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white"
                    >
                        <option>Semua</option>
                        <option>Upcoming</option>
                        <option>Selesai</option>
                    </select>
                </div>
            </div>

            {/* Activities List */}
            <div className="mt-6 space-y-4">
                {filteredActivities.map(item => (
                    <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                           <Clock size={16} />
                           <span>{new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                            <MapPin size={16} />
                            <span>{item.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                        
                        <div className="border-t pt-4 flex justify-between items-center">
                             <div className="flex items-center text-sm text-gray-500">
                                <UserCheck className="w-4 h-4 mr-2" />
                                {item.participants.length} Warga Ikut
                            </div>
                            {!item.participants.includes(userInfo._id) && new Date(item.date) >= new Date() && (
                                <button onClick={() => handleRsvp(item._id)} className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full hover:bg-green-600 font-semibold">
                                    Daftar Ikut
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                 {filteredActivities.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <Search className="mx-auto text-gray-300" size={48}/>
                        <h3 className="mt-2 text-lg font-medium text-gray-800">Tidak Ditemukan</h3>
                        <p className="mt-1 text-sm text-gray-500">Kegiatan yang Anda cari tidak ditemukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ActivitiesPage;
