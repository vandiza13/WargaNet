import express from 'express';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../controllers/transactionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
    .get(protect, getTransactions)
    .post(protect, admin, createTransaction);
    
router.route('/:id')
    .put(protect, admin, updateTransaction)
    .delete(protect, admin, deleteTransaction);

export default router;