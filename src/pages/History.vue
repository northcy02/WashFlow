<!-- src/pages/History.vue -->
<template>
  <div class="history-page">
    <Navigator />

    <section class="main">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <h1>📋 ประวัติการจอง</h1>
          <p class="subtitle">ดูรายการจองและคะแนนที่คุณได้รับ</p>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button 
            :class="['filter-tab', { active: filterStatus === '' }]"
            @click="filterStatus = ''; filterBookings()"
          >
            ทั้งหมด
          </button>
          <button 
            :class="['filter-tab', { active: filterStatus === 'pending' }]"
            @click="filterStatus = 'pending'; filterBookings()"
          >
            รอดำเนินการ
          </button>
          <button 
            :class="['filter-tab', { active: filterStatus === 'confirmed' }]"
            @click="filterStatus = 'confirmed'; filterBookings()"
          >
            ยืนยันแล้ว
          </button>
          <button 
            :class="['filter-tab', { active: filterStatus === 'completed' }]"
            @click="filterStatus = 'completed'; filterBookings()"
          >
            เสร็จสิ้น
          </button>
          <button 
            :class="['filter-tab', { active: filterStatus === 'cancelled' }]"
            @click="filterStatus = 'cancelled'; filterBookings()"
          >
            ยกเลิก
          </button>
        </div>

        <!-- Summary Stats -->
        <div class="summary-stats" v-if="historyList.length > 0">
          <div class="stat-item">
            <span class="stat-label">จองทั้งหมด</span>
            <span class="stat-value">{{ historyList.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">คะแนนที่ได้</span>
            <span class="stat-value points">+{{ totalPointsEarned.toLocaleString() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">คะแนนที่ใช้</span>
            <span class="stat-value used">-{{ totalPointsUsed.toLocaleString() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">ยอดใช้จ่ายรวม</span>
            <span class="stat-value">฿{{ totalSpent.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredList.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-title">ไม่พบข้อมูล</p>
          <p class="empty-desc" v-if="filterStatus">
            ไม่มีรายการที่มีสถานะ "{{ getStatusText(filterStatus) }}"
          </p>
          <p class="empty-desc" v-else>
            คุณยังไม่มีประวัติการจอง
          </p>
          <button @click="router.push('/booking')" class="btn-primary">
            จองบริการเลย
          </button>
        </div>

        <!-- History List -->
        <div v-else class="history-list">
          <div 
            v-for="item in filteredList" 
            :key="item.id"
            class="booking-card"
          >
            <!-- Card Header -->
            <div class="card-header">
              <div class="booking-meta">
                <div class="booking-id-wrapper">
                  <span class="booking-id">#{{ item.id }}</span>
                  <span class="receipt-number" v-if="item.receiptNumber">
                    {{ item.receiptNumber }}
                  </span>
                </div>
                <div class="booking-date">
                  <span class="icon">📅</span>
                  <span>{{ item.date }}</span>
                </div>
              </div>
              <span class="status-badge" :class="item.status">
                {{ getStatusText(item.status) }}
              </span>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <!-- Vehicle & Service Info -->
              <div class="service-info">
                <div class="info-row">
                  <span class="label">
                    <span class="icon">🚗</span>
                    ประเภทรถ
                  </span>
                  <span class="value">{{ item.carType }}</span>
                </div>
                <div class="info-row">
                  <span class="label">
                    <span class="icon">🛠️</span>
                    บริการ
                  </span>
                  <span class="value">{{ item.services.join(', ') }}</span>
                </div>
                <div class="info-row" v-if="item.duration">
                  <span class="label">
                    <span class="icon">⏱️</span>
                    ระยะเวลา
                  </span>
                  <span class="value">{{ item.duration }} นาที</span>
                </div>
              </div>

              <div class="divider"></div>

              <!-- Pricing Breakdown -->
              <div class="pricing-info">
                <!-- Subtotal -->
                <div class="price-row" v-if="item.subtotal && item.subtotal !== item.total">
                  <span class="label">ยอดรวม</span>
                  <span class="value">฿{{ item.subtotal?.toLocaleString() }}</span>
                </div>

                <!-- Membership Discount -->
                <div class="price-row discount-row" v-if="item.membership_discount > 0">
                  <span class="label">
                    <span class="icon">💎</span>
                    ส่วนลดสมาชิก
                  </span>
                  <span class="value discount">-฿{{ item.membership_discount?.toLocaleString() }}</span>
                </div>

                <!-- Points Used -->
                <div class="price-row points-row" v-if="item.points_used > 0">
                  <span class="label">
                    <span class="icon">⭐</span>
                    ใช้คะแนน ({{ item.points_used }} pts)
                  </span>
                  <span class="value points-used">-฿{{ (item.points_used * 0.1).toLocaleString() }}</span>
                </div>

                <!-- Payment Method -->
                <div class="price-row" v-if="item.paymentMethod">
                  <span class="label">
                    <span class="icon">💳</span>
                    ชำระด้วย
                  </span>
                  <span class="value">{{ getPaymentMethodText(item.paymentMethod) }}</span>
                </div>

                <!-- Final Amount -->
                <div class="price-row total-row">
                  <span class="label total-label">
                    <strong>ยอดที่ชำระ</strong>
                  </span>
                  <span class="value total-value">
                    <strong>฿{{ (item.final_amount || item.total)?.toLocaleString() }}</strong>
                  </span>
                </div>

                <!-- Points Earned -->
                <div class="points-earned-banner" v-if="item.points_earned > 0 && item.status === 'completed'">
                  <span class="icon">🎉</span>
                  <span class="text">คุณได้รับ <strong>+{{ item.points_earned }} คะแนน</strong> จากการจองนี้!</span>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="card-actions">
              <button class="btn-action btn-view" @click="viewDetail(item)">
                <span class="icon">👁️</span>
                <span>ดูรายละเอียด</span>
              </button>
              
              <button 
                v-if="item.status === 'pending'" 
                class="btn-action btn-cancel"
                @click="cancelBooking(item)"
              >
                <span class="icon">✕</span>
                <span>ยกเลิก</span>
              </button>
              
              <button 
                v-if="item.status === 'completed'" 
                class="btn-action btn-rebook"
                @click="rebook(item)"
              >
                <span class="icon">🔄</span>
                <span>จองอีกครั้ง</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const router = useRouter();

// ========================================
// STATE
// ========================================
const historyList = ref<any[]>([]);
const filteredList = ref<any[]>([]);
const filterStatus = ref('');
const isLoading = ref(false);

// ========================================
// COMPUTED
// ========================================
const totalPointsEarned = computed(() => {
  return historyList.value
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.points_earned || 0), 0);
});

const totalPointsUsed = computed(() => {
  return historyList.value
    .reduce((sum, b) => sum + (b.points_used || 0), 0);
});

const totalSpent = computed(() => {
  return historyList.value
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.final_amount || b.total || 0), 0);
});

// ========================================
// METHODS
// ========================================
const loadHistory = async () => {
  isLoading.value = true;

  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    console.log('📥 Loading history for customer:', user.id);

    const response = await axios.get(`http://localhost:3000/api/booking/history/${user.id}`);

    if (response.data.success) {
      historyList.value = response.data.bookings.map((booking: any) => {
        // แยก services จาก receipt_description
        const servicesMatch = booking.receipt_description?.match(/บริการ: (.+)/);
        const servicesArray = servicesMatch ? servicesMatch[1].split(', ') : [];
        
        // แยก vehicle_type จาก receipt_description
        const vehicleMatch = booking.receipt_description?.match(/(.+) \|/);
        const vehicleType = vehicleMatch 
          ? vehicleMatch[1].replace('จองบริการล้างรถ - ', '') 
          : '-';

        return {
          id: booking.booking_ID,
          date: formatDateTime(booking.booking_date),
          carType: vehicleType,
          services: servicesArray,
          duration: booking.duration || 0,
          
          // Pricing
          subtotal: parseFloat(booking.subtotal) || 0,
          total: parseFloat(booking.payment_amount) || 0,
          final_amount: parseFloat(booking.final_amount) || parseFloat(booking.payment_amount) || 0,
          
          // Membership
          membership_discount: parseFloat(booking.membership_discount) || 0,
          points_earned: parseInt(booking.points_earned) || 0,
          points_used: parseInt(booking.points_used) || 0,
          
          // Other
          paymentMethod: booking.payment_method,
          status: booking.booking_status,
          receiptNumber: booking.receipt_number
        };
      });

      filteredList.value = historyList.value;
      
      console.log('✅ Loaded', historyList.value.length, 'bookings');
      console.log('💰 Total Points Earned:', totalPointsEarned.value);
      console.log('⭐ Total Points Used:', totalPointsUsed.value);
    }

  } catch (error) {
    console.error('❌ Load History Error:', error);
    
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถโหลดประวัติได้',
      icon: 'error',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
  } finally {
    isLoading.value = false;
  }
};

const filterBookings = () => {
  if (!filterStatus.value) {
    filteredList.value = historyList.value;
  } else {
    filteredList.value = historyList.value.filter(b => b.status === filterStatus.value);
  }
  
  console.log('🔍 Filtered:', filteredList.value.length, 'bookings');
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'รอดำเนินการ',
    confirmed: 'ยืนยันแล้ว',
    in_progress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิกแล้ว'
  };
  return statusMap[status] || status;
};

const getPaymentMethodText = (method: string) => {
  const methodMap: Record<string, string> = {
    cash: '💵 เงินสด',
    card: '💳 บัตร',
    qr: '📱 QR Code'
  };
  return methodMap[method] || method;
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-';
  
  return new Date(dateStr).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const viewDetail = (item: any) => {
  const detailHTML = `
    <div style="text-align: left; padding: 1.5rem;">
      <div style="margin-bottom: 1.5rem;">
        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 0.5rem;">รหัสการจอง</p>
        <p style="font-size: 1.3rem; font-weight: 700; color: #dc2626;">#${item.id}</p>
      </div>
      
      ${item.receiptNumber ? `
      <div style="margin-bottom: 1.5rem;">
        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 0.5rem;">เลขที่ใบเสร็จ</p>
        <p style="font-size: 1.1rem; font-weight: 600; color: #fbbf24;">${item.receiptNumber}</p>
      </div>
      ` : ''}
      
      <div style="margin-bottom: 1rem;">
        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 0.5rem;">วันที่จอง</p>
        <p style="font-weight: 600;">${item.date}</p>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 0.5rem;">ประเภทรถ</p>
        <p style="font-weight: 600;">${item.carType}</p>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 0.5rem;">บริการ</p>
        <p style="font-weight: 600;">${item.services.join(', ')}</p>
      </div>
      
      ${item.duration ? `
      <div style="margin-bottom: 1rem;">
        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 0.5rem;">ระยะเวลา</p>
        <p style="font-weight: 600;">${item.duration} นาที</p>
      </div>
      ` : ''}
      
      <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid rgba(255,255,255,0.1);">
        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 1rem;">รายละเอียดราคา</p>
        
        ${item.subtotal && item.subtotal !== item.total ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>ยอดรวม</span>
          <span>฿${item.subtotal?.toLocaleString()}</span>
        </div>
        ` : ''}
        
        ${item.membership_discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #fbbf24;">
          <span style="display: flex; align-items: center; gap: 0.5rem;">
            <span>💎</span>
            <span>ส่วนลดสมาชิก</span>
          </span>
          <span style="font-weight: 700;">-฿${item.membership_discount?.toLocaleString()}</span>
        </div>
        ` : ''}
        
        ${item.points_used > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #f59e0b;">
          <span style="display: flex; align-items: center; gap: 0.5rem;">
            <span>⭐</span>
            <span>ใช้คะแนน (${item.points_used} pts)</span>
          </span>
          <span style="font-weight: 700;">-฿${(item.points_used * 0.1)?.toLocaleString()}</span>
        </div>
        ` : ''}
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid rgba(220, 38, 38, 0.3);">
          <span style="font-size: 1.1rem; font-weight: 700;">ยอดชำระ</span>
          <span style="font-size: 1.5rem; font-weight: 900; color: #10b981;">฿${(item.final_amount || item.total)?.toLocaleString()}</span>
        </div>
        
        ${item.points_earned > 0 && item.status === 'completed' ? `
        <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); border-radius: 10px; text-align: center;">
          <p style="font-size: 1rem; color: #10b981; font-weight: 700;">
            🎉 คุณได้รับ +${item.points_earned} คะแนน
          </p>
        </div>
        ` : ''}
      </div>
      
      <div style="margin-top: 1.5rem;">
        <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 0.5rem;">สถานะ</p>
        <p style="font-size: 1.1rem; font-weight: 700; color: ${getStatusColor(item.status)};">
          ${getStatusText(item.status)}
        </p>
      </div>
    </div>
  `;

  Swal.fire({
    title: 'รายละเอียดการจอง',
    html: detailHTML,
    confirmButtonText: 'ปิด',
    confirmButtonColor: '#dc2626',
    width: '600px',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    customClass: {
      popup: 'detail-popup'
    }
  });
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: '#fbbf24',
    confirmed: '#3b82f6',
    in_progress: '#a855f7',
    completed: '#10b981',
    cancelled: '#ef4444'
  };
  return colorMap[status] || '#9ca3af';
};

const cancelBooking = async (item: any) => {
  const result = await Swal.fire({
    title: 'ยืนยันการยกเลิก?',
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p style="margin-bottom: 0.5rem;">ต้องการยกเลิกการจอง</p>
        <p style="font-size: 1.3rem; font-weight: 700; color: #dc2626; margin-bottom: 1rem;">#${item.id}</p>
        ${item.points_earned > 0 ? `
          <p style="color: #f59e0b; font-size: 0.9rem;">
            ⚠️ คะแนน ${item.points_earned} points จะไม่ได้รับถ้ายกเลิก
          </p>
        ` : ''}
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยืนยันยกเลิก',
    cancelButtonText: 'ย้อนกลับ',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.put(`http://localhost:3000/api/booking/cancel/${item.id}`);
      
      if (response.data.success) {
        await Swal.fire({
          title: 'ยกเลิกสำเร็จ',
          icon: 'success',
          confirmButtonColor: '#dc2626',
          timer: 2000,
          background: 'rgba(30, 30, 30, 0.98)',
          color: '#ffffff'
        });

        loadHistory();
      }

    } catch (error) {
      console.error('❌ Cancel Error:', error);
      
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถยกเลิกการจองได้',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      });
    }
  }
};

const rebook = (item: any) => {
  Swal.fire({
    title: 'จองอีกครั้ง?',
    text: 'ต้องการจองบริการแบบเดียวกันอีกครั้งหรือไม่?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ใช่ ไปจองเลย',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/booking');
    }
  });
};

// ========================================
// LIFECYCLE
// ========================================
onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.history-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* ========================================
   MAIN SECTION
======================================== */
.main {
  margin-top: 80px;
  padding: 3rem 2rem;
  min-height: calc(100vh - 80px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* ========================================
   PAGE HEADER
======================================== */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

/* ========================================
   FILTER TABS
======================================== */
.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
}

.filter-tab {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  font-family: inherit;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.filter-tab.active {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  color: #fff;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
}

/* ========================================
   SUMMARY STATS
======================================== */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  transition: all 0.3s;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
  transform: translateY(-3px);
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
}

.stat-value.points {
  color: #10b981;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.stat-value.used {
  color: #ef4444;
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

/* ========================================
   LOADING STATE
======================================== */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ========================================
   EMPTY STATE
======================================== */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.empty-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2rem;
}

.btn-primary {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
}

/* ========================================
   HISTORY LIST
======================================== */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ========================================
   BOOKING CARD
======================================== */
.booking-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s;
}

.booking-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.booking-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.booking-id-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.booking-id {
  font-size: 1.3rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
}

.receipt-number {
  padding: 0.25rem 0.75rem;
  background: rgba(251, 191, 36, 0.2);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fbbf24;
}

.booking-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.booking-date .icon {
  font-size: 1.1rem;
}

/* Status Badge */
.status-badge {
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.4);
}

.status-badge.confirmed {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.4);
}

.status-badge.in_progress {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border-color: rgba(168, 85, 247, 0.4);
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.4);
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
}

/* Card Body */
.card-body {
  padding: 2rem;
}

/* Service Info */
.service-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.info-row .label .icon {
  font-size: 1.1rem;
}

.info-row .value {
  font-size: 0.95rem;
  color: #fff;
  font-weight: 600;
  text-align: right;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 1.5rem 0;
}

/* Pricing Info */
.pricing-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

.price-row .label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.price-row .label .icon {
  font-size: 1.1rem;
}

.price-row .value {
  font-weight: 600;
  color: #fff;
}

/* Discount Row */
.discount-row .value.discount {
  color: #fbbf24;
  font-weight: 700;
}

/* Points Row */
.points-row .value.points-used {
  color: #f59e0b;
  font-weight: 700;
}

/* Total Row */
.total-row {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
}

.total-row .total-label {
  font-size: 1.1rem;
  color: #fff;
}

.total-row .total-value {
  font-size: 1.8rem;
  color: #10b981;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

/* Points Earned Banner */
.points-earned-banner {
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  border: 2px solid rgba(16, 185, 129, 0.4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.points-earned-banner .icon {
  font-size: 1.5rem;
}

.points-earned-banner .text {
  font-size: 1rem;
  color: #10b981;
  font-weight: 600;
}

.points-earned-banner strong {
  color: #fff;
  font-weight: 900;
  font-size: 1.1rem;
}

/* ========================================
   CARD ACTIONS
======================================== */
.card-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid;
  font-family: inherit;
}

.btn-view {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.btn-view:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(59, 130, 246, 0.3);
}

.btn-cancel {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn-cancel:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.3);
}

.btn-rebook {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.btn-rebook:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.3);
}

.btn-action .icon {
  font-size: 1.1rem;
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1024px) {
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .filter-tabs {
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .filter-tab {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }

  .summary-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-item {
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem 1.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .card-body {
    padding: 1.5rem;
  }

  .card-actions {
    flex-direction: column;
    padding: 1rem 1.5rem;
  }

  .btn-action {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 2rem 1rem;
  }

  .page-header h1 {    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .filter-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .filter-tab {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .booking-id {
    font-size: 1.1rem;
  }

  .booking-date {
    font-size: 0.85rem;
  }

  .status-badge {
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
  }

  .info-row .label,
  .info-row .value {
    font-size: 0.85rem;
  }

  .price-row {
    font-size: 0.9rem;
  }

  .total-row .total-label {
    font-size: 1rem;
  }

  .total-row .total-value {
    font-size: 1.5rem;
  }

  .points-earned-banner {
    padding: 0.75rem 1rem;
  }

  .points-earned-banner .icon {
    font-size: 1.2rem;
  }

  .points-earned-banner .text {
    font-size: 0.9rem;
  }

  .points-earned-banner strong {
    font-size: 1rem;
  }
}

/* ========================================
   CUSTOM SCROLLBAR
======================================== */
.filter-tabs::-webkit-scrollbar {
  height: 6px;
}

.filter-tabs::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.filter-tabs::-webkit-scrollbar-thumb {
  background: rgba(220, 38, 38, 0.5);
  border-radius: 10px;
}

.filter-tabs::-webkit-scrollbar-thumb:hover {
  background: #dc2626;
}

/* ========================================
   SWAL CUSTOM CLASS
======================================== */
:global(.detail-popup) {
  border: 2px solid rgba(220, 38, 38, 0.3) !important;
  border-radius: 20px !important;
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

.booking-card {
  animation: fadeIn 0.4s ease-out;
}

.booking-card:nth-child(1) { animation-delay: 0s; }
.booking-card:nth-child(2) { animation-delay: 0.1s; }
.booking-card:nth-child(3) { animation-delay: 0.2s; }
.booking-card:nth-child(4) { animation-delay: 0.3s; }
.booking-card:nth-child(5) { animation-delay: 0.4s; }

/* ========================================
   PRINT STYLES
======================================== */
@media print {
  .filter-tabs,
  .card-actions,
  .empty-state button {
    display: none !important;
  }

  .booking-card {
    page-break-inside: avoid;
    border: 1px solid #000;
    margin-bottom: 2rem;
  }

  .card-header,
  .card-body {
    background: #fff !important;
    color: #000 !important;
  }

  .status-badge,
  .price-row .value,
  .info-row .value {
    color: #000 !important;
  }
}
</style>
