// backend/config/database.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// ✅ ใช้ createPool แทน createConnection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 8888,
  user: process.env.DB_USER || 'washflow',
  password: process.env.DB_PASSWORD || 'washflow123',
  database: process.env.DB_NAME || 'mydb',
  charset: 'utf8mb4',
  // ✅ Pool settings
  waitForConnections: true,
  connectionLimit: 10,      // จำนวน connection สูงสุด
  queueLimit: 0,           // ไม่จำกัดคิว
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// ✅ Test connection
db.getConnection((err, connection) => {
  if (err) {
    console.log('❌ MySQL connect error:', err.message);
    console.log('');
    console.log('🔍 ตรวจสอบ:');
    console.log('   1. MAMP MySQL กำลังรันอยู่หรือไม่?');
    console.log('   2. Port ถูกต้องหรือไม่? (3306 หรือ 8888)');
    console.log('   3. User/Password ถูกต้องหรือไม่?');
    console.log('   4. Database "' + (process.env.DB_NAME || 'mydb') + '" มีอยู่หรือไม่?');
    console.log('');
    console.log('💡 Config ปัจจุบัน:');
    console.log('   Host:', process.env.DB_HOST || 'localhost');
    console.log('   Port:', process.env.DB_PORT || 8888);
    console.log('   User:', process.env.DB_USER || 'washflow');
    console.log('   Database:', process.env.DB_NAME || 'mydb');
    process.exit(1);
  }
  
  console.log('✅ Connected to MySQL');
  console.log('📊 Database:', process.env.DB_NAME || 'mydb');
  console.log('🔌 Connection Pool Created (Max: 10 connections)');
  connection.release(); // ✅ คืน connection กลับ pool
});

export default db;
