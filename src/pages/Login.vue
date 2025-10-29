<!-- src/pages/Login.vue -->
<template>
  <div class="login-page">
    <!-- ✅ เพิ่ม Navigator -->
    <Navigator />

    <!-- Main -->
    <div class="main">
      <div class="container">
        <!-- Login Card -->
        <div class="card">
          <div class="card-header">
            <div class="logo-icon">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 24l4-8h32l4 8M12 24v16h40V24M12 40h4m24 0h4"/>
                <circle cx="20" cy="40" r="4"/>
                <circle cx="44" cy="40" r="4"/>
              </svg>
            </div>
            <h1>เข้าสู่ระบบ</h1>
            <p>กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
          </div>
          
          <form @submit.prevent="handleLogin">
            <div class="field">
              <label>👤 ชื่อผู้ใช้</label>
              <input 
                v-model="formData.username" 
                type="text" 
                placeholder="กรอกชื่อผู้ใช้"
                required
                :disabled="isLoading"
              >
            </div>

            <div class="field">
              <label>🔒 รหัสผ่าน</label>
              <div class="password-field">
                <input 
                  v-model="formData.password" 
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="กรอกรหัสผ่าน"
                  required
                  :disabled="isLoading"
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
            </div>

            <button type="submit" class="btn primary" :disabled="isLoading">
              <span v-if="!isLoading">เข้าสู่ระบบ</span>
              <span v-else class="loading">
                <span class="spinner"></span>
                กำลังเข้าสู่ระบบ...
              </span>
            </button>
          </form>

          <div class="divider">
            <span>ยังไม่มีบัญชี?</span>
          </div>

          <router-link to="/register" class="btn secondary">
            สมัครสมาชิก
          </router-link>

          <div class="back-home">
            <router-link to="/">← กลับหน้าหลัก</router-link>
          </div>
        </div>

        <!-- Info Box -->
        <div class="info-box">
          <h3>💡 สำหรับพนักงาน</h3>
          <p>ใช้ Username และ Password ที่ได้รับจากผู้จัดการ</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navigator from '@/components/Navigator.vue';

const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);

const formData = reactive({
  username: '',
  password: ''
});

const handleLogin = async () => {
  if (!formData.username || !formData.password) {
    Swal.fire({
      title: 'กรุณากรอกข้อมูล',
      text: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน',
      icon: 'warning',
      iconColor: '#f59e0b',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'ตกลง',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post('http://localhost:3000/api/auth/unified-login', {
      username: formData.username,
      password: formData.password
    });

    if (response.data.success) {
      const { userType, user } = response.data;

      if (userType === 'customer') {
        // ✅ บันทึก Customer
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.removeItem('employee');
        localStorage.removeItem('isEmployeeLoggedIn');

        await Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ! 🎉',
          html: `
            <div style="text-align: center; padding: 1rem;">
              <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">ยินดีต้อนรับ</p>
              <p style="font-size: 1.5rem; font-weight: 700; color: #dc2626;">${user.fullName}</p>
            </div>
          `,
          icon: 'success',
          iconColor: '#10b981',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'เริ่มใช้งาน',
          timer: 2000,
          timerProgressBar: true,
          background: 'rgba(30, 30, 30, 0.98)',
          color: '#ffffff'
        });

        // ✅ Notify Navigator
        window.dispatchEvent(new CustomEvent('loginStatusChanged'));
        
        router.push('/');

      } else if (userType === 'employee') {
        // ✅ บันทึก Employee
        localStorage.setItem('employee', JSON.stringify(user));
        localStorage.setItem('isEmployeeLoggedIn', 'true');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');

        await Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ! 👨‍💼',
          html: `
            <div style="text-align: center; padding: 1rem;">
              <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">ยินดีต้อนรับ</p>
              <p style="font-size: 1.5rem; font-weight: 700; color: #dc2626; margin-bottom: 0.5rem;">${user.fullName}</p>
              <p style="color: #fbbf24; font-weight: 600; font-size: 1rem;">ตำแหน่ง: ${user.role}</p>
              <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem;">สาขา: ${user.branchName}</p>
            </div>
          `,
          icon: 'success',
          iconColor: '#10b981',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'ไปหน้า Dashboard',
          timer: 3000,
          timerProgressBar: true,
          background: 'rgba(30, 30, 30, 0.98)',
          color: '#ffffff'
        });

        router.push('/employee/dashboard');
      }
    }

  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    Swal.fire({
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      text: error.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      icon: 'error',
      iconColor: '#ef4444',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'ลองอีกครั้ง',
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

.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* Main */
.main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 2rem;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.9)),
    url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1920') center/cover;
  background-attachment: fixed;
}

.container {
  max-width: 450px;
  width: 100%;
}

/* Card */
.card {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 60px rgba(220, 38, 38, 0.3);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  padding: 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(139, 0, 0, 0.3));
  border: 3px solid rgba(220, 38, 38, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
  color: #dc2626;
  filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.6));
}

.card h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.card-header p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.field input {
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
  font-family: inherit;
}

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field input {
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
  transition: all 0.3s;
}

.toggle-password:hover:not(:disabled) {
  color: #dc2626;
  transform: scale(1.1);
}

.toggle-password:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.field input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.field input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn {
  padding: 1rem 1.5rem;
  border-radius: 12px;
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
  border-color: rgba(220, 38, 38, 0.5);
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
  width: 42%;
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

/* Back Home */
.back-home {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.back-home a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.back-home a:hover {
  color: #dc2626;
}

/* Info Box */
.info-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(220, 38, 38, 0.1);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 15px;
  text-align: center;
}

.info-box h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #dc2626;
}

.info-box p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
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

  .logo-icon {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1.5rem 1rem;
  }

  .card h1 {
    font-size: 1.5rem;
  }

  .logo-icon {
    width: 60px;
    height: 60px;
  }
}
</style>
