import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ArrowLeft, Send } from 'lucide-react';

const ThreadDetailPage = ({ threadId, onNavigate }) => {
    const [thread, setThread] = useState(null);
    const [newPost, setNewPost] = useState('');

    const fetchThread = async () => {
        try {
            const { data } = await API.get(`/forum/${threadId}`);
            setThread(data);
        } catch (error) {
            console.error("Gagal memuat thread:", error);
        }
    };

    useEffect(() => {
        fetchThread();
    }, [threadId]);

    const handlePost = async () => {
        if (!newPost.trim()) return;
        await API.post(`/forum/${threadId}/posts`, { content: newPost });
        setNewPost('');
        fetchThread();
    };

    if (!thread) {
        return <div className="text-center p-8">Memuat diskusi...</div>;
    }

    return (
        <div className="animate-fade-in-up">
            <button onClick={() => onNavigate('forum')} className="flex items-center text-blue-600 mb-6 font-semibold">
                <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Forum
            </button>
            
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <h1 className="text-3xl font-bold text-slate-800">{thread.title}</h1>
                <p className="text-sm text-slate-500 mt-2">Oleh {thread.author.nama} pada {new Date(thread.createdAt).toLocaleDateString('id-ID')}</p>
                <p className="mt-4 text-slate-700">{thread.content}</p>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Balasan</h2>
            <div className="space-y-4 mb-6">
                {thread.posts.map(post => (
                    <div key={post._id} className="bg-white p-4 rounded-xl shadow-sm">
                        <p className="font-semibold text-slate-800">{post.author.nama}</p>
                        <p className="text-sm text-slate-500 mb-2">{new Date(post.createdAt).toLocaleString('id-ID')}</p>
                        <p className="text-slate-700">{post.content}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="font-bold mb-2">Tulis Balasan Anda</h3>
                <div className="flex">
                    <textarea 
                        rows="3" 
                        className="w-full p-2 border rounded-lg mr-2"
                        value={newPost}
                        onChange={e => setNewPost(e.target.value)}
                    ></textarea>
                    <button onClick={handlePost} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ThreadDetailPage;
