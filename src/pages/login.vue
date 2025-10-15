<template>
  <div class="login-page">
    <!-- Header Navigation -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <div class="logo-icon">🚗</div>
          <span class="logo-text">WASHFLOW</span>
        </div>
        
        <nav class="nav">
          <a href="/">การบริการ</a>
          <a href="/">จองคิวล้างรถ</a>
          <router-link to="/" class="active">HOME</router-link>
          <a href="/">ประเภทบริการ</a>
          <a href="/">ประวัติการใช้งาน</a>
        </nav>

        <div class="header-actions">
          <router-link to="/register">
            <button class="register-btn">REGISTER</button>
          </router-link>
          <router-link to="/login">
            <button class="login-btn">LOGIN NOW</button>
          </router-link>
          <button class="cart-btn">🛒</button>
          <button class="user-btn">👤</button>
        </div>
      </div>
    </header>

    <!-- Background with car wash image -->
    <div class="page-content">
      <!-- Login Form Modal -->
      <div class="login-modal">
        <h2 class="modal-title">LOGIN / เข้าสู่ระบบ</h2>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>USERNAME</label>
            <input 
              v-model="formData.username" 
              type="text" 
              placeholder=""
              required
            >
          </div>

          <div class="form-group">
            <label>PASSWORD</label>
            <input 
              v-model="formData.password" 
              type="password" 
              placeholder=""
              required
            >
          </div>

          <button type="submit" class="login-submit-btn">LOGIN</button>
        </form>

        <div class="register-link">
          <router-link to="/register">register / สมัครการใช้งาน</router-link>
        </div>
      </div>

      <!-- Bottom Text -->
      <div class="bottom-text">
        <h3>CYBERCAR ศูนย์มาตราฐานทำความสะอาดรถยนต์</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = reactive({
  username: '',
  password: ''
})

const handleLogin = () => {
  if (!formData.username || !formData.password) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน!')
    return
  }
  
  console.log('Login:', formData)
  alert('เข้าสู่ระบบสำเร็จ!')
  
  // Redirect to home
  router.push('/')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), 
              url('https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1920') center/cover no-repeat;
  color: white;
  font-family: 'Rajdhani', 'Sarabun', sans-serif;
  position: relative;
}

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
}

.header .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
  font-weight: 400;
}

.nav a.active {
  color: white;
  font-weight: 700;
}

.nav a:hover {
  color: #dc2626;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.register-btn, .login-btn {
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

.register-btn:hover, .login-btn:hover {
  background: white;
  color: #000;
  transform: translateY(-1px);
}

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
}

/* Page Content */
.page-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 6rem 2rem 3rem;
  position: relative;
  z-index: 1;
}

/* Login Modal */
.login-modal {
  background: rgba(60, 50, 50, 0.88);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 2.5rem 3.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
}

.modal-title {
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 2rem;
  color: white;
  font-weight: 500;
  letter-spacing: 1px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-left: 0.2rem;
}

.form-group input {
  background: rgba(120, 110, 110, 0.6);
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1.3rem;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-group input:focus {
  outline: none;
  background: rgba(120, 110, 110, 0.75);
}

.login-submit-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s;
  text-transform: uppercase;
}

.login-submit-btn:hover {
  background: white;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.register-link a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
  font-weight: 400;
}

.register-link a:hover {
  color: #dc2626;
}

/* Bottom Text */
.bottom-text {
  position: absolute;
  bottom: 2rem;
  text-align: center;
}

.bottom-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
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
  
  .login-modal {
    padding: 2rem 1.5rem;
  }
  
  .modal-title {
    font-size: 1.4rem;
  }
  
  .bottom-text h3 {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
}
</style>