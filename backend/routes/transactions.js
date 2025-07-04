// routes/transactions.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '../controllers/transactionsController.js';

const router = express.Router();

// Routes are protected using JWT middleware
router
  .route('/')
  .get(protect, getTransactions)   // GET /api/transactions - fetch all user transactions
  .post(protect, addTransaction); // POST /api/transactions - create a new transaction

router
  .route('/:id')
  .put(protect, updateTransaction)    // PUT /api/transactions/:id - update one
  .delete(protect, deleteTransaction); // DELETE /api/transactions/:id - delete one

export default router;
