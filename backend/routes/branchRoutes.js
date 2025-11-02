// backend/routes/branchRoutes.js

import express from 'express';
import { getAllBranches, getBranchById } from '../controllers/branchController.js';

const router = express.Router();

router.get('/all', getAllBranches);
router.get('/:id', getBranchById);

export default router;
