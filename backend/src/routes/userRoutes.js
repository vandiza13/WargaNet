import express from 'express';
import { 
    getAllUsers, 
    approveUser, 
    updateUserProfile, 
    getPublicDirectory, 
    updateUserRole, 
    updateUserProfilePicture,
    getAdminStats,
    getWargaStats,
    deleteUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

// Rute Admin
router.get('/', protect, admin, getAllUsers);
router.get('/stats', protect, admin, getAdminStats);
router.put('/:id/approve', protect, admin, approveUser);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);


router.get('/stats-warga', protect, getWargaStats); 
router.get('/directory', protect, getPublicDirectory);
router.put('/profile', protect, updateUserProfile);
router.put('/profile/picture', protect, updateUserProfilePicture);

export default router;