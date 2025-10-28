<template>
  <div class="history-page">
    <Navigator />

    <section class="main">
      <div class="container">
        <h1>ประวัติการจอง</h1>

        <!-- Empty State -->
        <div v-if="historyList.length === 0" class="empty">
          <div class="icon">📋</div>
          <p>ยังไม่มีประวัติการจอง</p>
          <button @click="router.push('/booking')" class="btn primary">
            จองบริการ
          </button>
        </div>

        <!-- History List -->
        <div v-else class="list">
          <div 
            v-for="item in historyList" 
            :key="item.id"
            class="card"
          >
            <!-- Header -->
            <div class="header">
              <div class="date">
                <span>📅</span>
                <span>{{ item.date }}</span>
              </div>
              <span class="status" :class="item.status">
                {{ getStatusText(item.status) }}
              </span>
            </div>

            <!-- Body -->
            <div class="body">
              <div class="info">
                <div class="row">
                  <span class="label">รหัส</span>
                  <span class="value">#{{ item.id }}</span>
                </div>
                <div class="row">
                  <span class="label">รถ</span>
                  <span class="value">{{ item.carType }}</span>
                </div>
                <div class="row">
                  <span class="label">บริการ</span>
                  <span class="value">{{ item.services.join(', ') }}</span>
                </div>
                <div class="row">
                  <span class="label">ราคา</span>
                  <span class="value price">฿{{ item.total }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="actions">
                <button class="btn" @click="viewDetail(item)">
                  ดูรายละเอียด
                </button>
                <button 
                  v-if="item.status === 'pending'" 
                  class="btn danger"
                  @click="cancelBooking(item)"
                >
                  ยกเลิก
                </button>
                <button 
                  v-if="item.status === 'completed'" 
                  class="btn primary"
                  @click="rebook(item)"
                >
                  จองอีกครั้ง
                </button>
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

const loadHistory = () => {
  const saved = localStorage.getItem('bookingHistory');
  if (saved) {
    historyList.value = JSON.parse(saved);
  }
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'รอดำเนินการ',
    completed: 'สำเร็จ',
    cancelled: 'ยกเลิกแล้ว'
  };
  return statusMap[status] || status;
};

const viewDetail = (item: any) => {
  Swal.fire({
    title: 'รายละเอียด',
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p style="margin: 0.5rem 0;"><strong>รหัส:</strong> #${item.id}</p>
        <p style="margin: 0.5rem 0;"><strong>วันที่:</strong> ${item.date}</p>
        <p style="margin: 0.5rem 0;"><strong>รถ:</strong> ${item.carType}</p>
        <p style="margin: 0.5rem 0;"><strong>บริการ:</strong> ${item.services.join(', ')}</p>
        <p style="margin: 0.5rem 0;"><strong>ราคา:</strong> ฿${item.total}</p>
        <p style="margin: 0.5rem 0;"><strong>สถานะ:</strong> ${getStatusText(item.status)}</p>
      </div>
    `,
    confirmButtonText: 'ปิด',
    confirmButtonColor: '#dc2626'
  });
};

const cancelBooking = (item: any) => {
  Swal.fire({
    title: 'ยกเลิกการจอง?',
    text: `ต้องการยกเลิกการจอง #${item.id}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ยกเลิก',
    cancelButtonText: 'ย้อนกลับ',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280'
  }).then((result) => {
    if (result.isConfirmed) {
      item.status = 'cancelled';
      localStorage.setItem('bookingHistory', JSON.stringify(historyList.value));
      
      Swal.fire({
        title: 'ยกเลิกสำเร็จ',
        icon: 'success',
        confirmButtonColor: '#dc2626'
      });
    }
  });
};

const rebook = (item: any) => {
  router.push({
    path: '/booking',
    query: { carType: item.carType }
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
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* Main */
.main {
  margin-top: 80px;
  padding: 4rem 2rem;
  min-height: calc(100vh - 80px);
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #dc2626;
}

/* Empty State */
.empty {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.empty .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
}

/* List */
.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
}

.status {
  padding: 0.3rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status.pending {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.status.completed {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status.cancelled {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* Body */
.body {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.row {
  display: flex;
  gap: 1rem;
}

.label {
  min-width: 70px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.value {
  color: #fff;
  font-weight: 500;
  font-size: 0.9rem;
}

.value.price {
  color: #dc2626;
  font-size: 1.2rem;
  font-weight: 700;
}

/* Actions */
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  font-family: inherit;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn.primary {
  background: #dc2626;
  border-color: #dc2626;
}

.btn.primary:hover {
  background: #b91c1c;
  border-color: #b91c1c;
  transform: translateY(-2px);
}

.btn.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn.danger:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: #fff;
}

/* Responsive */
@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .body {
    flex-direction: column;
  }

  .actions {
    flex-direction: row;
    width: 100%;
  }

  .btn {
    flex: 1;
  }

  .empty {
    padding: 3rem 1rem;
  }

  .empty .icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 3rem 1rem;
  }

  .card {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
