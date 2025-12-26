import React, { useState, useEffect } from 'react';
import API from '../services/api';
import PageHeader from '../components/PageHeader';
import { Users, Search, Phone, Home } from 'lucide-react';

const DirectoryPage = () => {
    const [directory, setDirectory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDirectory = async () => {
            const { data } = await API.get('/users/directory');
            setDirectory(data);
        };
        fetchDirectory();
    }, []);

    const filteredDirectory = directory.filter(warga => 
        warga.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warga.noRumah.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Direktori Warga"
                subtitle="Daftar lengkap kontak warga komunitas"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Direktori', path: '/directory' }
                ]}
                icon={Users}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari warga berdasarkan nama atau nomor rumah..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDirectory.map(warga => (
                        <div key={warga._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users size={24} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{warga.nama}</h3>
                                    
                                    <div className="space-y-2 mt-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Home size={16} />
                                            <span>{warga.noRumah}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} />
                                            <a href={`tel:${warga.phone}`} className="text-blue-600 hover:underline">
                                                {warga.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <button className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 text-sm transition-colors">
                                        Hubungi
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default DirectoryPage;
