import Dues from '../models/Dues.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const generateDues = async (req, res) => {
    const { month, year, amount } = req.body;
    if (!month || !year || !amount) {
        return res.status(400).json({ message: 'Bulan, tahun, dan jumlah iuran diperlukan.' });
    }
    try {
        const approvedUsers = await User.find({ isApproved: true, role: 'warga' });
        let generatedCount = 0;
        let skippedCount = 0;
        for (const user of approvedUsers) {
            const duesExists = await Dues.findOne({ user: user._id, month, year });
            if (!duesExists) {
                await Dues.create({ user: user._id, month, year, amount });
                generatedCount++;
            } else {
                skippedCount++;
            }
        }
        res.status(201).json({ message: `Berhasil generate iuran untuk ${generatedCount} warga. ${skippedCount} warga sudah ada iuran untuk periode ini.` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getAllDues = async (req, res) => {
    const dues = await Dues.find({}).sort({ year: -1, month: -1 }).populate('user', 'nama noRumah');
    res.json(dues);
};

export const getMyDues = async (req, res) => {
    const dues = await Dues.find({ user: req.user._id }).sort({ year: -1, month: -1 });
    res.json(dues);
};

export const payDues = async (req, res) => {
    const due = await Dues.findById(req.params.id).populate('user', 'nama');
    if (due) {
        if (due.status === 'Lunas') {
            return res.status(400).json({ message: 'Iuran ini sudah lunas.' });
        }
        due.status = 'Lunas';
        const paymentDate = Date.now();
        due.paymentDate = paymentDate;
        
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        const description = `Iuran bulan ${monthNames[due.month - 1]} ${due.year} - ${due.user.nama}`;
        
        await Transaction.create({
            date: paymentDate,
            description: description,
            type: 'Pemasukan',
            amount: due.amount,
            author: req.user._id,
        });

        const updatedDue = await due.save();
        res.json(updatedDue);
    } else {
        res.status(404).json({ message: 'Iuran tidak ditemukan' });
    }
};

