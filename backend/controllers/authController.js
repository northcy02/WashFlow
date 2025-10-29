// backend/controllers/authController.js - ส่วน login
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

    // Login สำเร็จ - ✅ ส่งข้อมูลครบถ้วน
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
// เปลี่ยนรหัสผ่าน
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

  // ตรวจสอบรหัสผ่านเดิม
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

    // อัพเดทรหัสผ่านใหม่
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

// ลบบัญชี
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

  // ตรวจสอบรหัสผ่านก่อนลบ
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

    // ลบบัญชี
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