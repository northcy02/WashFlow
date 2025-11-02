<!-- src/pages/Services.vue - ENHANCED VERSION -->
<template>
  <div class="services-page">
    <Navigator />

    <!-- Hero Section -->
    <section class="services-hero">
      <div class="hero-overlay"></div>
      <div class="hero-particles"></div>
      
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="icon">✨</span>
            <span class="title-text">บริการของเรา</span>
          </h1>
          <p class="hero-subtitle">บริการล้างรถครบวงจร ด้วยมาตรฐานระดับสากล</p>
          
          <!-- Service Stats -->
          <div class="service-stats">
            <div class="stat-item">
              <h3>5+</h3>
              <p>บริการหลัก</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <h3>10,000+</h3>
              <p>ลูกค้าพึงพอใจ</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <h3>30-90</h3>
              <p>นาที/บริการ</p>
            </div>
          </div>
        </div>
      </div>

      <div class="hero-background">
        <img src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=1200" alt="Car Wash">
      </div>
    </section>

    <!-- Filter & Sort Section -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-controls">
          <div class="filter-group">
            <label>กรองตาม:</label>
            <button 
              :class="['filter-btn', { active: filterType === '' }]"
              @click="filterType = ''"
            >
              ทั้งหมด
            </button>
            <button 
              :class="['filter-btn', { active: filterType === 'popular' }]"
              @click="filterType = 'popular'"
            >
              🔥 ยอดนิยม
            </button>
            <button 
              :class="['filter-btn', { active: filterType === 'quick' }]"
              @click="filterType = 'quick'"
            >
              ⚡ ด่วน
            </button>
            <button 
              :class="['filter-btn', { active: filterType === 'premium' }]"
              @click="filterType = 'premium'"
            >
              👑 พรีเมียม
            </button>
          </div>

          <div class="sort-group">
            <label>เรียงตาม:</label>
            <select v-model="sortBy" class="sort-select">
              <option value="popular">ความนิยม</option>
              <option value="price-low">ราคา: ต่ำ → สูง</option>
              <option value="price-high">ราคา: สูง → ต่ำ</option>
              <option value="duration">ระยะเวลา: เร็ว → ช้า</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services-main">
      <div class="container">
        <div class="services-grid">
          <div 
            v-for="(service, index) in filteredServices" 
            :key="service.id"
            class="service-card"
            :class="{ 
              popular: service.popular, 
              recommended: service.recommended,
              premium: service.premium 
            }"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="openServiceDetail(service)"
          >
            <!-- Badges -->
            <div class="card-badges">
              <span v-if="service.popular" class="badge popular">🔥 นิยมสุด</span>
              <span v-if="service.recommended" class="badge recommended">⭐ แนะนำ</span>
              <span v-if="service.premium" class="badge premium">👑 พรีเมียม</span>
            </div>

            <!-- Card Glow -->
            <div class="card-glow"></div>

            <!-- Icon -->
            <div class="service-icon">
              <div class="icon-background"></div>
              <img :src="service.icon" :alt="service.name" />
              <div class="icon-pulse" v-if="service.popular"></div>
            </div>

            <!-- Info -->
            <div class="service-info">
              <h3>{{ service.name }}</h3>
              <p class="service-description">{{ service.description }}</p>

              <!-- Duration -->
              <div class="service-duration">
                <span class="duration-icon">⏱️</span>
                <span>{{ service.duration }} นาที</span>
              </div>

              <!-- Price -->
              <div class="service-price-container">
                <div class="price-badge">
                  <span class="currency">฿</span>
                  <span class="price">{{ service.price.toLocaleString() }}</span>
                </div>
                <p class="price-note">ราคาพื้นฐาน</p>
              </div>

              <!-- Features Preview -->
              <div class="features-preview">
                <div v-for="feature in service.features.slice(0, 3)" :key="feature" class="feature-tag">
                  <span class="feature-icon">✓</span>
                  <span>{{ feature }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="card-actions">
                <button class="btn-detail" @click.stop="openServiceDetail(service)">
                  ดูรายละเอียด
                </button>
                <button class="btn-book" @click.stop="bookService(service)">
                  <span>จองเลย</span>
                  <span class="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Packages Section -->
    <section class="packages-section">
      <div class="container">
        <h2 class="section-heading">
          <span class="icon">🎁</span>
          <span>แพ็กเกจคุ้มค่า</span>
        </h2>

        <div class="packages-grid">
          <div 
            v-for="pkg in packages" 
            :key="pkg.id"
            class="package-card"
            :class="pkg.type"
          >
            <div class="package-ribbon" v-if="pkg.discount">
              ประหยัด {{ pkg.discount }}%
            </div>

            <div class="package-header">
              <h3>{{ pkg.name }}</h3>
              <p class="package-subtitle">{{ pkg.subtitle }}</p>
            </div>

            <div class="package-price">
              <div class="original-price" v-if="pkg.originalPrice">
                ฿{{ pkg.originalPrice.toLocaleString() }}
              </div>
              <div class="current-price">
                <span class="currency">฿</span>
                <span class="amount">{{ pkg.price.toLocaleString() }}</span>
              </div>
              <p class="save-amount" v-if="pkg.save">ประหยัด ฿{{ pkg.save }}</p>
            </div>

            <div class="package-includes">
              <h4>รวมบริการ:</h4>
              <ul>
                <li v-for="item in pkg.includes" :key="item">
                  <span class="check-icon">✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <button class="btn-select-package" @click="selectPackage(pkg)">
              <span>เลือกแพ็กเกจนี้</span>
              <span class="btn-icon">🚀</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Timeline -->
    <section class="process-section">
      <div class="container">
        <h2 class="section-heading">
          <span class="icon">📋</span>
          <span>ขั้นตอนการบริการ</span>
        </h2>

        <div class="timeline">
          <div 
            v-for="(step, index) in processSteps" 
            :key="index"
            class="timeline-item"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <div class="timeline-number">{{ index + 1 }}</div>
            <div class="timeline-content">
              <div class="timeline-icon">{{ step.icon }}</div>
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-us-section">
      <div class="container">
        <h2 class="section-heading">
          <span class="icon">🏆</span>
          <span>ทำไมต้องเลือกเรา?</span>
        </h2>

        <div class="benefits-grid">
          <div 
            v-for="(benefit, index) in benefits" 
            :key="index"
            class="benefit-card"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="benefit-icon">{{ benefit.icon }}</div>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>พร้อมดูแลรถของคุณแล้วหรือยัง?</h2>
          <p>จองวันนี้ รับส่วนลดพิเศษ 10%</p>
          <div class="cta-buttons">
            <router-link to="/booking" class="btn-cta primary">
              <span>📅</span>
              <span>จองบริการเลย</span>
            </router-link>
            <router-link to="/car-types" class="btn-cta secondary">
              <span>🚗</span>
              <span>ดูประเภทรถ</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Detail Modal -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="btn-close" @click="closeModal">×</button>

          <div v-if="selectedService" class="modal-body">
            <div class="modal-header">
              <div class="modal-icon">
                <img :src="selectedService.icon" :alt="selectedService.name">
              </div>
              <h2>{{ selectedService.name }}</h2>
              <p class="modal-subtitle">{{ selectedService.description }}</p>
            </div>

            <div class="modal-info-grid">
              <div class="info-item">
                <span class="info-label">💰 ราคา</span>
                <span class="info-value price">฿{{ selectedService.price.toLocaleString() }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⏱️ ระยะเวลา</span>
                <span class="info-value">{{ selectedService.duration }} นาที</span>
              </div>
              <div class="info-item">
                <span class="info-label">⭐ ความนิยม</span>
                <span class="info-value rating">{{ selectedService.rating }}/5</span>
              </div>
            </div>

            <div class="modal-section">
              <h3>✨ รายละเอียดบริการ</h3>
              <ul class="features-full-list">
                <li v-for="feature in selectedService.features" :key="feature">
                  <span class="check-icon">✓</span>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>

            <div class="modal-section" v-if="selectedService.includes">
              <h3>📦 รวมอยู่ในบริการ</h3>
              <div class="includes-grid">
                <div v-for="item in selectedService.includes" :key="item" class="include-item">
                  {{ item }}
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn-close-modal" @click="closeModal">ปิด</button>
              <button class="btn-book-now" @click="bookService(selectedService)">
                <span>จองบริการนี้</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';

const router = useRouter();

// State
const filterType = ref('');
const sortBy = ref('popular');
const showModal = ref(false);
const selectedService = ref<any>(null);

// Enhanced Services Data
const services = [
  {
    id: 'wash',
    name: 'ล้างรถทั่วไป',
    description: 'ล้างรถทั้งคันด้านนอก ทำความสะอาดเบื้องต้น',
    icon: '/icons/wash.svg',
    price: 200,
    duration: 30,
    rating: 4.8,
    popular: true,
    recommended: true,
    premium: false,
    type: 'basic',
    features: [
      'ล้างด้านนอกทั้งคัน',
      'ทำความสะอาดล้อและยาง',
      'เช็ดกระจกทุกบาน',
      'ดูดฝุ่นเบื้องต้น',
      'ใช้ผลิตภัณฑ์คุณภาพสูง',
      'ตรวจสอบสภาพรถ'
    ],
    includes: [
      'โฟมล้างรถพรีเมียม',
      'ผ้าไมโครไฟเบอร์',
      'น้ำยาเคลือบเงา',
      'ทำความสะอาดล้อ'
    ]
  },
  {
    id: 'coating',
    name: 'เคลือบสีรถ',
    description: 'เคลือบแก้วป้องกันสีรถ ทนทานนาน 3-6 เดือน',
    icon: '/icons/coating.svg',
    price: 150,
    duration: 15,
    rating: 4.9,
    popular: true,
    recommended: true,
    premium: false,
    type: 'basic',
    features: [
      'เคลือบแก้วนาโน',
      'ป้องกันรอยขีดข่วน',
      'กันน้ำ กันสกปรก',
      'เพิ่มความเงางาม',
      'ทนทาน 3-6 เดือน',
      'แห้งเร็ว ไม่เป็นคราบ'
    ],
    includes: [
      'น้ำยาเคลือบนำเข้า',
      'ผ้าขัดพิเศษ',
      'การันตีคุณภาพ'
    ]
  },
  {
    id: 'vacuum',
    name: 'ดูดฝุ่น',
    description: 'ทำความสะอาดภายในรถ ดูดฝุ่น กำจัดคราบ',
    icon: '/icons/vacuum.svg',
    price: 80,
    duration: 20,
    rating: 4.7,
    popular: true,
    recommended: false,
    premium: false,
    type: 'quick',
    features: [
      'ดูดฝุ่นทุกพื้นที่',
      'ทำความสะอาดแผงหน้าปัด',
      'เช็ดพื้นเท้า',
      'ทำความสะอาดช่องแอร์',
      'กำจัดกลิ่นไม่พึงประสงค์',
      'เช็ดกระจกด้านใน'
    ],
    includes: [
      'เครื่องดูดฝุ่นอุตสาหกรรม',
      'น้ำยาทำความสะอาด',
      'น้ำหอมปรับอากาศ'
    ]
  },
  {
    id: 'polish',
    name: 'ขัดสีรถ',
    description: 'ขัดเงาสีรถให้เหมือนใหม่ กำจัดรอยขีดข่วน',
    icon: '/icons/polish.svg',
    price: 1000,
    duration: 60,
    rating: 5.0,
    popular: false,
    recommended: true,
    premium: true,
    type: 'premium',
    features: [
      'ขัดสีด้วยเครื่องมือมืออาชีพ',
      'กำจัดรอยขีดข่วนเล็กน้อย',
      'เพิ่มความเงางามสูงสุด',
      'ปกป้องสีรถ',
      'ช่างเชี่ยวชาญเฉพาะ',
      'รับประกันผล 30 วัน'
    ],
    includes: [
      'เครื่องขัดสี Professional',
      'ผลิตภัณฑ์นำเข้า',
      'Wax พรีเมียม',
      'ตรวจสอบสี ก่อน-หลัง'
    ]
  },
  {
    id: 'interior',
    name: 'ซักเบาะรถยนต์',
    description: 'ทำความสะอาดเบาะทุกที่นั่ง ลึกถึงใยผ้า',
    icon: '/icons/interior.svg',
    price: 2000,
    duration: 90,
    rating: 4.9,
    popular: false,
    recommended: false,
    premium: true,
    type: 'premium',
    features: [
      'ซักเบาะทุกตัว',
      'ทำความสะอาดลึกถึงใยผ้า',
      'กำจัดคราบฝังลึก',
      'ฆ่าเชื้อแบคทีเรีย',
      'กำจัดกลิ่น',
      'อบไอน้ำฆ่าเชื้อ'
    ],
    includes: [
      'น้ำยาซักเบาะพิเศษ',
      'เครื่องดูดน้ำอุตสาหกรรม',
      'อบไอน้ำฆ่าเชื้อ',
      'น้ำหอมระงับกลิ่น'
    ]
  }
];

// Packages Data
const packages = [
  {
    id: 'basic',
    name: 'Basic Clean',
    subtitle: 'สำหรับการล้างรถทั่วไป',
    type: 'basic',
    price: 250,
    originalPrice: null,
    discount: 0,
    save: 0,
    includes: [
      'ล้างรถทั่วไป',
      'ดูดฝุ่นเบื้องต้น'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Wash',
    subtitle: 'บริการครบครัน คุ้มค่าสุด',
    type: 'premium',
    price: 350,
    originalPrice: 430,
    discount: 20,
    save: 80,
    includes: [
      'ล้างรถทั่วไป',
      'เคลือบสีรถ',
      'ดูดฝุ่นทั่วทั้งคัน',
      'ฟรี! น้ำหอมปรับอากาศ'
    ]
  },
  {
    id: 'ultimate',
    name: 'Ultimate Care',
    subtitle: 'บริการระดับพรีเมียม',
    type: 'ultimate',
    price: 1200,
    originalPrice: 1500,
    discount: 20,
    save: 300,
    includes: [
      'ล้างรถ + เคลือบสี',
      'ขัดสีรถ',
      'ดูดฝุ่น + ทำความสะอาดภายใน',
      'ฟรี! น้ำหอม + เช็ดกระจกพิเศษ'
    ]
  }
];

// Process Steps
const processSteps = [
  { icon: '📝', title: 'จองคิว', description: 'จองผ่านเว็บไซต์หรือแอพ' },
  { icon: '🚗', title: 'นำรถมา', description: 'มาตามเวลาที่จอง' },
  { icon: '🧼', title: 'เริ่มบริการ', description: 'ทีมงานดูแลรถของคุณ' },
  { icon: '✨', title: 'ตรวจสอบ', description: 'ตรวจคุณภาพก่อนส่งมอบ' },
  { icon: '✅', title: 'รับรถ', description: 'รับรถสะอาด พร้อมใช้งาน' }
];

// Benefits
const benefits = [
  {
    icon: '⚡',
    title: 'รวดเร็วทันใจ',
    description: 'บริการเสร็จภายใน 30-90 นาที รับรถไปใช้ได้ทันที'
  },
  {
    icon: '🛡️',
    title: 'ปลอดภัย 100%',
    description: 'ผลิตภัณฑ์คุณภาพสูง ไม่ทำลายสีรถ'
  },
  {
    icon: '👨‍🔧',
    title: 'ทีมมืออาชีพ',
    description: 'ช่างผ่านการอบรม มีประสบการณ์ 10+ ปี'
  },
  {
    icon: '💎',
    title: 'คุณภาพระดับพรีเมียม',
    description: 'มาตรฐาน ISO 9001 ใช้เครื่องมือทันสมัย'
  },
  {
    icon: '💰',
    title: 'ราคายุติธรรม',
    description: 'คุ้มค่าทุกบาท มีโปรโมชั่นตลอดปี'
  },
  {
    icon: '🎁',
    title: 'สะสมคะแนน',
    description: 'รับคะแนนทุกครั้งที่ใช้บริการ แลกส่วนลดได้'
  }
];

// Computed
const filteredServices = computed(() => {
  let result = services;

  // Filter
  if (filterType.value === 'popular') {
    result = result.filter(s => s.popular);
  } else if (filterType.value === 'quick') {
    result = result.filter(s => s.duration <= 30);
  } else if (filterType.value === 'premium') {
    result = result.filter(s => s.premium);
  }

  // Sort
  if (sortBy.value === 'price-low') {
    result = [...result].sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price-high') {
    result = [...result].sort((a, b) => b.price - a.price);
  } else if (sortBy.value === 'duration') {
    result = [...result].sort((a, b) => a.duration - b.duration);
  } else if (sortBy.value === 'popular') {
    result = [...result].sort((a, b) => b.rating - a.rating);
  }

  return result;
});

// Methods
const openServiceDetail = (service: any) => {
  selectedService.value = service;
  showModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  showModal.value = false;
  selectedService.value = null;
  document.body.style.overflow = '';
};

const bookService = (service: any) => {
  closeModal();
  
  Swal.fire({
    title: `จอง${service.name}?`,
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p style="margin-bottom: 0.5rem;">ราคา: <strong style="color: #dc2626;">฿${service.price.toLocaleString()}</strong></p>
        <p style="margin-bottom: 0.5rem;">ระยะเวลา: <strong>${service.duration} นาที</strong></p>
        <p style="color: #6b7280; font-size: 0.9rem; margin-top: 1rem;">*ราคาจริงขึ้นอยู่กับประเภทรถที่เลือก</p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ไปเลือกรถ',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push({
        path: '/booking',
        query: { service: service.id }
      });
    }
  });
};

const selectPackage = (pkg: any) => {
  Swal.fire({
    title: `🎁 ${pkg.name}`,
    html: `
      <div style="text-align: center; padding: 1.5rem;">
        <div style="font-size: 3rem; font-weight: 900; color: #dc2626; margin-bottom: 1rem;">
          ฿${pkg.price.toLocaleString()}
        </div>
        ${pkg.save > 0 ? `
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); 
                      padding: 1rem; border-radius: 10px; margin-bottom: 1rem;
                      border: 2px solid rgba(16, 185, 129, 0.4);">
            <p style="color: #10b981; font-weight: 700; margin-bottom: 0.5rem;">
              💰 ประหยัดทันที
            </p>
            <p style="font-size: 2rem; font-weight: 900; color: #fbbf24;">
              ฿${pkg.save}
            </p>
          </div>
        ` : ''}
        <div style="text-align: left; margin-top: 1.5rem;">
          <h4 style="margin-bottom: 1rem; color: #fff;">รวมบริการ:</h4>
          <ul style="list-style: none; padding: 0;">
            ${pkg.includes.map((item: string) => `
              <li style="padding: 0.5rem 0; color: rgba(255,255,255,0.8);">
                <span style="color: #10b981; margin-right: 0.5rem;">✓</span>
                ${item}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `,
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'จองแพ็กเกจนี้',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    width: '600px'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push({
        path: '/booking',
        query: { package: pkg.id }
      });
    }
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
}

/* ========================================
   HERO SECTION
======================================== */
.services-hero {
  margin-top: 80px;
  min-height: 500px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 5rem 2rem;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.85) 50%,
    rgba(0, 0, 0, 0.95) 100%
  );
  z-index: 1;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="1.5" fill="rgba(220,38,38,0.4)"/></svg>');
  animation: particlesFloat 40s linear infinite;
  opacity: 0.4;
  z-index: 1;
}

@keyframes particlesFloat {
  from { background-position: 0 0; }
  to { background-position: 100px 100px; }
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
  filter: blur(2px);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.hero-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  animation: heroSlideDown 0.8s ease-out;
}

@keyframes heroSlideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title .icon {
  font-size: 5rem;
  filter: drop-shadow(0 15px 40px rgba(220, 38, 38, 0.7));
  animation: iconRotate 4s ease-in-out infinite;
}

@keyframes iconRotate {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(10deg) scale(1.1); }
}

.title-text {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 3px;
  text-shadow: 0 10px 40px rgba(220, 38, 38, 0.3);
}

.hero-subtitle {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 3rem;
  font-weight: 400;
  animation: fadeIn 0.8s ease-out 0.3s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Service Stats */
.service-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  padding: 2rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  animation: fadeIn 0.8s ease-out 0.5s both;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.stat-item p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.stat-divider {
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent);
}

/* ========================================
   FILTER SECTION
======================================== */
.filter-section {
  padding: 3rem 2rem;
  background: linear-gradient(to bottom, #0a0a0a, #1a1a1a);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 80px;
  z-index: 100;
  backdrop-filter: blur(20px);
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-group,
.sort-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group label,
.sort-group label {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.filter-btn {
  padding: 0.75rem 1.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(220, 38, 38, 0.5);
  color: #fff;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  color: #fff;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.5);
}

.sort-select {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  min-width: 200px;
}

.sort-select:focus {
  outline: none;
  border-color: #dc2626;
  background: rgba(255, 255, 255, 0.08);
}

.sort-select option {
  background: #1a1a1a;
  color: #fff;
}

/* ========================================
   SERVICES MAIN
======================================== */
.services-main {
  padding: 5rem 2rem;
  background: #0a0a0a;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.service-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 2.5rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: cardSlideUp 0.6s ease-out both;
}

@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
}

.service-card:hover .card-glow {
  opacity: 1;
  top: -50%;
  left: -50%;
  animation: rotate 6s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.service-card:hover {
  transform: translateY(-20px) scale(1.05);
  border-color: rgba(220, 38, 38, 0.6);
  background: rgba(220, 38, 38, 0.08);
  box-shadow: 0 30px 80px rgba(220, 38, 38, 0.5);
}

.service-card.popular {
  border-color: rgba(251, 191, 36, 0.4);
}

.service-card.recommended {
  border-color: rgba(16, 185, 129, 0.4);
}

.service-card.premium {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(124, 58, 237, 0.08));
  border-color: rgba(168, 85, 247, 0.4);
}

/* Card Badges */
.card-badges {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 10;
}

.badge {
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  font-size: 0.8rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: badgeSlide 0.5s ease-out both;
}

@keyframes badgeSlide {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.badge.popular {
  background: linear-gradient(135deg, #f87171, #dc2626);
  color: #fff;
}

.badge.recommended {
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #fff;
}

.badge.premium {
  background: linear-gradient(135deg, #a78bfa, #7c3aed);
  color: #fff;
}

/* Service Icon */
.service-icon {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto 2rem;
  padding: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.25), rgba(139, 0, 0, 0.35));
    border: 3px solid rgba(220, 38, 38, 0.5);
  transition: all 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.3);
}

.icon-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%);
  animation: iconBgPulse 3s ease-in-out infinite;
}

@keyframes iconBgPulse {
  0%, 100% { transform: scale(0.9); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
}

.icon-pulse {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  border: 3px solid rgba(251, 191, 36, 0.6);
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.service-icon img {
  width: 100%;
  height: 100%;
  filter: invert(1) drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
  transition: all 0.5s;
  z-index: 1;
}

.service-card:hover .service-icon {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  box-shadow: 0 0 60px rgba(220, 38, 38, 1);
  transform: scale(1.15) rotate(10deg);
}

.service-card:hover .service-icon img {
  filter: invert(1) brightness(1.5) drop-shadow(0 0 25px rgba(255, 255, 255, 1));
  transform: scale(1.1);
}

/* Service Info */
.service-info {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.service-info h3 {
  font-size: 1.6rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.service-card:hover .service-info h3 {
  color: #dc2626;
  transform: scale(1.05);
}

.service-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  min-height: 48px;
}

.service-duration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.2rem;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #3b82f6;
}

.duration-icon {
  font-size: 1.2rem;
}

/* Price Container */
.service-price-container {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.price-badge {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.3rem;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
}

.price {
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 0 0 25px rgba(220, 38, 38, 0.6);
  line-height: 1;
}

.service-card:hover .price {
  color: #fbbf24;
  text-shadow: 0 0 30px rgba(251, 191, 36, 0.8);
  animation: priceGlow 1.5s ease-in-out infinite;
}

@keyframes priceGlow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.price-note {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Features Preview */
.features-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.service-card:hover .feature-tag {
  background: rgba(16, 185, 129, 0.1);
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
}

/* Card Actions */
.card-actions {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-detail,
.btn-book {
  padding: 1rem 1.5rem;
  border-radius: 15px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-detail {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.btn-detail:hover {
  background: rgba(59, 130, 246, 0.25);
  border-color: #3b82f6;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.btn-book {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border-color: rgba(220, 38, 38, 0.4);
  color: #dc2626;
}

.btn-book:hover {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.5);
}

.btn-book .arrow {
  transition: transform 0.3s;
}

.btn-book:hover .arrow {
  transform: translateX(5px);
}

/* ========================================
   PACKAGES SECTION
======================================== */
.packages-section {
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #1a1a1a, #0a0a0a);
  position: relative;
  overflow: hidden;
}

.packages-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 50%);
  animation: bgPulse 8s ease-in-out infinite;
}

@keyframes bgPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 4rem;
  color: #fff;
  position: relative;
  z-index: 1;
}

.section-heading .icon {
  font-size: 3rem;
  filter: drop-shadow(0 5px 20px rgba(220, 38, 38, 0.6));
  animation: iconBounce 3s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.package-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 3rem 2.5rem;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: packageSlideIn 0.8s ease-out both;
}

@keyframes packageSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.package-card.basic {
  border-color: rgba(107, 114, 128, 0.4);
}

.package-card.premium {
  border-color: rgba(251, 191, 36, 0.5);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.05), rgba(245, 158, 11, 0.05));
  transform: scale(1.05);
  z-index: 10;
}

.package-card.ultimate {
  border-color: rgba(168, 85, 247, 0.5);
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(124, 58, 237, 0.08));
}

.package-card:hover {
  transform: translateY(-20px) scale(1.08);
  border-color: rgba(220, 38, 38, 0.6);
  box-shadow: 0 30px 80px rgba(220, 38, 38, 0.5);
}

.package-card.premium:hover {
  transform: translateY(-20px) scale(1.1);
  box-shadow: 0 35px 90px rgba(251, 191, 36, 0.6);
}

/* Package Ribbon */
.package-ribbon {
  position: absolute;
  top: 25px;
  right: -35px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
  padding: 0.5rem 3rem;
  font-size: 0.85rem;
  font-weight: 700;
  transform: rotate(45deg);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.5);
  z-index: 10;
  letter-spacing: 0.5px;
}

.package-header {
  margin-bottom: 2rem;
}

.package-header h3 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: #fff;
}

.package-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

/* Package Price */
.package-price {
  margin-bottom: 2.5rem;
  padding: 2rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
}

.original-price {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: line-through;
  margin-bottom: 0.75rem;
}

.current-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
}

.current-price .currency {
  font-size: 2rem;
  font-weight: 700;
  color: #dc2626;
}

.current-price .amount {
  font-size: 4rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.6);
  line-height: 1;
}

.package-card.premium .current-price .amount {
  color: #fbbf24;
  text-shadow: 0 0 30px rgba(251, 191, 36, 0.8);
}

.save-amount {
  font-size: 1.1rem;
  color: #10b981;
  font-weight: 700;
  margin: 0;
}

/* Package Includes */
.package-includes {
  text-align: left;
  margin-bottom: 2rem;
}

.package-includes h4 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.package-includes ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.package-includes li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
}

.package-card:hover .package-includes li {
  background: rgba(16, 185, 129, 0.1);
  transform: translateX(5px);
}

.check-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 900;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.4);
}

/* Select Package Button */
.btn-select-package {
  width: 100%;
  padding: 1.3rem 2rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border: 2px solid rgba(220, 38, 38, 0.4);
  border-radius: 50px;
  color: #dc2626;
  font-size: 1.1rem;
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

.btn-select-package::before {
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

.btn-select-package:hover::before {
  width: 500px;
  height: 500px;
}

.btn-select-package:hover {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  color: #fff;
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.6);
}

.package-card.premium .btn-select-package {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  border-color: rgba(251, 191, 36, 0.5);
  color: #fbbf24;
}

.package-card.premium .btn-select-package:hover {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-color: #fbbf24;
  color: #000;
  box-shadow: 0 15px 50px rgba(251, 191, 36, 0.7);
}

.btn-icon {
  transition: transform 0.3s;
}

.btn-select-package:hover .btn-icon {
  transform: translateX(5px) scale(1.2);
}

/* ========================================
   PROCESS TIMELINE
======================================== */
.process-section {
  padding: 5rem 2rem;
  background: #0a0a0a;
}

.timeline {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 50px;
  left: 10%;
  right: 10%;
  height: 3px;
  background: linear-gradient(90deg, 
    #dc2626 0%, 
    #fbbf24 25%, 
    #10b981 50%, 
    #3b82f6 75%, 
    #a855f7 100%
  );
  z-index: 0;
}

.timeline-item {
  position: relative;
  z-index: 1;
  animation: timelineSlideIn 0.8s ease-out both;
}

@keyframes timelineSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-number {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border: 4px solid rgba(220, 38, 38, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.5);
  transition: all 0.4s;
}

.timeline-item:hover .timeline-number {
  transform: scale(1.2) rotate(10deg);
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.8);
}

.timeline-content {
  text-align: center;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.4s;
}

.timeline-item:hover .timeline-content {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(220, 38, 38, 0.3);
}

.timeline-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 5px 20px rgba(220, 38, 38, 0.5));
}

.timeline-content h4 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #fff;
}

.timeline-content p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

/* ========================================
   WHY US SECTION
======================================== */
.why-us-section {
  padding: 5rem 2rem;
  background: linear-gradient(to bottom, #0a0a0a, #1a1a1a);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.benefit-card {
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: benefitSlideIn 0.8s ease-out both;
  position: relative;
  overflow: hidden;
}

@keyframes benefitSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.benefit-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
  transition: left 0.6s;
}

.benefit-card:hover::before {
  left: 100%;
}

.benefit-card:hover {
  transform: translateY(-15px);
  border-color: rgba(220, 38, 38, 0.6);
  background: rgba(220, 38, 38, 0.05);
  box-shadow: 0 25px 70px rgba(220, 38, 38, 0.4);
}

.benefit-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  filter: drop-shadow(0 10px 30px rgba(220, 38, 38, 0.5));
  transition: all 0.4s;
}

.benefit-card:hover .benefit-icon {
  transform: scale(1.2) rotate(10deg);
  filter: drop-shadow(0 15px 40px rgba(220, 38, 38, 0.8));
}

.benefit-card h3 {
  font-size: 1.6rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #fff;
  transition: all 0.3s;
}

.benefit-card:hover h3 {
  color: #dc2626;
}

.benefit-card p {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

/* ========================================
   CTA SECTION
======================================== */
.cta-section {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(139, 0, 0, 0.15));
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
  position: relative;
  overflow: hidden;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 60%);
  animation: ctaGlow 8s ease-in-out infinite;
}

@keyframes ctaGlow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-10%, -10%); }
}

.cta-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-content h2 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-content p {
  font-size: 1.5rem;
  color: #fbbf24;
  margin-bottom: 3rem;
  font-weight: 600;
}

.cta-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 3.5rem;
  border-radius: 50px;
  font-size: 1.2rem;
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
  width: 500px;
  height: 500px;
}

.btn-cta.primary {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
  border: 2px solid #dc2626;
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.5);
}

.btn-cta.primary:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 20px 60px rgba(220, 38, 38, 0.7);
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
  box-shadow: 0 15px 40px rgba(255, 255, 255, 0.15);
}

/* ========================================
   MODAL
======================================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: #1a1a1a;
  border: 2px solid rgba(220, 38, 38, 0.4);
  border-radius: 30px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 30px 100px rgba(220, 38, 38, 0.5);
}

.btn-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  z-index: 10;
}

.btn-close:hover {
  background: #ef4444;
  color: #fff;
  transform: rotate(90deg);
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.5);
}

.modal-body {
  padding: 3rem 2.5rem;
}

.modal-header {
  text-align: center;
  margin-bottom: 3rem;
}

.modal-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.3));
  border: 3px solid rgba(220, 38, 38, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.5);
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 15px 50px rgba(220, 38, 38, 0.5); }
  50% { transform: scale(1.1); box-shadow: 0 20px 60px rgba(220, 38, 38, 0.8); }
}

.modal-icon img {
  width: 100%;
  height: 100%;
  filter: invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
}

.modal-header h2 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
  color: #fff;
}

.modal-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
}

.modal-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.info-item {
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px);
}

.info-label {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.75rem;
}

.info-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
}

.info-value.price {
  color: #dc2626;
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
}

.info-value.rating {
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
}

.modal-section {
  margin-bottom: 2.5rem;
}

.modal-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.features-full-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.features-full-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s;
}

.features-full-list li:hover {
  background: rgba(16, 185, 129, 0.2);
  transform: translateX(5px);
}

.includes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.include-item {
  padding: 1rem 1.25rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  transition: all 0.3s;
}

.include-item:hover {
  background: rgba(251, 191, 36, 0.2);
  transform: scale(1.05);
}

/* Modal Actions */
.modal-actions {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.btn-close-modal,
.btn-book-now {
  padding: 1.2rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s;
  border: 2px solid;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-close-modal {
  background: rgba(107, 114, 128, 0.2);
  border-color: rgba(107, 114, 128, 0.4);
  color: #9ca3af;
}

.btn-close-modal:hover {
  background: #6b7280;
  color: #fff;
  transform: translateY(-3px);
}

.btn-book-now {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  color: #fff;
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.5);
}

.btn-book-now:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(220, 38, 38, 0.7);
}

/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-30px);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1400px) {
  .services-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .timeline {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .filter-controls {
    flex-direction: column;
    gap: 1.5rem;
  }

  .filter-group {
    flex-wrap: wrap;
    justify-content: center;
  }

  .packages-grid {
    gap: 2rem;
  }

  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .timeline {
    grid-template-columns: repeat(2, 1fr);
  }

  .timeline::before {
    display: none;
  }
}

@media (max-width: 768px) {
  .services-hero {
    padding: 4rem 1.5rem;
  }

  .title-text {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .service-stats {
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
  }

  .stat-divider {
    width: 100%;
    height: 1px;
  }

  .filter-section {
    padding: 2rem 1.5rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .service-card {
    padding: 2rem 1.5rem;
  }

  .service-icon {
    width: 110px;
    height: 110px;
  }

  .service-info h3 {
    font-size: 1.4rem;
  }

  .packages-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .package-card.premium {
    transform: scale(1);
  }

  .package-card.premium:hover {
    transform: translateY(-20px) scale(1.05);
  }

  .timeline {
    grid-template-columns: 1fr;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .cta-content h2 {
    font-size: 2rem;
  }

  .cta-content p {
    font-size: 1.2rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn-cta {
    width: 100%;
    justify-content: center;
  }

  .modal-info-grid {
    grid-template-columns: 1fr;
  }

  .features-full-list {
    grid-template-columns: 1fr;
  }

  .includes-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .services-hero {
    padding: 3rem 1rem;
  }

  .hero-title .icon {
    font-size: 3.5rem;
  }

  .title-text {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .service-stats {
    padding: 1.5rem;
  }

  .stat-item h3 {
    font-size: 2rem;
  }

  .filter-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }

  .sort-select {
    min-width: 100%;
  }

  .service-card {
    padding: 1.5rem 1rem;
  }

  .card-badges {
    top: 1rem;
    right: 1rem;
  }

  .badge {
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
  }

  .service-icon {
    width: 90px;
    height: 90px;
  }

  .service-info h3 {
    font-size: 1.2rem;
  }

  .price {
    font-size: 2rem;
  }

  .card-actions {
    grid-template-columns: 1fr;
  }

  .package-card {
    padding: 2rem 1.5rem;
  }

  .package-header h3 {
    font-size: 1.6rem;
  }

  .current-price .amount {
    font-size: 3rem;
  }

  .section-heading {
    font-size: 2rem;
    flex-direction: column;
  }

  .timeline-number {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .timeline-icon {
    font-size: 2.5rem;
  }

  .timeline-content {
    padding: 1.5rem 1rem;
  }

  .timeline-content h4 {
    font-size: 1.1rem;
      }

  .benefit-card {
    padding: 2rem 1.5rem;
  }

  .benefit-icon {
    font-size: 3.5rem;
  }

  .benefit-card h3 {
    font-size: 1.3rem;
  }

  .benefit-card p {
    font-size: 0.95rem;
  }

  .cta-section {
    padding: 4rem 1.5rem;
  }

  .cta-content h2 {
    font-size: 1.8rem;
  }

  .cta-content p {
    font-size: 1.1rem;
  }

  .btn-cta {
    padding: 1.2rem 2rem;
    font-size: 1rem;
  }

  .modal-content {
    max-width: 95%;
  }

  .modal-body {
    padding: 2rem 1.5rem;
  }

  .modal-header h2 {
    font-size: 2rem;
  }

  .modal-icon {
    width: 100px;
    height: 100px;
  }
}

/* ========================================
   CUSTOM SCROLLBAR
======================================== */
.modal-content::-webkit-scrollbar,
.services-page::-webkit-scrollbar {
  width: 10px;
}

.modal-content::-webkit-scrollbar-track,
.services-page::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb,
.services-page::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #dc2626, #991b1b);
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.modal-content::-webkit-scrollbar-thumb:hover,
.services-page::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #b91c1c, #7f1d1d);
}

/* ========================================
   ACCESSIBILITY
======================================== */
.service-card:focus-visible,
.filter-btn:focus-visible,
.btn-detail:focus-visible,
.btn-book:focus-visible,
.btn-select-package:focus-visible,
.btn-cta:focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 5px;
  box-shadow: 0 0 0 6px rgba(220, 38, 38, 0.2);
}

.sort-select:focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 2px;
}

/* Keyboard Navigation Enhancement */
.service-card:focus,
.package-card:focus,
.benefit-card:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.3);
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
  .hero-particles,
  .icon-background,
  .icon-pulse {
    animation: none !important;
  }

  .service-card:hover,
  .package-card:hover,
  .benefit-card:hover {
    transform: none !important;
  }
}

/* ========================================
   HIGH CONTRAST MODE
======================================== */
@media (prefers-contrast: high) {
  .service-card,
  .package-card,
  .benefit-card,
  .info-card {
    border-width: 3px;
  }

  .filter-btn,
  .btn-detail,
  .btn-book,
  .btn-select-package,
  .btn-cta {
    border-width: 3px;
  }

  .badge {
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
}

/* ========================================
   PRINT STYLES
======================================== */
@media print {
  .services-hero,
  .filter-section,
  .card-badges,
  .card-actions,
  .btn-select-package,
  .cta-section,
  .modal-overlay {
    display: none !important;
  }

  .service-card,
  .package-card {
    border: 2px solid #000;
    page-break-inside: avoid;
    box-shadow: none;
  }

  .service-icon,
  .benefit-icon {
    filter: none;
  }

  .price,
  .current-price .amount {
    color: #000 !important;
    text-shadow: none !important;
  }
}

/* ========================================
   DARK MODE (Already Dark)
======================================== */
@media (prefers-color-scheme: dark) {
  .services-page {
    background: #000;
  }
}

/* ========================================
   HOVER ENHANCED STATES
======================================== */
@media (hover: hover) {
  .service-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      transparent 0%,
      rgba(220, 38, 38, 0.15) 50%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.6s;
    pointer-events: none;
  }

  .service-card:hover::after {
    opacity: 1;
  }

  .package-card::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #dc2626, #fbbf24, #10b981);
    border-radius: 30px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.5s;
  }

  .package-card:hover::after {
    opacity: 0.4;
    animation: borderRotate 4s linear infinite;
  }

  @keyframes borderRotate {
    from { filter: hue-rotate(0deg); }
    to { filter: hue-rotate(360deg); }
  }

  .benefit-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
                rgba(220, 38, 38, 0.2) 0%, 
                transparent 50%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .benefit-card:hover::after {
    opacity: 1;
  }
}

/* ========================================
   LOADING STATES
======================================== */
.loading-skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 100%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
}

@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ========================================
   PERFORMANCE OPTIMIZATIONS
======================================== */
.service-card,
.package-card,
.benefit-card {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-glow,
.hero-particles,
.icon-background {
  will-change: transform, opacity;
}

/* ========================================
   TOUCH DEVICE OPTIMIZATIONS
======================================== */
@media (hover: none) and (pointer: coarse) {
  .service-card:active,
  .package-card:active,
  .benefit-card:active {
    transform: scale(0.98);
  }

  .filter-btn:active,
  .btn-detail:active,
  .btn-book:active {
    transform: scale(0.95);
  }
}

/* ========================================
   SAFARI SPECIFIC FIXES
======================================== */
@supports (-webkit-touch-callout: none) {
  .service-icon,
  .modal-icon {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  .service-card,
  .package-card {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}

/* ========================================
   FIREFOX SPECIFIC FIXES
======================================== */
@-moz-document url-prefix() {
  .service-card:hover {
    transform: translateY(-20px) scale(1.05) translateZ(0);
  }

  .package-card:hover {
    transform: translateY(-20px) scale(1.08) translateZ(0);
  }
}

/* ========================================
   SELECTION STATES
======================================== */
.service-card.selected {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.15);
  box-shadow: 0 0 50px rgba(220, 38, 38, 0.6);
}

.service-card.selected::before {
  content: '✓';
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
  z-index: 10;
  box-shadow: 0 5px 25px rgba(16, 185, 129, 0.6);
  animation: checkmarkPop 0.4s ease-out;
}

@keyframes checkmarkPop {
  0% { transform: scale(0) rotate(-180deg); }
  50% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* ========================================
   TOOLTIP ENHANCEMENTS
======================================== */
.has-tooltip {
  position: relative;
}

.has-tooltip::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.2rem;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: 10px;
  color: #fff;
  font-size: 0.85rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
  z-index: 100;
}

.has-tooltip::after {
  content: '';
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.95);
  opacity: 0;
  transition: all 0.3s;
}

.has-tooltip:hover::before,
.has-tooltip:hover::after {
  opacity: 1;
}

/* ========================================
   GRADIENT ANIMATIONS
======================================== */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
}

/* ========================================
   3D TRANSFORMS
======================================== */
.card-3d {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.service-card:hover {
  transform: translateY(-20px) scale(1.05) rotateX(2deg);
}

.package-card:hover {
  transform: translateY(-20px) scale(1.08) rotateY(2deg);
}

/* ========================================
   GLASS MORPHISM ENHANCED
======================================== */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* ========================================
   NEON EFFECTS
======================================== */
.neon-border {
  box-shadow: 
    0 0 5px rgba(220, 38, 38, 0.5),
    0 0 10px rgba(220, 38, 38, 0.4),
    0 0 15px rgba(220, 38, 38, 0.3),
    inset 0 0 10px rgba(220, 38, 38, 0.2);
}

.service-card:hover,
.package-card:hover {
  box-shadow: 
    0 0 10px rgba(220, 38, 38, 0.6),
    0 0 20px rgba(220, 38, 38, 0.5),
    0 0 30px rgba(220, 38, 38, 0.4),
    0 30px 80px rgba(220, 38, 38, 0.5);
}

/* ========================================
   INTERACTIVE HOVER TRACKING
======================================== */
@media (hover: hover) and (pointer: fine) {
  .service-card,
  .package-card,
  .benefit-card {
    position: relative;
  }

  .service-card::before,
  .package-card::before,
  .benefit-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(220, 38, 38, 0.15) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .service-card:hover::before,
  .package-card:hover::before,
  .benefit-card:hover::before {
    opacity: 1;
  }
}

/* ========================================
   STAGGER ANIMATIONS
======================================== */
.service-card:nth-child(1) { animation-delay: 0s; }
.service-card:nth-child(2) { animation-delay: 0.1s; }
.service-card:nth-child(3) { animation-delay: 0.2s; }
.service-card:nth-child(4) { animation-delay: 0.3s; }
.service-card:nth-child(5) { animation-delay: 0.4s; }

.package-card:nth-child(1) { animation-delay: 0s; }
.package-card:nth-child(2) { animation-delay: 0.2s; }
.package-card:nth-child(3) { animation-delay: 0.4s; }

.benefit-card:nth-child(1) { animation-delay: 0s; }
.benefit-card:nth-child(2) { animation-delay: 0.15s; }
.benefit-card:nth-child(3) { animation-delay: 0.3s; }
.benefit-card:nth-child(4) { animation-delay: 0.45s; }
.benefit-card:nth-child(5) { animation-delay: 0.6s; }
.benefit-card:nth-child(6) { animation-delay: 0.75s; }

/* ========================================
   MICRO INTERACTIONS
======================================== */
.btn-detail:active,
.btn-book:active,
.btn-select-package:active,
.btn-cta:active {
  transform: scale(0.95);
}

.filter-btn:active {
  transform: scale(0.95);
}

/* ========================================
   IMAGE LOADING STATES
======================================== */
.service-icon img,
.modal-icon img,
.table-car-icon {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Lazy Load Placeholder */
.service-icon img[loading="lazy"],
.modal-icon img[loading="lazy"] {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmerLoading 1.5s ease-in-out infinite;
}

@keyframes shimmerLoading {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ========================================
   EMPTY STATE
======================================== */
.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  grid-column: 1 / -1;
}

.empty-state .icon {
  font-size: 6rem;
  margin-bottom: 2rem;
  opacity: 0.4;
}

.empty-state h3 {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ========================================
   SMOOTH SCROLL
======================================== */
html {
  scroll-behavior: smooth;
}

.services-page {
  scroll-padding-top: 150px;
}

/* ========================================
   BACKDROP BLUR FALLBACK
======================================== */
@supports not (backdrop-filter: blur(10px)) {
  .filter-section {
    background: rgba(10, 10, 10, 0.95);
  }

  .service-stats,
  .filter-btn,
  .sort-select {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* ========================================
   BRAND CONSISTENCY
======================================== */
:root {
  --primary: #dc2626;
  --primary-dark: #991b1b;
  --primary-light: #ef4444;
  --secondary: #fbbf24;
  --success: #10b981;
  --info: #3b82f6;
  --purple: #a855f7;
}

/* ========================================
   SHADOW VARIATIONS
======================================== */
.shadow-sm { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.shadow-md { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2); }
.shadow-lg { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
.shadow-xl { box-shadow: 0 16px 64px rgba(0, 0, 0, 0.4); }
.shadow-2xl { box-shadow: 0 32px 96px rgba(0, 0, 0, 0.5); }

.shadow-primary { box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4); }
.shadow-secondary { box-shadow: 0 10px 40px rgba(251, 191, 36, 0.4); }
.shadow-success { box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4); }

/* ========================================
   Z-INDEX LAYERS
======================================== */
.z-base { z-index: 1; }
.z-content { z-index: 10; }
.z-overlay { z-index: 100; }
.z-modal { z-index: 1000; }
.z-toast { z-index: 2000; }
.z-tooltip { z-index: 3000; }

/* ========================================
   TRANSITION PRESETS
======================================== */
.transition-fast { transition: all 0.15s ease; }
.transition-base { transition: all 0.3s ease; }
.transition-slow { transition: all 0.5s ease; }
.transition-bounce { transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.transition-smooth { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }

/* ========================================
   UTILITY CLASSES
======================================== */
.text-gradient {
  background: linear-gradient(135deg, #dc2626, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glow-red {
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.6));
}

.glow-gold {
  filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.6));
}

.glow-green {
  filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.6));
}

/* ========================================
   CONTAINER QUERIES (Future-proof)
======================================== */
@container (min-width: 700px) {
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 1000px) {
  .service-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ========================================
   COLOR MODE DETECTION
======================================== */
@media (prefers-color-scheme: light) {
  /* Override for light mode if needed */
  .services-page {
    background: #000; /* Force dark mode */
  }
}

/* ========================================
   SAFE AREA INSETS (Mobile)
======================================== */
@supports (padding: max(0px)) {
  .services-page {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }

  .modal-overlay {
    padding-left: max(2rem, env(safe-area-inset-left));
    padding-right: max(2rem, env(safe-area-inset-right));
  }
}

/* ========================================
   LOADING SPINNER
======================================== */
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========================================
   ENHANCED FOCUS RING
======================================== */
*:focus-visible {
  outline: 3px solid rgba(220, 38, 38, 0.6);
  outline-offset: 3px;
}

button:focus-visible,
a:focus-visible {
  outline-offset: 5px;
}

/* ========================================
   ANTI-ALIASING
======================================== */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ========================================
   GPU ACCELERATION
======================================== */
.service-card,
.package-card,
.benefit-card,
.modal-content {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* ========================================
   PREFERS REDUCED DATA
======================================== */
@media (prefers-reduced-data: reduce) {
  .hero-background img,
  .parking-bg img {
    display: none;
  }

  .hero-particles {
    display: none;
  }
}
</style>
