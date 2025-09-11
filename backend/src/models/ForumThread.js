import mongoose from 'mongoose';

const forumThreadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, default: 'Umum' },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost' }],
}, { timestamps: true });

const ForumThread = mongoose.model('ForumThread', forumThreadSchema);
export default ForumThread;
