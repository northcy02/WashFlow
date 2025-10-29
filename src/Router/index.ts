// src/Router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Booking from '../pages/Booking.vue'
import Services from '../pages/Services.vue'
import CarTypes from '../pages/CarTypes.vue'
import History from '../pages/History.vue'
import Profile from '../pages/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/booking',
    name: 'Booking',
    component: Booking
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
    component: History
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(), // ✅ สำคัญ: ใช้ createWebHistory ไม่ใช่ createWebHashHistory
  routes
})

export default router