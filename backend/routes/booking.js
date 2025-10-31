// backend/routes/booking.js
import express from 'express';
import { 
  createBooking, 
  getBookingHistory,
  cancelBooking,
  getAllActiveBookings  // ✅ เพิ่ม
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/create', createBooking);
router.get('/history/:customerId', getBookingHistory);
router.put('/cancel/:id', cancelBooking);
router.get('/all-bookings', getAllActiveBookings);  // ✅ เพิ่ม

export default router;