// backend/routes/booking.js
import express from 'express';
import { 
  createBooking, 
  getBookingHistory,
  cancelBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// ✅ Routes
router.post('/create', createBooking);           // POST /api/booking/create
router.get('/history/:customerId', getBookingHistory); // GET /api/booking/history/:id
router.put('/cancel/:id', cancelBooking);        // PUT /api/booking/cancel/:id

export default router;
