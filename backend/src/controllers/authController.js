import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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
        });
    } else {
        res.status(400).json({ message: 'Data pengguna tidak valid.' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        console.log(`Login Gagal: User tidak ditemukan untuk email ${email}`);
        return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (isPasswordMatch) {
        if (!user.isApproved) {
            return res.status(403).json({ message: 'Akun Anda belum disetujui oleh admin.' });
        }
        res.json({
            _id: user._id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            token: generateToken(user._id, user.role),
        });
    } else {
        console.log(`Login Gagal: Password salah untuk email ${email}`);
        res.status(401).json({ message: 'Email atau password salah' });
    }
};

export const getMe = async (req, res) => {
    res.json(req.user);
};
