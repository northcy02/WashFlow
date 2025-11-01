// backend/controllers/bookingController.js
import db from '../config/database.js';

// ✅ Helper: สร้างเลขที่ใบเสร็จ
const generateReceiptNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `RC${year}${month}${day}${random}`;
};

// ✅ Helper: ตรวจสอบการจองซ้ำ
const checkBookingConflict = async (connection, branch_id, booking_date, booking_time, duration) => {
  const [existingBookings] = await connection.query(
    `SELECT booking_ID, booking_date, duration 
     FROM booking 
     WHERE branch_ID = ? 
       AND DATE(booking_date) = ? 
       AND booking_status IN ('pending', 'confirmed', 'in_progress')`,
    [branch_id, booking_date]
  );

  const requestedStart = new Date(`${booking_date} ${booking_time}`);
  const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);

  for (const booking of existingBookings) {
    const existingStart = new Date(booking.booking_date);
    const existingEnd = new Date(existingStart.getTime() + (booking.duration || 30) * 60000);

    if (
      (requestedStart >= existingStart && requestedStart < existingEnd) ||
      (requestedEnd > existingStart && requestedEnd <= existingEnd) ||
      (requestedStart <= existingStart && requestedEnd >= existingEnd)
    ) {
      return {
        conflict: true,
        message: 'ช่วงเวลานี้มีการจองแล้ว กรุณาเลือกเวลาอื่น'
      };
    }
  }

  return { conflict: false };
};

// ✅ คำนวณระยะเวลาบริการ
const calculateServiceDuration = async (connection, services) => {
  const [serviceTypes] = await connection.query(
    'SELECT serviceType_Duration FROM service_type WHERE serviceType_Name IN (?)',
    [services]
  );
  
  const totalDuration = serviceTypes.reduce((sum, service) => {
    return sum + (parseInt(service.serviceType_Duration) || 30);
  }, 0);
  
  return totalDuration || 30;
};

// ========================================
// 1. CREATE BOOKING
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
    total_amount
  } = req.body;

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

    const serviceDuration = duration || await calculateServiceDuration(connection, services);
    console.log(`⏱️ Total service duration: ${serviceDuration} minutes`);

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

    // 1️⃣ หา/สร้าง vehicle_type
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

    // 2️⃣ สร้าง/หา Vehicle
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

    // 3️⃣ สร้าง Booking
    console.log('3️⃣ Creating booking...');
    const bookingDateTime = `${booking_date} ${booking_time}:00`;
    const [bookingResult] = await connection.query(
      'INSERT INTO booking (booking_date, booking_status, cust_ID, branch_ID, duration) VALUES (?, ?, ?, ?, ?)',
      [bookingDateTime, 'pending', customer_id, branch_id, serviceDuration]
    );
    const bookingId = bookingResult.insertId;
    console.log('   ✅ Created booking ID:', bookingId);

    // 4️⃣ สร้าง Payment
    console.log('4️⃣ Creating payment...');
    const [paymentResult] = await connection.query(
      'INSERT INTO payment (payment_amount, payment_method, booking_ID) VALUES (?, ?, ?)',
      [total_amount, payment_method, bookingId]
    );
    const paymentId = paymentResult.insertId;
    console.log('   ✅ Created payment ID:', paymentId);

    // 5️⃣ สร้าง Receipt
    console.log('5️⃣ Creating receipt...');
    const receiptNumber = generateReceiptNumber();
    const receiptDesc = `จองบริการล้างรถ - ${vehicle_type} | บริการ: ${services.join(', ')}`;
    
    await connection.query(
      'INSERT INTO receipt (receipt_number, receipt_description, payment_ID) VALUES (?, ?, ?)',
      [receiptNumber, receiptDesc, paymentId]
    );
    console.log('   ✅ Created receipt:', receiptNumber);

    // 6️⃣ สร้าง Service
    console.log('6️⃣ Creating service...');
    const [serviceResult] = await connection.query(
      'INSERT INTO service (service_status, booking_ID, vehicle_ID) VALUES (?, ?, ?)',
      ['pending', bookingId, vehicleId]
    );
    const serviceId = serviceResult.insertId;
    console.log('   ✅ Created service ID:', serviceId);

    // 7️⃣ สร้าง Service Details
    console.log('7️⃣ Creating service details...');
    const [serviceTypes] = await connection.query(
      'SELECT serviceType_ID, serviceType_Name, serviceType_BasePrice FROM service_type WHERE serviceType_Name IN (?)',
      [services]
    );

    console.log('   Found service types:', serviceTypes.length);
    
    if (serviceTypes.length === 0) {
      throw new Error(`ไม่พบบริการที่ต้องการ: ${services.join(', ')}`);
    }

    const [employees] = await connection.query(
      'SELECT emp_ID FROM employee WHERE pos_ID = 2 LIMIT 1'
    );
    const employeeId = employees.length > 0 ? employees[0].emp_ID : 1;
    console.log('   Using employee ID:', employeeId);

    for (const serviceType of serviceTypes) {
      await connection.query(
        'INSERT INTO service_detail (sdetail_quantity, sdetail_price, service_ID, serviceType_ID, emp_ID) VALUES (?, ?, ?, ?, ?)',
        [1, serviceType.serviceType_BasePrice, serviceId, serviceType.serviceType_ID, employeeId]
      );
      console.log(`   ✅ Added: ${serviceType.serviceType_Name}`);
    }

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
        total_amount,
        duration: serviceDuration
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
// 2. GET BOOKING HISTORY
// ========================================
export const getBookingHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    const sql = `
      SELECT 
        b.booking_ID,
        b.booking_date,
        b.booking_status,
        b.duration,
        p.payment_amount,
        p.payment_method,
        r.receipt_number,
        r.receipt_description
      FROM booking b
      LEFT JOIN payment p ON b.booking_ID = p.booking_ID
      LEFT JOIN receipt r ON p.payment_ID = r.payment_ID
      WHERE b.cust_ID = ?
      ORDER BY b.booking_date DESC
    `;

    db.query(sql, [customerId], (err, results) => {
      if (err) {
        console.error('❌ Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

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
// 3. CANCEL BOOKING
// ========================================
export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  console.log('📥 CANCEL Booking ID:', id);

  try {
    const sql = `
      UPDATE booking 
      SET booking_status = 'cancelled', 
          updated_at = NOW() 
      WHERE booking_ID = ?
    `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบการจอง'
        });
      }

      // อัพเดท service status ด้วย
      const updateServiceSql = `
        UPDATE service 
        SET service_status = 'cancelled' 
        WHERE booking_ID = ?
      `;

      db.query(updateServiceSql, [id], (err) => {
        if (err) {
          console.error('⚠️ Warning: Cannot update service status:', err);
        }
      });

      console.log('✅ Booking cancelled:', id);

      res.json({
        success: true,
        message: 'ยกเลิกการจองสำเร็จ'
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
// 4. GET ALL ACTIVE BOOKINGS (สำหรับเช็คเวลา)
// ========================================
export const getAllActiveBookings = async (req, res) => {
  try {
    console.log('📥 GET /api/booking/all-bookings');

    const sql = `
      SELECT 
        b.booking_ID,
        DATE(b.booking_date) as booking_date,
        TIME(b.booking_date) as booking_time,
        COALESCE(b.duration, 30) as duration,
        b.booking_status
      FROM booking b
      WHERE b.booking_status IN ('pending', 'confirmed', 'in_progress')
      ORDER BY b.booking_date ASC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        });
      }

      console.log('✅ Found', results.length, 'active bookings');

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
