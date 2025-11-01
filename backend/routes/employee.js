import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// GET All Positions
router.get('/all', (req, res) => {
  console.log('📥 GET /api/position/all');

  const sql = 'SELECT * FROM employee_position ORDER BY pos_name';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    console.log('✅ Loaded', results.length, 'positions');
    res.json({ success: true, positions: results });
  });
});

// CREATE Position
router.post('/create', (req, res) => {
  const { pos_name, pos_salary } = req.body;

  if (!pos_name || !pos_salary) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const sql = 'INSERT INTO employee_position (pos_name, pos_salary) VALUES (?, ?)';
  
  db.query(sql, [pos_name, pos_salary], (err, result) => {
    if (err) {
      console.error('❌ Create Error:', err);
      return res.status(500).json({ success: false, message: 'Cannot create position' });
    }
    
    console.log('✅ Created position ID:', result.insertId);
    res.json({ success: true, pos_id: result.insertId });
  });
});

// UPDATE Employee
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { emp_fname, emp_lname, emp_address, branch_ID, pos_ID } = req.body;

  const sql = `
    UPDATE employee 
    SET emp_fname = ?, emp_lname = ?, emp_address = ?, branch_ID = ?, pos_ID = ? 
    WHERE emp_ID = ?
  `;
  
  db.query(sql, [emp_fname, emp_lname, emp_address, branch_ID, pos_ID, id], (err, result) => {
    if (err) {
      console.error('❌ Update Error:', err);
      return res.status(500).json({ success: false, message: 'Cannot update employee' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบพนักงาน' });
    }
    
    console.log('✅ Updated employee ID:', id);
    res.json({ success: true });
  });
});
// ========================================
// DELETE Employee
// ========================================
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  console.log('🗑️ Delete Employee ID:', id);

  db.query('DELETE FROM employee WHERE emp_ID = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Delete Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Cannot delete employee' 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบพนักงาน' 
      });
    }
    
    console.log('✅ Deleted employee ID:', id);
    res.json({ success: true });
  });
});

export default router;
