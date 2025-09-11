import Announcement from '../models/Announcement.js';

export const getAnnouncements = async (req, res) => {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 }).populate('author', 'nama');
    res.json(announcements);
};

export const createAnnouncement = async (req, res) => {
    const { title, content, category } = req.body;
    const announcement = new Announcement({
        title,
        content,
        category,
        author: req.user._id,
    });
    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
};

export const updateAnnouncement = async (req, res) => {
    const { title, content, category } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        announcement.title = title;
        announcement.content = content;
        announcement.category = category;
        const updatedAnnouncement = await announcement.save();
        res.json(updatedAnnouncement);
    } else {
        res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
    }
};

export const deleteAnnouncement = async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);
    if (announcement) {
        await announcement.deleteOne();
        res.json({ message: 'Pengumuman berhasil dihapus' });
    } else {
        res.status(404).json({ message: 'Pengumuman tidak ditemukan' });
    }
};
