<!-- src/pages/employee/EmployeeDashboard.vue -->
<template>
  <div class="dashboard-page">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="container">
        <div class="logo">
          <span>👨‍💼</span>
          <h1>EMPLOYEE DASHBOARD</h1>
        </div>
        <div class="user-info">
          <span>{{ employeeName }}</span>
          <span class="role" :class="`role-${employeeRole.toLowerCase()}`">{{ employeeRole }}</span>
          <button @click="handleLogout" class="btn-logout">ออกจากระบบ</button>
        </div>
      </div>
    </header>

    <!-- Quick Actions Menu -->
    <section class="quick-actions-section">
      <div class="container">
        <h2>เมนูหลัก</h2>
        <div class="actions-grid">
          <router-link to="/employee/dashboard" class="action-card active">
            <div class="card-icon">📊</div>
            <h3>Dashboard</h3>
            <p>ภาพรวมและสถิติ</p>
          </router-link>

          <router-link to="/employee/payment" class="action-card">
            <div class="card-icon">💰</div>
            <h3>การเงิน</h3>
            <p>รับชำระเงิน & ใบเสร็จ</p>
          </router-link>

          <router-link 
            v-if="isManager" 
            to="/employee/management" 
            class="action-card manager-only"
          >
            <div class="card-icon">👥</div>
            <h3>จัดการพนักงาน</h3>
            <p>เพิ่ม แก้ไข ลบ พนักงาน</p>
            <span class="badge">Manager</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Stats Cards -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>{{ stats.total || 0 }}</h3>
              <p>การจองทั้งหมด</p>
            </div>
          </div>

          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <h3>{{ stats.pending || 0 }}</h3>
              <p>รอดำเนินการ</p>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>{{ stats.completed || 0 }}</h3>
              <p>สำเร็จแล้ว</p>
            </div>
          </div>

          <div class="stat-card today">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <h3>{{ stats.today || 0 }}</h3>
              <p>วันนี้</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking List -->
    <section class="bookings-section">
      <div class="container">
        <div class="section-header">
          <h2>รายการจองล่าสุด</h2>
          <div class="filters">
            <select v-model="filterStatus" @change="loadBookings">
              <option value="">ทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="completed">สำเร็จ</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
        </div>

        <div class="bookings-table">
          <table>
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ลูกค้า</th>
                <th>วันที่</th>
                <th>บริการ</th>
                <th>ราคา</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in bookings" :key="booking.booking_ID">
                <td>#{{ booking.booking_ID }}</td>
                <td>
                  <div class="customer-info">
                    <strong>{{ booking.cust_fname }} {{ booking.cust_lname }}</strong>
                    <small>{{ booking.cust_tel }}</small>
                  </div>
                </td>
                <td>{{ formatDate(booking.booking_date) }}</td>
                <td>{{ extractServices(booking.invoice_description) }}</td>
                <td class="price">฿{{ booking.payment_amount }}</td>
                <td>
                  <span class="status-badge" :class="booking.booking_status">
                    {{ getStatusText(booking.booking_status) }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button 
                      v-if="booking.booking_status === 'pending'"
                      @click="confirmBooking(booking.booking_ID)"
                      class="btn-confirm"
                    >
                      ยืนยัน
                    </button>
                    <button 
                      v-if="booking.booking_status === 'confirmed'"
                      @click="startService(booking.booking_ID)"
                      class="btn-start"
                    >
                      เริ่มบริการ
                    </button>
                    <button 
                      v-if="booking.booking_status === 'in_progress'"
                      @click="completeService(booking.booking_ID)"
                      class="btn-complete"
                    >
                      เสร็จสิ้น
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const router = useRouter();
const employeeName = ref('');
const employeeRole = ref('');
const employeeId = ref(0);
const stats = ref<any>({});
const bookings = ref<any[]>([]);
const filterStatus = ref('');

const isManager = computed(() => employeeRole.value === 'Manager');

const loadEmployeeData = () => {
  const empStr = localStorage.getItem('employee');
  if (!empStr) {
    router.push('/login');
    return;
  }

  const emp = JSON.parse(empStr);
  employeeName.value = emp.fullName;
  employeeRole.value = emp.role;
  employeeId.value = emp.id;
  
  console.log('👤 Employee loaded:', {
    name: employeeName.value,
    role: employeeRole.value,
    isManager: isManager.value
  });
};

const loadStats = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/management/booking/stats');
    if (response.data.success) {
      stats.value = response.data.stats;
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

const loadBookings = async () => {
  try {
    const params: any = {};
    if (filterStatus.value) {
      params.status = filterStatus.value;
    }

    const response = await axios.get('http://localhost:3000/api/management/booking/all', { params });
    if (response.data.success) {
      bookings.value = response.data.bookings;
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
};

const confirmBooking = async (bookingId: number) => {
  const result = await Swal.fire({
    title: 'ยืนยันการจอง?',
    text: `ต้องการยืนยันการจอง #${bookingId}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280'
  });

  if (result.isConfirmed) {
    try {
      await axios.put(`http://localhost:3000/api/management/booking/status/${bookingId}`, {
        status: 'confirmed',
        employee_id: employeeId.value
      });

      Swal.fire('สำเร็จ!', 'ยืนยันการจองแล้ว', 'success');
      loadBookings();
      loadStats();
    } catch (error) {
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถยืนยันได้', 'error');
    }
  }
};

const startService = async (bookingId: number) => {
  try {
    await axios.put(`http://localhost:3000/api/management/booking/status/${bookingId}`, {
      status: 'in_progress',
      employee_id: employeeId.value
    });

    Swal.fire('เริ่มบริการ!', 'เปลี่ยนสถานะเป็นกำลังดำเนินการ', 'success');
    loadBookings();
    loadStats();
  } catch (error) {
    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถเริ่มบริการได้', 'error');
  }
};

const completeService = async (bookingId: number) => {
  try {
    await axios.put(`http://localhost:3000/api/management/booking/status/${bookingId}`, {
      status: 'completed',
      employee_id: employeeId.value
    });

    Swal.fire('เสร็จสิ้น!', 'บริการเสร็จสมบูรณ์', 'success');
    loadBookings();
    loadStats();
  } catch (error) {
    Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถทำรายการได้', 'error');
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const extractServices = (description: string) => {
  const match = description?.match(/บริการ: (.+)/);
  return match ? match[1] : '-';
};

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: 'รอดำเนินการ',
    confirmed: 'ยืนยันแล้ว',
    in_progress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
  };
  return map[status] || status;
};

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'ออกจากระบบ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ออกจากระบบ',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626'
  });

  if (result.isConfirmed) {
    localStorage.removeItem('employee');
    localStorage.removeItem('isEmployeeLoggedIn');
    router.push('/login');
  }
};

onMounted(() => {
  loadEmployeeData();
  loadStats();
  loadBookings();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* ========================================
   HEADER
======================================== */
.dashboard-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.dashboard-header .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo span {
  font-size: 3rem;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: #dc2626;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info > span:first-child {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.role {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.role-manager {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
  box-shadow: 0 3px 15px rgba(220, 38, 38, 0.4);
}

.role-cashier {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  box-shadow: 0 3px 15px rgba(245, 158, 11, 0.4);
}

.role-cleaner {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 3px 15px rgba(16, 185, 129, 0.4);
}

.btn-logout {
  padding: 0.8rem 1.5rem;
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.4);
  border-radius: 10px;
  color: #ef4444;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-logout:hover {
  background: #ef4444;
  color: #fff;
  border-color: #ef4444;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
}

/* ========================================
   QUICK ACTIONS
======================================== */
.quick-actions-section {
  padding: 2rem;
  background: #0a0a0a;
}

.quick-actions-section .container {
  max-width: 1400px;
  margin: 0 auto;
}

.quick-actions-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #fff;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  position: relative;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  text-decoration: none;
  color: #fff;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.action-card:hover {
  transform: translateY(-5px);
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(220, 38, 38, 0.1);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
}

.action-card.active {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.15);
}

.action-card.manager-only {
  border-color: rgba(251, 191, 36, 0.5);
}

.action-card.manager-only:hover {
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.15);
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.action-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.action-card p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.action-card .badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #000;
}

/* ========================================
   STATS SECTION
======================================== */
.stats-section {
  padding: 2rem;
  background: linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 100%);
}

.stats-section .container {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.stat-card.pending {
  border-color: rgba(251, 191, 36, 0.5);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
}

.stat-card.success {
  border-color: rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
}

.stat-card.today {
  border-color: rgba(220, 38, 38, 0.5);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(153, 27, 27, 0.1));
}

.stat-icon {
  font-size: 3rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.stat-info h3 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.3rem;
  color: #fff;
}

.stat-info p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* ========================================
   BOOKINGS SECTION
======================================== */
.bookings-section {
  padding: 2rem;
  background: #1a1a1a;
}

.bookings-section .container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.filters select {
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
}

.filters select:focus {
  outline: none;
  border-color: #dc2626;
  background: rgba(255, 255, 255, 0.08);
}

.filters select option {
  background: #1a1a1a;
  color: #fff;
}

/* ========================================
   BOOKINGS TABLE
======================================== */
.bookings-table {
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
  background: rgba(220, 38, 38, 0.1);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
}

thead th {
  padding: 1.2rem 1rem;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 700;
  color: #dc2626;
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

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.customer-info strong {
  font-weight: 600;
  color: #fff;
}

.customer-info small {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.price {
  font-weight: 700;
  color: #10b981;
  font-size: 1.1rem;
}

.status-badge {
  padding: 0.4rem 0.9rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-block;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.4);
}

.status-badge.confirmed {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.status-badge.in_progress {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.4);
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-confirm {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.btn-start {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
}

.btn-start:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}

.btn-complete {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
}

.btn-complete:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-header .container {
    flex-direction: column;
    gap: 1rem;
  }

  .user-info {
    width: 100%;
    justify-content: space-between;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .bookings-table {
    overflow-x: auto;
  }

  table {
    min-width: 800px;
  }
}

@media (max-width: 480px) {
  .logo span {
    font-size: 2.5rem;
  }

  .logo h1 {
    font-size: 1.3rem;
  }

  .stat-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }

  .stat-info h3 {
    font-size: 2rem;
  }
}
</style>
