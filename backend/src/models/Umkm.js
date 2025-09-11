import mongoose from 'mongoose';

const umkmSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    contact: { type: String, required: true },
    alamat: { type: String, required: true },
    jamOperasional: { type: String },
    harga: { type: String },
    sosmed: {
        instagram: { type: String },
        facebook: { type: String },
        whatsapp: { type: String },
    },
    imageUrl: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const Umkm = mongoose.model('Umkm', umkmSchema);
export default Umkm;

