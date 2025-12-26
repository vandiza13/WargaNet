import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import { Plus, Search, MessageSquare, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const ForumPage = () => {
    const [threads, setThreads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newThread, setNewThread] = useState({ title: '', content: '', category: 'Umum' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const fetchThreads = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get('/forum');
            setThreads(data || []);
        } catch (error) {
            console.error("Gagal memuat topik forum:", error);
        } finally {
            setIsLoading(false);
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
        try {
            await API.post('/forum', newThread);
            fetchThreads();
            setIsModalOpen(false);
            setNewThread({ title: '', content: '', category: 'Umum' });
        } catch (error) {
            alert(error.message || 'Gagal membuat thread');
        }
    };

    const filteredThreads = threads.filter(thread =>
        thread.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Forum Diskusi"
                subtitle="Berbagi cerita dan diskusi dengan warga lainnya"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Forum', path: '/forum' }
                ]}
                icon={MessageSquare}
                actions={[
                    {
                        label: 'Buat Thread',
                        icon: Plus,
                        onClick: () => setIsModalOpen(true)
                    }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari topik diskusi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Memuat forum...</p>
                    </div>
                ) : filteredThreads.length > 0 ? (
                    <div className="space-y-4">
                        {filteredThreads.map(thread => (
                            <div
                              key={thread._id}
                              onClick={() => navigate(`/forum/${thread._id}`)}
                              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                            >
                              <h3 className="text-lg font-bold text-gray-900 mb-4">{thread.title}</h3>
                              
                              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <User size={16} />
                                  {thread.author?.nama || 'Anonymous'}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  {new Date(thread.createdAt).toLocaleDateString('id-ID')}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageSquare size={16} />
                                  {thread.posts?.length || 0} balasan
                                </div>
                              </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <MessageSquare className="mx-auto text-gray-300 mb-4" size={48}/>
                        <h3 className="text-lg font-medium text-gray-800">Tidak Ada Topik</h3>
                        <p className="text-gray-500 text-sm mt-2">Jadilah yang pertama membuat topik diskusi!</p>
                    </div>
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Topik Baru" icon={MessageSquare}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Judul Topik</label>
                            <input type="text" placeholder="Tulis judul yang menarik..." value={newThread.title} onChange={e => setNewThread({ ...newThread, title: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">Kategori</label>
                            <select value={newThread.category} onChange={e => setNewThread({ ...newThread, category: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
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
                            <label className="text-sm font-medium text-gray-700 block mb-2">Isi Topik</label>
                            <textarea rows="5" placeholder="Jelaskan topik Anda dengan detail..." value={newThread.content} onChange={e => setNewThread({ ...newThread, content: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors">Batal</button>
                            <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Publikasikan</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
export default ForumPage;
