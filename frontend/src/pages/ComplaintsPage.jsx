import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const ComplaintsPage = ({ params }) => {
    const [complaints, setComplaints] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(params?.action === 'add');
    const [newComplaint, setNewComplaint] = useState({ title: '', description: '', location: '', category: 'Lainnya' });

    const fetchComplaints = async () => {
        try {
            const { data } = await API.get('/complaints/mycomplaints');
            setComplaints(data);
        } catch (error) {
            console.error("Gagal memuat keluhan:", error);
        }
    };

    useEffect(() => {
        // Efek untuk membuka modal jika ada parameter action=add di URL
        setIsModalOpen(params?.action === 'add');
    }, [params]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleSave = async () => {
        if (!newComplaint.title || !newComplaint.description) {
            alert("Judul dan Deskripsi tidak boleh kosong.");
            return;
        }
        await API.post('/complaints', newComplaint);
        fetchComplaints();
        setIsModalOpen(false);
        setNewComplaint({ title: '', description: '', location: '', category: 'Lainnya' });
    };

    const getStatusPill = (status) => {
        const styles = {
            'Baru': 'bg-blue-100 text-blue-700',
            'Diproses': 'bg-yellow-100 text-yellow-700',
            'Selesai': 'bg-green-100 text-green-700',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100'}`}>{status}</span>;
    };

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Keluhan & Laporan</h1>
                    <p className="text-gray-500 mt-1">Laporkan masalah dan pantau status penanganannya.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    <Plus size={16} className="mr-2" /> Buat Laporan Baru
                </button>
            </div>

            {/* Daftar Keluhan */}
            <div className="space-y-4">
                {complaints.map(item => (
                    <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm border">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{item.title}</h2>
                                <p className="text-sm text-gray-500 my-1">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                            {getStatusPill(item.status)}
                        </div>
                    </div>
                ))}
                {complaints.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">Anda belum membuat laporan.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Laporan Baru" icon="AlertTriangle">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Judul Laporan</label>
                        <input type="text" value={newComplaint.title} onChange={e => setNewComplaint({ ...newComplaint, title: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Kategori</label>
                        <select value={newComplaint.category} onChange={e => setNewComplaint({ ...newComplaint, category: e.target.value })} className="w-full p-2 border rounded-lg mt-1 bg-white">
                           <option>Infrastruktur</option>
                           <option>Kebersihan</option>
                           <option>Keamanan</option>
                           <option>Fasilitas Umum</option>
                           <option>Pelayanan</option>
                           <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Lokasi Kejadian</label>
                        <input type="text" value={newComplaint.location} onChange={e => setNewComplaint({ ...newComplaint, location: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                     <div>
                        <label className="text-sm font-medium">Deskripsi Lengkap</label>
                        <textarea rows="4" value={newComplaint.description} onChange={e => setNewComplaint({ ...newComplaint, description: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                     <div>
                        <label className="text-sm font-medium">Foto Bukti (Opsional)</label>
                        <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button onClick={handleSave} className="px-6 py-2 bg-primary-600 text-white rounded-lg w-full">Kirim Laporan</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default ComplaintsPage;
