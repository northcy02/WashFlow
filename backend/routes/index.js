// backend/routes/index.js
import express from 'express';
import authRoutes from './auth.js';
import bookingRoutes from './booking.js';
import employeeRoutes from './employee.js';
import bookingManagementRoutes from './bookingManagement.js';

const router = express.Router();

// ✅ Root Route
router.get('/', (req, res) => {
  res.json({ 
    message: 'WashFlow API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        unifiedLogin: 'POST /api/auth/unified-login',
        getProfile: 'GET /api/auth/profile/:id',
        updateProfile: 'PUT /api/auth/profile/:id',
        changePassword: 'PUT /api/auth/change-password/:id',
        deleteAccount: 'DELETE /api/auth/delete/:id'
      },
      booking: {
        create: 'POST /api/booking/create',
        history: 'GET /api/booking/history/:customerId',
        cancel: 'PUT /api/booking/cancel/:id'
      },
      employee: {
        dashboard: 'GET /api/employee/dashboard'
      },
      management: {
        allBookings: 'GET /api/management/booking/all',
        updateStatus: 'PUT /api/management/booking/status/:id',
        stats: 'GET /api/management/booking/stats',
        revenue: 'GET /api/management/booking/revenue'
      }
    }
  });
});

// ✅ Health Check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ✅ Routes - ไม่ต้องเพิ่ม router.post('/create') เพราะมีใน bookingRoutes แล้ว
router.use('/auth', authRoutes);
router.use('/booking', bookingRoutes);
router.use('/employee', employeeRoutes);
router.use('/management/booking', bookingManagementRoutes);

// ❌ ลบบรรทัดนี้ออก
// router.post('/create')

export default router;
