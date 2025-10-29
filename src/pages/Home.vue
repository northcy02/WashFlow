<!-- src/pages/home.vue -->
<template>
  <div class="home-page">
    <!-- Navigator Component -->
    <Navigator />

    <!-- Hero Banner - Featured Content -->
    <section class="hero-banner">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <div class="featured-info">
          <h3>ทำไมถึงต้องจองกับเรา?</h3>
          
          <div class="info-list">
            <div class="info-item">
              <span class="icon">🚗</span>
              <div class="info-text">
                <h4>บริการรวดเร็วทันใจ</h4>
                <div class="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            
            <div class="info-item">
              <span class="icon">💎</span>
              <div class="info-text">
                <h4>บริการมาตราฐานระดับสูง</h4>
                <div class="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            
            <div class="info-item">
              <span class="icon">⚡</span>
              <div class="info-text">
                <h4>ความปลอดภัยและสะอาด</h4>
                <div class="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            <div class="info-item">
              <span class="icon">💰</span>
              <div class="info-text">
                <h4>ราคาสมเหตุสมผล</h4>
                <div class="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            <div class="info-item">
              <span class="icon">🏆</span>
              <div class="info-text">
                <h4>ทีมงานมืออาชีพ</h4>
                <div class="rating">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

            <div class="info-item">
              <span class="icon">📱</span>
              <div class="info-text">
                <h4>จองง่ายผ่านแอพ</h4>
                <div class="rating">⭐⭐⭐⭐⭐</div>
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
          <h1 class="cta-title" @click="goToBooking" style="cursor: pointer;">
            <span class="highlight">จองล้าง</span>
            <span class="text-white">รถตอนนี้</span>
            <span class="text-red">CLICK NOW!</span>
          </h1>
          <button class="btn-booking" @click="goToBooking">จองคิวเลย</button>
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
          <div class="service-item" @click="goToServices">
            <div class="service-icon-svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                <!-- Car Icon -->
                <path d="M12 24l4-8h32l4 8M12 24v16h40V24M12 40h4m24 0h4M12 24h40"/>
                <circle cx="20" cy="40" r="4"/>
                <circle cx="44" cy="40" r="4"/>
                <path d="M16 24h32M20 16h24"/>
                <path d="M28 12l-2 4M36 12l2 4"/>
              </svg>
            </div>
            <p>เคลือบสีรถ</p>
          </div>
          
          <div class="service-item" @click="goToServices">
            <div class="service-icon-svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                <!-- Car Wash Icon -->
                <path d="M12 28l4-8h32l4 8M12 28v12h40V28"/>
                <circle cx="20" cy="40" r="3"/>
                <circle cx="44" cy="40" r="3"/>
                <path d="M20 12v8M26 8v12M32 10v10M38 8v12M44 12v8"/>
                <circle cx="20" cy="12" r="1.5"/>
                <circle cx="26" cy="8" r="1.5"/>
                <circle cx="32" cy="10" r="1.5"/>
                <circle cx="38" cy="8" r="1.5"/>
                <circle cx="44" cy="12" r="1.5"/>
              </svg>
            </div>
            <p>ล้างรถ</p>
          </div>
          
          <div class="service-item" @click="goToServices">
            <div class="service-icon-svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                <!-- Polish Icon -->
                <path d="M12 26l4-8h32l4 8M12 26v14h40V26"/>
                <circle cx="20" cy="40" r="3"/>
                <circle cx="44" cy="40" r="3"/>
                <path d="M24 18l8-2 8 2"/>
                <circle cx="32" cy="14" r="3"/>
                <path d="M28 14l8 0M30 11l4 0"/>
              </svg>
            </div>
            <p>ขัดสีรถ</p>
          </div>
          
          <div class="service-item" @click="goToServices">
            <div class="service-icon-svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                <!-- Vacuum Icon -->
                <rect x="20" y="28" width="24" height="16" rx="2"/>
                <path d="M32 28V16M28 16h8M30 12h4"/>
                <line x1="24" y1="32" x2="40" y2="32"/>
                <line x1="24" y1="36" x2="40" y2="36"/>
                <line x1="24" y1="40" x2="40" y2="40"/>
                <path d="M44 36h4M44 32h6M44 40h3"/>
              </svg>
            </div>
            <p>ดูดฝุ่น</p>
          </div>
          
          <div class="service-item" @click="goToServices">
            <div class="service-icon-svg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                <!-- Tools Icon -->
                <path d="M20 20l12 12M32 32l-8 8"/>
                <circle cx="16" cy="16" r="4"/>
                <circle cx="28" cy="36" r="3"/>
                <path d="M36 20h12v12M48 20l-8 8"/>
                <rect x="38" y="38" width="10" height="10" rx="1"/>
              </svg>
            </div>
            <p>อื่นๆ</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Section - NO TIME TO LEAVE YOUR CAR DIRTY -->
    <section class="featured-dirty-section">
      <div class="container">
        <div class="dirty-grid">
          <!-- Left Card - Services Menu -->
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

          <!-- Center Image with Text -->
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

          <!-- Right Card - Professional Service -->
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

    <!-- Bottom Cards Section -->
    <section class="bottom-cards">
      <div class="container">
        <div class="cards-grid-redesign">
          <!-- Left Column: 2 Rows -->
          <div class="left-column">
            <!-- Card 1: Top - Car Detail with Text -->
            <div class="detail-card wide-card" @click="goToBooking">
              <div class="card-overlay"></div>
              <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000" alt="Car Wash Service">
              <div class="card-info bottom-left">
                <h3>บริการทำความสะอาดรถยนต์</h3>
              </div>
            </div>

            <!-- Bottom Row: 1 Card -->
            <div class="bottom-row">
              <!-- Card 3: Steering Wheel -->
              <div class="detail-card small-card" @click="goToCarTypes">
                <div class="card-overlay"></div>
                <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1000" alt="Car Interior">
                <div class="card-info centered">
                  <h3>ภายในสะอาดน่านั่ง</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Tall Card -->
          <div class="detail-card tall-card-right" @click="goToBooking">
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
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';

const router = useRouter();

// Function สำหรับไปหน้าจองคิว
const goToBooking = () => {
  router.push('/booking');
};

// Function สำหรับไปหน้าบริการ
const goToServices = () => {
  router.push('/services');
};

// Function สำหรับไปหน้าประเภทรถ
const goToCarTypes = () => {
  router.push('/car-types');
};
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