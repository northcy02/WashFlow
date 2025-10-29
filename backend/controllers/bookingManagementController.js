// backend/controllers/bookingManagementController.js
import db from '../config/database.js';

// ✅ 1. ดูการจองทั้งหมด (สำหรับ Employee)
export const getAllBookings = (req, res) => {
  try {
    const { status, date, limit = 50 } = req.query;

    let sql = `
      SELECT 
        b.booking_ID,
        b.booking_date,
        b.booking_status,
        b.created_at,
        c.cust_ID,
        c.cust_fname,
        c.cust_lname,
        c.cust_tel,
        p.payment_amount,
        p.payment_method,
        i.invoice_number,
        i.invoice_description,
        br.branch_name
      FROM booking b
      LEFT JOIN customer c ON b.customer_cust_ID = c.cust_ID
      LEFT JOIN payment p ON b.booking_ID = p.booking_ID
      LEFT JOIN invoice i ON p.payment_ID = i.payment_ID
      LEFT JOIN branch br ON b.branch_ID = br.branch_ID
      WHERE 1=1
    `;

    const params = [];

    // Filter by status
    if (status) {
      sql += ' AND b.booking_status = ?';
      params.push(status);
    }

    // Filter by date
    if (date) {
      sql += ' AND DATE(b.booking_date) = ?';
      params.push(date);
    }

    sql += ' ORDER BY b.booking_date DESC, b.created_at DESC';
    sql += ' LIMIT ?';
    params.push(parseInt(limit));

    console.log('📋 Fetching bookings with filters:', { status, date, limit });

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      console.log('✅ Found bookings:', results.length);

      res.json({
        success: true,
        bookings: results,
        total: results.length
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

// ✅ 2. อัพเดทสถานะการจอง
export const updateBookingStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, employee_id } = req.body;

    console.log('📝 Updating booking status:', { id, status, employee_id });

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'สถานะไม่ถูกต้อง'
      });
    }

    // อัพเดท booking status
    const updateBookingSql = 'UPDATE booking SET booking_status = ?, updated_at = NOW() WHERE booking_ID = ?';
    
    db.query(updateBookingSql, [status, id], (err, result) => {
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
      const updateServiceSql = 'UPDATE service SET service_status = ? WHERE booking_ID = ?';
      db.query(updateServiceSql, [status, id]);

      // ถ้าเป็น completed ให้อัพเดท service_finishdate
      if (status === 'completed') {
        const finishDateSql = 'UPDATE service SET service_finishdate = NOW() WHERE booking_ID = ?';
        db.query(finishDateSql, [id]);
      }

      console.log('✅ Booking status updated to:', status);

      res.json({
        success: true,
        message: 'อัพเดทสถานะสำเร็จ',
        booking_id: id,
        new_status: status
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

// ✅ 3. สถิติการจอง
export const getBookingStats = (req, res) => {
  try {
    const statsSql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN booking_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN booking_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN booking_status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN booking_status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN DATE(booking_date) = CURDATE() THEN 1 ELSE 0 END) as today
      FROM booking
    `;

    db.query(statsSql, (err, results) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      const stats = results[0];

      console.log('📊 Booking Stats:', stats);

      res.json({
        success: true,
        stats: {
          total: parseInt(stats.total) || 0,
          pending: parseInt(stats.pending) || 0,
          confirmed: parseInt(stats.confirmed) || 0,
          in_progress: parseInt(stats.in_progress) || 0,
          completed: parseInt(stats.completed) || 0,
          cancelled: parseInt(stats.cancelled) || 0,
          today: parseInt(stats.today) || 0
        }
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

// ✅ 4. รายได้
export const getRevenue = (req, res) => {
  try {
    const { period = 'today' } = req.query; // today, week, month, year

    let dateCondition = '';
    
    switch (period) {
      case 'today':
        dateCondition = 'DATE(b.booking_date) = CURDATE()';
        break;
      case 'week':
        dateCondition = 'YEARWEEK(b.booking_date) = YEARWEEK(NOW())';
        break;
      case 'month':
        dateCondition = 'YEAR(b.booking_date) = YEAR(NOW()) AND MONTH(b.booking_date) = MONTH(NOW())';
        break;
      case 'year':
        dateCondition = 'YEAR(b.booking_date) = YEAR(NOW())';
        break;
      default:
        dateCondition = '1=1'; // all time
    }

    const revenueSql = `
      SELECT 
        COUNT(b.booking_ID) as total_bookings,
        SUM(p.payment_amount) as total_revenue,
        AVG(p.payment_amount) as avg_revenue,
        SUM(CASE WHEN b.booking_status = 'completed' THEN p.payment_amount ELSE 0 END) as completed_revenue,
        SUM(CASE WHEN b.booking_status = 'pending' THEN p.payment_amount ELSE 0 END) as pending_revenue
      FROM booking b
      LEFT JOIN payment p ON b.booking_ID = p.booking_ID
      WHERE ${dateCondition}
    `;

    db.query(revenueSql, (err, results) => {
      if (err) {
        console.error('❌ Database Error:', err);
        return res.status(500).json({
          success: false,
          message: 'เกิดข้อผิดพลาด'
        });
      }

      const revenue = results[0];

      console.log('💰 Revenue Stats:', revenue);

      res.json({
        success: true,
        period: period,
        revenue: {
          total_bookings: parseInt(revenue.total_bookings) || 0,
          total_revenue: parseFloat(revenue.total_revenue) || 0,
          avg_revenue: parseFloat(revenue.avg_revenue) || 0,
          completed_revenue: parseFloat(revenue.completed_revenue) || 0,
          pending_revenue: parseFloat(revenue.pending_revenue) || 0
        }
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
