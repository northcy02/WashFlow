import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 8888,
  user: process.env.DB_USER || 'washflow',
  password: process.env.DB_PASSWORD || 'washflow123',
  database: process.env.DB_NAME || 'mydb',
  charset: 'utf8mb4'
});

db.connect(err => {
  if (err) {
    console.log('❌ MySQL connect error:', err);
    console.log('');
    console.log('🔍 ตรวจสอบ:');
    console.log('   1. MAMP MySQL กำลังรันอยู่หรือไม่?');
    console.log('   2. Port ถูกต้องหรือไม่? (3306 หรือ 8889)');
    console.log('   3. User/Password ถูกต้องหรือไม่?');
    process.exit(1);
  }
  console.log('✅ Connected to MySQL');
  console.log('📊 Database:', process.env.DB_NAME);
});

export default db;