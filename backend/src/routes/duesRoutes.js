import express from 'express';
import { generateDues, getAllDues, getMyDues, payDues } from '../controllers/duesController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(protect, admin, getAllDues);
router.post('/generate', protect, admin, generateDues);
router.get('/mydues', protect, getMyDues);
router.put('/:id/pay', protect, admin, payDues);

export default router;
