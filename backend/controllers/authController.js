// backend/controllers/authController.js
import db from '../config/database.js';

// ========================================
// 1. REGISTER (สมัครสมาชิก)
// ========================================
export const register = (req, res) => {
  console.log('');
  console.log('📥 ========== REGISTER REQUEST ==========');
  console.log('Request body:', { ...req.body, password: '***' });
  
  const { username, password, cust_fname, cust_lname, cust_tel, cust_address } = req.body;
  
  // Validation
  if (!username || !password || !cust_fname || !cust_lname) {
    console.log('❌ Validation Failed: Missing required fields');
    return res.status(400).json({ 
      success: false,
      message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อผู้ใช้, รหัสผ่าน, ชื่อ, นามสกุล)'
    });
  }

  // Check username length
  if (username.length < 4) {
    console.log('❌ Validation Failed: Username too short');
    return res.status(400).json({ 
      success: false,
      message: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร'
    });
  }

  // Check password length
  if (password.length < 6) {
    console.log('❌ Validation Failed: Password too short');
    return res.status(400).json({ 
      success: false,
      message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    });
  }

  // ตรวจสอบ username ซ้ำ
  const checkSql = 'SELECT cust_ID FROM customer WHERE cust_username = ?';
  
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล'
      });
    }

    if (results.length > 0) {
      console.log('⚠️ Username already exists:', username);
      return res.status(400).json({ 
        success: false,
        message: 'Username นี้มีผู้ใช้งานแล้ว กรุณาเลือก username อื่น'
      });
    }

    // Insert ข้อมูลลูกค้าใหม่
    const insertSql = `
      INSERT INTO customer (cust_username, cust_password, cust_fname, cust_lname, cust_tel, cust_address) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(
      insertSql, 
      [username, password, cust_fname, cust_lname, cust_tel || null, cust_address || null], 
      (err, result) => {
        if (err) {
          console.error('❌ Database Error:', err);
          return res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
          });
        }

        console.log('✅ Registration successful! User ID:', result.insertId);
        console.log('======================================');
        
        res.json({ 
          success: true,
          message: 'สมัครสมาชิกสำเร็จ!',
          userId: result.insertId
        });
      }
    );
  });
};

// ========================================
// 2. LOGIN (Customer only - สำหรับ backward compatibility)
// ========================================
export const login = (req, res) => {
  console.log('');
  console.log('📥 ========== LOGIN REQUEST (Customer) ==========');
  console.log('Request body:', { username: req.body.username, password: '***' });
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'กรุณากรอก username และ password'
    });
  }

  const sql = `
    SELECT 
      cust_ID as id,
      cust_fname as firstName,
      cust_lname as lastName,
      cust_tel as phone,
      cust_address as address,
      cust_username as username,
      cust_password as password,
      created_at
    FROM customer 
    WHERE cust_username = ?
  `;
  
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      });
    }

    if (results.length === 0) {
      console.log('⚠️ User not found:', username);
      return res.status(401).json({ 
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    const customer = results[0];

    if (customer.password !== password) {
      console.log('⚠️ Wrong password for:', username);
      return res.status(401).json({ 
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    const userData = {
      id: customer.id,
      username: customer.username,
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      fullName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.username,
      phone: customer.phone || '',
      address: customer.address || '',
      memberSince: customer.created_at || new Date().toISOString()
    };

    console.log('✅ Customer Login successful! ID:', customer.id);
    console.log('======================================');
    
    res.json({ 
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ!',
      user: userData,      // ✅ Standard field
      customer: userData   // ✅ Backward compatibility
    });
  });
};

// ========================================
// 3. UNIFIED LOGIN (Customer + Employee)
// ========================================
export const unifiedLogin = (req, res) => {
  console.log('');
  console.log('📥 ========== UNIFIED LOGIN REQUEST ==========');
  console.log('Request body:', { username: req.body.username, password: '***' });
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'กรุณากรอก username และ password'
    });
  }

  // 1️⃣ ลองหา Customer ก่อน
  const customerSql = `
    SELECT 
      cust_ID as id,
      cust_fname as firstName,
      cust_lname as lastName,
      cust_tel as phone,
      cust_address as address,
      cust_username as username,
      cust_password as password,
      created_at,
      'customer' as userType
    FROM customer 
    WHERE cust_username = ?
  `;
  
  db.query(customerSql, [username], (err, customerResult) => {
    if (err) {
      console.error('❌ Database Error (Customer):', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
      });
    }
    
    // ✅ ถ้าเจอ Customer
    if (customerResult.length > 0) {
      const customer = customerResult[0];
      
      if (customer.password !== password) {
        console.log('⚠️ Wrong password for customer:', username);
        return res.status(401).json({ 
          success: false,
          message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
        });
      }

      const userData = {
        id: customer.id,
        username: customer.username,
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        fullName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.username,
        phone: customer.phone || '',
        address: customer.address || '',
        memberSince: customer.created_at || new Date().toISOString()
      };

      console.log('✅ Customer Login successful!');
      console.log('Customer ID:', customer.id);
      console.log('Full Name:', userData.fullName);
      console.log('======================================');
      
      return res.json({ 
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ!',
        userType: 'customer',
        user: userData,      // ✅ Standard field
        customer: userData   // ✅ Backward compatibility
      });
    }

    // 2️⃣ ถ้าไม่เจอ Customer ลองหา Employee
    const employeeSql = `
      SELECT 
        e.emp_ID as id,
        e.emp_fname as firstName,
        e.emp_lname as lastName,
        e.emp_username as username,
        e.emp_password as password,
        e.emp_address as address,
        e.branch_ID as branchId,
        r.Role_name as role,
        r.Role_ID as roleId,
        b.branch_name as branchName,
        'employee' as userType
      FROM employee e
      LEFT JOIN Role r ON e.role_ID = r.Role_ID
      LEFT JOIN branch b ON e.branch_ID = b.branch_ID
      WHERE e.emp_username = ?
    `;
    
    db.query(employeeSql, [username], (err, employeeResult) => {
      if (err) {
        console.error('❌ Database Error (Employee):', err);
        return res.status(500).json({ 
          success: false,
          message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
        });
      }

      // ❌ ไม่เจอทั้ง Customer และ Employee
      if (employeeResult.length === 0) {
        console.log('⚠️ User not found:', username);
        return res.status(401).json({ 
          success: false,
          message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
        });
      }

      const employee = employeeResult[0];

      if (employee.password !== password) {
        console.log('⚠️ Wrong password for employee:', username);
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
        branchId: employee.branchId,
        branchName: employee.branchName,
        address: employee.address || ''
      };

      console.log('✅ Employee Login successful!');
      console.log('Employee ID:', employee.id);
      console.log('Role:', employee.role);
      console.log('Branch:', employee.branchName);
      console.log('======================================');
      
      return res.json({ 
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ!',
        userType: 'employee',
        user: userData,      // ✅ Standard field
        employee: userData   // ✅ Backward compatibility
      });
    });
  });
};

// ========================================
// 4. GET PROFILE
// ========================================
export const getProfile = (req, res) => {
  console.log('');
  console.log('📥 ========== GET PROFILE REQUEST ==========');
  const { id } = req.params;
  console.log('Customer ID:', id);

  const sql = `
    SELECT 
      cust_ID as id,
      cust_username as username,
      cust_fname as firstName,
      cust_lname as lastName,
      cust_tel as phone,
      cust_address as address,
      created_at as memberSince
    FROM customer 
    WHERE cust_ID = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
      });
    }

    if (results.length === 0) {
      console.log('⚠️ Customer not found:', id);
      return res.status(404).json({ 
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    const customer = results[0];
    
    const userData = {
      id: customer.id,
      username: customer.username,
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      fullName: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || customer.username,
      phone: customer.phone || '',
      address: customer.address || '',
      memberSince: customer.memberSince
    };

    console.log('✅ Profile retrieved successfully');
    console.log('======================================');
    
    res.json({ 
      success: true,
      user: userData,
      customer: userData  // ✅ Backward compatibility
    });
  });
};

// ========================================
// 5. UPDATE PROFILE
// ========================================
export const updateProfile = (req, res) => {
  console.log('');
  console.log('📥 ========== UPDATE PROFILE REQUEST ==========');
  const { id } = req.params;
  const { cust_fname, cust_lname, cust_tel, cust_address } = req.body;
  
  console.log('Customer ID:', id);
  console.log('Update data:', { cust_fname, cust_lname, cust_tel, cust_address });

  if (!cust_fname || !cust_lname) {
    return res.status(400).json({ 
      success: false,
      message: 'กรุณากรอกชื่อและนามสกุล'
    });
  }

  const sql = `
    UPDATE customer 
    SET cust_fname = ?, cust_lname = ?, cust_tel = ?, cust_address = ?, updated_at = NOW()
    WHERE cust_ID = ?
  `;

  db.query(sql, [cust_fname, cust_lname, cust_tel || null, cust_address || null, id], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
      });
    }

    if (result.affectedRows === 0) {
      console.log('⚠️ Customer not found:', id);
      return res.status(404).json({ 
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    console.log('✅ Profile updated successfully');
    console.log('======================================');

    res.json({ 
      success: true,
      message: 'อัพเดทข้อมูลสำเร็จ'
    });
  });
};

// ========================================
// 6. CHANGE PASSWORD
// ========================================
export const changePassword = (req, res) => {
  console.log('');
  console.log('📥 ========== CHANGE PASSWORD REQUEST ==========');
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  
  console.log('Customer ID:', id);

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ 
      success: false,
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'
    });
  }

  // ตรวจสอบรหัสผ่านเก่า
  const checkSql = 'SELECT cust_password FROM customer WHERE cust_ID = ?';
  
  db.query(checkSql, [id], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน'
      });
    }

    if (results.length === 0) {
      console.log('⚠️ Customer not found:', id);
      return res.status(404).json({ 
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    if (results[0].cust_password !== oldPassword) {
      console.log('⚠️ Wrong old password');
      return res.status(401).json({ 
        success: false,
        message: 'รหัสผ่านเก่าไม่ถูกต้อง'
      });
    }

    // อัพเดทรหัสผ่านใหม่
    const updateSql = 'UPDATE customer SET cust_password = ?, updated_at = NOW() WHERE cust_ID = ?';
    
    db.query(updateSql, [newPassword, id], (err, result) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
        });
      }

      console.log('✅ Password changed successfully');
      console.log('======================================');

      res.json({ 
        success: true,
        message: 'เปลี่ยนรหัสผ่านสำเร็จ'
      });
    });
  });
};

// ========================================
// 7. DELETE ACCOUNT
// ========================================
export const deleteAccount = (req, res) => {
  console.log('');
  console.log('📥 ========== DELETE ACCOUNT REQUEST ==========');
  const { id } = req.params;
  const { password } = req.body;
  
  console.log('Customer ID:', id);

  if (!password) {
    return res.status(400).json({ 
      success: false,
      message: 'กรุณากรอกรหัสผ่านเพื่อยืนยัน'
    });
  }

  // ตรวจสอบรหัสผ่าน
  const checkSql = 'SELECT cust_password FROM customer WHERE cust_ID = ?';
  
  db.query(checkSql, [id], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล'
      });
    }

    if (results.length === 0) {
      console.log('⚠️ Customer not found:', id);
      return res.status(404).json({ 
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    if (results[0].cust_password !== password) {
      console.log('⚠️ Wrong password');
      return res.status(401).json({ 
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง'
      });
    }

    // ลบบัญชี
    const deleteSql = 'DELETE FROM customer WHERE cust_ID = ?';
    
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'เกิดข้อผิดพลาดในการลบบัญชี'
        });
      }

      console.log('✅ Account deleted successfully');
      console.log('======================================');

      res.json({ 
        success: true,
        message: 'ลบบัญชีสำเร็จ'
      });
    });
  });
};
