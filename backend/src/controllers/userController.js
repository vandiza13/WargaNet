import User from '../models/User.js';
import Announcement from '../models/Announcement.js';
import Activity from '../models/Activity.js';
import Complaint from '../models/Complaint.js';
import LetterRequest from '../models/LetterRequest.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Pastikan folder uploads ada
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage }).single('profilePicture');

export const updateUserProfilePicture = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading file.', error: err });
        }
        if (req.file == undefined) {
            return res.status(400).json({ message: 'No file selected.' });
        }
        
        try {
            const user = await User.findById(req.user._id);
            if (user) {
                user.profilePictureUrl = `/uploads/${req.file.filename}`;
                await user.save();
                
                const userObject = user.toObject();
                delete userObject.password;

                res.json(userObject);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    });
};

export const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

export const getPublicDirectory = async (req, res) => {
    const users = await User.find({ isApproved: true }).select('nama noRumah');
    res.json(users);
};

export const approveUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.isApproved = true;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.nama = req.body.nama || user.nama;
        user.noRumah = req.body.noRumah || user.noRumah;
        user.noKK = req.body.noKK || user.noKK;
        user.jmlKeluarga = req.body.jmlKeluarga || user.jmlKeluarga;
        
        const updatedUser = await user.save();
        const userObject = updatedUser.toObject();
        delete userObject.password;
        
        res.json(userObject);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const updateUserRole = async (req, res) => {
    const { role } = req.body;
    if (!['warga', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Peran tidak valid.' });
    }

    const user = await User.findById(req.params.id);

    if (user) {
        if (user.email === 'admin@warga.app') {
            return res.status(403).json({ message: 'Peran admin utama tidak dapat diubah.' });
        }

        user.role = role;
        const updatedUser = await user.save();
        const userObject = updatedUser.toObject();
        delete userObject.password;
        res.json(userObject);
    } else {
        res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const totalWarga = await User.countDocuments({ role: 'warga', isApproved: true });
        const pendingWarga = await User.countDocuments({ role: 'warga', isApproved: false });

        const totalPengumuman = await Announcement.countDocuments({});
        const totalKegiatan = await Activity.countDocuments({});
        
        const keluhanSelesai = await Complaint.countDocuments({ status: 'Selesai' });
        const keluhanMenunggu = await Complaint.countDocuments({ status: { $ne: 'Selesai' } });

        const pendingPersetujuan = await LetterRequest.find({ status: 'Diajukan' })
            .sort({ createdAt: 'desc' })
            .limit(5)
            .populate('user', 'nama email');
        
        const announcements = await Announcement.find().sort({createdAt: -1}).limit(2).populate('author', 'nama').lean();
        const activities = await Activity.find().sort({createdAt: -1}).limit(2).populate('author', 'nama').lean();
        const complaints = await Complaint.find().sort({updatedAt: -1}).limit(2).populate('user', 'nama').lean();

        const recentActivities = [
            ...announcements.map(a => ({ type: 'Pengumuman dibuat', title: a.title, date: a.createdAt, icon: 'Megaphone' })),
            ...activities.map(a => ({ type: 'Kegiatan dijadwalkan', title: a.title, date: a.createdAt, icon: 'Calendar' })),
            ...complaints.map(c => ({ type: `Keluhan ${c.status === 'Selesai' ? 'diselesaikan' : 'diupdate'}`, title: c.title, date: c.updatedAt, icon: 'AlertTriangle' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);


        res.json({
            warga: {
                total: totalWarga,
                pending: pendingWarga,
            },
            pengumuman: {
                total: totalPengumuman,
            },
            kegiatan: {
                total: totalKegiatan,
            },
            keluhan: {
                selesai: keluhanSelesai,
                menunggu: keluhanMenunggu,
            },
            pendingPersetujuan,
            recentActivities
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getWargaStats = async (req, res) => {
    try {
        const totalWarga = await User.countDocuments({ role: 'warga', isApproved: true });
        const totalPengumuman = await Announcement.countDocuments({});
        // --- PERBAIKAN DI SINI ---
        // Set waktu ke awal hari (pukul 00:00:00) untuk memastikan
        // semua kegiatan yang dijadwalkan hari ini dan di masa depan terhitung.
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const totalKegiatan = await Activity.countDocuments({ date: { $gte: today } });
        const keluhanPending = await Complaint.countDocuments({ user: req.user._id, status: { $ne: 'Selesai' } });
        res.json({
            warga: totalWarga,
            pengumuman: totalPengumuman,
            kegiatan: totalKegiatan,
            keluhan: keluhanPending,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Fungsi untuk menghapus user, hanya admin yang bisa, dan admin utama tidak bisa dihapus
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.email === 'admin@warga.app') {
            return res.status(403).json({ message: 'Akun admin utama tidak dapat dihapus.' });
        }
        await user.deleteOne();
        res.json({ message: 'User berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

