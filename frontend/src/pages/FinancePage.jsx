import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';

const FinancePage = () => {
    const [activeTab, setActiveTab] = useState('transaksi'); // 'transaksi' or 'iuran'

    return (
        <div className="animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Kelola Keuangan Kas RT</h1>
                <p className="text-gray-500 mt-1">Manajemen transaksi kas dan iuran warga.</p>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('transaksi')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'transaksi'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Transaksi Kas
                    </button>
                    <button
                        onClick={() => setActiveTab('iuran')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'iuran'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Iuran Warga
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === 'transaksi' && <TransaksiKasView />}
                {activeTab === 'iuran' && <IuranWargaView />}
            </div>
        </div>
    );
};

// ==============================================================================
// ===                           TRANSAKSI KAS VIEW                           ===
// ==============================================================================
const TransaksiKasView = () => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().slice(0, 10),
        description: '',
        type: 'Pemasukan',
        category: 'Iuran Warga',
        notes: '',
        amount: ''
    });

    const fetchTransactions = async () => {
        const { data } = await API.get('/transactions');
        setTransactions(data.transactions);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);
    
    const openModal = (transaction = null) => {
        if (transaction) {
            setEditingTransaction(transaction);
            setFormData({
                date: new Date(transaction.date).toISOString().slice(0, 10),
                description: transaction.description,
                type: transaction.type,
                category: transaction.category || 'Lainnya',
                notes: transaction.notes || '',
                amount: transaction.amount,
            });
        } else {
            setEditingTransaction(null);
            setFormData({
                date: new Date().toISOString().slice(0, 10),
                description: '', type: 'Pemasukan', category: 'Iuran Warga',
                notes: '', amount: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            const payload = { ...formData, amount: Number(formData.amount) };
            if (editingTransaction) {
                await API.put(`/transactions/${editingTransaction._id}`, payload);
            } else {
                await API.post('/transactions', payload);
            }
            fetchTransactions();
            setIsModalOpen(false);
        } catch (error) {
            alert('Gagal menyimpan transaksi.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            try {
                await API.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                alert('Gagal menghapus transaksi.');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Riwayat Transaksi Kas</h2>
                <button onClick={() => openModal()} className="flex items-center text-sm bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700">
                    <Plus size={16} className="mr-2" /> Tambah Transaksi
                </button>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b text-sm text-gray-500">
                        <th className="p-3 font-medium">Tanggal</th>
                        <th className="p-3 font-medium">Deskripsi</th>
                        <th className="p-3 font-medium">Kategori</th>
                        <th className="p-3 font-medium">Jenis</th>
                        <th className="p-3 font-medium">Jumlah</th>
                        <th className="p-3 font-medium">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(tx => (
                        <tr key={tx._id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm">{new Date(tx.date).toLocaleDateString('id-ID')}</td>
                            <td className="p-3 text-sm">{tx.description}</td>
                            <td className="p-3 text-sm">{tx.category}</td>
                            <td className="p-3 text-sm">{tx.type}</td>
                            <td className={`p-3 text-sm font-semibold ${tx.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                                Rp {new Intl.NumberFormat('id-ID').format(tx.amount)}
                            </td>
                            <td className="p-3 flex items-center gap-2">
                                <button onClick={() => openModal(tx)} className="p-1 text-gray-500 hover:text-blue-600"><Edit size={16}/></button>
                                <button onClick={() => handleDelete(tx._id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Jenis Transaksi</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border rounded-lg mt-1">
                            <option>Pemasukan</option>
                            <option>Pengeluaran</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Kategori</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-lg mt-1 bg-white">
                            <option>Iuran Warga</option>
                            <option>Sumbangan</option>
                            <option>Kegiatan</option>
                            <option>Operasional</option>
                            <option>Infrastruktur</option>
                            <option>Sosial</option>
                            <option>Lainnya</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Deskripsi</label>
                        <input type="text" value={formData.description} placeholder="Deskripsi transaksi" onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Jumlah (Rp)</label>
                        <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Tanggal</label>
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Bukti/Nota (Opsional)</label>
                        <input type="file" className="w-full text-sm mt-1 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Catatan</label>
                        <textarea rows="3" value={formData.notes} placeholder="Catatan tambahan..." onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div className="col-span-2 flex justify-end gap-2 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Simpan Transaksi</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// ==============================================================================
// ===                           IURAN WARGA VIEW                             ===
// ==============================================================================
const IuranWargaView = () => {
    const [allDues, setAllDues] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDues, setNewDues] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), amount: 100000 });

    const fetchAllDues = async () => {
        const { data } = await API.get('/dues');
        setAllDues(data);
    };

    useEffect(() => {
        fetchAllDues();
    }, []);

    const handleGenerateDues = async () => {
        await API.post('/dues/generate', newDues);
        fetchAllDues();
        setIsModalOpen(false);
    };

    const handlePayDues = async (dueId) => {
        if (confirm('Tandai lunas? Aksi ini akan otomatis membuat transaksi pemasukan.')) {
            await API.put(`/dues/${dueId}/pay`);
            fetchAllDues();
        }
    };
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Manajemen Iuran Warga</h2>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center text-sm bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700">
                    <Calendar size={16} className="mr-2" /> Generate Iuran Bulan Baru
                </button>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b text-sm text-gray-500">
                        <th className="p-3 font-medium">Nama Warga</th>
                        <th className="p-3 font-medium">RT/RW</th>
                        <th className="p-3 font-medium">Bulan</th>
                        <th className="p-3 font-medium">Jumlah</th>
                        <th className="p-3 font-medium">Status</th>
                        <th className="p-3 font-medium">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {allDues.map(due => (
                        <tr key={due._id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm">{due.user.nama}</td>
                            <td className="p-3 text-sm">{due.user.noRumah}</td>
                            <td className="p-3 text-sm">{monthNames[due.month - 1]} {due.year}</td>
                            <td className="p-3 text-sm">Rp {new Intl.NumberFormat('id-ID').format(due.amount)}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${due.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {due.status}
                                </span>
                            </td>
                            <td className="p-3">
                                {due.status === 'Belum Lunas' && (
                                    <button onClick={() => handlePayDues(due._id)} className="text-xs bg-green-500 text-white px-3 py-1 rounded-md">
                                        Tandai Lunas
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Iuran Bulanan">
                <div className="space-y-4">
                    <p>Aksi ini akan membuat tagihan iuran untuk semua warga yang terdaftar dan disetujui untuk periode yang dipilih.</p>
                    <div>
                        <label>Bulan</label>
                        <input type="number" value={newDues.month} onChange={e => setNewDues({...newDues, month: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label>Tahun</label>
                        <input type="number" value={newDues.year} onChange={e => setNewDues({...newDues, year: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label>Jumlah (Rp)</label>
                        <input type="number" value={newDues.amount} onChange={e => setNewDues({...newDues, amount: e.target.value})} className="w-full p-2 border rounded" />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={() => setIsModalOpen(false)} className="bg-slate-200 text-slate-800 px-6 py-2 rounded-lg hover:bg-slate-300">Batal</button>
                        <button onClick={handleGenerateDues} className="bg-primary-600 text-white px-6 py-2 rounded-lg">Generate</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};


export default FinancePage;

