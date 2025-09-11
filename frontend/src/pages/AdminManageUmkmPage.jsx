import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Search, Plus, MoreVertical, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminManageUmkmPage = () => {
    const [umkms, setUmkms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUmkm, setEditingUmkm] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', description: '', category: 'Lainnya', contact: '', alamat: '', 
        ownerEmail: '', isApproved: true 
    });

    const fetchUmkms = async () => {
        try {
            const { data } = await API.get('/umkm');
            setUmkms(data);
        } catch (error) {
            console.error("Gagal memuat data UMKM:", error);
        }
    };

    useEffect(() => {
        fetchUmkms();
    }, []);

    const openModal = (umkm) => {
        setEditingUmkm(umkm);
        setFormData({
            name: umkm.name,
            description: umkm.description,
            category: umkm.category,
            contact: umkm.contact,
            alamat: umkm.alamat || '',
            isApproved: umkm.isApproved,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            await API.put(`/umkm/${editingUmkm._id}`, formData);
            fetchUmkms();
            setIsModalOpen(false);
        } catch (error) {
            alert('Gagal menyimpan data UMKM.');
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus usaha ini?')) {
            try {
                await API.delete(`/umkm/${id}`);
                fetchUmkms();
            } catch (error) {
                alert('Gagal menghapus UMKM.');
            }
        }
    };
    
    const handleApprove = async (umkmId) => {
        try {
            await API.put(`/umkm/${umkmId}/approve`);
            fetchUmkms();
            setOpenMenuId(null);
        } catch(error){
            alert('Gagal menyetujui UMKM.');
        }
    };

    const filteredUmkms = umkms.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola UMKM</h1>
                    <p className="text-gray-500 mt-1">Kelola direktori usaha milik warga.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari usaha..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="p-3 font-medium">Nama Usaha</th>
                            <th className="p-3 font-medium">Kategori</th>
                            <th className="p-3 font-medium">Pemilik</th>
                            <th className="p-3 font-medium">Status Verifikasi</th>
                            <th className="p-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUmkms.map(item => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.contact}</p>
                                </td>
                                <td className="p-3">{item.category}</td>
                                <td className="p-3">{item.owner.nama}</td>
                                <td className="p-3">
                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {item.isApproved ? 'Disetujui' : 'Menunggu'}
                                    </span>
                                </td>
                                <td className="p-3 relative">
                                     <button onClick={() => setOpenMenuId(openMenuId === item._id ? null : item._id)} className="p-2 rounded-md hover:bg-gray-200">
                                        <MoreVertical size={16} />
                                    </button>
                                    {openMenuId === item._id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
                                            {!item.isApproved && (
                                                <button onClick={() => handleApprove(item._id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                    <CheckCircle size={14} /> Setujui UMKM
                                                </button>
                                            )}
                                            <button onClick={() => openModal(item)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                                <Edit size={14} /> Edit Data
                                            </button>
                                            <div className="border-t my-1"></div>
                                            <button onClick={() => handleDelete(item._id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                                                <Trash2 size={14} /> Hapus UMKM
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Usaha" icon="Store">
                <div className="space-y-4">
                     <input type="text" placeholder="Nama Usaha" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-lg" />
                     <textarea placeholder="Deskripsi" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded-lg" />
                     <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded-lg bg-white">
                        <option>Kuliner</option><option>Fashion</option><option>Kerajinan</option>
                        <option>Jasa</option><option>Pertanian</option><option>Teknologi</option><option>Lainnya</option>
                    </select>
                     <input type="text" placeholder="Kontak (HP/WA)" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} className="w-full p-2 border rounded-lg" />
                     <input type="text" placeholder="Alamat" value={formData.alamat} onChange={e => setFormData({ ...formData, alamat: e.target.value })} className="w-full p-2 border rounded-lg" />
                     <select value={formData.isApproved} onChange={e => setFormData({ ...formData, isApproved: e.target.value === 'true' })} className="w-full p-2 border rounded-lg bg-white">
                        <option value={true}>Disetujui</option>
                        <option value={false}>Menunggu</option>
                    </select>
                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Simpan</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminManageUmkmPage;

