import React from 'react';
import { User } from 'lucide-react';

const WaitingApprovalPage = ({ onLogout }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
        <User className="w-20 h-20 text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pendaftaran Sedang Ditinjau</h2>
        <p className="text-gray-600 max-w-md mb-8">
            Terima kasih telah mendaftar. Akun Anda sedang menunggu persetujuan dari pengurus. Anda akan dapat masuk setelah akun disetujui.
        </p>
        <button onClick={onLogout} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Logout
        </button>
    </div>
);

export default WaitingApprovalPage;
