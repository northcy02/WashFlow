import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

// Test route - API Information
router.get('/', (req, res) => {
  res.json({ 
    message: 'WashFlow API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      // Authentication
      register: {
        method: 'POST',
        path: '/api/auth/register',
        description: 'สมัครสมาชิกใหม่',
        body: {
          username: 'string (required)',
          password: 'string (required)',
          cust_fname: 'string (required)',
          cust_lname: 'string (required)',
          cust_tel: 'string (optional)',
          cust_address: 'string (optional)'
        }
      },
      login: {
        method: 'POST',
        path: '/api/auth/login',
        description: 'เข้าสู่ระบบ',
        body: {
          username: 'string (required)',
          password: 'string (required)'
        }
      },
      getProfile: {
        method: 'GET',
        path: '/api/auth/profile/:id',
        description: 'ดูข้อมูลโปรไฟล์'
      },
      updateProfile: {
        method: 'PUT',
        path: '/api/auth/profile/:id',
        description: 'แก้ไขข้อมูลโปรไฟล์',
        body: {
          cust_fname: 'string',
          cust_lname: 'string',
          cust_tel: 'string',
          cust_address: 'string'
        }
      }
    }
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Auth routes
router.use('/auth', authRoutes);

export default router;