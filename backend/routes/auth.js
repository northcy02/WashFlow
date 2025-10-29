// backend/routes/auth.js
import express from 'express';
import { 
  register, 
  login,
  unifiedLogin, // ✅ เพิ่ม
  getProfile, 
  updateProfile,
  changePassword,
  deleteAccount
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login); // เก่า - ใช้สำหรับ customer เท่านั้น
router.post('/unified-login', unifiedLogin); // ✅ ใหม่ - รองรับทั้ง customer และ employee
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);
router.put('/change-password/:id', changePassword);
router.delete('/delete/:id', deleteAccount);

export default router;
