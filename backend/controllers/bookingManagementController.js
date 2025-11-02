// backend/controllers/bookingManagementController.js
import db from '../config/database.js';

export const getAllBookings = (req, res) => {
  try {
    const requestStatus = req.query.status || null;
    const requestDate = req.query.date || null;
    const requestLimit = req.query.limit ? Number(req.query.limit) : 50;

    console.log('📋 GET ALL BOOKINGS');
    console.log('Filters:', { requestStatus, requestDate, requestLimit });

    let sqlQuery = `
      SELECT 
        b.booking_ID,
        b.booking_date,
        b.booking_time,
        b.duration,
        b.booking_status,
        b.subtotal,
        b.membership_discount,
        b.points_used,
        b.final_amount,
        b.points_earned,
        b.created_at,
        c.cust_ID,
        c.cust_fname,
        c.cust_lname,
        c.cust_tel,
        p.payment_amount,
        p.payment_method,
        p.payment_status,
        br.branch_name,
        r.receipt_number,
        r.receipt_description
      FROM booking b
      LEFT JOIN customer c ON b.cust_ID = c.cust_ID
      LEFT JOIN payment p ON b.booking_ID = p.booking_ID
      LEFT JOIN branch br ON b.branch_ID = br.branch_ID
      LEFT JOIN receipt r ON p.payment_ID = r.payment_ID
      WHERE 1=1
    `;

    const queryParams = [];

    if (requestStatus) {
      sqlQuery += ' AND b.booking_status = ?';
      queryParams.push(requestStatus);
    }

    if (requestDate) {
      sqlQuery += ' AND DATE(b.booking_date) = ?';
      queryParams.push(requestDate);
    }

    sqlQuery += ' ORDER BY b.booking_date DESC, b.created_at DESC LIMIT ?';
    queryParams.push(requestLimit);

    console.log('SQL Preview:', sqlQuery.substring(0, 100));
    console.log('Parameters:', queryParams);

    db.query(sqlQuery, queryParams, (error, results) => {
      if (error) {
        console.error('Database Error:', error);
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: error.message
        });
      }

      console.log('Found bookings:', results.length);

      return res.json({
        success: true,
        bookings: results,
        total: results.length
      });
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  const promisePool = db.promise();
  let connection;

  try {
    const bookingId = req.params.id;
    const newStatus = req.body.status;
    const employeeId = req.body.employee_id;

    console.log('Update Status:', { bookingId, newStatus, employeeId });

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    const [updateResult] = await connection.query(
      'UPDATE booking SET booking_status = ?, updated_at = NOW() WHERE booking_ID = ?',
      [newStatus, bookingId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (newStatus === 'completed') {
      const [bookings] = await connection.query(
        'SELECT cust_ID, final_amount, points_earned FROM booking WHERE booking_ID = ?',
        [bookingId]
      );

      if (bookings.length > 0 && bookings[0].points_earned > 0) {
        const customerData = bookings[0];

        await connection.query(
          `UPDATE customer 
           SET total_points = total_points + ?,
               available_points = available_points + ?,
               total_spent = total_spent + ?
           WHERE cust_ID = ?`,
          [customerData.points_earned, customerData.points_earned, customerData.final_amount, customerData.cust_ID]
        );

        await connection.query(
          `INSERT INTO point_transaction 
           (cust_ID, booking_ID, transaction_type, points, description, related_amount)
           VALUES (?, ?, 'earn', ?, ?, ?)`,
          [customerData.cust_ID, bookingId, customerData.points_earned, `Earned from booking #${bookingId}`, customerData.final_amount]
        );

        console.log(`Awarded ${customerData.points_earned} points`);
      }
    }

    await connection.query(
      'UPDATE service SET service_status = ? WHERE booking_ID = ?',
      [newStatus, bookingId]
    );

    if (newStatus === 'completed') {
      await connection.query(
        'UPDATE service SET service_finishdate = NOW() WHERE booking_ID = ?',
        [bookingId]
      );
      
      await connection.query(
        'UPDATE payment SET payment_status = ? WHERE booking_ID = ?',
        ['completed', bookingId]
      );
    }

    await connection.commit();
    console.log('Status updated successfully');

    return res.json({
      success: true,
      message: 'Status updated',
      booking_id: bookingId,
      new_status: newStatus
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Update Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Update failed',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

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

    db.query(statsSql, (error, results) => {
      if (error) {
        console.error('Stats Error:', error);
        return res.status(500).json({
          success: false,
          message: 'Stats error'
        });
      }

      const statsData = results[0];
      return res.json({
        success: true,
        stats: {
          total: Number(statsData.total) || 0,
          pending: Number(statsData.pending) || 0,
          confirmed: Number(statsData.confirmed) || 0,
          in_progress: Number(statsData.in_progress) || 0,
          completed: Number(statsData.completed) || 0,
          cancelled: Number(statsData.cancelled) || 0,
          today: Number(statsData.today) || 0
        }
      });
    });

  } catch (error) {
    console.error('Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getRevenue = (req, res) => {
  try {
    const periodType = req.query.period || 'today';

    let dateCondition = 'DATE(b.booking_date) = CURDATE()';
    
    if (periodType === 'week') {
      dateCondition = 'YEARWEEK(b.booking_date) = YEARWEEK(NOW())';
    } else if (periodType === 'month') {
      dateCondition = 'YEAR(b.booking_date) = YEAR(NOW()) AND MONTH(b.booking_date) = MONTH(NOW())';
    } else if (periodType === 'year') {
      dateCondition = 'YEAR(b.booking_date) = YEAR(NOW())';
    }

    const revenueSql = `
      SELECT 
        COUNT(b.booking_ID) as total_bookings,
        COALESCE(SUM(p.payment_amount), 0) as total_revenue,
        COALESCE(AVG(p.payment_amount), 0) as avg_revenue,
        COALESCE(SUM(CASE WHEN b.booking_status = 'completed' THEN p.payment_amount ELSE 0 END), 0) as completed_revenue,
        COALESCE(SUM(CASE WHEN p.payment_method = 'cash' THEN p.payment_amount ELSE 0 END), 0) as cash,
        COALESCE(SUM(CASE WHEN p.payment_method = 'card' THEN p.payment_amount ELSE 0 END), 0) as card,
        COALESCE(SUM(CASE WHEN p.payment_method = 'qr' THEN p.payment_amount ELSE 0 END), 0) as qr
      FROM booking b
      LEFT JOIN payment p ON b.booking_ID = p.booking_ID
      WHERE ${dateCondition}
    `;

    db.query(revenueSql, (error, results) => {
      if (error) {
        console.error('Revenue Error:', error);
        return res.status(500).json({
          success: false,
          message: 'Revenue error'
        });
      }

      const revenueData = results[0];
      return res.json({
        success: true,
        period: periodType,
        revenue: {
          total_bookings: Number(revenueData.total_bookings) || 0,
          total_revenue: Number(revenueData.total_revenue) || 0,
          avg_revenue: Number(revenueData.avg_revenue) || 0,
          completed_revenue: Number(revenueData.completed_revenue) || 0
        },
        breakdown: {
          cash: Number(revenueData.cash) || 0,
          card: Number(revenueData.card) || 0,
          qr: Number(revenueData.qr) || 0
        }
      });
    });

  } catch (error) {
    console.error('Revenue Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export default {
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
  getRevenue
};
