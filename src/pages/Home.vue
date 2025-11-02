<!-- src/pages/Home.vue - ENHANCED VERSION -->
<template>
  <div class="home-page">
    <Navigator />

    <!-- ========================================
         CUSTOMER HOME
    ======================================== -->
    <div v-if="isCustomer" class="customer-section">
      <!-- Welcome Hero with Glassmorphism -->
      <section class="welcome-hero">
        <div class="hero-background"></div>
        <div class="container">
          <div class="welcome-content">
            <h1 class="animated-title">
              <span class="greeting">Welcome Back,</span>
              <span class="user-name">{{ userName }}</span>
              <span class="wave">👋</span>
            </h1>
            <p class="welcome-subtitle">พร้อมทำความสะอาดรถของคุณแล้วหรือยัง?</p>
          </div>

          <!-- Enhanced Membership Card -->
          <div class="membership-mini-card" v-if="membershipInfo">
            <router-link to="/membership" class="membership-link">
              <div class="membership-glow"></div>
              <div class="tier-badge" :style="{ background: getTierGradient(membershipInfo.tier_color) }">
                <span class="tier-icon">{{ membershipInfo.tier_icon }}</span>
                <span class="tier-name">{{ membershipInfo.tier_name }}</span>
              </div>
              <div class="points-display">
                <div class="points-value">{{ membershipInfo.available_points?.toLocaleString() }}</div>
                <div class="points-label">คะแนนคงเหลือ</div>
              </div>
              <div class="benefits-preview">
                <span class="benefit-badge">ส่วนลด {{ membershipInfo.discount_percent }}%</span>
                <span class="benefit-badge">คูณคะแนน ×{{ membershipInfo.points_multiplier }}</span>
              </div>
              <div class="arrow-container">
                <span class="arrow">→</span>
              </div>
            </router-link>
          </div>

          <!-- Enhanced Quick Stats with Animations -->
          <div class="quick-stats">
            <div class="stat-box" data-stat="bookings">
              <div class="stat-background"></div>
              <span class="stat-icon">📋</span>
              <div class="stat-info">
                <h3 class="counter" data-target="{{ userStats.total || 0 }}">{{ userStats.total || 0 }}</h3>
                <p>จองทั้งหมด</p>
              </div>
              <div class="stat-trend">+{{ userStats.total || 0 }}</div>
            </div>

            <div class="stat-box" data-stat="pending">
              <div class="stat-background"></div>
              <span class="stat-icon">⏳</span>
              <div class="stat-info">
                <h3 class="counter">{{ userStats.pending || 0 }}</h3>
                <p>รอดำเนินการ</p>
              </div>
              <div class="stat-trend pending">{{ userStats.pending || 0 }}</div>
            </div>

            <div class="stat-box" data-stat="completed">
              <div class="stat-background"></div>
              <span class="stat-icon">✅</span>
              <div class="stat-info">
                <h3 class="counter">{{ userStats.completed || 0 }}</h3>
                <p>สำเร็จแล้ว</p>
              </div>
              <div class="stat-trend success">+{{ userStats.completed || 0 }}</div>
            </div>

            <div class="stat-box membership-stat" v-if="membershipInfo">
              <div class="stat-background"></div>
              <span class="stat-icon">💎</span>
              <div class="stat-info">
                <h3 class="counter">{{ membershipInfo.available_points || 0 }}</h3>
                <p>คะแนนสะสม</p>
              </div>
              <div class="stat-trend points">{{ membershipInfo.available_points || 0 }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Quick Actions with 3D Effects -->
      <section class="quick-actions-section">
        <div class="container">
          <h2 class="section-title">
            <span class="icon">⚡</span>
            <span class="title-text">การดำเนินการด่วน</span>
            <span class="title-underline"></span>
          </h2>

          <div class="actions-grid">
            <router-link to="/booking" class="action-card primary">
              <div class="card-glow"></div>
              <div class="action-icon-wrapper">
                <div class="action-icon">📅</div>
                <div class="icon-pulse"></div>
              </div>
              <h3>จองบริการ</h3>
              <p>จองล้างรถง่ายๆ ไม่กี่คลิก</p>
              <div class="card-footer">
                <span class="action-arrow">→</span>
                <span class="hover-text">คลิกเลย!</span>
              </div>
            </router-link>

            <router-link to="/history" class="action-card">
              <div class="card-glow"></div>
              <div class="action-icon-wrapper">
                <div class="action-icon">📜</div>
              </div>
              <h3>ประวัติการจอง</h3>
              <p>ดูรายการและคะแนนที่ได้รับ</p>
              <div class="card-footer">
                <span class="action-arrow">→</span>
              </div>
            </router-link>

            <router-link to="/services" class="action-card">
              <div class="card-glow"></div>
              <div class="action-icon-wrapper">
                <div class="action-icon">🚗</div>
              </div>
              <h3>บริการของเรา</h3>
              <p>สำรวจบริการที่หลากหลาย</p>
              <div class="card-footer">
                <span class="action-arrow">→</span>
              </div>
            </router-link>

            <router-link to="/profile" class="action-card">
              <div class="card-glow"></div>
              <div class="action-icon-wrapper">
                <div class="action-icon">👤</div>
              </div>
              <h3>โปรไฟล์</h3>
              <p>จัดการข้อมูลส่วนตัว</p>
              <div class="card-footer">
                <span class="action-arrow">→</span>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Enhanced Recent Bookings -->
      <section class="recent-bookings-section" v-if="recentBookings.length > 0">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">
              <span class="icon">📋</span>
              <span class="title-text">การจองล่าสุด</span>
            </h2>
            <router-link to="/history" class="view-all">
              <span>ดูทั้งหมด</span>
              <span class="arrow-icon">→</span>
            </router-link>
          </div>

          <div class="bookings-grid">
            <div 
              v-for="(booking, index) in recentBookings.slice(0, 3)" 
              :key="booking.booking_ID"
              class="booking-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="booking-glow"></div>
              <div class="booking-header">
                <span class="booking-id">#{{ booking.booking_ID }}</span>
                <span class="booking-status" :class="booking.booking_status">
                  <span class="status-dot"></span>
                  {{ getStatusText(booking.booking_status) }}
                </span>
              </div>
              <div class="booking-body">
                <p class="booking-date">
                  <span class="icon">📅</span>
                  <span>{{ formatDate(booking.booking_date) }}</span>
                </p>
                <p class="booking-service">
                  <span class="icon">🔧</span>
                  <span>{{ extractServices(booking.invoice_description) }}</span>
                </p>
                <div class="booking-footer">
                  <p class="booking-price">
                    <span class="currency">฿</span>
                    <span class="amount">{{ booking.payment_amount?.toLocaleString() }}</span>
                  </p>
                  <router-link :to="`/history`" class="view-detail">ดูรายละเอียด →</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ========================================
         GUEST HOME
    ======================================== -->
    <div v-else class="guest-section">
      <!-- Enhanced Branch Selection Section -->
      <section class="branch-selection-section">
        <div class="container">
          <h2 class="section-title modern">
            <span class="icon-large">📍</span>
            <span class="title-main">เลือกสาขาที่ใกล้คุณ</span>
            <p class="title-subtitle">เราพร้อมให้บริการในทุกพื้นที่</p>
          </h2>

          <div class="branches-showcase">
            <div 
              v-for="(branch, index) in branches" 
              :key="branch.branch_ID"
              class="branch-showcase-card"
              :style="{ animationDelay: `${index * 0.15}s` }"
              @click="selectBranch(branch)"
            >
              <div class="branch-ribbon">สาขาแนะนำ</div>
              <div class="branch-image">
                <img 
                  src="https://ksrcarclean.com/images/landing/carwash.jpg" 
                  :alt="branch.branch_name"
                  loading="lazy"
                >
                <div class="image-overlay"></div>
              </div>
              <div class="branch-content">
                <h3>{{ branch.branch_name }}</h3>
                <div class="branch-details">
                  <p class="branch-address">
                    <span class="icon">📍</span>
                    <span>{{ branch.branch_address }}</span>
                  </p>
                  <p class="branch-tel">
                    <span class="icon">📞</span>
                    <span>{{ branch.branch_tel }}</span>
                  </p>
                </div>
                <button class="btn-view-map" type="button">
                  <span class="map-icon">🗺️</span>
                  <span>ดูแผนที่</span>
                  <span class="btn-arrow">→</span>
                </button>
              </div>
            </div>
          </div>

          <div class="branch-cta">
            <router-link to="/branch-selection" class="btn-select-branch">
              <span>ดูสาขาทั้งหมดพร้อมแผนที่</span>
              <span class="cta-icon">🗺️</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Rest of Guest Content (Enhanced) -->
      <section class="hero-banner">
        <div class="banner-overlay"></div>
        <div class="particles"></div>
        
        <div class="banner-content">
          <div class="featured-info">
            <h3 class="section-heading">ทำไมต้องเลือก CYBERCAR?</h3>
            
            <div class="info-list">
              <div class="info-item" v-for="(feature, i) in features" :key="i" :style="{ animationDelay: `${i * 0.1}s` }">
                <div class="info-icon">
                  <img src="/icons/star.svg" alt="star">
                </div>
                <div class="info-text">
                  <h4>{{ feature.title }}</h4>
                  <p>{{ feature.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <div class="cta-decoration">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
            
            <h1 class="cta-title" @click="handleCTAClick">
              <span class="highlight">จองล้าง</span>
              <span class="text-white">รถตอนนี้</span>
              <span class="text-red">CLICK NOW!</span>
            </h1>
            
            <button class="btn-booking" @click="handleCTAClick">
              <span class="btn-text">จองคิวเลย</span>
              <span class="btn-icon">🚀</span>
            </button>
          </div>
        </div>

        <div class="featured-image">
          <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600" alt="Car Wash">
        </div>
      </section>

      <!-- Enhanced Tagline Bar -->
      <div class="tagline-bar">
        <div class="container">
          <div class="tagline-content">
            <span class="tagline-icon">🏆</span>
            <h2>CYBERCAR ศูนย์มาตรฐานทำความสะอาดรถยนต์</h2>
            <span class="tagline-badge">No.1 in Thailand</span>
          </div>
        </div>
      </div>

      <!-- Enhanced Services Section -->
      <section class="services-section">
        <div class="container">
          <h2 class="section-title centered">
            <span class="icon">✨</span>
            <span>บริการของเรา</span>
          </h2>

          <div class="services-grid">
            <div 
              v-for="(service, i) in servicesList" 
              :key="service.id"
              class="service-item"
              :style="{ animationDelay: `${i * 0.1}s` }"
              @click="goToServices"
            >
              <div class="service-glow"></div>
              <div class="service-icon-svg">
                <img :src="service.icon" :alt="service.name" />
              </div>
              <p class="service-name">{{ service.name }}</p>
              <span class="service-badge">{{ service.badge }}</span>
            </div>
          </div>

          <div class="services-cta">
            <router-link to="/services" class="btn-view-all-services">
              ดูบริการทั้งหมด →
            </router-link>
          </div>
        </div>
      </section>

      <!-- Enhanced Featured Section -->
      <section class="featured-dirty-section">
        <div class="container">
          <div class="dirty-grid">
            <div class="services-menu">
              <h3>บริการยอดนิยม</h3>
              <ul>
                <li class="menu-item active" @click="goToServices">
                  <span class="menu-icon">✨</span>
                  <span>เคลือบสีรถ</span>
                  <span class="menu-arrow">→</span>
                </li>
                <li class="menu-item" @click="goToServices">
                  <span class="menu-icon">🧼</span>
                  <span>ล้างรถ</span>
                  <span class="menu-arrow">→</span>
                </li>
                <li class="menu-item" @click="goToServices">
                  <span class="menu-icon">🌪️</span>
                  <span>ดูดฝุ่น</span>
                  <span class="menu-arrow">→</span>
                </li>
                <li class="menu-item" @click="goToServices">
                  <span class="menu-icon">✨</span>
                  <span>ขัดสีรถ</span>
                  <span class="menu-arrow">→</span>
                </li>
                <li class="menu-item" @click="goToServices">
                  <span class="menu-icon">🛋️</span>
                  <span>ซักเบาะ</span>
                  <span class="menu-arrow">→</span>
                </li>
              </ul>
            </div>

            <div class="center-showcase">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700" alt="Car">
              <div class="showcase-overlay">
                <h2 class="showcase-title">
                  <span class="title-line">NO TIME TO</span>
                  <span class="title-line text-red">LEAVE YOUR</span>
                  <span class="title-line text-red">CAR DIRTY</span>
                </h2>
              </div>
            </div>

            <div class="professional-card">
              <img src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000" alt="Professional">
              <div class="card-content">
                <div class="content-icon">👨‍🔧</div>
                <h4>ทีมงานมืออาชีพ</h4>
                <p>บริการด้วยมาตรฐานระดับสากล</p>
                <div class="professional-stats">
                  <div class="stat-item">
                    <strong>10+</strong>
                    <span>ปีประสบการณ์</span>
                  </div>
                  <div class="stat-item">
                    <strong>1000+</strong>
                    <span>ลูกค้าพึงพอใจ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Bottom Cards -->
      <section class="bottom-cards">
        <div class="container">
          <div class="cards-grid-redesign">
            <div class="left-column">
              <div class="detail-card wide-card" @click="handleCTAClick">
                <div class="card-overlay gradient-overlay"></div>
                <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000" alt="Car Wash Service">
                <div class="card-info bottom-left">
                  <div class="info-badge">Premium Service</div>
                  <h3>บริการทำความสะอาดรถยนต์</h3>
                  <p>ครบครัน ทุกความต้องการ</p>
                </div>
              </div>

              <div class="bottom-row">
                <div class="detail-card small-card" @click="goToCarTypes">
                  <div class="card-overlay gradient-overlay"></div>
                  <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1000" alt="Car Interior">
                  <div class="card-info centered">
                    <div class="centered-icon">✨</div>
                    <h3>ภายในสะอาดน่านั่ง</h3>
                    <p>ทุกตารางนิ้ว</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-card tall-card-right" @click="handleCTAClick">
              <div class="card-overlay gradient-overlay"></div>
              <img src="https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=1000" alt="Car Interior">
              <div class="card-info top-section">
                <h2 class="big-title">NO TIME TO</h2>
                <h2 class="big-title-red">WASH?</h2>
                <h2 class="big-title-red">LEAVE IT TO US</h2>
              </div>
              <div class="card-info bottom-section">
                <div class="worker-container">
                  <img src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1000" alt="Worker" class="worker-image">
                  <div class="worker-badge">
                    <span>มืออาชีพ</span>
                    <span class="badge-icon">⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Enhanced Contact Bar -->
    <section class="contact-bar">
      <div class="container">
        <div class="contact-content">
          <div class="contact-item">
            <span class="contact-icon">📞</span>
            <span>083-447-3277</span>
          </div>
          <div class="contact-divider"></div>
          <div class="contact-item">
            <span class="contact-icon">💬</span>
            <span>Line: @cybercar</span>
          </div>
          <div class="contact-divider"></div>
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <span>info@cybercar.com</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <!-- <span class="logo-icon">🚗</span> -->
            <span class="logo-text">CYBERCAR</span>
          </div>
          <p class="copyright">&copy; 2024 CYBERCAR. All rights reserved.</p>
          <div class="social-links">
            <a href="#" class="social-link">📘</a>
            <a href="#" class="social-link">📷</a>
            <a href="#" class="social-link">🐦</a>
          </div>
        </div>
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

// ========================================
// STATE
// ========================================
const isCustomer = ref(false);
const userName = ref('');
const membershipInfo = ref<any>(null);
const userStats = ref<any>({ total: 0, pending: 0, completed: 0 });
const recentBookings = ref<any[]>([]);
const branches = ref<any[]>([]);

// ========================================
// DATA
// ========================================
const features = [
  { title: 'บริการรวดเร็วทันใจ', desc: 'เสร็จภายใน 30-90 นาที' },
  { title: 'มาตรฐานระดับสากล', desc: 'ISO 9001 Certified' },
  { title: 'ปลอดภัย 100%', desc: 'ผลิตภัณฑ์คุณภาพสูง' },
  { title: 'ราคาย่อมเยา', desc: 'คุ้มค่าทุกบาท' },
  { title: 'ทีมงานมืออาชีพ', desc: 'ผ่านการอบรม' },
  { title: 'จองง่ายผ่านแอพ', desc: 'ไม่กี่คลิกเสร็จ' }
];

const servicesList = [
  { id: 'wash', name: 'ล้างรถ', icon: '/icons/wash.svg', badge: 'นิยม' },
  { id: 'coating', name: 'เคลือบสี', icon: '/icons/coating.svg', badge: 'แนะนำ' },
  { id: 'polish', name: 'ขัดสี', icon: '/icons/polish.svg', badge: 'พรีเมียม' },
  { id: 'vacuum', name: 'ดูดฝุ่น', icon: '/icons/vacuum.svg', badge: 'ด่วน' },
  { id: 'interior', name: 'ซักเบาะ', icon: '/icons/interior.svg', badge: 'ครบวงจร' }
];

// ========================================
// METHODS
// ========================================
const getTierGradient = (color: string) => {
  return `linear-gradient(135deg, ${color}ee 0%, ${color}88 100%)`;
};

const loadBranches = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/branch/all');
    if (response.data.success) {
      branches.value = response.data.branches.slice(0, 3);
      console.log('✅ Branches loaded:', branches.value.length);
    }
  } catch (error) {
    console.error('Error loading branches:', error);
  }
};

const selectBranch = (branch: any) => {
  localStorage.setItem('selectedBranch', JSON.stringify(branch));
  
  Swal.fire({
    title: `✅ เลือกสาขา ${branch.branch_name}`,
    text: 'คุณต้องการจองบริการหรือไม่?',
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'จองเลย',
    cancelButtonText: 'ดูสาขาอื่น',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/booking');
    } else {
      router.push('/branch-selection');
    }
  });
};

const loadMembershipInfo = async (customerId: number) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/membership/info/${customerId}`);
    if (response.data.success) {
      membershipInfo.value = response.data.membership;
    }
  } catch (error) {
    console.error('Error loading membership:', error);
  }
};

const loadCustomerData = async () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    isCustomer.value = true;
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      userName.value = user.fullName || user.firstName || user.username;
      
      await Promise.all([
        loadUserStats(user.id),
        loadRecentBookings(user.id),
        loadMembershipInfo(user.id)
      ]);
    }
  }
};

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

const handleCTAClick = () => {
  if (isCustomer.value) {
    router.push('/booking');
  } else {
    Swal.fire({
      title: 'กรุณาเข้าสู่ระบบ',
      text: 'เข้าสู่ระบบเพื่อรับสิทธิพิเศษและจองบริการ',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'เข้าสู่ระบบ',
      cancelButtonText: 'สมัครสมาชิก',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#10b981',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        router.push('/register');
      }
    });
  }
};

const goToServices = () => router.push('/services');
const goToCarTypes = () => router.push('/car-types');

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

// ========================================
// LIFECYCLE
// ========================================
onMounted(() => {
  loadCustomerData();
  loadBranches();
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
}

/* ========================================
   ENHANCED WELCOME HERO
======================================== */
.welcome-hero {
  margin-top: 80px;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 50%);
  animation: backgroundFloat 20s ease-in-out infinite;
}

@keyframes backgroundFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, -20px) scale(1.1); }
}

.welcome-content {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.animated-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: titleSlideDown 0.8s ease-out;
}

@keyframes titleSlideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.greeting {
  font-size: 1.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.user-name {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 10px 40px rgba(220, 38, 38, 0.3);
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.wave {
  font-size: 3rem;
  display: inline-block;
  animation: wave 1.5s ease-in-out infinite 0.6s;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-20deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  margin-top: 1rem;
  animation: fadeIn 0.6s ease-out 0.6s both;
}

/* ========================================
   ENHANCED MEMBERSHIP CARD
======================================== */
.membership-mini-card {
  max-width: 1200px;
  margin: 0 auto 2.5rem;
  animation: slideUp 0.8s ease-out 0.8s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.membership-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.membership-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s;
}

.membership-link:hover .membership-glow {
  opacity: 1;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.membership-link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(251, 191, 36, 0.6);
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(251, 191, 36, 0.4);
}

.tier-badge {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.tier-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.3));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.tier-name {
  font-size: 1.4rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

.points-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2.5rem;
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  border-right: 2px solid rgba(255, 255, 255, 0.2);
}

.points-value {
  font-size: 3rem;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 30px rgba(251, 191, 36, 0.8);
  line-height: 1;
  margin-bottom: 0.5rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.points-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.benefits-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.benefit-badge {
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  backdrop-filter: blur(10px);
}

.arrow-container {
  margin-left: auto;
}

.arrow {
  font-size: 2.5rem;
  color: #fbbf24;
  transition: transform 0.3s;
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6));
}

.membership-link:hover .arrow {
  transform: translateX(10px);
  animation: arrowBounce 0.6s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% { transform: translateX(10px); }
  50% { transform: translateX(15px); }
}

/* ========================================
   ENHANCED QUICK STATS
======================================== */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.stat-box {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-box[data-stat="bookings"] { animation-delay: 0.1s; }
.stat-box[data-stat="pending"] { animation-delay: 0.2s; }
.stat-box[data-stat="completed"] { animation-delay: 0.3s; }
.stat-box.membership-stat { animation-delay: 0.4s; }

.stat-background {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
  transition: transform 0.6s;
}

.stat-box:hover .stat-background {
  transform: translate(-10%, -10%) scale(1.2);
  animation: rotate 10s linear infinite;
}

.stat-box:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: rgba(220, 38, 38, 0.5);
  box-shadow: 0 20px 60px rgba(220, 38, 38, 0.4);
}

.stat-icon {
  font-size: 4rem;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.3));
  border-radius: 25px;
  border: 3px solid rgba(220, 38, 38, 0.4);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
    transition: all 0.4s;
}

.stat-box:hover .stat-icon {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 15px 40px rgba(220, 38, 38, 0.5);
}

.stat-info {
  text-align: center;
}

.stat-info h3 {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-info p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.stat-trend {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #10b981;
}

.stat-trend.pending {
  background: rgba(251, 191, 36, 0.2);
  border-color: rgba(251, 191, 36, 0.4);
  color: #fbbf24;
}

.stat-trend.success {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.4);
  color: #10b981;
}

.stat-trend.points {
  background: rgba(251, 191, 36, 0.2);
  border-color: rgba(251, 191, 36, 0.4);
  color: #fbbf24;
}

.stat-box.membership-stat {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15));
  border-color: rgba(251, 191, 36, 0.3);
}

.stat-box.membership-stat:hover {
  border-color: rgba(251, 191, 36, 0.8);
  box-shadow: 0 20px 60px rgba(251, 191, 36, 0.5);
}

.stat-box.membership-stat .stat-icon {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.4));
  border-color: rgba(251, 191, 36, 0.5);
}

/* ========================================
   ENHANCED QUICK ACTIONS with 3D Effects
======================================== */
.quick-actions-section {
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
}

.quick-actions-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="2" height="2" fill="rgba(220,38,38,0.1)"/></svg>');
  opacity: 0.3;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #fff;
  position: relative;
  z-index: 1;
}

.section-title .icon {
  font-size: 3.5rem;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.6));
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

.section-title .title-text {
  position: relative;
}

.title-underline {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
  border-radius: 2px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.action-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 3rem 2rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  transform-style: preserve-3d;
  animation: cardSlideIn 0.6s ease-out both;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px) rotateX(-10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

.action-card:nth-child(1) { animation-delay: 0.1s; }
.action-card:nth-child(2) { animation-delay: 0.2s; }
.action-card:nth-child(3) { animation-delay: 0.3s; }
.action-card:nth-child(4) { animation-delay: 0.4s; }

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s;
}

.action-card:hover .card-glow {
  opacity: 1;
}

.action-card:hover {
  transform: translateY(-15px) scale(1.05);
  border-color: rgba(220, 38, 38, 0.6);
  background: rgba(220, 38, 38, 0.08);
  box-shadow: 
    0 20px 60px rgba(220, 38, 38, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.action-card.primary {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border-color: rgba(220, 38, 38, 0.4);
}

.action-card.primary:hover {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(139, 0, 0, 0.3));
  border-color: #dc2626;
  box-shadow: 
    0 25px 70px rgba(220, 38, 38, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.action-icon-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  font-size: 5rem;
  transition: all 0.4s;
  filter: drop-shadow(0 5px 20px rgba(0, 0, 0, 0.3));
  z-index: 1;
}

.icon-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.3);
  animation: pulsate 2s ease-out infinite;
  opacity: 0;
}

.action-card.primary .icon-pulse {
  opacity: 1;
}

@keyframes pulsate {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.action-card:hover .action-icon {
  transform: scale(1.2) rotate(10deg);
  filter: drop-shadow(0 10px 30px rgba(220, 38, 38, 0.5));
}

.action-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.action-card p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}

.action-arrow {
  font-size: 2rem;
  color: #dc2626;
  transition: all 0.3s;
}

.hover-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: #dc2626;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
}

.action-card:hover .action-arrow {
  transform: translateX(10px);
}

.action-card:hover .hover-text {
  opacity: 1;
  transform: translateX(0);
}

/* ========================================
   ENHANCED BRANCH SELECTION
======================================== */
.branch-selection-section {
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%);
  position: relative;
}

.branch-selection-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1920') center/cover;
  opacity: 0.08;
  z-index: 0;
}

.section-title.modern {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
}

.icon-large {
  font-size: 4rem;
  filter: drop-shadow(0 10px 30px rgba(220, 38, 38, 0.5));
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.title-main {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  margin: 0;
}

.branches-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.branch-showcase-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  animation: branchSlideIn 0.8s ease-out both;
}

@keyframes branchSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) rotateX(-15deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

.branch-showcase-card:nth-child(1) { animation-delay: 0.2s; }
.branch-showcase-card:nth-child(2) { animation-delay: 0.4s; }
.branch-showcase-card:nth-child(3) { animation-delay: 0.6s; }

.branch-ribbon {
  position: absolute;
  top: 20px;
  right: -35px;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
  padding: 0.5rem 3rem;
  font-size: 0.85rem;
  font-weight: 700;
  transform: rotate(45deg);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
  letter-spacing: 0.5px;
}

.branch-showcase-card:hover {
  transform: translateY(-15px) scale(1.03);
  border-color: rgba(220, 38, 38, 0.6);
  box-shadow: 
    0 30px 80px rgba(220, 38, 38, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.branch-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.branch-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  filter: brightness(0.9);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  transition: opacity 0.3s;
}

.branch-showcase-card:hover .branch-image img {
  transform: scale(1.15);
  filter: brightness(1.1);
}

.branch-showcase-card:hover .image-overlay {
  opacity: 0.5;
}

.branch-content {
  padding: 2rem 2rem 2.5rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.branch-content h3 {
  font-size: 1.5rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.branch-showcase-card:hover .branch-content h3 {
  color: #fbbf24;
  transform: translateX(5px);
}

.branch-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.branch-address,
.branch-tel {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s;
  padding: 0.5rem;
  border-radius: 8px;
}

.branch-showcase-card:hover .branch-address,
.branch-showcase-card:hover .branch-tel {
  color: rgba(255, 255, 255, 0.95);
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.branch-address .icon,
.branch-tel .icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.btn-view-map {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(59, 130, 246, 0.15);
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 15px;
  color: #3b82f6;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
}

.btn-view-map::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
  transition: left 0.5s;
}

.btn-view-map:hover::before {
  left: 100%;
}

.btn-view-map:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.map-icon {
  font-size: 1.3rem;
}

.btn-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.btn-view-map:hover .btn-arrow {
  transform: translateX(5px);
}

.branch-cta {
  text-align: center;
}

.btn-select-branch {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 3.5rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-radius: 50px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.4s;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-select-branch::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-select-branch:hover::before {
  width: 300px;
  height: 300px;
}

.btn-select-branch:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.6);
}

.cta-icon {
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.btn-select-branch:hover .cta-icon {
  transform: scale(1.2) rotate(15deg);
}

/* ========================================
   ENHANCED RECENT BOOKINGS
======================================== */
.recent-bookings-section {
  padding: 5rem 2rem;
  background: #0a0a0a;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #dc2626;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  background: rgba(220, 38, 38, 0.1);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 50px;
  transition: all 0.3s;
}

.view-all:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.3);
}

.arrow-icon {
  transition: transform 0.3s;
}

.view-all:hover .arrow-icon {
  transform: translateX(5px);
}

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.booking-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 2rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: bookingSlideIn 0.6s ease-out both;
}

@keyframes bookingSlideIn {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.booking-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s;
}

.booking-card:hover .booking-glow {
  opacity: 1;
  animation: rotate 6s linear infinite;
}

.booking-card:hover {
  transform: translateY(-10px) scale(1.03);
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 50px rgba(220, 38, 38, 0.3);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.booking-id {
  font-size: 1.3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.booking-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 700;
  border: 2px solid;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.booking-status.pending {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.4);
  color: #fbbf24;
}

.booking-status.completed {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
  color: #10b981;
}

.booking-body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.booking-date,
.booking-service {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  transition: all 0.3s;
}

.booking-card:hover .booking-date,
.booking-card:hover .booking-service {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.booking-date .icon,
.booking-service .icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.booking-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.booking-price {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.currency {
  font-size: 1.2rem;
  font-weight: 700;
  color: #10b981;
}

.amount {
  font-size: 2rem;
  font-weight: 900;
  color: #10b981;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.view-detail {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 20px;
  transition: all 0.3s;
}

.view-detail:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  transform: translateX(3px);
}

/* ========================================
   ENHANCED HERO BANNER
======================================== */
.hero-banner {
  margin-top: 80px;
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #1a1a1a 0%, #000 100%);
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 100%);
  z-index: 1;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="2" fill="rgba(220,38,38,0.3)"/></svg>');
  animation: particlesMove 30s linear infinite;
  opacity: 0.5;
  z-index: 1;
}

@keyframes particlesMove {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}

.banner-content {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  position: relative;
  z-index: 2;
}

.section-heading {
  font-size: 2rem;
  margin-bottom: 2.5rem;
  font-weight: 700;
  color: #fff;
  position: relative;
  padding-bottom: 1rem;
}

.section-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #dc2626, #fbbf24);
  border-radius: 2px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  border-left: 4px solid #dc2626;
  transition: all 0.4s;
  animation: infoSlideIn 0.6s ease-out both;
}

@keyframes infoSlideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.info-item:hover {
  background: rgba(220, 38, 38, 0.1);
  border-left-width: 6px;
  transform: translateX(10px);
  box-shadow: -5px 0 20px rgba(220, 38, 38, 0.3);
}

.info-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(139, 0, 0, 0.3));
  border-radius: 50%;
  border: 2px solid rgba(220, 38, 38, 0.5);
  flex-shrink: 0;
}

.info-icon img {
  width: 60%;
  height: 60%;
  filter: invert(1) drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
}

.info-text h4 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #fff;
  font-weight: 700;
}

.info-text p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.cta-section {
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.cta-decoration {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.line {
  width: 350px;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #dc2626 50%, transparent 100%);
  animation: lineExpand 3s ease-in-out infinite;
}

.line:nth-child(2) {
  animation-delay: 0.3s;
}

.line:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes lineExpand {
  0%, 100% { transform: scaleX(0.8); opacity: 0.5; }
  50% { transform: scaleX(1); opacity: 1; }
}

.cta-title {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 2.5rem;
  cursor: pointer;
  transition: all 0.4s;
  position: relative;
}

.cta-title:hover {
  transform: scale(1.05) translateX(-10px);
}

.cta-title span {
  display: block;
  transition: all 0.3s;
}

.highlight {
  color: white;
  animation: titleFadeIn 0.6s ease-out 0.2s both;
}

.text-white {
  color: white;
  animation: titleFadeIn 0.6s ease-out 0.4s both;
}

.text-red {
  color: #dc2626;
  text-shadow: 0 0 40px rgba(220, 38, 38, 0.9);
  animation: titleFadeIn 0.6s ease-out 0.6s both;
}

@keyframes titleFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-title:hover .text-red {
  animation: textGlow 1s ease-in-out infinite;
}

@keyframes textGlow {
  0%, 100% { text-shadow: 0 0 40px rgba(220, 38, 38, 0.9); }
  50% { text-shadow: 0 0 60px rgba(220, 38, 38, 1), 0 0 80px rgba(220, 38, 38, 0.8); }
}

.btn-booking {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: white;
  border: none;
  padding: 1.3rem 3.5rem;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.4s;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.5);
  position: relative;
  overflow: hidden;
}

.btn-booking::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-booking:hover::before {
  left: 100%;
}

.btn-booking:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.7);
}

.btn-icon {
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.btn-booking:hover .btn-icon {
  transform: translateX(5px) scale(1.2);
}

.featured-image {
  position: absolute;
  bottom: 0;
  left: 50px;
  z-index: 0;
  opacity: 0.25;
  animation: imageFloat 4s ease-in-out infinite;
}

@keyframes imageFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.featured-image img {
  height: 450px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
}

/* ========================================
   ENHANCED TAGLINE BAR
======================================== */
.tagline-bar {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  padding: 2.5rem 2rem;
  position: relative;
  overflow: hidden;
}

.tagline-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  to { left: 100%; }
}

.tagline-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.tagline-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.5));
}

.tagline-content h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}

.tagline-badge {
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

/* ========================================
   ENHANCED SERVICES SECTION
======================================== */
.services-section {
  padding: 5rem 2rem;
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
  opacity: 0.1;
  z-index: 0;
  filter: blur(3px);
}

.section-title.centered {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto 3rem;
  position: relative;
  z-index: 1;
}

.service-item {
  position: relative;
  text-align: center;
  cursor: pointer;
  padding: 2rem 1.5rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(220, 38, 38, 0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: servicePopIn 0.6s ease-out both;
}

@keyframes servicePopIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.service-glow {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 50%);
  opacity: 0;
  transition: all 0.6s;
}

.service-item:hover .service-glow {
  opacity: 1;
  top: -50%;
  left: -50%;
}

.service-item:hover {
  transform: translateY(-20px) scale(1.08);
  background: rgba(220, 38, 38, 0.15);
  border-color: #dc2626;
  box-shadow: 0 25px 60px rgba(220, 38, 38, 0.5);
}

.service-icon-svg {
  width: 110px;
  height: 110px;
  margin: 0 auto 1.5rem;
  padding: 1.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.25), rgba(139, 0, 0, 0.35));
  border: 3px solid rgba(220, 38, 38, 0.5);
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
}

.service-icon-svg img {
  width: 100%;
  height: 100%;
  filter: invert(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  transition: all 0.4s;
}

.service-item:hover .service-icon-svg {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  box-shadow: 0 0 50px rgba(220, 38, 38, 1);
  transform: scale(1.2) rotate(10deg);
}

.service-item:hover .service-icon-svg img {
  filter: invert(1) brightness(2) drop-shadow(0 0 20px rgba(255, 255, 255, 1));
  transform: scale(1.15);
}

.service-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
  transition: all 0.3s;
}

.service-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(251, 191, 36, 0.2);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fbbf24;
    text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s;
}

.service-item:hover .service-name {
  color: #fff;
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
  transform: scale(1.1);
}

.service-item:hover .service-badge {
  background: rgba(251, 191, 36, 0.3);
  border-color: #fbbf24;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
}

.services-cta {
  text-align: center;
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

.btn-view-all-services {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: #fff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.4s;
  backdrop-filter: blur(10px);
}

.btn-view-all-services:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4);
}

/* ========================================
   ENHANCED FEATURED DIRTY SECTION
======================================== */
.featured-dirty-section {
  padding: 5rem 2rem;
  background: #0a0a0a;
}

.dirty-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.services-menu {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(139, 0, 0, 0.15));
  padding: 2.5rem 2rem;
  border-radius: 25px;
  border: 2px solid rgba(220, 38, 38, 0.3);
  backdrop-filter: blur(15px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
}

.services-menu h3 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #dc2626;
  font-weight: 900;
  text-shadow: 0 2px 10px rgba(220, 38, 38, 0.5);
}

.services-menu ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.4s;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #dc2626;
  transform: scaleY(0);
  transition: transform 0.3s;
}

.menu-item:hover::before,
.menu-item.active::before {
  transform: scaleY(1);
}

.menu-item.active {
  background: rgba(220, 38, 38, 0.3);
  color: #fff;
  font-weight: 700;
  box-shadow: inset 0 0 20px rgba(220, 38, 38, 0.3);
}

.menu-item:hover {
  background: rgba(220, 38, 38, 0.2);
  color: #fff;
  transform: translateX(10px);
  padding-left: 2rem;
}

.menu-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.menu-item:hover .menu-icon {
  transform: scale(1.2) rotate(10deg);
}

.menu-arrow {
  margin-left: auto;
  font-size: 1.2rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
}

.menu-item:hover .menu-arrow {
  opacity: 1;
  transform: translateX(0);
}

.center-showcase {
  position: relative;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.center-showcase img {
  width: 100%;
  height: 600px;
  object-fit: cover;
  transition: transform 0.6s;
}

.center-showcase:hover img {
  transform: scale(1.1);
}

.showcase-overlay {
  position: absolute;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  z-index: 2;
}

.showcase-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  text-align: right;
  text-shadow: 0 5px 30px rgba(0, 0, 0, 0.9);
}

.title-line {
  display: block;
  animation: titleSlideInRight 0.8s ease-out both;
}

.title-line:nth-child(1) { animation-delay: 0.2s; }
.title-line:nth-child(2) { animation-delay: 0.4s; }
.title-line:nth-child(3) { animation-delay: 0.6s; }

@keyframes titleSlideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.professional-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  overflow: hidden;
  transition: all 0.4s;
}

.professional-card:hover {
  transform: translateY(-10px);
  border-color: rgba(220, 38, 38, 0.5);
  box-shadow: 0 20px 50px rgba(220, 38, 38, 0.3);
}

.professional-card img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.6s;
}

.professional-card:hover img {
  transform: scale(1.1);
}

.card-content {
  padding: 2rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8));
}

.content-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 5px 15px rgba(220, 38, 38, 0.5));
}

.card-content h4 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #dc2626;
  font-weight: 900;
}

.card-content p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.professional-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.professional-stats .stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 12px;
}

.professional-stats strong {
  display: block;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fbbf24;
  margin-bottom: 0.25rem;
}

.professional-stats span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

/* ========================================
   ENHANCED BOTTOM CARDS
======================================== */
.bottom-cards {
  padding: 4rem 2rem;
  background: #000;
}

.cards-grid-redesign {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 700px;
}

.left-column {
  display: grid;
  grid-template-rows: 1.5fr 1fr;
  gap: 2rem;
}

.detail-card {
  position: relative;
  border-radius: 25px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
}

.detail-card:hover {
  transform: scale(1.03);
  box-shadow: 0 25px 70px rgba(220, 38, 38, 0.5);
}

.detail-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.detail-card:hover img {
  transform: scale(1.15);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom, 
    rgba(0,0,0,0.2) 0%, 
    rgba(0,0,0,0.7) 50%,
    rgba(0,0,0,0.95) 100%
  );
  z-index: 1;
  transition: background 0.5s;
}

.detail-card:hover .gradient-overlay {
  background: linear-gradient(
    to bottom, 
    rgba(220,38,38,0.3) 0%, 
    rgba(0,0,0,0.8) 50%,
    rgba(0,0,0,0.98) 100%
  );
}

.card-info {
  position: absolute;
  z-index: 2;
  color: white;
  transition: all 0.5s;
}

.card-info.bottom-left {
  bottom: 2.5rem;
  left: 2.5rem;
  right: 2.5rem;
}

.info-badge {
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: rgba(251, 191, 36, 0.9);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 5px 20px rgba(251, 191, 36, 0.5);
}

.card-info.bottom-left h3 {
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1.3;
  text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.9);
  margin-bottom: 0.5rem;
}

.card-info.bottom-left p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
}

.card-info.centered {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 90%;
}

.centered-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 10px 30px rgba(255, 255, 255, 0.3));
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.card-info.centered h3 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.card-info.centered p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.card-info.top-section {
  top: 3rem;
  right: 3rem;
  text-align: right;
}

.big-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
  color: white;
  text-shadow: 3px 3px 15px rgba(0, 0, 0, 0.9);
  animation: bigTitleSlide 0.8s ease-out both;
}

.big-title-red {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
  color: #dc2626;
  text-shadow: 
    0 0 40px rgba(220, 38, 38, 1),
    3px 3px 15px rgba(0, 0, 0, 0.9);
  animation: bigTitleSlide 0.8s ease-out both;
}

.big-title:nth-child(1) { animation-delay: 0.2s; }
.big-title-red:nth-child(2) { animation-delay: 0.4s; }
.big-title-red:nth-child(3) { animation-delay: 0.6s; }

@keyframes bigTitleSlide {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.card-info.bottom-section {
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
}

.worker-container {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 2rem;
}

.worker-image {
  width: 320px;
  height: auto;
  max-width: 100%;
  border-radius: 20px;
  border: 4px solid rgba(220, 38, 38, 0.6);
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.5);
  transition: all 0.4s;
}

.detail-card:hover .worker-image {
  transform: scale(1.05);
  border-color: #dc2626;
  box-shadow: 0 20px 60px rgba(220, 38, 38, 0.7);
}

.worker-badge {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 25px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.badge-icon {
  font-size: 1.2rem;
  animation: starRotate 4s linear infinite;
}

@keyframes starRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ========================================
   ENHANCED CONTACT BAR
======================================== */
.contact-bar {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  padding: 2.5rem 2rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.contact-item:hover {
  background: rgba(220, 38, 38, 0.15);
  border-color: rgba(220, 38, 38, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
}

.contact-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 8px rgba(220, 38, 38, 0.5));
}

.contact-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
}

/* ========================================
   ENHANCED FOOTER
======================================== */
.footer {
  background: #000;
  padding: 3rem 2rem;
  border-top: 2px solid rgba(220, 38, 38, 0.2);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.logo-icon {
  font-size: 3rem;
  filter: drop-shadow(0 5px 20px rgba(220, 38, 38, 0.6));
}

.logo-text {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
  font-weight: 500;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 1.5rem;
  text-decoration: none;
  transition: all 0.4s;
}

.social-link:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  transform: translateY(-5px) rotate(10deg);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1400px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dirty-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .branches-showcase {
    grid-template-columns: repeat(2, 1fr);
  }

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

  .bookings-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cards-grid-redesign {
    grid-template-columns: 1fr;
  }

  .left-column {
    grid-template-rows: auto auto;
  }

  .detail-card.tall-card-right {
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .welcome-content h1 {
    font-size: 2rem;
  }

  .user-name {
    font-size: 2.5rem;
  }

  .wave {
    font-size: 2rem;
  }

  .membership-link {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .tier-badge {
    width: 100%;
    justify-content: center;
  }

  .points-display {
    border-left: none;
    border-right: none;
    border-top: 2px solid rgba(255, 255, 255, 0.2);
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    padding: 1.5rem 0;
    width: 100%;
  }

  .benefits-preview {
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }

  .arrow-container {
    margin-left: 0;
  }

  .quick-stats {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .branches-showcase {
    grid-template-columns: 1fr;
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .bookings-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .cta-title {
    font-size: 2.5rem;
  }

  .big-title,
  .big-title-red {
    font-size: 2rem;
  }

  .contact-content {
    flex-direction: column;
    gap: 1rem;
  }

  .contact-divider {
    width: 100%;
    height: 1px;
  }

  .footer-content {
    gap: 1.5rem;
  }

  .social-links {
    gap: 0.75rem;
  }

  .social-link {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .welcome-hero,
  .quick-actions-section,
  .branch-selection-section,
  .recent-bookings-section,
  .bottom-cards {
    padding: 3rem 1rem;
  }

  .greeting {
    font-size: 1.2rem;
  }

  .user-name {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .membership-link {
    padding: 1.2rem;
  }

  .tier-icon {
    font-size: 1.8rem;
  }

  .tier-name {
    font-size: 1rem;
  }

  .points-value {
    font-size: 2rem;
  }

  .stat-box {
    padding: 1.5rem;
  }

  .stat-icon {
    width: 70px;
    height: 70px;
    font-size: 2.5rem;
  }

  .stat-info h3 {
    font-size: 2rem;
  }

  .action-card {
    padding: 2rem 1.5rem;
  }

  .action-icon {
    font-size: 3.5rem;
  }

  .branch-showcase-card {
    margin-bottom: 1.5rem;
  }

  .branch-ribbon {
    font-size: 0.75rem;
    padding: 0.4rem 2.5rem;
  }

  .branch-content {
    padding: 1.5rem;
  }

  .branch-content h3 {
    font-size: 1.2rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-icon-svg {
    width: 90px;
    height: 90px;
  }

  .booking-card {
    padding: 1.5rem;
  }

  .booking-id {
    font-size: 1.1rem;
  }

  .currency {
    font-size: 1rem;
  }

  .amount {
    font-size: 1.5rem;
  }

  .cta-title {
    font-size: 2rem;
  }

  .big-title,
  .big-title-red {
    font-size: 1.5rem;
  }

  .worker-image {
    width: 100%;
    max-width: 250px;
  }

  .card-info.bottom-left h3 {
    font-size: 1.5rem;
  }

  .info-badge {
    font-size: 0.75rem;
    padding: 0.4rem 1rem;
  }

  .contact-item {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  .footer-logo {
    flex-direction: column;
  }

  .logo-icon {
    font-size: 2.5rem;
  }

  .logo-text {
    font-size: 1.5rem;
  }
}

/* ========================================
   DARK MODE ENHANCEMENTS
======================================== */
@media (prefers-color-scheme: dark) {
  .home-page {
    background: #000;
  }
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
   HIGH CONTRAST MODE
======================================== */
@media (prefers-contrast: high) {
  .stat-box,
  .action-card,
  .branch-showcase-card,
  .booking-card,
  .detail-card {
    border-width: 3px;
  }

  .membership-link,
  .btn-select-branch,
  .btn-booking {
    border: 3px solid rgba(255, 255, 255, 0.3);
  }
}

/* ========================================
   PRINT STYLES
======================================== */
@media print {
  .welcome-hero,
  .quick-actions-section,
  .branch-selection-section,
  .hero-banner,
  .services-section,
  .featured-dirty-section,
  .bottom-cards,
  .contact-bar,
  .footer,
  .membership-mini-card,
  .action-arrow,
  button,
  .btn {
    display: none !important;
  }

  .recent-bookings-section {
    page-break-inside: avoid;
  }

  .booking-card {
    border: 2px solid #000;
    page-break-inside: avoid;
  }
}

/* ========================================
   ACCESSIBILITY ENHANCEMENTS
======================================== */
.action-card:focus-visible,
.service-item:focus-visible,
.branch-showcase-card:focus-visible,
.booking-card:focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 4px;
}

.btn-booking:focus-visible,
.btn-select-branch:focus-visible,
.view-all:focus-visible {
  outline: 3px solid #fbbf24;
  outline-offset: 4px;
}

/* ========================================
   LOADING STATES (Optional)
======================================== */
.skeleton {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
}

@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ========================================
   CUSTOM PROPERTIES for Dynamic Theming
======================================== */
.home-page {
  --primary: #dc2626;
  --primary-dark: #991b1b;
  --primary-light: #ef4444;
  --secondary: #fbbf24;
  --success: #10b981;
  --info: #3b82f6;
}

/* ========================================
   SCROLLBAR CUSTOM
======================================== */
.bookings-grid::-webkit-scrollbar,
.info-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bookings-grid::-webkit-scrollbar-track,
.info-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.bookings-grid::-webkit-scrollbar-thumb,
.info-list::-webkit-scrollbar-thumb {
  background: rgba(220, 38, 38, 0.5);
  border-radius: 10px;
}

.bookings-grid::-webkit-scrollbar-thumb:hover,
.info-list::-webkit-scrollbar-thumb:hover {
  background: #dc2626;
}
</style>
