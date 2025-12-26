import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Fungsi generate token tetap sama
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
    const { nama, email, password, noRumah } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const user = await User.create({ nama, email, password, noRumah });

    if (user) {
        res.status(201).json({
            _id: user._id,
            nama: user.nama,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(400).json({ message: 'Data pengguna tidak valid.' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // 1. Cek User
        if (!user) {
            console.log(`Login Gagal: User tidak ditemukan untuk email ${email}`);
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // 2. Cek Password
        // Pastikan model User kamu punya method matchPassword
        const isPasswordMatch = await user.matchPassword(password);

        if (isPasswordMatch) {
            // 3. Cek Approval
            if (!user.isApproved) {
                return res.status(403).json({ message: 'Akun Anda belum disetujui oleh admin.' });
            }

            // 4. KIRIM RESPON (DIPERBAIKI)
            // Kita bungkus data user dalam object 'user' agar terbaca Frontend
            res.json({
                token: generateToken(user._id, user.role),
                user: {
                    _id: user._id,
                    nama: user.nama,
                    email: user.email,
                    role: user.role,
                    noRumah: user.noRumah, // Tambahkan ini biar lengkap
                    isApproved: user.isApproved
                }
            });
        } else {
            console.log(`Login Gagal: Password salah untuk email ${email}`);
            res.status(401).json({ message: 'Email atau password salah' });
        }
    } catch (error) {
        console.error("Server Error saat Login:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

export const getMe = async (req, res) => {
    res.json(req.user);
};