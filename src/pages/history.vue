<template>
  <div class="history-page">
    <!-- Header Navigation -->
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">
          <span class="logo-text">WASHFLOW</span>
        </router-link>
        
        <nav class="nav">
          <router-link to="/services">การบริการ</router-link>
          <router-link to="/booking">จองคิวล้างรถ</router-link>
          <router-link to="/">หน้าหลัก</router-link>
          <router-link to="/car-types">ประเภทรถ</router-link>
          <router-link to="/history" class="active">ประวัติการใช้งาน</router-link>
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

    <!-- History Content -->
    <section class="history-section">
      <div class="container">
        <h1 class="main-title">ประวัติการใช้งาน</h1>
        
        <div class="history-content">
          <p class="no-history">ยังไม่มีประวัติการใช้งาน</p>
          <!-- เพิ่มเนื้อหาประวัติตามต้องการ -->
        </div>
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

.history-page {
  min-height: 100vh;
  background: #000;
  color: white;
  font-family: 'Rajdhani', 'Sarabun', sans-serif;
}

/* Header - เหมือนเดิม */
.header {
  background: rgba(0, 0, 0, 0.98);
  border-bottom: 1px solid rgba(255, 0, 0, 0.2);
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
}

.logo-text {
  color: #dc2626;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 3px;
}

.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s;
  font-weight: 500;
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
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-size: 0.9rem;
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
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.4rem;
  width: 40px;
  height: 40px;
  transition: all 0.3s;
}

.user-avatar:hover {
  background: white;
  color: #000;
}

/* History Section */
.history-section {
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, #000 0%, #1a1a1a 100%);
}

.history-section .container {
  max-width: 1400px;
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
}

.history-content {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 15px;
  padding: 3rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-history {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-title {
    font-size: 2rem;
  }
}
</style>