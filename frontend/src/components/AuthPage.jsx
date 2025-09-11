import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Home } from 'lucide-react';

const AuthPage = ({ isLogin }) => {
    const [formData, setFormData] = useState({ email: '', password: '', nama: '', noRumah: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                // Navigasi akan ditangani oleh App.jsx
            } else {
                await register(formData.nama, formData.noRumah, formData.email, formData.password);
                setMessage('Pendaftaran berhasil! Silakan tunggu persetujuan admin sebelum login.');
                setFormData({ email: '', password: '', nama: '', noRumah: '' });
            }
        } catch (err) {
            setError(err.toString());
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
                 <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <Home className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">WargaNet</h1>
                    <p className="text-gray-500">Sistem Informasi Komunitas Warga</p>
                </div>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">{message}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <>
                            <input type="text" placeholder="Nama Lengkap" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} />
                            <input type="text" placeholder="Nomor Rumah (e.g., A1/10)" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" value={formData.noRumah} onChange={e => setFormData({ ...formData, noRumah: e.target.value })} />
                        </>
                    )}
                    <input type="email" placeholder="Alamat Email" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input type="password" placeholder="Password" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                    <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        {isLogin ? 'Masuk' : 'Daftar Akun'}
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-600">
                    {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                    <a href={isLogin ? '#register' : '#login'} className="font-semibold text-primary-600 hover:text-primary-700 ml-1">
                        {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
