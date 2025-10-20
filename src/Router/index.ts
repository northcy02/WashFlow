import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/login.vue'
import Register from '../pages/register.vue'
import Booking from '../pages/Booking.vue'
import Services from '../pages/Services.vue'
import CarTypes from '../pages/CarTypes.vue'
import History from '../pages/History.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(), // ✅ สำคัญ: ใช้ createWebHistory ไม่ใช่ createWebHashHistory
  routes
})

export default router