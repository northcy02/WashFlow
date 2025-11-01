// backend/routes/auth.js
import express from 'express';
import { 
  register, 
  login,
  unifiedLogin,
  getProfile,      // ✅ ต้องมี
  updateProfile,   // ✅ ต้องมี
  changePassword,  // ✅ ต้องมี
  deleteAccount    // ✅ ต้องมี
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/unified-login', unifiedLogin);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);
router.put('/change-password/:id', changePassword);
router.delete('/delete/:id', deleteAccount);

export default router;
