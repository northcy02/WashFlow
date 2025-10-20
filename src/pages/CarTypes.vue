<template>
  <div class="car-types-page">
    <!-- Header Navigation -->
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">
          <span class="logo-text">WASHFLOW</span>
        </router-link>
        
        <nav class="nav">
          <router-link to="/services">การบริการ</router-link>
          <router-link to="/booking">จองคิวล้างรถ</router-link>
          <router-link to="/">HOME</router-link>
          <router-link to="/car-types" class="active">ประเภทรถ</router-link>
          <router-link to="/history">ประวัติการใช้งาน</router-link>
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

    <!-- Car Types Section -->
    <section class="car-types-hero">
      <div class="hero-overlay"></div>
      
      <div class="car-types-content">
        <h1 class="main-title">ประเภทรถที่สามารถใช้บริการได้</h1>
        
        <div class="car-types-grid">
          <!-- Type 1: Sedan -->
          <div class="car-type-card" @click="selectCarType('sedan')">
            <div class="car-icon">
              <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 35l5-10h40l5 10M15 35v12h50V35M15 47h5m30 0h5" 
                      fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="25" cy="47" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="55" cy="47" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <path d="M20 35h40M25 25h30" stroke="currentColor" stroke-width="2"/>
                <rect x="28" y="27" width="10" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <rect x="42" y="27" width="10" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <p class="car-type-name">รถเก๋ง</p>
          </div>

          <!-- Type 2: Pickup Truck -->
          <div class="car-type-card" @click="selectCarType('pickup')">
            <div class="car-icon">
              <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 35l4-10h25v10M44 25h15l6 10M15 35v12h50V35" 
                      fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="25" cy="47" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="55" cy="47" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <rect x="44" y="25" width="21" height="10" fill="none" stroke="currentColor" stroke-width="2"/>
                <rect x="28" y="27" width="8" height="6" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <line x1="44" y1="35" x2="44" y2="47" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <p class="car-type-name">รถกระบะ</p>
          </div>

          <!-- Type 3: Sports Car -->
          <div class="car-type-card" @click="selectCarType('sports')">
            <div class="car-icon">
              <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 38l8-13h28l8 13M18 38v8h44V38" 
                      fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="28" cy="46" r="4.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="52" cy="46" r="4.5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <path d="M26 25l8-5h12l8 5" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M26 38h28M30 30h20" stroke="currentColor" stroke-width="1.5"/>
                <ellipse cx="40" cy="28" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <p class="car-type-name">รถสปอร์ต</p>
          </div>

          <!-- Type 4: Van -->
          <div class="car-type-card" @click="selectCarType('van')">
            <div class="car-icon">
              <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 35l3-15h44l3 15M15 35v12h50V35" 
                      fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="25" cy="47" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="55" cy="47" r="5" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <rect x="20" y="22" width="40" height="13" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
                <line x1="30" y1="22" x2="30" y2="35" stroke="currentColor" stroke-width="1.5"/>
                <line x1="40" y1="22" x2="40" y2="35" stroke="currentColor" stroke-width="1.5"/>
                <line x1="50" y1="22" x2="50" y2="35" stroke="currentColor" stroke-width="1.5"/>
                <rect x="25" y="25" width="4" height="6" fill="currentColor"/>
                <rect x="35" y="25" width="4" height="6" fill="currentColor"/>
                <rect x="45" y="25" width="4" height="6" fill="currentColor"/>
              </svg>
            </div>
            <p class="car-type-name">รถตู้</p>
          </div>

          <!-- Type 5: Motorcycle -->
          <div class="car-type-card" @click="selectCarType('motorcycle')">
            <div class="car-icon">
              <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="42" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="60" cy="42" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/>
                <path d="M20 42l12-15h8l12 8" stroke="currentColor" stroke-width="2.5" fill="none"/>
                <path d="M40 27l8-7M40 27v8" stroke="currentColor" stroke-width="2.5"/>
                <circle cx="48" cy="20" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M52 27l8 15" stroke="currentColor" stroke-width="2.5" fill="none"/>
                <line x1="40" y1="35" x2="50" y2="35" stroke="currentColor" stroke-width="2"/>
                <path d="M32 27h-4l-2 4" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
            </div>
            <p class="car-type-name">มอเตอร์ไซค์</p>
          </div>
        </div>
      </div>

      <!-- Background Parking Image -->
      <div class="parking-background">
        <img src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1600" alt="Parking Garage">
      </div>
    </section>

    <!-- Footer Info -->
    <footer class="footer">
      <div class="container">
        <p>เลือกประเภทรถของคุณเพื่อดูบริการที่เหมาะสม</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const selectCarType = (type: string) => {
  console.log('Selected car type:', type);
  router.push({
    path: '/booking',
    query: { carType: type }
  });
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.car-types-page {
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
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  color: #dc2626;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 3px;
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

/* Car Types Hero Section */
.car-types-hero {
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  align-items: center;
  padding: 4rem 2rem 6rem;
}

.hero-overlay {
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

.parking-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.parking-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
}

.car-types-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Main Title */
.main-title {
  font-size: 3.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 4rem;
  color: #dc2626;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 0 0 40px rgba(220, 38, 38, 0.8),
               0 0 80px rgba(220, 38, 38, 0.4);
  position: relative;
  line-height: 1.2;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
}

/* Car Types Grid - แสดง 5 ประเภท */
.car-types-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.car-type-card {
  background: rgba(20, 20, 20, 0.8);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 20px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.car-type-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.3), transparent);
  transition: left 0.6s;
}

.car-type-card:hover::before {
  left: 100%;
}

.car-type-card:hover {
  transform: translateY(-15px) scale(1.05);
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  box-shadow: 0 20px 50px rgba(220, 38, 38, 0.6),
              inset 0 0 40px rgba(220, 38, 38, 0.15);
}

.car-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  padding: 1.2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(139, 0, 0, 0.3));
  border: 3px solid rgba(220, 38, 38, 0.5);
  transition: all 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.car-icon svg {
  width: 100%;
  height: 100%;
  color: #fff;
  filter: drop-shadow(0 0 12px rgba(220, 38, 38, 0.8));
}

.car-type-card:hover .car-icon {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  box-shadow: 0 0 50px rgba(220, 38, 38, 1);
  transform: scale(1.2) rotate(10deg);
}

.car-type-card:hover .car-icon svg {
  filter: drop-shadow(0 0 25px rgba(255, 255, 255, 1));
  transform: scale(1.1);
}

.car-type-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  transition: all 0.3s;
}

.car-type-card:hover .car-type-name {
  color: #fff;
  text-shadow: 0 0 20px rgba(220, 38, 38, 1);
  transform: scale(1.1);
}

/* Footer */
.footer {
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  text-align: center;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  position: relative;
  z-index: 2;
}

.footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  letter-spacing: 1px;
}

/* Responsive */
@media (max-width: 1200px) {
  .car-types-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .car-types-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .main-title {
    font-size: 2.5rem;
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
  
  .car-types-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .main-title {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
  
  .car-icon {
    width: 80px;
    height: 80px;
  }
  
  .car-type-name {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .car-types-grid {
    grid-template-columns: 1fr;
  }
  
  .main-title {
    font-size: 1.5rem;
    letter-spacing: 2px;
  }
  
  .car-types-hero {
    padding: 3rem 1rem 4rem;
  }
}
</style>