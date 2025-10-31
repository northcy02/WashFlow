<template>
  <div class="booking-page">
    <Navigator />

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1>จองบริการล้างรถ</h1>
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

        <!-- Step 1: เลือกรถ -->
        <div v-if="currentStep === 1" class="content">
          <h2>เลือกประเภทรถของคุณ</h2>
          
          <div class="grid">
            <div 
              v-for="vehicle in carTypes" 
              :key="vehicle.id"
              class="card vehicle-card"
              :class="{ selected: selectedVehicle === vehicle.id }"
              @click="selectVehicle(vehicle.id)"
            >
              <div class="car-image">
                <img :src="vehicle.image" :alt="vehicle.name" />
              </div>
              <div class="size-badge">{{ vehicle.size }}</div>
              <h3>{{ vehicle.name }}</h3>
              <p>{{ vehicle.desc }}</p>
              
              <div class="price-badge">
                <span class="base-price">฿{{ vehicle.price.toLocaleString() }}</span>
                <span class="price-label">ราคาพื้นฐาน</span>
              </div>
              
              <div v-if="selectedVehicle === vehicle.id" class="checkmark">✓</div>
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
          <h2>เลือกบริการล้างรถ</h2>
          
          <div class="vehicle-price-info">
            <div class="info-content">
              <span class="vehicle-icon">{{ getVehicleIcon(selectedVehicle) }}</span>
              <div class="info-text">
                <strong>{{ getVehicleName(selectedVehicle) }}</strong>
                <small>ราคาพื้นฐาน: ฿{{ getVehicleBasePrice(selectedVehicle).toLocaleString() }}</small>
              </div>
            </div>
          </div>

          <div class="grid services-grid">
            <div 
              v-for="service in services" 
              :key="service.id"
              class="card service-card"
              :class="{ selected: selectedServices.includes(service.id) }"
              @click="toggleService(service.id)"
            >
              <div class="card-badges">
                <div class="badge hot" v-if="service.hot">🔥 HOT</div>
                <div class="badge popular" v-if="service.popular">⭐ นิยม</div>
              </div>
              <div class="service-image">
                <img :src="service.image" :alt="service.name" />
              </div>
              <h3>{{ service.name }}</h3>
              <p class="price">฿{{ service.price.toLocaleString() }}</p>
              <div class="service-meta">
                <small>{{ service.time }}</small>
              </div>
              <div v-if="selectedServices.includes(service.id)" class="checkmark">✓</div>
            </div>
          </div>

          <div v-if="selectedServices.length > 0" class="selected-services">
            <h4>บริการที่เลือก ({{ selectedServices.length }})</h4>
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

          <div class="datetime-section">
            <h3>เลือกวันที่และเวลา</h3>
            
            <div class="datetime-picker">
              
              <div class="calendar-container">
                <div class="calendar-header">
                  <button @click="changeMonth(-1)" class="nav-btn">‹</button>
                  <span>{{ calendarHeader }}</span>
                  <button @click="changeMonth(1)" class="nav-btn">›</button>
                </div>
                <div class="calendar-grid days-header">
                  <div v-for="day in ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']" :key="day">{{ day }}</div>
                </div>
                <div class="calendar-grid">
                  <div 
                    v-for="(day, index) in daysInMonth" 
                    :key="index"
                    class="day-cell"
                    :class="{ 'past-day': isPastDate(day), 'today': isToday(day), 'selected': isSelectedDate(day), 'not-current-month': !day }"
                    @click="selectDateFromCalendar(day)"
                  >
                    <span v-if="day">{{ day.getDate() }}</span>
                  </div>
                </div>
              </div>
            
              <div v-if="selectedDate" class="time-slots-container">
                <h4>เลือกเวลาสำหรับวันที่ {{ formatDateForDisplay(selectedDate) }}</h4>
                
                <div v-if="totalServiceDuration > 0" class="total-duration-info">
                  เวลารวมประมาณ: <strong>{{ totalServiceDuration }} นาที</strong> (ใช้ {{ slotsNeeded }} ช่องเวลา)
                </div>

                <div class="time-slots-grid">
                  <button
                    v-for="time in availableTimes"
                    :key="time"
                    class="time-slot"
                    :class="{ selected: selectedTime === time, disabled: isTimeDisabled(time), 'blocked-by-selection': isBlockedByCurrentSelection(time) }"
                    :disabled="isTimeDisabled(time) || isBlockedByCurrentSelection(time)"
                    @click="selectedTime = time"
                  >
                    <span class="time-text">{{ time }}</span>
                  </button>
                </div>
                <small class="service-hours-note">เปิดบริการ 09:00 - 18:00 น.</small>
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

          <div v-if="selectedServices.length > 0" class="summary enhanced">
            <h4>สรุปค่าใช้จ่าย</h4>
            
            <div class="summary-items">
              <div class="summary-item base-price-item">
                <span>{{ getVehicleName(selectedVehicle) }} (ราคาพื้นฐาน)</span>
                <span>฿{{ getVehicleBasePrice(selectedVehicle).toLocaleString() }}</span>
              </div>
            </div>

            <div class="divider-small"></div>

            <div class="summary-items">
              <div v-for="id in selectedServices" :key="id" class="summary-item">
                <span>{{ getServiceName(id) }}</span>
                <span>฿{{ getServicePrice(id).toLocaleString() }}</span>
              </div>
            </div>

            <div class="row subtotal">
              <span>รวมค่าบริการ ({{ 1 + selectedServices.length }} รายการ)</span>
              <span>฿{{ subtotal.toLocaleString() }}</span>
            </div>
            
            <div v-if="discount > 0" class="row discount">
              <span>ส่วนลด {{ discountPercent }}% {{ getDiscountReason() }}</span>
              <span>-฿{{ discount.toLocaleString() }}</span>
            </div>
            
            <div class="row total">
              <strong>ยอดชำระทั้งหมด</strong>
              <strong class="total-amount">฿{{ total.toLocaleString() }}</strong>
            </div>
          </div>

          <div class="actions">
            <button class="btn" @click="goToStep1">← ย้อนกลับ</button>
            <button class="btn primary" :disabled="!canGoToStep3" @click="goToStep3">
              ถัดไป: ยืนยันการจอง →
            </button>
          </div>
        </div>

        <!-- Step 3: Confirm -->
        <div v-if="currentStep === 3" class="content">
          <h2>✅ ยืนยันข้อมูล</h2>
          
          <div class="confirmation-card">
            <div class="detail-section">
              <h4>ข้อมูลรถ</h4>
              <div class="detail-row">
                <label>ประเภทรถ</label>
                <span class="value">{{ getVehicleName(selectedVehicle) }}</span>
              </div>
              <div class="detail-row">
                <label>ราคาพื้นฐาน</label>
                <span class="value price-highlight">฿{{ getVehicleBasePrice(selectedVehicle).toLocaleString() }}</span>
              </div>
              <!-- ✅ [NEW] Input for vehicle details -->
              <div class="detail-row-input">
                <label for="vehiclePlate">ทะเบียนรถ (ไม่บังคับ)</label>
                <input type="text" id="vehiclePlate" v-model="vehiclePlate" placeholder="เช่น 1กข 1234">
              </div>
              <div class="detail-row-input">
                <label for="vehicleColor">สีรถ (ไม่บังคับ)</label>
                <input type="text" id="vehicleColor" v-model="vehicleColor" placeholder="เช่น ดำ, ขาว, แดง">
              </div>
            </div>

            <div class="divider"></div>

            <div class="detail-section">
              <h4>บริการที่เลือก</h4>
              <div class="services-list">
                <div v-for="id in selectedServices" :key="id" class="service-item">
                  <span class="service-name">
                     <img :src="getServiceIcon(id)" class="service-item-icon"/> {{ getServiceName(id) }}
                  </span>
                  <span class="service-price">฿{{ getServicePrice(id).toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="detail-section">
              <h4>วันที่และเวลา</h4>
              <div class="datetime-display">
                <div class="datetime-value">{{ formatSelectedDateTime }}</div>
              </div>
            </div>

            <div class="divider"></div>

            <div class="detail-section">
              <h4>สรุปค่าใช้จ่าย</h4>
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

          <div class="payment-section">
            <h3>เลือกวิธีชำระเงิน</h3>
            <div class="payment-grid">
              <label class="payment-option" :class="{ selected: paymentMethod === 'cash' }">
                <input type="radio" v-model="paymentMethod" value="cash">
                <div class="payment-content">
                  <span class="payment-icon">💵</span>
                  <span class="payment-label">เงินสด</span>
                  <small>ชำระที่หน้าร้าน</small>
                </div>
              </label>
              <label class="payment-option" :class="{ selected: paymentMethod === 'card' }">
                <input type="radio" v-model="paymentMethod" value="card">
                <div class="payment-content">
                  <span class="payment-icon">💳</span>
                  <span class="payment-label">บัตรเครดิต/เดบิต</span>
                  <small>Visa, Mastercard</small>
                </div>
              </label>
              <label class="payment-option" :class="{ selected: paymentMethod === 'qr' }">
                <input type="radio" v-model="paymentMethod" value="qr">
                <div class="payment-content">
                  <span class="payment-icon">📱</span>
                  <span class="payment-label">QR Code</span>
                  <small>PromptPay, TrueMoney</small>
                </div>
              </label>
            </div>
          </div>

          <div class="terms-section">
            <label class="checkbox">
              <input type="checkbox" v-model="acceptTerms">
              <span>ฉันได้อ่านและยอมรับ <a href="#" @click.prevent="showTerms">เงื่อนไขการใช้บริการ</a></span>
            </label>
          </div>

          <div class="actions">
            <button class="btn" @click="goToStep2">← แก้ไขข้อมูล</button>
            <button class="btn primary confirm-btn" :disabled="!canConfirm || isLoading" @click="confirmBooking">
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';
import axios from 'axios';

const router = useRouter();

// State
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
const displayMonth = ref(new Date());

// ✅ ข้อมูลการจองที่มีอยู่แล้ว (ดึงจาก API)
const bookedSlots = ref<Array<{ booking_date: string; booking_time: string; duration: number }>>([]);

const carTypes = [
  { id: 'sedan', name: 'รถเก๋ง', desc: 'Sedan', size: 'M', price: 300, image: '/icons/sedan.svg' },
  { id: 'pickup', name: 'รถกระบะ', desc: 'Pickup', size: 'L', price: 400, image: '/icons/pickup.svg' },
  { id: 'sports', name: 'รถสปอร์ต', desc: 'Sports', size: 'M', price: 500, image: '/icons/sports.svg' },
  { id: 'van', name: 'รถตู้', desc: 'Van', size: 'XL', price: 600, image: '/icons/van.svg' },
  { id: 'motorcycle', name: 'มอเตอร์ไซค์', desc: 'Bike', size: 'S', price: 150, image: '/icons/motorcycle.svg' }
];

const services = [
  { id: 'wash', name: 'ล้างรถ', desc: 'Basic Wash', price: 200, time: '30 นาที', duration: 30, hot: true, popular: true, image: '/icons/wash.svg' },
  { id: 'coating', name: 'เคลือบสีรถ', desc: 'Glass Coating', price: 150, time: '15 นาที', duration: 15, hot: false, popular: false, image: '/icons/coating.svg' },
  { id: 'polish', name: 'ขัดสี', desc: 'Polish', price: 1000, time: '60 นาที', duration: 60, hot: true, popular: false, image: '/icons/polish.svg' },
  { id: 'vacuum', name: 'ดูดฝุ่น', desc: 'Vacuum', price: 80, time: '20 นาที', duration: 20, hot: false, popular: true, image: '/icons/vacuum.svg' },
  { id: 'interior', name: 'ซักเบาะ', desc: 'Interior Cleaning', price: 2000, time: '90 นาที', duration: 90, hot: false, popular: false, image: '/icons/interior.svg' }
];

const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
  '17:00', '17:30', '18:00'
];

// ✅ Computed Properties
const formatSelectedDateTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return '-';
  
  // ✅ แก้ไข: แยก year-month-day แล้วสร้าง Date ใหม่เพื่อป้องกัน timezone issue
  const [year, month, day] = selectedDate.value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const thaiDate = date.toLocaleDateString('th-TH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  });
  
  return `${thaiDate} เวลา ${selectedTime.value} น.`;
});
const subtotal = computed(() => {
  const vehicleBasePrice = getVehicleBasePrice(selectedVehicle.value);
  const servicesTotal = selectedServices.value.reduce((sum, id) => sum + (getServicePrice(id) || 0), 0);
  return vehicleBasePrice + servicesTotal;
});

const discountPercent = computed(() => selectedServices.value.length >= 3 ? 20 : selectedServices.value.length >= 2 ? 10 : 0);
const discount = computed(() => Math.floor(subtotal.value * (discountPercent.value / 100)));
const total = computed(() => subtotal.value - discount.value);

const canGoToStep3 = computed(() => selectedServices.value.length > 0 && selectedDate.value && selectedTime.value);
const canConfirm = computed(() => acceptTerms.value && paymentMethod.value && !isLoading.value);

const daysInMonth = computed(() => {
  const date = displayMonth.value;
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
    days.push(null);
  }
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  return days;
});

const calendarHeader = computed(() => {
  return displayMonth.value.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
});

// ✅ คำนวณระยะเวลารวมของบริการที่เลือก (นาที)
const totalServiceDuration = computed(() => {
  if (selectedServices.value.length === 0) return 0;
  return selectedServices.value.reduce((total, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return total + (service?.duration || 0);
  }, 0);
});

// ✅ จำนวนช่องเวลาที่ต้องใช้ (30 นาที = 1 slot)
const slotsNeeded = computed(() => {
  if (totalServiceDuration.value === 0) return 1;
  return Math.ceil(totalServiceDuration.value / 30);
});

// ✅ ฟังก์ชันแปลงเวลาเป็นนาที (09:00 → 540)
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// ✅ ฟังก์ชันเพิ่มนาทีกับเวลา (09:00 + 45 → 09:45)
const addMinutesToTime = (time: string, minutes: number): string => {
  const totalMinutes = timeToMinutes(time) + minutes;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// ✅ ตรวจสอบว่าเวลานี้ถูกจองไปแล้วหรือทับกับเวลาจองอื่นหรือไม่
const isTimeDisabled = (time: string): boolean => {
  if (!selectedDate.value) return false;

  const checkingTimeInMinutes = timeToMinutes(time);
  const selectedDateStr = selectedDate.value;

  console.log(`\n🔍 ตรวจสอบเวลา ${time} สำหรับวันที่ ${selectedDateStr}`);

  // 1️⃣ ตรวจสอบว่าเวลานี้อยู่ในช่วงที่มีการจองแล้วหรือไม่
  for (const booking of bookedSlots.value) {
    if (booking.booking_date !== selectedDateStr) continue;

    const bookingStart = timeToMinutes(booking.booking_time);
    const bookingEnd = bookingStart + booking.duration;

    console.log(`   📌 มีการจอง: ${booking.booking_time} (${booking.duration} นาที) = ${bookingStart}-${bookingEnd} นาที`);

    // ✅ ถ้าเวลาที่เช็คอยู่ในช่วงที่ถูกจองไปแล้ว
    if (checkingTimeInMinutes >= bookingStart && checkingTimeInMinutes < bookingEnd) {
      console.log(`   ⛔ ${time} อยู่ในช่วงที่ถูกจอง!`);
      return true;
    }
  }

  // 2️⃣ ตรวจสอบว่าถ้าเลือกเวลานี้ จะทับกับการจองอื่นหรือไม่
  const requiredDuration = totalServiceDuration.value || 30;
  const selectionEnd = checkingTimeInMinutes + requiredDuration;

  console.log(`   ⏱️ ต้องการใช้เวลา ${requiredDuration} นาที (${checkingTimeInMinutes}-${selectionEnd})`);

  for (const booking of bookedSlots.value) {
    if (booking.booking_date !== selectedDateStr) continue;

    const bookingStart = timeToMinutes(booking.booking_time);
    const bookingEnd = bookingStart + booking.duration;

    // ✅ ตรวจสอบการทับซ้อน (Overlap Detection)
    const hasOverlap = (
      (checkingTimeInMinutes < bookingEnd && selectionEnd > bookingStart)
    );

    if (hasOverlap) {
      console.log(`   ⛔ ${time} จะทับกับการจอง ${booking.booking_time}!`);
      return true;
    }
  }

  // 3️⃣ ตรวจสอบเวลาปิดร้าน
  const closingTime = timeToMinutes('18:00');
  if (selectionEnd > closingTime) {
    console.log(`   ⛔ ${time} เกินเวลาปิดร้าน (18:00)!`);
    return true;
  }

  // 4️⃣ ตรวจสอบเวลาที่ผ่านไปแล้ว (สำหรับวันนี้)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [y, m, d] = selectedDate.value.split('-').map(Number);
  const selected = new Date(y, m - 1, d);
  selected.setHours(0, 0, 0, 0);

  if (selected.getTime() === today.getTime()) {
    const now = new Date();
    const [h, min] = time.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(h, min, 0, 0);
    
    if (slotTime <= now) {
      console.log(`   ⛔ ${time} เวลาผ่านไปแล้ว!`);
      return true;
    }
  }

  console.log(`   ✅ ${time} ว่าง - จองได้!`);
  return false;
};

// ✅ ตรวจสอบว่าเวลานี้ถูกบล็อกโดยการเลือกของเราหรือไม่ (แสดง "จองต่อ...")
const isBlockedByCurrentSelection = (time: string): boolean => {
  if (!selectedTime.value || totalServiceDuration.value <= 30) {
    return false;
  }

  const selectedIndex = availableTimes.indexOf(selectedTime.value);
  const checkingIndex = availableTimes.indexOf(time);
  
  // ช่องเวลาที่อยู่ในช่วงที่เราจอง (แต่ไม่ใช่ช่องแรก)
  return checkingIndex > selectedIndex && checkingIndex < selectedIndex + slotsNeeded.value;
};

// ✅ เมื่อเลือกบริการใหม่ ให้รีเซ็ตเวลา
const toggleService = (id: string) => {
  const index = selectedServices.value.indexOf(id);
  if (index > -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(id);
  }
  // รีเซ็ตเวลาเมื่อเปลี่ยนบริการ
  selectedTime.value = '';
};

// ✅ Helper Functions
const selectVehicle = (id: string) => {
  selectedVehicle.value = id;
};

const getVehicleName = (id: string) => carTypes.find(v => v.id === id)?.name || '';
const getVehicleIcon = (id: string) => {
  const icons: Record<string, string> = { 'sedan': '🚗', 'pickup': '🚙', 'sports': '🏎️', 'van': '🚐', 'motorcycle': '🏍️' };
  return icons[id] || '🚗';
};
const getVehicleBasePrice = (id: string) => carTypes.find(v => v.id === id)?.price || 0;
const getServiceName = (id: string) => services.find(s => s.id === id)?.name || '';
const getServicePrice = (id: string) => services.find(s => s.id === id)?.price || 0;
const getServiceIcon = (id: string) => services.find(s => s.id === id)?.image || '';
const getDiscountReason = () => {
  if (selectedServices.value.length >= 3) return '(จอง 3 บริการขึ้นไป)';
  if (selectedServices.value.length >= 2) return '(จอง 2 บริการ)';
  return '';
};

const selectDateFromCalendar = (day: Date | null) => {
  if (!day || isPastDate(day)) return;

  // ✅ แก้ไข: ใช้ toISOString().split('T')[0] เพื่อให้ได้ YYYY-MM-DD ที่ถูกต้อง
  const localDate = new Date(day.getTime() - (day.getTimezoneOffset() * 60000));
  selectedDate.value = localDate.toISOString().split('T')[0];
  selectedTime.value = '';
  
  console.log('📅 เลือกวันที่:', selectedDate.value);
  console.log('📅 Day object:', day);
  console.log('📅 ข้อมูลการจองวันนี้:', bookedSlots.value.filter(b => b.booking_date === selectedDate.value));
};

const changeMonth = (offset: number) => {
  const newMonth = new Date(displayMonth.value);
  newMonth.setMonth(newMonth.getMonth() + offset);
  displayMonth.value = newMonth;
};

const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return '-';
  
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('th-TH', { 
    day: 'numeric', 
    month: 'long' 
  });
};

const isSelectedDate = (day: Date | null) => {
  if (!day) return false;
  
  // ✅ แก้ไข: ใช้วิธีเดียวกับ selectDateFromCalendar
  const localDate = new Date(day.getTime() - (day.getTimezoneOffset() * 60000));
  const dayStr = localDate.toISOString().split('T')[0];
  
  return dayStr === selectedDate.value;
};

const isToday = (day: Date | null) => day?.toDateString() === new Date().toDateString();

const isPastDate = (day: Date | null) => {
  if (!day) return false;
  
  // ✅ แก้ไข: เปรียบเทียบเฉพาะวันที่ ไม่สนเวลา
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDay = new Date(day);
  checkDay.setHours(0, 0, 0, 0);
  
  return checkDay < today;
};

const goToStep1 = () => { currentStep.value = 1; };
const goToStep2 = () => {
  if (!selectedVehicle.value) {
    Swal.fire({ title: 'กรุณาเลือกประเภทรถ', icon: 'warning', confirmButtonColor: '#dc2626' });
    return;
  }
  currentStep.value = 2;
};
const goToStep3 = () => {
  if (selectedServices.value.length === 0) {
    Swal.fire({ title: 'กรุณาเลือกบริการ', text: 'เลือกอย่างน้อย 1 บริการ', icon: 'warning', confirmButtonColor: '#dc2626' });
    return;
  }
  if (!selectedDate.value || !selectedTime.value) {
    Swal.fire({ title: 'กรุณาเลือกวันที่และเวลา', icon: 'warning', confirmButtonColor: '#dc2626' });
    return;
  }
  currentStep.value = 3;
};

const showTerms = () => {
  Swal.fire({
    title: 'เงื่อนไขการใช้บริการ',
    html: `<div style="text-align: left; max-height: 400px; overflow-y: auto;"><p>• กรุณามาตรงเวลาที่จอง หากมาสายเกิน 15 นาที ทางร้านขอสงวนสิทธิ์ในการยกเลิกคิว</p><p>• หากต้องการยกเลิกหรือเลื่อนนัด กรุณาแจ้งล่วงหน้าอย่างน้อย 2 ชั่วโมง</p></div>`,
    confirmButtonText: 'รับทราบ',
    confirmButtonColor: '#dc2626',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });
};

// ✅ ดึงข้อมูลการจองที่มีอยู่จาก API
const fetchBookedSlots = async () => {
  try {
    console.log('🔄 กำลังโหลดข้อมูลการจอง...');
    const response = await axios.get('http://localhost:3000/api/booking/all-bookings');
    
    if (response.data.success) {
      bookedSlots.value = response.data.bookings.map((booking: any) => ({
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        duration: booking.duration
      }));
      
      console.log('✅ โหลดข้อมูลสำเร็จ:', bookedSlots.value.length, 'รายการ');
      console.log('📊 รายการจอง:', JSON.stringify(bookedSlots.value, null, 2));
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
  }
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

    // ✅ ตรวจสอบอีกครั้งก่อนส่ง (Double-check)
    console.log('🔍 ตรวจสอบการจองซ้ำก่อนส่ง API...');
    const checkTime = timeToMinutes(selectedTime.value);
    const checkEnd = checkTime + totalServiceDuration.value;
    
    for (const booking of bookedSlots.value) {
      if (booking.booking_date !== selectedDate.value) continue;
      
      const bStart = timeToMinutes(booking.booking_time);
      const bEnd = bStart + booking.duration;
      
      if (
        (checkTime < bEnd && checkEnd > bStart) ||
        (checkTime >= bStart && checkTime < bEnd)
      ) {
        console.log('⛔ พบการจองซ้ำ!');
        await fetchBookedSlots(); // โหลดข้อมูลใหม่
        Swal.fire({
          title: '⚠️ ช่วงเวลานี้ไม่ว่าง',
          text: 'มีผู้อื่นจองไปก่อนแล้ว กรุณาเลือกเวลาใหม่',
          icon: 'warning',
          confirmButtonColor: '#dc2626'
        });
        isLoading.value = false;
        return;
      }
    }

    // ✅ ส่งข้อมูลไปยัง API
    const response = await axios.post('http://localhost:3000/api/booking/create', {
      customer_id: user.id,
      branch_id: 1,
      booking_date: selectedDate.value,
      booking_time: selectedTime.value,
      duration: totalServiceDuration.value,
      vehicle_type: getVehicleName(selectedVehicle.value),
      vehicle_plate: vehiclePlate.value || null,
      vehicle_color: vehicleColor.value || null,
      services: selectedServices.value.map(id => getServiceName(id)),
      payment_method: paymentMethod.value,
      total_amount: total.value,
      base_price: getVehicleBasePrice(selectedVehicle.value)
    });

    if (response.data.success) {
      // ✅ อัพเดต bookedSlots
      bookedSlots.value.push({
        booking_date: selectedDate.value,
        booking_time: selectedTime.value,
        duration: totalServiceDuration.value
      });

      Swal.fire({
        title: '🎉 จองสำเร็จ!',
        html: `
          <div style="padding: 1rem;">
            <p style="font-size: 1.1rem; margin-bottom: 1rem;">
              รหัสการจอง: <strong>#${response.data.booking.id}</strong>
            </p>
            <p style="margin-bottom: 0.5rem;">📅 ${formatSelectedDateTime.value}</p>
            <p style="color: #10b981;">⏱️ ใช้เวลาประมาณ ${totalServiceDuration.value} นาที</p>
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
    console.error('❌ Error:', error);
    
    // ✅ แสดงข้อความตามประเภทของ error
    let errorMessage = 'ไม่สามารถจองบริการได้';
    
    if (error.response?.status === 409) {
      errorMessage = error.response.data.message || 'ช่วงเวลานี้มีการจองแล้ว กรุณาเลือกเวลาใหม่';
      await fetchBookedSlots(); // โหลดข้อมูลใหม่
    }
    
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
  } finally {
    isLoading.value = false;
  }
};

// ✅ เรียกใช้เมื่อโหลดหน้า
onMounted(() => {
  fetchBookedSlots();
});

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
.car-image,
.service-image {
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 1rem;
}

.car-image img,
.service-image img {
  height: 70px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(220, 38, 38, 0.3));
  transition: transform 0.3s;
}

.card:hover .car-image img,
.card:hover .service-image img {
  transform: scale(1.1);
}

.size-badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(220, 38, 38, 0.15);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
}

.card.selected .size-badge {
  background: rgba(220, 38, 38, 0.3);
  border-color: #dc2626;
}
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

.main {
  padding: 3rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

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
}

.line.active {
  background: linear-gradient(90deg, #dc2626 0%, #991b1b 100%);
}

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
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.services-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.card {
  position: relative;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
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
}

.service-card p.price {
  font-size: 1.8rem;
  font-weight: 900;
  color: #dc2626;
  margin: 1rem 0;
  text-shadow: 0 2px 10px rgba(220, 38, 38, 0.3);
}

.service-meta small {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  display: block;
}

.card-badges {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.badge.hot {
  background: linear-gradient(135deg, #f87171, #dc2626);
  color: #fff;
}

.badge.popular {
  background: linear-gradient(135deg, #fcd34d, #fbbf24);
  color: #a16207;
}

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

.vehicle-price-info {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135, rgba(220, 38, 38, 0.1), rgba(139, 0, 0, 0.1));
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

.datetime-section {
  margin:2rem 0;
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

.selected-datetime {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; margin-top: 0; }
  to { opacity: 1; max-height: 500px; padding-top: 1.5rem; padding-bottom: 1.5rem; margin-top: 2rem; }
}

.selected-datetime .icon { font-size: 2rem; color: #10b981; flex-shrink: 0; }
.selected-datetime strong { display: block; font-size: 1.1rem; color: #10b981; margin-bottom: 0.3rem; }
.selected-datetime p { font-size: 0.85rem; color: rgba(16, 185, 129, 0.8); margin: 0; }

.summary { padding: 2rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(220, 38, 38, 0.2); border-radius: 16px; margin-bottom: 2rem; }
.summary.enhanced { background: linear-gradient(135deg, rgba(220, 38, 38, 0.05), rgba(139, 0, 0, 0.05)); border: 2px solid rgba(220, 38, 38, 0.3); }

.summary h4 { font-size: 1.3rem; margin-bottom: 1.5rem; color: #fff; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }
.summary-items { margin-bottom: 1rem; }
.summary-item { display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 0.95rem; color: rgba(255, 255, 255, 0.8); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

.base-price-item { font-weight: 600; color: rgba(220, 38, 38, 0.9); background: rgba(220, 38, 38, 0.05); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; }

.divider-small { height: 1px; background: rgba(255, 255, 255, 0.1); margin: 1rem 0; }

.row { display: flex; justify-content: space-between; padding: 1rem 0; font-size: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.row:last-child { border-bottom: none; }
.row.subtotal { font-weight: 600; color: rgba(255, 255, 255, 0.9); }
.row.discount { color: #10b981; font-weight: 600; }
.row.total { font-size: 1.4rem; padding-top: 1.5rem; margin-top: 1rem; border-top: 2px solid rgba(220, 38, 38, 0.3); font-weight: 700; }
.total-amount { color: #dc2626; font-size: 2rem; text-shadow: 0 2px 20px rgba(220, 38, 38, 0.5); }

.confirmation-card { background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 2.5rem; margin-bottom: 2rem; }
.detail-section { margin-bottom: 2rem; }
.detail-section:last-child { margin-bottom: 0; }
.detail-section h4 { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; color: #dc2626; display: flex; align-items: center; gap: 0.5rem; }

.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.detail-row:last-child { border-bottom: none; }
.detail-row label { color: rgba(255, 255, 255, 0.6); font-size: 0.95rem; }
.detail-row .value { color: #fff; font-weight: 600; font-size: 1rem; }
.price-highlight { color: #dc2626 !important; font-size: 1.1rem !important; }

.detail-row-input { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.detail-row-input label { color: rgba(255, 255, 255, 0.6); font-size: 0.95rem; }
.detail-row-input input { width: 100%; padding: 0.75rem 1rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; font-size: 1rem; transition: border-color 0.3s; }
.detail-row-input input:focus { outline: none; border-color: #dc2626; }

.divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent); margin: 1rem 0; }

.services-list { display: flex; flex-direction: column; gap: 1rem; }
.service-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; }
.service-item-icon { width: 24px; height: 24px; margin-right: 0.75rem; vertical-align: middle; filter: invert(1); }
.service-name { font-size: 1rem; color: #fff; font-weight: 500; display: flex; align-items: center; }
.service-price { font-size: 1.1rem; font-weight: 700; color: #dc2626; }

.datetime-display { padding: 1.5rem; background: rgba(16, 185, 129, 0.1); border: 2px solid rgba(16, 185, 129, 0.3); border-radius: 12px; }
.datetime-value { font-size: 1.1rem; font-weight: 600; color: #10b981; text-align: center; }

.price-summary { display: flex; flex-direction: column; gap: 0.75rem; }
.price-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; font-size: 0.95rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.price-row:last-child { border-bottom: none; }
.price-row.base { font-weight: 600; color: rgba(220, 38, 38, 0.9); }
.price-row.subtotal-row { font-weight: 600; color: rgba(255, 255, 255, 0.9); margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1); }
.price-row.discount { color: #10b981; font-weight: 600; }
.price-row.total { padding-top: 1.5rem; margin-top: 1rem; border-top: 2px solid rgba(220, 38, 38, 0.3); font-size: 1.2rem; }
.total-price { font-size: 2rem; color: #dc2626; text-shadow: 0 2px 20px rgba(220, 38, 38, 0.5); }

.payment-section { margin-bottom: 2rem; }
.payment-section h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; color: #fff; }
.payment-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.payment-option { padding: 0; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 16px; cursor: pointer; transition: all 0.3s; overflow: hidden; }
.payment-option input { display: none; }
.payment-content { padding: 2rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center; }
.payment-icon { font-size: 3rem; transition: transform 0.3s; }
.payment-label { font-size: 1.1rem; font-weight: 700; color: #fff; }
.payment-content small { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); }
.payment-option:hover .payment-icon, .payment-option.selected .payment-icon { transform: scale(1.15); }
.payment-option:hover { border-color: rgba(220, 38, 38, 0.5); background: rgba(255, 255, 255, 0.05); }
.payment-option.selected { background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2)); border-color: #dc2626; box-shadow: 0 0 30px rgba(220, 38, 38, 0.3); }

.terms-section { margin-bottom: 2rem; }
.checkbox { display: flex; align-items: center; gap: 1rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.03); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; cursor: pointer; transition: all 0.3s; }
.checkbox:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(220, 38, 38, 0.3); }
.checkbox input[type="checkbox"] { width: 24px; height: 24px; accent-color: #dc2626; cursor: pointer; flex-shrink: 0; }
.checkbox span { font-size: 0.95rem; color: rgba(255, 255, 255, 0.9); }
.checkbox a { color: #dc2626; text-decoration: underline; font-weight: 600; }

.actions { display: flex; gap: 1rem; justify-content: space-between; }
.btn { padding: 1.2rem 2.5rem; background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.3s; font-family: 'Kanit', sans-serif; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); transform: translateY(-2px); }
.btn.primary { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); border-color: #dc2626; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3); }
.btn.primary:hover:not(:disabled) { background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%); box-shadow: 0 6px 30px rgba(220, 38, 38, 0.5); transform: translateY(-3px); }
.btn.confirm-btn { font-size: 1.1rem; padding: 1.3rem 3rem; flex-grow: 1; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
.btn .loading { display: flex; align-items: center; gap: 0.75rem; }

.spinner { width: 18px; height: 18px; border: 3px solid rgba(255, 255, 255, 0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .datetime-picker { grid-template-columns: 1fr; }
  .payment-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .hero p { font-size: 1rem; }
  .progress { padding: 1.5rem 1rem; gap: 0.5rem; }
  .step span { width: 40px; height: 40px; font-size: 1rem; }
  .step label { font-size: 0.8rem; }
  .line { width: 40px; }
  .grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
  .actions { flex-direction: column-reverse; }
  .btn { width: 100%; }
  .btn.confirm-btn { flex-grow: 0; }
  .confirmation-card { padding: 1.5rem; }
  .detail-row { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .service-tags { gap: 0.5rem; }
  .service-tag { font-size: 0.85rem; padding: 0.5rem 1rem; }
  .vehicle-icon { font-size: 2.5rem; }
  .info-text strong { font-size: 1rem; }
  .info-text small { font-size: 0.8rem; }
}

@media (max-width: 480px) {
  .main { padding: 2rem 1rem; }
  .content h2 { font-size: 1.5rem; }
  .card { padding: 1.5rem 1rem; }
  .total-amount, .total-price { font-size: 1.8rem; }
  .payment-content { padding: 1.5rem 1rem; }
  .payment-icon { font-size: 2.5rem; }
  .actions { gap: 0.75rem; }
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.datetime-picker { display: grid; grid-template-columns: 1fr; gap: 2rem; margin-top: 1.5rem; }
@media (min-width: 768px) { .datetime-picker { grid-template-columns: 350px 1fr; align-items: flex-start; } }

.calendar-container { padding: 1.5rem; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; }
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; font-weight: 700; font-size: 1.1rem; }
.nav-btn { background: rgba(255, 255, 255, 0.1); border: none; color: #fff; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; transition: background 0.3s; }
.nav-btn:hover { background: rgba(220, 38, 38, 0.5); }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
.days-header { margin-bottom: 0.75rem; font-weight: 600; font-size: 0.85rem; color: rgba(255, 255, 255, 0.5); text-align: center; }
.day-cell { display: flex; justify-content: center; align-items: center; height: 40px; border-radius: 50%; cursor: pointer; transition: all 0.3s ease; font-weight: 500; border: 2px solid transparent; }
.day-cell:not(.past-day):not(.not-current-month):hover { background-color: rgba(255, 255, 255, 0.1); }
.day-cell.today { border-color: rgba(220, 38, 38, 0.5); color: #dc2626; font-weight: 700; }
.day-cell.past-day, .day-cell.not-current-month { color: rgba(255, 255, 255, 0.2); cursor: not-allowed; pointer-events: none; }
.day-cell.selected { background-color: #dc2626; color: #fff !important; font-weight: 700; transform: scale(1.1); box-shadow: 0 0 20px rgba(220, 38, 38, 0.5); }

.time-slots-container { padding: 1.5rem; background: rgba(255, 255, 255, 0.03); border-radius: 16px; animation: fadeIn 0.5s; }
.time-slots-container h4 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.5rem; }
.total-duration-info { padding: 0.75rem 1rem; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 8px; text-align: center; margin-bottom: 1.5rem; font-size: 0.9rem; color: rgba(255, 255, 255, 0.8); }
.total-duration-info strong { color: #dc2626; font-weight: 700; }
.time-slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.75rem; }

.time-slot { padding: 0.8rem; background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 10px; color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; text-align: center; position: relative; }
.time-slot:hover:not(:disabled) { background-color: rgba(255, 255, 255, 0.1); border-color: rgba(220, 38, 38, 0.5); transform: translateY(-2px); }
.time-slot.selected { background: #dc2626; border-color: #dc2626; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3); }
.time-slot.disabled { background: rgba(255, 255, 255, 0.02); border-color: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.3); cursor: not-allowed; text-decoration: line-through; }
.time-slot.blocked-by-selection { background: rgba(220, 38, 38, 0.2); border-color: rgba(220, 38, 38, 0.4); color: rgba(255, 255, 255, 0.5); cursor: not-allowed; }
.time-slot.blocked-by-selection::after { content: 'จองต่อ...'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.7rem; color: rgba(255, 255, 255, 0.6); width: 100%; text-align: center; }
.time-slot.blocked-by-selection .time-text { visibility: hidden; }

.service-hours-note { display: block; text-align: center; margin-top: 1.5rem; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; }
</style>