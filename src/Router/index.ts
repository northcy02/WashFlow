// src/Router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Swal from 'sweetalert2'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Booking from '../pages/Booking.vue'
import Services from '../pages/Services.vue'
import CarTypes from '../pages/CarTypes.vue'
import History from '../pages/History.vue'
import Profile from '../pages/Profile.vue'
import EmployeeDashboard from '../pages/employee/EmployeeDashboard.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
    meta: { requiresGuest: true }
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register,
    meta: { requiresGuest: true }
  },
  { 
    path: '/booking', 
    name: 'Booking', 
    component: Booking,
    meta: { requiresAuth: true }
  },
  { 
    path: '/services', 
    name: 'Services', 
    component: Services
  },
  { 
    path: '/car-types', 
    name: 'CarTypes', 
    component: CarTypes
  },
  { 
    path: '/history', 
    name: 'History', 
    component: History,
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/employee/dashboard',
    name: 'EmployeeDashboard',
    component: EmployeeDashboard,
    meta: { requiresEmployee: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Navigation Guard (ปรับปรุงแล้ว)
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const isEmployee = localStorage.getItem('isEmployeeLoggedIn') === 'true'

  console.log('🔍 Route Guard:', {
    to: to.path,
    from: from.path,
    isLoggedIn,
    isEmployee
  })

  // ✅ 1. Home Route
  if (to.path === '/') {
    if (isEmployee) {
      // ป้องกัน infinite loop
      if (from.path === '/employee/dashboard') {
        next(false)
        return
      }
      next('/employee/dashboard')
      return
    }
    // Customer หรือ Guest ผ่านได้
    next()
    return
  }

  // ✅ 2. Employee Only Pages
  if (to.meta.requiresEmployee) {
    if (!isEmployee) {
      Swal.fire({
        title: 'ต้องเข้าสู่ระบบพนักงาน',
        text: 'กรุณาเข้าสู่ระบบด้วยบัญชีพนักงาน',
        icon: 'warning',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'ไปหน้าเข้าสู่ระบบ',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff',
        timer: 3000,
        timerProgressBar: true
      })
      next('/login')
      return
    }
    next()
    return
  }

  // ✅ 3. Customer Only Pages
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      Swal.fire({
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบก่อนใช้งานฟีเจอร์นี้',
        icon: 'warning',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'เข้าสู่ระบบ',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff',
        timer: 3000,
        timerProgressBar: true
      })
      next('/login')
      return
    }
    next()
    return
  }

  // ✅ 4. Guest Only Pages (Login/Register)
  if (to.meta.requiresGuest) {
    if (isEmployee) {
      next('/employee/dashboard')
      return
    }
    if (isLoggedIn) {
      next('/')
      return
    }
    next()
    return
  }

  // ✅ 5. Public Pages
  next()
})

export default router
