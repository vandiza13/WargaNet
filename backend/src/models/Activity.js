import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, default: 'Fasilitas Umum' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gallery: [{ type: String }], // Array of image URLs
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
