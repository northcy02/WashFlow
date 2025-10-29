<!-- src/pages/booking.vue -->
<template>
  <div class="booking-page">
    <Navigator />

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1>จองบริการล้างรถ</h1>
        <p>เลือกบริการที่ต้องการ ง่าย รวดเร็ว</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="main">
      <div class="container">
        
        <!-- Progress -->
        <div class="progress">
          <div class="step" :class="{ active: currentStep >= 1 }">
            <span>1</span>
            <label>เลือกรถ</label>
          </div>
          <div class="line" :class="{ active: currentStep >= 2 }"></div>
          <div class="step" :class="{ active: currentStep >= 2 }">
            <span>2</span>
            <label>เลือกบริการ</label>
          </div>
          <div class="line" :class="{ active: currentStep >= 3 }"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <span>3</span>
            <label>ยืนยัน</label>
          </div>
        </div>

        <!-- Step 1: Vehicles -->
        <div v-if="currentStep === 1" class="content">
          <h2>เลือกประเภทรถ</h2>
          <div class="grid">
            <div 
              v-for="vehicle in vehicles" 
              :key="vehicle.id"
              class="card"
              :class="{ selected: selectedVehicle === vehicle.id }"
              @click="selectedVehicle = vehicle.id"
            >
              <div class="icon" v-html="vehicle.icon"></div>
              <h3>{{ vehicle.name }}</h3>
              <p>{{ vehicle.desc }}</p>
            </div>
          </div>
          <div class="actions">
            <button class="btn primary" :disabled="!selectedVehicle" @click="currentStep = 2">
              ถัดไป →
            </button>
          </div>
        </div>

        <!-- Step 2: Services -->
        <div v-if="currentStep === 2" class="content">
          <h2>เลือกบริการ</h2>
          <div class="grid">
            <div 
              v-for="service in services" 
              :key="service.id"
              class="card"
              :class="{ selected: selectedServices.includes(service.id) }"
              @click="toggleService(service.id)"
            >
              <div class="badge" v-if="service.hot">HOT</div>
              <div class="icon" v-html="service.icon"></div>
              <h3>{{ service.name }}</h3>
              <p class="price">฿{{ service.price }}</p>
              <small>{{ service.time }}</small>
            </div>
          </div>

          <!-- Summary -->
          <div v-if="selectedServices.length > 0" class="summary">
            <div class="row">
              <span>รวม {{ selectedServices.length }} บริการ</span>
              <span>฿{{ subtotal }}</span>
            </div>
            <div v-if="discount > 0" class="row discount">
              <span>ส่วนลด {{ discountPercent }}%</span>
              <span>-฿{{ discount }}</span>
            </div>
            <div class="row total">
              <strong>ยอดรวม</strong>
              <strong>฿{{ total }}</strong>
            </div>
          </div>

          <div class="actions">
            <button class="btn" @click="currentStep = 1">← ย้อนกลับ</button>
            <button class="btn primary" :disabled="selectedServices.length === 0" @click="currentStep = 3">
              ถัดไป →
            </button>
          </div>
        </div>

        <!-- Step 3: Confirm -->
        <div v-if="currentStep === 3" class="content">
          <h2>ยืนยันการจอง</h2>
          
          <div class="details">
            <div class="detail-row">
              <label>ประเภทรถ</label>
              <span>{{ getVehicleName(selectedVehicle) }}</span>
            </div>
            <div class="detail-row">
              <label>บริการ</label>
              <div class="tags">
                <span v-for="id in selectedServices" :key="id" class="tag">
                  {{ getServiceName(id) }}
                </span>
              </div>
            </div>
            <div class="detail-row">
              <label>วันที่</label>
              <span>{{ currentDate }}</span>
            </div>
            <div class="detail-row total">
              <label>ยอดชำระ</label>
              <strong>฿{{ total }}</strong>
            </div>
          </div>

          <!-- Payment -->
          <div class="payment">
            <h3>วิธีชำระเงิน</h3>
            <div class="payment-grid">
              <label class="payment-option" :class="{ selected: paymentMethod === 'cash' }">
                <input type="radio" v-model="paymentMethod" value="cash">
                <span>💵 เงินสด</span>
              </label>
              <label class="payment-option" :class="{ selected: paymentMethod === 'card' }">
                <input type="radio" v-model="paymentMethod" value="card">
                <span>💳 บัตร</span>
              </label>
              <label class="payment-option" :class="{ selected: paymentMethod === 'qr' }">
                <input type="radio" v-model="paymentMethod" value="qr">
                <span>📱 QR</span>
              </label>
            </div>
          </div>

          <!-- Terms -->
          <label class="checkbox">
            <input type="checkbox" v-model="acceptTerms">
            <span>ยอมรับ <a href="#">เงื่อนไขการใช้บริการ</a></span>
          </label>

          <div class="actions">
            <button class="btn" @click="currentStep = 2">← ย้อนกลับ</button>
            <button 
              class="btn primary" 
              :disabled="!acceptTerms || !paymentMethod"
              @click="confirmBooking"
            >
              ✓ ยืนยันการจอง
            </button>
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
const currentStep = ref(1);
const selectedVehicle = ref('');
const selectedServices = ref<string[]>([]);
const paymentMethod = ref('');
const acceptTerms = ref(false);

const vehicles = [
  { id: 'sedan', name: 'รถเก๋ง', desc: '4 ประตู', icon: '🚗' },
  { id: 'truck', name: 'กระบะ', desc: 'Pick-up', icon: '🚙' },
  { id: 'suv', name: 'SUV/รถตู้', desc: '7-9 ที่นั่ง', icon: '🚐' },
  { id: 'motor', name: 'มอเตอร์ไซค์', desc: 'Bike', icon: '🏍️' }
];

const services = [
  { id: 'wash', name: 'ล้างรถ', price: 200, time: '30 นาที', hot: true, icon: '🚿' },
  { id: 'coating', name: 'เคลือบแก้ว', price: 150, time: '15 นาที', icon: '✨' },
  { id: 'polish', name: 'ขัดสี', price: 1000, time: '60 นาที', hot: true, icon: '💎' },
  { id: 'vacuum', name: 'ดูดฝุ่น', price: 80, time: '20 นาที', icon: '🌪️' },
  { id: 'interior', name: 'ซักเบาะ', price: 2000, time: '90 นาที', icon: '🧼' }
];

const subtotal = computed(() => 
  selectedServices.value.reduce((sum, id) => 
    sum + (services.find(s => s.id === id)?.price || 0), 0
  )
);

const discountPercent = computed(() => 
  selectedServices.value.length >= 3 ? 20 : selectedServices.value.length >= 2 ? 10 : 0
);

const discount = computed(() => 
  Math.floor(subtotal.value * (discountPercent.value / 100))
);

const total = computed(() => subtotal.value - discount.value);

const currentDate = computed(() => 
  new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
);

const toggleService = (id: string) => {
  const index = selectedServices.value.indexOf(id);
  if (index > -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(id);
  }
};

const getVehicleName = (id: string) => vehicles.find(v => v.id === id)?.name || '';
const getServiceName = (id: string) => services.find(s => s.id === id)?.name || '';

const confirmBooking = () => {
  const booking = {
    id: Date.now(),
    date: currentDate.value,
    carType: getVehicleName(selectedVehicle.value),
    services: selectedServices.value.map(id => getServiceName(id)),
    total: total.value,
    paymentMethod: paymentMethod.value,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const bookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
  bookings.unshift(booking);
  localStorage.setItem('bookingHistory', JSON.stringify(bookings));

  Swal.fire({
    title: 'จองสำเร็จ! ✓',
    html: `
      <div style="padding: 1rem;">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">รหัส: #${booking.id}</p>
        <p style="font-size: 2rem; color: #dc2626; font-weight: 900;">฿${total.value}</p>
      </div>
    `,
    icon: 'success',
    confirmButtonText: 'ดูประวัติ',
    confirmButtonColor: '#dc2626'
  }).then(() => {
    router.push('/history');
  });
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
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* Hero */
.hero {
  margin-top: 80px;
  padding: 4rem 2rem 2rem;
  text-align: center;
  background: linear-gradient(180deg, #1a1a1a 0%, #000 100%);
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #dc2626;
}

.hero p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Main */
.main {
  padding: 2rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Progress */
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.3;
  transition: all 0.3s;
}

.step.active {
  opacity: 1;
}

.step span {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.3s;
}

.step.active span {
  background: #dc2626;
  border-color: #dc2626;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

.step label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.step.active label {
  color: #fff;
  font-weight: 600;
}

.line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.line.active {
  background: #dc2626;
}

/* Content */
.content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  position: relative;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-4px);
}

.card.selected {
  background: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}

.card .badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc2626;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.card .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.card .price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
  margin: 0.5rem 0;
}

.card small {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Summary */
.summary {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(220, 38, 38, 0.2);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.row:last-child {
  border-bottom: none;
}

.row.discount {
  color: #10b981;
}

.row.total {
  font-size: 1.2rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
}

/* Details */
.details {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

.detail-row.total {
  padding-top: 1.5rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  font-size: 1.3rem;
}

.detail-row.total strong {
  color: #dc2626;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 12px;
  font-size: 0.85rem;
  color: #dc2626;
}

/* Payment */
.payment {
  margin-bottom: 2rem;
}

.payment h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.payment-option {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option input {
  display: none;
}

.payment-option:hover {
  border-color: rgba(220, 38, 38, 0.5);
}

.payment-option.selected {
  background: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
}

.payment-option span {
  font-size: 1.1rem;
  font-weight: 600;
}

/* Checkbox */
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 2rem;
  cursor: pointer;
}

.checkbox input {
  width: 20px;
  height: 20px;
  accent-color: #dc2626;
}

.checkbox a {
  color: #dc2626;
  text-decoration: underline;
}

/* Actions */
.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn.primary {
  background: #dc2626;
  border-color: #dc2626;
}

.btn.primary:hover:not(:disabled) {
  background: #b91c1c;
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);
}

.btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .payment-grid {
    grid-template-columns: 1fr;
  }
  
  .progress {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .line {
    width: 30px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
