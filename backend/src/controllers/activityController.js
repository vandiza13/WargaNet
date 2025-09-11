import Activity from '../models/Activity.js';

export const getActivities = async (req, res) => {
    const activities = await Activity.find({}).sort({ date: -1 }).populate('author', 'nama');
    res.json(activities);
};

export const createActivity = async (req, res) => {
    const { title, description, date, location } = req.body;
    const activity = new Activity({
        title,
        description,
        date,
        location,
        author: req.user._id,
    });
    const createdActivity = await activity.save();
    res.status(201).json(createdActivity);
};

export const updateActivity = async (req, res) => {
    const { title, description, date, location } = req.body;
    const activity = await Activity.findById(req.params.id);

    if (activity) {
        activity.title = title;
        activity.description = description;
        activity.date = date;
        activity.location = location;
        const updatedActivity = await activity.save();
        res.json(updatedActivity);
    } else {
        res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    }
};

export const deleteActivity = async (req, res) => {
    const activity = await Activity.findById(req.params.id);
    if (activity) {
        await activity.deleteOne();
        res.json({ message: 'Kegiatan berhasil dihapus' });
    } else {
        res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    }
};

export const rsvpActivity = async (req, res) => {
    const activity = await Activity.findById(req.params.id);
    if (activity) {
        if (activity.participants.includes(req.user._id)) {
            return res.status(400).json({ message: 'Anda sudah terdaftar pada kegiatan ini' });
        }
        activity.participants.push(req.user._id);
        await activity.save();
        res.json({ message: 'Berhasil mendaftar' });
    } else {
        res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    }
};

export const addActivityGalleryImage = async (req, res) => {
    const { imageUrl } = req.body;
    const activity = await Activity.findById(req.params.id);
    if (activity) {
        activity.gallery.push(imageUrl);
        await activity.save();
        res.json(activity);
    } else {
        res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    }
};
