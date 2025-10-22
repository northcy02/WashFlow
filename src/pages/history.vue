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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';

const router = useRouter();

// Sample History Data
const historyList = ref([
  {
    id: 1,
    date: '15 ธันวาคม 2567',
    carType: 'รถเก๋ง',
    services: ['ล้างรถ', 'ขัดสี'],
    price: 1200,
    status: 'completed',
    statusText: 'เสร็จสิ้น'
  },
  {
    id: 2,
    date: '10 ธันวาคม 2567',
    carType: 'รถกระบะ',
    services: ['เคลือบแก้ว', 'ดูดฝุ่น'],
    price: 950,
    status: 'completed',
    statusText: 'เสร็จสิ้น'
  },
  {
    id: 3,
    date: '5 ธันวาคม 2567',
    carType: 'รถเก๋ง',
    services: ['ล้างรถ'],
    price: 200,
    status: 'cancelled',
    statusText: 'ยกเลิก'
  }
]);

const viewDetail = (item: any) => {
  console.log('View detail:', item);
  alert(`รายละเอียดการจอง\n\nวันที่: ${item.date}\nรถ: ${item.carType}\nบริการ: ${item.services.join(', ')}\nราคา: ${item.price} บาท`);
};

const rebook = (item: any) => {
  console.log('Rebook:', item);
  router.push('/booking');
};
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

.btn-detail, .btn-rebook {
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

  .btn-detail, .btn-rebook {
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