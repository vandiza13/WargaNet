import express from 'express';
import { 
    createLetterRequest, 
    getMyLetterRequests, 
    getAllLetterRequests, 
    updateLetterRequestStatus,
    uploadLetterFile,
    deleteLetterRequest
} from '../controllers/letterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
    .post(protect, createLetterRequest)
    .get(protect, admin, getAllLetterRequests);

router.get('/myrequests', protect, getMyLetterRequests);

router.route('/:id')
    .delete(protect, admin, deleteLetterRequest);

router.put('/:id/status', protect, admin, updateLetterRequestStatus);
router.put('/:id/upload', protect, admin, uploadLetterFile); // Rute untuk upload file

export default router;

