import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, MoreVertical, UserCheck, UserX, Shield } from 'lucide-react';

const AdminManageResidentsPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/users');
            setUsers(data);
        } catch (error) {
            console.error("Gagal memuat data warga:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await API.put(`/users/${userId}/role`, { role: newRole });
            fetchUsers();
            setOpenMenuId(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal mengubah peran pengguna.');
        }
    };

    const handleApprove = async (userId) => {
        try {
            await API.put(`/users/${userId}/approve`);
            fetchUsers();
            setOpenMenuId(null);
        } catch (error) {
            alert('Gagal mengubah status verifikasi.');
        }
    }

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) return;
        try {
            await API.delete(`/users/${userId}`);
            fetchUsers();
            setOpenMenuId(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal menghapus akun.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Data Warga</h1>
                    <p className="text-gray-500 mt-1">Verifikasi, kelola peran, dan lihat data warga terdaftar.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari warga..."
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
                            <th className="p-3 font-medium">Nama</th>
                            <th className="p-3 font-medium">RT/RW</th>
                            <th className="p-3 font-medium">Status Verifikasi</th>
                            <th className="p-3 font-medium">Peran</th>
                            <th className="p-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <p className="font-semibold">{user.nama}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </td>
                                <td className="p-3 text-sm">{user.noRumah || '-'}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {user.isApproved ? 'Terverifikasi' : 'Menunggu'}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3 relative">
                                    {/* Sembunyikan tombol aksi untuk admin utama */}
                                    {user.email !== 'admin@warga.app' && (
                                        <>
                                            <button onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)} className="p-2 rounded-md hover:bg-gray-200">
                                                <MoreVertical size={16} />
                                            </button>
                                            {openMenuId === user._id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                                                    {!user.isApproved && (
                                                        <button onClick={() => handleApprove(user._id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                            <UserCheck size={14} /> Verifikasi Warga
                                                        </button>
                                                    )}
                                                    <div className="border-t my-1"></div>
                                                    {user.role !== 'admin' ? (
                                                        <button onClick={() => handleRoleChange(user._id, 'admin')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                            <Shield size={14} /> Jadikan Admin
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleRoleChange(user._id, 'warga')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                            <Shield size={14} /> Jadikan Warga
                                                        </button>
                                                    )}
                                                    <div className="border-t my-1"></div>
                                                    <button onClick={() => handleDeleteUser(user._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                        <UserX size={14} /> Hapus Akun
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminManageResidentsPage;

