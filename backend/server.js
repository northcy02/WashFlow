// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import db from './config/database.js';
import branchRoutes from './routes/branchRoutes.js';

// โหลดค่าตั้งค่าจาก .env
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/api/branch', branchRoutes);

// Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableRoutes: [
      'GET /api',
      'POST /api/auth/register',
      'POST /api/auth/login'
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message
  });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 =================================');
  console.log('   WashFlow Backend Server');
  console.log('   http://localhost:' + PORT);
  console.log('🚀 =================================');
  console.log('');
});
