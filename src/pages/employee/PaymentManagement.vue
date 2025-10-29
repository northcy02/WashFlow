<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const router = useRouter();

// ========================================
// STATE
// ========================================
const currentEmployee = ref<any>(null);
const todayRevenue = ref(0);
const todayTransactions = ref(0);
const paymentBreakdown = ref({
  cash: 0,
  card: 0,
  qr: 0
});
const pendingPayments = ref<any[]>([]);
const payments = ref<any[]>([]);
const filteredPayments = ref<any[]>([]);
const filterMethod = ref('');
const searchInvoice = ref('');
const showPaymentModal = ref(false);
const showInvoiceModal = ref(false);
const selectedBooking = ref<any>(null);
const selectedInvoice = ref<any>(null);
const isProcessing = ref(false);

const paymentForm = ref({
  method: '',
  receivedAmount: 0,
  notes: ''
});

// ========================================
// COMPUTED
// ========================================
const isManager = computed(() => currentEmployee.value?.role === 'Manager');

const currentDate = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
});

const totalRevenue = computed(() => {
  return paymentBreakdown.value.cash + 
         paymentBreakdown.value.card + 
         paymentBreakdown.value.qr;
});

const getCashPercent = computed(() => {
  if (totalRevenue.value === 0) return 0;
  return (paymentBreakdown.value.cash / totalRevenue.value) * 100;
});

const getCardPercent = computed(() => {
  if (totalRevenue.value === 0) return 0;
  return (paymentBreakdown.value.card / totalRevenue.value) * 100;
});

const getQRPercent = computed(() => {
  if (totalRevenue.value === 0) return 0;
  return (paymentBreakdown.value.qr / totalRevenue.value) * 100;
});

const changeAmount = computed(() => {
  if (!selectedBooking.value || !paymentForm.value.receivedAmount) return 0;
  return paymentForm.value.receivedAmount - (selectedBooking.value.payment_amount || 0);
});

const canConfirmPayment = computed(() => {
  if (!paymentForm.value.method) return false;
  if (paymentForm.value.method === 'cash') {
    return changeAmount.value >= 0;
  }
  return true;
});

// ========================================
// METHODS
// ========================================
const goBack = () => {
  router.push('/employee/dashboard');
};

const loadEmployeeData = () => {
  const empStr = localStorage.getItem('employee');
  if (empStr) {
    currentEmployee.value = JSON.parse(empStr);
  }
};

const loadRevenue = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/management/booking/revenue');
    if (response.data.success) {
      todayRevenue.value = response.data.revenue.today || 0;
      todayTransactions.value = response.data.revenue.transactions || 0;
      paymentBreakdown.value = response.data.revenue.breakdown || {
        cash: 0,
        card: 0,
        qr: 0
      };
    }
  } catch (error) {
    console.error('❌ Error loading revenue:', error);
  }
};

const loadPendingPayments = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/management/booking/all', {
      params: { status: 'confirmed' }
    });
    if (response.data.success) {
      pendingPayments.value = response.data.bookings;
    }
  } catch (error) {
    console.error('❌ Error loading pending payments:', error);
  }
};

const loadPayments = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/payment/all');
    if (response.data.success) {
      payments.value = response.data.payments;
      filteredPayments.value = payments.value;
    }
  } catch (error) {
    console.error('❌ Error loading payments:', error);
  }
};

const filterPayments = () => {
  let result = payments.value;

  if (filterMethod.value) {
    result = result.filter(p => p.payment_method === filterMethod.value);
  }

  if (searchInvoice.value) {
    const query = searchInvoice.value.toLowerCase();
    result = result.filter(p => 
      p.invoice_number?.toLowerCase().includes(query)
    );
  }

  filteredPayments.value = result;
};

const processPayment = (booking: any) => {
  selectedBooking.value = booking;
  paymentForm.value = {
    method: '',
    receivedAmount: 0,
    notes: ''
  };
  showPaymentModal.value = true;
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
  selectedBooking.value = null;
  paymentForm.value = {
    method: '',
    receivedAmount: 0,
    notes: ''
  };
};

const calculateChange = () => {
  // Auto-calculate in computed property
};

const confirmPayment = async () => {
  isProcessing.value = true;

  try {
    const response = await axios.post('http://localhost:3000/api/payment/process', {
      booking_id: selectedBooking.value.booking_ID,
      payment_method: paymentForm.value.method,
      received_amount: paymentForm.value.receivedAmount,
      change_amount: changeAmount.value,
      notes: paymentForm.value.notes,
      employee_id: currentEmployee.value.id
    });

    if (response.data.success) {
      await Swal.fire({
        title: 'ชำระเงินสำเร็จ! ✓',
        html: `
          <div style="text-align: center; padding: 1rem;">
            <p style="font-size: 1.1rem; margin-bottom: 1rem;">เลขที่ใบเสร็จ</p>
            <p style="font-size: 2rem; font-weight: 900; color: #10b981; margin-bottom: 1rem;">
              ${response.data.invoice_number}
            </p>
            <p style="font-size: 1.5rem; color: #fff;">
              ยอดชำระ: ฿${selectedBooking.value.payment_amount?.toLocaleString()}
            </p>
            ${paymentForm.value.method === 'cash' ? `
              <p style="color: rgba(255,255,255,0.7); margin-top: 0.5rem;">
                เงินทอน: ฿${changeAmount.value.toLocaleString()}
              </p>
            ` : ''}
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#10b981',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      });

      closePaymentModal();
      loadPendingPayments();
      loadPayments();
      loadRevenue();
    }

  } catch (error: any) {
    console.error('❌ Payment Error:', error);
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.response?.data?.message || 'ไม่สามารถดำเนินการได้',
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    isProcessing.value = false;
  }
};

const viewInvoice = (payment: any) => {
  selectedInvoice.value = payment;
  showInvoiceModal.value = true;
};

const closeInvoiceModal = () => {
  showInvoiceModal.value = false;
  selectedInvoice.value = null;
};

// ✅ แก้ไขแล้ว: ใช้ Template Literal
const printInvoice = (payment: any) => {
  if (!payment) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>ใบเสร็จ ${payment.invoice_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Sarabun', sans-serif; padding: 2rem; }
        .invoice { max-width: 600px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #000; padding-bottom: 1rem; }
        .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
        .details { margin: 2rem 0; }
        .row { display: flex; justify-content: space-between; padding: 0.5rem 0; }
        .total { font-size: 1.5rem; font-weight: bold; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #000; }
        .footer { text-align: center; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ccc; }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <h1>CYBERCAR</h1>
          <p>ศูนย์มาตราฐานทำความสะอาดรถยนต์</p>
          <h3>ใบเสร็จรับเงิน</h3>
          <p>${payment.invoice_number}</p>
        </div>
        <div class="details">
          <div class="row">
            <span>วันที่:</span>
            <span>${formatDateTime(payment.payment_date)}</span>
          </div>
          <div class="row">
            <span>ลูกค้า:</span>
            <span>${payment.cust_fname} ${payment.cust_lname}</span>
          </div>
          <div class="row">
            <span>เบอร์โทร:</span>
            <span>${payment.cust_tel}</span>
          </div>
          <div class="row">
            <span>รายการ:</span>
            <span>${payment.invoice_description}</span>
          </div>
          <div class="row">
            <span>ชำระด้วย:</span>
            <span>${getPaymentMethodText(payment.payment_method)}</span>
          </div>
          <div class="total">
            <div class="row">
              <span>ยอดรวมทั้งสิ้น:</span>
              <span>฿${payment.payment_amount?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>ขอบคุณที่ใช้บริการ</p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">*** กรุณาเก็บใบเสร็จไว้เป็นหลักฐาน ***</p>
        </div>
      </div>
      <script>
        window.onload = () => {
          window.print();
          window.onafterprint = () => window.close();
        };
      <\/script>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
};

const refundPayment = async (payment: any) => {
  const result = await Swal.fire({
    title: 'ยืนยันคืนเงิน?',
    html: `
      <p>ต้องการคืนเงินให้ลูกค้า</p>
      <p style="color: #dc2626; font-weight: 700; margin: 1rem 0;">
        ฿${payment.payment_amount?.toLocaleString()}
      </p>
      <p style="font-size: 0.9rem; color: #666;">
        ใบเสร็จ: ${payment.invoice_number}
      </p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยันคืนเงิน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.post('http://localhost:3000/api/payment/refund', {
        payment_id: payment.payment_ID,
        employee_id: currentEmployee.value.id
      });

      if (response.data.success) {
        await Swal.fire({
          title: 'คืนเงินสำเร็จ!',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000
        });

        loadPayments();
        loadRevenue();
      }

    } catch (error: any) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถคืนเงินได้',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  }
};

const extractServices = (description: string) => {
  if (!description) return '-';
  const match = description.match(/บริการ: (.+)/);
  return match ? match[1] : description;
};

const getPaymentMethodText = (method: string) => {
  const map: Record<string, string> = {
    cash: '💵 เงินสด',
    card: '💳 บัตร',
    qr: '📱 QR Code'
  };
  return map[method] || method;
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadEmployeeData();
  loadRevenue();
  loadPendingPayments();
  loadPayments();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.payment-management-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* ========================================
   HEADER
======================================== */
.page-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
  padding: 2rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.page-header .container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-back {
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.header-title h1 {
  font-size: 2rem;
  font-weight: 900;
  color: #fbbf24;
  margin-bottom: 0.3rem;
}

.header-title p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
}

.header-date {
  padding: 0.8rem 1.5rem;
  background: rgba(251, 191, 36, 0.1);
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 10px;
  color: #fbbf24;
  font-weight: 600;
}

/* ========================================
   REVENUE SECTION
======================================== */
.revenue-section {
  padding: 2rem;
  background: linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 100%);
}

.revenue-section .container {
  max-width: 1600px;
  margin: 0 auto;
}

.revenue-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 1.5rem;
}

.revenue-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.revenue-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.05));
  opacity: 0;
  transition: opacity 0.3s;
}

.revenue-card:hover::before {
  opacity: 1;
}

.revenue-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.revenue-card.today {
  border-color: rgba(251, 191, 36, 0.5);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15));
}

.revenue-card.cash {
  border-color: rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
}

.revenue-card.card-payment {
  border-color: rgba(59, 130, 246, 0.5);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
}

.revenue-card.qr {
  border-color: rgba(168, 85, 247, 0.5);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(124, 58, 237, 0.1));
}

.card-icon {
  font-size: 3.5rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-content h3 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card-content .amount {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.revenue-card.today .amount {
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

.revenue-card.cash .amount {
  color: #10b981;
}

.revenue-card.card-payment .amount {
  color: #3b82f6;
}

.revenue-card.qr .amount {
  color: #a855f7;
}

.transactions {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.revenue-card.card-payment .progress-fill {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}

.revenue-card.qr .progress-fill {
  background: linear-gradient(90deg, #a855f7, #7c3aed);
}

/* ========================================
   PENDING SECTION
======================================== */
.pending-section {
  padding: 2rem;
  background: #0a0a0a;
}

.pending-section .container {
  max-width: 1600px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.badge {
  padding: 0.3rem 0.8rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
}

.pending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.pending-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}

.pending-card:hover {
  border-color: #fbbf24;
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
}

.pending-header {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.booking-id {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fbbf24;
}

.booking-time {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.pending-body {
  padding: 1.5rem;
}

.customer-info {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.customer-info strong {
  display: block;
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 0.3rem;
}

.customer-info small {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.service-info {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.service-info p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.amount-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-info .label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.amount-info .amount {
  font-size: 1.8rem;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

.pending-actions {
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-process {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-process:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
}

.empty-pending {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.empty-pending .icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-pending p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ========================================
   HISTORY SECTION
======================================== */
.history-section {
  padding: 2rem;
  background: #1a1a1a;
}

.history-section .container {
  max-width: 1600px;
  margin: 0 auto;
}

.history-section .section-header {
  flex-wrap: wrap;
}

.filters {
  display: flex;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
}

.filters select,
.filters input {
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s;
}

.filters select {
  min-width: 150px;
  cursor: pointer;
}

.filters input {
  min-width: 250px;
}

.filters select:focus,
.filters input:focus {
  outline: none;
  border-color: #fbbf24;
  background: rgba(255, 255, 255, 0.08);
}

.filters select option {
  background: #1a1a1a;
  color: #fff;
}

.history-table {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: rgba(251, 191, 36, 0.1);
  border-bottom: 2px solid rgba(251, 191, 36, 0.3);
}

thead th {
  padding: 1.2rem 1rem;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fbbf24;
  text-transform: uppercase;
  letter-spacing: 1px;
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

tbody td {
  padding: 1.2rem 1rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.invoice-number {
  font-weight: 700;
  color: #fbbf24;
  font-size: 1rem;
}

.customer-cell {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.customer-cell strong {
  font-weight: 600;
  color: #fff;
}

.customer-cell small {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.service-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.payment-method {
  padding: 0.4rem 0.9rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-block;
}

.payment-method.cash {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.payment-method.card {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.payment-method.qr {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.4);
}

.amount-cell {
  font-weight: 700;
  color: #10b981;
  font-size: 1.1rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-buttons button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-view {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.btn-view:hover {
  background: #3b82f6;
  color: #fff;
  transform: scale(1.1);
}

.btn-print {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.btn-print:hover {
  background: #10b981;
  color: #fff;
  transform: scale(1.1);
}

.btn-refund {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.btn-refund:hover {
  background: #ef4444;
  color: #fff;
  transform: scale(1.1);
}

.empty-table {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-table .icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-table p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ========================================
   MODAL
======================================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: #1a1a1a;
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 20px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.payment-modal {
  max-width: 700px;
}

.invoice-modal {
  max-width: 800px;
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: #1a1a1a;
  z-index: 10;
}

.modal-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fbbf24;
}

.btn-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.btn-close:hover {
  background: #ef4444;
  color: #fff;
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

/* Booking Summary */
.booking-summary {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.booking-summary h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fbbf24;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 2px solid rgba(251, 191, 36, 0.3);
  font-size: 1.2rem;
}

.summary-row .amount {
  color: #fbbf24;
  font-size: 2rem;
  font-weight: 900;
}

/* Payment Method Section */
.payment-method-section {
  margin-bottom: 2rem;
}

.payment-method-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.method-option {
  cursor: pointer;
}

.method-option input {
  display: none;
}

.method-content {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
}

.method-option:hover .method-content {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(251, 191, 36, 0.3);
}

.method-option.selected .method-content {
  background: rgba(251, 191, 36, 0.1);
  border-color: #fbbf24;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
}

.method-icon {
  font-size: 3rem;
}

.method-label {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* Cash Input */
.cash-input-section {
  margin-bottom: 2rem;
}

.cash-input-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.amount-input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.currency {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  font-weight: 700;
  color: #fbbf24;
}

.amount-input {
  width: 100%;
  padding: 1.2rem 1.5rem 1.2rem 3.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 700;
  font-family: inherit;
  transition: all 0.3s;
}

.amount-input:focus {
  outline: none;
  border-color: #fbbf24;
  background: rgba(255, 255, 255, 0.08);
}

.change-display {
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
}

.change-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.change-row.total {
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 2px solid rgba(16, 185, 129, 0.3);
  font-size: 1.3rem;
}

.change-row.total strong {
  color: #10b981;
  font-size: 1.8rem;
}

.change-row.total strong.negative {
  color: #ef4444;
}

.warning {
  font-size: 0.9rem;
  margin-left: 0.5rem;
  color: #ef4444;
}

/* Notes */
.notes-section {
  margin-bottom: 2rem;
}

.notes-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.notes-section textarea {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s;
}

.notes-section textarea:focus {
  outline: none;
  border-color: #fbbf24;
  background: rgba(255, 255, 255, 0.08);
}

/* Modal Actions */
.modal-actions {
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
  position: sticky;
  bottom: 0;
}

.modal-actions button {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-cancel {
  background: rgba(107, 114, 128, 0.2);
  border: 2px solid rgba(107, 114, 128, 0.4);
  color: #9ca3af;
}

.btn-cancel:hover {
  background: #6b7280;
  color: #fff;
}

.btn-confirm {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
}

.btn-confirm:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-print-full {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
}

.btn-print-full:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========================================
   INVOICE CONTENT
======================================== */
.invoice-content {
  padding: 2rem;
  background: #fff;
  color: #000;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #000;
}

.company-info h1 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.3rem;
}

.company-info p {
  font-size: 1rem;
  color: #666;
}

.invoice-number {
  text-align: right;
}

.invoice-number h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #000;
}

.invoice-number p {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
}

.invoice-divider {
  height: 2px;
  background: linear-gradient(90deg, #dc2626, transparent);
  margin: 1.5rem 0;
}

.invoice-details {
  margin: 2rem 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row span:first-child {
  color: #666;
  font-weight: 600;
}

.detail-row span:last-child {
  color: #000;
  font-weight: 700;
}

.invoice-items {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.invoice-items h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #000;
}

.invoice-items p {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
}

.invoice-total {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #fef3c7;
  border-radius: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.total-row.grand {
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 2px solid #dc2626;
  font-size: 1.5rem;
}

.total-row.grand strong {
  color: #dc2626;
  font-size: 2rem;
}

.invoice-footer {
  margin-top: 3rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 2px dashed #ccc;
}

.invoice-footer p {
  margin-bottom: 0.5rem;
  color: #000;
  font-weight: 600;
}

.invoice-footer .small {
  font-size: 0.85rem;
  color: #666;
  font-weight: 400;
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-20px);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1400px) {
  .revenue-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .revenue-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    width: 100%;
    flex-direction: column;
  }

  .filters select,
  .filters input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .pending-grid {
    grid-template-columns: 1fr;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }

  .history-table {
    overflow-x: auto;
  }

  table {
    min-width: 900px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .modal-content {
    max-height: 95vh;
  }
}

@media (max-width: 480px) {
  .revenue-grid {
    gap: 1rem;
  }

  .card-content .amount {
    font-size: 2rem;
  }

  .amount-info .amount {
    font-size: 1.5rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .invoice-header {
    flex-direction: column;
    gap: 1rem;
  }

  .invoice-number {
    text-align: left;
  }
}
</style>