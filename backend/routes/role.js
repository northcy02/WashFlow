// backend/routes/role.js (แก้ไขใหม่ทั้งไฟล์)
import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// GET All Positions (แทน Roles)
router.get('/all', (req, res) => {
  console.log('📥 GET /api/role/all');

  const sql = 'SELECT pos_ID as Role_ID, pos_name as role_name, pos_salary as salary FROM employee_position ORDER BY pos_name';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    console.log('✅ Loaded', results.length, 'roles');
    res.json({ success: true, roles: results });
  });
});

// CREATE Position (แทน Role)
router.post('/create', (req, res) => {
  const { role_name, salary } = req.body;

  if (!role_name || !salary) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const sql = 'INSERT INTO employee_position (pos_name, pos_salary) VALUES (?, ?)';
  
  db.query(sql, [role_name, salary], (err, result) => {
    if (err) {
      console.error('❌ Create Error:', err);
      return res.status(500).json({ success: false, message: 'Cannot create role' });
    }
    
    console.log('✅ Created role ID:', result.insertId);
    res.json({ success: true, role_id: result.insertId });
  });
});

export default router;
