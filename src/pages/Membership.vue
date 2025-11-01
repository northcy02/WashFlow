<!-- src/pages/Membership.vue -->
<template>
  <div class="membership-page">
    <Navigator />

    <section class="main">
      <div class="container">
        <h1>💎 สมาชิกของฉัน</h1>

        <!-- Membership Card -->
        <div class="membership-card" v-if="membershipData" :style="{ background: getTierGradient }">
          <div class="card-header">
            <div class="tier-icon">{{ membershipData.tier_icon }}</div>
            <div class="tier-info">
              <h2>{{ membershipData.tier_name }} Member</h2>
              <p>{{ membershipData.cust_fname }} {{ membershipData.cust_lname }}</p>
            </div>
          </div>

          <div class="card-body">
            <div class="stat">
              <span class="label">Available Points</span>
              <span class="value">{{ membershipData.available_points?.toLocaleString() }}</span>
            </div>
            <div class="stat">
              <span class="label">Total Spent</span>
              <span class="value">฿{{ membershipData.total_spent?.toLocaleString() }}</span>
            </div>
            <div class="stat">
              <span class="label">Discount</span>
              <span class="value">{{ membershipData.discount_percent }}%</span>
            </div>
          </div>

          <!-- Progress to Next Tier -->
          <div class="tier-progress" v-if="membershipData.next_tier_name">
            <p class="progress-label">
              {{ membershipData.points_progress.remaining.toLocaleString() }} points to {{ membershipData.next_tier_name }}
            </p>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: membershipData.points_progress.percentage + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div class="benefits-section" v-if="membershipData?.benefits">
          <h3>🎁 สิทธิประโยชน์</h3>
          <div class="benefits-list">
            <div v-for="(benefit, index) in membershipData.benefits" :key="index" class="benefit-item">
              <span class="icon">✓</span>
              <span>{{ benefit }}</span>
            </div>
          </div>
        </div>

        <!-- Point History -->
        <div class="history-section">
          <h3>📜 ประวัติ Points</h3>
          <div class="history-list">
            <div v-for="tx in pointHistory" :key="tx.transaction_ID" class="history-item">
              <div class="tx-info">
                <span class="tx-type" :class="tx.transaction_type">{{ tx.transaction_type }}</span>
                <span class="tx-desc">{{ tx.description }}</span>
              </div>
              <div class="tx-points" :class="{ positive: tx.points > 0, negative: tx.points < 0 }">
                {{ tx.points > 0 ? '+' : '' }}{{ tx.points }}
              </div>
            </div>
          </div>
        </div>

        <!-- All Tiers -->
        <div class="tiers-section">
          <h3>🏆 ระดับสมาชิกทั้งหมด</h3>
          <div class="tiers-grid">
            <div v-for="tier in allTiers" :key="tier.tier_ID" class="tier-card">
              <div class="tier-icon-large">{{ tier.tier_icon }}</div>
              <h4>{{ tier.tier_name }}</h4>
              <p class="tier-requirement">{{ tier.min_points }} Points</p>
              <div class="tier-benefits">
                <p v-for="(benefit, idx) in tier.benefits" :key="idx">✓ {{ benefit }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Navigator from '@/components/Navigator.vue';

const membershipData = ref<any>(null);
const pointHistory = ref<any[]>([]);
const allTiers = ref<any[]>([]);

const getTierGradient = computed(() => {
  if (!membershipData.value) return '';
  const color = membershipData.value.tier_color;
  return `linear-gradient(135deg, ${color}dd 0%, ${color}66 100%)`;
});

const loadMembershipInfo = async () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    const response = await axios.get(`http://localhost:3000/api/membership/info/${user.id}`);
    
    if (response.data.success) {
      membershipData.value = response.data.membership;
    }
  } catch (error) {
    console.error('Error loading membership:', error);
  }
};

const loadPointHistory = async () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    const response = await axios.get(`http://localhost:3000/api/membership/points/${user.id}`);
    
    if (response.data.success) {
      pointHistory.value = response.data.transactions;
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
};

const loadAllTiers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/membership/tiers');
    if (response.data.success) {
      allTiers.value = response.data.tiers;
    }
  } catch (error) {
    console.error('Error loading tiers:', error);
  }
};

onMounted(() => {
  loadMembershipInfo();
  loadPointHistory();
  loadAllTiers();
});
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.membership-page {
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
  max-width: 1200px;
  margin: 0 auto;
}

.container > h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ========================================
   MEMBERSHIP CARD
======================================== */
.membership-card {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 20px 60px rgba(220, 38, 38, 0.4);
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.membership-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, -20px) rotate(45deg); }
}

.membership-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 80px rgba(220, 38, 38, 0.6);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.tier-icon {
  font-size: 5rem;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.tier-info h2 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.tier-info p {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 500;
}

.card-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.stat {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.stat:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

.stat .label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.stat .value {
  display: block;
  font-size: 2rem;
  font-weight: 900;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

/* ========================================
   TIER PROGRESS
======================================== */
.tier-progress {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.progress-label {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  opacity: 0.9;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 10px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  animation: progressShine 2s infinite;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ========================================
   BENEFITS SECTION
======================================== */
.benefits-section {
  margin-bottom: 3rem;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.benefits-section h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.benefits-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.benefit-item:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
  transform: translateX(5px);
}

.benefit-item .icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  flex-shrink: 0;
}

.benefit-item span:last-child {
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

/* ========================================
   HISTORY SECTION
======================================== */
.history-section {
  margin-bottom: 3rem;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.history-section h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Custom Scrollbar */
.history-list::-webkit-scrollbar {
  width: 8px;
}

.history-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(220, 38, 38, 0.5);
  border-radius: 10px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: #dc2626;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(220, 38, 38, 0.3);
  transform: translateX(5px);
}

.tx-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.tx-type {
  display: inline-block;
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.tx-type.earn {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.tx-type.redeem {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.tx-type.bonus {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.4);
}

.tx-type.expire {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
  border: 1px solid rgba(107, 114, 128, 0.4);
}

.tx-type.adjust {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.tx-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.tx-points {
  font-size: 1.8rem;
  font-weight: 900;
  min-width: 100px;
  text-align: right;
}

.tx-points.positive {
  color: #10b981;
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
}

.tx-points.negative {
  color: #ef4444;
  text-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
}

/* ========================================
   TIERS SECTION
======================================== */
.tiers-section {
  margin-bottom: 3rem;
}

.tiers-section h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.tiers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.tier-card {
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.tier-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.tier-card:hover {
  transform: translateY(-10px);
  border-color: rgba(220, 38, 38, 0.5);
  box-shadow: 0 20px 50px rgba(220, 38, 38, 0.3);
}

.tier-card:hover::before {
  opacity: 1;
}

.tier-icon-large {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
  animation: float 3s ease-in-out infinite;
}

.tier-card h4 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #fff;
}

.tier-requirement {
  font-size: 1rem;
  color: #fbbf24;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 20px;
  display: inline-block;
}

.tier-benefits {
  text-align: left;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tier-benefits p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
  line-height: 1.6;
  transition: all 0.2s;
}

.tier-benefits p:hover {
  color: rgba(255, 255, 255, 0.95);
  padding-left: 1rem;
}

/* ========================================
   EMPTY STATE
======================================== */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.empty-state .icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ========================================
   LOADING STATE
======================================== */
.loading {
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

.loading p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1024px) {
  .tiers-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-body {
    grid-template-columns: repeat(2, 1fr);
  }

  .benefits-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main {
    padding: 2rem 1rem;
  }

  .container > h1 {
    font-size: 2rem;
  }

  .membership-card {
    padding: 2rem 1.5rem;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
  }

  .tier-icon {
    font-size: 4rem;
    width: 80px;
    height: 80px;
  }

  .tier-info h2 {
    font-size: 2rem;
  }

  .card-body {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat .value {
    font-size: 1.5rem;
  }

  .benefits-section,
  .history-section,
  .tiers-section {
    padding: 2rem 1.5rem;
  }

  .benefits-section h3,
  .history-section h3,
  .tiers-section h3 {
    font-size: 1.5rem;
  }

  .tiers-grid {
    grid-template-columns: 1fr;
  }

  .history-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .tx-points {
    min-width: auto;
    text-align: left;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .membership-card {
    padding: 1.5rem 1rem;
  }

  .tier-icon {
    font-size: 3rem;
    width: 70px;
    height: 70px;
  }

  .tier-info h2 {
    font-size: 1.5rem;
  }

  .tier-info p {
    font-size: 1rem;
  }

  .stat .label {
    font-size: 0.8rem;
  }

  .stat .value {
    font-size: 1.3rem;
  }

  .benefit-item {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .benefit-item .icon {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .history-item {
    padding: 1rem;
  }

  .tx-type {
    font-size: 0.7rem;
    padding: 0.3rem 0.8rem;
  }

  .tx-desc {
    font-size: 0.9rem;
  }

  .tier-card {
    padding: 1.5rem 1rem;
  }

  .tier-icon-large {
    font-size: 3rem;
  }

  .tier-card h4 {
    font-size: 1.2rem;
  }

  .tier-benefits p {
    font-size: 0.85rem;
  }
}

/* ========================================
   ANIMATIONS
======================================== */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
