// backend/routes/membership.js
import express from 'express';
import {
  getMembershipInfo,
  getPointHistory,
  getAllTiers
} from '../controllers/membershipController.js';

const router = express.Router();

router.get('/info/:customerId', getMembershipInfo);
router.get('/points/:customerId', getPointHistory);
router.get('/tiers', getAllTiers);

export default router;
