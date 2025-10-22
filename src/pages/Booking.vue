<template>
  <div class="booking-page">
    <!-- Navigator Component -->
    <Navigator />

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
              @click="selectVehicle('sedan')"
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
              @click="selectVehicle('truck')"
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
              @click="selectVehicle('sport')"
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
              @click="selectVehicle('suv')"
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
              @click="selectVehicle('motor')"
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
              :class="{ active: selectedServices.includes('vacuum') }"
              @click="toggleService('vacuum')"
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
              <p>ซักเบาะ</p>
              <span class="price">2,000.-</span>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div v-if="selectedVehicle || selectedServices.length > 0" class="summary-section">
          <h3 class="summary-title">สรุปการจอง</h3>
          <div class="summary-content">
            <div v-if="selectedVehicle" class="summary-item">
              <span class="label">ประเภทรถ:</span>
              <span class="value">{{ getVehicleName(selectedVehicle) }}</span>
            </div>
            <div v-if="selectedServices.length > 0" class="summary-item">
              <span class="label">บริการที่เลือก:</span>
              <span class="value">{{ getServiceNames() }}</span>
            </div>
            <div class="summary-item total">
              <span class="label">ราคารวม:</span>
              <span class="value price-highlight">{{ calculateTotal() }} บาท</span>
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
            <span v-if="!selectedVehicle || selectedServices.length === 0">กรุณาเลือกรถและบริการ</span>
            <span v-else>ยืนยันการจอง</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';

const router = useRouter();

const selectedVehicle = ref('');
const selectedServices = ref<string[]>([]);

const servicesPrices: Record<string, number> = {
  coating: 150,
  wash: 200,
  vacuum: 80,
  polish: 1000,
  interior: 2000
};

const servicesNames: Record<string, string> = {
  coating: 'เคลือบแก้ว',
  wash: 'ล้างรถ',
  vacuum: 'ดูดฝุ่น',
  polish: 'ขัดสี',
  interior: 'ซักเบาะ'
};

const vehicleNames: Record<string, string> = {
  sedan: 'รถเก๋ง',
  truck: 'รถกระบะ',
  sport: 'รถสปอร์ต',
  suv: 'รถตู้',
  motor: 'มอเตอร์ไซค์'
};

// Select Vehicle with SweetAlert notification
const selectVehicle = (vehicle: string) => {
  selectedVehicle.value = vehicle;
  
  Swal.fire({
    title: 'เลือกประเภทรถ',
    text: `คุณเลือก ${getVehicleName(vehicle)}`,
    icon: 'success',
    iconColor: '#10b981',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    background: 'rgba(30, 30, 30, 0.95)',
    color: '#ffffff',
    customClass: {
      popup: 'custom-toast'
    }
  });
};

// Toggle Service with SweetAlert notification
const toggleService = (service: string) => {
  const index = selectedServices.value.indexOf(service);
  
  if (index > -1) {
    selectedServices.value.splice(index, 1);
    
    Swal.fire({
      title: 'ยกเลิกบริการ',
      text: `ลบ ${servicesNames[service]} แล้ว`,
      icon: 'info',
      iconColor: '#f59e0b',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: 'rgba(30, 30, 30, 0.95)',
      color: '#ffffff',
      customClass: {
        popup: 'custom-toast'
      }
    });
  } else {
    selectedServices.value.push(service);
    
    Swal.fire({
      title: 'เพิ่มบริการ',
      text: `เลือก ${servicesNames[service]} (${servicesPrices[service]} บาท)`,
      icon: 'success',
      iconColor: '#10b981',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      background: 'rgba(30, 30, 30, 0.95)',
      color: '#ffffff',
      customClass: {
        popup: 'custom-toast'
      }
    });
  }
};

const getVehicleName = (type: string) => {
  return vehicleNames[type] || type;
};

const getServiceNames = () => {
  return selectedServices.value.map(s => servicesNames[s]).join(', ');
};

const calculateTotal = () => {
  return selectedServices.value.reduce((total, service) => {
    return total + (servicesPrices[service] || 0);
  }, 0);
};

// Confirm Booking with SweetAlert
const confirmBooking = () => {
  if (!selectedVehicle.value || selectedServices.value.length === 0) {
    Swal.fire({
      title: 'ข้อมูลไม่ครบ!',
      text: 'กรุณาเลือกประเภทรถและบริการ',
      icon: 'error',
      iconColor: '#dc2626',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'ตกลง',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton: 'custom-swal-confirm'
      },
      buttonsStyling: false
    });
    return;
  }

  const total = calculateTotal();
  const servicesList = getServiceNames();
  const vehicleName = getVehicleName(selectedVehicle.value);

  // Show confirmation dialog
  Swal.fire({
    title: 'ยืนยันการจอง',
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p style="margin-bottom: 0.8rem;"><strong>ประเภทรถ:</strong> ${vehicleName}</p>
        <p style="margin-bottom: 0.8rem;"><strong>บริการ:</strong> ${servicesList}</p>
        <p style="margin-bottom: 0.8rem; font-size: 1.3rem; color: #dc2626;"><strong>ราคารวม:</strong> ${total} บาท</p>
      </div>
    `,
    icon: 'question',
    iconColor: '#dc2626',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '<i class="fas fa-check"></i> ยืนยันการจอง',
    cancelButtonText: '<i class="fas fa-times"></i> ยกเลิก',
    reverseButtons: true,
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-text',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel'
    },
    buttonsStyling: false,
    showClass: {
      popup: 'animate__animated animate__zoomIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__zoomOut animate__faster'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      saveBooking(vehicleName, servicesList, total);
    }
  });
};

// Save booking to localStorage and show success
const saveBooking = (vehicleName: string, servicesList: string, total: number) => {
  // Get current date
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create booking object
  const newBooking = {
    id: Date.now(),
    date: dateStr,
    carType: vehicleName,
    services: selectedServices.value.map(s => servicesNames[s]),
    price: total,
    status: 'pending',
    statusText: 'รอดำเนินการ',
    createdAt: currentDate.toISOString()
  };

  // Get existing bookings from localStorage
  const existingBookings = localStorage.getItem('bookingHistory');
  let bookings = existingBookings ? JSON.parse(existingBookings) : [];

  // Add new booking
  bookings.unshift(newBooking);

  // Save to localStorage
  localStorage.setItem('bookingHistory', JSON.stringify(bookings));

  // Show success message with animation
  Swal.fire({
    title: 'จองสำเร็จ!',
    html: `
      <div style="text-align: center; padding: 1rem;">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">การจองของคุณได้รับการบันทึกแล้ว</p>
        <div style="background: rgba(220, 38, 38, 0.1); padding: 1rem; border-radius: 10px; margin-top: 1rem;">
          <p style="margin-bottom: 0.5rem;"><strong>รหัสการจอง:</strong> #${newBooking.id}</p>
          <p style="margin-bottom: 0.5rem;"><strong>วันที่:</strong> ${dateStr}</p>
          <p style="color: #10b981;"><strong>สถานะ:</strong> รอดำเนินการ</p>
        </div>
      </div>
    `,
    icon: 'success',
    iconColor: '#10b981',
    confirmButtonColor: '#dc2626',
    confirmButtonText: '<i class="fas fa-history"></i> ดูประวัติการจอง',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-text',
      confirmButton: 'custom-swal-confirm'
    },
    buttonsStyling: false,
    showClass: {
      popup: 'animate__animated animate__bounceIn'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut'
    }
  }).then(() => {
    // Reset form
    selectedVehicle.value = '';
    selectedServices.value = [];
    
    // Navigate to history page
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
  color: white;
  font-family: 'Kanit', 'Sarabun', sans-serif;
}

/* Booking Section */
.booking-section {
  margin-top: 100px;
  padding: 3rem 2rem 5rem;
  min-height: calc(100vh - 100px);
  background: linear-gradient(to bottom, #000 0%, #1a1a1a 100%);
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
  letter-spacing: 1px;
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
  position: relative;
  overflow: hidden;
}

.vehicle-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.2), transparent);
  transition: left 0.5s;
}

.vehicle-card:hover::before {
  left: 100%;
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
  transition: left 0.5s;
}

.service-card:hover::before {
  left: 100%;
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

/* Summary Section */
.summary-section {
  background: rgba(220, 38, 38, 0.1);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.summary-title {
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #dc2626;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.summary-item.total {
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.5);
  padding: 1rem 1.5rem;
  margin-top: 0.5rem;
}

.summary-item .label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.summary-item .value {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
}

.summary-item.total .label {
  font-size: 1.2rem;
  font-weight: 700;
}

.summary-item.total .value {
  font-size: 1.5rem;
  font-weight: 900;
}

.price-highlight {
  color: #dc2626;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
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
  font-size: 1.3rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.btn-confirm:hover:not(:disabled) {
  background: transparent;
  color: #dc2626;
  transform: scale(1.05);
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.5);
}

.btn-confirm:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(100, 100, 100, 0.5);
  border-color: rgba(100, 100, 100, 0.5);
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
    font-size: 1.1rem;
  }

  .summary-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .vehicle-grid, .service-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- SweetAlert2 Custom Styles -->
<style>
/* Toast Notification */
.custom-toast {
  border-radius: 10px !important;
  border: 1px solid rgba(220, 38, 38, 0.3) !important;
  font-family: 'Rajdhani', 'Sarabun', sans-serif !important;
}

/* Custom SweetAlert2 Styles */
.custom-swal-popup {
  border-radius: 20px !important;
  border: 2px solid rgba(220, 38, 38, 0.3) !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
  padding: 2rem !important;
}

.custom-swal-title {
  font-family: 'Rajdhani', 'Sarabun', sans-serif !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin-bottom: 1rem !important;
}

.custom-swal-text {
  font-family: 'Rajdhani', 'Sarabun', sans-serif !important;
  font-size: 1.1rem !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.custom-swal-confirm,
.custom-swal-cancel {
  font-family: 'Rajdhani', 'Sarabun', sans-serif !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
  padding: 0.9rem 2rem !important;
  border-radius: 8px !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  transition: all 0.3s !important;
  border: 2px solid !important;
  min-width: 140px !important;
}

.custom-swal-confirm {
  background: #dc2626 !important;
  color: white !important;
  border-color: #dc2626 !important;
}

.custom-swal-confirm:hover {
  background: #b91c1c !important;
  border-color: #b91c1c !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4) !important;
}

.custom-swal-cancel {
  background: transparent !important;
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.custom-swal-cancel:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: white !important;
  transform: translateY(-2px) !important;
}
</style>