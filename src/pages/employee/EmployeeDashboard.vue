<!-- src/pages/employee/EmployeeDashboard.vue - COMPLETE VERSION -->
<template>
  <div class="dashboard-page">
    <!-- ========================================
         HEADER
    ======================================== -->
    <header class="dashboard-header">
      <div class="container">
        <div class="logo-section">
          <div class="logo">
            <span class="logo-icon">👨‍💼</span>
            <div class="logo-text">
              <h1>EMPLOYEE DASHBOARD</h1>
              <!-- ✅ แสดง Branch Name -->
              <p class="branch-info">
                <span class="icon">🏢</span>
                <span>{{ employeeBranchName || 'Loading...' }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="user-info">
          <div class="user-profile">
            <div class="user-avatar">
              {{ employeeName.charAt(0).toUpperCase() }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ employeeName }}</span>
              <span class="role" :class="`role-${employeeRole.toLowerCase()}`">
                {{ employeeRole }}
              </span>
            </div>
          </div>
          <button @click="handleLogout" class="btn-logout">
            <span class="icon">🚪</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ========================================
         QUICK ACTIONS MENU
    ======================================== -->
    <section class="quick-actions-section">
      <div class="container">
        <h2 class="section-title">
          <span class="icon">⚡</span>
          <span>เมนูหลัก</span>
        </h2>
        <div class="actions-grid">
          <router-link to="/employee/dashboard" class="action-card active">
            <div class="card-icon">📊</div>
            <h3>Dashboard</h3>
            <p>ภาพรวมและสถิติ</p>
            <span class="card-badge">Active</span>
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
            <span class="card-badge manager">Manager</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ========================================
         STATS CARDS
    ======================================== -->
    <section class="stats-section">
      <div class="container">
        <!-- ✅ Stats Header with Branch Info -->
        <div class="stats-header">
          <h2 class="section-title">
            <span class="icon">📈</span>
            <span>สถิติการจอง</span>
          </h2>
          
          <!-- ✅ Branch Selector (Manager Only) -->
          <div v-if="isManager" class="branch-selector">
            <label>🏢 เลือกสาขา:</label>
            <select v-model="selectedBranchId" @change="handleBranchChange" class="branch-select">
              <option value="">ทุกสาขา</option>
              <option v-for="branch in branches" :key="branch.branch_ID" :value="branch.branch_ID">
                {{ branch.branch_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>{{ stats.total || 0 }}</h3>
              <p>การจองทั้งหมด</p>
            </div>
            <div class="stat-trend">
              <span class="trend-icon">📈</span>
            </div>
          </div>

          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <h3>{{ stats.pending || 0 }}</h3>
              <p>รอดำเนินการ</p>
            </div>
            <div class="stat-badge">
              <span>{{ stats.pending || 0 }}</span>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>{{ stats.completed || 0 }}</h3>
              <p>สำเร็จแล้ว</p>
            </div>
            <div class="stat-badge success">
              <span>{{ stats.completed || 0 }}</span>
            </div>
          </div>

          <div class="stat-card today">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <h3>{{ stats.today || 0 }}</h3>
              <p>วันนี้</p>
            </div>
            <div class="stat-badge today">
              <span>{{ stats.today || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================
         BOOKING LIST
    ======================================== -->
    <section class="bookings-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">📋</span>
            <span>รายการจองล่าสุด</span>
            <span class="count-badge">{{ bookings.length }}</span>
          </h2>
          
          <div class="filters">
            <!-- Refresh Button -->
            <button @click="loadBookings" class="btn-refresh" :disabled="isLoadingBookings">
              <span v-if="!isLoadingBookings">🔄 รีเฟรช</span>
              <span v-else>⏳ กำลังโหลด...</span>
            </button>
            
            <!-- Status Filter -->
            <select v-model="filterStatus" @change="loadBookings" class="filter-select">
              <option value="">ทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="completed">สำเร็จ</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
        </div>

        <!-- ✅ Current Filter Info -->
        <div class="filter-info" v-if="filterStatus || (isManager && selectedBranchId)">
          <div class="filter-tags">
            <span v-if="filterStatus" class="filter-tag">
              <span class="tag-label">สถานะ:</span>
              <span class="tag-value">{{ getStatusText(filterStatus) }}</span>
              <button @click="filterStatus = ''; loadBookings()" class="tag-remove">×</button>
            </span>
            <span v-if="isManager && selectedBranchId" class="filter-tag branch">
              <span class="tag-label">สาขา:</span>
              <span class="tag-value">{{ getBranchName(selectedBranchId) }}</span>
              <button @click="selectedBranchId = ''; loadBookings()" class="tag-remove">×</button>
            </span>
          </div>
        </div>

        <div class="bookings-table">
          <table>
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ลูกค้า</th>
                <th v-if="isManager">สาขา</th>
                <th>วันที่</th>
                <th>บริการ</th>
                <th>ราคา</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="isLoadingBookings">
                <td :colspan="isManager ? 8 : 7" style="text-align: center; padding: 3rem;">
                  <div class="loading-container">
                    <div class="spinner"></div>
                    <p style="margin-top: 1rem; color: rgba(255,255,255,0.7);">กำลังโหลดข้อมูล...</p>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="bookings.length === 0">
                <td :colspan="isManager ? 8 : 7" style="text-align: center; padding: 3rem;">
                  <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p class="empty-title">ไม่มีรายการจอง</p>
                    <p class="empty-desc">
                      {{ getEmptyMessage() }}
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="booking in bookings" :key="booking.booking_ID">
                <td>
                  <span class="booking-id">#{{ booking.booking_ID }}</span>
                </td>
                <td>
                  <div class="customer-info">
                    <strong>{{ booking.cust_fname || 'N/A' }} {{ booking.cust_lname || '' }}</strong>
                    <small>{{ booking.cust_tel || '-' }}</small>
                  </div>
                </td>
                <td v-if="isManager">
                  <span class="branch-badge">
                    <span class="icon">🏢</span>
                    <span>{{ booking.branch_name || '-' }}</span>
                  </span>
                </td>
                <td>{{ formatDate(booking.booking_date) }}</td>
                <td class="service-cell">{{ extractServices(booking.receipt_description) }}</td>
                <td class="price">฿{{ formatPrice(booking.payment_amount) }}</td>
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
                      title="ยืนยันการจอง"
                    >
                      <span class="icon">✓</span>
                      <span>ยืนยัน</span>
                    </button>
                    <button 
                      v-if="booking.booking_status === 'confirmed'"
                      @click="startService(booking.booking_ID)"
                      class="btn-start"
                      title="เริ่มบริการ"
                    >
                      <span class="icon">▶</span>
                      <span>เริ่ม</span>
                    </button>
                    <button 
                      v-if="booking.booking_status === 'in_progress'"
                      @click="completeService(booking.booking_ID)"
                      class="btn-complete"
                      title="เสร็จสิ้น"
                    >
                      <span class="icon">✓</span>
                      <span>เสร็จสิ้น</span>
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

// ========================================
// STATE
// ========================================
const employeeName = ref('');
const employeeRole = ref('');
const employeeId = ref(0);
const employeeBranchId = ref(0);
const employeeBranchName = ref('');
const stats = ref<any>({});
const bookings = ref<any[]>([]);
const branches = ref<any[]>([]);
const selectedBranchId = ref('');
const filterStatus = ref('');
const isLoadingBookings = ref(false);

// ========================================
// COMPUTED
// ========================================
const isManager = computed(() => employeeRole.value === 'Manager');

// ========================================
// METHODS
// ========================================

/**
 * โหลดข้อมูลพนักงานจาก localStorage
 */
const loadEmployeeData = () => {
  const empStr = localStorage.getItem('employee');
  if (!empStr) {
    Swal.fire({
      title: 'กรุณาเข้าสู่ระบบ',
      icon: 'warning',
      confirmButtonColor: '#dc2626'
    }).then(() => {
      router.push('/login');
    });
    return;
  }

  try {
    const emp = JSON.parse(empStr);
    employeeName.value = emp.fullName || `${emp.firstName} ${emp.lastName}`;
    employeeRole.value = emp.role || 'Employee';
    employeeId.value = emp.id || 0;
    employeeBranchId.value = emp.branchId || 0;
    employeeBranchName.value = emp.branchName || 'สาขาหลัก';
    
    // ✅ ตั้งค่า default branch สำหรับ employee ทั่วไป
    if (!isManager.value) {
      selectedBranchId.value = employeeBranchId.value.toString();
    }
    
    console.log('👤 Employee loaded:', {
      id: employeeId.value,
      name: employeeName.value,
      role: employeeRole.value,
      branchId: employeeBranchId.value,
      branchName: employeeBranchName.value,
      isManager: isManager.value
    });
  } catch (error) {
    console.error('❌ Error parsing employee data:', error);
    router.push('/login');
  }
};

/**
 * โหลดรายการสาขาทั้งหมด (สำหรับ Manager)
 */
const loadBranches = async () => {
  if (!isManager.value) return;

  try {
    console.log('🏢 Loading branches...');
    
    const response = await axios.get('http://localhost:3000/api/branch/all');
    
    if (response.data.success) {
      branches.value = response.data.branches || [];
      console.log('✅ Loaded branches:', branches.value.length);
    }
  } catch (error: any) {
    console.error('❌ Error loading branches:', error);
  }
};

/**
 * โหลดสถิติ
 */
const loadStats = async () => {
  try {
    console.log('📊 Loading stats...');
    
    // ✅ เพิ่ม branch filter
    const params: any = {};
    
    if (isManager.value) {
      if (selectedBranchId.value) {
        params.branch_id = selectedBranchId.value;
      }
      // ถ้าไม่เลือก = ดูทุกสาขา
    } else {
      if (employeeBranchId.value) {
        params.branch_id = employeeBranchId.value;
      }
    }

    console.log('📊 Stats params:', params);
    
    const response = await axios.get('http://localhost:3000/api/management/booking/stats', { params });
    
    if (response.data.success) {
      stats.value = response.data.stats;
      console.log('✅ Stats loaded:', stats.value);
    }
  } catch (error: any) {
    console.error('❌ Error loading stats:', error);
  }
};

/**
 * โหลดรายการจอง
 */
const loadBookings = async () => {
  try {
    isLoadingBookings.value = true;
    
    const params: any = {};
    
    // Status Filter
    if (filterStatus.value) {
      params.status = filterStatus.value;
    }

    // ✅ Branch Filter
    if (isManager.value) {
      // Manager: ใช้ selectedBranchId (หรือทุกสาขา)
      if (selectedBranchId.value) {
        params.branch_id = selectedBranchId.value;
      }
    } else {
      // Employee: ใช้ branchId ของตัวเอง
      if (employeeBranchId.value) {
        params.branch_id = employeeBranchId.value;
      }
    }

    console.log('📥 Loading bookings...');
    console.log('   Params:', params);

    const response = await axios.get('http://localhost:3000/api/management/booking/all', { 
      params,
      timeout: 10000
    });
    
    console.log('📦 Response:', response.data);

    if (response.data.success) {
      bookings.value = response.data.bookings || [];
      console.log('✅ Loaded bookings:', bookings.value.length);
      
      if (bookings.value.length > 0) {
        console.log('📄 Sample booking:', {
          id: bookings.value[0].booking_ID,
          customer: `${bookings.value[0].cust_fname} ${bookings.value[0].cust_lname}`,
          branch: bookings.value[0].branch_name,
          status: bookings.value[0].booking_status
        });
      }
    }
  } catch (error: any) {
    console.error('❌ Error loading bookings:', error);
    console.error('   Status:', error.response?.status);
    console.error('   Data:', error.response?.data);
    
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้',
      icon: 'error',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
    
    bookings.value = [];
  } finally {
    isLoadingBookings.value = false;
  }
};

/**
 * Handle branch change (Manager only)
 */
const handleBranchChange = () => {
  console.log('🏢 Branch changed to:', selectedBranchId.value);
  loadStats();
  loadBookings();
};

/**
 * ยืนยันการจอง
 */
const confirmBooking = async (bookingId: number) => {
  const result = await Swal.fire({
    title: 'ยืนยันการจอง?',
    text: `ต้องการยืนยันการจอง #${bookingId}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/management/booking/status/${bookingId}`, 
        {
          status: 'confirmed',
          employee_id: employeeId.value
        }
      );

      if (response.data.success) {
        await Swal.fire({
          title: 'สำเร็จ!',
          text: 'ยืนยันการจองแล้ว',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000,
          background: 'rgba(30, 30, 30, 0.98)',
          color: '#ffffff'
        });
        
        loadBookings();
        loadStats();
      }
    } catch (error: any) {
      console.error('❌ Error confirming:', error);
      
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถยืนยันได้',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      });
    }
  }
};

/**
 * เริ่มบริการ
 */
const startService = async (bookingId: number) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/management/booking/status/${bookingId}`, 
      {
        status: 'in_progress',
        employee_id: employeeId.value
      }
    );

    if (response.data.success) {
      await Swal.fire({
        title: 'เริ่มบริการ!',
        text: 'เปลี่ยนสถานะเป็นกำลังดำเนินการ',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      });
      
      loadBookings();
      loadStats();
    }
  } catch (error: any) {
    console.error('❌ Error starting:', error);
    
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.response?.data?.message || 'ไม่สามารถเริ่มบริการได้',
      icon: 'error',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
  }
};

/**
 * เสร็จสิ้นบริการ
 */
const completeService = async (bookingId: number) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/management/booking/status/${bookingId}`, 
      {
        status: 'completed',
        employee_id: employeeId.value
      }
    );

    if (response.data.success) {
      await Swal.fire({
        title: 'เสร็จสิ้น! 🎉',
        html: `
          <div style="padding: 1.5rem;">
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">บริการเสร็จสมบูรณ์</p>
            <div style="background: rgba(16, 185, 129, 0.1); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3);">
              <p style="color: #10b981; font-weight: 700; font-size: 1.1rem;">
                ✓ ลูกค้าได้รับคะแนนแล้ว
              </p>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'ตกลง',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      });
      
      loadBookings();
      loadStats();
    }
  } catch (error: any) {
    console.error('❌ Error completing:', error);
    
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.response?.data?.message || 'ไม่สามารถทำรายการได้',
      icon: 'error',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
  }
};

/**
 * Format helpers
 */
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  
  try {
    return new Date(dateStr).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '-';
  }
};

const formatPrice = (price: number) => {
  if (!price && price !== 0) return '0';
  return price.toLocaleString();
};

const extractServices = (description: string) => {
  if (!description) return '-';
  
  const match = description.match(/บริการ: (.+)/);
  return match ? match[1] : description;
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

const getBranchName = (branchId: string) => {
  const branch = branches.value.find(b => b.branch_ID.toString() === branchId);
  return branch ? branch.branch_name : 'Unknown';
};

const getEmptyMessage = () => {
  if (filterStatus.value && selectedBranchId.value) {
    return `ไม่มีรายการที่มีสถานะ "${getStatusText(filterStatus.value)}" ในสาขา ${getBranchName(selectedBranchId.value)}`;
  } else if (filterStatus.value) {
    return `ไม่มีรายการที่มีสถานะ "${getStatusText(filterStatus.value)}"`;
  } else if (selectedBranchId.value) {
    return `ไม่มีรายการจองในสาขา ${getBranchName(selectedBranchId.value)}`;
  }
  return 'ยังไม่มีการจองในระบบ';
};

/**
 * Logout
 */
const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'ออกจากระบบ?',
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
      showConfirmButton: false,
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
    
    router.push('/login');
  }
};

// ========================================
// LIFECYCLE
// ========================================
onMounted(() => {
  loadEmployeeData();
  loadBranches();  // ✅ โหลดสาขา
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
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
}

.dashboard-header .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-icon {
  font-size: 3.5rem;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.6));
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.logo-text h1 {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: #dc2626;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
}

.branch-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #fbbf24;
  font-weight: 600;
  padding: 0.4rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(251, 191, 36, 0.3);
  width: fit-content;
}

.branch-info .icon {
  font-size: 1.2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.5);
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.role {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: fit-content;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: rgba(239, 68, 68, 0.15);
  border: 2px solid rgba(239, 68, 68, 0.4);
  border-radius: 12px;
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
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.5);
}

.btn-logout .icon {
  font-size: 1.2rem;
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

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title .icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.5));
}

.count-badge {
  padding: 0.3rem 0.8rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.action-card {
  position: relative;
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  text-decoration: none;
  color: #fff;
  transition: all 0.4s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
  transition: left 0.6s;
}

.action-card:hover::before {
  left: 100%;
}

.action-card:hover {
  transform: translateY(-8px);
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(220, 38, 38, 0.08);
  box-shadow: 0 15px 40px rgba(220, 38, 38, 0.3);
}

.action-card.active {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.12);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.action-card.manager-only {
  border-color: rgba(251, 191, 36, 0.5);
}

.action-card.manager-only:hover {
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
  box-shadow: 0 15px 40px rgba(251, 191, 36, 0.4);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 5px 15px rgba(220, 38, 38, 0.4));
  transition: transform 0.3s;
}

.action-card:hover .card-icon {
  transform: scale(1.15) rotate(5deg);
}

.action-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

.action-card p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.card-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.4rem 1rem;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.4);
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #dc2626;
}

.card-badge.manager {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-color: transparent;
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

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.branch-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(251, 191, 36, 0.1);
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 15px;
}

.branch-selector label {
  font-size: 1rem;
  font-weight: 600;
  color: #fbbf24;
  white-space: nowrap;
}

.branch-select {
  min-width: 250px;
  padding: 0.8rem 1.2rem;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
}

.branch-select:focus {
  outline: none;
  border-color: #fbbf24;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.15);
}

.branch-select option {
  background: #1a1a1a;
  color: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}

.stat-card {
  position: relative;
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.4s;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.stat-card.total {
  border-color: rgba(255, 255, 255, 0.3);
}

.stat-card.pending {
  border-color: rgba(251, 191, 36, 0.5);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.08));
}

.stat-card.success {
  border-color: rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.08));
}

.stat-card.today {
  border-color: rgba(220, 38, 38, 0.5);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(153, 27, 27, 0.08));
}

.stat-icon {
  font-size: 3.5rem;
  width: 85px;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: #fff;
  line-height: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.stat-info p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.stat-trend {
    position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 1.5rem;
  opacity: 0.3;
}

.stat-badge {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.5);
}

.stat-badge.success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.stat-badge.today {
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
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
  flex-wrap: wrap;
  gap: 1.5rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  background: rgba(16, 185, 129, 0.12);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  color: #10b981;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  white-space: nowrap;
}

.btn-refresh:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
}

.btn-refresh:active:not(:disabled) {
  transform: translateY(0);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-select {
  min-width: 180px;
  padding: 0.9rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #dc2626;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
}

.filter-select option {
  background: #1a1a1a;
  color: #fff;
}

/* ========================================
   FILTER INFO
======================================== */
.filter-info {
  margin-bottom: 1.5rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-tags {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1.2rem;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #3b82f6;
  animation: tagPop 0.3s ease-out;
}

@keyframes tagPop {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.filter-tag.branch {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.tag-label {
  opacity: 0.8;
  font-weight: 500;
}

.tag-value {
  font-weight: 700;
}

.tag-remove {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: currentColor;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
}

.tag-remove:hover {
  background: rgba(239, 68, 68, 0.3);
  color: #ef4444;
  transform: rotate(90deg);
}

/* ========================================
   BOOKINGS TABLE
======================================== */
.bookings-table {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: rgba(220, 38, 38, 0.15);
  border-bottom: 2px solid rgba(220, 38, 38, 0.4);
}

thead th {
  padding: 1.5rem 1.2rem;
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
  background: rgba(255, 255, 255, 0.05);
}

tbody tr:last-child {
  border-bottom: none;
}

tbody td {
  padding: 1.5rem 1.2rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  vertical-align: middle;
}

.booking-id {
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc2626;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.customer-info strong {
  font-weight: 700;
  color: #fff;
  font-size: 1rem;
}

.customer-info small {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.branch-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(251, 191, 36, 0.15);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fbbf24;
}

.branch-badge .icon {
  font-size: 1rem;
}

.service-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price {
  font-weight: 900;
  color: #10b981;
  font-size: 1.2rem;
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.5);
}

.status-badge.confirmed {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.5);
}

.status-badge.in_progress {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border-color: rgba(168, 85, 247, 0.5);
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.5);
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.5);
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.actions button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  white-space: nowrap;
}

.actions button .icon {
  font-size: 1rem;
}

.btn-confirm {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(16, 185, 129, 0.5);
}

.btn-start {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-start:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5);
}

.btn-complete {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-complete:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(16, 185, 129, 0.5);
}

/* ========================================
   LOADING & EMPTY STATE
======================================== */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 5rem;
  opacity: 0.3;
  filter: grayscale(100%);
  animation: emptyFloat 3s ease-in-out infinite;
}

@keyframes emptyFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.empty-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.empty-desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  max-width: 500px;
  line-height: 1.6;
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .dashboard-header .container {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }

  .user-info {
    justify-content: space-between;
    width: 100%;
  }

  .stats-header {
    flex-direction: column;
    align-items: stretch;
  }

  .branch-selector {
    justify-content: space-between;
  }

  .branch-select {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .logo-text h1 {
    font-size: 1.5rem;
  }

  .branch-info {
    font-size: 0.85rem;
  }

  .user-profile {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .user-avatar {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }

  .user-name {
    font-size: 1rem;
  }

  .btn-logout {
    padding: 0.8rem 1.2rem;
    font-size: 0.85rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 2rem 1.5rem;
  }

  .stat-icon {
    width: 70px;
    height: 70px;
    font-size: 2.5rem;
  }

  .stat-info h3 {
    font-size: 2.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    width: 100%;
    flex-direction: column;
  }

  .btn-refresh,
  .filter-select {
    width: 100%;
  }

  .bookings-table {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 900px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 1rem 0;
  }

  .logo-icon {
    font-size: 3rem;
  }

  .logo-text h1 {
    font-size: 1.3rem;
  }

  .branch-info {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
  }

  .user-info {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .stat-info h3 {
    font-size: 2rem;
  }

  .stat-info p {
    font-size: 0.85rem;
  }

  .card-icon {
    font-size: 3rem;
  }

  .action-card h3 {
    font-size: 1.2rem;
  }

  .action-card p {
    font-size: 0.85rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .filter-tags {
    flex-direction: column;
  }

  .filter-tag {
    width: 100%;
    justify-content: space-between;
  }

  .empty-icon {
    font-size: 4rem;
  }

  .empty-title {
    font-size: 1.1rem;
  }

  .empty-desc {
    font-size: 0.85rem;
  }
}

/* ========================================
   ANIMATIONS
======================================== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: fadeIn 0.5s ease-out both;
}

.stat-card:nth-child(1) { animation-delay: 0s; }
.stat-card:nth-child(2) { animation-delay: 0.1s; }
.stat-card:nth-child(3) { animation-delay: 0.2s; }
.stat-card:nth-child(4) { animation-delay: 0.3s; }

.action-card {
  animation: fadeIn 0.5s ease-out both;
}

.action-card:nth-child(1) { animation-delay: 0.1s; }
.action-card:nth-child(2) { animation-delay: 0.2s; }
.action-card:nth-child(3) { animation-delay: 0.3s; }

/* ========================================
   CUSTOM SCROLLBAR
======================================== */
.bookings-table::-webkit-scrollbar {
  height: 8px;
}

.bookings-table::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.bookings-table::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #dc2626, #991b1b);
  border-radius: 10px;
}

.bookings-table::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #b91c1c, #7f1d1d);
}

/* ========================================
   HOVER EFFECTS
======================================== */
tbody tr {
  position: relative;
}

tbody tr::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #dc2626, #fbbf24);
  opacity: 0;
  transition: opacity 0.3s;
}

tbody tr:hover::before {
  opacity: 1;
}

/* ========================================
   PRINT STYLES
======================================== */
@media print {
  .dashboard-header,
  .quick-actions-section,
  .filters,
  .filter-info,
  .actions,
  .btn-logout {
    display: none !important;
  }

  .bookings-table {
    border: 2px solid #000;
  }

  .stats-section {
    page-break-after: always;
  }

  tbody tr {
    page-break-inside: avoid;
  }
}

/* ========================================
   ACCESSIBILITY
======================================== */
.btn-refresh:focus-visible,
.filter-select:focus-visible,
.branch-select:focus-visible,
.actions button:focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 3px;
}

/* ========================================
   REDUCED MOTION
======================================== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ========================================
   HIGH CONTRAST
======================================== */
@media (prefers-contrast: high) {
  .stat-card,
  .action-card,
  .bookings-table {
    border-width: 3px;
  }

  .status-badge {
    border-width: 2px;
  }
}

/* ========================================
   DARK MODE (Already dark, but ensure)
======================================== */
@media (prefers-color-scheme: dark) {
  .dashboard-page {
    background: #0a0a0a;
    color: #fff;
  }
}

/* ========================================
   SAFE AREA INSETS (for mobile notches)
======================================== */
@supports (padding: max(0px)) {
  .dashboard-header .container,
  .section .container {
    padding-left: max(2rem, env(safe-area-inset-left));
    padding-right: max(2rem, env(safe-area-inset-right));
  }
}

/* ========================================
   PERFORMANCE OPTIMIZATIONS
======================================== */
.stat-card,
.action-card,
.logo-icon {
  will-change: transform;
  backface-visibility: hidden;
}

.spinner {
  will-change: transform;
}

/* ========================================
   UTILITY CLASSES
======================================== */
.text-gradient {
  background: linear-gradient(135deg, #dc2626, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glow-red {
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

.glow-gold {
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

.glow-green {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}
</style>
