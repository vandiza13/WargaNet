import Umkm from '../models/Umkm.js';
import User from '../models/User.js';

// Warga mendaftarkan UMKM mereka sendiri
export const createUmkm = async (req, res) => {
    const { name, description, category, contact, alamat, jamOperasional, harga, sosmed } = req.body;
    
    // Batasan satu UMKM per pengguna telah dihapus untuk mengizinkan pendaftaran ganda
    
    const umkm = new Umkm({
        name, description, category, contact, alamat, jamOperasional, harga, sosmed,
        owner: req.user._id,
    });
    
    try {
        const createdUmkm = await umkm.save();
        res.status(201).json(createdUmkm);
    } catch (error) {
        // Penanganan error yang lebih baik
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(400).json({ message: 'Gagal mendaftarkan UMKM', error: error.message });
    }
};

// Admin membuat UMKM atas nama warga
export const adminCreateUmkm = async (req, res) => {
    const { name, description, category, contact, alamat, ownerEmail, isApproved } = req.body;
    
    try {
        const owner = await User.findOne({ email: ownerEmail });
        if (!owner) {
            return res.status(404).json({ message: `Warga dengan email ${ownerEmail} tidak ditemukan.` });
        }

        const umkm = new Umkm({
            name, description, category, contact, alamat,
            owner: owner._id,
            isApproved
        });

        const createdUmkm = await umkm.save();
        res.status(201).json(createdUmkm);

    } catch (error) {
        res.status(400).json({ message: 'Gagal membuat UMKM', error: error.message });
    }
};

// Mendapatkan semua UMKM milik pengguna yang sedang login
export const getMyUmkm = async (req, res) => {
    const myUmkms = await Umkm.find({ owner: req.user._id });
    res.json(myUmkms);
};

// Mendapatkan semua UMKM yang sudah disetujui untuk direktori publik
export const getApprovedUmkms = async (req, res) => {
    const umkms = await Umkm.find({ isApproved: true }).populate('owner', 'nama noRumah');
    res.json(umkms);
};

// Mendapatkan semua UMKM (hanya untuk admin)
export const getAllUmkms = async (req, res) => {
    const umkms = await Umkm.find({}).populate('owner', 'nama noRumah');
    res.json(umkms);
};

// Memperbarui data UMKM (hanya untuk admin)
export const updateUmkm = async (req, res) => {
    const { name, description, category, contact, alamat, jamOperasional, harga, sosmed, isApproved } = req.body;
    const umkm = await Umkm.findById(req.params.id);

    if (umkm) {
        umkm.name = name;
        umkm.description = description;
        umkm.category = category;
        umkm.contact = contact;
        umkm.alamat = alamat;
        umkm.jamOperasional = jamOperasional;
        umkm.harga = harga;
        umkm.sosmed = sosmed;
        umkm.isApproved = isApproved;
        const updatedUmkm = await umkm.save();
        res.json(updatedUmkm);
    } else {
        res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
};

// Menyetujui pendaftaran UMKM (hanya untuk admin)
export const approveUmkm = async (req, res) => {
    const umkm = await Umkm.findById(req.params.id);
    if (umkm) {
        umkm.isApproved = true;
        const updatedUmkm = await umkm.save();
        res.json(updatedUmkm);
    } else {
        res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
};

// Menghapus data UMKM (hanya untuk admin)
export const deleteUmkm = async (req, res) => {
    const umkm = await Umkm.findById(req.params.id);
    if (umkm) {
        await umkm.deleteOne();
        res.json({ message: 'UMKM berhasil dihapus' });
    } else {
        res.status(404).json({ message: 'UMKM tidak ditemukan' });
    }
};

