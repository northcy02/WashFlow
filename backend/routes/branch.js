// backend/routes/branch.js

import express from 'express';
import {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchStats,
  getBranchesWithStats
} from '../controllers/branchController.js';
import { requireManager } from '../middleware/auth.js';

// Protected routes
router.post('/create', requireManager, createBranch);
router.put('/update/:id', requireManager, updateBranch);
router.delete('/delete/:id', requireManager, deleteBranch);

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

// GET All Branches
router.get('/all', getAllBranches);

// GET Branches with Stats (for overview)
router.get('/with-stats', getBranchesWithStats);

// GET Branch by ID
router.get('/:id', getBranchById);

// GET Branch Stats
router.get('/:id/stats', getBranchStats);

// ========================================
// ADMIN/MANAGER ROUTES (ควรเพิ่ม auth middleware)
// ========================================

// CREATE Branch
router.post('/create', createBranch);

// UPDATE Branch
router.put('/update/:id', updateBranch);

// DELETE Branch (Soft Delete)
router.delete('/delete/:id', deleteBranch);

// ========================================
// HEALTH CHECK
// ========================================
router.get('/health/check', (req, res) => {
  res.json({
    success: true,
    message: 'Branch API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
