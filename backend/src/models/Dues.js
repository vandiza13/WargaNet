import mongoose from 'mongoose';

const duesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Belum Lunas', 'Lunas'], default: 'Belum Lunas' },
    paymentDate: { type: Date },
}, { timestamps: true });

// Indeks untuk memastikan iuran unik per pengguna per bulan/tahun
duesSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const Dues = mongoose.model('Dues', duesSchema);
export default Dues;
