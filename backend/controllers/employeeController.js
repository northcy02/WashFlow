// backend/controllers/employeeController.js

// Login
const sql = `
  SELECT 
    e.emp_ID as id,
    e.emp_fname as firstName,
    e.emp_lname as lastName,
    e.emp_username as username,
    e.emp_password as password,
    e.emp_address as address,
    e.branch_ID as branchId,
    p.pos_name as role,           -- เปลี่ยนจาก role ใช้ position
    p.pos_ID as roleId,            -- เปลี่ยนจาก role_ID
    p.pos_salary as salary,
    b.branch_name as branchName,
    'employee' as userType
  FROM employee e
  LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID  -- แก้ JOIN
  LEFT JOIN branch b ON e.branch_ID = b.branch_ID
  WHERE e.emp_username = ?
`;

// Get All Employees
const sql = `
  SELECT 
    e.*,
    p.pos_name as role,           -- เปลี่ยนจาก Role_name
    p.pos_salary as salary,
    b.branch_name
  FROM employee e
  LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID
  LEFT JOIN branch b ON e.branch_ID = b.branch_ID
  ORDER BY e.created_at DESC
`;
