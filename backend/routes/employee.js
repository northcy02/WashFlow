// backend/routes/employee.js
import express from 'express';
import { 
  unifiedLogin, 
  getProfile 
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', unifiedLogin);
router.get('/profile/:id', getProfile);

export default router;
