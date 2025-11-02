<!-- src/pages/CarTypes.vue - ENHANCED VERSION -->
<template>
  <div class="car-types-page">
    <Navigator />

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="icon">🚗</span>
            <span class="title-text">เลือกประเภทรถของคุณ</span>
          </h1>
          <p class="hero-subtitle">เลือกรถที่เหมาะสม รับบริการที่คุ้มค่า</p>
          
          <!-- Quick Filter -->
          <div class="quick-filter">
            <button 
              :class="['filter-btn', { active: filterSize === '' }]"
              @click="filterSize = ''"
            >
              <span>ทั้งหมด</span>
            </button>
            <button 
              :class="['filter-btn', { active: filterSize === 'S' }]"
              @click="filterSize = 'S'"
            >
              <span>ขนาดเล็ก</span>
            </button>
            <button 
              :class="['filter-btn', { active: filterSize === 'M' }]"
              @click="filterSize = 'M'"
            >
              <span>ขนาดกลาง</span>
            </button>
            <button 
              :class="['filter-btn', { active: filterSize === 'L' }]"
              @click="filterSize = 'L'"
            >
              <span>ขนาดใหญ่</span>
            </button>
            <button 
              :class="['filter-btn', { active: filterSize === 'XL' }]"
              @click="filterSize = 'XL'"
            >
              <span>ขนาดใหญ่พิเศษ</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="main">
      <div class="container">
        <!-- Vehicle Cards Grid -->
        <div class="grid">
          <div 
            v-for="(car, index) in filteredCarTypes" 
            :key="car.id"
            class="card"
            :class="{ 
              popular: car.popular, 
              recommended: car.recommended,
              premium: car.premium 
            }"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="selectCarType(car.id)"
          >
            <!-- Card Badges -->
            <div class="card-badges">
              <span v-if="car.popular" class="badge-tag popular">🔥 นิยม</span>
              <span v-if="car.recommended" class="badge-tag recommended">⭐ แนะนำ</span>
              <span v-if="car.premium" class="badge-tag premium">👑 พรีเมียม</span>
            </div>

            <!-- Card Glow Effect -->
            <div class="card-glow"></div>

            <!-- Vehicle Image -->
            <div class="image-wrapper">
              <div class="image-background"></div>
              <img :src="car.image" :alt="car.name" class="car-image">
              <div class="image-reflection"></div>
            </div>

            <!-- Vehicle Info -->
            <div class="car-info">
              <h3>{{ car.name }}</h3>
              <p class="car-desc">{{ car.desc }}</p>
              
              <!-- Size Badge -->
              <div class="size-badge-container">
                <span class="size-badge" :class="car.size.toLowerCase()">
                  <span class="size-icon">📏</span>
                  <span>{{ getSizeText(car.size) }}</span>
                </span>
              </div>

              <!-- Price Section -->
              <div class="price-section">
                <div class="price-badge">
                  <span class="price-label">ราคาเริ่มต้น</span>
                  <div class="price-amount">
                    <span class="currency">฿</span>
                    <span class="price">{{ car.basePrice.toLocaleString() }}</span>
                  </div>
                </div>

                <!-- Multiplier Info -->
                <div class="multiplier-info">
                  <span class="multiplier-label">ตัวคูณราคา</span>
                  <span class="multiplier-value">×{{ car.multiplier }}</span>
                  <span class="multiplier-percent" :class="getMultiplierClass(car.multiplier)">
                    {{ getMultiplierPercent(car.multiplier) }}
                  </span>
                </div>
              </div>

              <!-- Features List -->
              <div class="features-list">
                <div v-for="feature in car.features" :key="feature" class="feature-item">
                  <span class="feature-icon">✓</span>
                  <span class="feature-text">{{ feature }}</span>
                </div>
              </div>

              <!-- Action Button -->
              <button class="btn-select">
                <span class="btn-text">เลือกรถนี้</span>
                <span class="btn-icon">→</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Comparison Guide -->
        <div class="comparison-section">
          <h2 class="section-heading">
            <span class="icon">📊</span>
            <span>เปรียบเทียบประเภทรถ</span>
          </h2>

          <div class="comparison-table-wrapper">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>ประเภท</th>
                  <th>ขนาด</th>
                  <th>ราคาเริ่มต้น</th>
                  <th>ตัวคูณ</th>
                  <th>เหมาะสำหรับ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="car in carTypes" :key="car.id" @click="selectCarType(car.id)">
                  <td>
                    <div class="table-car-info">
                      <img :src="car.image" :alt="car.name" class="table-car-icon">
                      <span>{{ car.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="size-label" :class="car.size.toLowerCase()">{{ car.size }}</span>
                  </td>
                  <td class="price-cell">฿{{ car.basePrice.toLocaleString() }}</td>
                  <td class="multiplier-cell">×{{ car.multiplier }}</td>
                  <td class="suitable-cell">{{ car.suitableFor }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">💡</div>
            <h3>ราคาที่แสดงคือราคาเริ่มต้น</h3>
            <p>ราคาจริงจะคำนวณจาก: <strong>ราคาบริการ × ตัวคูณของรถ</strong></p>
            <p class="example">ตัวอย่าง: ล้างรถเก๋ง (฿200 × 1.0) = ฿200</p>
          </div>

          <div class="info-card highlight">
            <div class="info-icon">🎯</div>
            <h3>วิธีเลือกที่เหมาะสม</h3>
            <ul class="tips-list">
              <li>รถเล็ก → ประหยัด</li>
              <li>รถใหญ่ → ใช้เวลามากขึ้น</li>
              <li>รถสปอร์ต → ดูแลพิเศษ</li>
            </ul>
          </div>

          <div class="info-card promo">
            <div class="info-icon">🎁</div>
            <h3>โปรโมชั่นพิเศษ</h3>
            <p class="promo-text">จอง 2 บริการขึ้นไป รับส่วนลด <strong>10-20%</strong></p>
            <router-link to="/services" class="promo-link">ดูบริการทั้งหมด →</router-link>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
          <div class="cta-content">
            <h2>พร้อมจองแล้วหรือยัง?</h2>
            <p>เริ่มต้นดูแลรถของคุณวันนี้</p>
            <div class="cta-buttons">
              <router-link to="/booking" class="btn-cta primary">
                <span>📅</span>
                <span>จองบริการเลย</span>
              </router-link>
              <router-link to="/services" class="btn-cta secondary">
                <span>🔍</span>
                <span>ดูบริการทั้งหมด</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';

const router = useRouter();
const filterSize = ref('');

// Enhanced Car Types Data
const carTypes = [
  { 
    id: 'motorcycle',
    name: 'มอเตอร์ไซค์',
    desc: 'Motorcycle',
    size: 'S',
    basePrice: 150,
    multiplier: 0.80,
    image: '/icons/motorcycle.svg',
    popular: true,
    recommended: false,
    premium: false,
    suitableFor: 'ใช้งานประจำวัน',
    features: [
      'ล้างเร็ว 15-20 นาที',
      'ราคาประหยัด',
      'เหมาะกับงานด่วน'
    ]
  },
  { 
    id: 'sedan',
    name: 'รถเก๋ง',
    desc: 'Sedan',
    size: 'M',
    basePrice: 250,
    multiplier: 1.00,
    image: '/icons/sedan.svg',
    popular: true,
    recommended: true,
    premium: false,
    suitableFor: 'ทั่วไป ครอบครัว',
    features: [
      'มาตรฐานราคา',
      'เหมาะสำหรับทุกคน',
      'ระยะเวลา 30-45 นาที'
    ]
  },
  { 
    id: 'pickup',
    name: 'รถกระบะ',
    desc: 'Pickup Truck',
    size: 'L',
    basePrice: 300,
    multiplier: 1.20,
    image: '/icons/pickup.svg',
    popular: true,
    recommended: false,
    premium: false,
    suitableFor: 'ทำงาน ขนของ',
    features: [
      'พื้นที่ใหญ่',
      'ดูแลกระบะท้าย',
      'ระยะเวลา 45-60 นาที'
    ]
  },
  { 
    id: 'van',
    name: 'รถตู้',
    desc: 'Van / MPV',
    size: 'XL',
    basePrice: 400,
    multiplier: 1.30,
    image: '/icons/van.svg',
    popular: false,
    recommended: false,
    premium: false,
    suitableFor: 'ครอบครัวใหญ่',
    features: [
      'ทำความสะอาดทุกแถว',
      'พื้นที่กว้างขวาง',
      'ระยะเวลา 60-90 นาที'
    ]
  },
  { 
    id: 'sports',
    name: 'รถสปอร์ต',
    desc: 'Sports Car',
    size: 'M',
    basePrice: 500,
    multiplier: 1.50,
    image: '/icons/sports.svg',
    popular: false,
    recommended: false,
    premium: true,
    suitableFor: 'รถหรู สะสม',
    features: [
      'ดูแลพิเศษ',
      'ผลิตภัณฑ์คุณภาพสูง',
      'ช่างเชี่ยวชาญ'
    ]
  }
];

// Computed
const filteredCarTypes = computed(() => {
  if (!filterSize.value) return carTypes;
  return carTypes.filter(car => car.size === filterSize.value);
});

// Methods
const getSizeText = (size: string) => {
  const sizeMap: Record<string, string> = {
    'S': 'เล็ก',
    'M': 'กลาง',
    'L': 'ใหญ่',
    'XL': 'ใหญ่พิเศษ'
  };
  return sizeMap[size] || size;
};

const getMultiplierPercent = (multiplier: number) => {
  if (multiplier === 1.00) return 'มาตรฐาน';
  const percent = ((multiplier - 1) * 100).toFixed(0);
  return multiplier > 1 ? `+${percent}%` : `${percent}%`;
};

const getMultiplierClass = (multiplier: number) => {
  if (multiplier > 1) return 'increase';
  if (multiplier < 1) return 'decrease';
  return 'standard';
};

const selectCarType = (type: string) => {
  const car = carTypes.find(c => c.id === type);
  
  Swal.fire({
    title: `🚗 ${car?.name}`,
    html: `
      <div class="swal-car-detail">
        <div class="swal-header">
          <img src="${car?.image}" alt="${car?.name}" class="swal-car-image">
        </div>
        
        <div class="swal-body">
          <div class="swal-info-row">
            <span class="label">ขนาด:</span>
            <span class="value">${getSizeText(car?.size || '')}</span>
          </div>
          <div class="swal-info-row">
            <span class="label">ราคาเริ่มต้น:</span>
            <span class="value highlight">฿${car?.basePrice.toLocaleString()}</span>
          </div>
          <div class="swal-info-row">
            <span class="label">ตัวคูณราคา:</span>
            <span class="value">×${car?.multiplier} ${getMultiplierPercent(car?.multiplier || 1)}</span>
          </div>
          
          <div class="swal-divider"></div>
          
          <div class="swal-features">
            <h4>คุณสมบัติ:</h4>
            ${car?.features.map(f => `<p>✓ ${f}</p>`).join('')}
          </div>
          
          <div class="swal-suitable">
            <p><strong>เหมาะสำหรับ:</strong> ${car?.suitableFor}</p>
          </div>
        </div>
      </div>
    `,
    icon: 'question',
    iconColor: '#dc2626',
    showCancelButton: true,
    confirmButtonText: '📅 ไปจองเลย',
    cancelButtonText: 'ดูรถอื่น',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    width: '600px',
    customClass: {
      popup: 'car-detail-popup'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      router.push({
        path: '/booking',
        query: { 
          carType: type,
          basePrice: car?.basePrice
        }
      });
    }
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
  color: #fff;
}

/* ========================================
   HERO SECTION
======================================== */
.hero-section {
  margin-top: 80px;
  padding: 5rem 2rem 3rem;
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
    radial-gradient(circle at 30% 50%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%);
  animation: backgroundPulse 8s ease-in-out infinite;
}

@keyframes backgroundPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: heroSlideDown 0.8s ease-out;
}

@keyframes heroSlideDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title .icon {
  font-size: 4rem;
  filter: drop-shadow(0 10px 30px rgba(220, 38, 38, 0.6));
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.title-text {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2.5rem;
  font-weight: 400;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ========================================
   QUICK FILTER
======================================== */
.quick-filter {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeIn 0.8s ease-out 0.5s both;
}

.filter-btn {
  padding: 0.8rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.filter-btn:hover::before {
  width: 300px;
  height: 300px;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(220, 38, 38, 0.5);
  color: #fff;
  transform: translateY(-3px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  color: #fff;
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.5);
}

/* ========================================
   MAIN SECTION
======================================== */
.main {
  padding: 4rem 2rem;
  background: #0a0a0a;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* ========================================
   VEHICLE CARDS GRID
======================================== */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-bottom: 5rem;
}

.card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  transform-style: preserve-3d;
  animation: cardZoomIn 0.6s ease-out both;
}

@keyframes cardZoomIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.card-glow {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 60%);
  opacity: 0;
  transition: all 0.8s;
  pointer-events: none;
}

.card:hover .card-glow {
  opacity: 1;
  top: -50%;
  left: -50%;
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card:hover {
  transform: translateY(-20px) scale(1.05);
  border-color: rgba(220, 38, 38, 0.6);
  background: rgba(220, 38, 38, 0.08);
  box-shadow: 
    0 30px 80px rgba(220, 38, 38, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.card.popular {
  border-color: rgba(251, 191, 36, 0.4);
}

.card.recommended {
  border-color: rgba(16, 185, 129, 0.4);
}

.card.premium {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(124, 58, 237, 0.08));
  border-color: rgba(168, 85, 247, 0.4);
}

/* ========================================
   CARD BADGES
======================================== */
.card-badges {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
}

.badge-tag {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: badgeSlideIn 0.5s ease-out both;
}

@keyframes badgeSlideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.badge-tag.popular {
  background: linear-gradient(135deg, #f87171, #dc2626);
  color: #fff;
}

.badge-tag.recommended {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #fff;
}

.badge-tag.premium {
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
  color: #fff;
}

/* ========================================
   IMAGE WRAPPER
======================================== */
.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 1.5rem;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%);
  animation: bgPulse 3s ease-in-out infinite;
}

@keyframes bgPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
  transition: all 0.5s;
  filter: drop-shadow(0 10px 30px rgba(220, 38, 38, 0.3));
  z-index: 1;
}

.card:hover .car-image {
  transform: scale(1.2) rotate(5deg);
  filter: drop-shadow(0 15px 40px rgba(220, 38, 38, 0.6));
}

.image-reflection {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.5s;
}

.card:hover .image-reflection {
  opacity: 1;
}

/* ========================================
   CAR INFO
======================================== */
.car-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.car-info h3 {
  font-size: 1.6rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 0.3rem;
  transition: all 0.3s;
}

.card:hover .car-info h3 {
  color: #dc2626;
  transform: scale(1.05);
}

.car-desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.size-badge-container {
  margin-bottom: 1rem;
}

.size-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s;
}

.size-badge.s {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #22c55e;
}

.size-badge.m {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #3b82f6;
}

.size-badge.l {
  background: rgba(251, 191, 36, 0.2);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fbbf24;
}

.size-badge.xl {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.card:hover .size-badge {
  transform: scale(1.1);
  box-shadow: 0 0 20px currentColor;
}

/* ========================================
   PRICE SECTION
======================================== */
.price-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 1rem;
}

.price-badge {
  text-align: center;
}

.price-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.price-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.3rem;
}

.currency {
  font-size: 1.2rem;
  font-weight: 700;
  color: #dc2626;
}

.price {
  font-size: 2.5rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
  line-height: 1;
}

.multiplier-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 10px;
}

.multiplier-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.multiplier-value {
  font-size: 1.8rem;
  font-weight: 900;
  color: #3b82f6;
  line-height: 1;
}

.multiplier-percent {
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
}

.multiplier-percent.increase {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.multiplier-percent.decrease {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.multiplier-percent.standard {
  background: rgba(107, 114, 128, 0.2);
  color: #9ca3af;
}

/* ========================================
   FEATURES LIST
======================================== */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s;
}

.card:hover .feature-item {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(5px);
}

.feature-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 900;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.4);
}

/* ========================================
   SELECT BUTTON
======================================== */
.btn-select {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border: 2px solid rgba(220, 38, 38, 0.4);
  border-radius: 15px;
  color: #dc2626;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.btn-select::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.card:hover .btn-select::before {
  left: 100%;
}

.card:hover .btn-select {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.5);
}

.btn-icon {
  font-size: 1.3rem;
  transition: transform 0.3s;
}

.card:hover .btn-icon {
  transform: translateX(5px);
}

/* ========================================
   COMPARISON SECTION
======================================== */
.comparison-section {
  margin-bottom: 5rem;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 3rem;
  color: #fff;
}

.section-heading .icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 5px 20px rgba(220, 38, 38, 0.5));
}

.comparison-table-wrapper {
  overflow-x: auto;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table thead {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border-bottom: 3px solid rgba(220, 38, 38, 0.5);
}

.comparison-table th {
  padding: 1.5rem 1rem;
  text-align: left;
  font-size: 1rem;
  font-weight: 700;
  color: #dc2626;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.comparison-table tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.comparison-table tbody tr:hover {
  background: rgba(220, 38, 38, 0.08);
  transform: scale(1.01);
}

.comparison-table td {
  padding: 1.5rem 1rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
}

.table-car-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.table-car-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: invert(1) drop-shadow(0 2px 8px rgba(220, 38, 38, 0.5));
}

.size-label {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 700;
}

.size-label.s { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.size-label.m { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.size-label.l { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
.size-label.xl { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.price-cell {
  font-weight: 700;
  color: #10b981;
  font-size: 1.1rem;
}

.multiplier-cell {
  font-weight: 700;
  color: #3b82f6;
  font-size: 1.1rem;
}

.suitable-cell {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

/* ========================================
   INFO GRID
======================================== */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

.info-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
  transition: left 0.6s;
}

.info-card:hover::before {
  left: 100%;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(220, 38, 38, 0.3);
}

.info-card.highlight {
  border-color: rgba(251, 191, 36, 0.4);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.05), rgba(245, 158, 11, 0.05));
}

.info-card.promo {
  border-color: rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05));
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 5px 20px rgba(220, 38, 38, 0.5));
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.info-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
}

.info-card p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.info-card strong {
  color: #dc2626;
  font-weight: 900;
}

.example {
  padding: 0.75rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border-left: 3px solid #dc2626;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.tips-list {
  list-style: none;
  display: flex;
    flex-direction: column;
  gap: 0.75rem;
}

.tips-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 10px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
}

.tips-list li::before {
  content: '→';
  color: #fbbf24;
  font-weight: 900;
  font-size: 1.2rem;
}

.info-card.highlight:hover .tips-list li {
  background: rgba(251, 191, 36, 0.2);
  transform: translateX(5px);
}

.promo-text {
  font-size: 1.1rem;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 1rem;
}

.promo-text strong {
  color: #fbbf24;
  font-size: 1.3rem;
}

.promo-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(16, 185, 129, 0.2);
  border: 2px solid rgba(16, 185, 129, 0.4);
  border-radius: 25px;
  color: #10b981;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.promo-link:hover {
  background: rgba(16, 185, 129, 0.3);
  border-color: #10b981;
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
}

/* ========================================
   CTA SECTION
======================================== */
.cta-section {
  text-align: center;
  padding: 5rem 3rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(139, 0, 0, 0.15));
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 30px;
  position: relative;
  overflow: hidden;
  margin-top: 4rem;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 60%);
  animation: ctaGlow 6s ease-in-out infinite;
}

@keyframes ctaGlow {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  50% { transform: translate(-10%, -10%) scale(1.2); opacity: 1; }
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-content p {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2.5rem;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.3rem 3rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.btn-cta::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.btn-cta:hover::before {
  width: 400px;
  height: 400px;
}

.btn-cta.primary {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
  border: 2px solid #dc2626;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4);
}

.btn-cta.primary:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.6);
}

.btn-cta.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.btn-cta.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.1);
}

/* ========================================
   SWAL CUSTOM STYLES
======================================== */
:global(.car-detail-popup) {
  border: 2px solid rgba(220, 38, 38, 0.4) !important;
  border-radius: 25px !important;
  backdrop-filter: blur(20px) !important;
}

:global(.swal-car-detail) {
  text-align: left;
  padding: 1.5rem;
}

:global(.swal-header) {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 15px;
}

:global(.swal-car-image) {
  width: 150px;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(220, 38, 38, 0.5));
}

:global(.swal-body) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:global(.swal-info-row) {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 1rem;
}

:global(.swal-info-row .label) {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

:global(.swal-info-row .value) {
  color: #fff;
  font-weight: 700;
}

:global(.swal-info-row .value.highlight) {
  color: #dc2626;
  font-size: 1.3rem;
}

:global(.swal-divider) {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  margin: 1rem 0;
}

:global(.swal-features) {
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 10px;
}

:global(.swal-features h4) {
  color: #10b981;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

:global(.swal-features p) {
  color: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 0;
  font-size: 0.95rem;
}

:global(.swal-suitable) {
  padding: 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 10px;
  text-align: center;
}

:global(.swal-suitable strong) {
  color: #fbbf24;
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .quick-filter {
    gap: 0.75rem;
  }

  .filter-btn {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }

  .grid {
    gap: 2rem;
  }

  .comparison-section {
    overflow-x: auto;
  }

  .comparison-table {
    min-width: 800px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1.5rem 2.5rem;
  }

  .title-text {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .quick-filter {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-btn {
    width: 100%;
  }

  .main {
    padding: 3rem 1.5rem;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .card {
    padding: 1.5rem;
  }

  .image-wrapper {
    height: 180px;
  }

  .car-info h3 {
    font-size: 1.4rem;
  }

  .price {
    font-size: 2rem;
  }

  .section-heading {
    font-size: 1.8rem;
    flex-direction: column;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .cta-section {
    padding: 3rem 2rem;
  }

  .cta-content h2 {
    font-size: 2rem;
  }

  .cta-content p {
    font-size: 1.1rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn-cta {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 3rem 1rem 2rem;
  }

  .hero-title .icon {
    font-size: 3rem;
  }

  .title-text {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .main {
    padding: 2rem 1rem;
  }

  .card {
    padding: 1.2rem;
  }

  .card-badges {
    top: 0.75rem;
    right: 0.75rem;
  }

  .badge-tag {
    padding: 0.3rem 0.8rem;
    font-size: 0.7rem;
  }

  .image-wrapper {
    height: 150px;
  }

  .car-info h3 {
    font-size: 1.2rem;
  }

  .car-desc {
    font-size: 0.85rem;
  }

  .price {
    font-size: 1.8rem;
  }

  .currency {
    font-size: 1rem;
  }

  .multiplier-value {
    font-size: 1.5rem;
  }

  .features-list {
    gap: 0.5rem;
  }

  .feature-item {
    font-size: 0.85rem;
    padding: 0.4rem;
  }

  .btn-select {
    padding: 1rem;
    font-size: 0.95rem;
  }

  .section-heading {
    font-size: 1.5rem;
  }

  .section-heading .icon {
    font-size: 2rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 1rem 0.75rem;
    font-size: 0.85rem;
  }

  .table-car-icon {
    width: 30px;
    height: 30px;
  }

  .info-card {
    padding: 1.5rem;
  }

  .info-icon {
    font-size: 2.5rem;
  }

  .info-card h3 {
    font-size: 1.1rem;
  }

  .info-card p {
    font-size: 0.9rem;
  }

  .cta-section {
    padding: 2.5rem 1.5rem;
  }

  .cta-content h2 {
    font-size: 1.6rem;
  }

  .cta-content p {
    font-size: 1rem;
  }

  .btn-cta {
    padding: 1.1rem 2rem;
    font-size: 1rem;
  }
}

/* ========================================
   SCROLLBAR CUSTOM
======================================== */
.comparison-table-wrapper::-webkit-scrollbar {
  height: 10px;
}

.comparison-table-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.comparison-table-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #dc2626, #991b1b);
  border-radius: 10px;
}

.comparison-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(90deg, #b91c1c, #7f1d1d);
}

/* ========================================
   ACCESSIBILITY
======================================== */
.card:focus-visible,
.filter-btn:focus-visible,
.btn-select:focus-visible,
.btn-cta:focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 4px;
}

.comparison-table tbody tr:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
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

  .card-glow,
  .image-background,
  .hero-background,
  .stat-background {
    animation: none !important;
  }
}

/* ========================================
   HIGH CONTRAST MODE
======================================== */
@media (prefers-contrast: high) {
  .card,
  .info-card,
  .comparison-table-wrapper {
    border-width: 3px;
  }

  .filter-btn,
  .btn-select,
  .btn-cta {
    border-width: 3px;
  }
}

/* ========================================
   PRINT STYLES
======================================== */
@media print {
  .hero-section,
  .quick-filter,
  .cta-section,
  .card-badges,
  .btn-select,
  .btn-cta,
  .filter-btn {
    display: none !important;
  }

  .card {
    border: 2px solid #000;
    page-break-inside: avoid;
  }

  .comparison-table {
    border: 1px solid #000;
  }

  .comparison-table th,
  .comparison-table td {
    border: 1px solid #000;
    color: #000;
  }
}

/* ========================================
   DARK MODE ENHANCEMENTS
======================================== */
@media (prefers-color-scheme: dark) {
  .car-types-page {
    background: #000;
  }
}

/* ========================================
   HOVER STATES ENHANCEMENTS
======================================== */
@media (hover: hover) {
  .card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(220, 38, 38, 0.1) 50%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.5s;
    pointer-events: none;
  }

  .card:hover::after {
    opacity: 1;
  }

  .info-card::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #dc2626, #fbbf24);
    border-radius: 20px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.5s;
  }

  .info-card:hover::after {
    opacity: 0.3;
    animation: borderGlow 2s ease-in-out infinite;
  }

  @keyframes borderGlow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
}

/* ========================================
   LOADING SKELETON (Optional)
======================================== */
.skeleton {
  background: linear-gradient(
    90deg,
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
   ENHANCED ANIMATIONS
======================================== */
@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: perspective(1000px) rotateY(-15deg) translateY(30px);
  }
  to {
    opacity: 1;
    transform: perspective(1000px) rotateY(0deg) translateY(0);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(220, 38, 38, 0.6);
  }
}

/* ========================================
   TOOLTIP (Optional Enhancement)
======================================== */
.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  padding: 0.75rem 1.2rem;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: 10px;
  font-size: 0.85rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  z-index: 100;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.95);
}

.card:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

/* ========================================
   CUSTOM SCROLLBAR FOR PAGE
======================================== */
.car-types-page::-webkit-scrollbar {
  width: 12px;
}

.car-types-page::-webkit-scrollbar-track {
  background: #0a0a0a;
}

.car-types-page::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #dc2626, #991b1b);
  border-radius: 10px;
  border: 2px solid #0a0a0a;
}

.car-types-page::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #b91c1c, #7f1d1d);
}

/* ========================================
   GLASS MORPHISM EFFECTS
======================================== */
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* ========================================
   GRADIENT TEXT EFFECTS
======================================== */
.gradient-text {
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ========================================
   NEON GLOW EFFECTS
======================================== */
.neon-red {
  text-shadow: 
    0 0 10px rgba(220, 38, 38, 0.8),
    0 0 20px rgba(220, 38, 38, 0.6),
    0 0 30px rgba(220, 38, 38, 0.4);
}

.neon-gold {
  text-shadow: 
    0 0 10px rgba(251, 191, 36, 0.8),
    0 0 20px rgba(251, 191, 36, 0.6),
    0 0 30px rgba(251, 191, 36, 0.4);
}

/* ========================================
   FOCUS STATES
======================================== */
.card:focus,
.filter-btn:focus,
.btn-select:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.3);
}

/* ========================================
   SELECTION STATES
======================================== */
.card.selected {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.15);
  box-shadow: 0 0 40px rgba(220, 38, 38, 0.5);
}

.card.selected::before {
  content: '✓';
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  z-index: 10;
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.5);
  animation: checkmarkPop 0.3s ease-out;
}

@keyframes checkmarkPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* ========================================
   INTERACTION FEEDBACK
======================================== */
.card:active {
  transform: translateY(-15px) scale(0.98);
}

.btn-select:active,
.btn-cta:active,
.filter-btn:active {
  transform: scale(0.95);
}

/* ========================================
   MICRO ANIMATIONS
======================================== */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 3s infinite;
}

/* ========================================
   PARALLAX EFFECT (Optional)
======================================== */
@media (min-width: 1024px) {
  .hero-background {
    transform: translateZ(-1px) scale(2);
  }

  .hero-content {
    transform: translateZ(0);
  }
}

/* ========================================
   SMOOTH SCROLL
======================================== */
html {
  scroll-behavior: smooth;
}

/* ========================================
   PREFERS REDUCED DATA
======================================== */
@media (prefers-reduced-data: reduce) {
  .hero-background,
  .card-glow,
  .image-background,
  .stat-background {
    display: none;
  }

  .car-image,
  .table-car-icon {
    filter: none;
  }
}

/* ========================================
   ADDITIONAL ENHANCEMENTS
======================================== */

/* Card Hover Lift Effect */
.card {
  will-change: transform;
}

/* Smooth State Transitions */
.card,
.filter-btn,
.btn-select,
.info-card {
  transition-property: transform, background-color, border-color, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Performance Optimization */
.card-glow,
.hero-background,
.image-background {
  will-change: transform, opacity;
}

/* Enhanced Focus for Keyboard Navigation */
.card:focus-visible,
.filter-btn:focus-visible,
.btn-select:focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 5px;
  box-shadow: 
    0 0 0 5px rgba(220, 38, 38, 0.2),
    0 20px 50px rgba(220, 38, 38, 0.4);
}

/* Safari Specific Fixes */
@supports (-webkit-touch-callout: none) {
  .card,
  .info-card {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}

/* Firefox Specific Fixes */
@-moz-document url-prefix() {
  .card:hover {
    transform: translateY(-20px) scale(1.05) translateZ(0);
  }
}
</style>

<style>
/* ========================================
   GLOBAL SWAL STYLES (Unscoped)
======================================== */
.car-detail-popup .swal2-popup {
  border: 2px solid rgba(220, 38, 38, 0.4) !important;
  border-radius: 25px !important;
  backdrop-filter: blur(20px) !important;
}

.swal-car-detail {
  text-align: left;
  padding: 1.5rem;
}

.swal-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(139, 0, 0, 0.15));
  border-radius: 15px;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.swal-car-image {
  width: 180px;
  height: auto;
  filter: drop-shadow(0 10px 40px rgba(220, 38, 38, 0.6));
  animation: carFloat 3s ease-in-out infinite;
}

@keyframes carFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.swal-body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.swal-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 1.05rem;
  transition: all 0.3s;
}

.swal-info-row:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.swal-info-row .label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.swal-info-row .value {
  color: #fff;
  font-weight: 700;
}

.swal-info-row .value.highlight {
  color: #dc2626;
  font-size: 1.5rem;
  text-shadow: 0 0 15px rgba(220, 38, 38, 0.6);
}

.swal-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  margin: 1.5rem 0;
}

.swal-features {
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
}

.swal-features h4 {
  color: #10b981;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.swal-features h4::before {
  content: '✨';
  font-size: 1.3rem;
}

.swal-features p {
  color: rgba(255, 255, 255, 0.9);
  padding: 0.75rem 0;
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}

.swal-features p:last-child {
  border-bottom: none;
}

.swal-features p:hover {
  background: rgba(255, 255, 255, 0.05);
  padding-left: 1rem;
  border-radius: 8px;
}

.swal-suitable {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15));
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 12px;
  text-align: center;
}

.swal-suitable p {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.swal-suitable strong {
  color: #fbbf24;
  font-weight: 900;
  font-size: 1.2rem;
  text-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
}

/* ========================================
   SWAL BUTTONS ENHANCEMENT
======================================== */
.swal2-confirm {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  padding: 0.9rem 2.5rem !important;
  border-radius: 50px !important;
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.5) !important;
  transition: all 0.3s !important;
}

.swal2-confirm:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 12px 40px rgba(220, 38, 38, 0.7) !important;
}

.swal2-cancel {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  padding: 0.9rem 2.5rem !important;
  border-radius: 50px !important;
  transition: all 0.3s !important;
}

.swal2-cancel:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 25px rgba(107, 114, 128, 0.4) !important;
}
</style>
