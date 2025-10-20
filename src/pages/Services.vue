<template>
  <div class="services-page">
    <!-- Header Navigation -->
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">
          <div class="logo-icon">
              <path d="M10 20 L25 10 L40 20 L35 35 L15 35 Z" fill="none" stroke="currentColor" stroke-width="2"/>
              <line x1="25" y1="10" x2="25" y2="25" stroke="currentColor" stroke-width="2"/>
          </div>
          <span class="logo-text">WASHFLOW</span>
        </router-link>
        
        <nav class="nav">
          <router-link to="/services" class="active">การบริการ</router-link>
          <router-link to="/booking">จองคิวล้างรถ</router-link>
          <router-link to="/">หน้าหลัก</router-link>
          <router-link to="/car-types">ประเภทรถ</router-link>
          <router-link to="#history">ประวัติการใช้งาน</router-link>
        </nav>

        <div class="header-actions">
          <button class="search-btn">🔍</button>
          <button class="notification-btn">🔔</button>
          <router-link to="/register">
            <button class="btn-register">สมัคร</button>
          </router-link>
          <router-link to="/login">
            <button class="btn-login">เข้าสู่ระบบ</button>
          </router-link>
          <button class="user-avatar">👤</button>
        </div>
      </div>
    </header>

    <!-- Services Hero Section -->
    <section class="services-hero">
      <div class="services-overlay"></div>
      
      <div class="services-content">
        <h1 class="main-title">บริการ</h1>
        
        <div class="services-section">
          <h2 class="section-title">เลือกบริการ</h2>
          
          <div class="services-grid">
            <!-- Service 1 -->
            <div class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 28l4-8h32l4 8M12 28v12h40V28M12 40h4m24 0h4" 
                        fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <circle cx="20" cy="40" r="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <circle cx="44" cy="40" r="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <line x1="16" y1="28" x2="48" y2="28" stroke="currentColor" stroke-width="2"/>
                  <path d="M20 20l4-4h16l4 4" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              </div>
              <p class="service-name">เคลือบสีรถ</p>
              <p class="service-price">150.-</p>
            </div>

            <!-- Service 2 -->
            <div class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 28l4-8h32l4 8M12 28v12h40V28" 
                        fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <circle cx="20" cy="40" r="3.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <circle cx="44" cy="40" r="3.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <path d="M20 12v8M26 8v12M32 10v10M38 8v12M44 12v8" 
                        stroke="currentColor" stroke-width="2"/>
                  <circle cx="20" cy="12" r="1.5" fill="currentColor"/>
                  <circle cx="26" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="32" cy="10" r="1.5" fill="currentColor"/>
                  <circle cx="38" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="44" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <p class="service-name">ล้างรถ</p>
              <p class="service-price">200.-</p>
            </div>

            <!-- Service 3 -->
            <div class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 20h16v16h-16z" fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <circle cx="32" cy="28" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                  <path d="M28 44l4-8 4 8" fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="24" y1="36" x2="40" y2="36" stroke="currentColor" stroke-width="2"/>
                  <path d="M20 28h4M40 28h4M32 16v4M32 36v4" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <p class="service-name">ดูดฝุ่น</p>
              <p class="service-price">80.-</p>
            </div>

            <!-- Service 4 -->
            <div class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 26l4-8h32l4 8M12 26v14h40V26" 
                        fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <circle cx="20" cy="40" r="3.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <circle cx="44" cy="40" r="3.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <circle cx="32" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
                  <path d="M28 16h8M30 13h4" stroke="currentColor" stroke-width="2"/>
                  <path d="M24 22l8-4 8 4" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <p class="service-name">ขัดสีรถ</p>
              <p class="service-price">1,000.-</p>
            </div>

            <!-- Service 5 -->
            <div class="service-card">
              <div class="service-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="18" width="20" height="20" rx="2" 
                        fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <path d="M26 22h12M26 26h12M26 30h12M26 34h8" 
                        stroke="currentColor" stroke-width="2"/>
                  <path d="M32 18v-6M28 12h8" stroke="currentColor" stroke-width="2"/>
                  <path d="M42 26h6M42 30h4" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <p class="service-name">ซักเบาะ</p>
              <p class="service-price">2,000.-</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Background Image -->
      <div class="parking-bg">
        <img src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200" alt="Parking">
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.services-page {
  min-height: 100vh;
  background: #000;
  color: white;
  font-family: 'Rajdhani', 'Sarabun', sans-serif;
}

/* Header */
.header {
  background: rgba(0, 0, 0, 0.95);
  border-bottom: 1px solid rgba(255, 0, 0, 0.3);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
}

.logo-icon {
  width: 35px;
  height: 35px;
  color: #dc2626;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 2px;
}

.nav {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.nav a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav a.active {
  color: white;
  font-weight: 700;
}

.nav a:hover {
  color: #dc2626;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-btn, .notification-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover, .notification-btn:hover {
  color: #dc2626;
}

.btn-register, .btn-login {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.btn-login {
  background: #dc2626;
  border-color: #dc2626;
}

.btn-register:hover, .btn-login:hover {
  background: white;
  color: #000;
  border-color: white;
}

.user-avatar {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  width: 40px;
  height: 40px;
  transition: all 0.3s;
}

.user-avatar:hover {
  background: #dc2626;
  border-color: #dc2626;
}

/* Services Hero Section */
.services-hero {
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  align-items: center;
  padding: 4rem 2rem;
}

.services-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, 
    rgba(0, 0, 0, 0.95) 0%, 
    rgba(0, 0, 0, 0.85) 50%, 
    rgba(0, 0, 0, 0.95) 100%);
  z-index: 1;
}

.parking-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.parking-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
}

.services-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Main Title */
.main-title {
  font-size: 4rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 3rem;
  color: #dc2626;
  text-transform: uppercase;
  letter-spacing: 5px;
  text-shadow: 0 0 40px rgba(220, 38, 38, 0.8),
               0 0 80px rgba(220, 38, 38, 0.4);
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

/* Services Section */
.services-section {
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 20px;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: white;
  letter-spacing: 2px;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  background: rgba(20, 20, 20, 0.8);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 15px;
  padding: 2rem 1rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.2), transparent);
  transition: left 0.6s;
}

.service-card:hover::before {
  left: 100%;
}

.service-card:hover {
  transform: translateY(-10px);
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  box-shadow: 0 15px 40px rgba(220, 38, 38, 0.5),
              inset 0 0 30px rgba(220, 38, 38, 0.1);
}

.service-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  padding: 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(139, 0, 0, 0.3));
  border: 3px solid rgba(220, 38, 38, 0.5);
  transition: all 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-icon svg {
  width: 100%;
  height: 100%;
  color: #fff;
  filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.8));
}

.service-card:hover .service-icon {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  box-shadow: 0 0 40px rgba(220, 38, 38, 0.9);
  transform: scale(1.15) rotate(5deg);
}

.service-card:hover .service-icon svg {
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.9));
}

.service-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.8rem;
  letter-spacing: 1px;
}

.service-price {
  font-size: 1.3rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
}

.service-card:hover .service-name {
  color: #fff;
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
}

.service-card:hover .service-price {
  color: #fff;
  text-shadow: 0 0 25px rgba(220, 38, 38, 1);
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>