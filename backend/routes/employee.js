// backend/routes/employee.js
import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// ========================================
// GET All Employees
// ========================================
router.get('/all', (req, res) => {
  const sql = `
    SELECT 
      e.*,
      r.Role_name,
      r.salary,
      b.branch_name
    FROM employee e
    LEFT JOIN Role r ON e.role_ID = r.Role_ID
    LEFT JOIN branch b ON e.branch_ID = b.branch_ID
    ORDER BY e.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }
    
    console.log('✅ Loaded', results.length, 'employees');
    res.json({ success: true, employees: results });
  });
});

// ========================================
// CREATE Employee
// ========================================
router.post('/create', (req, res) => {
  const { 
    emp_fname, 
    emp_lname, 
    emp_address, 
    emp_username, 
    emp_password, 
    branch_ID, 
    role_ID 
  } = req.body;

  console.log('📥 Create Employee:', { emp_username, emp_fname, emp_lname });

  // Validate required fields
  if (!emp_fname || !emp_lname || !emp_username || !emp_password || !branch_ID || !role_ID) {
    return res.status(400).json({ 
      success: false, 
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน' 
    });
  }

  // Check duplicate username
  db.query('SELECT * FROM employee WHERE emp_username = ?', [emp_username], (err, existing) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username นี้มีอยู่แล้ว' 
      });
    }

    const sql = `
      INSERT INTO employee 
      (emp_fname, emp_lname, emp_address, emp_username, emp_password, branch_ID, role_ID) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      sql, 
      [emp_fname, emp_lname, emp_address, emp_username, emp_password, branch_ID, role_ID], 
      (err, result) => {
        if (err) {
          console.error('❌ Create Error:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Cannot create employee' 
          });
        }
        
        console.log('✅ Created employee ID:', result.insertId);
        res.json({ success: true, employee_id: result.insertId });
      }
    );
  });
});

// ========================================
// UPDATE Employee
// ========================================
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { emp_fname, emp_lname, emp_address, branch_ID, role_ID } = req.body;

  console.log('📝 Update Employee ID:', id);

  const sql = `
    UPDATE employee 
    SET emp_fname = ?, emp_lname = ?, emp_address = ?, branch_ID = ?, role_ID = ? 
    WHERE emp_ID = ?
  `;
  
  db.query(sql, [emp_fname, emp_lname, emp_address, branch_ID, role_ID, id], (err, result) => {
    if (err) {
      console.error('❌ Update Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Cannot update employee' 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบพนักงาน' 
      });
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
