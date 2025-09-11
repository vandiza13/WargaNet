import express from 'express';
import { createComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus, deleteComplaint } from '../controllers/complaintController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
    .post(protect, createComplaint)
    .get(protect, admin, getAllComplaints);

router.get('/mycomplaints', protect, getMyComplaints);

router.route('/:id')
    .delete(protect, admin, deleteComplaint);
    
router.put('/:id/status', protect, admin, updateComplaintStatus);

export default router;
