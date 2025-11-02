// backend/middleware/auth.js (สร้างไฟล์ใหม่)

import db from '../config/database.js';

/**
 * ตรวจสอบว่าเป็น Manager หรือไม่
 */
export const requireManager = (req, res, next) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(401).json({
      success: false,
      message: 'กรุณาเข้าสู่ระบบ'
    });
  }

  const sql = `
    SELECT e.emp_ID, p.pos_name as role
    FROM employee e
    LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID
    WHERE e.emp_ID = ? AND e.is_active = TRUE
  `;

  db.query(sql, [employee_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'ไม่พบข้อมูลพนักงาน'
      });
    }

    const employee = results[0];

    if (employee.role !== 'Manager') {
      return res.status(403).json({
        success: false,
        message: 'เฉพาะ Manager เท่านั้นที่มีสิทธิ์เข้าถึง'
      });
    }

    req.employee = employee;
    next();
  });
};

/**
 * ตรวจสอบว่าเป็น Employee ที่ถูกต้อง
 */
export const requireEmployee = (req, res, next) => {
  const { employee_id } = req.body;

  if (!employee_id) {
    return res.status(401).json({
      success: false,
      message: 'กรุณาเข้าสู่ระบบ'
    });
  }

  const sql = 'SELECT emp_ID, branch_ID FROM employee WHERE emp_ID = ? AND is_active = TRUE';

  db.query(sql, [employee_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'ไม่พบข้อมูลพนักงาน'
      });
    }

    req.employee = results[0];
    next();
  });
};
