// backend/controllers/branchController.js

import db from '../config/database.js';

// ========================================
// 1. GET ALL BRANCHES
// ========================================
export const getAllBranches = (req, res) => {
  try {
    const { active_only = 'true' } = req.query;  // ✅ เพิ่ม filter

    console.log('📥 GET All Branches');
    console.log('   Active only:', active_only);

    // ✅ ระบุ columns ชัดเจน (ไม่ใช้ SELECT *)
    let sql = `
      SELECT 
        branch_ID,
        branch_name,
        branch_address,
        branch_tel,
        is_active,
        created_at,
        updated_at
      FROM branch
    `;

    const params = [];

    // ✅ Filter by active status
    if (active_only === 'true') {
      sql += ' WHERE is_active = TRUE';
    }

    sql += ' ORDER BY branch_name ASC';

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
          error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      console.log('✅ Loaded', results.length, 'branches');

      res.json({
        success: true,
        branches: results,
        total: results.length
      });
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ========================================
// 2. GET BRANCH BY ID
// ========================================
export const getBranchById = (req, res) => {
  try {
    const { id } = req.params;

    console.log('📥 GET Branch ID:', id);

    // ✅ Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสสาขาไม่ถูกต้อง'
      });
    }

    const sql = `
      SELECT 
        branch_ID,
        branch_name,
        branch_address,
        branch_tel,
        is_active,
        created_at,
        updated_at
      FROM branch
      WHERE branch_ID = ?
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

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// ========================================
// 3. CREATE BRANCH
// ========================================
export const createBranch = (req, res) => {
  try {
    const { branch_name, branch_address, branch_tel } = req.body;

    console.log('📥 CREATE Branch');
    console.log('   Data:', { branch_name, branch_address, branch_tel });

    // ✅ Validation
    if (!branch_name || !branch_address) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อสาขาและที่อยู่'
      });
    }

    if (branch_name.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'ชื่อสาขาต้องมีอย่างน้อย 3 ตัวอักษร'
      });
    }

    // ✅ Check duplicate
    const checkSql = 'SELECT branch_ID FROM branch WHERE branch_name = ?';
    
    db.query(checkSql, [branch_name], (err, existing) => {
      if (err) {
        console.error('❌ Check Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'ชื่อสาขานี้มีอยู่แล้ว'
        });
      }

      // ✅ Insert
      const insertSql = `
        INSERT INTO branch 
        (branch_name, branch_address, branch_tel, is_active) 
        VALUES (?, ?, ?, TRUE)
      `;

      db.query(insertSql, [branch_name, branch_address, branch_tel || null], (err, result) => {
        if (err) {
          console.error('❌ Insert Error:', err);
          return res.status(500).json({
            success: false,
            message: 'ไม่สามารถสร้างสาขาได้'
          });
        }

        console.log('✅ Created branch ID:', result.insertId);

        res.status(201).json({
          success: true,
          message: 'สร้างสาขาสำเร็จ',
          branch_id: result.insertId
        });
      });
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// ========================================
// 4. UPDATE BRANCH
// ========================================
export const updateBranch = (req, res) => {
  try {
    const { id } = req.params;
    const { branch_name, branch_address, branch_tel, is_active } = req.body;

    console.log('📥 UPDATE Branch ID:', id);
    console.log('   Data:', req.body);

    // ✅ Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสสาขาไม่ถูกต้อง'
      });
    }

    if (!branch_name || !branch_address) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อสาขาและที่อยู่'
      });
    }

    // ✅ Check if exists
    const checkSql = 'SELECT branch_ID FROM branch WHERE branch_ID = ?';
    
    db.query(checkSql, [id], (err, existing) => {
      if (err) {
        console.error('❌ Check Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบสาขา'
        });
      }

      // ✅ Check duplicate name (exclude current)
      const dupCheckSql = 'SELECT branch_ID FROM branch WHERE branch_name = ? AND branch_ID != ?';
      
      db.query(dupCheckSql, [branch_name, id], (err, duplicate) => {
        if (err) {
          console.error('❌ Duplicate Check Error:', err);
          return res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาด'
          });
        }

        if (duplicate.length > 0) {
          return res.status(409).json({
            success: false,
            message: 'ชื่อสาขานี้มีอยู่แล้ว'
          });
        }

        // ✅ Update
        const updateSql = `
          UPDATE branch 
          SET branch_name = ?, 
              branch_address = ?, 
              branch_tel = ?,
              is_active = ?,
              updated_at = NOW()
          WHERE branch_ID = ?
        `;

        db.query(
          updateSql,
          [branch_name, branch_address, branch_tel || null, is_active !== undefined ? is_active : true, id],
          (err, result) => {
            if (err) {
              console.error('❌ Update Error:', err);
              return res.status(500).json({
                success: false,
                message: 'ไม่สามารถแก้ไขได้'
              });
            }

            console.log('✅ Updated branch ID:', id);

            res.json({
              success: true,
              message: 'แก้ไขสาขาสำเร็จ'
            });
          }
        );
      });
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// ========================================
// 5. DELETE BRANCH (Soft Delete)
// ========================================
export const deleteBranch = (req, res) => {
  try {
    const { id } = req.params;

    console.log('📥 DELETE Branch ID:', id);

    // ✅ Validation
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'รหัสสาขาไม่ถูกต้อง'
      });
    }

    // ✅ Check if has active bookings
    const checkBookingsSql = `
      SELECT COUNT(*) as active_bookings 
      FROM booking 
      WHERE branch_ID = ? 
        AND booking_status NOT IN ('cancelled', 'completed')
    `;

    db.query(checkBookingsSql, [id], (err, bookingResults) => {
      if (err) {
        console.error('❌ Check Bookings Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      const activeBookings = bookingResults[0].active_bookings;

      if (activeBookings > 0) {
        return res.status(400).json({
          success: false,
          message: `ไม่สามารถลบได้ มีการจองที่ยังไม่เสร็จ ${activeBookings} รายการ`
        });
      }

      // ✅ Soft Delete (ไม่ลบจริง แค่ set is_active = FALSE)
      const softDeleteSql = `
        UPDATE branch 
        SET is_active = FALSE, updated_at = NOW() 
        WHERE branch_ID = ?
      `;

      db.query(softDeleteSql, [id], (err, result) => {
        if (err) {
          console.error('❌ Delete Error:', err);
          return res.status(500).json({
            success: false,
            message: 'ไม่สามารถลบได้'
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'ไม่พบสาขา'
          });
        }

        console.log('✅ Soft deleted branch ID:', id);

        res.json({
          success: true,
          message: 'ลบสาขาสำเร็จ'
        });
      });
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// ========================================
// 6. GET BRANCH STATS
// ========================================
export const getBranchStats = (req, res) => {
  try {
    const { id } = req.params;

    console.log('📥 GET Branch Stats ID:', id);

    const sql = `
      SELECT 
        br.branch_ID,
        br.branch_name,
        br.branch_address,
        
        -- Employee Count
        COUNT(DISTINCT e.emp_ID) as total_employees,
        SUM(CASE WHEN e.is_active = TRUE THEN 1 ELSE 0 END) as active_employees,
        
        -- Booking Count
        COUNT(DISTINCT b.booking_ID) as total_bookings,
        SUM(CASE WHEN b.booking_status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN b.booking_status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        
        -- Revenue
        COALESCE(SUM(CASE WHEN b.booking_status = 'completed' THEN b.final_amount ELSE 0 END), 0) as total_revenue
        
      FROM branch br
      LEFT JOIN employee e ON br.branch_ID = e.branch_ID
      LEFT JOIN booking b ON br.branch_ID = b.branch_ID
      WHERE br.branch_ID = ?
      GROUP BY br.branch_ID, br.branch_name, br.branch_address
    `;

    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('❌ Stats Error:', err);
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

      console.log('✅ Stats loaded for:', results[0].branch_name);

      res.json({
        success: true,
        stats: results[0]
      });
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// ========================================
// 7. GET BRANCHES WITH STATS (Overview)
// ========================================
export const getBranchesWithStats = (req, res) => {
  try {
    console.log('📥 GET Branches with Stats');

    const sql = `
      SELECT 
        br.branch_ID,
        br.branch_name,
        br.branch_address,
        br.branch_tel,
        br.is_active,
        
        COUNT(DISTINCT e.emp_ID) as total_employees,
        COUNT(DISTINCT CASE WHEN b.booking_status = 'pending' THEN b.booking_ID END) as pending_bookings,
        COUNT(DISTINCT b.booking_ID) as total_bookings,
        COALESCE(SUM(CASE WHEN b.booking_status = 'completed' THEN b.final_amount ELSE 0 END), 0) as revenue
        
      FROM branch br
      LEFT JOIN employee e ON br.branch_ID = e.branch_ID AND e.is_active = TRUE
      LEFT JOIN booking b ON br.branch_ID = b.branch_ID
      WHERE br.is_active = TRUE
      GROUP BY br.branch_ID, br.branch_name, br.branch_address, br.branch_tel, br.is_active
      ORDER BY br.branch_name ASC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      console.log('✅ Loaded', results.length, 'branches with stats');

      res.json({
        success: true,
        branches: results,
        total: results.length
      });
    });

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// ========================================
// EXPORTS
// ========================================
export default {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchStats,
  getBranchesWithStats
};
