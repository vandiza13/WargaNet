import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Pemasukan', 'Pengeluaran'], required: true },
    category: { 
        type: String, 
        enum: ['Iuran Warga', 'Sumbangan', 'Kegiatan', 'Operasional', 'Infrastruktur', 'Sosial', 'Lainnya'],
        default: 'Lainnya' 
    },
    notes: { type: String },
    amount: { type: Number, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;

