// backend/routes/role.js
import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// GET All Roles
router.get('/all', (req, res) => {
  console.log('📥 GET /api/role/all');

  const sql = 'SELECT * FROM Role ORDER BY Role_name';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    console.log('✅ Loaded', results.length, 'roles');
    res.json({ success: true, roles: results });
  });
});

// CREATE Role
router.post('/create', (req, res) => {
  const { Role_name, salary } = req.body;

  if (!Role_name || !salary) {
    return res.status(400).json({ 
      success: false, 
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
    });
  }

  const sql = 'INSERT INTO Role (Role_name, salary) VALUES (?, ?)';
  
  db.query(sql, [Role_name, salary], (err, result) => {
    if (err) {
      console.error('❌ Create Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Cannot create role' 
      });
    }
    
    console.log('✅ Created role ID:', result.insertId);
    res.json({ success: true, role_id: result.insertId });
  });
});

export default router;
