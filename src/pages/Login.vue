<!-- src/pages/Login.vue - ENHANCED VERSION -->
<template>
  <div class="login-page">
    <Navigator />

    <!-- Animated Background -->
    <div class="animated-background">
      <div class="particle" v-for="i in 50" :key="i" :style="getParticleStyle(i)"></div>
    </div>

    <!-- Main Content -->
    <div class="main">
      <div class="container">
        <!-- Left Side - Branding -->
        <div class="branding-section">
          <div class="brand-logo-large">
            <div class="logo-circle">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 24l4-8h32l4 8M12 24v16h40V24M12 40h4m24 0h4"/>
                <circle cx="20" cy="40" r="4"/>
                <circle cx="44" cy="40" r="4"/>
              </svg>
            </div>
          </div>

          <h1 class="brand-title">WASHFLOW</h1>
          <p class="brand-tagline">Car Wash Pro System</p>

          <div class="brand-features">
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <span>บริการล้างรถมาตรฐานสูง</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🚀</span>
              <span>จองออนไลน์ รวดเร็ว สะดวก</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💎</span>
              <span>สะสมคะแนน รับส่วนลด</span>
            </div>
          </div>

          <div class="stats-preview">
            <div class="stat">
              <h3>10,000+</h3>
              <p>ลูกค้าพึงพอใจ</p>
            </div>
            <div class="stat">
              <h3>4.9/5</h3>
              <p>คะแนนรีวิว</p>
            </div>
            <div class="stat">
              <h3>5+</h3>
              <p>บริการหลัก</p>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="login-section">
          <div class="card">
            <div class="card-glow"></div>

            <div class="card-header">
              <div class="header-icon">
                <span class="icon-emoji">🔐</span>
              </div>
              <h2>เข้าสู่ระบบ</h2>
              <p>ยินดีต้อนรับกลับ!</p>
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin">
              <!-- Username Field -->
              <div class="form-group">
                <label class="floating-label" :class="{ active: formData.username }">
                  <span class="label-icon">👤</span>
                  <span class="label-text">Username</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    v-model="formData.username" 
                    type="text" 
                    class="form-input"
                    @focus="focusField('username')"
                    @blur="blurField('username')"
                    :class="{ 
                      focused: focusedField === 'username',
                      error: errors.username 
                    }"
                    required
                    :disabled="isLoading"
                    autocomplete="username"
                  >
                  <div class="input-border"></div>
                </div>
                <transition name="error-slide">
                  <p v-if="errors.username" class="error-message">{{ errors.username }}</p>
                </transition>
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <label class="floating-label" :class="{ active: formData.password }">
                  <span class="label-icon">🔒</span>
                  <span class="label-text">Password</span>
                </label>
                <div class="input-wrapper password-wrapper">
                  <input 
                    v-model="formData.password" 
                    :type="showPassword ? 'text' : 'password'"
                    class="form-input"
                    @focus="focusField('password')"
                    @blur="blurField('password')"
                    :class="{ 
                      focused: focusedField === 'password',
                      error: errors.password 
                    }"
                    required
                    :disabled="isLoading"
                    autocomplete="current-password"
                  >
                  <button 
                    type="button" 
                    class="toggle-password"
                    @click="showPassword = !showPassword"
                    :disabled="isLoading"
                    tabindex="-1"
                  >
                    <span v-if="!showPassword">👁️</span>
                    <span v-else>👁️‍🗨️</span>
                  </button>
                  <div class="input-border"></div>
                </div>
                <transition name="error-slide">
                  <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
                </transition>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="form-options">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="rememberMe"
                    :disabled="isLoading"
                  >
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">จดจำฉันไว้</span>
                </label>

                <a href="#" @click.prevent="handleForgotPassword" class="forgot-link">
                  ลืมรหัสผ่าน?
                </a>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn-submit" :disabled="isLoading">
                <span v-if="!isLoading" class="btn-content">
                  <span class="btn-icon">🚀</span>
                  <span class="btn-text">เข้าสู่ระบบ</span>
                </span>
                <span v-else class="loading">
                  <span class="spinner"></span>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </span>
                <span class="btn-ripple"></span>
              </button>
            </form>

            <!-- Divider -->
            <div class="divider">
              <span>หรือ</span>
            </div>

            <!-- Register Link -->
            <router-link to="/register" class="btn-register">
              <span class="btn-icon">✨</span>
              <span>สมัครสมาชิกใหม่</span>
              <span class="btn-arrow">→</span>
            </router-link>

            <!-- Back Home -->
            <div class="back-home">
              <router-link to="/">
                <span class="icon">←</span>
                <span>กลับหน้าหลัก</span>
              </router-link>
            </div>
          </div>

          <!-- Info Box -->
          <div class="info-box">
            <div class="info-header">
              <span class="info-icon">💡</span>
              <h3>สำหรับพนักงาน</h3>
            </div>
            <p>ใช้ Username และ Password ที่ได้รับจากผู้จัดการ</p>
            <div class="info-highlight">
              <p>ตัวอย่าง: <code>manager1 / manager123</code></p>
            </div>
          </div>

          <!-- Quick Access (Demo) -->
          <div class="quick-access">
            <p class="quick-title">🎯 ทดสอบระบบ (Demo)</p>
            <div class="demo-accounts">
              <button 
                class="demo-btn" 
                @click="quickLogin('testuser', 'test1234')"
                :disabled="isLoading"
              >
                <span>👤 ลูกค้า (testuser)</span>
              </button>
              <button 
                class="demo-btn" 
                @click="quickLogin('manager1', 'manager123')"
                :disabled="isLoading"
              >
                <span>👨‍💼 Manager</span>
              </button>
            </div>
          </div>
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
const rememberMe = ref(false);
const focusedField = ref('');

const formData = reactive({
  username: '',
  password: ''
});

const errors = reactive({
  username: '',
  password: ''
});

// Methods
const getParticleStyle = (index: number) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${15 + Math.random() * 10}s`
  };
};

const focusField = (field: string) => {
  focusedField.value = field;
  errors[field as keyof typeof errors] = '';
};

const blurField = (field: string) => {
  focusedField.value = '';
};

const validateForm = () => {
  let isValid = true;

  if (!formData.username) {
    errors.username = 'กรุณากรอกชื่อผู้ใช้';
    isValid = false;
  } else if (formData.username.length < 4) {
    errors.username = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร';
    isValid = false;
  }

  if (!formData.password) {
    errors.password = 'กรุณากรอกรหัสผ่าน';
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  // Reset errors
  errors.username = '';
  errors.password = '';

  if (!validateForm()) {
    Swal.fire({
      title: 'ข้อมูลไม่ครบถ้วน',
      text: 'กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง',
      icon: 'warning',
      iconColor: '#f59e0b',
      confirmButtonColor: '#dc2626',
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
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.removeItem('employee');
        localStorage.removeItem('isEmployeeLoggedIn');

        if (rememberMe.value) {
          localStorage.setItem('remembered', 'true');
        }

        await Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ! 🎉',
          html: `
            <div class="swal-success-content">
              <div class="success-animation">
                <div class="checkmark-circle">
                  <div class="checkmark"></div>
                </div>
              </div>
              <p class="welcome-text">ยินดีต้อนรับกลับ</p>
              <h3 class="user-name">${user.fullName}</h3>
              <div class="user-info-grid">
                <div class="info-pill">
                  <span class="pill-icon">💎</span>
                  <span class="pill-text">${user.availablePoints || 0} Points</span>
                </div>
              </div>
            </div>
          `,
          icon: 'success',
          iconColor: '#10b981',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'เริ่มใช้งาน',
          timer: 3000,
          timerProgressBar: true,
          background: 'rgba(30, 30, 30, 0.98)',
          color: '#ffffff',
          customClass: { popup: 'success-popup' }
        });

        window.dispatchEvent(new CustomEvent('loginStatusChanged'));
        router.push('/');

      } else if (userType === 'employee') {
        localStorage.setItem('employee', JSON.stringify(user));
        localStorage.setItem('isEmployeeLoggedIn', 'true');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');

        await Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ! 👨‍💼',
          html: `
            <div class="swal-success-content">
              <div class="success-animation">
                <div class="checkmark-circle employee">
                  <div class="checkmark"></div>
                </div>
              </div>
              <p class="welcome-text">ยินดีต้อนรับ</p>
              <h3 class="user-name">${user.fullName}</h3>
              <div class="user-info-grid">
                <div class="info-pill role">
                  <span class="pill-icon">👨‍💼</span>
                  <span class="pill-text">${user.role}</span>
                </div>
                <div class="info-pill branch">
                  <span class="pill-icon">🏢</span>
                  <span class="pill-text">${user.branchName}</span>
                </div>
              </div>
            </div>
          `,
          icon: 'success',
          iconColor: '#10b981',
          confirmButtonColor: '#dc2626',
          confirmButtonText: 'ไป Dashboard',
          timer: 3500,
          timerProgressBar: true,
          background: 'rgba(30, 30, 30, 0.98)',
          color: '#ffffff',
          customClass: { popup: 'success-popup' }
        });

        router.push('/employee/dashboard');
      }
    }

  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    const errorMessage = error.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    
    if (errorMessage.includes('username') || errorMessage.includes('ชื่อผู้ใช้')) {
      errors.username = errorMessage;
    } else if (errorMessage.includes('password') || errorMessage.includes('รหัสผ่าน')) {
      errors.password = errorMessage;
    }
    
    Swal.fire({
      title: 'เข้าสู่ระบบไม่สำเร็จ',
      text: errorMessage,
      icon: 'error',
      iconColor: '#ef4444',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'ลองอีกครั้ง',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff',
      customClass: { popup: 'error-popup' }
    });
  } finally {
    isLoading.value = false;
  }
};

const handleForgotPassword = () => {
  Swal.fire({
    title: '🔑 ลืมรหัสผ่าน?',
    html: `
      <div style="text-align: left; padding: 1.5rem;">
        <p style="margin-bottom: 1rem; color: rgba(255,255,255,0.8);">
          กรุณาติดต่อฝ่ายสนับสนุน:
        </p>
        <div style="background: rgba(220, 38, 38, 0.1); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(220, 38, 38, 0.3);">
          <p style="margin-bottom: 0.75rem; color: #fbbf24;">
            📞 โทร: <strong>02-XXX-XXXX</strong>
          </p>
          <p style="margin-bottom: 0.75rem; color: #3b82f6;">
            💬 Line: <strong>@washflow</strong>
          </p>
          <p style="color: #10b981;">
            ✉️ Email: <strong>support@washflow.com</strong>
          </p>
        </div>
      </div>
    `,
    icon: 'info',
    iconColor: '#3b82f6',
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'ตกลง',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    width: '600px'
  });
};

const quickLogin = (username: string, password: string) => {
  formData.username = username;
  formData.password = password;
  handleLogin();
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
  background: #000;
  color: #fff;
  position: relative;
  overflow: hidden;
}

/* ========================================
   ANIMATED BACKGROUND
======================================== */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
  z-index: 0;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(220, 38, 38, 0.4);
  border-radius: 50%;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(50px);
    opacity: 0;
  }
}

/* ========================================
   MAIN LAYOUT
======================================== */
.main {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7rem 2rem 3rem;
  position: relative;
  z-index: 1;
}

.container {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

/* ========================================
   BRANDING SECTION
======================================== */
.branding-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: brandSlideIn 0.8s ease-out;
}

@keyframes brandSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.brand-logo-large {
  margin-bottom: 2rem;
}

.logo-circle {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(139, 0, 0, 0.5));
  border: 4px solid rgba(220, 38, 38, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  box-shadow: 
    0 20px 60px rgba(220, 38, 38, 0.5),
    inset 0 0 60px rgba(220, 38, 38, 0.2);
  animation: logoFloat 4s ease-in-out infinite;
  position: relative;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.logo-circle::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(45deg, #dc2626, #fbbf24, #10b981, #3b82f6);
  opacity: 0;
  animation: logoBorderGlow 3s ease-in-out infinite;
  z-index: -1;
}

@keyframes logoBorderGlow {
  0%, 100% { opacity: 0; transform: rotate(0deg); }
  50% { opacity: 0.8; transform: rotate(180deg); }
}

.logo-circle svg {
  width: 100%;
  height: 100%;
  color: #dc2626;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.8));
}

.brand-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 3px;
  animation: titlePulse 3s ease-in-out infinite;
}

@keyframes titlePulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.02); filter: brightness(1.2); }
}

.brand-tagline {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3rem;
  font-weight: 400;
  letter-spacing: 2px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
  width: 100%;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  border-left: 4px solid #dc2626;
  transition: all 0.3s;
  animation: featureSlideIn 0.6s ease-out both;
}

@keyframes featureSlideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.feature-item:nth-child(1) { animation-delay: 0.2s; }
.feature-item:nth-child(2) { animation-delay: 0.4s; }
.feature-item:nth-child(3) { animation-delay: 0.6s; }

.feature-item:hover {
  background: rgba(220, 38, 38, 0.1);
  border-left-color: #fbbf24;
  transform: translateX(10px);
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.3);
}

.feature-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.6));
}

.stats-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  padding: 2rem 0;
}

.stat {
  text-align: center;
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  transition: all 0.3s;
}

.stat:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-5px);
}

.stat h3 {
  font-size: 2rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.stat p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ========================================
   LOGIN SECTION
======================================== */
.login-section {
  animation: cardSlideIn 0.8s ease-out;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.card {
  background: rgba(30, 30, 30, 0.98);
  backdrop-filter: blur(30px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 3rem 2.5rem;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 60%);
  animation: cardGlowRotate 10s linear infinite;
  pointer-events: none;
}

@keyframes cardGlowRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header-icon {
  width: 90px;
  height: 90px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(139, 0, 0, 0.3));
  border: 3px solid rgba(220, 38, 38, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4);
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 15px 50px rgba(220, 38, 38, 0.6); }
}

.icon-emoji {
  font-size: 3rem;
  filter: drop-shadow(0 0 15px rgba(220, 38, 38, 0.6));
}

.card-header h2 {
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-header p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
}

/* ========================================
   FORM STYLING
======================================== */
form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-group {
  position: relative;
}

.floating-label {
  position: absolute;
  top: -10px;
  left: 15px;
  background: linear-gradient(to bottom, rgba(30, 30, 30, 0.98), rgba(30, 30, 30, 0.98));
  padding: 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  z-index: 10;
}

.floating-label.active {
  color: #dc2626;
}

.label-icon {
  font-size: 1rem;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  color: #fff;
  font-size: 1.05rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input::placeholder {
  color: transparent;
}

.form-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(220, 38, 38, 0.5);
}

.form-input.focused {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #dc2626, #fbbf24);
  border-radius: 2px;
  transition: width 0.4s;
}

.form-input:focus + .input-border {
  width: 100%;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1.3rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.3s;
  z-index: 10;
}

.toggle-password:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
  transform: translateY(-50%) scale(1.1);
}

.toggle-password:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

/* Error Message */
.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message::before {
  content: '⚠️';
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s;
}

.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ========================================
   FORM OPTIONS
======================================== */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
}

.checkbox-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
  position: relative;
}

.checkbox-label input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border-color: #dc2626;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 900;
}

.checkbox-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  user-select: none;
}

.forgot-link {
  font-size: 0.9rem;
  color: #dc2626;
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 600;
}

.forgot-link:hover {
  color: #fbbf24;
  text-decoration: underline;
}

/* ========================================
   BUTTONS
======================================== */
.btn-submit {
  position: relative;
  width: 100%;
  padding: 1.3rem 2rem;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border: none;
  border-radius: 50px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s;
  font-family: inherit;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4);
}

.btn-submit::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-submit:hover:not(:disabled)::before {
  width: 500px;
  height: 500px;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(220, 38, 38, 0.6);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.btn-icon {
  font-size: 1.3rem;
  transition: transform 0.3s;
}

.btn-submit:hover:not(:disabled) .btn-icon {
  transform: scale(1.2) rotate(20deg);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
}

.spinner {
  width: 18px;
  height: 18px;
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
  margin: 2rem 0 1.5rem;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.divider::before { left: 0; }
.divider::after { right: 0; }

.divider span {
  background: rgba(30, 30, 30, 0.98);
  padding: 0 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

/* ========================================
   REGISTER BUTTON
======================================== */
.btn-register {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  padding: 1.2rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.4s;
  position: relative;
  overflow: hidden;
}

.btn-register::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.btn-register:hover::before {
  left: 100%;
}

.btn-register:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.1);
}

.btn-arrow {
  transition: transform 0.3s;
}

.btn-register:hover .btn-arrow {
  transform: translateX(5px);
}

/* ========================================
   BACK HOME
======================================== */
.back-home {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.back-home a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s;
  padding: 0.5rem 1rem;
  border-radius: 25px;
}

.back-home a:hover {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

.back-home .icon {
  transition: transform 0.3s;
}

.back-home a:hover .icon {
  transform: translateX(-5px);
}

/* ========================================
   INFO BOX
======================================== */
.info-box {
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(139, 0, 0, 0.15));
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6));
}

.info-box h3 {
  font-size: 1.2rem;
  color: #fbbf24;
  font-weight: 700;
}

.info-box p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.info-highlight {
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-highlight code {
  color: #10b981;
  font-weight: 700;
  font-size: 1rem;
    font-family: 'Courier New', monospace;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
}

/* ========================================
   QUICK ACCESS SECTION
======================================== */
.quick-access {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(59, 130, 246, 0.08);
  border: 2px dashed rgba(59, 130, 246, 0.3);
  border-radius: 20px;
  text-align: center;
  animation: quickAccessPulse 3s ease-in-out infinite;
}

@keyframes quickAccessPulse {
  0%, 100% { border-color: rgba(59, 130, 246, 0.3); }
  50% { border-color: rgba(59, 130, 246, 0.6); }
}

.quick-title {
  font-size: 1rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.demo-accounts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.demo-btn {
  padding: 1rem 1.5rem;
  background: rgba(59, 130, 246, 0.15);
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  color: #3b82f6;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.demo-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.demo-btn:hover:not(:disabled)::before {
  width: 300px;
  height: 300px;
}

.demo-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.25);
  border-color: #3b82f6;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.demo-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demo-btn span {
  position: relative;
  z-index: 1;
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
    gap: 3rem;
    max-width: 500px;
  }

  .branding-section {
    margin-bottom: 2rem;
  }

  .brand-title {
    font-size: 3rem;
  }

  .logo-circle {
    width: 150px;
    height: 150px;
  }

  .stats-preview {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .main {
    padding: 5rem 1rem 2rem;
  }

  .card {
    padding: 2.5rem 2rem;
  }

  .card-header h2 {
    font-size: 2rem;
  }

  .header-icon {
    width: 75px;
    height: 75px;
  }

  .icon-emoji {
    font-size: 2.5rem;
  }

  .brand-title {
    font-size: 2.5rem;
  }

  .brand-tagline {
    font-size: 1.1rem;
  }

  .logo-circle {
    width: 130px;
    height: 130px;
  }

  .brand-features {
    gap: 1rem;
  }

  .feature-item {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .feature-icon {
    font-size: 1.5rem;
  }

  .stats-preview {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat {
    padding: 1rem 0.75rem;
  }

  .stat h3 {
    font-size: 1.5rem;
  }

  .stat p {
    font-size: 0.8rem;
  }

  .form-input {
    padding: 1.1rem 1.3rem;
    font-size: 1rem;
  }

  .demo-accounts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 4rem 1rem 2rem;
  }

  .card {
    padding: 2rem 1.5rem;
  }

  .card-header h2 {
    font-size: 1.8rem;
  }

  .header-icon {
    width: 70px;
    height: 70px;
  }

  .icon-emoji {
    font-size: 2rem;
  }

  .brand-title {
    font-size: 2rem;
  }

  .brand-tagline {
    font-size: 1rem;
  }

  .logo-circle {
    width: 110px;
    height: 110px;
    padding: 2rem;
  }

  .feature-item {
    font-size: 0.85rem;
  }

  .stats-preview {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-group {
    gap: 1.5rem;
  }

  .form-input {
    padding: 1rem 1.2rem;
    font-size: 0.95rem;
  }

  .btn-submit {
    padding: 1.2rem 1.5rem;
    font-size: 1rem;
  }

  .info-box {
    padding: 1.5rem;
  }

  .info-box h3 {
    font-size: 1.1rem;
  }

  .quick-access {
    padding: 1.5rem;
  }
}

/* ========================================
   ACCESSIBILITY
======================================== */
.form-input:focus-visible,
.btn-submit:focus-visible,
.btn-register:focus-visible,
.demo-btn:focus-visible {
  outline: 3px solid #dc2626;
  outline-offset: 4px;
}

.toggle-password:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
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

  .particle,
  .card-glow,
  .logo-circle::before {
    animation: none !important;
  }
}

/* ========================================
   HIGH CONTRAST MODE
======================================== */
@media (prefers-contrast: high) {
  .card,
  .info-box,
  .quick-access {
    border-width: 3px;
  }

  .form-input,
  .btn-submit,
  .btn-register {
    border-width: 3px;
  }
}

/* ========================================
   PRINT STYLES
======================================== */
@media print {
  .animated-background,
  .branding-section,
  .card-glow,
  .header-icon,
  .btn-submit,
  .btn-register,
  .quick-access,
  .info-box {
    display: none !important;
  }

  .card {
    border: 2px solid #000;
    box-shadow: none;
  }
}

/* ========================================
   SAFE AREA INSETS
======================================== */
@supports (padding: max(0px)) {
  .login-page {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}

/* ========================================
   CUSTOM SCROLLBAR
======================================== */
.login-page::-webkit-scrollbar {
  width: 10px;
}

.login-page::-webkit-scrollbar-track {
  background: #0a0a0a;
}

.login-page::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #dc2626, #991b1b);
  border-radius: 10px;
  border: 2px solid #0a0a0a;
}

.login-page::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #b91c1c, #7f1d1d);
}

/* ========================================
   PERFORMANCE OPTIMIZATIONS
======================================== */
.card,
.branding-section,
.service-icon {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-glow,
.particle {
  will-change: transform, opacity;
}

/* ========================================
   SMOOTH SCROLL
======================================== */
html {
  scroll-behavior: smooth;
}

/* ========================================
   ANTI-ALIASING
======================================== */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style>
/* ========================================
   GLOBAL SWAL STYLES (Unscoped)
======================================== */

/* Success Popup */
.success-popup {
  border: 2px solid rgba(16, 185, 129, 0.5) !important;
  border-radius: 30px !important;
}

.swal-success-content {
  padding: 1.5rem;
  text-align: center;
}

.success-animation {
  margin-bottom: 2rem;
}

.checkmark-circle {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  border: 4px solid rgba(16, 185, 129, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.checkmark-circle.employee {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  border-color: rgba(251, 191, 36, 0.4);
}

.checkmark {
  width: 50px;
  height: 50px;
  position: relative;
}

.checkmark::before {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: 900;
  color: #10b981;
  animation: checkmarkPop 0.6s ease-out 0.3s both;
}

@keyframes checkmarkPop {
  0% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); }
  50% { transform: translate(-50%, -50%) scale(1.2) rotate(10deg); }
  100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
}

.welcome-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.75rem;
  font-weight: 400;
}

.user-name {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #dc2626, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1.5rem;
  animation: nameSlide 0.5s ease-out 0.5s both;
}

@keyframes nameSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info-grid {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: infoSlide 0.5s ease-out 0.7s both;
}

@keyframes infoSlide {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 25px;
  font-weight: 600;
  color: #10b981;
}

.info-pill.role {
  background: rgba(251, 191, 36, 0.2);
  border-color: rgba(251, 191, 36, 0.4);
  color: #fbbf24;
}

.info-pill.branch {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  color: #3b82f6;
}

.pill-icon {
  font-size: 1.2rem;
}

.pill-text {
  font-size: 0.95rem;
}

/* Error Popup */
.error-popup {
  border: 2px solid rgba(239, 68, 68, 0.5) !important;
  border-radius: 30px !important;
}

/* ========================================
   ENHANCED FOCUS STATES
======================================== */
.form-input:focus,
.btn-submit:focus,
.btn-register:focus {
  outline: none;
}

/* ========================================
   LOADING OVERLAY
======================================== */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 5px solid rgba(220, 38, 38, 0.2);
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: bigSpin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes bigSpin {
  to { transform: rotate(360deg); }
}

/* ========================================
   INPUT AUTOFILL STYLING
======================================== */
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #fff;
  -webkit-box-shadow: 0 0 0 1000px rgba(30, 30, 30, 0.98) inset;
  box-shadow: 0 0 0 1000px rgba(30, 30, 30, 0.98) inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* ========================================
   BUTTON RIPPLE EFFECT
======================================== */
.btn-submit,
.btn-register,
.demo-btn {
  position: relative;
  overflow: hidden;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* ========================================
   GLASS MORPHISM ENHANCED
======================================== */
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* ========================================
   GRADIENT ANIMATIONS
======================================== */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
}

/* ========================================
   SHADOW VARIATIONS
======================================== */
.shadow-sm { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.shadow-md { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2); }
.shadow-lg { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
.shadow-xl { box-shadow: 0 16px 64px rgba(0, 0, 0, 0.4); }

.shadow-primary { box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4); }
.shadow-success { box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4); }
.shadow-warning { box-shadow: 0 10px 40px rgba(251, 191, 36, 0.4); }
.shadow-info { box-shadow: 0 10px 40px rgba(59, 130, 246, 0.4); }

/* ========================================
   BACKDROP BLUR FALLBACK
======================================== */
@supports not (backdrop-filter: blur(20px)) {
  .card {
    background: rgba(30, 30, 30, 0.98);
  }

  .animated-background {
    opacity: 0.5;
  }
}

/* ========================================
   TOUCH DEVICE OPTIMIZATIONS
======================================== */
@media (hover: none) and (pointer: coarse) {
  .btn-submit:active,
  .btn-register:active,
  .demo-btn:active {
    transform: scale(0.98);
  }

  .feature-item:active {
    transform: translateX(5px);
  }
}

/* ========================================
   SAFARI SPECIFIC FIXES
======================================== */
@supports (-webkit-touch-callout: none) {
  .card,
  .logo-circle {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}

/* ========================================
   FIREFOX SPECIFIC FIXES
======================================== */
@-moz-document url-prefix() {
  .btn-submit:hover {
    transform: translateY(-3px) translateZ(0);
  }
}

/* ========================================
   EDGE/IE FALLBACKS
======================================== */
@supports (-ms-ime-align: auto) {
  .card {
    background: rgba(30, 30, 30, 0.95);
  }
}

/* ========================================
   NEON GLOW EFFECTS
======================================== */
.glow-red {
  box-shadow: 
    0 0 10px rgba(220, 38, 38, 0.6),
    0 0 20px rgba(220, 38, 38, 0.4),
    0 0 30px rgba(220, 38, 38, 0.2);
}

.glow-gold {
  box-shadow: 
    0 0 10px rgba(251, 191, 36, 0.6),
    0 0 20px rgba(251, 191, 36, 0.4),
    0 0 30px rgba(251, 191, 36, 0.2);
}

.glow-green {
  box-shadow: 
    0 0 10px rgba(16, 185, 129, 0.6),
    0 0 20px rgba(16, 185, 129, 0.4),
    0 0 30px rgba(16, 185, 129, 0.2);
}

/* ========================================
   SKELETON LOADING
======================================== */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
}

@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ========================================
   Z-INDEX LAYERS
======================================== */
.animated-background { z-index: 0; }
.branding-section { z-index: 1; }
.login-section { z-index: 1; }
.card-glow { z-index: -1; }
.floating-label { z-index: 10; }
.toggle-password { z-index: 10; }

/* ========================================
   TRANSITION PRESETS
======================================== */
.transition-fast { transition: all 0.15s ease; }
.transition-base { transition: all 0.3s ease; }
.transition-slow { transition: all 0.5s ease; }
.transition-bounce { transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }

/* ========================================
   UTILITY CLASSES
======================================== */
.text-gradient-red-gold {
  background: linear-gradient(135deg, #dc2626, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-rainbow {
  background: linear-gradient(135deg, #dc2626, #fbbf24, #10b981, #3b82f6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ========================================
   PULSE ANIMATIONS
======================================== */
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* ========================================
   SHIMMER EFFECT
======================================== */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* ========================================
   ENHANCED HOVER STATES
======================================== */
@media (hover: hover) {
  .feature-item::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 15px;
  }

  .feature-item:hover::after {
    opacity: 1;
  }
}

/* ========================================
   FOCUS RING ENHANCEMENT
======================================== */
*:focus-visible {
  outline: 3px solid rgba(220, 38, 38, 0.6);
  outline-offset: 3px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline-offset: 4px;
}

/* ========================================
   INTERACTION STATES
======================================== */
.btn-submit:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

.demo-btn:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

/* ========================================
   CONTAINER QUERIES (Future-proof)
======================================== */
@container (max-width: 700px) {
  .stats-preview {
    grid-template-columns: 1fr;
  }

  .demo-accounts {
    grid-template-columns: 1fr;
  }
}

/* ========================================
   PREFERS REDUCED DATA
======================================== */
@media (prefers-reduced-data: reduce) {
  .hero-background img,
  .particle {
    display: none;
  }

  .card-glow {
    display: none;
  }
}

/* ========================================
   GPU ACCELERATION
======================================== */
.card,
.logo-circle,
.btn-submit,
.checkmark-circle {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* ========================================
   BRAND COLORS
======================================== */
:root {
  --primary: #dc2626;
  --primary-dark: #991b1b;
  --secondary: #fbbf24;
  --success: #10b981;
  --info: #3b82f6;
  --warning: #f59e0b;
  --error: #ef4444;
}
</style>
