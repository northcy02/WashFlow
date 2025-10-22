import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.json({ 
    message: 'WashFlow API Server',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login'
    }
  });
});

// Auth routes
router.use('/auth', authRoutes);

export default router;