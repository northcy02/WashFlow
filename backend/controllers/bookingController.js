// backend/controllers/bookingController.js
import db from '../config/database.js';

// ✅ ฟังก์ชันสร้าง Invoice Number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV${year}${month}${random}`;
};

// ✅ สร้างการจอง (ใช้ Promise Pool)
export const createBooking = async (req, res) => {
  console.log('');
  console.log('📥 ========== CREATE BOOKING REQUEST ==========');
  console.log('Request body:', req.body);

  const {
    customer_id,
    branch_id,
    booking_date,
    booking_time,
    vehicle_type,
    vehicle_plate = null,
    vehicle_color = null,
    services,
    payment_method,
    total_amount
  } = req.body;

  // ✅ Validation
  if (!customer_id || !branch_id || !booking_date || !booking_time || 
      !vehicle_type || !services || services.length === 0 || !payment_method) {
    console.log('❌ Validation Failed');
    return res.status(400).json({
      success: false,
      message: 'ข้อมูลไม่ครบถ้วน'
    });
  }

  // ✅ ใช้ Promise Pool
  const promisePool = db.promise();
  let connection;
  
  try {
    connection = await promisePool.getConnection();
    await connection.beginTransaction();
    console.log('🔄 Transaction Started');

    // 1️⃣ หา/สร้าง vehicle_type
    console.log('1️⃣ Checking vehicle_type:', vehicle_type);
    const [vtypes] = await connection.query(
      'SELECT vtype_ID FROM vehicle_type WHERE vtype_name = ?',
      [vehicle_type]
    );

    let vtypeId;
    if (vtypes.length === 0) {
      const [vtypeResult] = await connection.query(
        'INSERT INTO vehicle_type (vtype_name) VALUES (?)',
        [vehicle_type]
      );
      vtypeId = vtypeResult.insertId;
      console.log('   ✅ Created vehicle_type ID:', vtypeId);
    } else {
      vtypeId = vtypes[0].vtype_ID;
      console.log('   ✅ Found vehicle_type ID:', vtypeId);
    }

    // 2️⃣ สร้าง/หา Vehicle
    console.log('2️⃣ Checking vehicle...');
    let vehicleId;
    
    if (vehicle_plate) {
      const [existingVehicles] = await connection.query(
        'SELECT vehicle_ID FROM vehicle WHERE vehicle_plate = ? AND customer_cust_ID = ?',
        [vehicle_plate, customer_id]
      );

      if (existingVehicles.length > 0) {
        vehicleId = existingVehicles[0].vehicle_ID;
        console.log('   ✅ Found existing vehicle ID:', vehicleId);
      } else {
        const [vehicleResult] = await connection.query(
          'INSERT INTO vehicle (vehicle_plate, vehicle_color, customer_cust_ID, vehicle_type_vtype_ID) VALUES (?, ?, ?, ?)',
          [vehicle_plate, vehicle_color, customer_id, vtypeId]
        );
        vehicleId = vehicleResult.insertId;
        console.log('   ✅ Created new vehicle ID:', vehicleId);
      }
    } else {
      const tempPlate = `TEMP-${customer_id}-${Date.now()}`;
      const [vehicleResult] = await connection.query(
        'INSERT INTO vehicle (vehicle_plate, vehicle_color, customer_cust_ID, vehicle_type_vtype_ID) VALUES (?, ?, ?, ?)',
        [tempPlate, vehicle_color || 'N/A', customer_id, vtypeId]
      );
      vehicleId = vehicleResult.insertId;
      console.log('   ✅ Created temp vehicle ID:', vehicleId);
    }

    // 3️⃣ สร้าง Booking
    console.log('3️⃣ Creating booking...');
    const bookingDateTime = `${booking_date} ${booking_time}:00`;
    const [bookingResult] = await connection.query(
      'INSERT INTO booking (booking_date, booking_status, customer_cust_ID, branch_ID) VALUES (?, ?, ?, ?)',
      [bookingDateTime, 'pending', customer_id, branch_id]
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

    // 5️⃣ สร้าง Invoice
    console.log('5️⃣ Creating invoice...');
    const invoiceNumber = generateInvoiceNumber();
    const invoiceDesc = `จองบริการล้างรถ - ${vehicle_type} | บริการ: ${services.join(', ')}`;
    
    await connection.query(
      'INSERT INTO invoice (invoice_number, invoice_description, payment_ID) VALUES (?, ?, ?)',
      [invoiceNumber, invoiceDesc, paymentId]
    );
    console.log('   ✅ Created invoice:', invoiceNumber);

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
    console.log('   Services requested:', services);
    
    const [serviceTypes] = await connection.query(
      'SELECT Type_serviceID, Type_serviceName, Type_serviceBasePrice FROM Service_type WHERE Type_serviceName IN (?)',
      [services]
    );

    console.log('   Found service types:', serviceTypes.length);
    
    if (serviceTypes.length === 0) {
      throw new Error(`ไม่พบบริการที่ต้องการ: ${services.join(', ')}`);
    }

    // หา employee (Cleaner = role_ID 2)
    const [employees] = await connection.query(
      'SELECT emp_ID FROM employee WHERE role_ID = 2 LIMIT 1'
    );
    const employeeId = employees.length > 0 ? employees[0].emp_ID : 1;
    console.log('   Using employee ID:', employeeId);

    for (const serviceType of serviceTypes) {
      await connection.query(
        'INSERT INTO service_detail (sdetail_quantity, sdetail_price, service_ID, service_type_ID, employee_ID) VALUES (?, ?, ?, ?, ?)',
        [1, serviceType.Type_serviceBasePrice, serviceId, serviceType.Type_serviceID, employeeId]
      );
      console.log(`   ✅ Added: ${serviceType.Type_serviceName}`);
    }

    await connection.commit();
    console.log('✅ Transaction Committed!');
    console.log('======================================');

    res.json({
      success: true,
      message: 'จองบริการสำเร็จ!',
      booking: {
        id: bookingId,
        invoice_number: invoiceNumber,
        booking_date: bookingDateTime,
        total_amount
      }
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
      console.log('🔄 Transaction Rolled Back');
    }
    
    console.error('❌ Booking Error:', error);
    console.log('======================================');
    
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

// ✅ ดูประวัติการจอง
export const getBookingHistory = async (req, res) => {
  try {
    const { customerId } = req.params;

    const sql = `
      SELECT 
        b.booking_ID,
        b.booking_date,
        b.booking_status,
        p.payment_amount,
        p.payment_method,
        i.invoice_number,
        i.invoice_description
      FROM booking b
      LEFT JOIN payment p ON b.booking_ID = p.booking_ID
      LEFT JOIN invoice i ON p.payment_ID = i.payment_ID
      WHERE b.customer_cust_ID = ?
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

// ✅ ยกเลิกการจอง
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'UPDATE booking SET booking_status = ? WHERE booking_ID = ?';
    
    db.query(sql, ['cancelled', id], (err, result) => {
      if (err) {
        console.error('❌ Error:', err);
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

      db.query(
        'UPDATE service SET service_status = ? WHERE booking_ID = ?',
        ['cancelled', id]
      );

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