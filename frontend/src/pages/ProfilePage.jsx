import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Camera } from 'lucide-react';

const ProfilePage = () => {
    const { userInfo, updateUserInfo } = useAuth(); // Menggunakan updateUserInfo dari context
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);

    const API_URL = 'http://localhost:4000'; // Pastikan ini sesuai dengan URL backend Anda

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/auth/me');
                setProfile(data);
            } catch (error) {
                console.error("Gagal memuat profil:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const { data } = await API.put('/users/profile', profile);
            updateUserInfo(data); // Memanggil fungsi yang benar
            setProfile(data); // Juga perbarui state lokal
            setIsEditing(false);
            alert("Profil berhasil diperbarui!");
        } catch (error) {
            alert("Gagal memperbarui profil.");
        }
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
            updateUserInfo(data); // Memanggil fungsi yang benar
            setProfile(data); // Juga perbarui state lokal
            alert("Foto profil berhasil diperbarui!");
        } catch (error) {
            console.error(error);
            alert("Gagal mengunggah foto.");
        }
    };

    if (!profile) {
        return <div className="text-center p-8">Memuat profil...</div>;
    }

    const ProfileField = ({ label, value, name, isEditing, onChange }) => (
        <div>
            <label className="text-sm font-medium text-gray-500">{label}</label>
            {isEditing ? (
                <input type="text" name={name} value={value || ''} onChange={onChange} className="w-full p-2 mt-1 border rounded-lg focus:ring-2 focus:ring-primary-600" />
            ) : (
                <p className="text-lg text-gray-800">{value || '-'}</p>
            )}
        </div>
    );

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil Saya</h1>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <div className="flex items-center">
                        <div className="relative">
                            {userInfo.profilePictureUrl ? (
                                <img src={`${API_URL}${userInfo.profilePictureUrl}`} alt="Foto Profil" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                            ) : (
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-4xl font-bold text-gray-500">
                                        {profile.nama?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-transform transform hover:scale-110">
                                <Camera className="w-4 h-4" />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handlePictureChange} className="hidden" accept="image/*" />
                        </div>
                        <div className="ml-5 text-center sm:text-left mt-4 sm:mt-0">
                            <h2 className="text-2xl font-bold text-gray-900">{profile.nama}</h2>
                            <p className="text-gray-600">{profile.email}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsEditing(!isEditing)} className="mt-4 sm:mt-0 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        {isEditing ? 'Batal' : 'Edit Profil'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileField label="Nama Lengkap" name="nama" value={profile.nama} isEditing={isEditing} onChange={e => setProfile({ ...profile, nama: e.target.value })} />
                    <ProfileField label="Nomor Rumah" name="noRumah" value={profile.noRumah} isEditing={isEditing} onChange={e => setProfile({ ...profile, noRumah: e.target.value })} />
                    <ProfileField label="Nomor KK" name="noKK" value={profile.noKK} isEditing={isEditing} onChange={e => setProfile({ ...profile, noKK: e.target.value })} />
                    <ProfileField label="Jumlah Anggota Keluarga" name="jmlKeluarga" value={profile.jmlKeluarga} isEditing={isEditing} onChange={e => setProfile({ ...profile, jmlKeluarga: e.target.value })} />
                </div>

                {isEditing && (
                    <div className="mt-8 text-right">
                        <button onClick={handleSave} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                            Simpan Perubahan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProfilePage;

