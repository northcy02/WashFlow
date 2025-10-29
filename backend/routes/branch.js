// backend/routes/branch.js
import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// GET All Branches
router.get('/all', (req, res) => {
  console.log('📥 GET /api/branch/all');

  const sql = 'SELECT * FROM branch ORDER BY branch_name';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    console.log('✅ Loaded', results.length, 'branches');
    res.json({ success: true, branches: results });
  });
});

// CREATE Branch
router.post('/create', (req, res) => {
  const { branch_name, branch_address } = req.body;

  if (!branch_name) {
    return res.status(400).json({ 
      success: false, 
      message: 'กรุณากรอกชื่อสาขา' 
    });
  }

  const sql = 'INSERT INTO branch (branch_name, branch_address) VALUES (?, ?)';
  
  db.query(sql, [branch_name, branch_address], (err, result) => {
    if (err) {
      console.error('❌ Create Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Cannot create branch' 
      });
    }
    
    console.log('✅ Created branch ID:', result.insertId);
    res.json({ success: true, branch_id: result.insertId });
  });
});

export default router;
