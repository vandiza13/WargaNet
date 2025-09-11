import Transaction from '../models/Transaction.js';

// @desc    Get all transactions (with filtering) and financial stats
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
    try {
        // --- 1. Perhitungan Statistik untuk Kartu (Selalu Berdasarkan Data Global & Bulan Ini) ---
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthlyIncome = await Transaction.aggregate([
            { $match: { type: 'Pemasukan', date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const monthlyExpense = await Transaction.aggregate([
            { $match: { type: 'Pengeluaran', date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalIncome = await Transaction.aggregate([
            { $match: { type: 'Pemasukan' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpense = await Transaction.aggregate([
            { $match: { type: 'Pengeluaran' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const stats = {
            monthlyIncome: monthlyIncome[0]?.total || 0,
            monthlyExpense: monthlyExpense[0]?.total || 0,
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            netBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0)
        };

        // --- 2. Filter untuk Tabel Riwayat Transaksi ---
        const { month, category, type } = req.query;
        const filterQuery = {};

        if (month) { // Format: YYYY-MM
            const [year, monthNum] = month.split('-').map(Number);
            const startDate = new Date(year, monthNum - 1, 1);
            const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
            filterQuery.date = { $gte: startDate, $lte: endDate };
        }
        if (category && category !== 'Semua Kategori') {
            filterQuery.category = category;
        }
        if (type && type !== 'Semua Jenis') {
            filterQuery.type = type;
        }

        const transactions = await Transaction.find(filterQuery).sort({ date: 'desc' }).populate('author', 'nama');
        
        res.json({ transactions, stats });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ... (fungsi create, update, dan delete tetap sama)
export const createTransaction = async (req, res) => {
    const { date, description, type, amount, category, notes } = req.body;
    const transaction = new Transaction({ date, description, type, amount, category, notes, author: req.user._id });
    const createdTransaction = await transaction.save();
    res.status(201).json(createdTransaction);
};

export const updateTransaction = async (req, res) => {
    const { date, description, type, amount, category, notes } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (transaction) {
        transaction.date = date;
        transaction.description = description;
        transaction.type = type;
        transaction.amount = amount;
        transaction.category = category;
        transaction.notes = notes;
        const updatedTransaction = await transaction.save();
        res.json(updatedTransaction);
    } else {
        res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (transaction) {
            await transaction.deleteOne();
            res.json({ message: 'Transaksi berhasil dihapus' });
        } else {
            res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

