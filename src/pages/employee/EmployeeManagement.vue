<!-- src/pages/employee/EmployeeManagement.vue -->
<template>
  <div class="employee-management-page">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="header-content">
          <button @click="goBack" class="btn-back">
            ← กลับ
          </button>
          <div class="header-title">
            <h1>👥 จัดการพนักงาน</h1>
            <p>เพิ่ม แก้ไข ลบ พนักงาน</p>
          </div>
          <button @click="openAddModal" class="btn-add">
            + เพิ่มพนักงาน
          </button>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>{{ employeeStats.total }}</h3>
              <p>พนักงานทั้งหมด</p>
            </div>
          </div>
          <div class="stat-card manager">
            <div class="stat-icon">👨‍💼</div>
            <div class="stat-info">
              <h3>{{ employeeStats.managers }}</h3>
              <p>Manager</p>
            </div>
          </div>
          <div class="stat-card cashier">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>{{ employeeStats.cashiers }}</h3>
              <p>Cashier</p>
            </div>
          </div>
          <div class="stat-card cleaner">
            <div class="stat-icon">🧼</div>
            <div class="stat-info">
              <h3>{{ employeeStats.cleaners }}</h3>
              <p>Cleaner</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="filters-section">
      <div class="container">
        <div class="filters">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="🔍 ค้นหาพนักงาน..."
              @input="filterEmployees"
            >
          </div>
          <select v-model="filterRole" @change="filterEmployees" class="filter-select">
            <option value="">ทุกตำแหน่ง</option>
            <option value="Manager">Manager</option>
            <option value="Cashier">Cashier</option>
            <option value="Cleaner">Cleaner</option>
          </select>
          <select v-model="filterBranch" @change="filterEmployees" class="filter-select">
            <option value="">ทุกสาขา</option>
            <option v-for="branch in branches" :key="branch.branch_ID" :value="branch.branch_ID">
              {{ branch.branch_name }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <!-- Employee List -->
    <section class="employee-list-section">
      <div class="container">
        <div class="employee-grid">
          <div 
            v-for="employee in filteredEmployees" 
            :key="employee.emp_ID"
            class="employee-card"
          >
            <div class="card-header">
              <div class="employee-avatar">
                {{ employee.emp_fname.charAt(0) }}{{ employee.emp_lname.charAt(0) }}
              </div>
              <div class="role-badge" :class="getRoleClass(employee.Role_name)">
                {{ employee.Role_name }}
              </div>
            </div>

            <div class="card-body">
              <h3>{{ employee.emp_fname }} {{ employee.emp_lname }}</h3>
              <div class="employee-details">
                <div class="detail-item">
                  <span class="label">👤 Username:</span>
                  <span class="value">{{ employee.emp_username }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">🏢 สาขา:</span>
                  <span class="value">{{ employee.branch_name }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">💰 เงินเดือน:</span>
                  <span class="value salary">฿{{ employee.salary?.toLocaleString() }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">📅 เข้าทำงาน:</span>
                  <span class="value">{{ formatDate(employee.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="card-actions">
              <button @click="openEditModal(employee)" class="btn-edit">
                ✏️ แก้ไข
              </button>
              <button @click="deleteEmployee(employee)" class="btn-delete">
                🗑️ ลบ
              </button>
            </div>
          </div>

          <div v-if="filteredEmployees.length === 0" class="empty-state">
            <span class="icon">📭</span>
            <p>ไม่พบพนักงาน</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Add/Edit Modal -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditMode ? '✏️ แก้ไขพนักงาน' : '+ เพิ่มพนักงาน' }}</h2>
            <button @click="closeModal" class="btn-close">×</button>
          </div>

          <form @submit.prevent="saveEmployee" class="modal-body">
            <div class="form-row">
              <div class="form-field">
                <label>ชื่อ <span class="required">*</span></label>
                <input 
                  v-model="formData.emp_fname" 
                  type="text" 
                  placeholder="ชื่อจริง"
                  required
                >
              </div>
              <div class="form-field">
                <label>นามสกุล <span class="required">*</span></label>
                <input 
                  v-model="formData.emp_lname" 
                  type="text" 
                  placeholder="นามสกุล"
                  required
                >
              </div>
            </div>

            <div class="form-field">
              <label>ที่อยู่</label>
              <textarea 
                v-model="formData.emp_address" 
                placeholder="ที่อยู่"
                rows="3"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>Username <span class="required">*</span></label>
                <input 
                  v-model="formData.emp_username" 
                  type="text" 
                  placeholder="Username"
                  required
                  :disabled="isEditMode"
                >
                <small v-if="isEditMode">ไม่สามารถแก้ไข Username ได้</small>
              </div>
              <div class="form-field" v-if="!isEditMode">
                <label>Password <span class="required">*</span></label>
                <input 
                  v-model="formData.emp_password" 
                  type="password" 
                  placeholder="รหัสผ่าน"
                  :required="!isEditMode"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label>สาขา <span class="required">*</span></label>
                <select v-model="formData.branch_ID" required>
                  <option value="">เลือกสาขา</option>
                  <option v-for="branch in branches" :key="branch.branch_ID" :value="branch.branch_ID">
                    {{ branch.branch_name }}
                  </option>
                </select>
              </div>
              <div class="form-field">
                <label>ตำแหน่ง <span class="required">*</span></label>
                <select v-model="formData.role_ID" required>
                  <option value="">เลือกตำแหน่ง</option>
                  <option v-for="role in roles" :key="role.Role_ID" :value="role.Role_ID">
                    {{ role.Role_name }} (฿{{ role.salary?.toLocaleString() }})
                  </option>
                </select>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-cancel">
                ยกเลิก
              </button>
              <button type="submit" class="btn-save" :disabled="isLoading">
                <span v-if="!isLoading">{{ isEditMode ? 'บันทึก' : 'เพิ่มพนักงาน' }}</span>
                <span v-else class="loading">
                  <span class="spinner"></span>
                  กำลังบันทึก...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const router = useRouter();

// ========================================
// STATE
// ========================================
const employees = ref<any[]>([]);
const filteredEmployees = ref<any[]>([]);
const branches = ref<any[]>([]);
const roles = ref<any[]>([]);
const searchQuery = ref('');
const filterRole = ref('');
const filterBranch = ref('');
const showModal = ref(false);
const isEditMode = ref(false);
const isLoading = ref(false);

const formData = ref({
  emp_ID: 0,
  emp_fname: '',
  emp_lname: '',
  emp_address: '',
  emp_username: '',
  emp_password: '',
  branch_ID: '',
  role_ID: ''
});

// ========================================
// COMPUTED
// ========================================
const employeeStats = computed(() => {
  return {
    total: employees.value.length,
    managers: employees.value.filter(e => e.Role_name === 'Manager').length,
    cashiers: employees.value.filter(e => e.Role_name === 'Cashier').length,
    cleaners: employees.value.filter(e => e.Role_name === 'Cleaner').length
  };
});

// ========================================
// METHODS
// ========================================
const goBack = () => {
  router.push('/employee/dashboard');
};

const loadEmployees = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/employee/all');
    if (response.data.success) {
      employees.value = response.data.employees;
      filteredEmployees.value = employees.value;
    }
  } catch (error) {
    console.error('❌ Error loading employees:', error);
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถโหลดข้อมูลพนักงานได้',
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  }
};

const loadBranches = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/branch/all');
    if (response.data.success) {
      branches.value = response.data.branches;
    }
  } catch (error) {
    console.error('❌ Error loading branches:', error);
  }
};

const loadRoles = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/role/all');
    if (response.data.success) {
      roles.value = response.data.roles;
    }
  } catch (error) {
    console.error('❌ Error loading roles:', error);
  }
};

const filterEmployees = () => {
  let result = employees.value;

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(e => 
      e.emp_fname.toLowerCase().includes(query) ||
      e.emp_lname.toLowerCase().includes(query) ||
      e.emp_username.toLowerCase().includes(query)
    );
  }

  // Role filter
  if (filterRole.value) {
    result = result.filter(e => e.Role_name === filterRole.value);
  }

  // Branch filter
  if (filterBranch.value) {
    result = result.filter(e => e.branch_ID === parseInt(filterBranch.value));
  }

  filteredEmployees.value = result;
};

const openAddModal = () => {
  isEditMode.value = false;
  resetForm();
  showModal.value = true;
};

const openEditModal = (employee: any) => {
  isEditMode.value = true;
  formData.value = {
    emp_ID: employee.emp_ID,
    emp_fname: employee.emp_fname,
    emp_lname: employee.emp_lname,
    emp_address: employee.emp_address,
    emp_username: employee.emp_username,
    emp_password: '',
    branch_ID: employee.branch_ID,
    role_ID: employee.role_ID
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    emp_ID: 0,
    emp_fname: '',
    emp_lname: '',
    emp_address: '',
    emp_username: '',
    emp_password: '',
    branch_ID: '',
    role_ID: ''
  };
};

const saveEmployee = async () => {
  isLoading.value = true;

  try {
    let response;

    if (isEditMode.value) {
      // Update
      response = await axios.put(
        `http://localhost:3000/api/employee/update/${formData.value.emp_ID}`,
        formData.value
      );
    } else {
      // Create
      response = await axios.post(
        'http://localhost:3000/api/employee/create',
        formData.value
      );
    }

    if (response.data.success) {
      await Swal.fire({
        title: 'สำเร็จ!',
        text: isEditMode.value ? 'แก้ไขพนักงานสำเร็จ' : 'เพิ่มพนักงานสำเร็จ',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000
      });

      closeModal();
      loadEmployees();
    }

  } catch (error: any) {
    console.error('❌ Save Error:', error);
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.response?.data?.message || 'ไม่สามารถบันทึกได้',
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  } finally {
    isLoading.value = false;
  }
};

const deleteEmployee = async (employee: any) => {
  const result = await Swal.fire({
    title: 'ยืนยันการลบ?',
    html: `
      <p>ต้องการลบพนักงาน</p>
      <p style="color: #dc2626; font-weight: 700; margin-top: 0.5rem;">
        ${employee.emp_fname} ${employee.emp_lname}
      </p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/employee/delete/${employee.emp_ID}`
      );

      if (response.data.success) {
        await Swal.fire({
          title: 'ลบสำเร็จ!',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000
        });

        loadEmployees();
      }

    } catch (error: any) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: error.response?.data?.message || 'ไม่สามารถลบได้',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  }
};

const getRoleClass = (roleName: string) => {
  const roleMap: Record<string, string> = {
    'Manager': 'role-manager',
    'Cashier': 'role-cashier',
    'Cleaner': 'role-cleaner'
  };
  return roleMap[roleName] || '';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// ========================================
// LIFECYCLE
// ========================================
onMounted(() => {
  loadEmployees();
  loadBranches();
  loadRoles();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.employee-management-page {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* ========================================
   HEADER
======================================== */
.page-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
  border-bottom: 2px solid rgba(220, 38, 38, 0.3);
  padding: 2rem 0;
}

.page-header .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-back {
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.header-title h1 {
  font-size: 2rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.3rem;
}

.header-title p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
}

.btn-add {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-add:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
}

/* ========================================
   STATS
======================================== */
.stats-section {
  padding: 2rem;
  background: #0a0a0a;
}

.stats-section .container {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.stat-card.manager {
  border-color: rgba(220, 38, 38, 0.5);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(153, 27, 27, 0.1));
}

.stat-card.cashier {
  border-color: rgba(251, 191, 36, 0.5);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
}

.stat-card.cleaner {
  border-color: rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
}

.stat-icon {
  font-size: 3rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.stat-info h3 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.3rem;
}

.stat-info p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
}

/* ========================================
   FILTERS
======================================== */
.filters-section {
  padding: 0 2rem 2rem;
  background: #0a0a0a;
}

.filters-section .container {
  max-width: 1400px;
  margin: 0 auto;
}

.filters {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
}

.search-box input {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
}

.filter-select {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #dc2626;
}

.filter-select option {
  background: #1a1a1a;
  color: #fff;
}

/* ========================================
   EMPLOYEE LIST
======================================== */
.employee-list-section {
  padding: 2rem;
  background: #0a0a0a;
}

.employee-list-section .container {
  max-width: 1400px;
  margin: 0 auto;
}

.employee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.employee-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}

.employee-card:hover {
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
}

.card-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(153, 27, 27, 0.1));
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.employee-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
}

.role-badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
}

.role-manager {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: #fff;
}

.role-cashier {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
}

.role-cleaner {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
}

.card-body {
  padding: 1.5rem;
}

.card-body h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
}

.employee-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.detail-item .label {
  color: rgba(255, 255, 255, 0.6);
}

.detail-item .value {
  color: #fff;
  font-weight: 600;
}

.detail-item .salary {
  color: #10b981;
  font-weight: 700;
}

.card-actions {
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.card-actions button {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-edit {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.empty-state .icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ========================================
   MODAL
======================================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: #1a1a1a;
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #dc2626;
}

.btn-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  border: 2px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.btn-close:hover {
  background: #ef4444;
  color: #fff;
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-field label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.required {
  color: #dc2626;
}

.form-field input,
.form-field textarea,
.form-field select {
  padding: 1rem 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: #dc2626;
}

.form-field input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-field select option {
  background: #1a1a1a;
  color: #fff;
}

.form-field small {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-actions button {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-cancel {
  background: rgba(107, 114, 128, 0.2);
  border: 2px solid rgba(107, 114, 128, 0.4);
  color: #9ca3af;
}

.btn-cancel:hover {
  background: #6b7280;
  color: #fff;
}

.btn-save {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff;
}

.btn-save:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filters {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .employee-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    max-height: 95vh;
  }
}
</style>