// backend/controllers/authController.js
import db from '../config/database.js';

// ========================================
// 1. REGISTER (✅ เพิ่ม Welcome Bonus)
// ========================================
export const register = (req, res) => {
  console.log('');
  console.log('📥 ========== REGISTER REQUEST ==========');
  console.log('Request body:', req.body);

  const { username, password, cust_fname, cust_lname, cust_tel, cust_address } = req.body;

  // Validation
  if (!username || !password || !cust_fname || !cust_lname || !cust_tel) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
    });
  }

  if (username.length < 4) {
    return res.status(400).json({
      success: false,
      message: 'Username ต้องมีอย่างน้อย 4 ตัวอักษร'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    });
  }

  // Check duplicate username
  const checkSql = 'SELECT cust_username FROM customer WHERE cust_username = ?';
  
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบ'
      });
    }

    if (results.length > 0) {
      console.log('⚠️ Username already exists:', username);
      return res.status(409).json({
        success: false,
        message: 'Username นี้ถูกใช้งานแล้ว'
      });
    }

    // ✅ Insert new customer with Welcome Bonus (ระบุ column ชัดเจน)
    const insertSql = `
      INSERT INTO customer 
      (
        cust_username, 
        cust_password, 
        cust_fname, 
        cust_lname, 
        cust_tel, 
        cust_address, 
        membership_tier_ID, 
        total_points, 
        available_points
      ) 
      VALUES (?, ?, ?, ?, ?, ?, 1, 50, 50)
    `;

    console.log('📝 Inserting customer with 50 welcome points...');

    db.query(
      insertSql,
      [username, password, cust_fname, cust_lname, cust_tel, cust_address || null],
      (err, result) => {
        if (err) {
          console.error('❌ Insert Error:', err);
          console.error('   SQL State:', err.sqlState);
          console.error('   Error Code:', err.code);
          return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
            error: err.message
          });
        }

        const customerId = result.insertId;

        console.log('✅ Customer created!');
        console.log('   Customer ID:', customerId);
        console.log('   Username:', username);

        // ✅ Verify ว่าได้ 50 points หรือไม่
        db.query(
          'SELECT total_points, available_points FROM customer WHERE cust_ID = ?',
          [customerId],
          (err, verification) => {
            if (err) {
              console.error('⚠️ Verification Error:', err);
            } else if (verification.length > 0) {
              console.log('✅ Verification:');
              console.log('   Total Points:', verification[0].total_points);
              console.log('   Available Points:', verification[0].available_points);
              
              if (verification[0].available_points !== 50) {
                console.error('⚠️ WARNING: Points not set correctly!');
              }
            }
          }
        );

        // ✅ Record Welcome Bonus Transaction
        const bonusSql = `
          INSERT INTO point_transaction 
          (cust_ID, transaction_type, points, description) 
          VALUES (?, 'bonus', 50, 'Welcome Bonus - Thank you for joining CYBERCAR! 🎉')
        `;

        db.query(bonusSql, [customerId], (err) => {
          if (err) {
            console.error('⚠️ Bonus Transaction Error:', err);
          } else {
            console.log('🎁 Welcome Bonus transaction recorded');
          }
        });

        console.log('======================================');
        console.log('');

        res.status(201).json({
          success: true,
          message: 'สมัครสมาชิกสำเร็จ!',
          customerId: customerId,
          welcomeBonus: 50,
          initialPoints: 50  // ✅ ส่งไปให้ Frontend รู้
        });
      }
    );
  });
};

// ========================================
// 2. LOGIN (Customer Only)
// ========================================
export const login = (req, res) => {
  console.log('');
  console.log('📥 ========== LOGIN REQUEST ==========');
  console.log('Username:', req.body.username);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอก username และ password'
    });
  }

  // ✅ JOIN กับ membership_tier เพื่อดึงข้อมูลสมาชิก
  const sql = `
    SELECT 
      c.cust_ID as id,
      c.cust_fname as firstName,
      c.cust_lname as lastName,
      c.cust_tel as phone,
      c.cust_address as address,
      c.cust_username as username,
      c.cust_password as password,
      c.total_points,
      c.available_points,
      c.total_spent,
      c.membership_tier_ID,
      c.created_at as memberSince,
      
      t.tier_name,
      t.tier_icon,
      t.tier_color,
      t.discount_percent,
      t.points_multiplier
      
    FROM customer c
    LEFT JOIN membership_tier t ON c.membership_tier_ID = t.tier_ID
    WHERE c.cust_username = ?
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

    const user = results[0];

    if (user.password !== password) {
      console.log('⚠️ Wrong password');
      return res.status(401).json({
        success: false,
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // ✅ สร้าง userData พร้อม Points และ Membership
    const userData = {
      id: user.id,
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
      phone: user.phone || '',
      address: user.address || '',
      memberSince: user.memberSince || new Date().toISOString(),
      
      // ✅ Points Info
      totalPoints: parseInt(user.total_points) || 0,
      availablePoints: parseInt(user.available_points) || 0,
      totalSpent: parseFloat(user.total_spent) || 0,
      
      // ✅ Membership Info
      membershipTierId: user.membership_tier_ID || 1,
      tierName: user.tier_name || 'Bronze',
      tierIcon: user.tier_icon || '🥉',
      tierColor: user.tier_color || '#cd7f32',
      discountPercent: parseFloat(user.discount_percent) || 0,
      pointsMultiplier: parseFloat(user.points_multiplier) || 1.0
    };

    console.log('✅ Login successful!');
    console.log('Customer ID:', user.id);
    console.log('Total Points:', userData.totalPoints);
    console.log('Available Points:', userData.availablePoints);
    console.log('Tier:', userData.tierName);
    console.log('======================================');

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ!',
      user: userData
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
      total_points,
      available_points,
      total_spent,
      membership_tier_ID,
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
        memberSince: customer.created_at || new Date().toISOString(),
        totalPoints: customer.total_points || 0,
        availablePoints: customer.available_points || 0,
        totalSpent: customer.total_spent || 0,
        membershipTierId: customer.membership_tier_ID || 1
      };

      console.log('✅ Customer Login successful!');
      console.log('Customer ID:', customer.id);
      console.log('Full Name:', userData.fullName);
      console.log('Available Points:', userData.availablePoints);
      console.log('======================================');
      
      return res.json({ 
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ!',
        userType: 'customer',
        user: userData,
        customer: userData
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
        p.pos_name as role,
        p.pos_ID as roleId,
        p.pos_salary as salary,
        b.branch_name as branchName,
        'employee' as userType
      FROM employee e
      LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID
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
        salary: employee.salary,
        branchId: employee.branchId,
        branchName: employee.branchName,
        address: employee.address || ''
      };

      console.log('✅ Employee Login successful!');
      console.log('Employee ID:', employee.id);
      console.log('Position:', employee.role);
      console.log('Branch:', employee.branchName);
      console.log('======================================');
      
      return res.json({ 
        success: true,
        message: 'เข้าสู่ระบบสำเร็จ!',
        userType: 'employee',
        user: userData,
        employee: userData
      });
    });
  });
};

// ========================================
// 4. GET PROFILE (✅ รวม Points Info)
// ========================================
export const getProfile = (req, res) => {
  const { id } = req.params;

  console.log('📥 GET Profile ID:', id);

  const sql = `
    SELECT 
      c.cust_ID as id,
      c.cust_fname as firstName,
      c.cust_lname as lastName,
      c.cust_username as username,
      c.cust_tel as phone,
      c.cust_address as address,
      c.total_points as totalPoints,
      c.available_points as availablePoints,
      c.total_spent as totalSpent,
      c.membership_tier_ID as membershipTierId,
      c.created_at as memberSince,
      
      t.tier_name,
      t.tier_icon,
      t.tier_color,
      t.discount_percent,
      t.points_multiplier
      
    FROM customer c
    LEFT JOIN membership_tier t ON c.membership_tier_ID = t.tier_ID
    WHERE c.cust_ID = ?
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
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    const user = results[0];
    user.fullName = `${user.firstName} ${user.lastName}`;

    console.log('✅ Profile loaded:', user.username);
    console.log('   Total Points:', user.totalPoints);
    console.log('   Available Points:', user.availablePoints);

    res.json({
      success: true,
      user: user
    });
  });
};

// เหลือ functions อื่นๆ เหมือนเดิม...
export const updateProfile = (req, res) => {
  const { id } = req.params;
  const { cust_fname, cust_lname, cust_tel, cust_address } = req.body;

  console.log('📥 UPDATE Profile ID:', id);

  if (!cust_fname || !cust_lname) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกชื่อและนามสกุล'
    });
  }

  const sql = `
    UPDATE customer 
    SET cust_fname = ?, 
        cust_lname = ?, 
        cust_tel = ?, 
        cust_address = ?,
        updated_at = NOW()
    WHERE cust_ID = ?
  `;

  db.query(sql, [cust_fname, cust_lname, cust_tel, cust_address, id], (err, result) => {
    if (err) {
      console.error('❌ Update Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบผู้ใช้'
      });
    }

    console.log('✅ Profile updated');

    res.json({
      success: true,
      message: 'อัพเดทข้อมูลสำเร็จ'
    });
  });
};

export const changePassword = (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  console.log('📥 CHANGE Password for ID:', id);

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกรหัสผ่านเดิมและรหัสผ่านใหม่'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'
    });
  }

  const checkSql = 'SELECT cust_password FROM customer WHERE cust_ID = ?';
  
  db.query(checkSql, [id], (err, results) => {
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
        message: 'ไม่พบผู้ใช้'
      });
    }

    const currentPassword = results[0].cust_password;

    if (currentPassword !== oldPassword) {
      console.log('⚠️ Wrong old password');
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านเดิมไม่ถูกต้อง'
      });
    }

    const updateSql = 'UPDATE customer SET cust_password = ?, updated_at = NOW() WHERE cust_ID = ?';
    
    db.query(updateSql, [newPassword, id], (err, result) => {
      if (err) {
        console.error('❌ Update Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      console.log('✅ Password changed');

      res.json({
        success: true,
        message: 'เปลี่ยนรหัสผ่านสำเร็จ'
      });
    });
  });
};

export const deleteAccount = (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  console.log('📥 DELETE Account ID:', id);

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'กรุณายืนยันรหัสผ่าน'
    });
  }

  const checkSql = 'SELECT cust_password FROM customer WHERE cust_ID = ?';
  
  db.query(checkSql, [id], (err, results) => {
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
        message: 'ไม่พบผู้ใช้'
      });
    }

    const currentPassword = results[0].cust_password;

    if (currentPassword !== password) {
      console.log('⚠️ Wrong password');
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง'
      });
    }

    const deleteSql = 'DELETE FROM customer WHERE cust_ID = ?';
    
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        console.error('❌ Delete Error:', err);
        
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
          return res.status(400).json({
            success: false,
            message: 'ไม่สามารถลบบัญชีได้ เนื่องจากมีข้อมูลการจองที่เกี่ยวข้อง'
          });
        }

        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      console.log('✅ Account deleted');

      res.json({
        success: true,
        message: 'ลบบัญชีสำเร็จ'
      });
    });
  });
};
