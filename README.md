# Aplikasi Komunitas Warga Digital v3.0 (Full-Stack)

Ini adalah repositori untuk aplikasi web Komunitas Warga Digital, dibangun dengan stack MERN (MongoDB, Express, React, Node.js).

## Struktur Proyek

- **/backend**: Server API dengan Node.js, Express, dan MongoDB.
- **/frontend**: Aplikasi klien dengan React (Vite + Tailwind CSS).

## Prasyarat

- Node.js (v18 atau lebih tinggi)
- MongoDB (berjalan di instance lokal atau URI Atlas)

## Menjalankan Proyek

### 1. Backend

```bash
# Masuk ke direktori backend
cd backend

# Install dependensi
npm install

# Buat file .env dari contohnya. Ini PENTING jika Anda menggunakan konfigurasi custom.
cp .env.example .env

# Kemudian, edit file .env sesuai kebutuhan.

# Jalankan server pengembangan
npm run dev
```
Server backend akan berjalan di `http://localhost:4000`.

### 2. Frontend

```bash
# Buka terminal baru, masuk ke direktori frontend
cd frontend

# Install dependensi
npm install

# Jalankan server pengembangan
npm run dev
```
Aplikasi frontend akan berjalan di `http://localhost:5173`.
