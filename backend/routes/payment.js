// backend/routes/payment.js
import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// ========================================
// GET All Payments (with customer info)
// ========================================
router.get('/all', (req, res) => {
  console.log('📥 GET /api/payment/all');

  const sql = `
    SELECT 
      p.payment_ID,
      p.payment_amount,
      p.payment_date,
      p.payment_method,
      p.booking_ID,
      i.invoice_ID,
      i.invoice_number,
      i.invoice_description,
      i.invoice_date,
      c.cust_ID,
      c.cust_fname,
      c.cust_lname,
      c.cust_tel,
      b.booking_status,
      b.booking_date
    FROM payment p
    LEFT JOIN invoice i ON p.payment_ID = i.payment_ID
    LEFT JOIN booking b ON p.booking_ID = b.booking_ID
    LEFT JOIN customer c ON b.customer_cust_ID = c.cust_ID
    WHERE p.payment_method IS NOT NULL
    ORDER BY p.payment_date DESC
    LIMIT 100
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error',
        error: err.message 
      });
    }
    
    console.log('✅ Loaded', results.length, 'payments');
    res.json({ 
      success: true, 
      payments: results 
    });
  });
});

// ========================================
// Process Payment (Update payment method)
// ========================================
router.post('/process', (req, res) => {
  const { 
    booking_id, 
    payment_method, 
    received_amount, 
    change_amount, 
    notes,
    employee_id
  } = req.body;

  console.log('💳 Process Payment:', {
    booking_id,
    payment_method,
    received_amount,
    employee_id
  });

  // Validate
  if (!booking_id || !payment_method) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุ booking_id และ payment_method'
    });
  }

  // Update payment method
  const updatePaymentSql = `
    UPDATE payment 
    SET payment_method = ?, payment_date = NOW() 
    WHERE booking_ID = ?
  `;

  db.query(updatePaymentSql, [payment_method, booking_id], (err, result) => {
    if (err) {
      console.error('❌ Payment Update Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Cannot process payment',
        error: err.message 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรายการชำระเงิน'
      });
    }

    // Update booking status to completed
    db.query(
      'UPDATE booking SET booking_status = ? WHERE booking_ID = ?',
      ['completed', booking_id],
      (err) => {
        if (err) {
          console.error('❌ Booking Update Error:', err);
        }
      }
    );

    // Update service status to completed
    db.query(
      'UPDATE service SET service_status = ?, service_finishdate = NOW() WHERE booking_ID = ?',
      ['completed', booking_id],
      (err) => {
        if (err) {
          console.error('❌ Service Update Error:', err);
        }
      }
    );

    // Get invoice number
    const getInvoiceSql = `
      SELECT i.invoice_number 
      FROM invoice i 
      LEFT JOIN payment p ON i.payment_ID = p.payment_ID 
      WHERE p.booking_ID = ?
    `;

    db.query(getInvoiceSql, [booking_id], (err, invoiceResult) => {
      if (err) {
        console.error('❌ Invoice Query Error:', err);
        return res.json({ 
          success: true, 
          invoice_number: 'N/A',
          message: 'ชำระเงินสำเร็จ'
        });
      }

      const invoiceNumber = invoiceResult[0]?.invoice_number || 'N/A';
      console.log('✅ Payment processed. Invoice:', invoiceNumber);

      res.json({ 
        success: true, 
        invoice_number: invoiceNumber,
        message: 'ชำระเงินสำเร็จ'
      });
    });
  });
});

// ========================================
// Refund Payment
// ========================================
router.post('/refund', (req, res) => {
  const { payment_id, employee_id } = req.body;

  console.log('💸 Refund Payment ID:', payment_id);

  if (!payment_id) {
    return res.status(400).json({
      success: false,
      message: 'กรุณาระบุ payment_id'
    });
  }

  // Get payment details first
  db.query(
    'SELECT booking_ID, payment_amount FROM payment WHERE payment_ID = ?',
    [payment_id],
    (err, paymentResult) => {
      if (err) {
        console.error('❌ Query Error:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error' 
        });
      }

      if (paymentResult.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'ไม่พบรายการชำระเงิน' 
        });
      }

      const bookingId = paymentResult[0].booking_ID;
      const amount = paymentResult[0].payment_amount;

      // Update payment to refunded
      db.query(
        'UPDATE payment SET payment_method = ? WHERE payment_ID = ?',
        ['refunded', payment_id],
        (err) => {
          if (err) {
            console.error('❌ Refund Error:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Cannot refund payment' 
            });
          }

          // Update booking status to cancelled
          db.query(
            'UPDATE booking SET booking_status = ? WHERE booking_ID = ?',
            ['cancelled', bookingId]
          );

          // Update service status to cancelled
          db.query(
            'UPDATE service SET service_status = ? WHERE booking_ID = ?',
            ['cancelled', bookingId]
          );

          console.log('✅ Refunded Payment ID:', payment_id, 'Amount:', amount);
          res.json({ 
            success: true,
            message: 'คืนเงินสำเร็จ',
            amount: amount
          });
        }
      );
    }
  );
});

// ========================================
// GET Payment by ID
// ========================================
router.get('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.*,
      i.invoice_number,
      i.invoice_description,
      c.cust_fname,
      c.cust_lname,
      c.cust_tel,
      b.booking_date
    FROM payment p
    LEFT JOIN invoice i ON p.payment_ID = i.payment_ID
    LEFT JOIN booking b ON p.booking_ID = b.booking_ID
    LEFT JOIN customer c ON b.customer_cust_ID = c.cust_ID
    WHERE p.payment_ID = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Database Error:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error' 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบรายการชำระเงิน'
      });
    }

    res.json({ 
      success: true, 
      payment: results[0] 
    });
  });
});

export default router;
