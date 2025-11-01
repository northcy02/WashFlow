<!-- src/pages/register.vue -->
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
          <h1>สมัครสมาชิก</h1>
          
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
            <span>หรือ</span>
          </div>

          <router-link to="/login" class="btn secondary">
            <span>เข้าสู่ระบบ</span>
          </router-link>
        </div>

        <!-- Brand -->
        <div class="brand">
          <h2>CYBERCAR</h2>
          <p>ศูนย์มาตราฐานทำความสะอาดรถยนต์</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navigator from '../components/Navigator.vue';

const router = useRouter();

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

// Error messages
const usernameError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

const alertIcon = computed(() => {
  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠'
  };
  return icons[alertType.value] || '!';
});

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
  let value = input.value.replace(/\D/g, ''); // เอาเฉพาะตัวเลข
  
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
  if (!phone) return true; // ไม่บังคับ
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

const handleRegister = async () => {
  // Reset errors
  usernameError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';

  // Validation
  if (!formData.username || !formData.password || !formData.confirmPassword || 
      !formData.cust_fname || !formData.cust_lname) {
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

  // Validate phone if provided
  if (formData.cust_tel && !validatePhoneNumber(formData.cust_tel)) {
    showAlert('รูปแบบเบอร์โทรไม่ถูกต้อง (ใช้รูปแบบ 081-234-5678)', 'warning');
    return;
  }

  isLoading.value = true;

  try {
    console.log('📤 Sending registration data:', {
      username: formData.username,
      cust_fname: formData.cust_fname,
      cust_lname: formData.cust_lname,
      cust_tel: formData.cust_tel,
      cust_address: formData.cust_address
    });

    const res = await axios.post('http://localhost:3000/api/auth/register', {
      username: formData.username,
      password: formData.password,
      cust_fname: formData.cust_fname,
      cust_lname: formData.cust_lname,
      cust_tel: formData.cust_tel || null,
      cust_address: formData.cust_address || null
    });

    console.log('✅ Register response:', res.data);

    showAlert(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${formData.cust_fname}`, 'success');

    // Clear form
    Object.keys(formData).forEach(key => {
      formData[key as keyof typeof formData] = '';
    });

    // Redirect to login
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (err: any) {
    console.error('❌ Register error:', err);
    
    if (err.response) {
      const errorMsg = err.response.data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก';
      showAlert(errorMsg, 'error');
      
      if (errorMsg.includes('Username')) {
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

/* Alert */
.alert {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
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

/* Main */
.main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 2rem;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)),
    url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1920') center/cover;
  background-attachment: fixed;
}

.container {
  max-width: 550px;
  width: 100%;
}

/* Card */
.card {
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.card h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #dc2626;
}

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
  padding: 0.9rem 0.7rem;
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
}

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
  background: #dc2626;
  color: #fff;
}

.btn.primary:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
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

/* Divider */
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
  background: rgba(30, 30, 30, 0.9);
  padding: 0 1rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Brand */
.brand {
  margin-top: 2rem;
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.brand h2 {
  font-size: 1.5rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

.brand p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .main {
    padding: 5rem 1rem 2rem;
  }

  .card {
    padding: 2rem 1.5rem;
  }

  .card h1 {
    font-size: 1.8rem;
  }

  .field-group {
    grid-template-columns: 1fr;
  }

  .alert {
    min-width: 90%;
    max-width: 90%;
  }

  .brand h2 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1.5rem 1rem;
  }

  .card h1 {
    font-size: 1.5rem;
  }

  .field input,
  .field textarea,
  .btn {
    font-size: 0.95rem;
  }
}
</style>