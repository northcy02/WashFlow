// backend/middleware/checkRole.js
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const { employee_id } = req.body; // หรือจาก JWT token

    db.query(
      `SELECT e.*, r.Role_name 
       FROM employee e 
       LEFT JOIN Role r ON e.role_ID = r.Role_ID 
       WHERE e.emp_ID = ?`,
      [employee_id],
      (err, results) => {
        if (err || results.length === 0) {
          return res.status(403).json({
            success: false,
            message: 'ไม่พบข้อมูลพนักงาน'
          });
        }

        const employee = results[0];
        
        if (!allowedRoles.includes(employee.Role_name)) {
          return res.status(403).json({
            success: false,
            message: `ไม่มีสิทธิ์เข้าถึง (ต้องการ: ${allowedRoles.join(', ')})`
          });
        }

        req.employee = employee;
        next();
      }
    );
  };
};

// ใช้งาน
app.post('/api/employee/create', 
  checkRole(['Manager']), // ✅ เฉพาะ Manager
  createEmployee
);

app.post('/api/payment/process', 
  checkRole(['Manager', 'Cashier']), // ✅ Manager & Cashier
  processPayment
);
