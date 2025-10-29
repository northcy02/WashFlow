// backend/controllers/authController.js

import db from '../config/database.js';

// Register
export const register = (req, res) => {
  console.log('');
  console.log('📥 ========== REGISTER REQUEST ==========');
  console.log('Request body:', { ...req.body, password: '***' });
  
  const { username, password, cust_fname, cust_lname, cust_tel, cust_address } = req.body;
  
  // ตรวจสอบข้อมูลที่จำเป็น
  if (!username || !password || !cust_fname || !cust_lname) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ 
      message: 'กรุณากรอกข้อมูลที่จำเป็น',
      required: ['username', 'password', 'cust_fname', 'cust_lname']
    });
  }

  // ตรวจสอบว่า username ซ้ำหรือไม่
  const checkSql = 'SELECT cust_username FROM customer WHERE cust_username = ?';
  
  db.query(checkSql, [username], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล'
      });
    }

    if (result.length > 0) {
      console.log('⚠️ Username already exists:', username);
      return res.status(400).json({ 
        message: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' 
      });
    }

    // สร้างบัญชีใหม่
    const insertSql = `
      INSERT INTO customer (cust_username, cust_password, cust_fname, cust_lname, cust_tel, cust_address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(insertSql, [username, password, cust_fname, cust_lname, cust_tel || '', cust_address || ''], (err, result) => {
      if (err) {
        console.error('❌ Insert Error:', err);
        return res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก'
        });
      }

      console.log('✅ Registration successful!');
      console.log('======================================');
      console.log('');

      res.status(201).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ!',
        customer: {
          id: result.insertId,
          username: username
        }
      });
    });
  });
};

// Login
export const login = (req, res) => {
  console.log('');
  console.log('📥 ========== LOGIN REQUEST ==========');
  console.log('Request body:', { username: req.body.username, password: '***' });
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    console.log('❌ Missing username or password');
    return res.status(400).json({ 
      message: 'กรุณากรอก username และ password',
      required: ['username', 'password']
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
    
    if (result.length === 0) {
      console.log('⚠️ Customer not found:', username);
      return res.status(401).json({ 
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    const customer = result[0];
    console.log('👤 Customer found:', customer.cust_username);

    if (customer.cust_password !== password) {
      console.log('⚠️ Wrong password for user:', username);
      return res.status(401).json({ 
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }

    console.log('✅ Login successful!');
    console.log('======================================');
    console.log('');
    
    res.json({ 
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ!',
      customer: {
        id: customer.cust_ID,
        username: customer.cust_username,
        firstName: customer.cust_fname || '',
        lastName: customer.cust_lname || '',
        fullName: `${customer.cust_fname || ''} ${customer.cust_lname || ''}`.trim() || customer.cust_username,
        phone: customer.cust_tel || '',
        address: customer.cust_address || '',
        memberSince: customer.created_at || new Date().toISOString()
      }
    });
  });
};

// ✅ Get Profile
export const getProfile = (req, res) => {
  console.log('📥 Get Profile Request');
  
  const customerId = req.params.id;
  
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      success: false,
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
      created_at
    FROM customer 
    WHERE cust_ID = ?
  `;
  
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า' 
      });
    }

    const customer = result[0];
    
    res.json({
      success: true,
      customer: {
        id: customer.cust_ID,
        username: customer.cust_username,
        firstName: customer.cust_fname || '',
        lastName: customer.cust_lname || '',
        fullName: `${customer.cust_fname || ''} ${customer.cust_lname || ''}`.trim(),
        phone: customer.cust_tel || '',
        address: customer.cust_address || '',
        memberSince: customer.created_at || new Date().toISOString()
      }
    });
  });
};

// ✅ Update Profile
export const updateProfile = (req, res) => {
  console.log('📥 Update Profile Request');
  
  const customerId = req.params.id;
  const { cust_fname, cust_lname, cust_tel, cust_address } = req.body;
  
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      success: false,
      message: 'Customer ID ไม่ถูกต้อง' 
    });
  }

  const sql = `
    UPDATE customer 
    SET cust_fname = ?, 
        cust_lname = ?, 
        cust_tel = ?, 
        cust_address = ?
    WHERE cust_ID = ?
  `;
  
  db.query(sql, [cust_fname, cust_lname, cust_tel, cust_address, customerId], (err, result) => {
    if (err) {
      console.error('❌ Update Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า' 
      });
    }

    console.log('✅ Profile updated successfully');

    res.json({
      success: true,
      message: 'อัพเดทข้อมูลสำเร็จ'
    });
  });
};

// Change Password
export const changePassword = (req, res) => {
  console.log('📥 Change Password Request');
  
  const customerId = req.params.id;
  const { oldPassword, newPassword } = req.body;
  
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      success: false,
      message: 'Customer ID ไม่ถูกต้อง' 
    });
  }

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

  const checkSql = 'SELECT cust_password FROM customer WHERE cust_ID = ?';
  
  db.query(checkSql, [customerId], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า' 
      });
    }

    if (result[0].cust_password !== oldPassword) {
      return res.status(401).json({ 
        success: false,
        message: 'รหัสผ่านเดิมไม่ถูกต้อง' 
      });
    }

    const updateSql = 'UPDATE customer SET cust_password = ? WHERE cust_ID = ?';
    
    db.query(updateSql, [newPassword, customerId], (err, result) => {
      if (err) {
        console.error('❌ Update Error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
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

// Delete Account
export const deleteAccount = (req, res) => {
  console.log('📥 Delete Account Request');
  
  const customerId = req.params.id;
  const { password } = req.body;
  
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      success: false,
      message: 'Customer ID ไม่ถูกต้อง' 
    });
  }

  if (!password) {
    return res.status(400).json({ 
      success: false,
      message: 'กรุณายืนยันรหัสผ่าน'
    });
  }

  const checkSql = 'SELECT cust_password FROM customer WHERE cust_ID = ?';
  
  db.query(checkSql, [customerId], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า' 
      });
    }

    if (result[0].cust_password !== password) {
      return res.status(401).json({ 
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง' 
      });
    }

    const deleteSql = 'DELETE FROM customer WHERE cust_ID = ?';
    
    db.query(deleteSql, [customerId], (err, result) => {
      if (err) {
        console.error('❌ Delete Error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'เกิดข้อผิดพลาดในการลบบัญชี'
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
