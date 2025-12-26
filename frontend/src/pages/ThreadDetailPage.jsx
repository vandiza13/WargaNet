import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ArrowLeft, Send, User, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const ThreadDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [thread, setThread] = useState(null);
    const [newPost, setNewPost] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchThread = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get(`/forum/${id}`);
            setThread(data);
        } catch (error) {
            console.error("Gagal memuat thread:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchThread();
    }, [id]);

    const handlePost = async () => {
        if (!newPost.trim()) return;
        try {
            await API.post(`/forum/${id}/posts`, { content: newPost });
            setNewPost('');
            fetchThread();
        } catch (error) {
            alert(error.message || 'Gagal mengirim balasan');
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Memuat diskusi...</div>;
    }

    if (!thread) {
        return (
            <div className="min-h-screen bg-gray-50">
                <PageHeader title="Thread Tidak Ditemukan" icon={ArrowLeft} />
                <div className="text-center p-8">
                    <p className="text-gray-500 mb-4">Diskusi yang Anda cari tidak ditemukan.</p>
                    <button onClick={() => navigate('/forum')} className="text-blue-600 hover:underline">Kembali ke Forum</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Detail Diskusi"
                icon={ArrowLeft}
                actions={[
                    {
                        label: 'Kembali',
                        icon: ArrowLeft,
                        onClick: () => navigate('/forum'),
                        variant: 'secondary'
                    }
                ]}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                {/* Thread */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{thread.title}</h1>
                    <div className="flex gap-6 text-sm text-gray-600 mb-6 pb-6 border-b flex-wrap">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>Oleh: <strong>{thread.author?.nama || 'Anonymous'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(thread.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{thread.content}</p>
                </div>

                {/* Replies */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 Balasan ({thread.posts?.length || 0})</h2>
                    {thread.posts && thread.posts.length > 0 ? (
                        <div className="space-y-4">
                            {thread.posts.map((post) => (
                                <div key={post._id} className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{post.author?.nama || 'Anonymous'}</p>
                                                <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">Belum ada balasan. Jadilah yang pertama membalas!</p>
                    )}
                </div>

                {/* Reply Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Balas Diskusi</h3>
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Tulis balasan Anda..."
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4 resize-none"
                    ></textarea>
                    <button
                        onClick={handlePost}
                        disabled={!newPost.trim()}
                        className="flex items-center gap-2 bg-blue-600 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Send size={20} />
                        Kirim Balasan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThreadDetailPage;
