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

const router = express.Router();

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

// ========================================
// PUBLIC ROUTES
// ========================================

// GET All Branches
router.get('/all', getAllBranches);

// GET Branches with Stats (for overview)
router.get('/with-stats', getBranchesWithStats);

// GET Branch Stats
router.get('/:id/stats', getBranchStats);

// GET Branch by ID
router.get('/:id', getBranchById);

// ========================================
// ADMIN/MANAGER ROUTES (No auth for now)
// ========================================

// CREATE Branch
router.post('/create', createBranch);

// UPDATE Branch
router.put('/update/:id', updateBranch);

// DELETE Branch (Soft Delete)
router.delete('/delete/:id', deleteBranch);

export default router;
