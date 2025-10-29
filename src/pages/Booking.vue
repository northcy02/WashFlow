<template>
  <div class="booking-page">
    <Navigator />

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1>🚗 จองบริการล้างรถ</h1>
        <p>เลือกบริการที่ต้องการ ง่าย รวดเร็ว ปลอดภัย</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="main">
      <div class="container">
        
        <!-- Progress Stepper -->
        <div class="progress">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <span>{{ currentStep > 1 ? '✓' : '1' }}</span>
            <label>เลือกรถ</label>
          </div>
          <div class="line" :class="{ active: currentStep >= 2 }"></div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <span>{{ currentStep > 2 ? '✓' : '2' }}</span>
            <label>เลือกบริการ</label>
          </div>
          <div class="line" :class="{ active: currentStep >= 3 }"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <span>3</span>
            <label>ยืนยัน</label>
          </div>
        </div>

        <!-- Step 1: Vehicles + Optional Plate -->
        <div v-if="currentStep === 1" class="content">
          <h2>🚙 เลือกประเภทรถของคุณ</h2>
          
          <div class="grid">
            <div 
              v-for="vehicle in carTypes" 
              :key="vehicle.id"
              class="card"
              :class="{ selected: selectedVehicle === vehicle.id }"
              @click="selectedVehicle = vehicle.id"
            >
              <div class="car-image">
                  <!-- ส่วนไอคอน -->
                  <div class="flex justify-center items-center h-[90px] w-full">
                    <img 
                      :src="vehicle.image" 
                      :alt="vehicle.name"
                      class="h-[70px] w-auto object-contain"
                    />
                  </div>
              </div>
              <div class="size-badge">{{ vehicle.size }}</div>
              <h3>{{ vehicle.name }}</h3>
              <p>{{ vehicle.desc }}</p>
<<<<<<< HEAD

=======
              <div class="price-badge">
                <span class="base-price">฿{{ vehicle.basePrice.toLocaleString() }}</span>
                <span class="price-label">ราคาเริ่มต้น</span>
              </div>
>>>>>>> 01c566acc9c94c31becbe28a4325d41011c5ccd5
              <div v-if="selectedVehicle === vehicle.id" class="checkmark">✓</div>
            </div>
          </div>
        


          <!-- Optional: Vehicle Plate -->
          <div class="vehicle-details" v-if="selectedVehicle">
            <h3>ข้อมูลรถ (ไม่บังคับ)</h3>
            <div class="form-row">
              <div class="form-field">
                <label>🔖 ทะเบียนรถ</label>
                <input 
                  v-model="vehiclePlate" 
                  type="text" 
                  placeholder="เช่น กข-1234, ABC-123 หรือ 1กก-2345"
                  class="input-field plate-input"
                  @input="formatPlate"
                  maxlength="15"
                >
                <small>สามารถกรอกภาษาไทย อังกฤษ หรือตัวเลข (ไม่บังคับ)</small>
              </div>
              <div class="form-field">
                <label>🎨 สีรถ</label>
                <select v-model="vehicleColor" class="input-field">
                  <option value="">เลือกสี (ไม่บังคับ)</option>
                  <option value="ขาว">ขาว</option>
                  <option value="ดำ">ดำ</option>
                  <option value="เทา">เทา</option>
                  <option value="เงิน">เงิน</option>
                  <option value="แดง">แดง</option>
                  <option value="น้ำเงิน">น้ำเงิน</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>
            </div>
            
            <!-- แสดงข้อมูลราคาเริ่มต้น -->
            <div class="vehicle-info-card">
              <div class="info-item">
                <span class="info-label">ประเภทรถ:</span>
                <span class="info-value">{{ getVehicleName(selectedVehicle) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ราคาพื้นฐาน:</span>
                <span class="info-value price">฿{{ getVehicleBasePrice(selectedVehicle).toLocaleString() }}</span>
              </div>
              <div class="info-note">
                💡 ราคาจริงจะคำนวณจากราคาพื้นฐาน + ค่าบริการที่เลือก
              </div>
            </div>
          </div>

          <div class="actions">
            <button 
              class="btn primary" 
              :disabled="!selectedVehicle" 
              @click="goToStep2"
            >
              ถัดไป: เลือกบริการ →
            </button>
          </div>
        </div>

        <!-- Step 2: Services + Date/Time -->
        <div v-if="currentStep === 2" class="content">
          <h2>✨ เลือกบริการล้างรถ</h2>
          
          <!-- Vehicle Base Price Info -->
          <div class="vehicle-price-info">
            <div class="info-content">
              <span class="vehicle-icon">{{ getVehicleIcon(selectedVehicle) }}</span>
              <div class="info-text">
                <strong>{{ getVehicleName(selectedVehicle) }}</strong>
                <small>ราคาพื้นฐาน: ฿{{ getVehicleBasePrice(selectedVehicle).toLocaleString() }}</small>
              </div>
            </div>
          </div>

          <!-- Services Grid -->
          <div class="grid services-grid">
            <div 
              v-for="service in services" 
              :key="service.id"
              class="card service-card"
              :class="{ selected: selectedServices.includes(service.id) }"
              @click="toggleService(service.id)"
            >
              <div class="badge hot" v-if="service.hot">🔥 HOT</div>
              <div class="badge popular" v-if="service.hot">⭐ นิยม</div>
              <div class="service-image">
              <img :src="service.image" :alt="service.name" />
              </div>
              <h3>{{ service.name }}</h3>
              <p class="price">฿{{ service.price.toLocaleString() }}</p>
              <div class="service-meta">
                <small>⏱️ {{ service.time }}</small>
              </div>
              <div v-if="selectedServices.includes(service.id)" class="checkmark">✓</div>
            </div>
          </div>

          <!-- Selected Services Summary -->
          <div v-if="selectedServices.length > 0" class="selected-services">
            <h4>🛒 บริการที่เลือก ({{ selectedServices.length }})</h4>
            <div class="service-tags">
              <span 
                v-for="id in selectedServices" 
                :key="id" 
                class="service-tag"
                @click="toggleService(id)"
              >
                {{ getServiceName(id) }}
                <span class="remove">×</span>
              </span>
            </div>
          </div>

          <!-- Date & Time Selection -->
          <div class="datetime-section">
            <h3>📅 เลือกวันที่และเวลา</h3>
            
            <div class="datetime-grid">
              <div class="form-field">
                <label>วันที่ <span class="required">*</span></label>
                <input 
                  v-model="selectedDate" 
                  type="date" 
                  :min="minDate"
                  :max="maxDate"
                  required
                  class="date-input"
                >
                <small>📌 จองล่วงหน้าได้สูงสุด 30 วัน</small>
              </div>

              <div class="form-field">
                <label>เวลา <span class="required">*</span></label>
                <select v-model="selectedTime" required class="time-select">
                  <option value="">เลือกเวลา</option>
                  <option 
                    v-for="time in availableTimes" 
                    :key="time" 
                    :value="time"
                    :disabled="isTimeDisabled(time)"
                  >
                    {{ time }} น. {{ isTimeDisabled(time) ? '(เต็ม)' : '' }}
                  </option>
                </select>
                <small>🕐 เปิดบริการ 09:00 - 18:00 น.</small>
              </div>
            </div>

            <div v-if="selectedDate && selectedTime" class="selected-datetime">
              <span class="icon">✓</span>
              <div>
                <strong>{{ formatSelectedDateTime }}</strong>
                <p>กรุณามาตรงเวลาเพื่อรับบริการที่ดีที่สุด</p>
              </div>
            </div>
          </div>

          <!-- Price Summary -->
          <div v-if="selectedServices.length > 0" class="summary enhanced">
            <h4>💰 สรุปค่าใช้จ่าย</h4>
            
            <!-- Vehicle Base Price -->
            <div class="summary-items">
              <div class="summary-item base-price-item">
                <span>{{ getVehicleName(selectedVehicle) }} (ราคาพื้นฐาน)</span>
                <span>฿{{ getVehicleBasePrice(selectedVehicle).toLocaleString() }}</span>
              </div>
            </div>

            <div class="divider-small"></div>

            <!-- Service List -->
            <div class="summary-items">
              <div 
                v-for="id in selectedServices" 
                :key="id" 
                class="summary-item"
              >
                <span>{{ getServiceName(id) }}</span>
                <span>฿{{ getServicePrice(id).toLocaleString() }}</span>
              </div>
            </div>

            <div class="row subtotal">
              <span>รวมค่าบริการ ({{ selectedServices.length + 1 }} รายการ)</span>
              <span>฿{{ subtotal.toLocaleString() }}</span>
            </div>
            
            <div v-if="discount > 0" class="row discount">
              <span>🎉 ส่วนลด {{ discountPercent }}% {{ getDiscountReason() }}</span>
              <span>-฿{{ discount.toLocaleString() }}</span>
            </div>
            
            <div class="row total">
              <strong>ยอดชำระทั้งหมด</strong>
              <strong class="total-amount">฿{{ total.toLocaleString() }}</strong>
            </div>
          </div>

          <div class="actions">
            <button class="btn" @click="goToStep1">
              ← ย้อนกลับ
            </button>
            <button 
              class="btn primary" 
              :disabled="!canGoToStep3"
              @click="goToStep3"
            >
              ถัดไป: ยืนยันการจอง →
            </button>
          </div>
        </div>

        <!-- Step 3: Confirm -->
        <div v-if="currentStep === 3" class="content">
          <h2>✅ ยืนยันการจอง</h2>
          
          <!-- Booking Summary --> 
          <div class="confirmation-card">
            <div class="detail-section">
              <h4>🚗 ข้อมูลรถ</h4>
              <div class="detail-row">
                <label>ประเภทรถ</label>
                <span class="value">{{ getVehicleName(selectedVehicle) }}</span>
              </div>
              <div class="detail-row">
                <label>ราคาพื้นฐาน</label>
                <span class="value price-highlight">฿{{ getVehicleBasePrice(selectedVehicle).toLocaleString() }}</span>
              </div>
              <div class="detail-row" v-if="vehiclePlate">
                <label>ทะเบียนรถ</label>
                <span class="value">{{ vehiclePlate }}</span>
              </div>
              <div class="detail-row" v-if="vehicleColor">
                <label>สีรถ</label>
                <span class="value">{{ vehicleColor }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="detail-section">
              <h4>✨ บริการที่เลือก</h4>
              <div class="services-list">
                <div 
                  v-for="id in selectedServices" 
                  :key="id" 
                  class="service-item"
                >
                  <span class="service-name">
                    {{ getServiceIcon(id) }} {{ getServiceName(id) }}
                  </span>
                  <span class="service-price">฿{{ getServicePrice(id).toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="detail-section">
              <h4>📅 วันที่และเวลา</h4>
              <div class="datetime-display">
                <div class="datetime-value">
                  {{ formatSelectedDateTime }}
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="detail-section">
              <h4>💰 สรุปค่าใช้จ่าย</h4>
              <div class="price-summary">
                <div class="price-row base">
                  <span>{{ getVehicleName(selectedVehicle) }} (พื้นฐาน)</span>
                  <span>฿{{ getVehicleBasePrice(selectedVehicle).toLocaleString() }}</span>
                </div>
                <div class="price-row" v-for="id in selectedServices" :key="id">
                  <span>{{ getServiceName(id) }}</span>
                  <span>฿{{ getServicePrice(id).toLocaleString() }}</span>
                </div>
                <div class="price-row subtotal-row">
                  <span>รวมค่าบริการ</span>
                  <span>฿{{ subtotal.toLocaleString() }}</span>
                </div>
                <div v-if="discount > 0" class="price-row discount">
                  <span>ส่วนลด {{ discountPercent }}%</span>
                  <span>-฿{{ discount.toLocaleString() }}</span>
                </div>
                <div class="price-row total">
                  <strong>ยอดชำระทั้งหมด</strong>
                  <strong class="total-price">฿{{ total.toLocaleString() }}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="payment-section">
            <h3>💳 เลือกวิธีชำระเงิน</h3>
            <div class="payment-grid">
              <label 
                class="payment-option" 
                :class="{ selected: paymentMethod === 'cash' }"
              >
                <input type="radio" v-model="paymentMethod" value="cash">
                <div class="payment-content">
                  <span class="payment-icon">💵</span>
                  <span class="payment-label">เงินสด</span>
                  <small>ชำระที่หน้าร้าน</small>
                </div>
              </label>

              <label 
                class="payment-option" 
                :class="{ selected: paymentMethod === 'card' }"
              >
                <input type="radio" v-model="paymentMethod" value="card">
                <div class="payment-content">
                  <span class="payment-icon">💳</span>
                  <span class="payment-label">บัตรเครดิต/เดบิต</span>
                  <small>Visa, Mastercard</small>
                </div>
              </label>

              <label 
                class="payment-option" 
                :class="{ selected: paymentMethod === 'qr' }"
              >
                <input type="radio" v-model="paymentMethod" value="qr">
                <div class="payment-content">
                  <span class="payment-icon">📱</span>
                  <span class="payment-label">QR Code</span>
                  <small>PromptPay, TrueMoney</small>
                </div>
              </label>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div class="terms-section">
            <label class="checkbox">
              <input type="checkbox" v-model="acceptTerms">
              <span>
                ฉันได้อ่านและยอมรับ 
                <a href="#" @click.prevent="showTerms">เงื่อนไขการใช้บริการ</a>
              </span>
            </label>
          </div>

          <!-- Actions -->
          <div class="actions">
            <button class="btn" @click="goToStep2">
              ← แก้ไขข้อมูล
            </button>
            <button 
              class="btn primary confirm-btn" 
              :disabled="!canConfirm || isLoading"
              @click="confirmBooking"
            >
              <span v-if="!isLoading">✓ ยืนยันการจอง</span>
              <span v-else class="loading">
                <span class="spinner"></span>
                กำลังดำเนินการ...
              </span>
            </button>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

// ✅ State
const currentStep = ref(1);
const selectedVehicle = ref('');
const selectedServices = ref<string[]>([]);
const paymentMethod = ref('');
const acceptTerms = ref(false);
const selectedDate = ref('');
const selectedTime = ref('');
const vehiclePlate = ref('');
const vehicleColor = ref('');
const isLoading = ref(false);

<<<<<<< HEAD
// ✅ Data
const carTypes = [
  { 
    id: 'sedan', 
    name: 'รถเก๋ง', 
    desc: 'Sedan', 
    size: 'M',
    image: '/icons/sedan.svg'
  },
  { 
    id: 'pickup', 
    name: 'รถกระบะ', 
    desc: 'Pickup', 
    size: 'L',
    image: '/icons/pickup.svg'
=======
// ✅ Data - รถทุกประเภทพร้อมราคาพื้นฐาน (อัพเดทราคาใหม่)
const vehicles = [
  { 
    id: 'sedan', 
    name: 'รถเก๋ง', 
    desc: 'Sedan (4 ประตู)', 
    icon: '🚗',
    basePrice: 250  // เปลี่ยนจาก 300 เป็น 250
  },
  { 
    id: 'truck', 
    name: 'กระบะ', 
    desc: 'Pickup Truck', 
    icon: '🚙',
    basePrice: 300  // เปลี่ยนจาก 400 เป็น 300
>>>>>>> 01c566acc9c94c31becbe28a4325d41011c5ccd5
  },
  { 
    id: 'sports', 
    name: 'รถสปอร์ต', 
<<<<<<< HEAD
    desc: 'Sports', 
    size: 'M',
    image: '/icons/sports.svg'
  },
  { 
    id: 'van', 
    name: 'รถตู้', 
    desc: 'Van', 
    size: 'XL',
    image: '/icons/van.svg'
  },
  { 
    id: 'motorcycle', 
    name: 'มอเตอร์ไซค์', 
    desc: 'Bike', 
    size: 'S',
    image: '/icons/motorcycle.svg'
=======
    desc: 'Sports Car', 
    icon: '🏎️',
    basePrice: 500  // คงเดิม
  },
  { 
    id: 'suv', 
    name: 'SUV/รถตู้', 
    desc: '7-9 ที่นั่ง', 
    icon: '🚐',
    basePrice: 400  // เปลี่ยนจาก 600 เป็น 400
  },
  { 
    id: 'motor', 
    name: 'มอเตอร์ไซค์', 
    desc: 'Motorcycle', 
    icon: '🏍️',
    basePrice: 150  // คงเดิม
>>>>>>> 01c566acc9c94c31becbe28a4325d41011c5ccd5
  }
];

// บริการเสริม (ไม่รวมราคาพื้นฐานของรถ)
const services = [
  { 
    id: 'wash', 
    name: 'ล้างรถ', 
    desc: 'Basic Wash',
    price: 200, 
    time: '30 นาที', 
    hot: true, 
    image: '/icons/wash.svg'
  },
  { 
    id: 'coating', 
    name: 'เคลือบสีรถ', 
    desc: 'Glass Coating',
    price: 150, 
    time: '15 นาที', 
    hot: false,
    image: '/icons/coating.svg'
  },
  { 
    id: 'polish', 
    name: 'ขัดสี', 
    desc: 'Polish',
    price: 1000, 
    time: '60 นาที', 
    hot: true, 
    image: '/icons/polish.svg'
  },
  { 
    id: 'vacuum', 
    name: 'ดูดฝุ่น', 
    desc: 'Vacuum',
    price: 80, 
    time: '20 นาที', 
    hot: false,
    image: '/icons/vacuum.svg'
  },
  { 
    id: 'interior', 
    name: 'ซักเบาะ', 
    desc: 'Interior Cleaning',
    price: 2000, 
    time: '90 นาที', 
    hot: false,
    image: '/icons/interior.svg'
  }
];

<<<<<<< HEAD
=======
// ✅ รับค่าจาก query parameter (จากหน้า cartypes)
if (route.query.carType) {
  selectedVehicle.value = route.query.carType as string;
}
>>>>>>> 01c566acc9c94c31becbe28a4325d41011c5ccd5

// ✅ Computed
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const maxDate = computed(() => {
  const today = new Date();
  today.setDate(today.getDate() + 30);
  return today.toISOString().split('T')[0];
});

const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

const formatSelectedDateTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return '-';
  
  const date = new Date(selectedDate.value);
  const thaiDate = date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  
  return `${thaiDate} เวลา ${selectedTime.value} น.`;
});

// 💰 คำนวณราคา: ราคาพื้นฐานรถ + ราคาบริการทั้งหมด
const subtotal = computed(() => {
  const vehicleBasePrice = getVehicleBasePrice(selectedVehicle.value);
  const servicesTotal = selectedServices.value.reduce((sum, id) => 
    sum + (services.find(s => s.id === id)?.price || 0), 0
  );
  return vehicleBasePrice + servicesTotal;
});

const discountPercent = computed(() => 
  selectedServices.value.length >= 3 ? 20 : selectedServices.value.length >= 2 ? 10 : 0
);

const discount = computed(() => 
  Math.floor(subtotal.value * (discountPercent.value / 100))
);

const total = computed(() => subtotal.value - discount.value);

const canGoToStep3 = computed(() => 
  selectedServices.value.length > 0 && selectedDate.value && selectedTime.value
);

const canConfirm = computed(() => 
  acceptTerms.value && paymentMethod.value && !isLoading.value
);

// ✅ Methods
const selectVehicle = (id: string) => {
  selectedVehicle.value = id;
};

const toggleService = (id: string) => {
  const index = selectedServices.value.indexOf(id);
  if (index > -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(id);
  }
};

const formatPlate = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value;
  
  // แปลงภาษาอังกฤษเป็นตัวพิมพ์ใหญ่
  value = value.replace(/[a-z]/g, (char) => char.toUpperCase());
  
  // อนุญาต: ภาษาไทย, อังกฤษ, ตัวเลข, - และช่องว่าง
  value = value.replace(/[^\u0E00-\u0E7FA-Z0-9\s-]/g, '');
  
  // จำกัดไม่เกิน 15 ตัวอักษร
  if (value.length > 15) {
    value = value.substring(0, 15);
  }
  
  vehiclePlate.value = value;
};

const isTimeDisabled = (time: string) => {
  return false;
};

<<<<<<< HEAD
const getVehicleName = (id: string) => carTypes.find(v => v.id === id)?.name || '';
=======
const getVehicleName = (id: string) => vehicles.find(v => v.id === id)?.name || '';
const getVehicleIcon = (id: string) => vehicles.find(v => v.id === id)?.icon || '';
const getVehicleBasePrice = (id: string) => vehicles.find(v => v.id === id)?.basePrice || 0;

>>>>>>> 01c566acc9c94c31becbe28a4325d41011c5ccd5
const getServiceName = (id: string) => services.find(s => s.id === id)?.name || '';
const getServicePrice = (id: string) => services.find(s => s.id === id)?.price || 0;
const getServiceIcon = (id: string) => services.find(s => s.id === id)?.image || '';

const getDiscountReason = () => {
  if (selectedServices.value.length >= 3) return '(จอง 3 บริการขึ้นไป)';
  if (selectedServices.value.length >= 2) return '(จอง 2 บริการ)';
  return '';
};

const goToStep1 = () => currentStep.value = 1;
const goToStep2 = () => {
  if (!selectedVehicle.value) {
    Swal.fire({
      title: 'กรุณาเลือกประเภทรถ',
      icon: 'warning',
      confirmButtonColor: '#dc2626'
    });
    return;
  }
  currentStep.value = 2;
};

const goToStep3 = () => {
  if (selectedServices.value.length === 0) {
    Swal.fire({
      title: 'กรุณาเลือกบริการ',
      text: 'เลือกอย่างน้อย 1 บริการ',
      icon: 'warning',
      confirmButtonColor: '#dc2626'
    });
    return;
  }
  if (!selectedDate.value || !selectedTime.value) {
    Swal.fire({
      title: 'กรุณาเลือกวันที่และเวลา',
      icon: 'warning',
      confirmButtonColor: '#dc2626'
    });
    return;
  }
  currentStep.value = 3;
};

const showTerms = () => {
  Swal.fire({
    title: 'เงื่อนไขการใช้บริการ',
    html: `
      <div style="text-align: left; max-height: 400px; overflow-y: auto;">
        <h4>1. ข้อตกลงทั่วไป</h4>
        <p>• กรุณามาตรงเวลาที่จอง</p>
        <p>• หากยกเลิกต้องแจ้งล่วงหน้าอย่างน้อย 2 ชั่วโมง</p>
        
        <h4>2. การชำระเงิน</h4>
        <p>• ชำระหน้าร้านหลังรับบริการเสร็จ</p>
        <p>• รับบัตรเครดิต/เดบิต และ QR Code</p>
        
        <h4>3. การรับประกัน</h4>
        <p>• รับประกันความพึงพอใจ</p>
        <p>• หากไม่พอใจสามารถแจ้งได้ภายใน 24 ชั่วโมง</p>
      </div>
    `,
    confirmButtonText: 'รับทราบ',
    confirmButtonColor: '#dc2626',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });
};

const confirmBooking = async () => {
  try {
    isLoading.value = true;

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      Swal.fire({
        title: 'กรุณาเข้าสู่ระบบ',
        icon: 'warning',
        confirmButtonColor: '#dc2626'
      });
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);

    const response = await axios.post('http://localhost:3000/api/booking/create', {
      customer_id: user.id,
      branch_id: 1,
      booking_date: selectedDate.value,
      booking_time: selectedTime.value,
      vehicle_type: getVehicleName(selectedVehicle.value),
      vehicle_plate: vehiclePlate.value || null,
      vehicle_color: vehicleColor.value || null,
      services: selectedServices.value.map(id => getServiceName(id)),
      payment_method: paymentMethod.value,
      total_amount: total.value,
      base_price: getVehicleBasePrice(selectedVehicle.value)
    });

    if (response.data.success) {
      await Swal.fire({
        title: '🎉 จองสำเร็จ!',
        html: `
          <div style="padding: 1.5rem; text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✓</div>
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">
              <strong>รหัสการจอง: #${response.data.booking.id}</strong>
            </p>
            <p style="margin-bottom: 0.5rem;">
              <strong>Invoice:</strong> ${response.data.booking.invoice_number}
            </p>
            <p style="margin-bottom: 0.5rem;">
              <strong>ประเภทรถ:</strong> ${getVehicleName(selectedVehicle.value)}
            </p>
            <p style="margin-bottom: 1rem;">
              <strong>วันที่:</strong> ${formatSelectedDateTime.value}
            </p>
            <div style="background: rgba(220, 38, 38, 0.1); padding: 1.5rem; border-radius: 12px; margin-top: 1rem;">
              <p style="font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 0.5rem;">
                ราคาพื้นฐาน: ฿${getVehicleBasePrice(selectedVehicle.value).toLocaleString()}
              </p>
              <p style="font-size: 2.5rem; color: #dc2626; font-weight: 900; margin: 0;">
                ฿${total.value.toLocaleString()}
              </p>
            </div>
            <p style="margin-top: 1rem; color: rgba(255,255,255,0.7); font-size: 0.9rem;">
              กรุณามาตรงเวลาเพื่อรับบริการที่ดีที่สุด
            </p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'ดูประวัติการจอง',
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff',
        showCancelButton: true,
        cancelButtonText: 'กลับหน้าหลัก',
        cancelButtonColor: '#6b7280'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/history');
        } else {
          router.push('/');
        }
      });
    }

  } catch (error: any) {
    console.error('❌ Booking Error:', error);
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.response?.data?.message || 'ไม่สามารถจองบริการได้',
      icon: 'error',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
  } finally {
    isLoading.value = false;
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
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* ========================================
   HERO SECTION
======================================== */
.hero {
  margin-top: 80px;
  padding: 4rem 2rem 2rem;
  text-align: center;
  background: linear-gradient(180deg, #1a1a1a 0%, #000 100%);
  border-bottom: 2px solid rgba(220, 38, 38, 0.2);
}

.hero h1 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #dc2626;
  text-shadow: 0 0 40px rgba(220, 38, 38, 0.5);
  letter-spacing: 1px;
}

.hero p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* ========================================
   MAIN CONTENT
======================================== */
.main {
  padding: 3rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ========================================
   PROGRESS STEPPER
======================================== */
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.3;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 1;
}

.step span {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 3px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.4s;
  position: relative;
  z-index: 1;
}

.step.active span {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.6);
  transform: scale(1.1);
}

.step.completed span {
  background: #10b981;
  border-color: #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.step label {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

.step.active label {
  color: #fff;
  font-weight: 700;
}

.line {
  width: 80px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.5), transparent);
  transition: left 0.6s;
}

.line.active {
  background: linear-gradient(90deg, #dc2626 0%, #991b1b 100%);
}

.line.active::after {
  left: 100%;
}

/* ========================================
   CONTENT SECTIONS
======================================== */
.content {
  animation: fadeSlideIn 0.5s ease-out;
}

@keyframes fadeSlideIn {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  text-align: center;
  color: #fff;
  position: relative;
  display: inline-block;
  width: 100%;
}

.content h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
}

/* ========================================
   GRID LAYOUTS
======================================== */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.services-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* ========================================
   CARDS
======================================== */
.card {
  position: relative;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
  transition: left 0.6s;
}

.card:hover::before {
  left: 100%;
}

.card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
}

.card.selected {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(139, 0, 0, 0.15));
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
  transform: translateY(-5px);
}

/* Vehicle Cards */
.vehicle-card .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  transition: transform 0.3s;
}

.card:hover .icon {
  transform: scale(1.15) rotate(5deg);
}

.card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.card p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
}

/* Price Badge in Vehicle Card */
.price-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(220, 38, 38, 0.2);
  transition: all 0.3s;
}

.card:hover .price-badge {
  background: rgba(220, 38, 38, 0.2);
  border-color: rgba(220, 38, 38, 0.4);
}

.base-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
  line-height: 1;
}

.price-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

/* Service Cards */
.service-card {
  padding: 1.5rem;
}

.service-card .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-card .price {
  font-size: 1.8rem;
  font-weight: 900;
  color: #dc2626;
  margin: 1rem 0;
  text-shadow: 0 2px 10px rgba(220, 38, 38, 0.3);
}

.service-meta {
  margin-top: 0.5rem;
}

.service-meta small {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  display: block;
}

/* Badges */
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 2;
}

.badge.hot {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  animation: pulse 2s infinite;
}

.badge.popular {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Checkmark */
.checkmark {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  animation: checkmarkPop 0.3s ease-out;
}

@keyframes checkmarkPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* ========================================
   VEHICLE DETAILS & INFO
======================================== */
.vehicle-details {
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    padding: 0 2rem;
  }
  to {
    opacity: 1;
    max-height: 500px;
    padding: 2rem;
  }
}

.vehicle-details h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #dc2626;
}

.vehicle-info-card {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(220, 38, 38, 0.05);
  border: 2px solid rgba(220, 38, 38, 0.2);
  border-radius: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item:last-of-type {
  border-bottom: none;
  margin-bottom: 1rem;
}

.info-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.info-value.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #dc2626;
}

.info-note {
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
  color: rgba(16, 185, 129, 0.9);
  text-align: center;
}

/* Vehicle Price Info in Step 2 */
.vehicle-price-info {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(139, 0, 0, 0.1));
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 16px;
  animation: fadeIn 0.3s;
}

.info-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vehicle-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-text strong {
  font-size: 1.2rem;
  color: #fff;
}

.info-text small {
  font-size: 0.9rem;
  color: rgba(220, 38, 38, 0.9);
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.input-field {
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-family: 'Kanit', sans-serif;
  transition: all 0.3s;
}

.input-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.form-field small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ========================================
   SELECTED SERVICES
======================================== */
.selected-services {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  animation: fadeIn 0.3s;
}

.selected-services h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.service-tag {
  padding: 0.6rem 1.2rem;
  background: rgba(16, 185, 129, 0.2);
  border: 2px solid rgba(16, 185, 129, 0.4);
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #10b981;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-tag:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.service-tag .remove {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1;
}

/* ========================================
   DATETIME SECTION
======================================== */
.datetime-section {
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(220, 38, 38, 0.2);
  border-radius: 16px;
}

.datetime-section h3 {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 700;
}

.datetime-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.date-input,
.time-select {
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-family: 'Kanit', sans-serif;
  transition: all 0.3s;
  cursor: pointer;
}

.date-input:focus,
.time-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.time-select option {
  background: #1a1a1a;
  color: #fff;
  padding: 0.5rem;
}

.time-select option:disabled {
  color: #666;
}

.selected-datetime {
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: slideDown 0.3s ease-out;
}

.selected-datetime .icon {
  font-size: 2rem;
  color: #10b981;
  flex-shrink: 0;
}

.selected-datetime strong {
  display: block;
  font-size: 1.1rem;
  color: #10b981;
  margin-bottom: 0.3rem;
}

.selected-datetime p {
  font-size: 0.85rem;
  color: rgba(16, 185, 129, 0.8);
  margin: 0;
}

.required {
  color: #dc2626;
  font-weight: 700;
}

/* ========================================
   SUMMARY & PRICING
======================================== */
.summary {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(220, 38, 38, 0.2);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.summary.enhanced {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(139, 0, 0, 0.05));
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.summary h4 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-items {
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.base-price-item {
  font-weight: 600;
  color: #dc2626;
}

.divider-small {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.row:last-child {
  border-bottom: none;
}

.row.subtotal {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.row.discount {
  color: #10b981;
  font-weight: 600;
}

.row.total {
  font-size: 1.4rem;
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  font-weight: 700;
}

.total-amount {
  color: #dc2626;
  font-size: 2rem;
  text-shadow: 0 2px 20px rgba(220, 38, 38, 0.5);
}

/* ========================================
   CONFIRMATION CARD
======================================== */
.confirmation-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.detail-row .value {
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
}

.price-highlight {
  color: #dc2626 !important;
  font-size: 1.1rem !important;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 2rem 0;
}

/* Services List in Confirmation */
.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s;
}

.service-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
}

.service-name {
  font-size: 1rem;
  color: #fff;
  font-weight: 500;
}

.service-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc2626;
}

/* DateTime Display */
.datetime-display {
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
}

.datetime-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #10b981;
  text-align: center;
}

/* Price Summary in Confirmation */
.price-summary {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.price-row:last-child {
  border-bottom: none;
}

.price-row.base {
  font-weight: 600;
  color: rgba(220, 38, 38, 0.9);
}

.price-row.subtotal-row {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.price-row.discount {
  color: #10b981;
  font-weight: 600;
}

.price-row.total {
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  font-size: 1.2rem;
}

.total-price {
  font-size: 2rem;
  color: #dc2626;
  text-shadow: 0 2px 20px rgba(220, 38, 38, 0.5);
}

/* ========================================
   PAYMENT SECTION
======================================== */
.payment-section {
  margin-bottom: 2rem;
}

.payment-section h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #fff;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.payment-option {
  padding: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.payment-option input {
  display: none;
}

.payment-content {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.payment-icon {
  font-size: 3rem;
  transition: transform 0.3s;
}

.payment-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.payment-content small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.payment-option:hover {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(255, 255, 255, 0.05);
}

.payment-option:hover .payment-icon {
  transform: scale(1.2);
}

.payment-option.selected {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
}

.payment-option.selected .payment-icon {
  transform: scale(1.15);
}

/* ========================================
   TERMS & CONDITIONS
======================================== */
.terms-section {
  margin-bottom: 2rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.checkbox:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
}

.checkbox input[type="checkbox"] {
  width: 24px;
  height: 24px;
  accent-color: #dc2626;
  cursor: pointer;
}

.checkbox span {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.checkbox a {
  color: #dc2626;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.3s;
}

.checkbox a:hover {
  color: #fff;
}

/* ========================================
   ACTION BUTTONS
======================================== */
.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 1.2rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Kanit', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn.primary {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-color: #dc2626;
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
}

.btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  box-shadow: 0 6px 30px rgba(220, 38, 38, 0.5);
  transform: translateY(-3px);
}

.btn.confirm-btn {
  font-size: 1.1rem;
  padding: 1.3rem 3rem;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn .loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========================================
   RESPONSIVE DESIGN
======================================== */
@media (max-width: 1024px) {
  .datetime-grid {
    grid-template-columns: 1fr;
  }

  .payment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .progress {
    padding: 1.5rem 1rem;
    gap: 0.5rem;
  }

  .step span {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .step label {
    font-size: 0.8rem;
  }

  .line {
    width: 40px;
  }

  .grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .confirmation-card {
    padding: 1.5rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .service-tags {
    gap: 0.5rem;
  }

  .service-tag {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }

  .vehicle-icon {
    font-size: 2.5rem;
  }

  .info-text strong {
    font-size: 1rem;
  }

  .info-text small {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 2rem 1rem;
  }

  .content h2 {
    font-size: 1.5rem;
  }

  .card {
    padding: 1.5rem 1rem;
  }

  .vehicle-card .icon {
    font-size: 3rem;
  }

  .service-card .icon {
    font-size: 2.5rem;
  }

  .datetime-section,
  .summary,
  .vehicle-details,
  .vehicle-info-card {
    padding: 1.5rem;
  }

  .total-amount {
    font-size: 1.5rem;
  }

  .payment-content {
    padding: 1.5rem 1rem;
  }

  .payment-icon {
    font-size: 2.5rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

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

/* ========================================
   HERO SECTION
======================================== */
.hero {
  margin-top: 80px;
  padding: 4rem 2rem 2rem;
  text-align: center;
  background: linear-gradient(180deg, #1a1a1a 0%, #000 100%);
  border-bottom: 2px solid rgba(220, 38, 38, 0.2);
}

.hero h1 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: #dc2626;
  text-shadow: 0 0 40px rgba(220, 38, 38, 0.5);
  letter-spacing: 1px;
}

.hero p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* ========================================
   MAIN CONTENT
======================================== */
.main {
  padding: 3rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ========================================
   PROGRESS STEPPER
======================================== */
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.3;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.step.active {
  opacity: 1;
}

.step.completed {
  opacity: 1;
}

.step span {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 3px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  transition: all 0.4s;
  position: relative;
  z-index: 1;
}

.step.active span {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.6);
  transform: scale(1.1);
}

.step.completed span {
  background: #10b981;
  border-color: #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.step label {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}

.step.active label {
  color: #fff;
  font-weight: 700;
}

.line {
  width: 80px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.5), transparent);
  transition: left 0.6s;
}

.line.active {
  background: linear-gradient(90deg, #dc2626 0%, #991b1b 100%);
}

.line.active::after {
  left: 100%;
}

/* ========================================
   CONTENT SECTIONS
======================================== */
.content {
  animation: fadeSlideIn 0.5s ease-out;
}

@keyframes fadeSlideIn {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

.content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  text-align: center;
  color: #fff;
  position: relative;
  display: inline-block;
  width: 100%;
}

.content h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
}

/* ========================================
   GRID LAYOUTS
======================================== */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.services-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* ========================================
   CARDS
======================================== */
.card {
  position: relative;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
  transition: left 0.6s;
}

.card:hover::before {
  left: 100%;
}

.card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
}

.card.selected {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(139, 0, 0, 0.15));
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
  transform: translateY(-5px);
}

/* Vehicle Cards */
.vehicle-card .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  transition: transform 0.3s;
}

.card:hover .icon {
  transform: scale(1.15) rotate(5deg);
}

.card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.card p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Service Cards */
.service-card {
  padding: 1.5rem;
}

.service-card .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-card .price {
  font-size: 1.8rem;
  font-weight: 900;
  color: #dc2626;
  margin: 1rem 0;
  text-shadow: 0 2px 10px rgba(220, 38, 38, 0.3);
}

.service-meta {
  margin-top: 0.5rem;
}

.service-meta small {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  display: block;
}

/* Badges */
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 2;
}

.badge.hot {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  animation: pulse 2s infinite;
}

.badge.popular {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Checkmark */
.checkmark {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 32px;
  height: 32px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  animation: checkmarkPop 0.3s ease-out;
}

@keyframes checkmarkPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* ========================================
   VEHICLE DETAILS
======================================== */
.vehicle-details {
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    padding: 0 2rem;
  }
  to {
    opacity: 1;
    max-height: 500px;
    padding: 2rem;
  }
}

.vehicle-details h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #dc2626;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.input-field {
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-family: 'Kanit', sans-serif;
  transition: all 0.3s;
}

.input-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.form-field small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ========================================
   SELECTED SERVICES
======================================== */
.selected-services {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  animation: fadeIn 0.3s;
}

.selected-services h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.service-tag {
  padding: 0.6rem 1.2rem;
  background: rgba(16, 185, 129, 0.2);
  border: 2px solid rgba(16, 185, 129, 0.4);
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #10b981;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.service-tag:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

.service-tag .remove {
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1;
}

/* ========================================
   DATETIME SECTION
======================================== */
.datetime-section {
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(220, 38, 38, 0.2);
  border-radius: 16px;
}

.datetime-section h3 {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 700;
}

.datetime-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.date-input,
.time-select {
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-family: 'Kanit', sans-serif;
  transition: all 0.3s;
  cursor: pointer;
}

.date-input:focus,
.time-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.time-select option {
  background: #1a1a1a;
  color: #fff;
  padding: 0.5rem;
}

.time-select option:disabled {
  color: #666;
}

.selected-datetime {
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: slideDown 0.3s ease-out;
}

.selected-datetime .icon {
  font-size: 2rem;
  color: #10b981;
  flex-shrink: 0;
}

.selected-datetime strong {
  display: block;
  font-size: 1.1rem;
  color: #10b981;
  margin-bottom: 0.3rem;
}

.selected-datetime p {
  font-size: 0.85rem;
  color: rgba(16, 185, 129, 0.8);
  margin: 0;
}

.required {
  color: #dc2626;
  font-weight: 700;
}

/* ========================================
   SUMMARY & PRICING
======================================== */
.summary {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(220, 38, 38, 0.2);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.summary.enhanced {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(139, 0, 0, 0.05));
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.summary h4 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-items {
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.row:last-child {
  border-bottom: none;
}

.row.subtotal {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.row.discount {
  color: #10b981;
  font-weight: 600;
}

.row.total {
  font-size: 1.4rem;
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  font-weight: 700;
}

.total-amount {
  color: #dc2626;
  font-size: 2rem;
  text-shadow: 0 2px 20px rgba(220, 38, 38, 0.5);
}

/* ========================================
   CONFIRMATION CARD
======================================== */
.confirmation-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.detail-row .value {
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 2rem 0;
}

/* Services List in Confirmation */
.services-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s;
}

.service-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
}

.service-name {
  font-size: 1rem;
  color: #fff;
  font-weight: 500;
}

.service-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc2626;
}

/* DateTime Display */
.datetime-display {
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
}

.datetime-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #10b981;
  text-align: center;
}

/* Price Summary in Confirmation */
.price-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  font-size: 1rem;
}

.price-row.discount {
  color: #10b981;
}

.price-row.total {
  padding-top: 1.5rem;
  margin-top: 1rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
  font-size: 1.2rem;
}

.total-price {
  font-size: 2rem;
  color: #dc2626;
  text-shadow: 0 2px 20px rgba(220, 38, 38, 0.5);
}

/* ========================================
   PAYMENT SECTION
======================================== */
.payment-section {
  margin-bottom: 2rem;
}

.payment-section h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #fff;
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.payment-option {
  padding: 0;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.payment-option input {
  display: none;
}

.payment-content {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.payment-icon {
  font-size: 3rem;
  transition: transform 0.3s;
}

.payment-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.payment-content small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.payment-option:hover {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(255, 255, 255, 0.05);
}

.payment-option:hover .payment-icon {
  transform: scale(1.2);
}

.payment-option.selected {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
}

.payment-option.selected .payment-icon {
  transform: scale(1.15);
}

/* ========================================
   TERMS & CONDITIONS
======================================== */
.terms-section {
  margin-bottom: 2rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.checkbox:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
}

.checkbox input[type="checkbox"] {
  width: 24px;
  height: 24px;
  accent-color: #dc2626;
  cursor: pointer;
}

.checkbox span {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.checkbox a {
  color: #dc2626;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.3s;
}

.checkbox a:hover {
  color: #fff;
}

/* ========================================
   ACTION BUTTONS
======================================== */
.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 1.2rem 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Kanit', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn.primary {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-color: #dc2626;
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
}

.btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  box-shadow: 0 6px 30px rgba(220, 38, 38, 0.5);
  transform: translateY(-3px);
}

.btn.confirm-btn {
  font-size: 1.1rem;
  padding: 1.3rem 3rem;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn .loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========================================
   RESPONSIVE DESIGN
======================================== */
@media (max-width: 1024px) {
  .datetime-grid {
    grid-template-columns: 1fr;
  }

  .payment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .progress {
    padding: 1.5rem 1rem;
    gap: 0.5rem;
  }

  .step span {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .step label {
    font-size: 0.8rem;
  }

  .line {
    width: 40px;
  }

  .grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .confirmation-card {
    padding: 1.5rem;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .service-tags {
    gap: 0.5rem;
  }

  .service-tag {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 2rem 1rem;
  }

  .content h2 {
    font-size: 1.5rem;
  }

  .card {
    padding: 1.5rem 1rem;
  }

  .vehicle-card .icon {
    font-size: 3rem;
  }

  .service-card .icon {
    font-size: 2.5rem;
  }

  .datetime-section,
  .summary,
  .vehicle-details {
    padding: 1.5rem;
  }

  .total-amount {
    font-size: 1.5rem;
  }

  .payment-content {
    padding: 1.5rem 1rem;
  }

  .payment-icon {
    font-size: 2.5rem;
  }
}
</style>
