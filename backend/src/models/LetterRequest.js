import mongoose from 'mongoose';

const letterRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    letterType: { type: String, required: true, enum: ['Surat Domisili', 'Pengantar RT/RW', 'Surat Keterangan Usaha', 'SKTM', 'Pengantar RT', 'Pengantar RW', 'Ket. Usaha', 'Lainnya'] },
    status: { type: String, enum: ['Diajukan', 'Diproses', 'Ready', 'Selesai', 'Ditolak', 'Completed', 'Pending', 'Approved', 'Rejected'], default: 'Diajukan' },
    notes: { type: String },
    adminNotes: { type: String },
    fileUrl: { type: String },
}, { timestamps: true });

const LetterRequest = mongoose.model('LetterRequest', letterRequestSchema);
export default LetterRequest;
