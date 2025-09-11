import express from 'express';
import { 
    createUmkm, 
    getMyUmkm, 
    getApprovedUmkms, 
    getAllUmkms, 
    updateUmkm,
    approveUmkm,
    deleteUmkm
} from '../controllers/umkmController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
    .post(protect, createUmkm)
    .get(protect, admin, getAllUmkms);

router.get('/myumkm', protect, getMyUmkm);
router.get('/directory', protect, getApprovedUmkms);

router.route('/:id')
    .put(protect, admin, updateUmkm)
    .delete(protect, admin, deleteUmkm);

router.put('/:id/approve', protect, admin, approveUmkm);

export default router;
