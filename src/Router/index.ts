// src/Router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Booking from '../pages/Booking.vue'
import History from '../pages/History.vue'
import Profile from '../pages/Profile.vue'
import Services from '../pages/Services.vue'
import CarTypes from '../pages/CarTypes.vue'
import EmployeeDashboard from '../pages/employee/EmployeeDashboard.vue'
import EmployeeManagement from '../pages/employee/EmployeeManagement.vue'
import PaymentManagement from '../pages/employee/PaymentManagement.vue'
import Membership from '@/pages/Membership.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
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
    path: '/membership',
    nmname: 'Membership',
    component: Membership,
    meta: { requiresAuth: true }
  },
  
  // ========================================
  // EMPLOYEE ROUTES
  // ========================================
  {
    path: '/employee/dashboard',
    name: 'EmployeeDashboard',
    component: EmployeeDashboard,
    meta: { requiresEmployee: true }
  },
  {
    path: '/employee/management',
    name: 'EmployeeManagement',
    component: EmployeeManagement,
    meta: { requiresEmployee: true, requiresManager: true }
  },
  {
    path: '/employee/payment',  // ✅ แก้ไข: เอา 's' ออก
    name: 'PaymentManagement',
    component: PaymentManagement,
    meta: { requiresEmployee: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ========================================
// NAVIGATION GUARDS
// ========================================
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const isEmployeeLoggedIn = localStorage.getItem('isEmployeeLoggedIn') === 'true'
  
  // Check Manager role
  let isManager = false
  if (isEmployeeLoggedIn) {
    const empStr = localStorage.getItem('employee')
    if (empStr) {
      const emp = JSON.parse(empStr)
      isManager = emp.role === 'Manager'
    }
  }
  
  console.log('🔒 Route Guard:', {
    to: to.path,
    isLoggedIn,
    isEmployeeLoggedIn,
    isManager,
    requiresEmployee: to.meta.requiresEmployee,
    requiresManager: to.meta.requiresManager
  })
  
  // Manager only routes
  if (to.meta.requiresManager && !isManager) {
    console.log('⛔ Access denied: Manager only')
    next('/employee/dashboard')
    return
  }
  
  // Employee routes
  if (to.meta.requiresEmployee) {
    if (!isEmployeeLoggedIn) {
      console.log('⛔ Access denied: Employee login required')
      next('/login')
    } else {
      console.log('✅ Access granted: Employee')
      next()
    }
  }
  // Customer routes
  else if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      console.log('⛔ Access denied: Customer login required')
      next('/login')
    } else {
      console.log('✅ Access granted: Customer')
      next()
    }
  }
  // Guest only routes
  else if (to.meta.requiresGuest) {
    if (isEmployeeLoggedIn) {
      console.log('↩️ Redirect: Already logged in as Employee')
      next('/employee/dashboard')
    } else if (isLoggedIn) {
      console.log('↩️ Redirect: Already logged in as Customer')
      next('/')
    } else {
      console.log('✅ Access granted: Guest')
      next()
    }
  }
  else {
    console.log('✅ Access granted: Public route')
    next()
  }
})

export default router
