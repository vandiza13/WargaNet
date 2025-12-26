import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, MapPin, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const ActivitiesPage = () => {
    const [activities, setActivities] = useState([
        {
            id: 1,
            title: 'Pembersihan Lingkungan Rutin',
            date: '2024-01-15',
            time: '07:00 - 09:00',
            location: 'Lingkungan RT 01',
            participants: 25,
            status: 'upcoming'
        },
        {
            id: 2,
            title: 'Arisan Rutin',
            date: '2024-01-20',
            time: '19:00 - 21:00',
            location: 'Rumah Ibu Siti',
            participants: 15,
            status: 'upcoming'
        },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('Semua');

    const filteredActivities = activities.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const upcomingActivities = filteredActivities.filter(a => a.status === 'upcoming');
    const completedActivities = filteredActivities.filter(a => a.status === 'completed');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Aktivitas Komunitas"
                subtitle="Acara dan kegiatan komunitas Anda"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Aktivitas', path: '/activities' }
                ]}
                icon={Calendar}
            />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Search & Filter */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama kegiatan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-40"
                    >
                        <option>Semua</option>
                        <option>upcoming</option>
                        <option>completed</option>
                    </select>
                </div>

                {/* Upcoming Activities */}
                {upcomingActivities.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">📅 Kegiatan Mendatang</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
                                >
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-40 group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300"></div>
                                    
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 -mt-10 relative z-10 bg-white px-4 py-2 rounded-lg inline-block shadow-md">
                                            {activity.title}
                                        </h3>
                                        
                                        <div className="space-y-3 mt-4 text-gray-600">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={18} className="text-blue-600 flex-shrink-0" />
                                                <span className="text-sm">{formatDate(activity.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Clock size={18} className="text-blue-600 flex-shrink-0" />
                                                <span className="text-sm">{activity.time}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin size={18} className="text-blue-600 flex-shrink-0" />
                                                <span className="text-sm">{activity.location}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Users size={18} className="text-blue-600 flex-shrink-0" />
                                                <span className="text-sm">{activity.participants} peserta</span>
                                            </div>
                                        </div>

                                        <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg">
                                            ✅ Daftar Kegiatan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Activities */}
                {completedActivities.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Kegiatan Selesai</h2>
                        <div className="space-y-4">
                            {completedActivities.map((activity) => (
                                <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">{activity.title}</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-gray-400" />
                                                    {formatDate(activity.date)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-gray-400" />
                                                    {activity.time}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-gray-400" />
                                                    {activity.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} className="text-gray-400" />
                                                    {activity.participants} peserta
                                                </div>
                                            </div>
                                        </div>
                                        <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                                            ✓ Selesai
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredActivities.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600">Tidak ada kegiatan</h3>
                        <p className="text-gray-500 text-sm mt-2">Tidak ada kegiatan yang sesuai dengan pencarian Anda</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivitiesPage;
