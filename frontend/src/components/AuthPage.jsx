// src/components/AuthPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, Mail, Lock, User, Home as HomeIcon, AlertCircle, CheckCircle } from 'lucide-react';

const AuthPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '', 
        nama: '', 
        noRumah: '' 
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

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
        setIsLoading(true);

        try {
            if (isLoginMode) {
                await login(formData.email, formData.password);
                navigate('/dashboard');
            } else {
                await register(formData.nama, formData.noRumah, formData.email, formData.password);
                setMessage('✅ Pendaftaran berhasil! Silakan login dan tunggu persetujuan admin.');
                setIsLoginMode(true);
                setFormData({ email: '', password: '', nama: '', noRumah: '' });
            }
        } catch (err) {
            setError(err?.message || 'Terjadi kesalahan. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            <div className="w-full max-w-md">
                
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                            <Home size={32} className="text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">WargaNet</h1>
                        <p className="text-blue-100 text-sm">Sistem Informasi Komunitas Warga</p>
                    </div>

                    {/* Form Container */}
                    <div className="p-8">
                        
                        {/* Messages */}
                        {error && (
                            <div className="mb-6 flex gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg animate-shake">
                                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}
                        
                        {message && (
                            <div className="mb-6 flex gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm">Berhasil</p>
                                    <p className="text-sm">{message}</p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Register Only Fields */}
                            {!isLoginMode && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder="Cth: Budi Santoso" 
                                                required 
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                                value={formData.nama} 
                                                onChange={e => setFormData({ ...formData, nama: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Rumah</label>
                                        <div className="relative">
                                            <HomeIcon size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder="Cth: A1/10" 
                                                required 
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                                value={formData.noRumah} 
                                                onChange={e => setFormData({ ...formData, noRumah: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input 
                                        type="email" 
                                        placeholder="nama@email.com" 
                                        required 
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                        value={formData.email} 
                                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        required 
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                        value={formData.password} 
                                        onChange={e => setFormData({ ...formData, password: e.target.value })} 
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed mt-6"
                            >
                                {isLoading ? 'Proses...' : (isLoginMode ? '🔐 Masuk' : '✏️ Daftar Akun')}
                            </button>
                        </form>

                        {/* Toggle Mode */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 text-sm mb-3">
                                {isLoginMode ? 'Belum punya akun?' : 'Sudah punya akun?'}
                            </p>
                            <button 
                                type="button"
                                onClick={toggleMode}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline transition"
                            >
                                {isLoginMode ? '📝 Daftar di sini' : '🔑 Masuk di sini'}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                        <p className="text-center text-xs text-gray-500">
                            © 2024 WargaNet. Semua hak dilindungi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;