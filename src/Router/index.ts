import { createRouter, createWebHistory } from 'vue-router'
import Index from '../pages/index.vue'
import Register from '../pages/register.vue'
import Login from '../pages/login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router