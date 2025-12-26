import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Camera } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { User, Edit2, Save, X, Mail, Home } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUserInfo, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nama: user?.nama || '',
        email: user?.email || '',
        noRumah: user?.noRumah || '',
    });
    const [saveMessage, setSaveMessage] = useState('');
    const fileInputRef = useRef(null);

    const API_URL = 'http://localhost:4000'; // Pastikan ini sesuai dengan URL backend Anda

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/me');
                setFormData({
                    nama: data.nama,
                    email: data.email,
                    noRumah: data.noRumah,
                });
            } catch (error) {
                console.error("Gagal memuat profil:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = async () => {
        try {
            const { data } = await API.put('/users/profile', formData);
            updateUserInfo(data);
            setFormData(data);
            setIsEditing(false);
            setSaveMessage('Profil berhasil diperbarui!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            setSaveMessage('Gagal memperbarui profil');
        }
    };

    const handleCancel = () => {
        setFormData({
            nama: user?.nama || '',
            email: user?.email || '',
            noRumah: user?.noRumah || '',
        });
        setIsEditing(false);
    };

    const handlePictureChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const { data } = await API.put('/users/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateUserInfo(data);
            setFormData(data);
            alert("Foto profil berhasil diperbarui!");
        } catch (error) {
            console.error(error);
            alert("Gagal mengunggah foto.");
        }
    };

    if (!user) {
        return <div className="text-center p-8">Memuat profil...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Profil Saya"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Profil', path: '/profile' }
                ]}
                icon={User}
                actions={[
                    {
                        label: isEditing ? 'Batal' : 'Edit',
                        icon: isEditing ? X : Edit2,
                        onClick: () => {
                            if (isEditing) {
                                handleCancel();
                            } else {
                                setIsEditing(true);
                            }
                        }
                    }
                ]}
            />

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Success Message */}
                {saveMessage && (
                  <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
                    {saveMessage}
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* Profile Header with Avatar */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-12">
                    <div className="flex items-end gap-6">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-50">
                        <User size={48} className="text-blue-600" />
                      </div>
                      <div className="text-white pb-2">
                        <h2 className="text-3xl font-bold">{user?.nama || 'User'}</h2>
                        <p className="text-blue-100 text-sm">
                          {user?.role === 'admin' ? '👤 Administrator' : '👥 Warga Aktif'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Informasi Pribadi</h3>

                    <div className="space-y-6">
                      {/* Nama */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.nama}
                            onChange={(e) => handleChange('nama', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Masukkan nama lengkap"
                          />
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <User size={20} className="text-gray-400" />
                            <span className="text-gray-900 font-medium">{user?.nama || '-'}</span>
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Mail size={20} className="text-gray-400" />
                          <span className="text-gray-900 font-medium">{user?.email || '-'}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Email tidak dapat diubah untuk keamanan akun</p>
                      </div>

                      {/* Nomor Rumah */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nomor Rumah
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.noRumah}
                            onChange={(e) => handleChange('noRumah', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Contoh: A1/10"
                          />
                        ) : (
                          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <Home size={20} className="text-gray-400" />
                            <span className="text-gray-900 font-medium">{user?.noRumah || '-'}</span>
                          </div>
                        )}
                      </div>

                      {/* Status/Role */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status Akun
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-900 font-medium capitalize">
                            {user?.role === 'admin' ? 'Administrator' : 'Warga'}
                          </span>
                        </div>
                      </div>

                      {/* Approval Status */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status Persetujuan
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className={`w-3 h-3 rounded-full ${user?.isApproved ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="text-gray-900 font-medium">
                            {user?.isApproved ? 'Disetujui' : 'Menunggu Persetujuan'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="mt-8 flex gap-4">
                        <button
                          onClick={handleSave}
                          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Save size={20} />
                          Simpan Perubahan
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                          Batal
                        </button>
                      </div>
                    )}

                    {/* Logout Button */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <button
                        onClick={logout}
                        className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-all duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;

