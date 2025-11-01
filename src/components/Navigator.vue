<!-- src/components/navigator.vue -->
<template>
  <header class="header" :class="{ 'scrolled': isScrolled, 'menu-open': isMobileMenuOpen }">
    <div class="container">
      <!-- Logo -->
      <router-link to="/" class="logo" @click="closeMobileMenu">
        <div class="logo-icon">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 24l4-8h32l4 8M12 24v16h40V24M12 40h4m24 0h4"/>
            <circle cx="20" cy="40" r="4"/>
            <circle cx="44" cy="40" r="4"/>
          </svg>
        </div>
        <div class="logo-content">
          <span class="logo-text">WASHFLOW</span>
          <span class="logo-tagline">Car Wash Pro</span>
        </div>
      </router-link>

      <!-- Mobile Menu Toggle -->
      <button 
        class="mobile-menu-toggle" 
        @click="toggleMobileMenu"
        :class="{ 'active': isMobileMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <!-- Navigation Menu -->
      <nav class="nav" :class="{ 'active': isMobileMenuOpen }">
        <router-link to="/" @click="closeMobileMenu" class="nav-link">
          <span>หน้าหลัก</span>
        </router-link>

        <router-link to="/services" @click="closeMobileMenu" class="nav-link">
          <span>บริการ</span>
        </router-link>

        <router-link to="/booking" @click="closeMobileMenu" class="nav-link nav-link-highlight">
          <span>จองคิว</span>
        </router-link>

        <router-link to="/car-types" @click="closeMobileMenu" class="nav-link">
          <span>ประเภทรถ</span>
        </router-link>

        <router-link to="/history" @click="closeMobileMenu" class="nav-link">
          <span>ประวัติ</span>
        </router-link>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- ยังไม่ได้ Login -->
        <template v-if="!isLoggedIn">
          <router-link to="/register" class="btn-link">
            <button class="btn-register">สมัครสมาชิก</button>
          </router-link>
          <router-link to="/login" class="btn-link">
            <button class="btn-login">เข้าสู่ระบบ</button>
          </router-link>
        </template>

        <!-- Login แล้ว - Profile Button -->
        <template v-else>
          <div class="profile-wrapper">
            <button class="profile-button" @click="toggleProfileMenu">
              <div class="profile-avatar">
                <span>{{ username.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="profile-name">{{ username }}</span>
              <svg 
                class="profile-arrow" 
                :class="{ 'open': showProfileMenu }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>

            <!-- Profile Dropdown Menu -->
            <transition name="dropdown">
              <div v-if="showProfileMenu" class="profile-menu">
                <div class="profile-menu-header">
                  <div class="profile-menu-avatar">
                    <span>{{ username.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="profile-menu-info">
                    <p class="profile-menu-name">{{ fullName }}</p>
                    <p class="profile-menu-username">@{{ username }}</p>
                  </div>
                </div>

                <div class="profile-menu-divider"></div>

                <div class="profile-menu-items">
                  <router-link to="/profile" @click="closeProfileMenu" class="profile-menu-item">
                    <span class="item-icon">👤</span>
                    <span>โปรไฟล์</span>
                  </router-link>

                  <router-link to="/history" @click="closeProfileMenu" class="profile-menu-item">
                    <span class="item-icon">📋</span>
                    <span>ประวัติการจอง</span>
                  </router-link>

                  <router-link to="/booking" @click="closeProfileMenu" class="profile-menu-item">
                    <span class="item-icon">📅</span>
                    <span>จองบริการ</span>
                  </router-link>
                </div>

                <div class="profile-menu-divider"></div>

                <div class="profile-menu-items">
                  <button @click="handleLogout" class="profile-menu-item logout">
                    <span class="item-icon">🚪</span>
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()

// State
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const showProfileMenu = ref(false)
const isLoggedIn = ref(false)
const username = ref('')
const fullName = ref('')

// Check login status
const checkLoginStatus = () => {
  try {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userStr = localStorage.getItem('user')
    
    if (loginStatus === 'true' && userStr) {
      const user = JSON.parse(userStr)
      isLoggedIn.value = true
      username.value = user.username || 'User'
      fullName.value = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest User'
      console.log('✅ User logged in:', username.value)
    } else {
      isLoggedIn.value = false
      username.value = ''
      fullName.value = ''
    }
  } catch (error) {
    console.error('❌ Error checking login:', error)
    isLoggedIn.value = false
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const closeProfileMenu = () => {
  showProfileMenu.value = false
}

const handleLogout = async () => {
  closeProfileMenu()
  
  const result = await Swal.fire({
    title: 'ออกจากระบบ',
    text: 'คุณต้องการออกจากระบบหรือไม่?',
    icon: 'warning',
    iconColor: '#dc2626',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'ออกจากระบบ',
    cancelButtonText: 'ยกเลิก',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  })

  if (result.isConfirmed) {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    isLoggedIn.value = false
    username.value = ''
    fullName.value = ''
    
    window.dispatchEvent(new CustomEvent('loginStatusChanged'))
    
    await Swal.fire({
      title: 'ออกจากระบบสำเร็จ!',
      icon: 'success',
      iconColor: '#10b981',
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'ตกลง',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff',
      timer: 2000,
      timerProgressBar: true
    })
    
    router.push('/')
  }
}

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const profileWrapper = document.querySelector('.profile-wrapper')
  
  if (showProfileMenu.value && profileWrapper && !profileWrapper.contains(target)) {
    closeProfileMenu()
  }
}

// Lifecycle
onMounted(() => {
  checkLoginStatus()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('loginStatusChanged', checkLoginStatus as any)
  window.addEventListener('storage', checkLoginStatus)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('loginStatusChanged', checkLoginStatus as any)
  window.removeEventListener('storage', checkLoginStatus)
  document.body.style.overflow = ''
})

watch(() => route.path, () => {
  closeMobileMenu()
  closeProfileMenu()
  checkLoginStatus()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.header {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s;
}

.header.scrolled {
  background: rgba(0, 0, 0, 0.98);
  padding: 0.6rem 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  transition: all 0.3s;
  z-index: 1001;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
}

.logo-icon svg {
  width: 28px;
  height: 28px;
  stroke: white;
}

.logo-content {
  display: flex;
  flex-direction: column;
}

.logo-text {
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  line-height: 1;
}

.logo-tagline {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
  letter-spacing: 1px;
}

/* Mobile Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
}

.mobile-menu-toggle span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: all 0.3s;
}

/* Navigation */
.nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  color: white;
  background: rgba(220, 38, 38, 0.1);
}

.nav-link.router-link-active {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.15);
  font-weight: 700;
}

.nav-link-highlight {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(139, 0, 0, 0.2) 100%);
  border: 1px solid rgba(220, 38, 38, 0.3);
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.btn-link {
  text-decoration: none;
}

.btn-register,
.btn-login {
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Kanit', sans-serif;
  border: 2px solid;
}

.btn-register {
  background: transparent;
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.5);
}

.btn-register:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
  transform: translateY(-2px);
}

.btn-login {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.3);
}

.btn-login:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.5);
}

/* Profile Wrapper */
.profile-wrapper {
  position: relative;
}

/* Profile Button */
.profile-button {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.4rem 1rem 0.4rem 0.4rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Kanit', sans-serif;
}

.profile-button:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
}

.profile-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.profile-name {
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
}

.profile-arrow {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
  transition: transform 0.3s;
  color: white;
}

.profile-arrow.open {
  transform: rotate(180deg);
}

/* Profile Menu */
.profile-menu {
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 280px;
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(220, 38, 38, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 2000;
}

.profile-menu-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(139, 0, 0, 0.2) 100%);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-menu-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.8rem;
  border: 3px solid rgba(220, 38, 38, 0.5);
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
}

.profile-menu-info {
  flex: 1;
}

.profile-menu-name {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.profile-menu-username {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.profile-menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.profile-menu-items {
  padding: 0.5rem 0;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  font-family: 'Kanit', sans-serif;
  font-size: 0.95rem;
}

.profile-menu-item:hover {
  background: rgba(220, 38, 38, 0.1);
  color: white;
  padding-left: 2rem;
}

.profile-menu-item.logout {
  color: #dc2626;
}

.profile-menu-item.logout:hover {
  background: rgba(220, 38, 38, 0.2);
}

.item-icon {
  font-size: 1.2rem;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 968px) {
  .mobile-menu-toggle {
    display: flex;
  }

  .nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: rgba(10, 10, 10, 0.98);
    flex-direction: column;
    align-items: stretch;
    padding: 5rem 1rem 2rem;
    gap: 0.5rem;
    transition: right 0.4s;
    overflow-y: auto;
    border-left: 1px solid rgba(220, 38, 38, 0.3);
  }

  .nav.active {
    right: 0;
  }

  .profile-name {
    display: none;
  }

  .profile-button {
    padding: 0.4rem;
  }

  .profile-menu {
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .profile-menu {
    width: calc(100vw - 2rem);
    right: 1rem;
  }
}
</style>
