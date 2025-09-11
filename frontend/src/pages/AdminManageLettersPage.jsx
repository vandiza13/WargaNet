import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Search, Eye, Download, UploadCloud } from 'lucide-react';

const AdminManageLettersPage = () => {
    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [fileToUpload, setFileToUpload] = useState(null);
    const fileInputRef = useRef(null);
    const API_URL = 'http://localhost:4000';

    const fetchRequests = async () => {
        try {
            const { data } = await API.get('/letters');
            setRequests(data);
        } catch (error) {
            console.error("Gagal memuat permohonan surat:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const openModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };
    
    const handleFileChange = (e) => {
        setFileToUpload(e.target.files[0]);
    };

    const handleUploadAndSave = async () => {
        if (!selectedRequest) return;

        // Jika ada file yang dipilih, upload dulu
        if (fileToUpload) {
            const formData = new FormData();
            formData.append('letterFile', fileToUpload);
            try {
                await API.put(`/letters/${selectedRequest._id}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } catch (error) {
                alert('Gagal mengunggah file.');
                return;
            }
        }
        
        // Kemudian, update status dan catatan
        try {
             await API.put(`/letters/${selectedRequest._id}/status`, {
                status: selectedRequest.status,
                adminNotes: selectedRequest.adminNotes
            });
        } catch(error){
             alert('Gagal menyimpan perubahan status.');
        }

        fetchRequests();
        setIsModalOpen(false);
        setFileToUpload(null);
    };


    const filteredRequests = requests.filter(item =>
        item.letterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Permohonan Surat</h1>
                    <p className="text-gray-500 mt-1">Proses permohonan surat dari warga.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari jenis surat/pemohon..."
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
                            <th className="p-3 font-medium">Jenis Surat</th>
                            <th className="p-3 font-medium">Pemohon</th>
                            <th className="p-3 font-medium">Tanggal</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(item => (
                            <tr key={item._id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{item.letterType}</td>
                                <td className="p-3">{item.user.nama} ({item.user.noRumah})</td>
                                <td className="p-3">{new Date(item.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="p-3">
                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                         item.status === 'Selesai' || item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                         item.status === 'Diajukan' || item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                         item.status === 'Ditolak' || item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                         'bg-blue-100 text-blue-700'
                                     }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-3 flex items-center gap-2">
                                    <button onClick={() => openModal(item)} className="p-2 text-gray-500 hover:text-blue-600"><Eye size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detail Permohonan Surat">
                {selectedRequest && (
                    <div className="space-y-4">
                        <div>
                            <p className="font-bold text-lg">{selectedRequest.letterType}</p>
                            <p className="text-sm text-gray-500">Oleh: {selectedRequest.user.email}</p>
                            <p className="mt-2">Keperluan: {selectedRequest.notes}</p>
                        </div>
                        <div className="border-t pt-4">
                            <label className="text-sm font-medium">Ubah Status</label>
                            <select 
                                value={selectedRequest.status} 
                                onChange={(e) => setSelectedRequest({...selectedRequest, status: e.target.value})}
                                className="w-full p-2 border rounded-lg mt-1 bg-white"
                            >
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                                <option>Ready</option>
                                <option>Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Catatan Admin</label>
                            <textarea 
                                value={selectedRequest.adminNotes || ''} 
                                onChange={(e) => setSelectedRequest({...selectedRequest, adminNotes: e.target.value})}
                                className="w-full p-2 border rounded-lg mt-1"
                            />
                        </div>
                         <div>
                            <label className="text-sm font-medium">Upload Surat Jadi (PDF)</label>
                            <div className="mt-1 flex items-center gap-2">
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                            </div>
                             {selectedRequest.fileUrl && (
                                <a href={`${API_URL}${selectedRequest.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2">
                                    <Download size={14}/> Lihat File Terunggah
                                </a>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Tutup</button>
                            <button onClick={handleUploadAndSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Simpan Perubahan</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminManageLettersPage;

