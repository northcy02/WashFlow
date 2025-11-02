// backend/controllers/branchController.js

import db from '../config/database.js';

// ========================================
// GET ALL BRANCHES
// ========================================
export const getAllBranches = (req, res) => {
  console.log('📥 GET All Branches');

  const sql = `
    SELECT 
      branch_ID,
      branch_name,
      branch_address,
      branch_tel,
      latitude,
      longitude,
      map_url,
      is_active,
      created_at
    FROM branch
    WHERE is_active = TRUE
    ORDER BY branch_name ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    console.log('✅ Found', results.length, 'active branches');

    res.json({
      success: true,
      branches: results
    });
  });
};

// ========================================
// GET BRANCH BY ID
// ========================================
export const getBranchById = (req, res) => {
  const { id } = req.params;

  console.log('📥 GET Branch ID:', id);

  const sql = `
    SELECT 
      branch_ID,
      branch_name,
      branch_address,
      branch_tel,
      latitude,
      longitude,
      map_url,
      is_active
    FROM branch
    WHERE branch_ID = ? AND is_active = TRUE
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสาขา'
      });
    }

    console.log('✅ Branch loaded:', results[0].branch_name);

    res.json({
      success: true,
      branch: results[0]
    });
  });
};

export default {
  getAllBranches,
  getBranchById
};
