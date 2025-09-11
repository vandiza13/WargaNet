import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Plus, Search, MessageSquare } from 'lucide-react';

const ForumPage = ({ onNavigate }) => {
    const [threads, setThreads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', content: '', category: 'Umum' });

    const fetchThreads = async () => {
        try {
            const { data } = await API.get('/forum');
            setThreads(data);
        } catch (error) {
            console.error("Gagal memuat topik forum:", error);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    const handleSave = async () => {
        if (!newThread.title || !newThread.content) {
            alert("Judul dan Isi Topik tidak boleh kosong.");
            return;
        }
        await API.post('/forum', newThread);
        fetchThreads();
        setIsModalOpen(false);
        setNewThread({ title: '', content: '', category: 'Umum' });
    };

    const filteredThreads = threads.filter(thread =>
        thread.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Forum Diskusi</h1>
                    <p className="text-gray-500 mt-1">Tempat berbagi ide dan informasi antar warga.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                    <Plus size={16} className="mr-2" /> Buat Topik Baru
                </button>
            </div>
            
            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari topik diskusi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-primary-600"
                />
            </div>

            {/* Threads List */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="space-y-2">
                    {filteredThreads.map(thread => (
                        <div key={thread._id} onClick={() => onNavigate(`forum/${thread._id}`)} className="p-4 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <MessageSquare className="w-6 h-6 text-primary-600" />
                                <div>
                                    <p className="font-semibold text-gray-800">{thread.title}</p>
                                    <p className="text-sm text-gray-500">
                                        Oleh {thread.author.nama} • {new Date(thread.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg">{thread.posts.length}</p>
                                <p className="text-xs text-gray-500">Balasan</p>
                            </div>
                        </div>
                    ))}
                    {filteredThreads.length === 0 && (
                        <div className="text-center py-12">
                            <Search className="mx-auto text-gray-300" size={48}/>
                            <h3 className="mt-2 text-lg font-medium text-gray-800">Tidak Ditemukan</h3>
                            <p className="mt-1 text-sm text-gray-500">Topik yang Anda cari tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Topik Baru" icon="MessageSquare">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Judul Topik</label>
                        <input type="text" value={newThread.title} onChange={e => setNewThread({ ...newThread, title: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                     <div>
                        <label className="text-sm font-medium">Kategori</label>
                        <select value={newThread.category} onChange={e => setNewThread({ ...newThread, category: e.target.value })} className="w-full p-2 border rounded-lg mt-1 bg-white">
                            <option>Umum</option>
                            <option>Lingkungan</option>
                            <option>Keamanan</option>
                            <option>Olahraga</option>
                            <option>UMKM</option>
                            <option>Pendidikan</option>
                            <option>Kesehatan</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium">Isi Topik</label>
                        <textarea rows="4" value={newThread.content} onChange={e => setNewThread({ ...newThread, content: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Publikasikan Topik</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default ForumPage;
