import Notification from '../models/Notification.js';

export const getMyNotifications = async (req, res) => {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    res.json(notifications);
};

export const markAsRead = async (req, res) => {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'Notifikasi ditandai telah dibaca' });
};
