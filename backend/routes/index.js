// backend/routes/index.js
import express from 'express';
import authRoutes from './auth.js';
import bookingRoutes from './booking.js';
import employeeRoutes from './employee.js';
import bookingManagementRoutes from './bookingManagement.js';
import branchRoutes from './branch.js';
import roleRoutes from './role.js';
import paymentRoutes from './payment.js';  // ✅ เพิ่มบรรทัดนี้

const router = express.Router();

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
        login: 'POST /api/employee/login',
        profile: 'GET /api/employee/profile/:id',
        all: 'GET /api/employee/all',
        create: 'POST /api/employee/create',
        update: 'PUT /api/employee/update/:id',
        delete: 'DELETE /api/employee/delete/:id'
      },
      management: {
        bookings: 'GET /api/management/booking/all',
        updateStatus: 'PUT /api/management/booking/status/:id',
        stats: 'GET /api/management/booking/stats',
        revenue: 'GET /api/management/booking/revenue'
      },
      branch: {
        all: 'GET /api/branch/all',
        create: 'POST /api/branch/create'
      },
      role: {
        all: 'GET /api/role/all',
        create: 'POST /api/role/create'
      },
      payment: {  // ✅ เพิ่ม
        all: 'GET /api/payment/all',
        getById: 'GET /api/payment/:id',
        process: 'POST /api/payment/process',
        refund: 'POST /api/payment/refund'
      }
    }
  });
});

router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ✅ Register Routes
router.use('/auth', authRoutes);
router.use('/booking', bookingRoutes);
router.use('/employee', employeeRoutes);
router.use('/management/booking', bookingManagementRoutes);
router.use('/branch', branchRoutes);
router.use('/role', roleRoutes);
router.use('/payment', paymentRoutes);  // ✅ เพิ่มบรรทัดนี้

export default router;
