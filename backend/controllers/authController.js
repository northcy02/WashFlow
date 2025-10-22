import db from '../config/database.js';

// สมัครสมาชิก
export const register = (req, res) => {
  console.log('📥 Received registration request:', req.body);
  
  const { username, password } = req.body;
  
  // ตรวจสอบข้อมูล
  if (!username || !password) {
    return res.status(400).json({ 
      message: 'กรุณากรอก username และ password' 
    });
  }

  // ตรวจสอบว่า username ซ้ำหรือไม่
  const checkSql = 'SELECT * FROM users WHERE username = ?';
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
        message: 'Username นี้มีอยู่ในระบบแล้ว' 
      });
    }

    // เพิ่มข้อมูลลง database
    const insertSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertSql, [username, password], (err, result) => {
      if (err) {
        console.error('❌ Insert Error:', err);
        return res.status(500).json({ 
          message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' 
        });
      }
      
      console.log('✅ User registered successfully:', username);
      console.log('📝 User ID:', result.insertId);
      
      res.json({ 
        message: 'สมัครสมาชิกสำเร็จ!',
        userId: result.insertId,
        username: username
      });
    });
  });
};

// เข้าสู่ระบบ
export const login = (req, res) => {
  console.log('');
  console.log('📥 ========== LOGIN REQUEST ==========');
  console.log('Request body:', req.body);
  
  const { username, password } = req.body;
  
  // ตรวจสอบข้อมูล
  if (!username || !password) {
    console.log('❌ Missing username or password');
    return res.status(400).json({ 
      message: 'กรุณากรอก username และ password' 
    });
  }

  // ค้นหา user
  const sql = 'SELECT * FROM users WHERE username = ?';
  
  console.log('🔍 Searching for user:', username);
  
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        error: err.message
      });
    }
    
    console.log('📊 Query result length:', result.length);
    
    // ตรวจสอบว่ามี user หรือไม่
    if (result.length === 0) {
      console.log('⚠️ User not found:', username);
      return res.status(401).json({ 
        message: 'Username หรือ Password ไม่ถูกต้อง' 
      });
    }

    const user = result[0];
    console.log('👤 User found:', user.username);

    // ตรวจสอบรหัสผ่าน
    if (user.password !== password) {
      console.log('⚠️ Wrong password');
      return res.status(401).json({ 
        message: 'Username หรือ Password ไม่ถูกต้อง' 
      });
    }

    // Login สำเร็จ
    console.log('✅ Login successful!');
    console.log('======================================');
    console.log('');
    
    res.json({ 
      message: 'เข้าสู่ระบบสำเร็จ!',
      user: {
        id: user.id,
        username: user.username
      }
    });
  });
};