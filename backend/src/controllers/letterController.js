import LetterRequest from '../models/LetterRequest.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Pastikan folder untuk surat ada
const uploadDir = 'uploads/letters/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Multer untuk penyimpanan file surat
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage }).single('letterFile');

export const createLetterRequest = async (req, res) => {
    const { letterType, notes } = req.body;
    const request = new LetterRequest({
        letterType,
        notes,
        user: req.user._id,
    });
    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
};

export const getMyLetterRequests = async (req, res) => {
    const requests = await LetterRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
};

export const getAllLetterRequests = async (req, res) => {
    const requests = await LetterRequest.find({}).sort({ createdAt: -1 }).populate('user', 'nama noRumah email');
    res.json(requests);
};

export const updateLetterRequestStatus = async (req, res) => {
    const { status, adminNotes } = req.body;
    const request = await LetterRequest.findById(req.params.id);
    if (request) {
        request.status = status;
        request.adminNotes = adminNotes;
        const updatedRequest = await request.save();
        res.json(updatedRequest);
    } else {
        res.status(404).json({ message: 'Permohonan surat tidak ditemukan' });
    }
};

export const uploadLetterFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'Error uploading file.', error: err });
        }
        if (req.file == undefined) {
            return res.status(400).json({ message: 'No file selected.' });
        }
        
        try {
            const request = await LetterRequest.findById(req.params.id);
            if (request) {
                request.fileUrl = `/uploads/letters/${req.file.filename}`;
                request.status = 'Ready'; // Otomatis ubah status menjadi Ready setelah upload
                await request.save();
                res.json(request);
            } else {
                res.status(404).json({ message: 'Permohonan surat tidak ditemukan' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    });
};


export const deleteLetterRequest = async (req, res) => {
    const request = await LetterRequest.findById(req.params.id);
    if (request) {
        await request.deleteOne();
        res.json({ message: 'Permohonan surat berhasil dihapus' });
    } else {
        res.status(404).json({ message: 'Permohonan surat tidak ditemukan' });
    }
};

