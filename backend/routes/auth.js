import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/authController.js';

const router = express.Router();

// Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Profile Routes
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);

// ✅ Password & Account Routes
router.put('/change-password/:id', changePassword);
router.delete('/delete/:id', deleteAccount);

export default router;