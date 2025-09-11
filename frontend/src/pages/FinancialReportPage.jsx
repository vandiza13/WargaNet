import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { PlusCircle, Trash2, Wallet, TrendingUp, TrendingDown, CircleDollarSign } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => {
    const colors = {
        blue: 'border-blue-200 bg-blue-50 text-blue-600',
        green: 'border-green-200 bg-green-50 text-green-600',
        red: 'border-red-200 bg-red-50 text-red-600',
    };
    return (
        <div className={`p-4 rounded-xl flex items-center gap-4 border ${colors[color]}`}>
            <Icon className="w-8 h-8"/>
            <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold">Rp {new Intl.NumberFormat('id-ID').format(value)}</p>
            </div>
        </div>
    );
};

const FinancialReportPage = () => {
    const { userInfo } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ monthlyIncome: 0, monthlyExpense: 0, netBalance: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        month: new Date().toISOString().slice(0, 7),
        category: 'Semua Kategori',
        type: 'Semua Jenis',
    });
    const [newTransaction, setNewTransaction] = useState({
        date: new Date().toISOString().slice(0, 10),
        description: '', type: 'Pemasukan', category: 'Iuran Warga', notes: '', amount: ''
    });

    const fetchTransactions = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.month) params.append('month', filters.month);
            if (filters.category !== 'Semua Kategori') params.append('category', filters.category);
            if (filters.type !== 'Semua Jenis') params.append('type', filters.type);

            const { data } = await API.get(`/transactions?${params.toString()}`);
            setTransactions(data.transactions);
            setStats(data.stats);
        } catch (error) {
            console.error("Gagal memuat laporan keuangan:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        // ... (fungsi handleSave tetap sama)
    };
    
    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Laporan Keuangan Kas RT</h1>
                    <p className="text-gray-500 mt-1">Transparansi keuangan dan iuran warga untuk kemajuan bersama</p>
                </div>
                {userInfo.role === 'admin' && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                        <PlusCircle className="w-5 h-5 mr-2" /> Tambah Transaksi
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={Wallet} title="Saldo Kas" value={stats.netBalance} color="blue" />
                <StatCard icon={TrendingUp} title="Pemasukan Bulan Ini" value={stats.monthlyIncome} color="green" />
                <StatCard icon={TrendingDown} title="Pengeluaran Bulan Ini" value={stats.monthlyExpense} color="red" />
                <StatCard icon={CircleDollarSign} title="Net Balance" value={stats.monthlyIncome - stats.monthlyExpense} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-lg font-bold text-gray-800">Riwayat Transaksi</h2>
                        <div className="flex items-center gap-2">
                            <input type="month" name="month" value={filters.month} onChange={handleFilterChange} className="p-2 border rounded-lg text-sm" />
                             <select name="category" value={filters.category} onChange={handleFilterChange} className="p-2 border rounded-lg text-sm bg-white">
                                <option>Semua Kategori</option><option>Iuran Warga</option><option>Sumbangan</option>
                                <option>Kegiatan</option><option>Operasional</option><option>Infrastruktur</option>
                                <option>Sosial</option><option>Lainnya</option>
                            </select>
                            <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 border rounded-lg text-sm bg-white">
                                <option>Semua Jenis</option><option>Pemasukan</option><option>Pengeluaran</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b text-sm text-gray-500">
                                    <th className="p-3 font-medium">Tanggal</th>
                                    <th className="p-3 font-medium">Deskripsi</th>
                                    <th className="p-3 font-medium text-right">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-sm text-gray-600">{new Date(tx.date).toLocaleDateString('id-ID')}</td>
                                        <td className="p-3 text-sm">{tx.description}</td>
                                        <td className={`p-3 text-sm font-semibold text-right ${tx.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'Pemasukan' ? '+' : '-'} Rp {new Intl.NumberFormat('id-ID').format(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transactions.length === 0 && <p className="text-center text-gray-500 py-8">Tidak ada transaksi yang cocok dengan filter.</p>}
                    </div>
                </div>
                
                {userInfo.role === 'warga' && <WargaDuesStatus />}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Transaksi Baru">
                {/* ... (kode modal tetap sama) ... */}
            </Modal>
        </div>
    );
};

const WargaDuesStatus = () => {
    const [myDues, setMyDues] = useState([]);
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    useEffect(() => {
        const fetchDues = async () => {
            try {
                const { data } = await API.get('/dues/mydues');
                setMyDues(data.slice(0, 5)); // Tampilkan 5 iuran terakhir
            } catch (error) {
                console.error("Gagal memuat data iuran:", error);
            }
        };
        fetchDues();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Status Iuran Saya</h2>
            <div className="space-y-3">
                {myDues.map(due => (
                    <div key={due._id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                        <div>
                            <p className="font-semibold">{monthNames[due.month - 1]} {due.year}</p>
                            <p className="text-sm text-gray-500">Rp {new Intl.NumberFormat('id-ID').format(due.amount)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${due.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {due.status}
                        </span>
                    </div>
                ))}
                 {myDues.length === 0 && <p className="text-center text-gray-500 text-sm py-4">Belum ada data iuran.</p>}
            </div>
        </div>
    );
};

export default FinancialReportPage;

