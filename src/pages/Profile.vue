<!-- src/pages/profile.vue -->
<template>
  <div class="profile-page">
    <Navigator />

    <!-- Alert -->
    <transition name="fade">
      <div v-if="alertMessage" :class="['alert', alertType]">
        <span class="icon">{{ alertIcon }}</span>
        <span>{{ alertMessage }}</span>
        <button @click="closeAlert">×</button>
      </div>
    </transition>

    <section class="main">
      <div class="container">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="avatar-large">
            <span>{{ userData.username.charAt(0).toUpperCase() }}</span>
          </div>
          <h1>{{ userData.fullName }}</h1>
          <p class="username">@{{ userData.username }}</p>
          <p class="member-since">สมาชิกตั้งแต่: {{ formatDate(userData.memberSince) }}</p>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button 
            :class="['tab', { active: activeTab === 'info' }]" 
            @click="activeTab = 'info'"
          >
            <span class="tab-icon">📋</span>
            <span>ข้อมูลส่วนตัว</span>
          </button>
          <button 
            :class="['tab', { active: activeTab === 'password' }]" 
            @click="activeTab = 'password'"
          >
            <span class="tab-icon">🔐</span>
            <span>เปลี่ยนรหัสผ่าน</span>
          </button>
          <button 
            :class="['tab', { active: activeTab === 'danger' }]" 
            @click="activeTab = 'danger'"
          >
            <span class="tab-icon">⚠️</span>
            <span>ลบบัญชี</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Tab 1: ข้อมูลส่วนตัว -->
          <div v-if="activeTab === 'info'" class="tab-panel">
            <h2>แก้ไขข้อมูลส่วนตัว</h2>
            
            <form @submit.prevent="handleUpdateProfile">
              <div class="form-row">
                <div class="form-field">
                  <label>ชื่อ <span class="required">*</span></label>
                  <input 
                    v-model="profileForm.firstName" 
                    type="text" 
                    placeholder="ชื่อจริง"
                    required
                    :disabled="isLoading"
                  >
                </div>

                <div class="form-field">
                  <label>นามสกุล <span class="required">*</span></label>
                  <input 
                    v-model="profileForm.lastName" 
                    type="text" 
                    placeholder="นามสกุล"
                    required
                    :disabled="isLoading"
                  >
                </div>
              </div>

              <div class="form-field">
                <label>เบอร์โทรศัพท์</label>
                <input 
                  v-model="profileForm.phone" 
                  type="tel" 
                  placeholder="081-234-5678"
                  :disabled="isLoading"
                  @input="formatPhoneNumber"
                >
                <small>รูปแบบ: 081-234-5678</small>
              </div>

              <div class="form-field">
                <label>ที่อยู่</label>
                <textarea 
                  v-model="profileForm.address" 
                  placeholder="ที่อยู่สำหรับจัดส่งเอกสาร"
                  rows="4"
                  :disabled="isLoading"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="resetProfileForm" :disabled="isLoading">
                  ยกเลิก
                </button>
                <button type="submit" class="btn-primary" :disabled="isLoading">
                  <span v-if="!isLoading">บันทึกการเปลี่ยนแปลง</span>
                  <span v-else class="loading">
                    <span class="spinner"></span>
                    กำลังบันทึก...
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Tab 2: เปลี่ยนรหัสผ่าน -->
          <div v-if="activeTab === 'password'" class="tab-panel">
            <h2>เปลี่ยนรหัสผ่าน</h2>
            
            <form @submit.prevent="handleChangePassword">
              <div class="form-field">
                <label>รหัสผ่านเดิม <span class="required">*</span></label>
                <div class="password-input">
                  <input 
                    v-model="passwordForm.oldPassword" 
                    :type="showOldPassword ? 'text' : 'password'"
                    placeholder="กรอกรหัสผ่านเดิม"
                    required
                    :disabled="isLoading"
                  >
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showOldPassword = !showOldPassword"
                    :disabled="isLoading"
                  >
                    {{ showOldPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
              </div>

              <div class="form-field">
                <label>รหัสผ่านใหม่ <span class="required">*</span></label>
                <div class="password-input">
                  <input 
                    v-model="passwordForm.newPassword" 
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    required
                    :disabled="isLoading"
                  >
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showNewPassword = !showNewPassword"
                    :disabled="isLoading"
                  >
                    {{ showNewPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <small v-if="passwordError" class="error">{{ passwordError }}</small>
              </div>

              <div class="form-field">
                <label>ยืนยันรหัสผ่านใหม่ <span class="required">*</span></label>
                <div class="password-input">
                  <input 
                    v-model="passwordForm.confirmPassword" 
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    required
                    :disabled="isLoading"
                  >
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showConfirmPassword = !showConfirmPassword"
                    :disabled="isLoading"
                  >
                    {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <small v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</small>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="resetPasswordForm" :disabled="isLoading">
                  ยกเลิก
                </button>
                <button type="submit" class="btn-primary" :disabled="isLoading">
                  <span v-if="!isLoading">เปลี่ยนรหัสผ่าน</span>
                  <span v-else class="loading">
                    <span class="spinner"></span>
                    กำลังเปลี่ยน...
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Tab 3: ลบบัญชี -->
          <div v-if="activeTab === 'danger'" class="tab-panel danger-zone">
            <h2>ลบบัญชี</h2>
            
            <div class="warning-box">
              <span class="warning-icon">⚠️</span>
              <div>
                <h3>คำเตือน</h3>
                <p>การลบบัญชีจะไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมดจะถูกลบอย่างถาวร</p>
              </div>
            </div>

            <form @submit.prevent="handleDeleteAccount">
              <div class="form-field">
                <label>ยืนยันรหัสผ่าน <span class="required">*</span></label>
                <div class="password-input">
                  <input 
                    v-model="deleteForm.password" 
                    :type="showDeletePassword ? 'text' : 'password'"
                    placeholder="กรอกรหัสผ่านเพื่อยืนยัน"
                    required
                    :disabled="isLoading"
                  >
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showDeletePassword = !showDeletePassword"
                    :disabled="isLoading"
                  >
                    {{ showDeletePassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
              </div>

              <div class="checkbox-field">
                <input 
                  type="checkbox" 
                  id="confirmDelete" 
                  v-model="deleteForm.confirm"
                  :disabled="isLoading"
                >
                <label for="confirmDelete">
                  ฉันเข้าใจว่าการลบบัญชีจะไม่สามารถย้อนกลับได้
                </label>
              </div>

              <div class="form-actions">
                <button 
                  type="submit" 
                  class="btn-danger" 
                  :disabled="!deleteForm.confirm || isLoading"
                >
                  <span v-if="!isLoading">ลบบัญชีถาวร</span>
                  <span v-else class="loading">
                    <span class="spinner"></span>
                    กำลังลบ...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import Navigator from '@/components/Navigator.vue'

const router = useRouter()

// State
const activeTab = ref('info')
const isLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('')

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const showDeletePassword = ref(false)

const passwordError = ref('')
const confirmPasswordError = ref('')

// User Data
const userData = reactive({
  id: 0,
  username: '',
  firstName: '',
  lastName: '',
  fullName: '',
  phone: '',
  address: '',
  memberSince: ''
})

// Forms
const profileForm = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  address: ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const deleteForm = reactive({
  password: '',
  confirm: false
})

// Computed
const alertIcon = computed(() => {
  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠'
  };
  return icons[alertType.value] || '!';
})

// Methods
const loadUserData = () => {
  try {
    const userStr = localStorage.getItem('user')
    const isLoggedIn = localStorage.getItem('isLoggedIn')

    console.log('🔍 Loading user data...')
    console.log('User string:', userStr)
    console.log('Is logged in:', isLoggedIn)

    if (!userStr || isLoggedIn !== 'true') {
      console.log('❌ No user data or not logged in, redirecting to login')
      router.push('/login')
      return
    }

    const user = JSON.parse(userStr)
    console.log('👤 Parsed user:', user)
    
    // ✅ Set user data with fallback values
    userData.id = user.id || 0
    userData.username = user.username || ''
    userData.firstName = user.firstName || user.cust_fname || ''
    userData.lastName = user.lastName || user.cust_lname || ''
    userData.fullName = user.fullName || `${userData.firstName} ${userData.lastName}`.trim() || user.username
    userData.phone = user.phone || user.cust_tel || ''
    userData.address = user.address || user.cust_address || ''
    userData.memberSince = user.memberSince || user.created_at || new Date().toISOString()

    console.log('✅ User data loaded:', {
      id: userData.id,
      username: userData.username,
      fullName: userData.fullName
    })

    // ✅ Set form data
    resetProfileForm()

  } catch (error) {
    console.error('❌ Error loading user data:', error)
    
    // แสดง error message
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้',
      icon: 'error',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    }).then(() => {
      router.push('/login')
    })
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return '-'
  }
}

const formatPhoneNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  if (value.length > 10) {
    value = value.substring(0, 10)
  }
  
  if (value.length > 6) {
    profileForm.phone = `${value.substring(0, 3)}-${value.substring(3, 6)}-${value.substring(6)}`
  } else if (value.length > 3) {
    profileForm.phone = `${value.substring(0, 3)}-${value.substring(3)}`
  } else {
    profileForm.phone = value
  }
}

const showAlert = (message: string, type: string = 'error') => {
  alertMessage.value = message
  alertType.value = type
  setTimeout(() => closeAlert(), 4000)
}

const closeAlert = () => {
  alertMessage.value = ''
  alertType.value = ''
}

const resetProfileForm = () => {
  profileForm.firstName = userData.firstName
  profileForm.lastName = userData.lastName
  profileForm.phone = userData.phone
  profileForm.address = userData.address
}

const resetPasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  showOldPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

// Handle Update Profile
const handleUpdateProfile = async () => {
  if (!profileForm.firstName || !profileForm.lastName) {
    showAlert('กรุณากรอกชื่อและนามสกุล', 'warning')
    return
  }

  if (profileForm.phone) {
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
    if (!phoneRegex.test(profileForm.phone)) {
      showAlert('รูปแบบเบอร์โทรไม่ถูกต้อง', 'warning')
      return
    }
  }

  isLoading.value = true

  try {
    const res = await axios.put(`http://localhost:3000/api/auth/profile/${userData.id}`, {
      cust_fname: profileForm.firstName,
      cust_lname: profileForm.lastName,
      cust_tel: profileForm.phone || null,
      cust_address: profileForm.address || null
    })

    if (res.data.success) {
      // Update userData
      userData.firstName = profileForm.firstName
      userData.lastName = profileForm.lastName
      userData.fullName = `${profileForm.firstName} ${profileForm.lastName}`
      userData.phone = profileForm.phone
      userData.address = profileForm.address

      // Update localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        fullName: `${profileForm.firstName} ${profileForm.lastName}`,
        phone: profileForm.phone,
        address: profileForm.address
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Notify Navigator
      window.dispatchEvent(new CustomEvent('loginStatusChanged'))

      showAlert('อัพเดทข้อมูลสำเร็จ!', 'success')
    }

  } catch (err: any) {
    console.error('❌ Update error:', err)
    showAlert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพเดท', 'error')
  } finally {
    isLoading.value = false
  }
}

// Handle Change Password
const handleChangePassword = async () => {
  passwordError.value = ''
  confirmPasswordError.value = ''

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'
    showAlert('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', 'warning')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    confirmPasswordError.value = 'รหัสผ่านไม่ตรงกัน'
    showAlert('รหัสผ่านไม่ตรงกัน', 'error')
    return
  }

  isLoading.value = true

  try {
    const res = await axios.put(`http://localhost:3000/api/auth/change-password/${userData.id}`, {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })

    if (res.data.success) {
      resetPasswordForm()
      showAlert('เปลี่ยนรหัสผ่านสำเร็จ!', 'success')
      
      await Swal.fire({
        title: 'เปลี่ยนรหัสผ่านสำเร็จ!',
        text: 'กรุณาเข้าสู่ระบบใหม่ด้วยรหัสผ่านใหม่',
        icon: 'success',
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      })

      // Logout and redirect to login
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      window.dispatchEvent(new CustomEvent('loginStatusChanged'))
      router.push('/login')
    }

  } catch (err: any) {
    console.error('❌ Change password error:', err)
    showAlert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', 'error')
  } finally {
    isLoading.value = false
  }
}

// Handle Delete Account
const handleDeleteAccount = async () => {
  if (!deleteForm.confirm) {
    showAlert('กรุณายืนยันการลบบัญชี', 'warning')
    return
  }

  const result = await Swal.fire({
    title: 'ยืนยันการลบบัญชี',
    html: `
      <p style="color: #ef4444; font-size: 1.1rem; margin-bottom: 1rem;">
        ⚠️ คำเตือน
      </p>
      <p>การลบบัญชีจะไม่สามารถย้อนกลับได้</p>
      <p>ข้อมูลทั้งหมดจะถูกลบอย่างถาวร</p>
    `,
    icon: 'warning',
    iconColor: '#ef4444',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'ยืนยันลบบัญชี',
    cancelButtonText: 'ยกเลิก',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  })

  if (!result.isConfirmed) return

  isLoading.value = true

  try {
    const res = await axios.delete(`http://localhost:3000/api/auth/delete/${userData.id}`, {
      data: { password: deleteForm.password }
    })

    if (res.data.success) {
      await Swal.fire({
        title: 'ลบบัญชีสำเร็จ',
        text: 'ขอบคุณที่ใช้บริการ',
        icon: 'success',
        confirmButtonColor: '#dc2626',
        background: 'rgba(30, 30, 30, 0.98)',
        color: '#ffffff'
      })

      // Logout
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
      window.dispatchEvent(new CustomEvent('loginStatusChanged'))
      router.push('/login')
    }

  } catch (err: any) {
    console.error('❌ Delete error:', err)
    showAlert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบบัญชี', 'error')
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* Alert */
.alert {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.alert.success {
  border: 2px solid #10b981;
  color: #10b981;
}

.alert.error {
  border: 2px solid #ef4444;
  color: #ef4444;
}

.alert.warning {
  border: 2px solid #f59e0b;
  color: #f59e0b;
}

.alert .icon {
  font-size: 1.5rem;
  font-weight: 700;
}

.alert button {
  margin-left: auto;
  background: none;
  border: none;
  color: inherit;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.alert button:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Main */
.main {
  margin-top: 80px;
  padding: 3rem 2rem;
  min-height: calc(100vh - 80px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

/* Profile Header */
.profile-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
  border: 4px solid rgba(220, 38, 38, 0.5);
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4);
}

.profile-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.username {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.member-since {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Kanit', sans-serif;
}

.tab:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

.tab.active {
  color: #dc2626;
  border-bottom-color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Tab Content */
.tab-content {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2.5rem;
}

.tab-panel h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #dc2626;
}

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.required {
  color: #dc2626;
}

.form-field input,
.form-field textarea {
  padding: 0.9rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
  font-family: 'Kanit', sans-serif;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
}

.form-field input:disabled,
.form-field textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-field textarea {
  resize: vertical;
}

.form-field small {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.form-field small.error {
  color: #ef4444;
}

/* Password Input */
.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  flex: 1;
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  transition: color 0.3s;
}

.toggle-password:hover:not(:disabled) {
  color: #dc2626;
}

.toggle-password:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Checkbox */
.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
}

.checkbox-field input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #ef4444;
  cursor: pointer;
}

.checkbox-field label {
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 0.9rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-family: 'Kanit', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #dc2626;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-danger {
  background: #ef4444;
  color: #fff;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
}

.btn-primary:disabled,
.btn-secondary:disabled,
.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Danger Zone */
.danger-zone {
  border: 2px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
}

.warning-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.warning-icon {
  font-size: 2rem;
}

.warning-box h3 {
  color: #ef4444;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.warning-box p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

/* Responsive */
@media (max-width: 768px) {
  .main {
    padding: 2rem 1rem;
  }

  .container {
    padding: 0;
  }

  .profile-header {
    padding: 1.5rem;
  }

  .avatar-large {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }

  .profile-header h1 {
    font-size: 1.5rem;
  }

  .tabs {
    flex-direction: column;
    gap: 0.5rem;
  }

  .tab {
    border-bottom: none;
    border-left: 3px solid transparent;
  }

  .tab.active {
    border-left-color: #dc2626;
    border-bottom-color: transparent;
  }

  .tab-content {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-danger {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .tab-content {
    padding: 1rem;
  }

  .tab-panel h2 {
    font-size: 1.3rem;
  }

  .warning-box {
    flex-direction: column;
    text-align: center;
  }
}
</style>