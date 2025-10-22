<template>
  <div class="register-page">
    <!-- Custom Alert -->
    <transition name="fade">
      <div v-if="alertMessage" class="custom-alert" :class="alertType">
        <div class="alert-content">
          <div class="alert-icon">
            <span v-if="alertType === 'success'">✓</span>
            <span v-else-if="alertType === 'error'">✕</span>
            <span v-else>⚠</span>
          </div>
          <div class="alert-message">{{ alertMessage }}</div>
          <button class="alert-close" @click="closeAlert">×</button>
        </div>
      </div>
    </transition>

    <!-- Navigator Component -->
    <Navigator />

    <!-- Background with car wash image -->
    <div class="page-content">
      <!-- Register Form Modal -->
      <div class="register-modal">
        <h2 class="modal-title">Register / สมัครใช้งาน</h2>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label>USERNAME</label>
            <input 
              v-model="formData.username" 
              type="text" 
              placeholder="กรอก Username"
              required
              :disabled="isLoading"
            >
          </div>

          <div class="form-group">
            <label>PASSWORD</label>
            <input 
              v-model="formData.password" 
              type="password" 
              placeholder="กรอก Password"
              required
              :disabled="isLoading"
            >
          </div>

          <div class="form-group">
            <label>CONFIRM PASSWORD</label>
            <input 
              v-model="formData.confirmPassword" 
              type="password" 
              placeholder="ยืนยัน Password อีกครั้ง"
              required
              :disabled="isLoading"
            >
          </div>

          <button type="submit" class="confirm-btn" :disabled="isLoading">
            <span v-if="isLoading">กำลังสมัคร...</span>
            <span v-else>CONFIRM</span>
          </button>
        </form>

        <div class="login-link">
          <router-link to="/login">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</router-link>
        </div>
      </div>

      <!-- Bottom Text -->
      <div class="bottom-text">
        <h3>CYBERCAR ศูนย์มาตราฐานทำความสะอาดรถยนต์</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navigator from '../components/Navigator.vue'

const router = useRouter()

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const alertMessage = ref('')
const alertType = ref('') // 'success', 'error', 'warning'
const isLoading = ref(false)

// ฟังก์ชันแสดง Alert
const showAlert = (message: string, type: string = 'error') => {
  alertMessage.value = message
  alertType.value = type
  
  // ปิด Alert อัตโนมัติหลัง 4 วินาที
  setTimeout(() => {
    closeAlert()
  }, 4000)
}

// ฟังก์ชันปิด Alert
const closeAlert = () => {
  alertMessage.value = ''
  alertType.value = ''
}

const handleRegister = async () => {
  // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
  if (!formData.username || !formData.password || !formData.confirmPassword) {
    showAlert('กรุณากรอกข้อมูลให้ครบถ้วน!', 'warning')
    return
  }

  // ตรวจสอบความยาว username
  if (formData.username.length < 4) {
    showAlert('Username ต้องมีอย่างน้อย 4 ตัวอักษร', 'warning')
    return
  }

  // ตรวจสอบความยาว password
  if (formData.password.length < 6) {
    showAlert('Password ต้องมีอย่างน้อย 6 ตัวอักษร', 'warning')
    return
  }

  // ตรวจสอบว่ารหัสผ่านตรงกันหรือไม่
  if (formData.password !== formData.confirmPassword) {
    showAlert('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง!', 'error')
    return
  }

  isLoading.value = true

  try {
    console.log('📝 Attempting register...')
    console.log('Username:', formData.username)

    // ส่งข้อมูลไป Backend
    const res = await axios.post('http://localhost:3000/api/auth/register', {
      username: formData.username,
      password: formData.password
    })

    // แสดงข้อความสำเร็จ
    showAlert(res.data.message || 'สมัครสมาชิกสำเร็จ!', 'success')
    console.log('✅ Register success:', res.data)

    // เคลียร์ฟอร์ม
    formData.username = ''
    formData.password = ''
    formData.confirmPassword = ''

    // ไปหน้า Login หลัง 2 วินาที
    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (err: any) {
    console.error('❌ Error:', err)
    
    if (err.response) {
      // มี error message จาก backend
      console.error('Error response:', err.response.data)
      showAlert(err.response.data.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก!', 'error')
    } else if (err.request) {
      // ไม่สามารถเชื่อมต่อ backend ได้
      console.error('No response from server')
      showAlert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า Backend รันอยู่หรือไม่', 'error')
    } else {
      console.error('Error:', err.message)
      showAlert('เกิดข้อผิดพลาดที่ไม่คาดคิด', 'error')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), 
              url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1920') center/cover no-repeat;
  color: white;
  font-family: 'Rajdhani', 'Sarabun', sans-serif;
  position: relative;
}

/* Custom Alert Styles */
.custom-alert {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 400px;
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: slideDown 0.3s ease-out;
}

.custom-alert.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.custom-alert.error {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.custom-alert.warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.alert-content {
  display: flex;
  align-items: center;
  padding: 1.2rem 1.5rem;
  gap: 1rem;
}

.alert-icon {
  font-size: 1.8rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-message {
  flex: 1;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
}

.alert-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;
  line-height: 1;
  padding: 0;
}

.alert-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Alert Animation */
@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Page Content */
.page-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6rem 2rem 3rem;
  position: relative;
  z-index: 1;
}

/* Register Modal */
.register-modal {
  background: rgba(70, 60, 60, 0.85);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  padding: 2.5rem 3.5rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
}

.modal-title {
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 2rem;
  color: white;
  font-weight: 500;
  letter-spacing: 1px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-left: 0.2rem;
}

.form-group input {
  background: rgba(90, 80, 80, 0.7);
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.3rem;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group input:focus {
  outline: none;
  background: rgba(90, 80, 80, 0.85);
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.3);
}

.confirm-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s;
  text-transform: uppercase;
}

.confirm-btn:hover:not(:disabled) {
  background: white;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Login Link */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.login-link a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
  font-weight: 400;
}

.login-link a:hover {
  color: #dc2626;
}

/* Bottom Text */
.bottom-text {
  position: absolute;
  bottom: 2rem;
  text-align: center;
}

.bottom-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-alert {
    min-width: 90%;
    max-width: 90%;
  }
  
  .register-modal {
    padding: 2rem 1.5rem;
  }
  
  .modal-title {
    font-size: 1.4rem;
  }
  
  .bottom-text h3 {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
}
</style>