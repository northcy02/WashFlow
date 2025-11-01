<!-- src/pages/Register.vue -->
<template>
  <div class="register-page">
    <Navigator />

    <!-- Alert -->
    <transition name="fade">
      <div v-if="alertMessage" :class="['alert', alertType]">
        <span class="icon">{{ alertIcon }}</span>
        <span>{{ alertMessage }}</span>
        <button @click="closeAlert">×</button>
      </div>
    </transition>

    <!-- Main -->
    <div class="main">
      <div class="container">
        <!-- Register Card -->
        <div class="card">
          <div class="card-header">
            <h1>สมัครสมาชิก</h1>
            <p>เริ่มต้นใช้งาน CYBERCAR วันนี้</p>
          </div>
          
          <!-- ✅ Welcome Bonus Notice -->
          <div class="welcome-bonus-notice">
            <span class="bonus-icon">🎁</span>
            <div class="bonus-content">
              <h3>🎉 รับ Welcome Bonus!</h3>
              <p>สมัครสมาชิกวันนี้ รับทันที <span class="highlight">50 Points</span></p>
              <small>เริ่มต้นเป็นสมาชิก Bronze พร้อมสิทธิประโยชน์มากมาย</small>
            </div>
          </div>
          
          <form @submit.prevent="handleRegister">
            <!-- ชื่อ-นามสกุล -->
            <div class="field-group">
              <div class="field">
                <label>ชื่อ <span class="required">*</span></label>
                <input 
                  v-model="formData.cust_fname" 
                  type="text" 
                  placeholder="ชื่อจริง"
                  required
                  :disabled="isLoading"
                >
              </div>

              <div class="field">
                <label>นามสกุล <span class="required">*</span></label>
                <input 
                  v-model="formData.cust_lname" 
                  type="text" 
                  placeholder="นามสกุล"
                  required
                  :disabled="isLoading"
                >
              </div>
            </div>

            <!-- เบอร์โทร -->
            <div class="field">
              <label>เบอร์โทรศัพท์ <span class="required">*</span></label>
              <input 
                v-model="formData.cust_tel" 
                type="tel" 
                placeholder="081-234-5678"
                required
                :disabled="isLoading"
                @input="formatPhoneNumber"
              >
              <small>รูปแบบ: 081-234-5678</small>
            </div>

            <!-- ที่อยู่ -->
            <div class="field">
              <label>ที่อยู่</label>
              <textarea 
                v-model="formData.cust_address" 
                placeholder="ที่อยู่สำหรับจัดส่งเอกสาร (ไม่บังคับ)"
                rows="3"
                :disabled="isLoading"
              ></textarea>
            </div>

            <div class="divider">
              <span>ข้อมูลเข้าสู่ระบบ</span>
            </div>

            <!-- Username -->
            <div class="field">
              <label>ชื่อผู้ใช้ <span class="required">*</span></label>
              <input 
                v-model="formData.username" 
                type="text" 
                placeholder="อย่างน้อย 4 ตัวอักษร"
                required
                :disabled="isLoading"
                @blur="checkUsernameLength"
              >
              <small v-if="usernameError" class="error">{{ usernameError }}</small>
            </div>

            <!-- Password -->
            <div class="field">
              <label>รหัสผ่าน <span class="required">*</span></label>
              <div class="password-input">
                <input 
                  v-model="formData.password" 
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  required
                  :disabled="isLoading"
                  @blur="checkPasswordStrength"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showPassword = !showPassword"
                  :disabled="isLoading"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <small v-if="passwordError" class="error">{{ passwordError }}</small>
            </div>

            <!-- Confirm Password -->
            <div class="field">
              <label>ยืนยันรหัสผ่าน <span class="required">*</span></label>
              <div class="password-input">
                <input 
                  v-model="formData.confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  required
                  :disabled="isLoading"
                  @blur="checkPasswordMatch"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  :disabled="isLoading"
                >
                  {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <small v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</small>
            </div>

            <button type="submit" class="btn primary" :disabled="isLoading">
              <span v-if="!isLoading">สมัครสมาชิก</span>
              <span v-else class="loading">
                <span class="spinner"></span>
                กำลังสมัคร...
              </span>
            </button>
          </form>

          <div class="divider">
            <span>มีบัญชีอยู่แล้ว?</span>
          </div>

          <router-link to="/login" class="btn secondary">
            <span>เข้าสู่ระบบ</span>
          </router-link>
        </div>

        <!-- ✅ Membership Benefits Card -->
        <div class="benefits-card">
          <h2>🏆 ทำไมต้องสมัครสมาชิก?</h2>
          
          <div class="benefits-grid">
            <div class="benefit-item">
              <span class="benefit-icon">💎</span>
              <div class="benefit-text">
                <h4>สะสมคะแนนทุกการใช้บริการ</h4>
                <p>100 บาท = 1 คะแนน</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">🎯</span>
              <div class="benefit-text">
                <h4>ส่วนลดสูงสุด 15%</h4>
                <p>สมาชิก Platinum</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">⭐</span>
              <div class="benefit-text">
                <h4>แลกคะแนนเป็นส่วนลด</h4>
                <p>100 คะแนน = 10 บาท</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">🎁</span>
              <div class="benefit-text">
                <h4>โบนัสวันเกิด</h4>
                <p>รับส่วนลดพิเศษ</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">📅</span>
              <div class="benefit-text">
                <h4>จองคิวล่วงหน้า</h4>
                <p>สะดวก รวดเร็ว</p>
              </div>
            </div>

            <div class="benefit-item">
              <span class="benefit-icon">🔔</span>
              <div class="benefit-text">
                <h4>โปรโมชั่นพิเศษ</h4>
                <p>สำหรับสมาชิกเท่านั้น</p>
              </div>
            </div>
          </div>

          <!-- Tiers Preview -->
          <div class="tiers-preview">
            <h3>ระดับสมาชิก</h3>
            <div class="tiers-row">
              <div class="tier-badge bronze">
                <span class="tier-icon">🥉</span>
                <span class="tier-name">Bronze</span>
              </div>
              <div class="tier-badge silver">
                <span class="tier-icon">🥈</span>
                <span class="tier-name">Silver</span>
                <small>5%</small>
              </div>
              <div class="tier-badge gold">
                <span class="tier-icon">🥇</span>
                <span class="tier-name">Gold</span>
                <small>10%</small>
              </div>
              <div class="tier-badge platinum">
                <span class="tier-icon">💎</span>
                <span class="tier-name">Platinum</span>
                <small>15%</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navigator from '../components/Navigator.vue';

const router = useRouter();

// ========================================
// STATE
// ========================================
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  cust_fname: '',
  cust_lname: '',
  cust_tel: '',
  cust_address: ''
});

const alertMessage = ref('');
const alertType = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const usernameError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// ========================================
// COMPUTED
// ========================================
const alertIcon = computed(() => {
  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠'
  };
  return icons[alertType.value] || '!';
});

// ========================================
// METHODS
// ========================================
const showAlert = (message: string, type: string = 'error') => {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => closeAlert(), 5000);
};

const closeAlert = () => {
  alertMessage.value = '';
  alertType.value = '';
};

const formatPhoneNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 10) {
    value = value.substring(0, 10);
  }
  
  if (value.length > 6) {
    formData.cust_tel = `${value.substring(0, 3)}-${value.substring(3, 6)}-${value.substring(6)}`;
  } else if (value.length > 3) {
    formData.cust_tel = `${value.substring(0, 3)}-${value.substring(3)}`;
  } else {
    formData.cust_tel = value;
  }
};

const validatePhoneNumber = (phone: string) => {
  if (!phone) return false;
  const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  return phoneRegex.test(phone);
};

const checkUsernameLength = () => {
  if (formData.username && formData.username.length < 4) {
    usernameError.value = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร';
  } else {
    usernameError.value = '';
  }
};

const checkPasswordStrength = () => {
  if (formData.password && formData.password.length < 6) {
    passwordError.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
  } else {
    passwordError.value = '';
  }
};

const checkPasswordMatch = () => {
  if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
    confirmPasswordError.value = 'รหัสผ่านไม่ตรงกัน';
  } else {
    confirmPasswordError.value = '';
  }
};

// ========================================
// HANDLE REGISTER
// ========================================
const handleRegister = async () => {
  // Reset errors
  usernameError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';

  // Validation
  if (!formData.username || !formData.password || !formData.confirmPassword || 
      !formData.cust_fname || !formData.cust_lname || !formData.cust_tel) {
    showAlert('กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน', 'warning');
    return;
  }

  if (formData.username.length < 4) {
    usernameError.value = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร';
    showAlert('ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร', 'warning');
    return;
  }

  if (formData.password.length < 6) {
    passwordError.value = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    showAlert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'warning');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    confirmPasswordError.value = 'รหัสผ่านไม่ตรงกัน';
    showAlert('รหัสผ่านไม่ตรงกัน', 'error');
    return;
  }

  if (!validatePhoneNumber(formData.cust_tel)) {
    showAlert('รูปแบบเบอร์โทรไม่ถูกต้อง (ใช้รูปแบบ 081-234-5678)', 'warning');
    return;
  }

  isLoading.value = true;

  try {
    console.log('📤 Sending registration...');

    const res = await axios.post('http://localhost:3000/api/auth/register', {
      username: formData.username,
      password: formData.password,
      cust_fname: formData.cust_fname,
      cust_lname: formData.cust_lname,
      cust_tel: formData.cust_tel,
      cust_address: formData.cust_address || null
    });

    console.log('✅ Register response:', res.data);

    if (res.data.success) {
      // ✅ แสดง Success พร้อม Welcome Bonus
      await Swal.fire({
        title: '🎉 สมัครสมาชิกสำเร็จ!',
        html: `
          <div style="text-align: center; padding: 1.5rem;">
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">
              ยินดีต้อนรับ <strong style="color: #dc2626;">${formData.cust_fname}</strong>
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); 
                        padding: 1.5rem; border-radius: 15px; border: 2px solid rgba(16, 185, 129, 0.4);
                        margin: 1rem 0;">
              <p style="font-size: 1.1rem; color: #10b981; font-weight: 600; margin-bottom: 0.5rem;">
                🎁 Welcome Bonus
              </p>
              <p style="font-size: 2rem; font-weight: 900; color: #fbbf24; text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);">
                +50 Points
              </p>
              <p style="font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-top: 0.5rem;">
                เริ่มต้นเป็นสมาชิก 🥉 Bronze
              </p>
            </div>

            <p style="font-size: 0.95rem; color: rgba(255,255,255,0.8); margin-top: 1rem;">
              กรุณาเข้าสู่ระบบเพื่อเริ่มใช้งาน
            </p>
          </div>
        `,
        icon: 'success',
        iconColor: '#10b981',
        confirmButtonText: 'เข้าสู่ระบบเลย',
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff',
        allowOutsideClick: false
      });

      // Clear form
      Object.keys(formData).forEach(key => {
        formData[key as keyof typeof formData] = '';
      });

      // Redirect to login
      router.push('/login');
    }

  } catch (err: any) {
    console.error('❌ Register error:', err);
    
    if (err.response) {
      const errorMsg = err.response.data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      showAlert(errorMsg, 'error');
      
      if (errorMsg.includes('Username') || errorMsg.includes('ชื่อผู้ใช้')) {
        usernameError.value = errorMsg;
      }
    } else if (err.request) {
      showAlert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ', 'error');
    } else {
      showAlert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
    }
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

.register-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* ========================================
   ALERT
======================================== */
.alert {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
.alert.success {
  border: 2px solid #10b981;
  color: #10b981;
}

.alert.error {
  border: 2px solid #ef4444;
  color: #ef4444;
}

.alert.warning {
  border: 2px solid #f59e0b;
  color: #f59e0b;
}

.alert .icon {
  font-size: 1.5rem;
  font-weight: 700;
}

.alert button {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.alert button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* ========================================
   MAIN
======================================== */
.main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 3rem;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)),
    url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1920') center/cover;
  background-attachment: fixed;
}

.container {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: flex-start;
}

/* ========================================
   CARD
======================================== */
.card {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-header p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ========================================
   WELCOME BONUS NOTICE
======================================== */
.welcome-bonus-notice {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  border: 2px solid rgba(16, 185, 129, 0.4);
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  60% {
    opacity: 1;
    transform: scale(1.05) translateY(0);
  }
  100% {
    transform: scale(1);
  }
}

.welcome-bonus-notice::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, -20px) rotate(45deg); }
}

.bonus-icon {
  font-size: 3rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.6));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.bonus-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.bonus-content h3 {
  font-size: 1.1rem;
  color: #10b981;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.bonus-content p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.3rem;
}

.bonus-content .highlight {
  color: #fbbf24;
  font-weight: 900;
  font-size: 1.2rem;
  text-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
}

.bonus-content small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ========================================
   FORM
======================================== */
form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.field-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.required {
  color: #dc2626;
}

.field input,
.field textarea {
  padding: 0.9rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
  font-family: inherit;
}

.field textarea {
  resize: vertical;
  min-height: 80px;
}

.field input::placeholder,
.field textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.field input:focus,
.field textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.field input:disabled,
.field textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  flex: 1;
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  transition: color 0.3s;
}

.toggle-password:hover:not(:disabled) {
  color: #dc2626;
}

.toggle-password:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.field small {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.field small.error {
  color: #ef4444;
  font-weight: 600;
}

/* ========================================
   BUTTONS
======================================== */
.btn {
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-family: inherit;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn.primary {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: #fff;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.3);
}

.btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.5);
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ========================================
   DIVIDER
======================================== */
.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider::before { left: 0; }
.divider::after { right: 0; }

.divider span {
  background: rgba(30, 30, 30, 0.95);
  padding: 0 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ========================================
   BENEFITS CARD
======================================== */
.benefits-card {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(251, 191, 36, 0.3);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 20px 60px rgba(251, 191, 36, 0.2);
}

.benefits-card h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.benefit-item:hover {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
  transform: translateX(5px);
}

.benefit-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  border-radius: 50%;
  border: 2px solid rgba(251, 191, 36, 0.3);
  flex-shrink: 0;
}

.benefit-text h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.benefit-text p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ========================================
   TIERS PREVIEW
======================================== */
.tiers-preview {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tiers-preview h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
}

.tiers-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.tier-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.3s;
}

.tier-badge.bronze {
  background: rgba(205, 127, 50, 0.15);
  border-color: rgba(205, 127, 50, 0.4);
}

.tier-badge.silver {
  background: rgba(192, 192, 192, 0.15);
  border-color: rgba(192, 192, 192, 0.4);
}

.tier-badge.gold {
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.4);
}

.tier-badge.platinum {
  background: rgba(229, 228, 226, 0.15);
  border-color: rgba(229, 228, 226, 0.4);
}

.tier-badge:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.tier-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.3));
}

.tier-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
}

.tier-badge small {
  font-size: 0.75rem;
  color: #fbbf24;
  font-weight: 700;
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .benefits-card {
    order: -1;
  }
}

@media (max-width: 768px) {
  .main {
    padding: 5rem 1rem 2rem;
  }

  .card,
  .benefits-card {
    padding: 2rem 1.5rem;
  }

  .card-header h1 {
    font-size: 1.8rem;
  }

  .field-group {
    grid-template-columns: 1fr;
  }

  .welcome-bonus-notice {
    flex-direction: column;
    text-align: center;
  }

  .bonus-icon {
    font-size: 2.5rem;
  }

  .benefits-card h2 {
    font-size: 1.5rem;
  }

  .tiers-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .alert {
    min-width: 90%;
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .card,
  .benefits-card {
    padding: 1.5rem 1rem;
  }

  .card-header h1 {
    font-size: 1.5rem;
  }

  .welcome-bonus-notice {
    padding: 1rem;
  }

  .bonus-icon {
    font-size: 2rem;
  }

  .bonus-content h3 {
    font-size: 1rem;
  }

  .bonus-content p {
    font-size: 0.85rem;
  }

  .bonus-content .highlight {
    font-size: 1.1rem;
  }

  .field input,
  .field textarea,
  .btn {
    font-size: 0.95rem;
  }

  .benefits-grid {
    gap: 0.75rem;
  }

  .benefit-item {
    padding: 0.75rem 1rem;
  }

  .benefit-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }

  .benefit-text h4 {
    font-size: 0.9rem;
  }

  .benefit-text p {
    font-size: 0.8rem;
  }

  .tiers-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .tier-badge {
    padding: 0.75rem 0.5rem;
  }

  .tier-icon {
    font-size: 1.5rem;
  }

  .tier-name {
    font-size: 0.75rem;
  }
}
</style>
