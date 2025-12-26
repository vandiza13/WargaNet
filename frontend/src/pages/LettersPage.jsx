import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { Mail, Plus, Search } from 'lucide-react';

const LettersPage = () => {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ letterType: 'Surat Domisili', notes: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);

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

    const letters = [
        {
            id: 1,
            title: 'Surat Keterangan Domisili',
            description: 'Permohonan surat keterangan domisili untuk keperluan administrasi',
            status: 'approved',
            date: '10 Januari 2024',
        },
        {
            id: 2,
            title: 'Surat Rekomendasi',
            description: 'Permohonan surat rekomendasi untuk keperluan pekerjaan',
            status: 'pending',
            date: '8 Januari 2024',
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return colors[status] || colors.pending;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Surat-Menyurat"
                subtitle="Kelola permohonan surat dari komunitas Anda"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Surat', path: '/letters' }
                ]}
                icon={Mail}
                actions={[
                    {
                        label: 'Buat Permohonan',
                        icon: Plus,
                        onClick: () => setShowForm(!showForm)
                    }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {showForm && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Buat Permohonan Surat</h2>
                    <form className="space-y-4">
                      <input
                        type="text"
                        placeholder="Jenis Surat"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <textarea
                        placeholder="Deskripsi Permohonan"
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      ></textarea>
                      <div className="flex gap-4">
                        <button type="submit" className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700">
                          Kirim
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300">
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Cari surat..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {letters.map((letter) => (
                    <div key={letter.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{letter.title}</h3>
                          <p className="text-gray-700 mt-2">{letter.description}</p>
                          <p className="text-sm text-gray-500 mt-4">{letter.date}</p>
                        </div>
                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(letter.status)}`}>
                          {letter.status === 'pending' && 'Menunggu'}
                          {letter.status === 'approved' && 'Disetujui'}
                          {letter.status === 'rejected' && 'Ditolak'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
