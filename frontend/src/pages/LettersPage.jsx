import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const LettersPage = () => {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ letterType: 'Surat Domisili', notes: '' });

    const fetchRequests = async () => {
        try {
            const { data } = await API.get('/letters/myrequests');
            setRequests(data);
        } catch (error) {
            console.error("Gagal memuat permohonan surat:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSave = async () => {
        if (!newRequest.letterType || !newRequest.notes) {
            alert("Jenis Surat dan Keperluan tidak boleh kosong.");
            return;
        }
        await API.post('/letters', newRequest);
        fetchRequests();
        setIsModalOpen(false);
        setNewRequest({ letterType: 'Surat Domisili', notes: '' });
    };

    const getStatusPill = (status) => {
        const styles = {
            'Diajukan': 'bg-yellow-100 text-yellow-700',
            'Diproses': 'bg-blue-100 text-blue-700',
            'Selesai': 'bg-green-100 text-green-700',
            'Ditolak': 'bg-red-100 text-red-700',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Layanan Surat Online</h1>
                    <p className="text-gray-500 mt-1">Ajukan permohonan surat pengantar secara digital.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    <Plus size={16} className="mr-2" /> Ajukan Surat Baru
                </button>
            </div>

            {/* Daftar Permohonan */}
            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req._id} className="bg-white p-5 rounded-xl shadow-sm border">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 capitalize">{req.letterType.toLowerCase()}</h2>
                                <p className="text-sm text-gray-500 my-1">
                                    Diajukan pada: {new Date(req.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-gray-600">Keperluan: {req.notes}</p>
                            </div>
                            {getStatusPill(req.status)}
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-500">Anda belum pernah mengajukan permohonan surat.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajukan Permohonan Surat" icon="FileText">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Jenis Surat</label>
                        <select value={newRequest.letterType} onChange={e => setNewRequest({ ...newRequest, letterType: e.target.value })} className="w-full p-2 border rounded-lg mt-1 bg-white">
                            <option>Surat Domisili</option>
                            <option>SKTM</option>
                            <option>Pengantar RT</option>
                            <option>Pengantar RW</option>
                            <option>Ket. Usaha</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Keperluan</label>
                        <textarea rows="4" value={newRequest.notes} onChange={e => setNewRequest({ ...newRequest, notes: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button onClick={handleSave} className="px-6 py-2 bg-primary-600 text-white rounded-lg w-full">Kirim Permohonan</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default LettersPage;
