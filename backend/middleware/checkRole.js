// backend/middleware/checkRole.js
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const { employee_id } = req.body;

    db.query(
      `SELECT e.*, p.pos_name as role            -- เปลี่ยนจาก Role_name
       FROM employee e 
       LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID 
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
        
        if (!allowedRoles.includes(employee.role)) {  // เปลี่ยนจาก Role_name
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
