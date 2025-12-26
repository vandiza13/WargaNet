import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, LogOut, Mail, AlertCircle } from 'lucide-react';

export default function WaitingApprovalPage() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
              <Clock size={40} className="text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Menunggu Persetujuan</h1>
            <p className="text-yellow-50 text-sm">Akun Anda sedang diproses</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-900 font-semibold text-sm mb-1">Info Akun</p>
                  <p className="text-yellow-800 text-sm">Halo <span className="font-bold">{user?.nama || 'Warga'}</span>!</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  ✅ Pendaftaran akun Anda telah berhasil disimpan. Tim admin kami akan melakukan verifikasi data Anda dalam waktu 1-2 hari kerja.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  📧 Kami akan mengirimkan email notifikasi ke <span className="font-semibold break-all">{user?.email}</span> ketika akun Anda telah disetujui.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 text-sm font-semibold mb-2">💡 Tips:</p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>✓ Pastikan email Anda aktif</li>
                  <li>✓ Periksa folder spam jika belum menerima email</li>
                  <li>✓ Hubungi admin jika belum disetujui setelah 2 hari kerja</li>
                </ul>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LogOut size={20} />
              Logout
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Jangan tutup browser ini agar Anda tetap login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
