import ForumThread from '../models/ForumThread.js';
import ForumPost from '../models/ForumPost.js';

export const createThread = async (req, res) => {
    const { title, content, category } = req.body;
    const thread = new ForumThread({
        title,
        content,
        category,
        author: req.user._id,
    });
    const createdThread = await thread.save();
    res.status(201).json(createdThread);
};

export const getThreads = async (req, res) => {
    const threads = await ForumThread.find({}).sort({ createdAt: -1 }).populate('author', 'nama').populate('posts');
    res.json(threads);
};

export const getThreadById = async (req, res) => {
    const thread = await ForumThread.findById(req.params.id)
        .populate('author', 'nama')
        .populate({
            path: 'posts',
            populate: { path: 'author', select: 'nama' }
        });
    if (thread) {
        res.json(thread);
    } else {
        res.status(404).json({ message: 'Thread tidak ditemukan' });
    }
};

export const createPost = async (req, res) => {
    const { content } = req.body;
    const thread = await ForumThread.findById(req.params.id);
    if (thread) {
        const post = new ForumPost({
            content,
            author: req.user._id,
            thread: req.params.id,
        });
        const createdPost = await post.save();
        thread.posts.push(createdPost._id);
        await thread.save();
        res.status(201).json(createdPost);
    } else {
        res.status(404).json({ message: 'Thread tidak ditemukan' });
    }
};
