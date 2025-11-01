// backend/routes/index.js
import express from 'express';
import authRoutes from './auth.js';
import bookingRoutes from './booking.js';
import employeeRoutes from './employee.js';
import bookingManagementRoutes from './bookingManagement.js';
import branchRoutes from './branch.js';
import roleRoutes from './role.js';
import paymentRoutes from './payment.js';  // ✅ เพิ่ม Payment Routes
import membershipRoutes from './membership.js';

const router = express.Router();

// ========================================
// ROOT - API Information
// ========================================
router.get('/', (req, res) => {
  res.json({ 
    message: 'WashFlow API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      // Authentication
      auth: {
        register: {
          method: 'POST',
          path: '/api/auth/register',
          description: 'สมัครสมาชิกใหม่'
        },
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'เข้าสู่ระบบลูกค้า'
        },
        unifiedLogin: {
          method: 'POST',
          path: '/api/auth/unified-login',
          description: 'เข้าสู่ระบบรวม (ลูกค้า + พนักงาน)'
        },
        getProfile: {
          method: 'GET',
          path: '/api/auth/profile/:id',
          description: 'ดูข้อมูลโปรไฟล์'
        },
        updateProfile: {
          method: 'PUT',
          path: '/api/auth/profile/:id',
          description: 'แก้ไขโปรไฟล์'
        },
        changePassword: {
          method: 'PUT',
          path: '/api/auth/change-password/:id',
          description: 'เปลี่ยนรหัสผ่าน'
        },
        deleteAccount: {
          method: 'DELETE',
          path: '/api/auth/delete/:id',
          description: 'ลบบัญชี'
        }
      },
      // Booking
      booking: {
        create: {
          method: 'POST',
          path: '/api/booking/create',
          description: 'สร้างการจองใหม่'
        },
        history: {
          method: 'GET',
          path: '/api/booking/history/:customerId',
          description: 'ประวัติการจองของลูกค้า'
        },
        allBookings: {
          method: 'GET',
          path: '/api/booking/all-bookings',
          description: 'ดึงการจองทั้งหมด (สำหรับเช็คเวลา)'
        },
        checkAvailability: {
          method: 'GET',
          path: '/api/booking/check-availability',
          description: 'เช็คเวลาที่ถูกจองในวันนั้น'
        },
        cancel: {
          method: 'PUT',
          path: '/api/booking/cancel/:id',
          description: 'ยกเลิกการจอง'
        }
      },
      // Employee
      employee: {
        login: {
          method: 'POST',
          path: '/api/employee/login',
          description: 'เข้าสู่ระบบพนักงาน'
        },
        profile: {
          method: 'GET',
          path: '/api/employee/profile/:id',
          description: 'ดูข้อมูลพนักงาน'
        },
        all: {
          method: 'GET',
          path: '/api/employee/all',
          description: 'ดูพนักงานทั้งหมด'
        },
        create: {
          method: 'POST',
          path: '/api/employee/create',
          description: 'เพิ่มพนักงานใหม่'
        },
        update: {
          method: 'PUT',
          path: '/api/employee/update/:id',
          description: 'แก้ไขข้อมูลพนักงาน'
        },
        delete: {
          method: 'DELETE',
          path: '/api/employee/delete/:id',
          description: 'ลบพนักงาน'
        }
      },
      // Booking Management
      management: {
        bookings: {
          method: 'GET',
          path: '/api/management/booking/all',
          description: 'ดูการจองทั้งหมด (พนักงาน)',
          params: 'status (optional)'
        },
        updateStatus: {
          method: 'PUT',
          path: '/api/management/booking/status/:id',
          description: 'อัพเดทสถานะการจอง'
        },
        stats: {
          method: 'GET',
          path: '/api/management/booking/stats',
          description: 'สถิติการจอง'
        },
        revenue: {
          method: 'GET',
          path: '/api/management/booking/revenue',
          description: 'รายได้และสถิติการชำระเงิน'
        }
      },
      // Payment
      payment: {
        all: {
          method: 'GET',
          path: '/api/payment/all',
          description: 'ดูรายการชำระเงินทั้งหมด'
        },
        getById: {
          method: 'GET',
          path: '/api/payment/:id',
          description: 'ดูข้อมูลการชำระเงินตาม ID'
        },
        process: {
          method: 'POST',
          path: '/api/payment/process',
          description: 'รับชำระเงิน',
          body: {
            booking_id: 'number (required)',
            payment_method: 'string (cash/card/qr) (required)',
            received_amount: 'number (optional)',
            change_amount: 'number (optional)',
            notes: 'string (optional)',
            employee_id: 'number (optional)'
          }
        },
        refund: {
          method: 'POST',
          path: '/api/payment/refund',
          description: 'คืนเงิน',
          body: {
            payment_id: 'number (required)',
            employee_id: 'number (optional)'
          }
        }
      },
      // Branch
      branch: {
        all: {
          method: 'GET',
          path: '/api/branch/all',
          description: 'ดูสาขาทั้งหมด'
        },
        create: {
          method: 'POST',
          path: '/api/branch/create',
          description: 'เพิ่มสาขาใหม่'
        }
      },
      // Role
      role: {
        all: {
          method: 'GET',
          path: '/api/role/all',
          description: 'ดูตำแหน่งทั้งหมด'
        },
        create: {
          method: 'POST',
          path: '/api/role/create',
          description: 'เพิ่มตำแหน่งใหม่'
        }
      }
    },
    // ✅ เพิ่ม Documentation
    documentation: {
      swagger: '/api-docs',
      postman: 'https://documenter.getpostman.com/...'
    }
  });
});

// ========================================
// HEALTH CHECK
// ========================================
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ========================================
// REGISTER ROUTES
// ========================================
router.use('/auth', authRoutes);
router.use('/booking', bookingRoutes);
router.use('/employee', employeeRoutes);
router.use('/management/booking', bookingManagementRoutes);
router.use('/branch', branchRoutes);
router.use('/role', roleRoutes);
router.use('/payment', paymentRoutes);  // ✅ เพิ่ม Payment Routes
router.use('/membership', membershipRoutes);  // ✅ เพิ่ม

// ========================================
// 404 HANDLER
// ========================================
router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    requestedPath: req.originalUrl,
    availableEndpoints: [
      '/api/auth/*',
      '/api/booking/*',
      '/api/employee/*',
      '/api/management/booking/*',
      '/api/branch/*',
      '/api/role/*',
      '/api/payment/*'
    ],
    documentation: '/api'
  });
});

export default router;
