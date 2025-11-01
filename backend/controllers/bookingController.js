// backend/controllers/bookingController.js
import db from '../config/database.js';

// ========================================
// HELPER: Generate Receipt Number
// ========================================
const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `RC${year}${month}${day}${random}`;
};

// ========================================
// HELPER: Calculate Service Duration
// ========================================
const calculateServiceDuration = async (connection, services) => {
  try {
    const [serviceTypes] = await connection.query(
      'SELECT serviceType_Duration FROM service_type WHERE serviceType_Name IN (?)',
      [services]
    );
    
    const totalDuration = serviceTypes.reduce((sum, service) => {
      return sum + (parseInt(service.serviceType_Duration) || 30);
    }, 0);
    
    return totalDuration || 30;
  } catch (error) {
    console.error('❌ Error calculating duration:', error);
    return 30; // Default
  }
};

// ========================================
// HELPER: Check Booking Conflict
// ========================================
const checkBookingConflict = async (connection, branch_id, booking_date, booking_time, duration) => {
  try {
    const [existingBookings] = await connection.query(`
      SELECT booking_time, duration 
      FROM booking 
      WHERE branch_ID = ? 
        AND DATE(booking_date) = DATE(?) 
        AND booking_status NOT IN ('cancelled')
    `, [branch_id, booking_date]);

    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const requestStart = timeToMinutes(booking_time);
    const requestEnd = requestStart + duration;

    for (const booking of existingBookings) {
      const existingStart = timeToMinutes(booking.booking_time);
      const existingEnd = existingStart + (booking.duration || 30);

      const hasOverlap = (
        (requestStart < existingEnd && requestEnd > existingStart) ||
        (requestStart >= existingStart && requestStart < existingEnd)
      );

      if (hasOverlap) {
        return {
          conflict: true,
          message: `ช่วงเวลา ${booking_time} - ${booking.booking_time} ทับซ้อนกัน กรุณาเลือกเวลาอื่น`
        };
      }
    }

    return { conflict: false };

  } catch (error) {
    console.error('❌ Error checking conflict:', error);
    return { conflict: false };
  }
};

// ========================================
// HELPER: Calculate Membership Benefits
// ========================================
const calculateMembershipBenefits = async (connection, customer_id, subtotal) => {
  try {
    // Get customer membership info
    const [customers] = await connection.query(`
      SELECT 
        c.available_points,
        t.discount_percent,
        t.points_multiplier
      FROM customer c
      LEFT JOIN membership_tier t ON c.membership_tier_ID = t.tier_ID
      WHERE c.cust_ID = ?
    `, [customer_id]);

    if (customers.length === 0) {
      return {
        discount_percent: 0,
        membership_discount: 0,
        points_multiplier: 1.0,
        available_points: 0
      };
    }

    const customer = customers[0];
    const discount_percent = parseFloat(customer.discount_percent) || 0;
    const membership_discount = Math.floor(subtotal * (discount_percent / 100));
    
    return {
      discount_percent,
      membership_discount,
      points_multiplier: parseFloat(customer.points_multiplier) || 1.0,
      available_points: parseInt(customer.available_points) || 0
    };

  } catch (error) {
    console.error('❌ Error calculating membership:', error);
    return {
      discount_percent: 0,
      membership_discount: 0,
      points_multiplier: 1.0,
      available_points: 0
    };
  }
};

// ========================================
// HELPER: Award Points
// ========================================
const awardPoints = async (connection, customer_id, booking_id, amount, multiplier) => {
  try {
    // Calculate points (10 Baht = 1 Point * multiplier)
    const basePoints = Math.floor(amount / 10);
    const points = Math.floor(basePoints * multiplier);

    if (points <= 0) return 0;

    // Add points to customer
    await connection.query(`
      UPDATE customer 
      SET total_points = total_points + ?,
          available_points = available_points + ?
      WHERE cust_ID = ?
    `, [points, points, customer_id]);

    // Record transaction
    await connection.query(`
      INSERT INTO point_transaction 
      (cust_ID, booking_ID, transaction_type, points, description, related_amount)
      VALUES (?, ?, 'earn', ?, ?, ?)
    `, [customer_id, booking_id, points, `Earned from booking #${booking_id}`, amount]);

    console.log(`✅ Awarded ${points} points to customer ${customer_id}`);
    
    return points;

  } catch (error) {
    console.error('❌ Error awarding points:', error);
    return 0;
  }
};

// ========================================
// CREATE BOOKING
// ========================================
export const createBooking = async (req, res) => {
  console.log('');
  console.log('📥 ========== CREATE BOOKING REQUEST ==========');
  console.log('Request body:', req.body);

  const {
    customer_id,
    branch_id,
    booking_date,
    booking_time,
    duration,
    vehicle_type,
    vehicle_plate = null,
    vehicle_color = null,
    services,
    payment_method,
    total_amount,
    points_to_use = 0  // ✅ รับ points ที่ต้องการใช้
  } = req.body;

  // Validation
  if (!customer_id || !branch_id || !booking_date || !booking_time || 
      !vehicle_type || !services || services.length === 0 || !payment_method) {
    console.log('❌ Validation Failed');
    return res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ครบถ้วน'
    });
  }

  const promisePool = db.promise();
  let connection;
  
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    console.log('🔄 Transaction Started');

    // Calculate service duration
    const serviceDuration = duration || await calculateServiceDuration(connection, services);
    console.log(`⏱️ Total service duration: ${serviceDuration} minutes`);

    // Check booking conflict
    const conflictCheck = await checkBookingConflict(
      connection,
      branch_id,
      booking_date,
      booking_time,
      serviceDuration
    );

    if (conflictCheck.conflict) {
      await connection.rollback();
      console.log('❌ Booking conflict detected');
      return res.status(409).json({
        success: false,
        message: conflictCheck.message,
        error: 'BOOKING_CONFLICT'
      });
    }

    // ✅ Calculate Membership Benefits
    const membershipBenefits = await calculateMembershipBenefits(
      connection, 
      customer_id, 
      total_amount
    );

    console.log('💎 Membership Benefits:', membershipBenefits);

    // ✅ Calculate Points Discount
    let points_discount = 0;
    let actual_points_used = 0;

    if (points_to_use > 0) {
      if (points_to_use > membershipBenefits.available_points) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'คะแนนไม่เพียงพอ'
        });
      }

      // 100 points = 10 Baht
      points_discount = Math.floor(points_to_use * 0.1);
      actual_points_used = points_to_use;

      console.log(`⭐ Using ${actual_points_used} points = ฿${points_discount} discount`);
    }

    // ✅ Calculate Final Amount
    const subtotal = parseFloat(total_amount);
    const membership_discount = membershipBenefits.membership_discount;
    const final_amount = subtotal - membership_discount - points_discount;

    console.log('💰 Pricing Breakdown:');
    console.log(`   Subtotal: ฿${subtotal}`);
    console.log(`   Membership Discount (${membershipBenefits.discount_percent}%): -฿${membership_discount}`);
    console.log(`   Points Discount (${actual_points_used} pts): -฿${points_discount}`);
    console.log(`   Final Amount: ฿${final_amount}`);

    // 1️⃣ Get/Create Vehicle Type
    console.log('1️⃣ Checking vehicle_type:', vehicle_type);
    const [vtypes] = await connection.query(
      'SELECT vehicletype_ID FROM vehicle_type WHERE vehicletype_name = ?',
      [vehicle_type]
    );

    let vtypeId;
    if (vtypes.length === 0) {
      const [vtypeResult] = await connection.query(
        'INSERT INTO vehicle_type (vehicletype_name, vehicletype_multiplier) VALUES (?, 1.00)',
        [vehicle_type]
      );
      vtypeId = vtypeResult.insertId;
      console.log('   ✅ Created vehicle_type ID:', vtypeId);
    } else {
      vtypeId = vtypes[0].vehicletype_ID;
      console.log('   ✅ Found vehicle_type ID:', vtypeId);
    }

    // 2️⃣ Create/Find Vehicle
    console.log('2️⃣ Checking vehicle...');
    let vehicleId;
    
    if (vehicle_plate) {
      const [existingVehicles] = await connection.query(
        'SELECT vehicle_ID FROM vehicle WHERE vehicle_plate = ? AND cust_ID = ?',
        [vehicle_plate, customer_id]
      );

      if (existingVehicles.length > 0) {
        vehicleId = existingVehicles[0].vehicle_ID;
        console.log('   ✅ Found existing vehicle ID:', vehicleId);
      } else {
        const [vehicleResult] = await connection.query(
          'INSERT INTO vehicle (vehicle_plate, vehicle_color, cust_ID, vehicletype_ID) VALUES (?, ?, ?, ?)',
          [vehicle_plate, vehicle_color, customer_id, vtypeId]
        );
        vehicleId = vehicleResult.insertId;
        console.log('   ✅ Created new vehicle ID:', vehicleId);
      }
    } else {
      const tempPlate = `TEMP-${customer_id}-${Date.now()}`;
      const [vehicleResult] = await connection.query(
        'INSERT INTO vehicle (vehicle_plate, vehicle_color, cust_ID, vehicletype_ID) VALUES (?, ?, ?, ?)',
        [tempPlate, vehicle_color || 'N/A', customer_id, vtypeId]
      );
      vehicleId = vehicleResult.insertId;
      console.log('   ✅ Created temp vehicle ID:', vehicleId);
    }

    // 3️⃣ Create Booking
    console.log('3️⃣ Creating booking...');
    const bookingDateTime = `${booking_date} ${booking_time}:00`;
    
    const [bookingResult] = await connection.query(`
      INSERT INTO booking 
      (booking_date, booking_time, duration, booking_status, membership_discount, points_used, subtotal, final_amount, cust_ID, branch_ID) 
      VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?)
    `, [
      bookingDateTime,
      booking_time,
      serviceDuration,
      membership_discount,
      actual_points_used,
      subtotal,
      final_amount,
      customer_id,
      branch_id
    ]);
    
    const bookingId = bookingResult.insertId;
    console.log('   ✅ Created booking ID:', bookingId);

    // ✅ Deduct Points (if used)
    if (actual_points_used > 0) {
      await connection.query(`
        UPDATE customer 
        SET available_points = available_points - ?
        WHERE cust_ID = ?
      `, [actual_points_used, customer_id]);

      await connection.query(`
        INSERT INTO point_transaction 
        (cust_ID, booking_ID, transaction_type, points, description, related_amount)
        VALUES (?, ?, 'redeem', ?, ?, ?)
      `, [customer_id, bookingId, -actual_points_used, `Redeemed for booking #${bookingId}`, points_discount]);

      await connection.query(`
        INSERT INTO point_redemption 
        (cust_ID, booking_ID, points_used, discount_amount, redemption_rate)
        VALUES (?, ?, ?, ?, 100.00)
      `, [customer_id, bookingId, actual_points_used, points_discount]);

      console.log(`   ✅ Deducted ${actual_points_used} points`);
    }

    // 4️⃣ Create Payment
    console.log('4️⃣ Creating payment...');
    const [paymentResult] = await connection.query(
      'INSERT INTO payment (payment_amount, payment_method, payment_status, booking_ID) VALUES (?, ?, ?, ?)',
      [final_amount, payment_method, 'pending', bookingId]
    );
    const paymentId = paymentResult.insertId;
    console.log('   ✅ Created payment ID:', paymentId);

    // 5️⃣ Create Receipt
    console.log('5️⃣ Creating receipt...');
    const receiptNumber = generateReceiptNumber();
    const receiptDesc = `จองบริการล้างรถ - ${vehicle_type} | บริการ: ${services.join(', ')}`;
    
    await connection.query(
      'INSERT INTO receipt (receipt_number, receipt_description, payment_ID) VALUES (?, ?, ?)',
      [receiptNumber, receiptDesc, paymentId]
    );
    console.log('   ✅ Created receipt:', receiptNumber);

    // 6️⃣ Create Service
    console.log('6️⃣ Creating service...');
    const [serviceResult] = await connection.query(
      'INSERT INTO service (service_status, booking_ID, vehicle_ID) VALUES (?, ?, ?)',
      ['pending', bookingId, vehicleId]
    );
    const serviceId = serviceResult.insertId;
    console.log('   ✅ Created service ID:', serviceId);

    // 7️⃣ Create Service Details
    console.log('7️⃣ Creating service details...');
    const [serviceTypes] = await connection.query(
      'SELECT serviceType_ID, serviceType_Name, serviceType_BasePrice FROM service_type WHERE serviceType_Name IN (?)',
      [services]
    );

    console.log('   Found service types:', serviceTypes.length);
    
    if (serviceTypes.length === 0) {
      throw new Error(`ไม่พบบริการที่ต้องการ: ${services.join(', ')}`);
    }

    // Find employee (pos_ID = 3 คือ Cleaner)
    const [employees] = await connection.query(
      'SELECT emp_ID FROM employee WHERE pos_ID = 3 AND is_active = TRUE LIMIT 1'
    );
    const employeeId = employees.length > 0 ? employees[0].emp_ID : null;
    console.log('   Using employee ID:', employeeId);

    for (const serviceType of serviceTypes) {
      await connection.query(
        'INSERT INTO service_detail (sdetail_quantity, sdetail_price, service_ID, serviceType_ID, emp_ID) VALUES (?, ?, ?, ?, ?)',
        [1, serviceType.serviceType_BasePrice, serviceId, serviceType.serviceType_ID, employeeId]
      );
      console.log(`   ✅ Added: ${serviceType.serviceType_Name}`);
    }

    // ✅ Update booking with points_earned (will be awarded when completed)
    const points_earned = Math.floor((final_amount / 10) * membershipBenefits.points_multiplier);
    
    await connection.query(
      'UPDATE booking SET points_earned = ? WHERE booking_ID = ?',
      [points_earned, bookingId]
    );

    console.log(`   ✅ Points to be earned: ${points_earned} (when completed)`);

    await connection.commit();
    console.log('✅ Transaction Committed!');
    console.log('======================================');

    res.json({
      success: true,
      message: 'จองบริการสำเร็จ!',
      booking: {
        id: bookingId,
        receipt_number: receiptNumber,
        booking_date: bookingDateTime,
        booking_time: booking_time,
        duration: serviceDuration,
        subtotal: subtotal,
        membership_discount: membership_discount,
        points_used: actual_points_used,
        points_discount: points_discount,
        final_amount: final_amount,
        points_to_earn: points_earned
      }
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
      console.log('🔄 Transaction Rolled Back');
    }
    
    console.error('❌ Booking Error:', error);
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
// GET BOOKING HISTORY
// ========================================
export const getBookingHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    console.log('📥 GET Booking History for Customer:', customerId);

    const sql = `
      SELECT 
        b.booking_ID,
        b.booking_date,
        b.booking_time,
        b.duration,
        b.booking_status,
        b.membership_discount,
        b.points_earned,
        b.points_used,
        b.subtotal,
        b.final_amount,
        p.payment_amount,
        p.payment_method,
        p.payment_status,
        r.receipt_number,
        r.receipt_description
      FROM booking b
      LEFT JOIN payment p ON b.booking_ID = p.booking_ID
      LEFT JOIN receipt r ON p.payment_ID = r.payment_ID
      WHERE b.cust_ID = ?
      ORDER BY b.booking_date DESC, b.created_at DESC
    `;

    db.query(sql, [customerId], (err, results) => {
      if (err) {
        console.error('❌ Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      console.log('✅ Found', results.length, 'bookings');

      res.json({
        success: true,
        bookings: results
      });
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// ========================================
// GET ALL ACTIVE BOOKINGS (สำหรับเช็คเวลา)
// ========================================
export const getAllActiveBookings = async (req, res) => {
  try {
    const { date, branch_id } = req.query;

    let sql = `
      SELECT 
        booking_ID,
        booking_date,
        booking_time,
        duration,
        booking_status
      FROM booking
      WHERE booking_status NOT IN ('cancelled')
    `;

    const params = [];

    if (date) {
      sql += ' AND DATE(booking_date) = ?';
      params.push(date);
    }

    if (branch_id) {
      sql += ' AND branch_ID = ?';
      params.push(branch_id);
    }

    sql += ' ORDER BY booking_date ASC, booking_time ASC';

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('❌ Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      // Format results
      const bookings = results.map(b => ({
        booking_date: b.booking_date.toISOString().split('T')[0],
        booking_time: b.booking_time,
        duration: b.duration || 30
      }));

      console.log('✅ Found', bookings.length, 'active bookings');

      res.json({
        success: true,
        bookings: bookings
      });
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  }
};

// ========================================
// CANCEL BOOKING
// ========================================
export const cancelBooking = async (req, res) => {
  const promisePool = db.promise();
  let connection;

  try {
    const { id } = req.params;

    console.log('🗑️ Cancelling booking:', id);

    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    // Get booking info
    const [bookings] = await connection.query(
      'SELECT cust_ID, points_used FROM booking WHERE booking_ID = ?',
      [id]
    );

    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'ไม่พบการจอง'
      });
    }

    const booking = bookings[0];

    // ✅ Refund Points (if used)
    if (booking.points_used > 0) {
      await connection.query(`
        UPDATE customer 
        SET available_points = available_points + ?
        WHERE cust_ID = ?
      `, [booking.points_used, booking.cust_ID]);

      await connection.query(`
        INSERT INTO point_transaction 
        (cust_ID, booking_ID, transaction_type, points, description)
        VALUES (?, ?, 'adjust', ?, ?)
      `, [booking.cust_ID, id, booking.points_used, `Refund from cancelled booking #${id}`]);

      console.log(`   ✅ Refunded ${booking.points_used} points`);
    }

    // Update booking status
    await connection.query(
      'UPDATE booking SET booking_status = ?, updated_at = NOW() WHERE booking_ID = ?',
      ['cancelled', id]
    );

    // Update service status
    await connection.query(
      'UPDATE service SET service_status = ? WHERE booking_ID = ?',
      ['cancelled', id]
    );

    // Update payment status
    await connection.query(
      'UPDATE payment SET payment_status = ? WHERE booking_ID = ?',
      ['refunded', id]
    );

    await connection.commit();
    console.log('✅ Booking cancelled successfully');

    res.json({
      success: true,
      message: 'ยกเลิกการจองสำเร็จ',
      refunded_points: booking.points_used
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    
    console.error('❌ Cancel Error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาด'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// ========================================
// EXPORTS
// ========================================
export default {
  createBooking,
  getBookingHistory,
  getAllActiveBookings,
  cancelBooking
};
