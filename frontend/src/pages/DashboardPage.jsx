import React from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { FileText, AlertCircle, Mail, Users, MessageSquare, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Pengumuman', count: 12, icon: FileText, color: 'blue' },
    { label: 'Aktivitas', count: 8, icon: Calendar, color: 'green' },
    { label: 'Pengaduan', count: 3, icon: AlertCircle, color: 'orange' },
    { label: 'Anggota', count: 145, icon: Users, color: 'purple' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Dashboard"
        subtitle={"Selamat datang kembali, " + (user?.nama || 'User') + "!"}
        icon={MessageSquare}
        actions={[
          {
            label: 'Refresh',
            icon: RefreshCw,
            onClick: () => window.location.reload()
          }
        ]}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const colorClass = getColorClasses(stat.color);
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.count}</p>
                  </div>
                  <div className={`p-3 rounded-lg border ${colorClass}`}>
                    <Icon size={28} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activities - Left (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Pengumuman penting dari RT</p>
                      <p className="text-sm text-gray-600 mt-1">Pembersihan lingkungan dijadwalkan hari Sabtu pukul 07:00</p>
                      <p className="text-xs text-gray-500 mt-2">2 jam yang lalu</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                Lihat Semua Aktivitas →
              </button>
            </div>
          </div>

          {/* Quick Links - Right (1 col) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Menu Cepat</h2>
            <div className="space-y-3">
              {[
                { label: 'Lihat Pengumuman', icon: FileText },
                { label: 'Buat Pengaduan', icon: AlertCircle },
                { label: 'Forum Diskusi', icon: MessageSquare },
                { label: 'Profil Saya', icon: Users },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <div className="text-3xl">📢</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Informasi Penting</h3>
              <p className="text-gray-700 mt-2">
                Iuran bulanan bulan ini sudah terkumpul <span className="font-semibold text-green-600">87%</span>. 
                Terima kasih atas partisipasi Anda dalam menjaga kebersihan dan keamanan lingkungan!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

