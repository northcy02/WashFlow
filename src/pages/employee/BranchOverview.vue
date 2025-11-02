<!-- src/pages/employee/BranchOverview.vue (สร้างหน้าใหม่) -->

<template>
  <div class="branch-overview-page">
    <header class="page-header">
      <div class="container">
        <h1>🏢 ภาพรวมสาขา</h1>
        <p>สถิติและข้อมูลแต่ละสาขา</p>
      </div>
    </header>

    <section class="branches-section">
      <div class="container">
        <div class="branches-grid">
          <div v-for="branch in branches" :key="branch.branch_ID" class="branch-card">
            <div class="card-header">
              <h3>{{ branch.branch_name }}</h3>
              <span class="status-badge" :class="{ active: branch.is_active }">
                {{ branch.is_active ? 'เปิดให้บริการ' : 'ปิดให้บริการ' }}
              </span>
            </div>

            <div class="card-body">
              <div class="stats-row">
                <div class="stat">
                  <span class="icon">👥</span>
                  <div>
                    <h4>{{ branch.total_employees || 0 }}</h4>
                    <p>พนักงาน</p>
                  </div>
                </div>
                <div class="stat">
                  <span class="icon">📋</span>
                  <div>
                    <h4>{{ branch.total_bookings || 0 }}</h4>
                    <p>การจอง</p>
                  </div>
                </div>
                <div class="stat">
                  <span class="icon">💰</span>
                  <div>
                    <h4>฿{{ (branch.total_revenue || 0).toLocaleString() }}</h4>
                    <p>รายได้</p>
                  </div>
                </div>
              </div>

              <div class="location-info">
                <p>📍 {{ branch.branch_address }}</p>
                <p>📞 {{ branch.branch_tel || '-' }}</p>
              </div>
            </div>

            <div class="card-actions">
              <button @click="viewBranch(branch.branch_ID)" class="btn-view">
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const branches = ref<any[]>([]);

const loadBranches = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/branch/with-stats');
    if (response.data.success) {
      branches.value = response.data.branches;
    }
  } catch (error) {
    console.error('Error loading branches:', error);
  }
};

const viewBranch = (branchId: number) => {
  router.push(`/employee/branch/${branchId}`);
};

onMounted(() => {
  loadBranches();
});
</script>
