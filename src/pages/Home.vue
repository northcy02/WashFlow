<!-- src/pages/Home.vue -->
<template>
  <div class="home-page">
    <!-- Navigator Component -->
    <Navigator />

    <!-- ✅ Customer Home (ถ้า Login แล้ว) -->
    <div v-if="isCustomer" class="customer-section">
      <!-- Welcome Hero -->
      <section class="welcome-hero">
        <div class="container">
          <div class="welcome-content">
            <h1>Welcome, <span class="user-name">{{ userName }}</span>! </h1>
            <p class="welcome-subtitle">ยินดีต้อนรับกลับสู่ระบบจองล้างรรถ CYBERCAR</p>
          </div>
          
          <!-- Quick Stats -->
          <div class="quick-stats">
            <div class="stat-box">
              <span class="stat-icon">📋</span>
              <div class="stat-info">
                <h3>{{ userStats.total || 0 }}</h3>
                <p>จองทั้งหมด</p>
              </div>
            </div>
            <div class="stat-box">
              <span class="stat-icon">⏳</span>
              <div class="stat-info">
                <h3>{{ userStats.pending || 0 }}</h3>
                <p>รอดำเนินการ</p>
              </div>
            </div>
            <div class="stat-box">
              <span class="stat-icon">✅</span>
              <div class="stat-info">
                <h3>{{ userStats.completed || 0 }}</h3>
                <p>สำเร็จแล้ว</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions-section">
        <div class="container">
          <h2 class="section-title">
            <span class="icon">⚡</span>
            การดำเนินการด่วน
          </h2>
          <div class="actions-grid">
            <router-link to="/booking" class="action-card primary">
              <div class="action-icon">📅</div>
              <h3>จองบริการ</h3>
              <p>จองล้างรถเลย</p>
              <span class="action-arrow">→</span>
            </router-link>

            <router-link to="/history" class="action-card">
              <div class="action-icon">📜</div>
              <h3>ประวัติการจอง</h3>
              <p>ดูรายการทั้งหมด</p>
              <span class="action-arrow">→</span>
            </router-link>

            <router-link to="/services" class="action-card">
              <div class="action-icon">🚗</div>
              <h3>บริการของเรา</h3>
              <p>ดูบริการทั้งหมด</p>
              <span class="action-arrow">→</span>
            </router-link>

            <router-link to="/profile" class="action-card">
              <div class="action-icon">👤</div>
              <h3>โปรไฟล์</h3>
              <p>จัดการข้อมูล</p>
              <span class="action-arrow">→</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Recent Bookings -->
      <section class="recent-bookings-section" v-if="recentBookings.length > 0">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">
              <span class="icon">📋</span>
              การจองล่าสุด
            </h2>
            <router-link to="/history" class="view-all">ดูทั้งหมด →</router-link>
          </div>

          <div class="bookings-grid">
            <div v-for="booking in recentBookings.slice(0, 3)" :key="booking.booking_ID" class="booking-card">
              <div class="booking-header">
                <span class="booking-id">#{{ booking.booking_ID }}</span>
                <span class="booking-status" :class="booking.booking_status">
                  {{ getStatusText(booking.booking_status) }}
                </span>
              </div>
              <div class="booking-body">
                <p class="booking-date">
                  <span class="icon">📅</span>
                  {{ formatDate(booking.booking_date) }}
                </p>
                <p class="booking-service">{{ extractServices(booking.invoice_description) }}</p>
                <p class="booking-price">฿{{ booking.payment_amount }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ✅ Guest Home (ถ้ายังไม่ Login) - โค้ดเดิมทั้งหมด -->
    <div v-else class="guest-section">
      <!-- Hero Banner - Featured Content -->
      <section class="hero-banner">
        <div class="banner-overlay"></div>
        <div class="banner-content">
          <div class="featured-info">
            <h3>ทำไมถึงต้องจองกับเรา?</h3>
            
            <div class="info-list">
              <div class="info-item">
                <img src="/icons/serviceshot.svg"/>
                <div class="info-text">
                  <h4>บริการรวดเร็วทันใจ<img src="/icons/star.svg" style="margin-left: 6.5rem;"/></h4>
                  <h4>บริการมาตราฐานระดับสูง<img src="/icons/star.svg" style="margin-left: 3.7rem;"/></h4>
                  <h4>ความปลอดภัยและสะอาด<img src="/icons/star.svg" style="margin-left: 3.7rem;"/></h4>
                  <h4>ราคาสมเหตุสมผล<img src="/icons/star.svg" style="margin-left: 7.2rem;"/></h4>
                  <h4>ทีมงานมืออาชีพ<img src="/icons/star.svg" style="margin-left: 8.1rem;"/></h4>            
                  <h4>จองง่ายผ่านแอพ<img src="/icons/star.svg" style="margin-left: 7.8rem;"/></h4>
                  
                </div>
              </div>
              </div>
              </div>

          <div class="cta-section">
            <div class="cta-lines">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
            <h1 class="cta-title" @click="handleCTAClick" style="cursor: pointer;">
              <span class="highlight">จองล้าง</span>
              <span class="text-white">รถตอนนี้</span>
              <span class="text-red">CLICK NOW!</span>
            </h1>
            <button class="btn-booking" @click="handleCTAClick">จองคิวเลย</button>
          </div>
        </div>
        
        <div class="featured-image">
          <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600" alt="Car Wash">
        </div>
      </section>

      <!-- Tagline Bar -->
      <div class="tagline-bar">
        <div class="container">
          <h2>CYBERCAR ศูนย์มาตราฐานทำความสะอาดรถยนต์</h2>
        </div>
      </div>

      <!-- Services Icons -->
      <section class="services-section">
        <div class="container">
          <div class="services-grid">
            <!-- 1. ล้างรถ (wash) -->
            <div class="service-item" @click="goToServices">
              <div class="service-icon-svg">
                <img src="/icons/wash.svg" alt="ล้างรถ" />
              </div>
              <p>ล้างรถ</p>
            </div>
            
            <!-- 2. เคลือบสีรถ (coating) -->
            <div class="service-item" @click="goToServices">
              <div class="service-icon-svg">
                <img src="/icons/coating.svg" alt="เคลือบสีรถ" />
              </div>
              <p>เคลือบสีรถ</p>
            </div>
            
            <!-- 3. ขัดสี (polish) -->
            <div class="service-item" @click="goToServices">
              <div class="service-icon-svg">
                <img src="/icons/polish.svg" alt="ขัดสี" />
              </div>
              <p>ขัดสี</p>
            </div>
            
            <!-- 4. ดูดฝุ่น (vacuum) -->
            <div class="service-item" @click="goToServices">
              <div class="service-icon-svg">
                <img src="/icons/vacuum.svg" alt="ดูดฝุ่น" />
              </div>
              <p>ดูดฝุ่น</p>
            </div>
            
            <!-- 5. ซักเบาะ (interior) -->
            <div class="service-item" @click="goToServices">
              <div class="service-icon-svg">
                <img src="/icons/interior.svg" alt="ซักเบาะ" />
              </div>
              <p>ซักเบาะ</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Section -->
      <section class="featured-dirty-section">
        <div class="container">
          <div class="dirty-grid">
            <div class="services-menu">
              <h3>บริการของเรา</h3>
              <ul>
                <li class="active" @click="goToServices">เคลือบสีรถ</li>
                <li @click="goToServices">ล้างรถ</li>
                <li @click="goToServices">ดูดฝุ่น</li>
                <li @click="goToServices">ขัดสีรถ</li>
                <li @click="goToServices">ซักเบาะ</li>
              </ul>
            </div>

            <div class="center-showcase">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700" alt="Car">
              <div class="showcase-overlay">
                <h2 class="showcase-title">
                  NO TIME TO
                  <span class="text-red">LEAVE YOUR</span>
                  <span class="text-red">CAR DIRTY</span>
                </h2>
              </div>
            </div>

            <div class="professional-card">
              <img src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000" alt="Professional">
              <div class="card-content">
                <h4>ทีมงานมืออาชีพ</h4>
                <p>บริการล้างรถด้วยมาตรฐานสูงสุด</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Cards -->
      <section class="bottom-cards">
        <div class="container">
          <div class="cards-grid-redesign">
            <div class="left-column">
              <div class="detail-card wide-card" @click="handleCTAClick">
                <div class="card-overlay"></div>
                <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000" alt="Car Wash Service">
                <div class="card-info bottom-left">
                  <h3>บริการทำความสะอาดรถยนต์</h3>
                </div>
              </div>

              <div class="bottom-row">
                <div class="detail-card small-card" @click="goToCarTypes">
                  <div class="card-overlay"></div>
                  <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1000" alt="Car Interior">
                  <div class="card-info centered">
                    <h3>ภายในสะอาดน่านั่ง</h3>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-card tall-card-right" @click="handleCTAClick">
              <div class="card-overlay"></div>
              <img src="https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=1000" alt="Car Interior">
              <div class="card-info top-section">
                <h2 class="big-title">NO TIME TO</h2>
                <h2 class="big-title-red">WASH?</h2>
                <h2 class="big-title-red">LEAVE IT TO US</h2>
              </div>
              <div class="card-info bottom-section">
                <div class="worker-container">
                  <img src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000" alt="Worker" class="worker-image">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Contact Info Bar -->
    <section class="contact-bar">
      <div class="container">
        <p>ติดต่อสอบถาม: 02-XXX-XXXX | Line: @cybercar | Email: info@cybercar.com</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 CYBERCAR. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navigator from '../components/Navigator.vue';

const router = useRouter();

// ✅ State
const isCustomer = ref(false);
const userName = ref('');
const userStats = ref<any>({
  total: 0,
  pending: 0,
  completed: 0
});
const recentBookings = ref<any[]>([]);

// ✅ Load Customer Data
const loadCustomerData = async () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    isCustomer.value = true;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      userName.value = user.fullName || user.firstName || user.username;
      
      // Load Stats & Recent Bookings
      await loadUserStats(user.id);
      await loadRecentBookings(user.id);
    }
  }
};

// ✅ Load User Stats
const loadUserStats = async (customerId: number) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/booking/history/${customerId}`);
    
    if (response.data.success) {
      const bookings = response.data.bookings;
      userStats.value = {
        total: bookings.length,
        pending: bookings.filter((b: any) => b.booking_status === 'pending').length,
        completed: bookings.filter((b: any) => b.booking_status === 'completed').length
      };
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

// ✅ Load Recent Bookings
const loadRecentBookings = async (customerId: number) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/booking/history/${customerId}`);
    
    if (response.data.success) {
      recentBookings.value = response.data.bookings.slice(0, 3);
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
};

// ✅ Handle CTA Click (Guest → Login, Customer → Booking)
const handleCTAClick = () => {
  if (isCustomer.value) {
    router.push('/booking');
  } else {
    Swal.fire({
      title: 'กรุณาเข้าสู่ระบบ',
      text: 'คุณต้องเข้าสู่ระบบก่อนจองบริการ',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'เข้าสู่ระบบ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
  }
};

const goToServices = () => router.push('/services');
const goToCarTypes = () => router.push('/car-types');

// ✅ Format Functions
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('th-TH', {
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
    completed: 'สำเร็จ',
    cancelled: 'ยกเลิก'
  };
  return map[status] || status;
};

// ✅ Lifecycle
onMounted(() => {
  loadCustomerData();
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: white;
  font-family: 'Rajdhani', 'Sarabun', sans-serif;
}

/* ========================================
   CUSTOMER SECTION
======================================== */

/* Welcome Hero */
.welcome-hero {
  margin-top: 80px;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
}

.welcome-content {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-content h1 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #fff;
}

.user-name {
  color: #dc2626;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-box {
  background: rgba(255, 255, 255, 0.03);
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

.stat-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
  transition: left 0.6s;
}

.stat-box:hover::before {
  left: 100%;
}

.stat-box:hover {
  transform: translateY(-5px);
  border-color: rgba(220, 38, 38, 0.5);
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.3);
}

.stat-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border-radius: 20px;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.stat-info h3 {
  font-size: 2.5rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.3rem;
  line-height: 1;
}

.stat-info p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* Quick Actions Section */
.quick-actions-section {
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 100%);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #fff;
}

.section-title .icon {
  font-size: 2.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.action-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
  transform: translateY(-10px);
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(220, 38, 38, 0.05);
  box-shadow: 0 15px 40px rgba(220, 38, 38, 0.3);
}

.action-card.primary {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(139, 0, 0, 0.15));
  border-color: rgba(220, 38, 38, 0.3);
}

.action-card.primary:hover {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.25), rgba(139, 0, 0, 0.25));
  border-color: #dc2626;
  box-shadow: 0 15px 40px rgba(220, 38, 38, 0.5);
}

.action-icon {
  font-size: 4rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.action-card:hover .action-icon {
  transform: scale(1.2) rotate(5deg);
}

.action-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.action-card p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
}

.action-arrow {
  font-size: 1.5rem;
  color: #dc2626;
  transition: all 0.3s;
}

.action-card:hover .action-arrow {
  transform: translateX(5px);
}

/* Recent Bookings Section */
.recent-bookings-section {
  padding: 4rem 2rem;
  background: #0a0a0a;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.view-all {
  color: #dc2626;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-all:hover {
  color: #fff;
  transform: translateX(5px);
}

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.booking-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s;
}

.booking-card:hover {
  transform: translateY(-5px);
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.3);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.booking-id {
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc2626;
}

.booking-status {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;
}

.booking-status.pending {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.3);
  color: #fbbf24;
}

.booking-status.confirmed {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.booking-status.in_progress {
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.3);
  color: #a855f7;
}

.booking-status.completed {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.booking-status.cancelled {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.booking-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.booking-date .icon {
  font-size: 1.2rem;
}

.booking-service {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.booking-price {
  font-size: 1.5rem;
  font-weight: 900;
  color: #10b981;
  margin-top: 0.5rem;
}

/* ========================================
   RESPONSIVE - CUSTOMER SECTION
======================================== */

@media (max-width: 1200px) {
  .quick-stats,
  .actions-grid,
  .bookings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-content h1 {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .quick-stats {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stat-box {
    padding: 1.5rem;
  }

  .stat-icon {
    font-size: 2.5rem;
    width: 60px;
    height: 60px;
  }

  .stat-info h3 {
    font-size: 2rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .bookings-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .welcome-hero,
  .quick-actions-section,
  .recent-bookings-section {
    padding: 2rem 1rem;
  }

  .action-card {
    padding: 2rem 1.5rem;
  }

  .action-icon {
    font-size: 3rem;
  }

  .booking-card {
    padding: 1.5rem;
  }
}

/* Hero Banner */
.hero-banner {
  margin-top: 80px;
  padding: 3rem 2rem;
  background: linear-gradient(to bottom, #1a1a1a 0%, #000 100%);
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%);
  z-index: 1;
}

.banner-content {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  position: relative;
  z-index: 2;
}

.featured-info h3 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  border-left: 3px solid #dc2626;
  transition: all 0.3s;
}

.info-item:hover {
  background: rgba(220, 38, 38, 0.1);
  transform: translateX(5px);
}

.info-item .icon {
  font-size: 2rem;
}

.info-text h4 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.rating {
  font-size: 0.9rem;
  color: #fbbf24;
}

.cta-section {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.cta-lines {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.line {
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #dc2626 50%, transparent 100%);
}

.cta-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 2rem;
  transition: all 0.3s;
}

.cta-title:hover {
  transform: scale(1.02);
}

.highlight {
  color: white;
  display: block;
}

.text-white {
  color: white;
  display: block;
}

.text-red {
  color: #dc2626;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
  display: block;
}

.btn-booking {
  background: #dc2626;
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
}

.btn-booking:hover {
  background: #b91c1c;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.5);
}

.featured-image {
  position: absolute;
  bottom: 0;
  left: 50px;
  z-index: 0;
  opacity: 0.3;
}

.featured-image img {
  height: 400px;
  width: auto;
  object-fit: contain;
}

/* Tagline Bar */
.tagline-bar {
  background: #dc2626;
  padding: 2rem;
}

.tagline-bar h2 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 2px;
}

/* Services Section */
.services-section {
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, #000 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
}

.services-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200') center/cover;
  opacity: 0.15;
  z-index: 0;
}

.services-section .container {
  position: relative;
  z-index: 1;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.service-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1.5rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(220, 38, 38, 0.2);
}

.service-item:hover {
  transform: translateY(-15px);
  background: rgba(220, 38, 38, 0.15);
  border-color: #dc2626;
  box-shadow: 0 15px 40px rgba(220, 38, 38, 0.4);
}

.service-icon-svg {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.2rem;
  padding: 1.2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(139, 0, 0, 0.3) 100%);
  border: 3px solid rgba(220, 38, 38, 0.4);
  transition: all 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon-svg svg {
  width: 100%;
  height: 100%;
  color: #fff;
  filter: drop-shadow(0 0 8px rgba(220, 38, 38, 0.6));
  transition: all 0.4s;
}

.service-item:hover .service-icon-svg {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-color: #dc2626;
  box-shadow: 0 0 40px rgba(220, 38, 38, 0.8);
  transform: scale(1.1) rotate(5deg);
}

.service-item:hover .service-icon-svg svg {
  color: #ffffff;
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
  transform: scale(1.1);
}

.service-item p {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  transition: all 0.3s;
}

.service-item:hover p {
  color: #fff;
  text-shadow: 0 0 15px rgba(220, 38, 38, 0.8);
  transform: scale(1.05);
}

/* Featured Dirty Section */
.featured-dirty-section {
  padding: 4rem 2rem;
  background: #0a0a0a;
}

.dirty-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.services-menu {
  background: rgba(220, 38, 38, 0.1);
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.services-menu h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #dc2626;
}

.services-menu ul {
  list-style: none;
}

.services-menu li {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.1rem;
}

.services-menu li.active {
  background: #dc2626;
  font-weight: 700;
}

.services-menu li:hover {
  background: rgba(220, 38, 38, 0.5);
}

.center-showcase {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
}

.center-showcase img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.showcase-overlay {
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
}

.showcase-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.2;
  text-align: right;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
}

.professional-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
}

.professional-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
}

.card-content h4 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #dc2626;
}

.card-content p {
  color: rgba(255, 255, 255, 0.7);
}

/* Bottom Cards */
.bottom-cards {
  padding: 3rem 2rem;
  background: #000;
}

.cards-grid-redesign {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 600px;
}

.left-column {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1.5rem;
}

.detail-card.wide-card {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.detail-card.wide-card:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.5);
}

.bottom-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.detail-card.small-card {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.detail-card.small-card:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.4);
}

.detail-card.tall-card-right {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.detail-card.tall-card-right:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.5);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%);
  z-index: 1;
}

.detail-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  position: absolute;
  z-index: 2;
  color: white;
}

.card-info.bottom-left {
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
}

.card-info.centered {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 90%;
}

.card-info.top-section {
  top: 2.5rem;
  right: 2rem;
  text-align: right;
}

.card-info.bottom-section {
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
}

.card-info h3 {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.3;
  text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.9);
}

.big-title {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
  color: white;
  text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.9);
}

.big-title-red {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
  color: #dc2626;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.9), 3px 3px 10px rgba(0, 0, 0, 0.9);
}

.worker-container {
  display: flex;
  justify-content: center;
  padding: 0 2rem;
}

.worker-image {
  width: 280px;
  height: auto;
  max-width: 100%;
  border-radius: 12px;
  border: 4px solid rgba(220, 38, 38, 0.6);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

/* Contact Bar */
.contact-bar {
  background: #1a1a1a;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(220, 38, 38, 0.3);
}

.contact-bar p {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

/* Footer */
.footer {
  background: #000;
  padding: 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
}

/* Responsive */
@media (max-width: 1200px) {
  .cards-grid-redesign {
    grid-template-columns: 1fr;
  }
  
  .left-column {
    grid-template-rows: auto auto;
  }
  
  .detail-card.tall-card-right {
    min-height: 500px;
  }
  
  .big-title, .big-title-red {
    font-size: 2rem;
  }
}

@media (max-width: 1024px) {
  .banner-content {
    grid-template-columns: 1fr;
  }
  
  .cta-section {
    align-items: center;
    text-align: center;
  }
  
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .dirty-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .cta-title {
    font-size: 2.5rem;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .showcase-title {
    font-size: 2rem;
  }
  
  .bottom-row {
    grid-template-columns: 1fr;
  }
  
  .big-title, .big-title-red {
    font-size: 1.5rem;
  }
  
  .card-info h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-banner {
    margin-top: 60px;
  }
}
</style>