// backend/routes/employee.js
import express from 'express';
import {
  login,
  getProfile,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';

const router = express.Router();

// ========================================
// EMPLOYEE ROUTES
// ========================================

// Authentication
router.post('/login', login);

// Profile
router.get('/profile/:id', getProfile);

// Management (CRUD)
router.get('/all', getAllEmployees);
router.post('/create', createEmployee);
router.put('/update/:id', updateEmployee);
router.delete('/delete/:id', deleteEmployee);

export default router;
