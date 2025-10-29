<!-- src/pages/employee/EmployeeDashboard.vue -->
<template>
  <div class="dashboard-page">
    <!-- ✅ Modern Header with Gradient -->
    <header class="dashboard-header">
      <div class="container">
        <div class="header-left">
          <div class="logo">
            <div class="logo-icon">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 24l4-8h32l4 8M12 24v16h40V24M12 40h4m24 0h4"/>
                <circle cx="20" cy="40" r="4"/>
                <circle cx="44" cy="40" r="4"/>
              </svg>
            </div>
            <div class="logo-text">
              <h1>EMPLOYEE DASHBOARD</h1>
              <p>ระบบจัดการพนักงาน</p>
            </div>
          </div>
        </div>

        <div class="header-right">
          <div class="user-profile">
            <div class="user-avatar">
              <span>{{ employeeInitial }}</span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ employeeName }}</span>
              <span class="user-role">{{ employeeRole }}</span>
            </div>
          </div>
          <button @click="handleLogout" class="btn-logout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ✅ Stats Section with Animation -->
    <section class="stats-section">
      <div class="container">
        <h2 class="section-title">
          <span class="icon">📊</span>
          สถิติภาพรวม
        </h2>
        
        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-icon-wrapper">
              <div class="stat-icon">📋</div>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.total || 0 }}</h3>
              <p class="stat-label">การจองทั้งหมด</p>
              <div class="stat-trend">
                <span class="trend-icon">📈</span>
                <span>+12%</span>
              </div>
            </div>
          </div>

          <div class="stat-card pending">
            <div class="stat-icon-wrapper">
              <div class="stat-icon">⏳</div>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.pending || 0 }}</h3>
              <p class="stat-label">รอดำเนินการ</p>
              <div class="stat-badge urgent">ด่วน</div>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon-wrapper">
              <div class="stat-icon">✅</div>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.completed || 0 }}</h3>
              <p class="stat-label">สำเร็จแล้ว</p>
              <div class="stat-trend positive">
                <span class="trend-icon">↗</span>
                <span>+8%</span>
              </div>
            </div>
          </div>

          <div class="stat-card today">
            <div class="stat-icon-wrapper">
              <div class="stat-icon">📅</div>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.today || 0 }}</h3>
              <p class="stat-label">วันนี้</p>
              <div class="stat-time">{{ currentTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ Bookings Section with Modern Design -->
    <section class="bookings-section">
      <div class="container">
        <div class="section-header">
          <div class="header-left">
            <h2 class="section-title">
              <span class="icon">📝</span>
              รายการจองล่าสุด
            </h2>
            <p class="section-subtitle">จัดการและติดตามสถานะการจอง</p>
          </div>

          <div class="header-actions">
            <div class="filter-group">
              <label>กรองสถานะ:</label>
              <select v-model="filterStatus" @change="loadBookings" class="filter-select">
                <option value="">ทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="in_progress">กำลังดำเนินการ</option>
                <option value="completed">สำเร็จ</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>

            <button @click="loadBookings" class="btn-refresh">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              <span>รีเฟรช</span>
            </button>
          </div>
        </div>

        <!-- ✅ Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="spinner-large"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <!-- ✅ Empty State -->
        <div v-else-if="bookings.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>ไม่พบข้อมูล</h3>
          <p>ยังไม่มีรายการจองในขณะนี้</p>
        </div>

        <!-- ✅ Bookings Table -->
        <div v-else class="table-container">
          <table class="bookings-table">
            <thead>
              <tr>
                <th>รหัสจอง</th>
                <th>ลูกค้า</th>
                <th>วันที่จอง</th>
                <th>บริการ</th>
                <th>ยอดชำระ</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in bookings" :key="booking.booking_ID" class="table-row">
                <td>
                  <div class="booking-id">
                    <span class="id-badge">#{{ booking.booking_ID }}</span>
                  </div>
                </td>
                <td>
                  <div class="customer-info">
                    <div class="customer-avatar">
                      {{ booking.cust_fname?.charAt(0) }}{{ booking.cust_lname?.charAt(0) }}
                    </div>
                    <div class="customer-details">
                      <strong>{{ booking.cust_fname }} {{ booking.cust_lname }}</strong>
                      <small>{{ booking.cust_tel || '-' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-info">
                    <span class="date">{{ formatDate(booking.booking_date) }}</span>
                    <small class="time">{{ formatTime(booking.booking_date) }}</small>
                  </div>
                </td>
                <td>
                  <div class="services-list">
                    {{ extractServices(booking.invoice_description) }}
                  </div>
                </td>
                <td>
                  <div class="price-info">
                    <span class="price">฿{{ formatNumber(booking.payment_amount) }}</span>
                    <small>{{ booking.payment_method }}</small>
                  </div>
                </td>
                <td>
                  <span class="status-badge" :class="booking.booking_status">
                    <span class="status-dot"></span>
                    {{ getStatusText(booking.booking_status) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      v-if="booking.booking_status === 'pending'"
                      @click="confirmBooking(booking.booking_ID)"
                      class="btn-action confirm"
                      title="ยืนยันการจอง"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>ยืนยัน</span>
                    </button>

                    <button 
                      v-if="booking.booking_status === 'confirmed'"
                      @click="startService(booking.booking_ID)"
                      class="btn-action start"
                      title="เริ่มบริการ"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <span>เริ่มบริการ</span>
                    </button>

                    <button 
                      v-if="booking.booking_status === 'in_progress'"
                      @click="completeService(booking.booking_ID)"
                      class="btn-action complete"
                      title="ทำเสร็จแล้ว"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <span>เสร็จสิ้น</span>
                    </button>

                    <button 
                      @click="viewDetails(booking)"
                      class="btn-action view"
                      title="ดูรายละเอียด"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
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
import { ref, onMounted, computed, onUnmounted } from 'vue';
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
const isLoading = ref(false);
const currentTime = ref('');

// ✅ Computed - Employee Initial
const employeeInitial = computed(() => {
  return employeeName.value.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
});

// ✅ Update Current Time
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

let timeInterval: any;

// ✅ Load Employee Data
const loadEmployeeData = () => {
  const empStr = localStorage.getItem('employee');
  if (!empStr) {
    Swal.fire({
      title: 'กรุณาเข้าสู่ระบบ',
      text: 'คุณต้องเข้าสู่ระบบพนักงานก่อน',
      icon: 'warning',
      confirmButtonColor: '#dc2626'
    });
    router.push('/login');
    return;
  }

  const emp = JSON.parse(empStr);
  employeeName.value = emp.fullName || 'พนักงาน';
  employeeRole.value = emp.role || 'Staff';
  employeeId.value = emp.id;
};

// ✅ Load Stats
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

// ✅ Load Bookings
const loadBookings = async () => {
  isLoading.value = true;
  
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
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถโหลดข้อมูลได้',
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    isLoading.value = false;
  }
};

// ✅ Confirm Booking
const confirmBooking = async (bookingId: number) => {
  const result = await Swal.fire({
    title: 'ยืนยันการจอง',
    html: `
      <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">ต้องการยืนยันการจอง</p>
      <p style="font-size: 1.5rem; font-weight: 700; color: #dc2626;">#${bookingId}</p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '✓ ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    try {
      await axios.put(`http://localhost:3000/api/management/booking/status/${bookingId}`, {
        status: 'confirmed',
        employee_id: employeeId.value
      });

      Swal.fire({
        title: 'ยืนยันสำเร็จ!',
        text: `การจอง #${bookingId} ได้รับการยืนยันแล้ว`,
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000
      });
      
      loadBookings();
      loadStats();
    } catch (error) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถยืนยันการจองได้',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  }
};

// ✅ Start Service
const startService = async (bookingId: number) => {
  try {
    await axios.put(`http://localhost:3000/api/management/booking/status/${bookingId}`, {
      status: 'in_progress',
      employee_id: employeeId.value
    });

    Swal.fire({
      title: 'เริ่มบริการ!',
      text: 'สถานะเปลี่ยนเป็น "กำลังดำเนินการ"',
      icon: 'success',
      confirmButtonColor: '#3b82f6',
      timer: 2000
    });
    
    loadBookings();
    loadStats();
  } catch (error) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถเริ่มบริการได้',
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  }
};

// ✅ Complete Service
const completeService = async (bookingId: number) => {
  const result = await Swal.fire({
    title: 'ทำบริการเสร็จแล้ว?',
    text: `ยืนยันว่าการจอง #${bookingId} เสร็จสมบูรณ์`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '✓ เสร็จสิ้น',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280'
  });

  if (result.isConfirmed) {
    try {
      await axios.put(`http://localhost:3000/api/management/booking/status/${bookingId}`, {
        status: 'completed',
        employee_id: employeeId.value
      });

      Swal.fire({
        title: 'เสร็จสิ้น!',
        text: 'บริการเสร็จสมบูรณ์',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000
      });
      
      loadBookings();
      loadStats();
    } catch (error) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถทำรายการได้',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  }
};

// ✅ View Details
const viewDetails = (booking: any) => {
  Swal.fire({
    title: `รายละเอียดการจอง #${booking.booking_ID}`,
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p><strong>ลูกค้า:</strong> ${booking.cust_fname} ${booking.cust_lname}</p>
        <p><strong>เบอร์:</strong> ${booking.cust_tel || '-'}</p>
        <p><strong>วันที่:</strong> ${formatDate(booking.booking_date)}</p>
        <p><strong>บริการ:</strong> ${extractServices(booking.invoice_description)}</p>
        <p><strong>ราคา:</strong> ฿${formatNumber(booking.payment_amount)}</p>
        <p><strong>ชำระด้วย:</strong> ${booking.payment_method}</p>
        <p><strong>สถานะ:</strong> ${getStatusText(booking.booking_status)}</p>
      </div>
    `,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'ปิด',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });
};

// ✅ Format Functions
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatNumber = (num: number) => {
  return num.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
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

// ✅ Logout
const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'ออกจากระบบ?',
    text: 'คุณต้องการออกจากระบบหรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ออกจากระบบ',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    localStorage.removeItem('employee');
    localStorage.removeItem('isEmployeeLoggedIn');
    
    await Swal.fire({
      title: 'ออกจากระบบสำเร็จ',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    
    router.push('/login');
  }
};

// ✅ Lifecycle
onMounted(() => {
  loadEmployeeData();
  loadStats();
  loadBookings();
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
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
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* ========================================
   HEADER
======================================== */
.dashboard-header {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.dashboard-header .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
  border: 2px solid rgba(220, 38, 38, 0.5);
}

.logo-icon svg {
  width: 35px;
  height: 35px;
  color: white;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.logo-text h1 {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 1px;
  margin-bottom: 0.2rem;
}

.logo-text p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: white;
  border: 3px solid rgba(220, 38, 38, 0.5);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.user-role {
  font-size: 0.85rem;
  color: #dc2626;
  font-weight: 600;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(220, 38, 38, 0.1);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 10px;
  color: #dc2626;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-logout svg {
  width: 18px;
  height: 18px;
}

.btn-logout:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
}

/* ========================================
   STATS SECTION
======================================== */
.stats-section {
  padding: 3rem 2rem;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
}

.stats-section .container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
}

.section-title .icon {
  font-size: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.stat-card.total {
  border-color: rgba(59, 130, 246, 0.3);
}

.stat-card.total:hover {
  border-color: #3b82f6;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
}

.stat-card.pending {
  border-color: rgba(251, 191, 36, 0.3);
}

.stat-card.pending:hover {
  border-color: #fbbf24;
  box-shadow: 0 10px 40px rgba(251, 191, 36, 0.3);
}

.stat-card.success {
  border-color: rgba(16, 185, 129, 0.3);
}

.stat-card.success:hover {
  border-color: #10b981;
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
}

.stat-card.today {
  border-color: rgba(220, 38, 38, 0.3);
}

.stat-card.today:hover {
  border-color: #dc2626;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.3);
}

.stat-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
}

.stat-card.total .stat-icon-wrapper {
  background: rgba(59, 130, 246, 0.15);
}

.stat-card.pending .stat-icon-wrapper {
  background: rgba(251, 191, 36, 0.15);
}

.stat-card.success .stat-icon-wrapper {
  background: rgba(16, 185, 129, 0.15);
}

.stat-card.today .stat-icon-wrapper {
  background: rgba(220, 38, 38, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.stat-trend {
  margin-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.75rem;
  background: rgba(16, 185, 129, 0.15);
  border-radius: 20px;
  font-size: 0.85rem;
  color: #10b981;
  font-weight: 600;
}

.stat-trend.positive {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.stat-badge {
  margin-top: 0.5rem;
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.4);
  border-radius: 20px;
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: 600;
}

.stat-badge.urgent {
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.stat-time {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

/* ========================================
   BOOKINGS SECTION
======================================== */
.bookings-section {
  padding: 2rem;
  margin-bottom: 3rem;
}

.bookings-section .container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-left {
  flex: 1;
}

.section-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-group label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.filter-select {
  padding: 0.75rem 1rem;
  background: rgba(30, 30, 30, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 200px;
}

.filter-select:focus {
  outline: none;
  border-color: #dc2626;
  background: rgba(30, 30, 30, 0.95);
}

.filter-select option {
  background: #1a1a1a;
  color: #fff;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
  color: #3b82f6;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-refresh svg {
  width: 18px;
  height: 18px;
}

.btn-refresh:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
}

.btn-refresh:hover svg {
  animation: rotate 0.6s ease-in-out;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ========================================
   LOADING & EMPTY STATES
======================================== */
.loading-container {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(220, 38, 38, 0.2);
  border-top-color: #dc2626;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(30, 30, 30, 0.5);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ========================================
   TABLE
======================================== */
.table-container {
  background: rgba(30, 30, 30, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
}

.bookings-table thead {
  background: rgba(220, 38, 38, 0.15);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
}

.bookings-table th {
  padding: 1.25rem 1.5rem;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bookings-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.bookings-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.bookings-table td {
  padding: 1.5rem 1.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.booking-id {
  display: flex;
  align-items: center;
}

.id-badge {
  padding: 0.4rem 0.9rem;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  font-weight: 700;
  color: #3b82f6;
  font-size: 0.9rem;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.customer-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 0.95rem;
  border: 2px solid rgba(59, 130, 246, 0.3);
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.customer-details strong {
  font-size: 0.95rem;
  color: #fff;
  font-weight: 600;
}

.customer-details small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.date-info .date {
  font-weight: 600;
  color: #fff;
}

.date-info .time {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.services-list {
  color: rgba(255, 255, 255, 0.8);
  max-width: 200px;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.price-info .price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #10b981;
}

.price-info small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.status-badge.pending .status-dot {
  background: #fbbf24;
}

.status-badge.confirmed {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.status-badge.confirmed .status-dot {
  background: #3b82f6;
}

.status-badge.in_progress {
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.3);
  color: #a855f7;
}

.status-badge.in_progress .status-dot {
  background: #a855f7;
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.status-badge.completed .status-dot {
  background: #10b981;
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.status-badge.cancelled .status-dot {
  background: #ef4444;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid;
  font-family: inherit;
  white-space: nowrap;
}

.btn-action svg {
  width: 16px;
  height: 16px;
}

.btn-action.confirm {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.btn-action.confirm:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
}

.btn-action.start {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.btn-action.start:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
}

.btn-action.complete {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.btn-action.complete:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
}

.btn-action.view {
  background: rgba(156, 163, 175, 0.1);
  border-color: rgba(156, 163, 175, 0.3);
  color: #9ca3af;
  padding: 0.6rem;
}

.btn-action.view:hover {
  background: #9ca3af;
  color: white;
  border-color: #9ca3af;
  transform: translateY(-2px);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .bookings-table {
    min-width: 1000px;
  }
}

@media (max-width: 968px) {
  .dashboard-header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select,
  .btn-refresh {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .user-profile {
    padding: 0.5rem 1rem;
  }
  
  .btn-logout span {
    display: none;
  }
  
  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .dashboard-page {
    font-size: 0.9rem;
  }
  
  .dashboard-header {
    padding: 1rem 0;
  }
  
  .logo-icon {
    width: 50px;
    height: 50px;
  }
  
  .logo-text h1 {
    font-size: 1.2rem;
  }
  
  .user-details span {
    font-size: 0.85rem;
  }
  
  .stats-section,
  .bookings-section {
    padding: 2rem 1rem;
  }
}
</style>