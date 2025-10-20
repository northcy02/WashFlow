<template>
  <div class="booking-page">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">
              <path d="M20 5L35 12.5V27.5L20 35L5 27.5V12.5L20 5Z" stroke="#dc2626" stroke-width="2"/>
              <circle cx="20" cy="20" r="8" fill="#dc2626"/>
          <span class="logo-text">WASHFLOW</span>
        </router-link>
        
        <nav class="nav">
          <router-link to="#service">การบริการ</router-link>
          <router-link to="#booking">จองคิวล้างรถ</router-link>
          <router-link to="/">HOME</router-link>
          <router-link to="#types">ประเภทรถ</router-link>
          <router-link to="#history">ประวัติการใช้งาน</router-link>
        </nav>

        <div class="header-actions">
          <button class="btn-register">REGISTER</button>
          <button class="btn-login">LOGIN NOW</button>
          <button class="btn-cart">🛒</button>
          <button class="btn-user">👤</button>
        </div>
      </div>
    </header>

    <!-- Booking Content -->
    <section class="booking-section">
      <div class="container">
        <!-- Title -->
        <div class="booking-header">
          <h1 class="title-top">จองคิว</h1>
          <h2 class="title-main">ล้างรถตอนนี้</h2>
          <p class="subtitle">CYBERCAR ศูนย์มาตราฐานทำความสะอาดรถยนต์</p>
        </div>

        <!-- Vehicle Type Selection -->
        <div class="selection-section">
          <h3 class="section-title">เลือกประเภทรถของคุณเพื่อเข้ารับบริการ</h3>
          
          <div class="vehicle-grid">
            <div 
              class="vehicle-card"
              :class="{ active: selectedVehicle === 'sedan' }"
              @click="selectedVehicle = 'sedan'"
            >
              <div class="vehicle-icon">
                <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 40 L20 25 L35 25 L40 15 L60 15 L65 25 L80 25 L90 40 Z"/>
                  <circle cx="25" cy="45" r="8"/>
                  <circle cx="75" cy="45" r="8"/>
                  <line x1="33" y1="45" x2="67" y2="45"/>
                </svg>
              </div>
              <p>รถเก๋ง</p>
            </div>

            <div 
              class="vehicle-card"
              :class="{ active: selectedVehicle === 'truck' }"
              @click="selectedVehicle = 'truck'"
            >
              <div class="vehicle-icon">
                <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 35 L20 20 L40 20 L40 15 L70 15 L75 25 L85 25 L90 35 Z"/>
                  <rect x="40" y="25" width="25" height="15"/>
                  <circle cx="25" cy="45" r="8"/>
                  <circle cx="75" cy="45" r="8"/>
                </svg>
              </div>
              <p>รถกระบะ</p>
            </div>

            <div 
              class="vehicle-card"
              :class="{ active: selectedVehicle === 'sport' }"
              @click="selectedVehicle = 'sport'"
            >
              <div class="vehicle-icon">
                <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 40 L25 25 L40 20 L60 20 L70 25 L85 40 Z"/>
                  <path d="M30 25 L35 20 L55 20 L60 25"/>
                  <circle cx="30" cy="45" r="8"/>
                  <circle cx="70" cy="45" r="8"/>
                </svg>
              </div>
              <p>รถสปอร์ต</p>
            </div>

            <div 
              class="vehicle-card"
              :class="{ active: selectedVehicle === 'suv' }"
              @click="selectedVehicle = 'suv'"
            >
              <div class="vehicle-icon">
                <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 35 L18 18 L38 18 L42 12 L62 12 L66 18 L82 18 L90 35 Z"/>
                  <rect x="18" y="18" width="64" height="17"/>
                  <circle cx="28" cy="45" r="8"/>
                  <circle cx="72" cy="45" r="8"/>
                </svg>
              </div>
              <p>รถตู้</p>
            </div>

            <div 
              class="vehicle-card"
              :class="{ active: selectedVehicle === 'motor' }"
              @click="selectedVehicle = 'motor'"
            >
              <div class="vehicle-icon">
                <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="30" cy="45" r="8"/>
                  <circle cx="70" cy="45" r="8"/>
                  <path d="M30 45 L40 30 L60 30 L70 45"/>
                  <path d="M45 30 L50 20 L55 30"/>
                  <line x1="50" y1="20" x2="50" y2="15"/>
                </svg>
              </div>
              <p>มอเตอร์ไซค์</p>
            </div>
          </div>
        </div>

        <!-- Service Selection -->
        <div class="service-section">
          <h3 class="section-title">เลือกบริการ</h3>
          
          <div class="service-grid">
            <div 
              class="service-card"
              :class="{ active: selectedServices.includes('coating') }"
              @click="toggleService('coating')"
            >
              <div class="service-icon">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="15" y="20" width="50" height="40" rx="5"/>
                  <path d="M25 30 L35 40 L55 30"/>
                  <circle cx="30" cy="50" r="3"/>
                  <circle cx="50" cy="50" r="3"/>
                  <path d="M20 25 Q40 15 60 25" stroke-dasharray="3"/>
                </svg>
              </div>
              <p>เคลือบแก้ว</p>
              <span class="price">150.-</span>
            </div>

            <div 
              class="service-card"
              :class="{ active: selectedServices.includes('wash') }"
              @click="toggleService('wash')"
            >
              <div class="service-icon">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="15" y="25" width="50" height="35" rx="5"/>
                  <path d="M25 35 L35 45 L55 35"/>
                  <circle cx="30" cy="52" r="3"/>
                  <circle cx="50" cy="52" r="3"/>
                  <path d="M30 20 Q35 10 40 20 Q45 10 50 20" stroke-linecap="round"/>
                </svg>
              </div>
              <p>ล้างรถ</p>
              <span class="price">200.-</span>
            </div>

            <div 
              class="service-card"
              :class="{ active: selectedServices.includes('wax') }"
              @click="toggleService('wax')"
            >
              <div class="service-icon">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="20" y="30" width="40" height="30" rx="3"/>
                  <path d="M25 40 L40 50 L55 40"/>
                  <circle cx="32" cy="52" r="2"/>
                  <circle cx="48" cy="52" r="2"/>
                  <path d="M30 25 L35 20 L40 25 L45 20 L50 25"/>
                </svg>
              </div>
              <p>ดูดฝุ่น</p>
              <span class="price">80.-</span>
            </div>

            <div 
              class="service-card"
              :class="{ active: selectedServices.includes('polish') }"
              @click="toggleService('polish')"
            >
              <div class="service-icon">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="15" y="25" width="50" height="35" rx="5"/>
                  <path d="M25 35 L35 45 L55 35"/>
                  <circle cx="30" cy="52" r="3"/>
                  <circle cx="50" cy="52" r="3"/>
                  <path d="M28 28 L32 24 L36 28 M44 28 L48 24 L52 28"/>
                  <circle cx="40" cy="20" r="3" fill="currentColor"/>
                </svg>
              </div>
              <p>ขัดสี</p>
              <span class="price">1,000.-</span>
            </div>

            <div 
              class="service-card"
              :class="{ active: selectedServices.includes('interior') }"
              @click="toggleService('interior')"
            >
              <div class="service-icon">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="20" y="25" width="40" height="35" rx="5"/>
                  <rect x="28" y="32" width="24" height="20" rx="2"/>
                  <line x1="40" y1="32" x2="40" y2="52"/>
                  <circle cx="32" cy="55" r="2"/>
                  <circle cx="48" cy="55" r="2"/>
                </svg>
              </div>
              <p>จัดเบาะ</p>
              <span class="price">2,000.-</span>
            </div>
          </div>
        </div>

        <!-- Confirm Button -->
        <div class="confirm-section">
          <button 
            class="btn-confirm"
            :disabled="!selectedVehicle || selectedServices.length === 0"
            @click="confirmBooking"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedVehicle = ref('');
const selectedServices = ref<string[]>([]);

const toggleService = (service: string) => {
  const index = selectedServices.value.indexOf(service);
  if (index > -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(service);
  }
};

const confirmBooking = () => {
  if (selectedVehicle.value && selectedServices.value.length > 0) {
    alert(`จองสำเร็จ!\nประเภทรถ: ${selectedVehicle.value}\nบริการ: ${selectedServices.value.join(', ')}`);
    // Navigate to confirmation page or show success message
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.booking-page {
  min-height: 100vh;
  background: #000;
  color: white;
  font-family: 'Kanit', 'Sarabun', sans-serif;
}

/* Header - same as Home */
.header {
  background: rgba(0, 0, 0, 0.95);
  border-bottom: 1px solid rgba(220, 38, 38, 0.2);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(15px);
}

.header .container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
}

.logo-text {
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 2px;
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

.nav a:hover {
  color: #dc2626;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.btn-register, .btn-login {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-size: 0.85rem;
}

.btn-login {
  background: #dc2626;
  border-color: #dc2626;
}

.btn-cart, .btn-user {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem 0.7rem;
  transition: all 0.3s;
}

/* Booking Section */
.booking-section {
  margin-top: 100px;
  padding: 3rem 2rem;
  min-height: calc(100vh - 100px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.booking-header {
  text-align: center;
  margin-bottom: 3rem;
}

.title-top {
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 0;
  color: white;
}

.title-main {
  font-size: 4rem;
  font-weight: 900;
  color: #dc2626;
  margin: -0.5rem 0 1rem;
  text-shadow: 0 0 40px rgba(220, 38, 38, 0.6);
}

.subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
}

/* Selection Section */
.selection-section, .service-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

/* Vehicle Grid */
.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.vehicle-card {
  background: rgba(30, 30, 30, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.vehicle-card:hover {
  background: rgba(50, 50, 50, 0.9);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-5px);
}

.vehicle-card.active {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
}

.vehicle-icon {
  width: 80px;
  height: 60px;
  margin: 0 auto 1rem;
  color: white;
}

.vehicle-card.active .vehicle-icon {
  color: #dc2626;
}

.vehicle-card p {
  font-size: 1rem;
  font-weight: 600;
}

/* Service Grid */
.service-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
}

.service-card {
  background: rgba(30, 30, 30, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.service-card:hover {
  background: rgba(50, 50, 50, 0.9);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-5px);
}

.service-card.active {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
}

.service-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  color: white;
}

.service-card.active .service-icon {
  color: #dc2626;
}

.service-card p {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.price {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #dc2626;
}

/* Confirm Button */
.confirm-section {
  text-align: center;
  margin-top: 3rem;
}

.btn-confirm {
  background: #dc2626;
  color: white;
  border: 3px solid #dc2626;
  padding: 1.2rem 5rem;
  border-radius: 10px;
  font-size: 1.8rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.btn-confirm:hover:not(:disabled) {
  background: transparent;
  color: #dc2626;
  transform: scale(1.05);
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.5);
}

.btn-confirm:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1024px) {
  .vehicle-grid, .service-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .title-main {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .vehicle-grid, .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .title-top {
    font-size: 2rem;
  }
  
  .title-main {
    font-size: 2.5rem;
  }
  
  .btn-confirm {
    padding: 1rem 3rem;
    font-size: 1.3rem;
  }
}
</style>