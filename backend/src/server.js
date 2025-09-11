import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import connectDB from './config/db.js';
import seedAdmin from './seed.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import duesRoutes from './routes/duesRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import letterRoutes from './routes/letterRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import umkmRoutes from './routes/umkmRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';


// Muat .env jika ada, jika tidak, muat .env.example
if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.example' });
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'rahasia-super-aman-dan-panjang-sekali') {
    console.warn('PERINGATAN: JWT_SECRET menggunakan nilai default. Harap ganti di file .env untuk produksi.');
}

connectDB();

const app = express();

// --- PERBAIKAN CORS DI SINI ---
// Konfigurasi CORS yang lebih lengkap untuk mengizinkan semua metode
app.use(cors({
  origin: '*', // Izinkan semua origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Izinkan metode PUT, DELETE, dll.
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

seedAdmin();

app.get('/api', (req, res) => {
    res.json({ message: 'API Warga Digital Berjalan' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/dues', duesRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/umkm', umkmRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/transactions', transactionRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`🚀 Server berjalan di mode ${process.env.NODE_ENV} pada port ${PORT}`));

