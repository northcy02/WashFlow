// backend/controllers/employeeController.js
import db from '../config/database.js';

// ========================================
// 1. EMPLOYEE LOGIN
// ========================================
export const login = (req, res) => {
  console.log('');
  console.log('📥 ========== EMPLOYEE LOGIN ==========');
  console.log('Username:', req.body.username);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอก username และ password'
    });
  }

  const sql = `
    SELECT 
      e.emp_ID as id,
      e.emp_fname as firstName,
      e.emp_lname as lastName,
      e.emp_username as username,
      e.emp_password as password,
      e.emp_address as address,
      e.branch_ID as branchId,
      p.pos_name as role,  -- ✅ แก้ไข
      p.pos_ID as roleId,
      p.pos_salary as salary,
      b.branch_name as branchName,
      e.created_at
    FROM employee e
    LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID
    LEFT JOIN branch b ON e.branch_ID = b.branch_ID
    WHERE e.emp_username = ?
  `;


  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    if (results.length === 0) {
      console.log('⚠️ User not found:', username);
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const employee = results[0];

    if (employee.password !== password) {
      console.log('⚠️ Wrong password');
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const userData = {
      id: employee.id,
      username: employee.username,
      firstName: employee.firstName,
      lastName: employee.lastName,
      fullName: `${employee.firstName} ${employee.lastName}`,
      role: employee.role,
      roleId: employee.roleId,
      salary: employee.salary,
      branchId: employee.branchId,
      branchName: employee.branchName,
      address: employee.address || ''
    };

    console.log('✅ Login successful!');
    console.log('Employee ID:', employee.id);
    console.log('Position:', employee.role);
    console.log('Branch:', employee.branchName);
    console.log('======================================');

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ!',
      user: userData,
      employee: userData
    });
  });
};

// ========================================
// 2. GET EMPLOYEE PROFILE
// ========================================
export const getProfile = (req, res) => {
  const { id } = req.params;

  console.log('📥 GET Employee Profile ID:', id);

  const sql = `
    SELECT 
      e.emp_ID as id,
      e.emp_fname as firstName,
      e.emp_lname as lastName,
      e.emp_username as username,
      e.emp_address as address,
      e.branch_ID as branchId,
      p.pos_name as role,
      p.pos_ID as roleId,
      p.pos_salary as salary,
      b.branch_name as branchName,
      e.created_at
    FROM employee e
    LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID
    LEFT JOIN branch b ON e.branch_ID = b.branch_ID
    WHERE e.emp_ID = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลพนักงาน'
      });
    }

    const employee = results[0];
    employee.fullName = `${employee.firstName} ${employee.lastName}`;

    console.log('✅ Profile loaded:', employee.username);

    res.json({
      success: true,
      employee: employee
    });
  });
};

// ========================================
// 3. GET ALL EMPLOYEES
// ========================================
export const getAllEmployees = (req, res) => {
  console.log('📥 GET All Employees');

  const sql = `
    SELECT 
      e.emp_ID,
      e.emp_fname,
      e.emp_lname,
      e.emp_username,
      e.emp_address,
      e.branch_ID,
      e.pos_ID,
      p.pos_name as role_name,
      p.pos_salary as salary,
      b.branch_name,
      e.created_at
    FROM employee e
    LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID
    LEFT JOIN branch b ON e.branch_ID = b.branch_ID
    ORDER BY e.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    console.log('✅ Loaded', results.length, 'employees');

    res.json({
      success: true,
      employees: results
    });
  });
};

// ========================================
// 4. CREATE EMPLOYEE
// ========================================
export const createEmployee = (req, res) => {
  console.log('');
  console.log('📥 ========== CREATE EMPLOYEE ==========');
  console.log('Request body:', req.body);

  const { 
    emp_fname, 
    emp_lname, 
    emp_address, 
    emp_username, 
    emp_password,
    branch_ID,
    role_ID  // Frontend ส่งมาเป็น role_ID แต่จะใช้เป็น pos_ID
  } = req.body;

  // Validation
  if (!emp_fname || !emp_lname || !emp_username || !emp_password || !branch_ID || !role_ID) {
    console.log('❌ Validation Failed: Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
    });
  }

  if (emp_username.length < 4) {
    return res.status(400).json({
      success: false,
      message: 'Username ต้องมีอย่างน้อย 4 ตัวอักษร'
    });
  }

  if (emp_password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password ต้องมีอย่างน้อย 6 ตัวอักษร'
    });
  }

  // ตรวจสอบ username ซ้ำ
  const checkSql = 'SELECT emp_username FROM employee WHERE emp_username = ?';
  
  db.query(checkSql, [emp_username], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบ'
      });
    }

    if (results.length > 0) {
      console.log('⚠️ Username already exists:', emp_username);
      return res.status(409).json({
        success: false,
        message: 'Username นี้ถูกใช้งานแล้ว'
      });
    }

    // Insert employee
    const insertSql = `
      INSERT INTO employee 
      (emp_fname, emp_lname, emp_address, emp_username, emp_password, branch_ID, pos_ID) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [emp_fname, emp_lname, emp_address || null, emp_username, emp_password, branch_ID, role_ID],
      (err, result) => {
        if (err) {
          console.error('❌ Insert Error:', err);
          
          // Foreign key constraint error
          if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
              success: false,
              message: 'ไม่พบสาขาหรือตำแหน่งที่เลือก'
            });
          }
          
          return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเพิ่มพนักงาน'
          });
        }

        console.log('✅ Employee created successfully!');
        console.log('Employee ID:', result.insertId);
        console.log('Username:', emp_username);
        console.log('Position ID:', role_ID);
        console.log('Branch ID:', branch_ID);
        console.log('======================================');

        res.status(201).json({
          success: true,
          message: 'เพิ่มพนักงานสำเร็จ',
          emp_id: result.insertId
        });
      }
    );
  });
};

// ========================================
// 5. UPDATE EMPLOYEE
// ========================================
export const updateEmployee = (req, res) => {
  const { id } = req.params;
  const { emp_fname, emp_lname, emp_address, branch_ID, role_ID } = req.body;

  console.log('');
  console.log('📥 ========== UPDATE EMPLOYEE ==========');
  console.log('Employee ID:', id);
  console.log('Request body:', req.body);

  // Validation
  if (!emp_fname || !emp_lname || !branch_ID || !role_ID) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
    });
  }

  const sql = `
    UPDATE employee 
    SET emp_fname = ?, 
        emp_lname = ?, 
        emp_address = ?, 
        branch_ID = ?, 
        pos_ID = ?,
        updated_at = NOW()
    WHERE emp_ID = ?
  `;
  
  db.query(sql, [emp_fname, emp_lname, emp_address || null, branch_ID, role_ID, id], (err, result) => {
    if (err) {
      console.error('❌ Update Error:', err);
      
      // Foreign key constraint error
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'ไม่พบสาขาหรือตำแหน่งที่เลือก'
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการแก้ไข' 
      });
    }

    if (result.affectedRows === 0) {
      console.log('⚠️ Employee not found:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบพนักงาน' 
      });
    }
    
    console.log('✅ Employee updated successfully!');
    console.log('Employee ID:', id);
    console.log('======================================');

    res.json({ 
      success: true, 
      message: 'แก้ไขข้อมูลสำเร็จ' 
    });
  });
};

// ========================================
// 6. DELETE EMPLOYEE
// ========================================
export const deleteEmployee = (req, res) => {
  const { id } = req.params;

  console.log('');
  console.log('📥 ========== DELETE EMPLOYEE ==========');
  console.log('Employee ID:', id);

  const sql = 'DELETE FROM employee WHERE emp_ID = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Delete Error:', err);
      
      // Foreign key constraint error (มีข้อมูลที่เกี่ยวข้อง)
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({
          success: false,
          message: 'ไม่สามารถลบพนักงานได้ เนื่องจากมีข้อมูลที่เกี่ยวข้อง'
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการลบ' 
      });
    }

    if (result.affectedRows === 0) {
      console.log('⚠️ Employee not found:', id);
      return res.status(404).json({ 
        success: false, 
        message: 'ไม่พบพนักงาน' 
      });
    }
    
    console.log('✅ Employee deleted successfully!');
    console.log('Employee ID:', id);
    console.log('======================================');

    res.json({ 
      success: true, 
      message: 'ลบพนักงานสำเร็จ' 
    });
  });
};
