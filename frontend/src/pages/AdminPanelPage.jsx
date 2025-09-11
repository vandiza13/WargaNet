import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminPanelPage = () => {
    const { userInfo } = useAuth();
    const [users, setUsers] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [letterRequests, setLetterRequests] = useState([]);
    const [umkmRequests, setUmkmRequests] = useState([]);
    
    const fetchAllData = async () => {
        try {
            const [usersRes, complaintsRes, lettersRes, umkmRes] = await Promise.all([
                API.get('/users'),
                API.get('/complaints'),
                API.get('/letters'),
                API.get('/umkm')
            ]);
            setUsers(usersRes.data);
            setComplaints(complaintsRes.data);
            setLetterRequests(lettersRes.data);
            setUmkmRequests(umkmRes.data);
        } catch (error) {
            console.error("Gagal memuat data admin:", error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleApproveUser = async (userId) => {
        await API.put(`/users/${userId}/approve`);
        fetchAllData();
    };

    const handleComplaintStatusChange = async (complaintId, status) => {
        await API.put(`/complaints/${complaintId}/status`, { status });
        fetchAllData();
    };
    
    const handleLetterStatusChange = async (letterId, status) => {
        await API.put(`/letters/${letterId}/status`, { status });
        fetchAllData();
    };
    
    const handleApproveUmkm = async (umkmId) => {
        await API.put(`/umkm/${umkmId}/approve`);
        fetchAllData();
    };

    const handleRoleChange = async (userId, newRole) => {
        if (confirm(`Apakah Anda yakin ingin mengubah peran pengguna ini menjadi ${newRole}?`)) {
            try {
                await API.put(`/users/${userId}/role`, { role: newRole });
                fetchAllData();
            } catch (error) {
                alert('Gagal mengubah peran pengguna: ' + (error.response?.data?.message || 'Error'));
            }
        }
    };

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Panel Admin</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {/* User Management */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Manajemen Warga</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {users.map(user => (
                            <div key={user._id} className="flex flex-col sm:flex-row justify-between sm:items-center p-3 border rounded-lg gap-2">
                                <div>
                                    <p className="font-semibold">{user.nama} ({user.noRumah})</p>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                    <p className="text-xs text-slate-500 font-mono mt-1">Role: {user.role}</p>
                                </div>
                                <div className="flex gap-2 self-end sm:self-center">
                                    {!user.isApproved ? (
                                        <button onClick={() => handleApproveUser(user._id)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Setujui</button>
                                    ) : (
                                        user.email !== 'admin@warga.app' && userInfo._id !== user._id && (
                                            user.role === 'warga' ? (
                                                <button onClick={() => handleRoleChange(user._id, 'admin')} className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-600">Jadikan Admin</button>
                                            ) : (
                                                <button onClick={() => handleRoleChange(user._id, 'warga')} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600">Jadikan Warga</button>
                                            )
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Complaint Management */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Manajemen Laporan</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {complaints.map(item => (
                            <div key={item._id} className="p-3 border rounded-lg">
                                <p className="font-semibold">{item.title} <span className="font-normal text-sm text-slate-500">- oleh {item.user.nama}</span></p>
                                <p className="text-sm text-slate-600 my-1">{item.description}</p>
                                <select value={item.status} onChange={(e) => handleComplaintStatusChange(item._id, e.target.value)} className="text-sm rounded-md border-slate-300 p-1 bg-slate-50">
                                    <option value="Baru">Baru</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Letter Request Management */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Permohonan Surat</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {letterRequests.map(item => (
                            <div key={item._id} className="p-3 border rounded-lg">
                                <p className="font-semibold">{item.letterType} <span className="font-normal text-sm text-slate-500">- oleh {item.user.nama}</span></p>
                                <p className="text-sm text-slate-600 my-1">Catatan: {item.notes || '-'}</p>
                                <select value={item.status} onChange={(e) => handleLetterStatusChange(item._id, e.target.value)} className="text-sm rounded-md border-slate-300 p-1 bg-slate-50">
                                    <option value="Diajukan">Diajukan</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Ditolak">Ditolak</option>
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* UMKM Management */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Pendaftaran UMKM</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {umkmRequests.map(item => (
                            <div key={item._id} className="p-3 border rounded-lg">
                                <p className="font-semibold">{item.name} <span className="font-normal text-sm text-slate-500">- oleh {item.owner.nama}</span></p>
                                <p className="text-sm text-slate-600 my-1">{item.description}</p>
                                {item.isApproved ? (
                                    <span className="text-sm text-green-600 font-medium">Disetujui</span>
                                ) : (
                                    <button onClick={() => handleApproveUmkm(item._id)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Setujui</button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdminPanelPage;

