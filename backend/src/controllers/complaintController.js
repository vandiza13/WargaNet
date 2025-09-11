import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res) => {
    const { title, description } = req.body;
    const complaint = new Complaint({
        title,
        description,
        user: req.user._id,
    });
    const createdComplaint = await complaint.save();
    res.status(201).json(createdComplaint);
};

export const getMyComplaints = async (req, res) => {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
};

export const getAllComplaints = async (req, res) => {
    const complaints = await Complaint.find({}).sort({ createdAt: -1 }).populate('user', 'nama noRumah');
    res.json(complaints);
};

export const updateComplaintStatus = async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);
    if (complaint) {
        complaint.status = req.body.status;
        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } else {
        res.status(404).json({ message: 'Complaint not found' });
    }
};

export const deleteComplaint = async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);
    if (complaint) {
        await complaint.deleteOne();
        res.json({ message: 'Keluhan berhasil dihapus' });
    } else {
        res.status(404).json({ message: 'Keluhan tidak ditemukan' });
    }
};
