import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import seedAdmin from './seed.js';

// Routes Imports
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

// 1. Load Environment Variables (Standar)
dotenv.config();

// Validasi JWT Secret
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  PERINGATAN: JWT_SECRET tidak ditemukan di .env! Menggunakan default (TIDAK AMAN untuk Production).');
}

const app = express();

// 2. Konfigurasi CORS (Lebih Aman)
// Ganti origin dengan URL frontend kamu nanti saat deploy
const allowedOrigins = [
  'http://localhost:5173', // Vite default port
  'http://localhost:3000', // React default port
  // 'https://warganet.com' // Domain production nanti
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Penting jika nanti pakai cookies/session
}));

app.use(express.json());

// Logger untuk Development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Route Test
app.get('/api', (req, res) => {
    res.json({ message: 'API Warga Digital Berjalan Normal' });
});

// Main Routes
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

// 3. Fungsi Start Server (Async/Await Pattern)
// Ini memastikan DB konek dulu -> Seed jalan -> Baru server listen
const startServer = async () => {
  try {
    // A. Konek Database
    await connectDB(); 
    // console.log sudah ada di dalam function connectDB biasanya

    // B. Jalankan Seeding Admin (Tunggu sampai selesai)
    // Pastikan seed.js kamu sudah pakai refactor yang pakai env tadi ya
    await seedAdmin(); 

    // C. Jalankan Server
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di mode ${process.env.NODE_ENV || 'development'} pada port ${PORT}`);
      console.log(`🔗 Frontend allowed: ${allowedOrigins.join(', ')}`);
    });

  } catch (error) {
    console.error('❌ Gagal menjalankan server:', error);
    process.exit(1); // Matikan proses jika DB gagal konek
  }
};

startServer();