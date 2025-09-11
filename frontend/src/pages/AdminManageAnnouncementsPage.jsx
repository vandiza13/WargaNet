import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const AdminManageAnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', category: 'sosial' });

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

    const openModal = (announcement = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setFormData({ title: announcement.title, content: announcement.content, category: announcement.category });
        } else {
            setEditingAnnouncement(null);
            setFormData({ title: '', content: '', category: 'sosial' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingAnnouncement) {
                await API.put(`/announcements/${editingAnnouncement._id}`, formData);
            } else {
                await API.post('/announcements', formData);
            }
            fetchAnnouncements();
            setIsModalOpen(false);
        } catch (error) {
            alert('Gagal menyimpan pengumuman.');
        }
    };
    
    const handleDelete = async (id) => {
        if(window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')){
            try {
                await API.delete(`/announcements/${id}`);
                fetchAnnouncements();
            } catch (error) {
                alert('Gagal menghapus pengumuman.');
            }
        }
    };

    const filteredAnnouncements = announcements.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Pengumuman</h1>
                    <p className="text-gray-500 mt-1">Buat, edit, dan kelola pengumuman untuk warga.</p>
                </div>
                <div className="flex items-center gap-2">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari judul..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button onClick={() => openModal()} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={16} /> Buat Baru
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-sm text-gray-500">
                            <th className="p-3 font-medium">Judul</th>
                            <th className="p-3 font-medium">Kategori</th>
                            <th className="p-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAnnouncements.map(item => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{item.title}</td>
                                <td className="p-3 capitalize">{item.category}</td>
                                <td className="p-3 flex items-center gap-2">
                                    <button onClick={() => openModal(item)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAnnouncement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'} icon="Megaphone">
                <div className="space-y-4">
                     <input type="text" placeholder="Judul Pengumuman" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 border rounded-lg" />
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 border rounded-lg bg-white">
                        <option value="sosial">Sosial</option>
                        <option value="keamanan">Keamanan</option>
                        <option value="acara">Acara</option>
                        <option value="darurat">Darurat</option>
                    </select>
                    <textarea placeholder="Isi Pengumuman" rows="6" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full p-3 border rounded-lg" />
                    <div className="flex justify-end gap-4 mt-2">
                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">Batal</button>
                        <button onClick={handleSave} className="bg-primary-600 text-white px-6 py-2 rounded-lg">Simpan</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminManageAnnouncementsPage;
