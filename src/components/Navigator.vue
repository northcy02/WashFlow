<template>
  <header class="header">
    <div class="container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <div class="logo-icon">🚗</div>
        <span class="logo-text">WASHFLOW</span>
      </router-link>
      
      <!-- Navigation Menu -->
      <nav class="nav">
        <router-link to="/services">การบริการ</router-link>
        <router-link to="/booking">จองคิวล้างรถ</router-link>
        <router-link to="/">HOME</router-link>
        <router-link to="/car-types">ประเภทรถ</router-link>
        <router-link to="/history">ประวัติการใช้งาน</router-link>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- Show Login/Register if not logged in -->
        <template v-if="!isLoggedIn">
          <router-link to="/register">
            <button class="register-btn">REGISTER</button>
          </router-link>
          <router-link to="/login">
            <button class="login-btn">LOGIN NOW</button>
          </router-link>
        </template>

        <!-- Show User Info if logged in -->
        <template v-else>
          <div class="user-info">
            <span class="welcome-text">สวัสดี, {{ username }}</span>
            <button @click="handleLogoutClick" class="logout-btn">LOGOUT</button>
          </div>
        </template>

        <button class="cart-btn">🛒</button>
        <button class="user-btn" @click="toggleUserMenu">👤</button>
      </div>
    </div>

    <!-- User Dropdown Menu -->
    <transition name="fade">
      <div v-if="showUserMenu" class="user-menu">
        <div class="user-menu-content">
          <div class="user-menu-header">
            <div class="user-avatar">👤</div>
            <div class="user-details">
              <p class="user-name">{{ username || 'Guest' }}</p>
              <p class="user-email">{{ userEmail || 'ยังไม่ได้เข้าสู่ระบบ' }}</p>
            </div>
          </div>
          <div class="user-menu-divider"></div>
          <ul class="user-menu-list">
            <li v-if="isLoggedIn">
              <router-link to="/profile" @click="closeUserMenu">
                <span class="menu-icon">👤</span>
                <span>โปรไฟล์</span>
              </router-link>
            </li>
            <li v-if="isLoggedIn">
              <router-link to="/history" @click="closeUserMenu">
                <span class="menu-icon">📋</span>
                <span>ประวัติการใช้งาน</span>
              </router-link>
            </li>
            <li v-if="isLoggedIn">
              <router-link to="/settings" @click="closeUserMenu">
                <span class="menu-icon">⚙️</span>
                <span>ตั้งค่า</span>
              </router-link>
            </li>
            <li v-if="isLoggedIn" class="divider"></li>
            <li v-if="isLoggedIn">
              <a @click="handleLogoutClick; closeUserMenu()" class="logout-link">
                <span class="menu-icon">🚪</span>
                <span>ออกจากระบบ</span>
              </a>
            </li>
            <li v-if="!isLoggedIn">
              <router-link to="/login" @click="closeUserMenu">
                <span class="menu-icon">🔑</span>
                <span>เข้าสู่ระบบ</span>
              </router-link>
            </li>
            <li v-if="!isLoggedIn">
              <router-link to="/register" @click="closeUserMenu">
                <span class="menu-icon">📝</span>
                <span>สมัครสมาชิก</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const isLoggedIn = ref(false)
const username = ref('')
const userEmail = ref('')
const showUserMenu = ref(false)

// ตรวจสอบสถานะการ login
const checkLoginStatus = () => {
  const loginStatus = localStorage.getItem('isLoggedIn')
  const userStr = localStorage.getItem('user')
  
  if (loginStatus === 'true' && userStr) {
    isLoggedIn.value = true
    const user = JSON.parse(userStr)
    username.value = user.username
    userEmail.value = user.email || ''
  } else {
    isLoggedIn.value = false
    username.value = ''
    userEmail.value = ''
  }
}

// Toggle User Menu
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Close User Menu
const closeUserMenu = () => {
  showUserMenu.value = false
}

// Handle Logout Click - Show SweetAlert
const handleLogoutClick = () => {
  Swal.fire({
    title: 'ออกจากระบบ',
    text: 'คุณต้องการออกจากระบบหรือไม่?',
    icon: 'warning',
    iconColor: '#dc2626',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '<i class="fas fa-sign-out-alt"></i> ออกจากระบบ',
    cancelButtonText: '<i class="fas fa-times"></i> ยกเลิก',
    reverseButtons: true,
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    backdrop: `
      rgba(0,0,0,0.8)
      url("https://sweetalert2.github.io/images/nyan-cat.gif")
      left top
      no-repeat
    `,
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-text',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel'
    },
    buttonsStyling: false,
    showClass: {
      popup: 'animate__animated animate__fadeInDown animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp animate__faster'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      handleLogout()
    }
  })
}

// Handle Logout - Actual Logout
const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
  isLoggedIn.value = false
  username.value = ''
  userEmail.value = ''
  showUserMenu.value = false
  
  // Success notification
  Swal.fire({
    title: 'ออกจากระบบสำเร็จ!',
    text: 'ขอบคุณที่ใช้บริการ CYBERCAR',
    icon: 'success',
    iconColor: '#10b981',
    confirmButtonColor: '#dc2626',
    confirmButtonText: '<i class="fas fa-check"></i> ตรงไป',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      confirmButton: 'custom-swal-confirm'
    },
    buttonsStyling: false,
    showClass: {
      popup: 'animate__animated animate__bounceIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    }
  }).then(() => {
    router.push('/login')
  })
}

// Click outside to close menu
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-btn') && !target.closest('.user-menu')) {
    closeUserMenu()
  }
}

onMounted(() => {
  checkLoginStatus()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Header */
.header {
  background: rgba(0, 0, 0, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.header .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  color: #dc2626;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 2px;
}

/* Navigation */
.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
  font-weight: 400;
  position: relative;
  padding: 0.5rem 0;
}

.nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #dc2626;
  transition: width 0.3s;
}

.nav a:hover::after,
.nav a.router-link-active::after {
  width: 100%;
}

.nav a.router-link-active {
  color: #dc2626;
  font-weight: 700;
}

.nav a:hover {
  color: #dc2626;
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.register-btn, .login-btn, .logout-btn {
  background: transparent;
  color: white;
  border: 1.5px solid white;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.register-btn {
  border-color: #dc2626;
  color: #dc2626;
}

.login-btn {
  background: #dc2626;
  border-color: #dc2626;
}

.logout-btn {
  background: #dc2626;
  border-color: #dc2626;
}

.register-btn:hover, .login-btn:hover, .logout-btn:hover {
  background: white;
  color: #000;
  border-color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Cart & User Buttons */
.cart-btn, .user-btn {
  background: transparent;
  border: 1.5px solid white;
  border-radius: 5px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  transition: all 0.3s;
}

.cart-btn:hover, .user-btn:hover {
  background: white;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

/* User Dropdown Menu */
.user-menu {
  position: absolute;
  top: 100%;
  right: 2rem;
  margin-top: 0.5rem;
  background: rgba(30, 30, 30, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  min-width: 280px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-menu-content {
  padding: 0;
}

.user-menu-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(220, 38, 38, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  font-size: 2.5rem;
  background: rgba(220, 38, 38, 0.2);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  flex: 1;
}

.user-name {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.user-email {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin: 0.3rem 0 0 0;
}

.user-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.user-menu-list {
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
}

.user-menu-list li {
  margin: 0;
}

.user-menu-list li.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

.user-menu-list a,
.logout-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  font-size: 0.95rem;
}

.user-menu-list a:hover,
.logout-link:hover {
  background: rgba(220, 38, 38, 0.2);
  padding-left: 2rem;
}

.menu-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.8rem;
  }

  .nav a {
    font-size: 0.85rem;
  }
  
  .header-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .welcome-text {
    display: none;
  }

  .user-menu {
    right: 1rem;
    min-width: 260px;
  }
}
</style>

<!-- SweetAlert2 Custom Styles -->
<style>
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
  color: rgba(255, 255, 255, 0.8) !important;
  margin-bottom: 2rem !important;
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

/* Icon Styling */
.swal2-icon.swal2-warning {
  border-color: #dc2626 !important;
  color: #dc2626 !important;
}

.swal2-icon.swal2-success {
  border-color: #10b981 !important;
}

.swal2-icon.swal2-success [class^='swal2-success-line'] {
  background-color: #10b981 !important;
}

.swal2-icon.swal2-success .swal2-success-ring {
  border-color: rgba(16, 185, 129, 0.3) !important;
}

/* Timer Progress Bar */
.swal2-timer-progress-bar {
  background: #dc2626 !important;
}
</style>