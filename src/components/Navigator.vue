<!-- src/components/Navigator.vue -->

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
        aria-label="Toggle menu"
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

        <!-- Login แล้ว - Points Badge + Profile -->
        <template v-else>
          <!-- ✅ Points Badge with Tier Icon -->
          <router-link to="/membership" class="points-badge">
            <span class="tier-icon-small">{{ tierIcon }}</span>
            <span class="points-value">{{ availablePoints?.toLocaleString() || 0 }}</span>
            <span class="points-label">pts</span>
          </router-link>

          <!-- Profile Dropdown -->
          <div class="profile-wrapper">
            <button class="profile-button" @click="toggleProfileMenu" aria-label="Profile menu">
              <div class="profile-avatar">
                <span>{{ username ? username.charAt(0).toUpperCase() : 'U' }}</span>
              </div>
              <span class="profile-name">{{ username }}</span>
              <svg 
                class="profile-arrow" 
                :class="{ 'open': showProfileMenu }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>

            <!-- Profile Dropdown Menu -->
            <transition name="dropdown">
              <div v-if="showProfileMenu" class="profile-menu">
                <div class="profile-menu-header">
                  <div class="profile-menu-avatar">
                    <span>{{ username ? username.charAt(0).toUpperCase() : 'U' }}</span>
                  </div>
                  <div class="profile-menu-info">
                    <p class="profile-menu-name">{{ fullName }}</p>
                    <p class="profile-menu-username">@{{ username }}</p>
                    
                    <!-- ✅ Points Display in Menu -->
                    <div class="menu-points-display">
                      <span class="menu-tier-icon">{{ tierIcon }}</span>
                      <span class="menu-points-value">{{ availablePoints?.toLocaleString() || 0 }}</span>
                      <span class="menu-points-label">คะแนน</span>
                    </div>
                  </div>
                </div>

                <div class="profile-menu-divider"></div>

                <div class="profile-menu-items">
                  <router-link to="/profile" @click="closeProfileMenu" class="profile-menu-item">
                    <span class="item-icon">👤</span>
                    <span>โปรไฟล์</span>
                  </router-link>
                  
                  <router-link to="/membership" @click="closeProfileMenu" class="profile-menu-item membership-link">
                    <span class="item-icon">💎</span>
                    <span>สมาชิก & คะแนน</span>
                    <span class="new-badge">NEW</span>
                  </router-link>

                  <router-link to="/history" @click="closeProfileMenu" class="profile-menu-item">
                    <span class="item-icon">📋</span>
                    <span>ประวัติการจอง</span>
                  </router-link>

                  <router-link to="/booking" @click="closeProfileMenu" class="profile-menu-item">
                    <span class="item-icon">📅</span>
                    <span>จองบริการ</span>
                  </router-link>
                  
                  <router-link to="/branch-selection" @click="closeProfileMenu" class="profile-menu-item">
                    <span class="item-icon">🏢</span>
                    <span>เลือกสาขา</span>
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
import { usePoints } from '@/composables/usePoints'

const router = useRouter()
const route = useRoute()
const { refreshPoints, isRefreshing } = usePoints()

// ========================================
// STATE
// ========================================
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const showProfileMenu = ref(false)
const isLoggedIn = ref(false)
const username = ref('')
const fullName = ref('')
const availablePoints = ref<number | null>(null)
const tierIcon = ref('🥉')
const tierColor = ref('#cd7f32')

let refreshInterval: number | null = null

// ========================================
// METHODS
// ========================================

/**
 * ✅ Check login status และโหลดข้อมูล user
 */
const checkLoginStatus = async () => {
  try {
    const loginStatus = localStorage.getItem('isLoggedIn')
    const userStr = localStorage.getItem('user')
    
    if (loginStatus === 'true' && userStr) {
      const user = JSON.parse(userStr)
      isLoggedIn.value = true
      username.value = user.username || 'User'
      fullName.value = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest User'
      availablePoints.value = user.availablePoints || 0
      tierIcon.value = user.tierIcon || '🥉'
      tierColor.value = user.tierColor || '#cd7f32'
      
      console.log('✅ User logged in:', username.value)
      console.log('📊 Available Points:', availablePoints.value)
      console.log('💎 Tier:', tierIcon.value)
      
      // ✅ Auto refresh from server
      if (user.id) {
        const updated = await refreshPoints(user.id)
        if (updated) {
          availablePoints.value = updated.availablePoints
          tierIcon.value = updated.tier_icon || '🥉'
          tierColor.value = updated.tier_color || '#cd7f32'
          console.log('🔄 Points refreshed from server:', availablePoints.value)
        }
      }
    } else {
      resetState()
    }
  } catch (error) {
    console.error('❌ Error checking login:', error)
    resetState()
  }
}

/**
 * ✅ Reset state เมื่อ logout
 */
const resetState = () => {
  isLoggedIn.value = false
  username.value = ''
  fullName.value = ''
  availablePoints.value = null
  tierIcon.value = '🥉'
  tierColor.value = '#cd7f32'
}

/**
 * ✅ Handle points update event
 */
const handlePointsUpdate = async (event: any) => {
  console.log('🔔 Points update event received', event.detail)
  
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const user = JSON.parse(userStr)
      
      // If event has points data, use it
      if (event.detail?.availablePoints !== undefined) {
        availablePoints.value = event.detail.availablePoints
        
        // Update localStorage
        const updatedUser = { ...user, availablePoints: event.detail.availablePoints }
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else {
        // Otherwise refresh from server
        const updated = await refreshPoints(user.id)
        if (updated) {
          availablePoints.value = updated.availablePoints
          tierIcon.value = updated.tier_icon || '🥉'
          tierColor.value = updated.tier_color || '#cd7f32'
        }
      }
      
      console.log('✅ Points updated:', availablePoints.value)
    } catch (error) {
      console.error('❌ Error updating points:', error)
    }
  }
}

/**
 * Handle scroll
 */
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

/**
 * Toggle mobile menu
 */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

/**
 * Close mobile menu
 */
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

/**
 * Toggle profile menu
 */
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

/**
 * Close profile menu
 */
const closeProfileMenu = () => {
  showProfileMenu.value = false
}

/**
 * ✅ Handle logout
 */
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
    // Clear interval
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
    
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    
    // Reset state
    resetState()
    
    // Notify
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

/**
 * Close menu when clicking outside
 */
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const profileWrapper = document.querySelector('.profile-wrapper')
  
  if (showProfileMenu.value && profileWrapper && !profileWrapper.contains(target)) {
    closeProfileMenu()
  }
}

/**
 * ✅ Start auto-refresh points
 */
const startAutoRefresh = () => {
  // Clear existing interval
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  
  // Set new interval (30 seconds)
  refreshInterval = window.setInterval(() => {
    if (isLoggedIn.value && document.visibilityState === 'visible' && !isRefreshing.value) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          if (user.id) {
            refreshPoints(user.id).then((updated) => {
              if (updated) {
                availablePoints.value = updated.availablePoints
                tierIcon.value = updated.tier_icon || '🥉'
                tierColor.value = updated.tier_color || '#cd7f32'
              }
            })
          }
        } catch (error) {
          console.error('Error in auto-refresh:', error)
        }
      }
    }
  }, 30000) // 30 seconds
  
  console.log('✅ Auto-refresh started (every 30s)')
}

// ========================================
// LIFECYCLE
// ========================================
onMounted(async () => {
  await checkLoginStatus()
  
  // Event listeners
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('loginStatusChanged', checkLoginStatus as any)
  window.addEventListener('pointsUpdated', handlePointsUpdate as any)
  window.addEventListener('storage', checkLoginStatus)
  
  // ✅ Start auto-refresh if logged in
  if (isLoggedIn.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('loginStatusChanged', checkLoginStatus as any)
  window.removeEventListener('pointsUpdated', handlePointsUpdate as any)
  window.removeEventListener('storage', checkLoginStatus)
  
  // Clear interval
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
  
  document.body.style.overflow = ''
})

/**
 * ✅ Watch route changes
 */
watch(() => route.path, async () => {
  closeMobileMenu()
  closeProfileMenu()
  await checkLoginStatus()
})

/**
 * ✅ Watch login status - start/stop refresh
 */
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    startAutoRefresh()
  } else {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
      console.log('🛑 Auto-refresh stopped')
    }
  }
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

/* ========================================
   LOGO
======================================== */
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

/* ========================================
   MOBILE TOGGLE
======================================== */
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

.mobile-menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translateY(8px);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translateY(-8px);
}

/* ========================================
   NAVIGATION
======================================== */
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

/* ========================================
   HEADER ACTIONS
======================================== */
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

/* ========================================
   POINTS BADGE (NEW!)
======================================== */
.points-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  border: 2px solid rgba(251, 191, 36, 0.4);
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.2);
}

.points-badge:hover {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3));
  border-color: #fbbf24;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
}

.tier-icon-small {
  font-size: 1.2rem;
  filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.points-value {
  font-size: 1.1rem;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
  min-width: 30px;
  text-align: right;
}

.points-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ========================================
   PROFILE WRAPPER
======================================== */
.profile-wrapper {
  position: relative;
}

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

/* ========================================
   PROFILE MENU
======================================== */
.profile-menu {
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 300px;
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
  flex-shrink: 0;
}

.profile-menu-info {
  flex: 1;
  min-width: 0;
}

.profile-menu-name {
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-menu-username {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

/* ✅ Menu Points Display */
.menu-points-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(251, 191, 36, 0.2);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 20px;
  width: fit-content;
}

.menu-tier-icon {
  font-size: 1rem;
  filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.6));
}

.menu-points-value {
  font-size: 1rem;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
}

.menu-points-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
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
  font-size: 0.95rem;
  position: relative;
}

.profile-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #dc2626;
  opacity: 0;
  transition: opacity 0.3s;
}

.profile-menu-item:hover::before {
  opacity: 1;
}

.profile-menu-item:hover {
  background: rgba(220, 38, 38, 0.1);
  color: white;
  padding-left: 2rem;
}

.profile-menu-item.membership-link {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), transparent);
  border-left: 3px solid #fbbf24;
}

.profile-menu-item.membership-link:hover {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.2), transparent);
}

.profile-menu-item.logout {
  color: #dc2626;
}

.profile-menu-item.logout::before {
  background: #ef4444;
}

.profile-menu-item.logout:hover {
  background: rgba(220, 38, 38, 0.2);
}

.item-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.new-badge {
  margin-left: auto;
  padding: 0.2rem 0.6rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); 
  }
  50% { 
    transform: scale(1.05); 
    box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); 
  }
}

/* ========================================
   DROPDOWN ANIMATION
======================================== */
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

/* ========================================
   RESPONSIVE
======================================== */
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
    right: 0;
    width: calc(100vw - 2rem);
    max-width: 340px;
  }

  .points-badge {
    padding: 0.4rem 0.8rem;
  }

  .points-value {
    font-size: 1rem;
  }

  .tier-icon-small {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .logo-tagline {
    font-size: 0.6rem;
  }

  .points-badge {
    gap: 0.3rem;
    padding: 0.4rem 0.7rem;
  }

  .points-value {
    font-size: 0.9rem;
    min-width: 25px;
  }

  .points-label {
    font-size: 0.65rem;
  }

  .tier-icon-small {
    font-size: 0.9rem;
  }

  .profile-menu {
    width: calc(100vw - 1rem);
  }
}
</style>
