import express from 'express';
import { createThread, getThreads, getThreadById, createPost } from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(protect, getThreads).post(protect, createThread);
router.route('/:id').get(protect, getThreadById);
router.route('/:id/posts').post(protect, createPost);

export default router;
