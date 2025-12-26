// src/components/AuthPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import mundur satu folder ke context
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const AuthPage = () => {
    // State untuk mode (Login vs Register)
    const [isLoginMode, setIsLoginMode] = useState(true);
    
    // State form dan feedback
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        nama: '', 
        noRumah: '' 
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Hooks
    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Reset form saat ganti mode
    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError('');
        setMessage('');
        setFormData({ email: '', password: '', nama: '', noRumah: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            if (isLoginMode) {
                // LOGIKA LOGIN
                await login(formData.email, formData.password);
                // Jika sukses, redirect ke dashboard
                navigate('/dashboard'); 
            } else {
                // LOGIKA REGISTER
                await register(formData.nama, formData.noRumah, formData.email, formData.password);
                setMessage('Pendaftaran berhasil! Silakan tunggu persetujuan admin atau coba login.');
                // Kembalikan ke mode login agar user bisa langsung login (opsional)
                setIsLoginMode(true);
                setFormData({ email: '', password: '', nama: '', noRumah: '' });
            }
        } catch (err) {
            // Menangkap error dari backend
            setError(err.toString());
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
                 
                 {/* Header Logo */}
                 <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg text-white">
                        <Home className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">WargaNet</h1>
                    <p className="text-gray-500">Sistem Informasi Komunitas Warga</p>
                </div>

                {/* Feedback Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="bg-green-100 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Field Register Only */}
                    {!isLoginMode && (
                        <>
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Nama Lengkap" 
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none" 
                                    value={formData.nama} 
                                    onChange={e => setFormData({ ...formData, nama: e.target.value })} 
                                />
                            </div>
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="Nomor Rumah (contoh: A1/10)" 
                                    required 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none" 
                                    value={formData.noRumah} 
                                    onChange={e => setFormData({ ...formData, noRumah: e.target.value })} 
                                />
                            </div>
                        </>
                    )}

                    {/* Field Email & Password (Always Visible) */}
                    <div>
                        <input 
                            type="email" 
                            placeholder="Alamat Email" 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none" 
                            value={formData.email} 
                            onChange={e => setFormData({ ...formData, email: e.target.value })} 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none" 
                            value={formData.password} 
                            onChange={e => setFormData({ ...formData, password: e.target.value })} 
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        {isLoginMode ? 'Masuk' : 'Daftar Akun'}
                    </button>
                </form>

                {/* Toggle Login/Register */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    {isLoginMode ? 'Belum punya akun?' : 'Sudah punya akun?'}
                    <button 
                        type="button"
                        onClick={toggleMode}
                        className="font-semibold text-blue-600 hover:text-blue-700 ml-1 hover:underline focus:outline-none"
                    >
                        {isLoginMode ? 'Daftar di sini' : 'Masuk di sini'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;