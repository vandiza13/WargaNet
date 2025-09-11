import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Eye, Trash2 } from 'lucide-react';

const AdminManageComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchComplaints = async () => {
        try {
            const { data } = await API.get('/complaints');
            setComplaints(data);
        } catch (error) {
            console.error("Gagal memuat keluhan:", error);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await API.put(`/complaints/${id}/status`, { status: newStatus });
            fetchComplaints();
        } catch (error) {
            alert('Gagal memperbarui status keluhan.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus keluhan ini?')) {
            try {
                await API.delete(`/complaints/${id}`);
                fetchComplaints();
            } catch (error) {
                alert('Gagal menghapus keluhan.');
            }
        }
    };

    const filteredComplaints = complaints.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Keluhan</h1>
                    <p className="text-gray-500 mt-1">Tinjau, tanggapi, dan kelola keluhan dari warga.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari keluhan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="p-3 font-medium">Judul</th>
                            <th className="p-3 font-medium">Pelapor</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.map(item => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{item.title}</td>
                                <td className="p-3">{item.user.nama} ({item.user.noRumah})</td>
                                <td className="p-3">
                                     <select 
                                        value={item.status} 
                                        onChange={(e) => handleStatusChange(item._id, e.target.value)} 
                                        className="text-xs font-medium rounded-md border-gray-300 p-1 bg-gray-50"
                                    >
                                        <option value="Baru">Baru</option>
                                        <option value="Diproses">Diproses</option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                </td>
                                <td className="p-3 flex items-center gap-2">
                                    <button className="p-2 text-gray-500 hover:text-blue-600"><Eye size={16} /></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminManageComplaintsPage;
