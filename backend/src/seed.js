import bcrypt from 'bcryptjs';
import User from './models/User.js';

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@warga.app';
        const adminPassword = 'admin123';

        const admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            // Jika admin tidak ada, buat baru
            await User.create({
                nama: 'Admin Utama',
                email: adminEmail,
                password: adminPassword, // Password akan di-hash oleh pre-save hook
                noRumah: 'Blok Admin',
                role: 'admin',
                isApproved: true,
            });
            console.log('🔑 Akun admin default berhasil dibuat.');
        } else {
            // Jika admin ada, pastikan perannya adalah 'admin'
            if (admin.role !== 'admin') {
                console.warn('⚠️ Peran admin utama terdeteksi salah, memulihkan...');
                admin.role = 'admin';
                await admin.save();
                console.log('✅ Peran admin utama berhasil dipulihkan.');
            }

            // Pastikan passwordnya benar
            const isMatch = await admin.matchPassword(adminPassword);
            if (!isMatch) {
                console.log('🔧 Memperbaiki password admin default...');
                admin.password = adminPassword;
                await admin.save();
                console.log('✅ Password admin default berhasil diperbaiki.');
            }
        }
    } catch (error) {
        console.error('Gagal memproses akun admin default:', error);
    }
};

export default seedAdmin;
