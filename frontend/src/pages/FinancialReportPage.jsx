import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
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
        <div className="min-h-screen bg-gray-50 animate-fade-in-up">
            <PageHeader
                title="Laporan Keuangan"
                subtitle="Transparansi keuangan komunitas Anda"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Laporan Keuangan', path: '/financial-report' }
                ]}
                icon={TrendingUp}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <p className="text-gray-600 text-sm font-medium">Pemasukan Bulan Ini</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">Rp {new Intl.NumberFormat('id-ID').format(stats.monthlyIncome)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <p className="text-gray-600 text-sm font-medium">Pengeluaran Bulan Ini</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">Rp {new Intl.NumberFormat('id-ID').format(stats.monthlyExpense)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <p className="text-gray-600 text-sm font-medium">Saldo Tersisa</p>
                        <p className="text-3xl font-bold text-blue-600 mt-2">Rp {new Intl.NumberFormat('id-ID').format(stats.netBalance)}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Riwayat Transaksi</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Tanggal</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Keterangan</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Tipe</th>
                                    <th className="px-6 py-3 text-right font-semibold text-gray-700">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx._id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-4">{tx.description}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${tx.type === 'Pemasukan' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {tx.type === 'Pemasukan' ? 'Masuk' : 'Keluar'}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-semibold ${tx.type === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'Pemasukan' ? '+' : '-'} Rp {new Intl.NumberFormat('id-ID').format(tx.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transactions.length === 0 && <p className="text-center text-gray-500 py-8">Tidak ada transaksi yang cocok dengan filter.</p>}
                    </div>
                </div>
            </div>
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

