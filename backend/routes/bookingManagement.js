// backend/routes/bookingManagement.js
import express from 'express';
import { 
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
  getRevenue
} from '../controllers/bookingManagementController.js';

const router = express.Router();

router.get('/all', getAllBookings);
router.put('/status/:id', updateBookingStatus);
router.get('/stats', getBookingStats);
router.get('/revenue', getRevenue);

export default router;
