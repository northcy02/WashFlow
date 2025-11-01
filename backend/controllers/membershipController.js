// backend/controllers/membershipController.js
import db from '../config/database.js';

// ========================================
// 1. GET CUSTOMER MEMBERSHIP INFO
// ========================================
export const getMembershipInfo = (req, res) => {
  const { customerId } = req.params;

  console.log('📥 GET Membership Info for Customer:', customerId);

  const sql = `
    SELECT 
      c.cust_ID,
      c.cust_fname,
      c.cust_lname,
      c.total_points,
      c.available_points,
      c.total_spent,
      
      t.tier_ID,
      t.tier_name,
      t.tier_color,
      t.tier_icon,
      t.discount_percent,
      t.points_multiplier,
      t.benefits,
      
      -- Next Tier Info
      (SELECT tier_name FROM membership_tier 
       WHERE tier_order > t.tier_order 
       ORDER BY tier_order ASC LIMIT 1) as next_tier_name,
      (SELECT min_points FROM membership_tier 
       WHERE tier_order > t.tier_order 
       ORDER BY tier_order ASC LIMIT 1) as next_tier_points,
      (SELECT min_spent FROM membership_tier 
       WHERE tier_order > t.tier_order 
       ORDER BY tier_order ASC LIMIT 1) as next_tier_spent
      
    FROM customer c
    LEFT JOIN membership_tier t ON c.membership_tier_ID = t.tier_ID
    WHERE c.cust_ID = ?
  `;

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error('❌ Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลลูกค้า'
      });
    }

    const data = results[0];
    
    // Parse benefits JSON
    if (data.benefits) {
      try {
        data.benefits = JSON.parse(data.benefits);
      } catch (e) {
        data.benefits = [];
      }
    }

    // คำนวณ progress ไปยัง tier ถัดไป
    if (data.next_tier_points) {
      data.points_progress = {
        current: data.total_points,
        required: data.next_tier_points,
        remaining: data.next_tier_points - data.total_points,
        percentage: Math.min(100, (data.total_points / data.next_tier_points) * 100)
      };
      
      data.spent_progress = {
        current: parseFloat(data.total_spent),
        required: parseFloat(data.next_tier_spent),
        remaining: parseFloat(data.next_tier_spent) - parseFloat(data.total_spent),
        percentage: Math.min(100, (parseFloat(data.total_spent) / parseFloat(data.next_tier_spent)) * 100)
      };
    }

    console.log('✅ Membership Info:', {
      tier: data.tier_name,
      points: data.available_points,
      spent: data.total_spent
    });

    res.json({
      success: true,
      membership: data
    });
  });
};

// ========================================
// 2. GET POINT HISTORY
// ========================================
export const getPointHistory = (req, res) => {
  const { customerId } = req.params;
  const { limit = 20 } = req.query;

  console.log('📥 GET Point History for Customer:', customerId);

  const sql = `
    SELECT 
      pt.transaction_ID,
      pt.transaction_type,
      pt.points,
      pt.description,
      pt.related_amount,
      pt.created_at,
      pt.booking_ID
    FROM point_transaction pt
    WHERE pt.cust_ID = ?
    ORDER BY pt.created_at DESC
    LIMIT ?
  `;

  db.query(sql, [customerId, parseInt(limit)], (err, results) => {
    if (err) {
      console.error('❌ Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    console.log('✅ Found', results.length, 'transactions');

    res.json({
      success: true,
      transactions: results
    });
  });
};

// ========================================
// 3. REDEEM POINTS
// ========================================
export const redeemPoints = async (req, res) => {
  const { customerId, points, bookingId } = req.body;

  console.log('💰 REDEEM Points:', { customerId, points, bookingId });

  // Validation
  if (!customerId || !points || points <= 0) {
    return res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ถูกต้อง'
    });
  }

  const promisePool = db.promise();
  let connection;

  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    // 1. ตรวจสอบ point ของลูกค้า
    const [customer] = await connection.query(
      'SELECT available_points FROM customer WHERE cust_ID = ?',
      [customerId]
    );

    if (customer.length === 0) {
      throw new Error('ไม่พบข้อมูลลูกค้า');
    }

    if (customer[0].available_points < points) {
      throw new Error('Point ไม่เพียงพอ');
    }

    // 2. คำนวณส่วนลด (100 points = 10 บาท)
    const redemptionRate = 100; // 100 points
    const discountAmount = (points / redemptionRate) * 10; // = 10 บาท

    // 3. หัก points จากลูกค้า
    await connection.query(
      'UPDATE customer SET available_points = available_points - ? WHERE cust_ID = ?',
      [points, customerId]
    );

    // 4. บันทึก point_transaction
    await connection.query(
      `INSERT INTO point_transaction 
       (cust_ID, booking_ID, transaction_type, points, description, related_amount) 
       VALUES (?, ?, 'redeem', ?, ?, ?)`,
      [customerId, bookingId, -points, `Redeemed ${points} points for ${discountAmount} Baht discount`, discountAmount]
    );

    // 5. บันทึก point_redemption
    const [redemptionResult] = await connection.query(
      `INSERT INTO point_redemption 
       (cust_ID, booking_ID, points_used, discount_amount, redemption_rate) 
       VALUES (?, ?, ?, ?, ?)`,
      [customerId, bookingId, points, discountAmount, redemptionRate]
    );

    // 6. อัพเดท booking (ถ้ามี bookingId)
    if (bookingId) {
      await connection.query(
        'UPDATE booking SET points_used = ? WHERE booking_ID = ?',
        [points, bookingId]
      );
    }

    await connection.commit();

    console.log('✅ Points redeemed successfully!');
    console.log(`   Points: ${points} → Discount: ฿${discountAmount}`);

    res.json({
      success: true,
      message: 'ใช้ Point สำเร็จ',
      points_used: points,
      discount_amount: discountAmount,
      redemption_id: redemptionResult.insertId
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error('❌ Redeem Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาด'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// ========================================
// 4. EARN POINTS (เรียกหลังจากชำระเงินสำเร็จ)
// ========================================
export const earnPoints = async (customerId, bookingId, amountPaid) => {
  const promisePool = db.promise();
  let connection;

  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    // 1. ดึงข้อมูล customer และ tier
    const [customer] = await connection.query(
      `SELECT c.*, t.points_multiplier 
       FROM customer c 
       LEFT JOIN membership_tier t ON c.membership_tier_ID = t.tier_ID 
       WHERE c.cust_ID = ?`,
      [customerId]
    );

    if (customer.length === 0) {
      throw new Error('ไม่พบข้อมูลลูกค้า');
    }

    const { points_multiplier } = customer[0];

    // 2. คำนวณ points (100 บาท = 1 point, คูณด้วย multiplier)
    const basePoints = Math.floor(amountPaid / 100);
    const earnedPoints = Math.floor(basePoints * points_multiplier);

    console.log(`💰 Earn Points: ${amountPaid} Baht → ${basePoints} base points × ${points_multiplier} = ${earnedPoints} points`);

    // 3. เพิ่ม points ให้ลูกค้า
    await connection.query(
      `UPDATE customer 
       SET total_points = total_points + ?,
           available_points = available_points + ?,
           total_spent = total_spent + ?
       WHERE cust_ID = ?`,
      [earnedPoints, earnedPoints, amountPaid, customerId]
    );

    // 4. บันทึก point_transaction
    await connection.query(
      `INSERT INTO point_transaction 
       (cust_ID, booking_ID, transaction_type, points, description, related_amount) 
       VALUES (?, ?, 'earn', ?, ?, ?)`,
      [customerId, bookingId, earnedPoints, `Earned from booking #${bookingId}`, amountPaid]
    );

    // 5. อัพเดท booking
    await connection.query(
      'UPDATE booking SET points_earned = ? WHERE booking_ID = ?',
      [earnedPoints, bookingId]
    );

    // 6. เช็คและอัพเกรด tier (ถ้าถึงเกณฑ์)
    await checkAndUpgradeTier(connection, customerId);

    await connection.commit();

    console.log('✅ Points earned successfully!');
    return { success: true, points: earnedPoints };

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('❌ Earn Points Error:', error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// ========================================
// 5. CHECK AND UPGRADE TIER
// ========================================
const checkAndUpgradeTier = async (connection, customerId) => {
  // ดึงข้อมูล customer
  const [customer] = await connection.query(
    'SELECT total_points, total_spent, membership_tier_ID FROM customer WHERE cust_ID = ?',
    [customerId]
  );

  if (customer.length === 0) return;

  const { total_points, total_spent, membership_tier_ID } = customer[0];

  // หา tier ที่เหมาะสม
  const [newTier] = await connection.query(
    `SELECT tier_ID, tier_name 
     FROM membership_tier 
     WHERE (min_points <= ? OR min_spent <= ?) 
     ORDER BY tier_order DESC 
     LIMIT 1`,
    [total_points, total_spent]
  );

  if (newTier.length === 0) return;

  const newTierId = newTier[0].tier_ID;

  // ถ้า tier เปลี่ยน → อัพเกรด
  if (newTierId !== membership_tier_ID) {
    await connection.query(
      'UPDATE customer SET membership_tier_ID = ?, last_tier_check = NOW() WHERE cust_ID = ?',
      [newTierId, customerId]
    );

    // บันทึก bonus points สำหรับการอัพเกรด
    const bonusPoints = 100; // Bonus 100 points เมื่ออัพเกรด
    await connection.query(
      `INSERT INTO point_transaction 
       (cust_ID, transaction_type, points, description) 
       VALUES (?, 'bonus', ?, ?)`,
      [customerId, bonusPoints, `Tier upgrade bonus: Welcome to ${newTier[0].tier_name}`]
    );

    await connection.query(
      'UPDATE customer SET available_points = available_points + ? WHERE cust_ID = ?',
      [bonusPoints, customerId]
    );

    console.log(`🎉 TIER UPGRADED: Customer ${customerId} → ${newTier[0].tier_name} (+${bonusPoints} bonus points)`);
  }
};

// ========================================
// 6. GET ALL TIERS (สำหรับแสดงใน Frontend)
// ========================================
export const getAllTiers = (req, res) => {
  console.log('📥 GET All Membership Tiers');

  const sql = `
    SELECT 
      tier_ID,
      tier_name,
      tier_color,
      tier_icon,
      min_points,
      min_spent,
      discount_percent,
      points_multiplier,
      benefits,
      tier_order
    FROM membership_tier
    ORDER BY tier_order ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error:', err);
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาด'
      });
    }

    // Parse benefits JSON
    results.forEach(tier => {
      if (tier.benefits) {
        try {
          tier.benefits = JSON.parse(tier.benefits);
        } catch (e) {
          tier.benefits = [];
        }
      }
    });

    console.log('✅ Loaded', results.length, 'tiers');

    res.json({
      success: true,
      tiers: results
    });
  });
};
