import db from '../config/database.js';

// =========================================
// REGISTER - สมัครสมาชิก
// =========================================
export const register = (req, res) => {
  console.log('📥 Received registration request:', req.body);
  
  const { 
    username, 
    password, 
    cust_fname, 
    cust_lname, 
    cust_tel, 
    cust_address 
  } = req.body;
  
  // ตรวจสอบข้อมูลที่จำเป็น
  if (!username || !password || !cust_fname || !cust_lname) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ 
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อผู้ใช้, รหัสผ่าน, ชื่อ, นามสกุล)',
      required: ['username', 'password', 'cust_fname', 'cust_lname']
    });
  }

  // Validate username length
  if (username.length < 4) {
    console.log('❌ Username too short');
    return res.status(400).json({ 
      message: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร' 
    });
  }

  // Validate password length
  if (password.length < 6) {
    console.log('❌ Password too short');
    return res.status(400).json({ 
      message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' 
    });
  }

  // Validate phone format if provided
  if (cust_tel) {
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if (!phoneRegex.test(cust_tel)) {
      console.log('❌ Invalid phone format');
      return res.status(400).json({ 
        message: 'รูปแบบเบอร์โทรไม่ถูกต้อง (ใช้รูปแบบ 081-234-5678)' 
      });
    }
  }

  // ตรวจสอบว่า username ซ้ำหรือไม่
  const checkSql = 'SELECT cust_ID FROM customer WHERE cust_username = ?';
  
  db.query(checkSql, [username], (err, result) => {
    if (err) {
      console.error('❌ Database Error (Check):', err);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    
    if (result.length > 0) {
      console.log('⚠️ Username already exists:', username);
      return res.status(400).json({ 
        message: 'Username นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่อผู้ใช้อื่น' 
      });
    }

    // เพิ่มข้อมูลลง database
    const insertSql = `
      INSERT INTO customer 
      (cust_fname, cust_lname, cust_tel, cust_address, cust_username, cust_password) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      cust_fname, 
      cust_lname, 
      cust_tel || null, 
      cust_address || null, 
      username, 
      password
    ];
    
    db.query(insertSql, values, (err, result) => {
      if (err) {
        console.error('❌ Insert Error:', err);
        return res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }
      
      console.log('✅ Customer registered successfully:', username);
      console.log('📝 Customer ID:', result.insertId);
      
      res.status(201).json({ 
        success: true,
        message: 'สมัครสมาชิกสำเร็จ!',
        customer: {
          id: result.insertId,
          username: username,
          firstName: cust_fname,
          lastName: cust_lname,
          fullName: `${cust_fname} ${cust_lname}`,
          phone: cust_tel || null,
          address: cust_address || null
        }
      });
    });
  });
};

// =========================================
// LOGIN - เข้าสู่ระบบ
// =========================================
export const login = (req, res) => {
  console.log('');
  console.log('📥 ========== LOGIN REQUEST ==========');
  console.log('Request body:', { username: req.body.username, password: '***' });
  
  const { username, password } = req.body;
  
  // ตรวจสอบข้อมูล
  if (!username || !password) {
    console.log('❌ Missing username or password');
    return res.status(400).json({ 
      message: 'กรุณากรอก username และ password',
      required: ['username', 'password']
    });
  }

  // ค้นหา customer
  const sql = `
    SELECT 
      cust_ID,
      cust_fname,
      cust_lname,
      cust_tel,
      cust_address,
      cust_username,
      cust_password,
      created_at
    FROM customer 
    WHERE cust_username = ?
  `;
  
  console.log('🔍 Searching for customer:', username);
  
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    
    console.log('📊 Query result length:', result.length);
    
    // ตรวจสอบว่ามี customer หรือไม่
    if (result.length === 0) {
      console.log('⚠️ Customer not found:', username);
      return res.status(401).json({ 
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    const customer = result[0];
    console.log('👤 Customer found:', customer.cust_username);

    // ตรวจสอบรหัสผ่าน
    if (customer.cust_password !== password) {
      console.log('⚠️ Wrong password for user:', username);
      return res.status(401).json({ 
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    // Login สำเร็จ
    console.log('✅ Login successful!');
    console.log('======================================');
    console.log('');
    
    res.json({ 
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ!',
      customer: {
        id: customer.cust_ID,
        username: customer.cust_username,
        firstName: customer.cust_fname,
        lastName: customer.cust_lname,
        fullName: `${customer.cust_fname} ${customer.cust_lname}`,
        phone: customer.cust_tel,
        address: customer.cust_address,
        memberSince: customer.created_at
      }
    });
  });
};

// =========================================
// GET PROFILE - ดูข้อมูลโปรไฟล์
// =========================================
export const getProfile = (req, res) => {
  console.log('📥 Get Profile Request');
  
  const customerId = req.params.id;
  
  // Validate customer ID
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      message: 'Customer ID ไม่ถูกต้อง' 
    });
  }
  
  const sql = `
    SELECT 
      cust_ID,
      cust_fname,
      cust_lname,
      cust_tel,
      cust_address,
      cust_username,
      created_at,
      updated_at
    FROM customer 
    WHERE cust_ID = ?
  `;
  
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    
    if (result.length === 0) {
      console.log('⚠️ Customer not found with ID:', customerId);
      return res.status(404).json({ 
        message: 'ไม่พบข้อมูลลูกค้า' 
      });
    }

    const customer = result[0];
    
    console.log('✅ Profile retrieved for:', customer.cust_username);
    
    res.json({
      success: true,
      customer: {
        id: customer.cust_ID,
        username: customer.cust_username,
        firstName: customer.cust_fname,
        lastName: customer.cust_lname,
        fullName: `${customer.cust_fname} ${customer.cust_lname}`,
        phone: customer.cust_tel,
        address: customer.cust_address,
        createdAt: customer.created_at,
        updatedAt: customer.updated_at
      }
    });
  });
};

// =========================================
// UPDATE PROFILE - อัพเดทข้อมูลโปรไฟล์
// =========================================
export const updateProfile = (req, res) => {
  console.log('📥 Update Profile Request');
  console.log('Customer ID:', req.params.id);
  console.log('Update data:', req.body);
  
  const customerId = req.params.id;
  const { cust_fname, cust_lname, cust_tel, cust_address } = req.body;
  
  // Validate customer ID
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      message: 'Customer ID ไม่ถูกต้อง' 
    });
  }

  // Validate required fields
  if (!cust_fname || !cust_lname) {
    return res.status(400).json({ 
      message: 'กรุณากรอกชื่อและนามสกุล',
      required: ['cust_fname', 'cust_lname']
    });
  }

  // Validate phone format if provided
  if (cust_tel) {
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if (!phoneRegex.test(cust_tel)) {
      return res.status(400).json({ 
        message: 'รูปแบบเบอร์โทรไม่ถูกต้อง (ใช้รูปแบบ 081-234-5678)' 
      });
    }
  }
  
  const sql = `
    UPDATE customer 
    SET 
      cust_fname = ?,
      cust_lname = ?,
      cust_tel = ?,
      cust_address = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE cust_ID = ?
  `;
  
  const values = [
    cust_fname, 
    cust_lname, 
    cust_tel || null, 
    cust_address || null, 
    customerId
  ];
  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Update Error:', err);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    
    if (result.affectedRows === 0) {
      console.log('⚠️ No customer found with ID:', customerId);
      return res.status(404).json({ 
        message: 'ไม่พบข้อมูลลูกค้า' 
      });
    }
    
    console.log('✅ Profile updated successfully for customer ID:', customerId);
    
    res.json({ 
      success: true,
      message: 'อัพเดทข้อมูลสำเร็จ!',
      customer: {
        id: parseInt(customerId),
        firstName: cust_fname,
        lastName: cust_lname,
        fullName: `${cust_fname} ${cust_lname}`,
        phone: cust_tel || null,
        address: cust_address || null
      }
    });
  });
};

// =========================================
// DELETE ACCOUNT - ลบบัญชี (เพิ่มเติม)
// =========================================
export const deleteAccount = (req, res) => {
  console.log('📥 Delete Account Request');
  
  const customerId = req.params.id;
  const { password } = req.body;
  
  // Validate inputs
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      message: 'Customer ID ไม่ถูกต้อง' 
    });
  }

  if (!password) {
    return res.status(400).json({ 
      message: 'กรุณายืนยันรหัสผ่าน',
      required: ['password']
    });
  }

  // ตรวจสอบรหัสผ่านก่อนลบ
  const checkSql = 'SELECT cust_password FROM customer WHERE cust_ID = ?';
  
  db.query(checkSql, [customerId], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาด',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ 
        message: 'ไม่พบข้อมูลลูกค้า' 
      });
    }

    if (result[0].cust_password !== password) {
      return res.status(401).json({ 
        message: 'รหัสผ่านไม่ถูกต้อง' 
      });
    }

    // ลบบัญชี
    const deleteSql = 'DELETE FROM customer WHERE cust_ID = ?';
    
    db.query(deleteSql, [customerId], (err, result) => {
      if (err) {
        console.error('❌ Delete Error:', err);
        return res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการลบบัญชี',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      console.log('✅ Account deleted successfully');

      res.json({
        success: true,
        message: 'ลบบัญชีสำเร็จ'
      });
    });
  });
};

// =========================================
// CHANGE PASSWORD - เปลี่ยนรหัสผ่าน (เพิ่มเติม)
// =========================================
export const changePassword = (req, res) => {
  console.log('📥 Change Password Request');
  
  const customerId = req.params.id;
  const { oldPassword, newPassword } = req.body;
  
  // Validate inputs
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      message: 'Customer ID ไม่ถูกต้อง' 
    });
  }

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ 
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
      required: ['oldPassword', 'newPassword']
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ 
      message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' 
    });
  }

  // ตรวจสอบรหัสผ่านเดิม
  const checkSql = 'SELECT cust_password FROM customer WHERE cust_ID = ?';
  
  db.query(checkSql, [customerId], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาด',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ 
        message: 'ไม่พบข้อมูลลูกค้า' 
      });
    }

    if (result[0].cust_password !== oldPassword) {
      return res.status(401).json({ 
        message: 'รหัสผ่านเดิมไม่ถูกต้อง' 
      });
    }

    // อัพเดทรหัสผ่านใหม่
    const updateSql = 'UPDATE customer SET cust_password = ? WHERE cust_ID = ?';
    
    db.query(updateSql, [newPassword, customerId], (err, result) => {
      if (err) {
        console.error('❌ Update Error:', err);
        return res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      console.log('✅ Password changed successfully');

      res.json({
        success: true,
        message: 'เปลี่ยนรหัสผ่านสำเร็จ'
      });
    });
  });
};