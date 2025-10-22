<template>
  <div class="history-page">
    <!-- Navigator Component -->
    <Navigator />

    <!-- History Content -->
    <section class="history-section">
      <div class="container">
        <h1 class="main-title">ประวัติการใช้งาน</h1>
        
        <div class="history-content">
          <!-- No History Message -->
          <div v-if="historyList.length === 0" class="no-history">
            <div class="no-history-icon">📋</div>
            <p>ยังไม่มีประวัติการใช้งาน</p>
            <router-link to="/booking">
              <button class="btn-book-now">จองบริการเลย</button>
            </router-link>
          </div>

          <!-- History List -->
          <div v-else class="history-list">
            <div 
              v-for="(item, index) in historyList" 
              :key="index"
              class="history-card"
            >
              <div class="history-header">
                <div class="history-date">
                  <span class="icon">📅</span>
                  <span>{{ item.date }}</span>
                </div>
                <div class="history-status" :class="item.status">
                  {{ item.statusText }}
                </div>
              </div>

              <div class="history-body">
                <div class="history-info">
                  <div class="info-row">
                    <span class="label">รหัสการจอง:</span>
                    <span class="value">#{{ item.id }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">ประเภทรถ:</span>
                    <span class="value">{{ item.carType }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">บริการ:</span>
                    <span class="value">{{ item.services.join(', ') }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">ราคา:</span>
                    <span class="value price">{{ item.price }} บาท</span>
                  </div>
                </div>

                <div class="history-actions">
                  <button class="btn-detail" @click="viewDetail(item)">
                    ดูรายละเอียด
                  </button>
                  <button 
                    v-if="item.status === 'completed'"
                    class="btn-rebook" 
                    @click="rebook(item)"
                  >
                    จองอีกครั้ง
                  </button>
                  <button 
                    v-if="item.status === 'pending'"
                    class="btn-cancel" 
                    @click="cancelBooking(item)"
                  >
                    ยกเลิกการจอง
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';

const router = useRouter();
const historyList = ref<any[]>([]);

// Load booking history from localStorage
const loadHistory = () => {
  const savedHistory = localStorage.getItem('bookingHistory');
  if (savedHistory) {
    historyList.value = JSON.parse(savedHistory);
  }
};

const viewDetail = (item: any) => {
  Swal.fire({
    title: 'รายละเอียดการจอง',
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p style="margin-bottom: 0.8rem;"><strong>รหัสการจอง:</strong> #${item.id}</p>
        <p style="margin-bottom: 0.8rem;"><strong>วันที่:</strong> ${item.date}</p>
        <p style="margin-bottom: 0.8rem;"><strong>ประเภทรถ:</strong> ${item.carType}</p>
        <p style="margin-bottom: 0.8rem;"><strong>บริการ:</strong> ${item.services.join(', ')}</p>
        <p style="margin-bottom: 0.8rem;"><strong>ราคารวม:</strong> ${item.price} บาท</p>
        <p style="margin-bottom: 0.8rem;"><strong>สถานะ:</strong> <span style="color: ${item.status === 'completed' ? '#10b981' : item.status === 'pending' ? '#f59e0b' : '#ef4444'}">${item.statusText}</span></p>
      </div>
    `,
    icon: 'info',
    iconColor: '#dc2626',
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'ปิด',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      confirmButton: 'custom-swal-confirm-big'
    },
    buttonsStyling: false
  });
};

const rebook = (item: any) => {
  router.push('/booking');
};

const cancelBooking = (item: any) => {
  Swal.fire({
    title: 'ยกเลิกการจอง',
    text: `คุณต้องการยกเลิกการจอง #${item.id} หรือไม่?`,
    icon: 'warning',
    iconColor: '#dc2626',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '<i class="fas fa-times-circle"></i> ยกเลิกการจอง',
    cancelButtonText: '<i class="fas fa-arrow-left"></i> ย้อนกลับ',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    customClass: {
      popup: 'custom-swal-popup',
      confirmButton: 'custom-swal-confirm-big',
      cancelButton: 'custom-swal-cancel-big'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      // Update status
      item.status = 'cancelled';
      item.statusText = 'ยกเลิกแล้ว';
      
      // Save to localStorage
      localStorage.setItem('bookingHistory', JSON.stringify(historyList.value));
      
      Swal.fire({
        title: 'ยกเลิกสำเร็จ!',
        text: 'การจองของคุณถูกยกเลิกแล้ว',
        icon: 'success',
        iconColor: '#10b981',
        confirmButtonColor: '#dc2626',
        confirmButtonText: '<i class="fas fa-check-circle"></i> ตกลง',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff',
        customClass: {
          popup: 'custom-swal-popup',
          confirmButton: 'custom-swal-confirm-big'
        },
        buttonsStyling: false
      });
    }
  });
};

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
  color: white;
  font-family: 'Rajdhani', 'Sarabun', sans-serif;
}

/* History Section */
.history-section {
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, #000 0%, #1a1a1a 100%);
}

.history-section .container {
  max-width: 1200px;
  margin: 0 auto;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 3rem;
  color: #dc2626;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 0 0 40px rgba(220, 38, 38, 0.8);
  position: relative;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
}

.history-content {
  min-height: 400px;
}

/* No History State */
.no-history {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 15px;
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 2rem;
}

.no-history-icon {
  font-size: 5rem;
  opacity: 0.5;
}

.no-history p {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
}

.btn-book-now {
  background: #dc2626;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-book-now:hover {
  background: #b91c1c;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.5);
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(220, 38, 38, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.history-card:hover {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.history-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.history-date .icon {
  font-size: 1.3rem;
}

.history-status {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-status.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid #10b981;
}

.history-status.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.history-status.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid #fbbf24;
}

.history-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-row {
  display: flex;
  gap: 1rem;
}

.info-row .label {
  color: rgba(255, 255, 255, 0.6);
  min-width: 100px;
}

.info-row .value {
  color: white;
  font-weight: 600;
}

.info-row .value.price {
  color: #dc2626;
  font-size: 1.2rem;
}

.history-actions {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}

.btn-detail, .btn-rebook, .btn-cancel {
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  white-space: nowrap;
}

.btn-detail {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-detail:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
}

.btn-rebook {
  background: #dc2626;
  color: white;
}

.btn-rebook:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 38, 38, 0.4);
}

/* ปุ่มยกเลิก - ขนาดใหญ่ขึ้น */
.btn-cancel {
  background: #ef4444;
  color: white;
  padding: 0.6rem 1.7rem;
  font-size: 1.0rem;
  font-weight: 600;
  border-radius: 7px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-cancel:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(239, 68, 68, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }

  .history-body {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-actions {
    flex-direction: row;
    width: 100%;
  }

  .btn-detail, .btn-rebook, .btn-cancel {
    flex: 1;
  }

  .no-history {
    padding: 3rem 1.5rem;
  }

  .no-history-icon {
    font-size: 3rem;
  }

  .no-history p {
    font-size: 1.2rem;
  }
}
</style>

<!-- SweetAlert2 Custom Styles -->
<style>
/* Big Buttons for SweetAlert */
.custom-swal-confirm-big,
.custom-swal-cancel-big {
  font-family: 'Rajdhani', 'Sarabun', sans-serif !important;
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  padding: 1.2rem 3rem !important;
  border-radius: 10px !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  transition: all 0.3s !important;
  border: 2px solid !important;
  min-width: 200px !important;
}

.custom-swal-confirm-big {
  background: #dc2626 !important;
  color: white !important;
  border-color: #dc2626 !important;
}

.custom-swal-confirm-big:hover {
  background: #b91c1c !important;
  border-color: #b91c1c !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4) !important;
}

.custom-swal-cancel-big {
  background: transparent !important;
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.custom-swal-cancel-big:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
  transform: translateY(-2px) !important;
}

/* Custom SweetAlert2 Styles */
.custom-swal-popup {
  border-radius: 20px !important;
  border: 2px solid rgba(220, 38, 38, 0.3) !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
  padding: 2rem !important;
}

.custom-swal-title {
  font-family: 'Rajdhani', 'Sarabun', sans-serif !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 1rem !important;
}
</style>