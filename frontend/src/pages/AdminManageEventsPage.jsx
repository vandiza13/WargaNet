import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const AdminManageEventsPage = () => {
    const [activities, setActivities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '' });

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

    const openModal = (activity = null) => {
        if (activity) {
            setEditingActivity(activity);
            setFormData({ 
                title: activity.title, 
                description: activity.description, 
                date: new Date(activity.date).toISOString().slice(0, 16), 
                location: activity.location 
            });
        } else {
            setEditingActivity(null);
            setFormData({ title: '', description: '', date: '', location: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingActivity) {
                await API.put(`/activities/${editingActivity._id}`, formData);
            } else {
                await API.post('/activities', formData);
            }
            fetchActivities();
            setIsModalOpen(false);
        } catch (error) {
            alert('Gagal menyimpan kegiatan.');
        }
    };
    
    const handleDelete = async (id) => {
        if(window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')){
            try {
                await API.delete(`/activities/${id}`);
                fetchActivities();
            } catch (error) {
                alert('Gagal menghapus kegiatan.');
            }
        }
    };

    const filteredActivities = activities.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatus = (date) => {
        const eventDate = new Date(date);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (eventDate < today) {
            return <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Selesai</span>;
        }
        return <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-md">Upcoming</span>;
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Kegiatan</h1>
                    <p className="text-gray-500 mt-1">Jadwalkan, edit, dan kelola kegiatan warga.</p>
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
                            <th className="p-3 font-medium">Tanggal</th>
                            <th className="p-3 font-medium">Lokasi</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActivities.map(item => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{item.title}</td>
                                <td className="p-3">{new Date(item.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                                <td className="p-3">{item.location}</td>
                                <td className="p-3">{getStatus(item.date)}</td>
                                <td className="p-3 flex items-center gap-2">
                                    <button onClick={() => openModal(item)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingActivity ? 'Edit Kegiatan' : 'Buat Kegiatan Baru'} icon="Calendar">
                <div className="space-y-4">
                     <input type="text" placeholder="Nama Kegiatan" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 border rounded-lg" />
                     <input type="datetime-local" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full p-3 border rounded-lg" />
                     <input type="text" placeholder="Lokasi" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full p-3 border rounded-lg" />
                     <textarea placeholder="Deskripsi Singkat" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border rounded-lg" />
                    <div className="flex justify-end gap-4 mt-2">
                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">Batal</button>
                        <button onClick={handleSave} className="bg-primary-600 text-white px-6 py-2 rounded-lg">Simpan</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminManageEventsPage;
