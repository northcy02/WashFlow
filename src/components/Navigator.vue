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
        aria-label="เมนู"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <!-- Navigation Menu -->
      <nav class="nav" :class="{ 'active': isMobileMenuOpen }">
        <div class="nav-header">
          <span class="nav-title">เมนู</span>
          <button class="close-nav" @click="closeMobileMenu">✕</button>
        </div>

        <router-link 
          to="/" 
          @click="closeMobileMenu"
          class="nav-link"
        >
          <span class="nav-icon">🏠</span>
          <span>หน้าหลัก</span>
        </router-link>

        <!-- Services Mega Menu -->
        <div 
          class="nav-item-dropdown"
          @mouseenter="showServicesMenu = true"
          @mouseleave="showServicesMenu = false"
        >
          <router-link 
            to="/services" 
            @click="closeMobileMenu"
            class="nav-link"
          >
            <span class="nav-icon">✨</span>
            <span>บริการ</span>
            <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </router-link>

          <!-- Mega Menu -->
          <transition name="fade-slide">
            <div v-if="showServicesMenu || isMobileMenuOpen" class="mega-menu">
              <div class="mega-menu-content">
                <div class="mega-menu-section">
                  <h4>บริการหลัก</h4>
                  <ul>
                    <li>
                      <a @click="navigateTo('/services'); closeMobileMenu()">
                        <span class="mega-icon">🚿</span>
                        <div>
                          <strong>ล้างรถ</strong>
                          <small>ล้างภายนอก-ภายใน</small>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a @click="navigateTo('/services'); closeMobileMenu()">
                        <span class="mega-icon">🎨</span>
                        <div>
                          <strong>เคลือบสี</strong>
                          <small>ปกป้องสีรถ</small>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a @click="navigateTo('/services'); closeMobileMenu()">
                        <span class="mega-icon">✨</span>
                        <div>
                          <strong>ขัดสี</strong>
                          <small>เงางามเหมือนใหม่</small>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="mega-menu-section">
                  <h4>บริการเสริม</h4>
                  <ul>
                    <li>
                      <a @click="navigateTo('/services'); closeMobileMenu()">
                        <span class="mega-icon">💨</span>
                        <div>
                          <strong>ดูดฝุ่น</strong>
                          <small>ทำความสะอาดภายใน</small>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a @click="navigateTo('/services'); closeMobileMenu()">
                        <span class="mega-icon">🧽</span>
                        <div>
                          <strong>ซักเบาะ</strong>
                          <small>เบาะสะอาดหอมสดชื่น</small>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a @click="navigateTo('/services'); closeMobileMenu()">
                        <span class="mega-icon">🔧</span>
                        <div>
                          <strong>อื่นๆ</strong>
                          <small>บริการครบวงจร</small>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="mega-menu-promo">
                  <div class="promo-card">
                    <h5>🎉 โปรโมชั่นพิเศษ</h5>
                    <p>ล้างรถ + เคลือบสี</p>
                    <span class="promo-price">฿799</span>
                    <button class="promo-btn" @click="navigateTo('/booking'); closeMobileMenu()">
                      จองเลย
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <router-link 
          to="/booking" 
          @click="closeMobileMenu"
          class="nav-link nav-link-highlight"
        >
          <span class="nav-icon">📅</span>
          <span>จองคิว</span>
        </router-link>

        <router-link 
          to="/car-types" 
          @click="closeMobileMenu"
          class="nav-link"
        >
          <span class="nav-icon">🚗</span>
          <span>ประเภทรถ</span>
        </router-link>

        <router-link 
          to="/history" 
          @click="closeMobileMenu"
          class="nav-link"
        >
          <span class="nav-icon">📋</span>
          <span>ประวัติ</span>
        </router-link>

        <!-- Mobile Only Links -->
        <div class="mobile-only-links">
          <div class="divider"></div>
          <template v-if="!isLoggedIn">
            <router-link to="/login" @click="closeMobileMenu" class="nav-link">
              <span class="nav-icon">🔑</span>
              <span>เข้าสู่ระบบ</span>
            </router-link>
            <router-link to="/register" @click="closeMobileMenu" class="nav-link">
              <span class="nav-icon">📝</span>
              <span>สมัครสมาชิก</span>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/profile" @click="closeMobileMenu" class="nav-link">
              <span class="nav-icon">👤</span>
              <span>โปรไฟล์</span>
            </router-link>
            <a @click="handleLogoutClick; closeMobileMenu()" class="nav-link">
              <span class="nav-icon">🚪</span>
              <span>ออกจากระบบ</span>
            </a>
          </template>
        </div>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- Search Button -->
        <button 
          class="action-btn search-btn" 
          @click="toggleSearch"
          aria-label="ค้นหา"
          v-tooltip="'ค้นหา'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>

        <!-- Notifications -->
        <button 
          class="action-btn notification-btn" 
          @click="toggleNotifications"
          aria-label="การแจ้งเตือน"
          v-tooltip="'การแจ้งเตือน'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
        </button>

        <!-- Shopping Cart -->
        <button 
          class="action-btn cart-btn" 
          @click="toggleCart"
          aria-label="ตะกร้า"
          v-tooltip="'ตะกร้า'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </button>

        <!-- Language Selector -->
        <div class="language-selector desktop-only">
          <button 
            class="action-btn lang-btn"
            @click="toggleLanguage"
            v-tooltip="'เปลี่ยนภาษา'"
          >
            <span class="flag">{{ currentLang === 'th' ? '🇹🇭' : '🇬🇧' }}</span>
          </button>
        </div>

        <!-- User Actions (Desktop) -->
        <div class="user-actions desktop-only">
          <template v-if="!isLoggedIn">
            <router-link to="/register">
              <button class="register-btn">สมัครสมาชิก</button>
            </router-link>
            <router-link to="/login">
              <button class="login-btn">เข้าสู่ระบบ</button>
            </router-link>
          </template>
          <template v-else>
            <div class="user-profile" @click="toggleUserMenu">
              <div class="user-avatar">
                <img v-if="userAvatar" :src="userAvatar" :alt="username">
                <span v-else>{{ username.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="user-info">
                <span class="user-name">{{ username }}</span>
                <span class="user-role">สมาชิก</span>
              </div>
              <svg class="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Search Overlay -->
    <transition name="fade">
      <div v-if="showSearch" class="search-overlay" @click="closeSearch">
        <div class="search-container" @click.stop>
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input 
              ref="searchInput"
              v-model="searchQuery"
              type="text" 
              placeholder="ค้นหาบริการ, แพ็คเกจ..."
              @input="handleSearch"
            >
            <button class="close-search" @click="closeSearch">✕</button>
          </div>
          <div v-if="searchResults.length > 0" class="search-results">
            <div class="search-result-item" v-for="result in searchResults" :key="result.id">
              <span class="result-icon">{{ result.icon }}</span>
              <div class="result-content">
                <strong>{{ result.title }}</strong>
                <small>{{ result.description }}</small>
              </div>
            </div>
          </div>
          <div v-else-if="searchQuery" class="no-results">
            <span>ไม่พบผลลัพธ์</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Notifications Panel -->
    <transition name="slide-fade">
      <div v-if="showNotifications" class="notifications-panel" v-click-outside="closeNotifications">
        <div class="panel-header">
          <h3>การแจ้งเตือน</h3>
          <button class="mark-read" @click="markAllAsRead">ทำเครื่องหมายอ่านทั้งหมด</button>
        </div>
        <div class="notifications-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <div class="notification-icon" :class="notification.type">
              {{ notification.icon }}
            </div>
            <div class="notification-content">
              <strong>{{ notification.title }}</strong>
              <p>{{ notification.message }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
        </div>
        <div class="panel-footer">
          <router-link to="/notifications" @click="closeNotifications">
            ดูทั้งหมด
          </router-link>
        </div>
      </div>
    </transition>

    <!-- Cart Panel -->
    <transition name="slide-fade">
      <div v-if="showCart" class="cart-panel" v-click-outside="closeCart">
        <div class="panel-header">
          <h3>ตะกร้า</h3>
          <button class="clear-cart" @click="clearCart">ล้างตะกร้า</button>
        </div>
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.name">
            <div class="cart-item-info">
              <strong>{{ item.name }}</strong>
              <span class="price">฿{{ item.price }}</span>
            </div>
            <button class="remove-item" @click="removeFromCart(item.id)">✕</button>
          </div>
        </div>
        <div v-if="cartItems.length === 0" class="empty-cart">
          <span>🛒</span>
          <p>ตะกร้าว่างเปล่า</p>
        </div>
        <div v-else class="cart-footer">
          <div class="cart-total">
            <span>ยอดรวม:</span>
            <strong>฿{{ cartTotal }}</strong>
          </div>
          <button class="checkout-btn" @click="goToCheckout">
            ชำระเงิน
          </button>
        </div>
      </div>
    </transition>

    <!-- User Dropdown Menu -->
    <transition name="fade-slide">
      <div v-if="showUserMenu" class="user-menu" v-click-outside="closeUserMenu">
        <div class="user-menu-header">
          <div class="user-avatar-large">
            <img v-if="userAvatar" :src="userAvatar" :alt="username">
            <span v-else>{{ username.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="user-details">
            <p class="user-name-large">{{ username }}</p>
            <p class="user-email">{{ userEmail || 'ยังไม่ได้ระบุอีเมล' }}</p>
            <span class="user-points">🏆 {{ userPoints }} แต้ม</span>
          </div>
        </div>
        
        <div class="user-menu-divider"></div>
        
        <ul class="user-menu-list">
          <li>
            <router-link to="/profile" @click="closeUserMenu">
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <span>โปรไฟล์</span>
            </router-link>
          </li>
          <li>
            <router-link to="/history" @click="closeUserMenu">
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
                </svg>
              </span>
              <span>ประวัติการใช้งาน</span>
            </router-link>
          </li>
          <li>
            <router-link to="/bookings" @click="closeUserMenu">
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </span>
              <span>การจองของฉัน</span>
              <span class="menu-badge">{{ bookingCount }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/favorites" @click="closeUserMenu">
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </span>
              <span>รายการโปรด</span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings" @click="closeUserMenu">
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6m0-18l-2.5 2.5M12 1l2.5 2.5m-7 4.5L1 12m6-4.5L4.5 10M23 12l-6-4.5M23 12l-2.5-2.5M7 17.5L1 12m6 5.5L4.5 14M17 17.5L23 12m-6 5.5l2.5-2.5M12 23l-2.5-2.5M12 23l2.5-2.5"/>
                </svg>
              </span>
              <span>ตั้งค่า</span>
            </router-link>
          </li>
        </ul>

        <div class="user-menu-divider"></div>

        <ul class="user-menu-list">
          <li>
            <a @click="handleLogoutClick; closeUserMenu()" class="logout-link">
              <span class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              <span>ออกจากระบบ</span>
            </a>
          </li>
        </ul>
      </div>
    </transition>

    <!-- Progress Bar -->
    <div class="progress-bar" :style="{ width: scrollProgress + '%' }"></div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const route = useRoute()

// State
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const showServicesMenu = ref(false)
const showSearch = ref(false)
const showNotifications = ref(false)
const showCart = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const scrollProgress = ref(0)
const currentLang = ref('th')

// User Data
const isLoggedIn = ref(false)
const username = ref('')
const userEmail = ref('')
const userAvatar = ref('')
const userPoints = ref(0)
const bookingCount = ref(3)

// Counts
const notificationCount = ref(5)
const cartCount = ref(2)

// Mock Data
const searchResults = ref([])
const notifications = ref([
  {
    id: 1,
    icon: '🎉',
    type: 'success',
    title: 'การจองสำเร็จ',
    message: 'คุณได้จองคิวล้างรถวันที่ 15 ม.ค. 2567',
    time: '5 นาทีที่แล้ว',
    read: false
  },
  {
    id: 2,
    icon: '💰',
    type: 'promo',
    title: 'โปรโมชั่นพิเศษ',
    message: 'รับส่วนลด 20% สำหรับการจองครั้งต่อไป',
    time: '1 ชั่วโมงที่แล้ว',
    read: false
  },
  {
    id: 3,
    icon: '⭐',
    type: 'info',
    title: 'ได้รับคะแนน',
    message: 'คุณได้รับ 50 แต้มจากการใช้บริการ',
    time: '2 ชั่วโมงที่แล้ว',
    read: true
  }
])

const cartItems = ref([
  {
    id: 1,
    name: 'แพ็คเกจล้างรถ Premium',
    price: 599,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=100'
  },
  {
    id: 2,
    name: 'เคลือบสีรถ Ceramic',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100'
  }
])

const cartTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price, 0)
})

// Methods
const checkLoginStatus = () => {
  const loginStatus = localStorage.getItem('isLoggedIn')
  const userStr = localStorage.getItem('user')
  
  if (loginStatus === 'true' && userStr) {
    isLoggedIn.value = true
    const user = JSON.parse(userStr)
    username.value = user.username
    userEmail.value = user.email || ''
    userAvatar.value = user.avatar || ''
    userPoints.value = user.points || 0
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  
  // Calculate scroll progress
  const winScroll = document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = (winScroll / height) * 100
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const closeSearch = () => {
  showSearch.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const handleSearch = () => {
  // Mock search functionality
  if (searchQuery.value.length > 2) {
    searchResults.value = [
      { id: 1, icon: '🚿', title: 'ล้างรถ Premium', description: 'บริการล้างรถระดับพรีเมียม' },
      { id: 2, icon: '🎨', title: 'เคลือบสีรถ', description: 'ปกป้องสีรถยนต์' }
    ]
  } else {
    searchResults.value = []
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showCart.value = false
  showUserMenu.value = false
}

const closeNotifications = () => {
  showNotifications.value = false
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
    updateNotificationCount()
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  updateNotificationCount()
}

const updateNotificationCount = () => {
  notificationCount.value = notifications.value.filter(n => !n.read).length
}

const toggleCart = () => {
  showCart.value = !showCart.value
  showNotifications.value = false
  showUserMenu.value = false
}

const closeCart = () => {
  showCart.value = false
}

const removeFromCart = (id: number) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
  cartCount.value = cartItems.value.length
}

const clearCart = () => {
  Swal.fire({
    title: 'ล้างตะกร้า?',
    text: 'คุณต้องการลบสินค้าทั้งหมดออกจากตะกร้าหรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'ใช่, ล้างเลย',
    cancelButtonText: 'ยกเลิก',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  }).then((result) => {
    if (result.isConfirmed) {
      cartItems.value = []
      cartCount.value = 0
      Swal.fire({
        title: 'ล้างตะกร้าสำเร็จ!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      })
    }
  })
}

const goToCheckout = () => {
  closeCart()
  router.push('/checkout')
}

const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'th' ? 'en' : 'th'
  // Implement language change logic here
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showCart.value = false
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const navigateTo = (path: string) => {
  router.push(path)
}

const handleLogoutClick = () => {
  Swal.fire({
    title: 'ออกจากระบบ',
    text: 'คุณต้องการออกจากระบบหรือไม่?',
    icon: 'warning',
    iconColor: '#dc2626',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'ออกจากระบบ',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  }).then((result) => {
    if (result.isConfirmed) {
      handleLogout()
    }
  })
}

const handleLogout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('isLoggedIn')
  isLoggedIn.value = false
  username.value = ''
  userEmail.value = ''
  showUserMenu.value = false
  
  Swal.fire({
    title: 'ออกจากระบบสำเร็จ!',
    text: 'ขอบคุณที่ใช้บริการ',
    icon: 'success',
    iconColor: '#10b981',
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'ตกลง',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff',
    timer: 2000,
    timerProgressBar: true
  }).then(() => {
    router.push('/login')
  })
}

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Tooltip directive
const vTooltip = {
  mounted(el: any, binding: any) {
    el.setAttribute('data-tooltip', binding.value)
  }
}

// Lifecycle
onMounted(() => {
  checkLoginStatus()
  window.addEventListener('scroll', handleScroll)
  
  // Close mobile menu on route change
  router.afterEach(() => {
    closeMobileMenu()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Base Styles */
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header.scrolled {
  background: rgba(0, 0, 0, 0.98);
  padding: 0.6rem 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border-bottom-color: rgba(220, 38, 38, 0.3);
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
  transition: all 0.3s;
}

.logo:hover .logo-icon {
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.6);
  transform: rotate(5deg);
}

.logo-icon svg {
  width: 28px;
  height: 28px;
  stroke: white;
  stroke-width: 2.5;
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
  font-weight: 400;
  letter-spacing: 1px;
}

/* Mobile Menu Toggle */
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

/* Navigation */
.nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.nav-header {
  display: none;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.nav-icon {
  font-size: 1.1rem;
  display: none;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #dc2626, #991b1b);
  transition: width 0.3s;
}

.nav-link:hover::before,
.nav-link.router-link-active::before {
  width: 70%;
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

.nav-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  animation: pulse 2s infinite;
}

/* Dropdown Arrow */
.dropdown-arrow {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
  transition: transform 0.3s;
}

.nav-item-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* Mega Menu */
.nav-item-dropdown {
  position: relative;
}

.mega-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 1rem;
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  min-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.mega-menu-content {
  display: grid;
  grid-template-columns: 1fr 1fr 250px;
  gap: 2rem;
}

.mega-menu-section h4 {
  color: #dc2626;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.mega-menu-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mega-menu-section li {
  margin-bottom: 0.5rem;
}

.mega-menu-section a {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.mega-menu-section a:hover {
  background: rgba(220, 38, 38, 0.1);
  color: white;
  transform: translateX(5px);
}

.mega-icon {
  font-size: 1.5rem;
}

.mega-menu-section strong {
  display: block;
  margin-bottom: 0.2rem;
}

.mega-menu-section small {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
}

.mega-menu-promo {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(139, 0, 0, 0.2) 100%);
  border-radius: 15px;
  padding: 1.5rem;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.promo-card h5 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.promo-card p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.promo-price {
  display: block;
  color: #dc2626;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
}

.promo-btn {
  width: 100%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.promo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.5);
}

/* Mobile Only Links */
.mobile-only-links {
  display: none;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.action-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.6rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-2px);
}

.action-btn svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.flag {
  font-size: 1.3rem;
}
.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(220, 38, 38, 0.6);
  animation: bounce-badge 2s infinite;
}

@keyframes bounce-badge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Desktop Only */
.desktop-only {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

/* User Actions */
.user-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.register-btn,
.login-btn {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.register-btn {
  border-color: rgba(220, 38, 38, 0.5);
  color: #dc2626;
}

.register-btn:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
  transform: translateY(-2px);
}

.login-btn {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-color: transparent;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.3);
}

.login-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.5);
}

/* User Profile */
.user-profile {
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

.user-profile:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
}

.user-avatar {
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
  overflow: hidden;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
}

.user-role {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
}

/* Search Overlay */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
}

.search-container {
  width: 100%;
  max-width: 700px;
  padding: 0 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 20px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.search-icon {
  width: 24px;
  height: 24px;
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 2;
  flex-shrink: 0;
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  color: white;
  font-size: 1.3rem;
  outline: none;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.close-search {
  background: rgba(220, 38, 38, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-search:hover {
  background: #dc2626;
  transform: rotate(90deg);
}

.search-results {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1rem;
  backdrop-filter: blur(20px);
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 0.5rem;
}

.search-result-item:hover {
  background: rgba(220, 38, 38, 0.1);
}

.result-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background: rgba(220, 38, 38, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-content {
  flex: 1;
}

.result-content strong {
  color: white;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.3rem;
}

.result-content small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
}

/* Notifications Panel */
.notifications-panel,
.cart-panel {
  position: absolute;
  top: calc(100% + 1rem);
  right: 2rem;
  width: 380px;
  max-height: 500px;
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(220, 38, 38, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(220, 38, 38, 0.1);
}

.panel-header h3 {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

.mark-read,
.clear-cart {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.mark-read:hover,
.clear-cart:hover {
  color: #b91c1c;
  text-decoration: underline;
}

.notifications-list,
.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.03);
}

.notification-item.unread {
  background: rgba(220, 38, 38, 0.1);
  border-left: 3px solid #dc2626;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.notification-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-icon.success {
  background: rgba(16, 185, 129, 0.2);
}

.notification-icon.promo {
  background: rgba(251, 191, 36, 0.2);
}

.notification-icon.info {
  background: rgba(59, 130, 246, 0.2);
}

.notification-content {
  flex: 1;
}

.notification-content strong {
  color: white;
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.3rem;
}

.notification-content p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.notification-time {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
}

.panel-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.panel-footer a {
  color: #dc2626;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.panel-footer a:hover {
  color: #b91c1c;
  text-decoration: underline;
}

/* Cart Items */
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 0.8rem;
  transition: all 0.3s;
}

.cart-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.cart-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-info strong {
  color: white;
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.3rem;
}

.cart-item-info .price {
  color: #dc2626;
  font-size: 1.1rem;
  font-weight: 700;
}

.remove-item {
  width: 30px;
  height: 30px;
  background: rgba(220, 38, 38, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-item:hover {
  background: #dc2626;
  transform: rotate(90deg);
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-cart span {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-cart p {
  font-size: 1.1rem;
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(220, 38, 38, 0.05);
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.cart-total span {
  color: rgba(255, 255, 255, 0.7);
}

.cart-total strong {
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 900;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.checkout-btn:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.5);
}

/* User Menu */
.user-menu {
  position: absolute;
  top: calc(100% + 1rem);
  right: 2rem;
  width: 320px;
  background: rgba(20, 20, 20, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(220, 38, 38, 0.2);
  overflow: hidden;
}

.user-menu-header {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(139, 0, 0, 0.2) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar-large {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 2rem;
  overflow: hidden;
  border: 3px solid rgba(220, 38, 38, 0.5);
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-name-large {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.3rem 0;
}

.user-email {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin: 0 0 0.5rem 0;
}

.user-points {
  display: inline-block;
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
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

.user-menu-list a,
.logout-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.user-menu-list a:hover,
.logout-link:hover {
  background: rgba(220, 38, 38, 0.1);
  color: white;
  padding-left: 2rem;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.menu-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.menu-badge {
  margin-left: auto;
  background: #dc2626;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

.logout-link {
  color: #dc2626;
}

/* Progress Bar */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #dc2626 0%, #991b1b 100%);
  transition: width 0.1s linear;
  box-shadow: 0 0 10px rgba(220, 38, 38, 0.6);
}

/* Tooltips */
[data-tooltip] {
  position: relative;
}

[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%) scale(0);
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s;
  z-index: 10000;
}

[data-tooltip]:hover::after {
  transform: translateX(-50%) scale(1);
  opacity: 1;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Scrollbar Styling */
.notifications-list::-webkit-scrollbar,
.cart-items::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track,
.cart-items::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.notifications-list::-webkit-scrollbar-thumb,
.cart-items::-webkit-scrollbar-thumb {
  background: rgba(220, 38, 38, 0.5);
  border-radius: 10px;
}

.notifications-list::-webkit-scrollbar-thumb:hover,
.cart-items::-webkit-scrollbar-thumb:hover {
  background: rgba(220, 38, 38, 0.8);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .mega-menu {
    min-width: 500px;
  }
  
  .mega-menu-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .mega-menu-promo {
    grid-column: 1 / -1;
  }
}

@media (max-width: 968px) {
  .container {
    padding: 0 1.5rem;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 320px;
    height: 100vh;
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: stretch;
    padding: 5rem 0 2rem;
    gap: 0;
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    border-left: 1px solid rgba(220, 38, 38, 0.3);
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  }

  .nav.active {
    right: 0;
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 1rem;
  }

  .nav-title {
    color: white;
    font-size: 1.2rem;
    font-weight: 700;
  }

  .close-nav {
    background: rgba(220, 38, 38, 0.2);
    border: none;
    color: white;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
  }

  .close-nav:hover {
    background: #dc2626;
    transform: rotate(90deg);
  }

  .nav-link {
    padding: 1rem 1.5rem;
    border-radius: 0;
    border-left: 3px solid transparent;
  }

  .nav-link::before {
    display: none;
  }

  .nav-link.router-link-active {
    border-left-color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
  }

  .nav-icon {
    display: block;
    font-size: 1.3rem;
  }

  .nav-item-dropdown .nav-link {
    pointer-events: none;
  }

  .mega-menu {
    position: static;
    transform: none;
    margin: 0;
    min-width: auto;
    border-radius: 0;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem;
    background: rgba(0, 0, 0, 0.5);
  }

  .mega-menu-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .mobile-only-links {
    display: block;
    padding: 1rem 0;
  }

  .desktop-only {
    display: none;
  }

  .notifications-panel,
  .cart-panel,
  .user-menu {
    right: 1rem;
    width: calc(100vw - 2rem);
    max-width: 380px;
  }

  .search-container {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.2rem;
  }

  .logo-tagline {
    font-size: 0.6rem;
  }

  .search-box {
    padding: 1rem;
  }

  .search-box input {
    font-size: 1.1rem;
  }

  .notifications-panel,
  .cart-panel,
  .user-menu {
    width: calc(100vw - 1rem);
    right: 0.5rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print */
@media print {
  .header {
    position: static;
    box-shadow: none;
  }

  .mobile-menu-toggle,
  .header-actions,
  .search-overlay,
  .notifications-panel,
  .cart-panel,
  .user-menu,
  .progress-bar {
    display: none !important;
  }
}
</style>
