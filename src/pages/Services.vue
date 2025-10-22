<template>
  <div class="services-page">
    <!-- Navigator Component -->
    <Navigator />

    <!-- Services Hero Section -->
    <section class="services-hero">
      <div class="services-overlay"></div>
      
      <div class="services-content">
        <h1 class="main-title">บริการ</h1>
        
        <div class="services-section">
          <h2 class="section-title">เลือกบริการ</h2>
          
          <div class="services-grid">
            <!-- Service 1 -->
            <div class="service-card" @click="selectService('coating')">
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
              <p class="service-desc">เคลือบแก้วป้องกันสีรถ</p>
            </div>

            <!-- Service 2 -->
            <div class="service-card" @click="selectService('wash')">
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
              <p class="service-desc">ล้างรถทั่วทั้งคัน</p>
            </div>

            <!-- Service 3 -->
            <div class="service-card" @click="selectService('vacuum')">
              <div class="service-icon">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="28" width="24" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/>
                  <path d="M32 28V16M28 16h8M30 12h4" stroke="currentColor" stroke-width="2"/>
                  <line x1="24" y1="32" x2="40" y2="32" stroke="currentColor" stroke-width="2"/>
                  <line x1="24" y1="36" x2="40" y2="36" stroke="currentColor" stroke-width="2"/>
                  <line x1="24" y1="40" x2="40" y2="40" stroke="currentColor" stroke-width="2"/>
                  <path d="M44 36h4M44 32h6M44 40h3" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <p class="service-name">ดูดฝุ่น</p>
              <p class="service-price">80.-</p>
              <p class="service-desc">ทำความสะอาดภายใน</p>
            </div>

            <!-- Service 4 -->
            <div class="service-card" @click="selectService('polish')">
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
              <p class="service-desc">ขัดเงาสีรถให้เหมือนใหม่</p>
            </div>

            <!-- Service 5 -->
            <div class="service-card" @click="selectService('interior')">
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
              <p class="service-desc">ทำความสะอาดเบาะทุกที่นั่ง</p>
            </div>
          </div>

          <!-- Book Now Button -->
          <div class="action-section">
            <button class="btn-book-service" @click="goToBooking">
              จองบริการเลย
            </button>
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
import Navigator from '../components/Navigator.vue';

const router = useRouter();

const selectService = (service: string) => {
  console.log('Selected service:', service);
  router.push({
    path: '/booking',
    query: { service: service }
  });
};

const goToBooking = () => {
  router.push('/booking');
};
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
  margin: 0 auto 3rem;
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
  margin-bottom: 0.5rem;
}

.service-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
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

.service-card:hover .service-desc {
  color: rgba(255, 255, 255, 0.9);
}

/* Action Section */
.action-section {
  text-align: center;
  margin-top: 2rem;
}

.btn-book-service {
  background: #dc2626;
  color: white;
  border: none;
  padding: 1.2rem 4rem;
  border-radius: 10px;
  font-size: 1.3rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-book-service:hover {
  background: #b91c1c;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.6);
}

/* Responsive */
@media (max-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
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