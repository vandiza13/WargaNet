import express from 'express';
import { 
    getActivities, 
    createActivity, 
    updateActivity, 
    deleteActivity, 
    rsvpActivity, 
    addActivityGalleryImage 
} from '../controllers/activityController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
    .get(protect, getActivities)
    .post(protect, admin, createActivity);

router.route('/:id')
    .put(protect, admin, updateActivity)
    .delete(protect, admin, deleteActivity);

router.put('/:id/rsvp', protect, rsvpActivity);
router.post('/:id/gallery', protect, admin, addActivityGalleryImage);

export default router;
