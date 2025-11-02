<!-- src/pages/Booking.vue -->

<template>
  <div class="booking-page">
    <Navigator />

    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1>จองบริการล้างรรถ</h1>
        <p>เลือกบริการที่ต้องการ ง่าย รวดเร็ว ปลอดภัย</p>
        
        <!-- ✅ Branch Info Display -->
        <div class="hero-branch-info" v-if="currentBranch">
          <div class="branch-badge">
            <span class="icon">🏢</span>
            <div class="branch-text">
              <strong>{{ currentBranch.branch_name }}</strong>
              <small>{{ currentBranch.branch_address }}</small>
            </div>
            <button @click="changeBranch" class="btn-change" type="button">
              เปลี่ยนสาขา
            </button>
          </div>
        </div>
        
        <!-- ✅ No Branch Warning -->
        <div class="no-branch-warning" v-else>
          <span class="icon">⚠️</span>
          <span class="warning-text">กรุณาเลือกสาขาก่อนจอง</span>
          <button @click="router.push('/branch-selection')" class="btn-select-branch-inline" type="button">
            เลือกสาขา
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="main">
      <div class="container">
        
        <!-- ✅ Progress Stepper -->
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

        <!-- ========================================
             STEP 1: เลือกรถ
        ======================================== -->
        <div v-if="currentStep === 1" class="content">
          <h2>เลือกประเภทรถของคุณ</h2>
          
          <div class="grid">
            <div 
              v-for="vehicle in CAR_TYPES" 
              :key="vehicle.id"
              class="card vehicle-card"
              :class="{ selected: selectedVehicle === vehicle.id }"
              @click="selectVehicle(vehicle.id)"
            >
              <div class="car-image">
                <img :src="vehicle.image" :alt="vehicle.name" loading="lazy" />
              </div>
              <div class="size-badge">{{ vehicle.size }}</div>
              <h3>{{ vehicle.name }}</h3>
              <p>{{ vehicle.desc }}</p>
              
              <div class="multiplier-badge">
                <span class="multiplier-value">×{{ vehicle.multiplier }}</span>
                <span class="multiplier-label">
                  {{ getMultiplierLabel(vehicle.multiplier) }}
                </span>
              </div>
              
              <div v-if="selectedVehicle === vehicle.id" class="checkmark">✓</div>
            </div>
          </div>

          <div class="actions">
            <button 
              class="btn primary" 
              :disabled="!selectedVehicle"
              @click="goToStep2"
              type="button"
            >
              ถัดไป: เลือกบริการ →
            </button>
          </div>
        </div>

        <!-- ========================================
             STEP 2: Services + Date/Time
        ======================================== -->
        <div v-if="currentStep === 2" class="content">
          <h2>เลือกบริการล้างรถ</h2>
          
          <!-- ✅ Vehicle Info -->
          <div class="vehicle-price-info">
            <div class="info-content">
              <span class="vehicle-icon">{{ getVehicleIcon(selectedVehicle) }}</span>
              <div class="info-text">
                <strong>{{ getVehicleName(selectedVehicle) }}</strong>
                <small>ตัวคูณ: {{ getVehicleMultiplierText(selectedVehicle) }}</small>
              </div>
            </div>
          </div>

          <!-- ✅ Services Grid -->
          <div class="grid services-grid">
            <div 
              v-for="service in SERVICES" 
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
                <img :src="service.image" :alt="service.name" loading="lazy" />
              </div>
              <h3>{{ service.name }}</h3>
              <p class="price">฿{{ service.price.toLocaleString() }}</p>
              <div class="service-meta">
                <small>⏱️ {{ service.time }}</small>
              </div>
              <div v-if="selectedServices.includes(service.id)" class="checkmark">✓</div>
            </div>
          </div>

          <!-- ✅ Selected Services Summary -->
          <transition name="fade">
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
          </transition>

          <!-- ✅ Date/Time Section -->
          <div class="datetime-section">
            <h3>เลือกวันที่และเวลา</h3>
            
            <div class="datetime-picker">
              <!-- Calendar -->
              <div class="calendar-container">
                <div class="calendar-header">
                  <button @click="changeMonth(-1)" class="nav-btn" type="button" aria-label="Previous month">‹</button>
                  <span>{{ calendarHeader }}</span>
                  <button @click="changeMonth(1)" class="nav-btn" type="button" aria-label="Next month">›</button>
                </div>
                <div class="calendar-grid days-header">
                  <div v-for="day in ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']" :key="day">{{ day }}</div>
                </div>
                <div class="calendar-grid">
                  <div 
                    v-for="(day, index) in daysInMonth" 
                    :key="index"
                    class="day-cell"
                    :class="{ 
                      'past-day': isPastDate(day), 
                      'today': isToday(day), 
                      'selected': isSelectedDate(day), 
                      'not-current-month': !day 
                    }"
                    @click="selectDateFromCalendar(day)"
                  >
                    <span v-if="day">{{ day.getDate() }}</span>
                  </div>
                </div>
              </div>
            
              <!-- Time Slots -->
              <transition name="slide-left">
                <div v-if="selectedDate" class="time-slots-container">
                  <h4>เลือกเวลาสำหรับวันที่ {{ formatDateForDisplay(selectedDate) }}</h4>
                  
                  <div v-if="totalServiceDuration > 0" class="total-duration-info">
                    ⏱️ เวลารวมประมาณ: <strong>{{ totalServiceDuration }} นาที</strong> 
                    (ใช้ {{ slotsNeeded }} ช่องเวลา)
                  </div>

                  <div class="time-slots-grid">
                    <button
                      v-for="time in AVAILABLE_TIMES"
                      :key="time"
                      type="button"
                      class="time-slot"
                      :class="{ 
                        selected: selectedTime === time, 
                        disabled: isTimeDisabled(time), 
                        'blocked-by-selection': isBlockedByCurrentSelection(time) 
                      }"
                      :disabled="isTimeDisabled(time) || isBlockedByCurrentSelection(time)"
                      @click="selectedTime = time"
                    >
                      <span class="time-text">{{ time }}</span>
                    </button>
                  </div>
                  <small class="service-hours-note">⏰ เปิดบริการ 09:00 - 18:00 น.</small>
                </div>
              </transition>
            </div>

            <!-- ✅ Selected DateTime Display -->
            <transition name="fade">
              <div v-if="selectedDate && selectedTime" class="selected-datetime">
                <span class="icon">✓</span>
                <div>
                  <strong>{{ formatSelectedDateTime }}</strong>
                  <p>📍 สาขา: {{ currentBranch?.branch_name }}</p>
                  <p class="note">กรุณามาตรงเวลาเพื่อรับบริการที่ดีที่สุด</p>
                </div>
              </div>
            </transition>
          </div>

          <!-- ✅ Price Summary -->
          <transition name="fade">
            <div v-if="selectedServices.length > 0" class="summary enhanced">
              <h4>💰 สรุปค่าใช้จ่าย</h4>
              
              <div class="multiplier-info">
                <span>{{ getVehicleName(selectedVehicle) }}</span>
                <span class="multiplier-badge-small">{{ getVehicleMultiplierText(selectedVehicle) }}</span>
              </div>
              
              <div class="divider-small"></div>
              
              <div class="summary-items">
                <div v-for="id in selectedServices" :key="id" class="summary-item">
                  <span class="service-detail">
                    {{ getServiceName(id) }}
                    <small>(฿{{ getServicePrice(id) }} × {{ getVehicleMultiplier(selectedVehicle) }})</small>
                  </span>
                  <span class="service-final-price">฿{{ getServiceFinalPrice(id).toLocaleString() }}</span>
                </div>
              </div>

              <div class="row subtotal">
                <span>รวมค่าบริการ ({{ selectedServices.length }} รายการ)</span>
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
              
              <!-- ✅ Points to Earn Preview -->
              <div class="points-earn-preview">
                <span class="icon">🎁</span>
                <span class="text">คุณจะได้รับประมาณ <strong>+{{ estimatedPoints }} คะแนน</strong></span>
              </div>
            </div>
          </transition>

          <div class="actions">
            <button class="btn" @click="goToStep1" type="button">← ย้อนกลับ</button>
            <button 
              class="btn primary" 
              :disabled="!canGoToStep3" 
              @click="goToStep3"
              type="button"
            >
              ถัดไป: ยืนยันการจอง →
            </button>
          </div>
        </div>

        <!-- ========================================
             STEP 3: Confirm
        ======================================== -->
        <div v-if="currentStep === 3" class="content">
          <h2>✅ ยืนยันข้อมูล</h2>
          
          <div class="confirmation-card">
            <!-- ✅ Branch Info -->
            <div class="detail-section">
              <h4>🏢 สาขา</h4>
              <div class="branch-detail">
                <p class="branch-name">{{ currentBranch?.branch_name }}</p>
                <p class="branch-address">{{ currentBranch?.branch_address }}</p>
                <p class="branch-tel">📞 {{ currentBranch?.branch_tel }}</p>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Vehicle Info -->
            <div class="detail-section">
              <h4>🚗 ข้อมูลรถ</h4>
              <div class="detail-row">
                <label>ประเภทรถ</label>
                <span class="value">{{ getVehicleName(selectedVehicle) }}</span>
              </div>
              <div class="detail-row">
                <label>ตัวคูณราคา</label>
                <span class="value price-highlight">{{ getVehicleMultiplierText(selectedVehicle) }}</span>
              </div>
              <div class="detail-row-input">
                <label for="vehiclePlate">ทะเบียนรถ (ไม่บังคับ)</label>
                <input 
                  type="text" 
                  id="vehiclePlate" 
                  v-model="vehiclePlate" 
                  placeholder="เช่น 1กข 1234"
                  maxlength="20"
                >
              </div>
              <div class="detail-row-input">
                <label for="vehicleColor">สีรถ (ไม่บังคับ)</label>
                <input 
                  type="text" 
                  id="vehicleColor" 
                  v-model="vehicleColor" 
                  placeholder="เช่น ดำ, ขาว, แดง"
                  maxlength="30"
                >
              </div>
            </div>

            <div class="divider"></div>

            <!-- Services Info -->
            <div class="detail-section">
              <h4>🛠️ บริการที่เลือก</h4>
              <div class="services-list">
                <div v-for="id in selectedServices" :key="id" class="service-item">
                  <span class="service-name">
                    <img :src="getServiceIcon(id)" class="service-item-icon" alt="" /> 
                    {{ getServiceName(id) }}
                    <small>(฿{{ getServicePrice(id) }} × {{ getVehicleMultiplier(selectedVehicle) }})</small>
                  </span>
                  <span class="service-price">฿{{ getServiceFinalPrice(id).toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <!-- DateTime Info -->
            <div class="detail-section">
              <h4>📅 วันที่และเวลา</h4>
              <div class="datetime-display">
                <div class="datetime-value">{{ formatSelectedDateTime }}</div>
                <p class="datetime-duration">⏱️ ระยะเวลาประมาณ {{ totalServiceDuration }} นาที</p>
              </div>
            </div>

            <div class="divider"></div>

            <!-- ✅ Price Summary -->
            <div class="detail-section">
              <h4>💰 สรุปค่าใช้จ่าย</h4>
              <div class="price-summary">
                <div class="price-row multiplier-row">
                  <span>{{ getVehicleName(selectedVehicle) }} (ตัวคูณ)</span>
                  <span>{{ getVehicleMultiplierText(selectedVehicle) }}</span>
                </div>
                
                <div class="divider-small"></div>
                
                <div class="price-row" v-for="id in selectedServices" :key="id">
                  <span class="service-breakdown">
                    {{ getServiceName(id) }}
                    <small>(฿{{ getServicePrice(id) }} × {{ getVehicleMultiplier(selectedVehicle) }})</small>
                  </span>
                  <span>฿{{ getServiceFinalPrice(id).toLocaleString() }}</span>
                </div>
                
                <div class="price-row subtotal-row">
                  <span>รวมค่าบริการ</span>
                  <span>฿{{ subtotal.toLocaleString() }}</span>
                </div>
                
                <div v-if="discount > 0" class="price-row discount">
                  <span>🎉 ส่วนลด {{ discountPercent }}%</span>
                  <span>-฿{{ discount.toLocaleString() }}</span>
                </div>
                
                <div class="price-row total">
                  <strong>ยอดชำระทั้งหมด</strong>
                  <strong class="total-price">฿{{ total.toLocaleString() }}</strong>
                </div>
                
                <!-- ✅ Points Preview -->
                <div class="points-preview-row">
                  <div class="points-preview-content">
                    <span class="icon">🎁</span>
                    <span class="text">คุณจะได้รับ <strong>+{{ estimatedPoints }} คะแนน</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ Payment Method -->
          <div class="payment-section">
            <h3>💳 เลือกวิธีชำระเงิน</h3>
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

          <!-- ✅ Terms -->
          <div class="terms-section">
            <label class="checkbox">
              <input type="checkbox" v-model="acceptTerms">
              <span>ฉันได้อ่านและยอมรับ <a href="#" @click.prevent="showTerms">เงื่อนไขการใช้บริการ</a></span>
            </label>
          </div>

          <div class="actions">
            <button class="btn" @click="goToStep2" type="button">← แก้ไขข้อมูล</button>
            <button 
              class="btn primary confirm-btn" 
              :disabled="!canConfirm || isLoading" 
              @click="confirmBooking"
              type="button"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';
import { useBranch } from '@/composables/useBranch';
import { usePoints } from '@/composables/usePoints';
import { bookingAPI } from '@/services/api';
import { CAR_TYPES, SERVICES } from '@/constants';

const router = useRouter();
const { loadSelectedBranch } = useBranch();
const { refreshPoints } = usePoints();

// ========================================
// STATE
// ========================================
const currentBranch = ref<any>(null);
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
const bookedSlots = ref<Array<{ booking_date: string; booking_time: string; duration: number }>>([]);

// ========================================
// CONSTANTS
// ========================================
const AVAILABLE_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
  '17:00', '17:30', '18:00'
]; 

// ========================================
// COMPUTED
// ========================================
const formatSelectedDateTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return '-';
  const [year, month, day] = selectedDate.value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const thaiDate = date.toLocaleDateString('th-TH', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' 
  });
  return `${thaiDate} เวลา ${selectedTime.value} น.`;
});

const subtotal = computed(() => {
  const multiplier = getVehicleMultiplier(selectedVehicle.value);
  const servicesTotal = selectedServices.value.reduce((sum, id) => {
    const servicePrice = getServicePrice(id);
    return sum + (servicePrice * multiplier);
  }, 0);
  return Math.round(servicesTotal);
});

const discountPercent = computed(() => {
  if (selectedServices.value.length >= 3) return 20;
  if (selectedServices.value.length >= 2) return 10;
  return 0;
});

const discount = computed(() => Math.floor(subtotal.value * (discountPercent.value / 100)));
const total = computed(() => subtotal.value - discount.value);

const estimatedPoints = computed(() => {
  // 10 Baht = 1 point (base rate)
  return Math.floor(total.value / 10);
});

const canGoToStep3 = computed(() => {
  return selectedServices.value.length > 0 && 
         selectedDate.value && 
         selectedTime.value &&
         currentBranch.value;
});

const canConfirm = computed(() => {
  return acceptTerms.value && 
         paymentMethod.value && 
         !isLoading.value &&
         currentBranch.value;
});

const daysInMonth = computed(() => {
  const date = displayMonth.value;
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days: Array<Date | null> = [];
  
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

const totalServiceDuration = computed(() => {
  if (selectedServices.value.length === 0) return 0;
  return selectedServices.value.reduce((total, serviceId) => {
    const service = SERVICES.find(s => s.id === serviceId);
    return total + (service?.duration || 0);
  }, 0);
});

const slotsNeeded = computed(() => {
  if (totalServiceDuration.value === 0) return 1;
  return Math.ceil(totalServiceDuration.value / 30);
});

// ========================================
// METHODS
// ========================================
const selectVehicle = (id: string) => { 
  selectedVehicle.value = id; 
  console.log('✅ Selected vehicle:', getVehicleName(id));
};

const getVehicleName = (id: string) => CAR_TYPES.find(v => v.id === id)?.name || '';

const getVehicleIcon = (id: string) => {
  return CAR_TYPES.find(v => v.id === id)?.icon || '🚗';
};

const getVehicleMultiplier = (id: string) => CAR_TYPES.find(v => v.id === id)?.multiplier || 1.00;

const getVehicleMultiplierText = (id: string) => {
  const multiplier = getVehicleMultiplier(id);
  if (multiplier === 1.00) return '×1.0 (มาตรฐาน)';
  if (multiplier > 1.00) return `×${multiplier} (+${((multiplier - 1) * 100).toFixed(0)}%)`;
  return `×${multiplier} (${((multiplier - 1) * 100).toFixed(0)}%)`;
};

const getMultiplierLabel = (multiplier: number) => {
  if (multiplier === 1.00) return 'มาตรฐาน';
  if (multiplier > 1.00) return `+${((multiplier - 1) * 100).toFixed(0)}%`;
  return `${((multiplier - 1) * 100).toFixed(0)}%`;
};

const getServiceName = (id: string) => SERVICES.find(s => s.id === id)?.name || '';
const getServicePrice = (id: string) => SERVICES.find(s => s.id === id)?.price || 0;
const getServiceIcon = (id: string) => SERVICES.find(s => s.id === id)?.image || '';

const getServiceFinalPrice = (serviceId: string) => {
  const price = getServicePrice(serviceId);
  const multiplier = getVehicleMultiplier(selectedVehicle.value);
  return Math.round(price * multiplier);
};

const getDiscountReason = () => {
  if (selectedServices.value.length >= 3) return '(จอง 3 บริการขึ้นไป)';
  if (selectedServices.value.length >= 2) return '(จอง 2 บริการ)';
  return '';
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const selectDateFromCalendar = (day: Date | null) => {
  if (!day || isPastDate(day)) return;
  const localDate = new Date(day.getTime() - (day.getTimezoneOffset() * 60000));
  selectedDate.value = localDate.toISOString().split('T')[0];
  selectedTime.value = '';
  console.log('✅ Selected date:', selectedDate.value);
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
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' });
};

const isSelectedDate = (day: Date | null) => {
  if (!day) return false;
  const localDate = new Date(day.getTime() - (day.getTimezoneOffset() * 60000));
  const dayStr = localDate.toISOString().split('T')[0];
  return dayStr === selectedDate.value;
};

const isToday = (day: Date | null) => {
  if (!day) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDay = new Date(day);
  checkDay.setHours(0, 0, 0, 0);
  return checkDay.getTime() === today.getTime();
};

const isPastDate = (day: Date | null) => {
  if (!day) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDay = new Date(day);
  checkDay.setHours(0, 0, 0, 0);
  return checkDay < today;
};

const isTimeDisabled = (time: string): boolean => {
  if (!selectedDate.value) return false;
  
  const checkingTimeInMinutes = timeToMinutes(time);
  const selectedDateStr = selectedDate.value;

  // Check existing bookings
  for (const booking of bookedSlots.value) {
    if (booking.booking_date !== selectedDateStr) continue;
    const bookingStart = timeToMinutes(booking.booking_time);
    const bookingEnd = bookingStart + booking.duration;
    if (checkingTimeInMinutes >= bookingStart && checkingTimeInMinutes < bookingEnd) return true;
  }

  // Check if our booking would overlap
  const requiredDuration = totalServiceDuration.value || 30;
  const selectionEnd = checkingTimeInMinutes + requiredDuration;

  for (const booking of bookedSlots.value) {
    if (booking.booking_date !== selectedDateStr) continue;
    const bookingStart = timeToMinutes(booking.booking_time);
    const bookingEnd = bookingStart + booking.duration;
    if (checkingTimeInMinutes < bookingEnd && selectionEnd > bookingStart) return true;
  }

  // Check closing time
  const closingTime = timeToMinutes('18:00');
  if (selectionEnd > closingTime) return true;

  // Check if time is in the past (today only)
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
    if (slotTime <= now) return true;
  }

  return false;
};

const isBlockedByCurrentSelection = (time: string): boolean => {
  if (!selectedTime.value || totalServiceDuration.value <= 30) return false;
  const selectedIndex = AVAILABLE_TIMES.indexOf(selectedTime.value);
  const checkingIndex = AVAILABLE_TIMES.indexOf(time);
  return checkingIndex > selectedIndex && checkingIndex < selectedIndex + slotsNeeded.value;
};

const toggleService = (id: string) => {
  const index = selectedServices.value.indexOf(id);
  if (index > -1) {
    selectedServices.value.splice(index, 1);
  } else {
    selectedServices.value.push(id);
  }
  selectedTime.value = ''; // Reset time when services change
};

const changeBranch = () => {
  router.push('/branch-selection');
};

const goToStep1 = () => { 
  currentStep.value = 1; 
};

const goToStep2 = () => {
  if (!selectedVehicle.value) {
    Swal.fire({ 
      title: 'กรุณาเลือกประเภทรถ', 
      icon: 'warning', 
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
    return;
  }
  currentStep.value = 2;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const goToStep3 = () => {
  if (selectedServices.value.length === 0) {
    Swal.fire({ 
      title: 'กรุณาเลือกบริการ', 
      text: 'เลือกอย่างน้อย 1 บริการ', 
      icon: 'warning', 
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
    return;
  }
  if (!selectedDate.value || !selectedTime.value) {
    Swal.fire({ 
      title: 'กรุณาเลือกวันที่และเวลา', 
      icon: 'warning', 
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
    return;
  }
  if (!currentBranch.value) {
    Swal.fire({
      title: 'กรุณาเลือกสาขา',
      icon: 'warning',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    }).then(() => {
      router.push('/branch-selection');
    });
    return;
  }
  currentStep.value = 3;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const showTerms = () => {
  Swal.fire({
    title: 'เงื่อนไขการใช้บริการ',
    html: `
      <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 1rem;">
        <h4 style="margin-bottom: 1rem; color: #dc2626;">📋 เงื่อนไขการจอง</h4>
        <p style="margin-bottom: 0.75rem; line-height: 1.6;">
          • กรุณามาตรงเวลาที่จอง หากมาสายเกิน 15 นาที ร้านขอสงวนสิทธิ์ยกเลิกคิว
        </p>
        <p style="margin-bottom: 0.75rem; line-height: 1.6;">
          • ยกเลิก/เลื่อนนัด ต้องแจ้งล่วงหน้าอย่างน้อย 2 ชั่วโมง
        </p>
        <p style="margin-bottom: 0.75rem; line-height: 1.6;">
          • ราคาบริการคำนวณจาก: ราคาบริการ × ตัวคูณของรถ
        </p>
        <p style="margin-bottom: 0.75rem; line-height: 1.6;">
          • ส่วนลดพิเศษเมื่อจอง 2 บริการขึ้นไป
        </p>
        <p style="margin-bottom: 0.75rem; line-height: 1.6;">
          • สะสมคะแนน 10 บาท = 1 คะแนน
        </p>
        <p style="line-height: 1.6;">
          • คะแนนจะได้รับเมื่อทำบริการเสร็จสิ้น
        </p>
      </div>
    `,
    confirmButtonText: 'รับทราบ',
    confirmButtonColor: '#dc2626',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    width: '600px'
  });
};

const fetchBookedSlots = async () => {
  try {
    const response = await bookingAPI.getActiveBookings();
    if (response.data.success) {
      bookedSlots.value = response.data.bookings.map((booking: any) => ({
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        duration: booking.duration
      }));
      console.log('✅ Loaded booked slots:', bookedSlots.value.length);
    }
  } catch (error) {
    console.error('❌ Error loading booked slots:', error);
  }
};

// ✅ Confirm Booking
const confirmBooking = async () => {
  if (!currentBranch.value) {
    await Swal.fire({
      title: 'กรุณาเลือกสาขา',
      icon: 'warning',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
    router.push('/branch-selection');
    return;
  }

  try {
    isLoading.value = true;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      await Swal.fire({ 
        title: 'กรุณาเข้าสู่ระบบ', 
        icon: 'warning', 
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      });
      router.push('/login');
      return;
    }
    
    const user = JSON.parse(userStr);

    // Validate
    if (!selectedVehicle.value || selectedServices.value.length === 0 || 
        !selectedDate.value || !selectedTime.value || !paymentMethod.value) {
      await Swal.fire({ 
        title: 'ข้อมูลไม่ครบถ้วน', 
        text: 'กรุณากรอกข้อมูลให้ครบถ้วน', 
        icon: 'warning', 
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      });
      return;
    }

    // ✅ Check time conflict
    const checkTime = timeToMinutes(selectedTime.value);
    const checkEnd = checkTime + totalServiceDuration.value;
    
    for (const booking of bookedSlots.value) {
      if (booking.booking_date !== selectedDate.value) continue;
      const bStart = timeToMinutes(booking.booking_time);
      const bEnd = bStart + booking.duration;
      
      if ((checkTime < bEnd && checkEnd > bStart) || (checkTime >= bStart && checkTime < bEnd)) {
        await fetchBookedSlots();
        await Swal.fire({
          title: '⚠️ ช่วงเวลานี้ไม่ว่าง',
          text: 'มีผู้อื่นจองไปก่อนแล้ว กรุณาเลือกเวลาใหม่',
          icon: 'warning',
          confirmButtonColor: '#dc2626',
          background: 'rgba(30, 30, 30, 0.98)',
          color: '#ffffff'
        });
        isLoading.value = false;
        return;
      }
    }

    // ✅ Prepare booking data
    const bookingData = {
      customer_id: user.id,
      branch_id: currentBranch.value.branch_ID,
      booking_date: selectedDate.value,
      booking_time: selectedTime.value,
      duration: totalServiceDuration.value || 30,
      vehicle_type: getVehicleName(selectedVehicle.value),
      vehicle_plate: vehiclePlate.value || null,
      vehicle_color: vehicleColor.value || null,
      services: selectedServices.value.map(id => getServiceName(id)),
      payment_method: paymentMethod.value,
      total_amount: total.value,
      points_to_use: 0
    };

    console.log('📤 Sending booking:', bookingData);

    const response = await bookingAPI.create(bookingData);

    console.log('📦 Booking response:', response.data);

    if (response.data.success) {
      // ✅ Refresh user points immediately
      await refreshPoints(user.id);
      
      // Update booked slots
      bookedSlots.value.push({
        booking_date: selectedDate.value,
        booking_time: selectedTime.value,
        duration: totalServiceDuration.value
      });

      // ✅ Show success with full details
      await Swal.fire({
        title: '🎉 จองสำเร็จ!',
        html: `
          <div style="padding: 1.5rem;">
            <div style="background: rgba(16, 185, 129, 0.1); padding: 1.5rem; border-radius: 12px; border: 2px solid rgba(16, 185, 129, 0.3); margin-bottom: 1.5rem;">
              <p style="font-size: 1rem; color: rgba(255,255,255,0.7); margin-bottom: 0.5rem;">รหัสการจอง</p>
              <p style="font-size: 2rem; font-weight: 900; color: #dc2626; margin-bottom: 1rem;">
                #${response.data.booking.id}
              </p>
                            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.6);">
                ${currentBranch.value.branch_name}
              </p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
              <p style="margin-bottom: 0.5rem; color: rgba(255,255,255,0.8);">
                📅 ${formatSelectedDateTime.value}
              </p>
              <p style="color: #10b981; margin-bottom: 0.5rem;">
                ⏱️ ใช้เวลาประมาณ ${totalServiceDuration.value} นาที
              </p>
              <p style="color: #fbbf24; font-size: 1.3rem; font-weight: 700;">
                💰 ยอดชำระ: ฿${total.value.toLocaleString()}
              </p>
            </div>
            
            ${response.data.booking.points_to_earn > 0 ? `
              <div style="padding: 1.2rem; background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.2)); border-radius: 12px; border: 2px solid rgba(16,185,129,0.4);">
                <p style="font-size: 1.1rem; color: #10b981; font-weight: 700; margin-bottom: 0.3rem;">
                  🎁 คุณจะได้รับ
                </p>
                <p style="font-size: 2rem; font-weight: 900; color: #fbbf24; text-shadow: 0 0 20px rgba(251,191,36,0.5);">
                  +${response.data.booking.points_to_earn} คะแนน
                </p>
                <small style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">
                  เมื่อบริการเสร็จสิ้น
                </small>
              </div>
            ` : ''}
          </div>
        `,
        icon: 'success',
        iconColor: '#10b981',
        confirmButtonText: 'ดูประวัติการจอง',
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff',
        showCancelButton: true,
        cancelButtonText: 'กลับหน้าหลัก',
        cancelButtonColor: '#6b7280',
        allowOutsideClick: false
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
    
    let errorMessage = 'ไม่สามารถจองบริการได้';
    
    if (error.response) {
      if (error.response.status === 409) {
        errorMessage = error.response.data.message || 'ช่วงเวลานี้มีการจองแล้ว';
        await fetchBookedSlots();
      } else {
        errorMessage = error.response.data.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
    }
    
    await Swal.fire({
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

// ========================================
// LIFECYCLE
// ========================================
onMounted(async () => {
  console.log('📌 Booking page mounted');
  
  // ✅ Load selected branch
  currentBranch.value = loadSelectedBranch();
  
  if (!currentBranch.value) {
    const result = await Swal.fire({
      title: 'กรุณาเลือกสาขา',
      text: 'คุณยังไม่ได้เลือกสาขา กรุณาเลือกสาขาก่อนจองบริการ',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'เลือกสาขา',
      cancelButtonText: 'กลับหน้าหลัก',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      allowOutsideClick: false,
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
    
    if (result.isConfirmed) {
      router.push('/branch-selection');
    } else {
      router.push('/');
    }
    return;
  }
  
  console.log('✅ Using branch:', currentBranch.value.branch_name);
  
  // Fetch booked slots
  await fetchBookedSlots();
});

onUnmounted(() => {
  console.log('📌 Booking page unmounted');
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
}

/* ========================================
   HERO
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
  margin-bottom: 1.5rem;
}

/* ========================================
   BRANCH INFO IN HERO
======================================== */
.hero-branch-info {
  max-width: 800px;
  margin: 0 auto;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.branch-badge {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.branch-badge:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(220, 38, 38, 0.3);
}

.branch-badge .icon {
  font-size: 1.8rem;
  flex-shrink: 0;
}

.branch-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
}

.branch-text strong {
  font-size: 1.1rem;
  color: #fff;
}

.branch-text small {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.btn-change {
  padding: 0.6rem 1.2rem;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.4);
  border-radius: 20px;
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  white-space: nowrap;
}

.btn-change:hover {
  background: rgba(220, 38, 38, 0.3);
  border-color: #dc2626;
  transform: scale(1.05);
}

.no-branch-warning {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.8rem;
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.4);
  border-radius: 50px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.no-branch-warning .icon {
  font-size: 1.8rem;
  color: #ef4444;
  filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.6));
}

.warning-text {
  font-size: 1rem;
  font-weight: 600;
  color: #ef4444;
}

.btn-select-branch-inline {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.btn-select-branch-inline:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5);
}

/* ========================================
   MAIN
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

/* ========================================
   CONTENT
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
   GRIDS
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
  padding: 1.5rem;
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

/* ========================================
   VEHICLE CARD
======================================== */
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

.multiplier-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  transition: all 0.3s;
}

.multiplier-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.multiplier-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.card.selected .multiplier-badge {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}

/* ========================================
   SERVICE CARD
======================================== */
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
  z-index: 10;
}

.badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
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
  z-index: 10;
}

@keyframes checkmarkPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* ========================================
   VEHICLE INFO
======================================== */
.vehicle-price-info {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(139, 0, 0, 0.1));
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 16px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.info-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vehicle-icon {
  font-size: 3rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.5));
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
  color: rgba(59, 130, 246, 0.9);
  font-weight: 600;
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
  transform: scale(1.05);
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

.datetime-picker {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .datetime-picker {
    grid-template-columns: 350px 1fr;
    align-items: flex-start;
  }
}

/* Calendar */
.calendar-container {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: rgba(220, 38, 38, 0.5);
  transform: scale(1.1);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.days-header {
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.day-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  border: 2px solid transparent;
}

.day-cell:not(.past-day):not(.not-current-month):hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.day-cell.today {
  border-color: rgba(220, 38, 38, 0.5);
  color: #dc2626;
  font-weight: 700;
}

.day-cell.past-day,
.day-cell.not-current-month {
  color: rgba(255, 255, 255, 0.2);
  cursor: not-allowed;
  pointer-events: none;
}

.day-cell.selected {
  background-color: #dc2626;
  color: #fff !important;
  font-weight: 700;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
}

/* Time Slots */
.time-slots-container {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
}

.time-slots-container h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #fff;
}

.total-duration-info {
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.total-duration-info strong {
  color: #dc2626;
  font-weight: 700;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
}

.time-slot {
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  position: relative;
  font-family: inherit;
}

.time-slot:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-2px);
}

.time-slot.selected {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.time-slot.disabled {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  text-decoration: line-through;
}

.time-slot.blocked-by-selection {
  background: rgba(220, 38, 38, 0.2);
  border-color: rgba(220, 38, 38, 0.4);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

.time-slot.blocked-by-selection::after {
  content: 'จองต่อ';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  width: 100%;
  text-align: center;
}

.time-slot.blocked-by-selection .time-text {
  visibility: hidden;
}

.service-hours-note {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

/* ========================================
   SELECTED DATETIME DISPLAY
======================================== */
.selected-datetime {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
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
  margin-bottom: 0.5rem;
}

.selected-datetime p {
  font-size: 0.9rem;
  color: rgba(16, 185, 129, 0.8);
  margin: 0.25rem 0;
}

.selected-datetime .note {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
}

/* ========================================
   SUMMARY
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

.multiplier-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.multiplier-badge-small {
  padding: 0.4rem 0.8rem;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #3b82f6;
}

.divider-small {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
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

.service-detail,
.service-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.service-detail small,
.service-breakdown small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.service-final-price {
  font-weight: 700;
  color: #dc2626;
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

/* ✅ Points Earn Preview */
.points-earn-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 10px;
  text-align: center;
}

.points-earn-preview .icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.points-earn-preview .text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.points-earn-preview strong {
  color: #fbbf24;
  font-size: 1.1rem;
  font-weight: 900;
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

.branch-detail {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.branch-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.branch-address,
.branch-tel {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
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
  color: #3b82f6 !important;
  font-size: 1.1rem !important;
}

.detail-row-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-row-input label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

.detail-row-input input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.detail-row-input input:focus {
  outline: none;
  border-color: #dc2626;
}

.detail-row-input input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 1.5rem 0;
}

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
}

.service-item-icon {
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
  vertical-align: middle;
  filter: invert(1);
}

.service-name {
  font-size: 1rem;
  color: #fff;
  font-weight: 500;
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.service-name small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.service-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #dc2626;
}

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
  margin-bottom: 0.5rem;
}

.datetime-duration {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
}

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

.price-row.multiplier-row {
  background: rgba(59, 130, 246, 0.05);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border-bottom: none;
}

.price-row.multiplier-row span:last-child {
  color: #3b82f6;
  font-weight: 700;
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

/* ✅ Points Preview Row */
.points-preview-row {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.points-preview-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15));
  border-radius: 10px;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.points-preview-content .icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6));
}

.points-preview-content .text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.points-preview-content strong {
  color: #fbbf24;
  font-size: 1.1rem;
  font-weight: 900;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
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

.payment-option:hover .payment-icon,
.payment-option.selected .payment-icon {
  transform: scale(1.15);
}

.payment-option:hover {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(255, 255, 255, 0.05);
}

.payment-option.selected {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.2));
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
}

/* ========================================
   TERMS SECTION
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
  flex-shrink: 0;
}

.checkbox span {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.checkbox a {
  color: #dc2626;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.3s;
}

.checkbox a:hover {
  color: #fbbf24;
}

/* ========================================
   ACTIONS
======================================== */
.actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
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
  justify-content: center;
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
  flex-grow: 1;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
   ANIMATIONS
======================================== */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1024px) {
  .datetime-picker {
    grid-template-columns: 1fr;
  }

  .payment-grid {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 1rem 1.5rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .branch-badge {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
    padding: 1rem;
  }

  .branch-text {
    align-items: center;
  }

  .no-branch-warning {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
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

  .content h2 {
    font-size: 1.5rem;
  }

  .grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }

  .btn.confirm-btn {
    flex-grow: 0;
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

  .time-slots-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  }

  .summary h4 {
    font-size: 1.1rem;
  }

  .payment-content {
    padding: 1.5rem 1rem;
  }

  .payment-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 2rem 1rem;
  }

  .hero {
    padding: 2.5rem 1rem 1rem;
  }

  .hero h1 {
    font-size: 1.8rem;
  }

  .content h2 {
    font-size: 1.3rem;
  }

  .card {
    padding: 1.5rem 1rem;
  }

  .total-amount,
  .total-price {
    font-size: 1.8rem;
  }

  .actions {
    gap: 0.75rem;
  }

  .btn {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .btn.confirm-btn {
    padding: 1.1rem;
    font-size: 1rem;
  }

  .branch-badge {
    padding: 1rem;
  }

  .branch-text strong {
    font-size: 1rem;
  }

  .branch-text small {
    font-size: 0.75rem;
  }

  .btn-change {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .no-branch-warning {
    padding: 1rem;
  }

  .warning-text {
    font-size: 0.9rem;
    text-align: center;
  }

  .btn-select-branch-inline {
    width: 100%;
    padding: 0.75rem;
  }

  .calendar-container,
  .time-slots-container {
    padding: 1rem;
  }

  .time-slot {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .selected-services {
    padding: 1rem;
  }

  .service-tag {
    font-size: 0.8rem;
    padding: 0.5rem 0.9rem;
  }

  .summary {
    padding: 1.5rem;
  }

  .summary-item {
    font-size: 0.85rem;
  }

  .row {
    font-size: 0.9rem;
  }

  .confirmation-card {
    padding: 1.5rem 1rem;
  }

  .detail-section h4 {
    font-size: 1rem;
  }

  .branch-name {
    font-size: 1rem;
  }

  .branch-address,
  .branch-tel {
    font-size: 0.85rem;
  }

  .service-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .service-price {
    align-self: flex-end;
  }

  .datetime-value {
    font-size: 1rem;
  }

  .datetime-duration {
    font-size: 0.85rem;
  }

  .points-earn-preview {
    padding: 0.75rem;
  }

  .points-earn-preview .text {
    font-size: 0.85rem;
  }

  .points-preview-content {
    flex-direction: column;
    text-align: center;
  }

  .payment-grid {
    gap: 1rem;
  }

  .payment-content {
    padding: 1.2rem 1rem;
  }

  .payment-icon {
    font-size: 2.2rem;
  }

  .payment-label {
    font-size: 1rem;
  }
}

/* ========================================
   PRINT STYLES
======================================== */
@media print {
  .header,
  .hero,
  .progress,
  .actions,
  .btn-change,
  .no-branch-warning {
    display: none !important;
  }

  .confirmation-card {
    page-break-inside: avoid;
  }

  .main {
    padding: 1rem;
  }
}

/* ========================================
   ANIMATIONS - ENHANCED
======================================== */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.card::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  );
  transition: left 0.6s;
}

.card:hover::after {
  left: 100%;
}

/* ========================================
   ACCESSIBILITY
======================================== */
.btn:focus-visible,
.time-slot:focus-visible,
.day-cell:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

.payment-option:focus-within {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

/* ========================================
   LOADING OVERLAY
======================================== */
.booking-page::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.booking-page.loading::after {
  opacity: 1;
  pointer-events: all;
}

/* ========================================
   CUSTOM SCROLLBAR
======================================== */
.time-slots-container::-webkit-scrollbar,
.services-grid::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.time-slots-container::-webkit-scrollbar-track,
.services-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.time-slots-container::-webkit-scrollbar-thumb,
.services-grid::-webkit-scrollbar-thumb {
  background: rgba(220, 38, 38, 0.5);
  border-radius: 10px;
}

.time-slots-container::-webkit-scrollbar-thumb:hover,
.services-grid::-webkit-scrollbar-thumb:hover {
  background: #dc2626;
}

/* ========================================
   TOOLTIPS (Optional Enhancement)
======================================== */
.time-slot[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 1000;
}

.time-slot:hover[data-tooltip]::before {
  opacity: 1;
}

/* ========================================
   DARK MODE ENHANCEMENTS
======================================== */
@media (prefers-color-scheme: dark) {
  .booking-page {
    background: #000;
  }
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
}

/* ========================================
   HIGH CONTRAST MODE
======================================== */
@media (prefers-contrast: high) {
  .card {
    border-width: 3px;
  }

  .btn.primary {
    background: #dc2626;
  }

  .selected-datetime {
    border-width: 3px;
  }
}
</style>
