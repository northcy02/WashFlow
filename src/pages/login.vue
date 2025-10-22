<template>
  <div class="login-page">
    <!-- Alert Message -->
    <transition name="slide-down">
      <div v-if="alertMessage" :class="['alert', `alert-${alertType}`]">
        <div class="alert-content">
          <span class="alert-icon">
            {{ alertType === 'success' ? '✓' : alertType === 'warning' ? '⚠' : '✕' }}
          </span>
          <span class="alert-text">{{ alertMessage }}</span>
          <button @click="closeAlert" class="alert-close">×</button>
        </div>
      </div>
    </transition>

    <!-- Navigator Component -->
    <Navigator />

    <!-- Background with car wash image -->
    <div class="page-content">
      <!-- Login Form Modal -->
      <div class="login-modal">
        <h2 class="modal-title">LOGIN / เข้าสู่ระบบ</h2>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>USERNAME</label>
            <input 
              v-model="formData.username" 
              type="text" 
              placeholder=""
              required
              :disabled="isLoading"
            >
          </div>

          <div class="form-group">
            <label>PASSWORD</label>
            <input 
              v-model="formData.password" 
              type="password" 
              placeholder=""
              required
              :disabled="isLoading"
            >
          </div>

          <button 
            type="submit" 
            class="login-submit-btn"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">LOGIN</span>
            <span v-else class="loading-spinner">⌛ กำลังเข้าสู่ระบบ...</span>
          </button>
        </form>

        <div class="register-link">
          <router-link to="/register">register / สมัครการใช้งาน</router-link>
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
import Navigator from '@/components/Navigator.vue'

const router = useRouter()

const formData = reactive({
  username: '',
  password: ''
})

const alertMessage = ref('')
const alertType = ref('')
const isLoading = ref(false)

const showAlert = (message: string, type: string = 'error') => {
  alertMessage.value = message
  alertType.value = type
  
  // Auto close after 4 seconds
  setTimeout(() => {
    closeAlert()
  }, 4000)
}

const closeAlert = () => {
  alertMessage.value = ''
  alertType.value = ''
}

const handleLogin = async () => {
  // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
  if (!formData.username || !formData.password) {
    showAlert('กรุณากรอกข้อมูลให้ครบถ้วน!', 'warning')
    return
  }

  isLoading.value = true

  try {
    console.log('🔐 Attempting login...')
    console.log('Username:', formData.username)

    // เรียก API Login
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      username: formData.username,
      password: formData.password
    })

    console.log('✅ Login response:', res.data)

    // แสดงข้อความสำเร็จ
    showAlert('เข้าสู่ระบบสำเร็จ!', 'success')

    // บันทึกข้อมูล user ลง localStorage
    localStorage.setItem('user', JSON.stringify(res.data.user))
    localStorage.setItem('isLoggedIn', 'true')

    // เคลียร์ฟอร์ม
    formData.username = ''
    formData.password = ''

    // รอ 1.5 วินาทีแล้วไปหน้า Home
    setTimeout(() => {
      router.push('/')
    }, 1500)

  } catch (err: any) {
    console.error('❌ Login error:', err)
    
    if (err.response) {
      // Backend ตอบกลับมาพร้อม error
      console.error('Error response:', err.response.data)
      showAlert(err.response.data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ!', 'error')
    } else if (err.request) {
      // ไม่ได้รับการตอบกลับจาก Backend
      console.error('No response from server')
      showAlert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า Backend รันอยู่หรือไม่', 'error')
    } else {
      // Error อื่นๆ
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

.login-page {
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), 
              url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1920') center/cover no-repeat;
  color: white;
  font-family: 'Rajdhani', 'Sarabun', sans-serif;
  position: relative;
}

/* Alert Styles */
.alert {
  position: fixed;
  top: 6rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 400px;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: shake 0.5s;
}

.alert-content {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem;
}

.alert-icon {
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.alert-text {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.8rem;
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

.alert-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.alert-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.alert-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.alert-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

/* Alert Animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

@keyframes shake {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-50%) translateY(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(-50%) translateY(5px); }
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

/* Login Modal */
.login-modal {
  background: rgba(60, 50, 50, 0.88);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 2.5rem 3.5rem;
  width: 100%;
  max-width: 500px;
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

.login-form {
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
  background: rgba(120, 110, 110, 0.6);
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
  color: rgba(255, 255, 255, 0.3);
}

.form-group input:focus {
  outline: none;
  background: rgba(120, 110, 110, 0.75);
}

.login-submit-btn {
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

.login-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-submit-btn:not(:disabled):hover {
  background: white;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
}

.loading-spinner {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.register-link a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
  font-weight: 400;
}

.register-link a:hover {
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
  .alert {
    min-width: 90%;
    max-width: 90%;
  }

  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.8rem;
  }
  
  .login-modal {
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