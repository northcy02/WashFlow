<!-- src/pages/BranchSelection.vue -->

<template>
  <div class="branch-selection-page">
    <Navigator />

    <section class="main">
      <div class="container">
        <div class="page-header">
          <h1>🏢 เลือกสาขา</h1>
          <p>เลือกสาขาที่ใกล้คุณที่สุด</p>
        </div>

        <!-- Map Section -->
        <div class="map-section">
          <div class="map-container">
            <!-- ✅ แก้ไข: เปลี่ยน allowfullscreen="" เป็น allowfullscreen -->
            <iframe
              v-if="selectedBranch && selectedBranch.latitude && selectedBranch.longitude"
              :src="`https://maps.google.com/maps?q=${selectedBranch.latitude},${selectedBranch.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`"
              width="100%"
              height="100%"
              style="border:0; border-radius: 15px;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div v-else class="map-placeholder">
              <span class="icon">🗺️</span>
              <p>เลือกสาขาเพื่อดูแผนที่</p>
            </div>
          </div>

          <!-- Branch Info Card -->
          <div class="branch-info-card" v-if="selectedBranch">
            <h3>{{ selectedBranch.branch_name }}</h3>
            <div class="info-row">
              <span class="icon">📍</span>
              <span>{{ selectedBranch.branch_address }}</span>
            </div>
            <div class="info-row">
              <span class="icon">📞</span>
              <span>{{ selectedBranch.branch_tel }}</span>
            </div>
            <div class="info-actions">
              <a 
                v-if="selectedBranch.map_url" 
                :href="selectedBranch.map_url" 
                target="_blank" 
                class="btn-map"
              >
                🗺️ เปิดใน Google Maps
              </a>
              <button @click="confirmBranch" class="btn-select">
                ✓ เลือกสาขานี้
              </button>
            </div>
          </div>
        </div>

        <!-- Branches Grid -->
        <div class="branches-grid">
          <div 
            v-for="branch in sortedBranches" 
            :key="branch.branch_ID"
            class="branch-card"
            :class="{ selected: selectedBranch?.branch_ID === branch.branch_ID }"
            @click="selectBranchCard(branch)"
          >
            <div class="card-header">
              <h3>{{ branch.branch_name }}</h3>
              <span class="distance" v-if="branch.distance">
                📍 {{ branch.distance }} km
              </span>
            </div>
            <div class="card-body">
              <p class="address">
                <span class="icon">📍</span>
                {{ branch.branch_address }}
              </p>
              <p class="phone">
                <span class="icon">📞</span>
                {{ branch.branch_tel }}
              </p>
            </div>
            <div class="card-actions">
              <button class="btn-view" @click.stop="viewOnMap(branch)">
                🗺️ ดูแผนที่
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="branches.length === 0 && !isLoading" class="empty-state">
          <span class="icon">🏢</span>
          <p>ไม่พบสาขา</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>กำลังโหลดข้อมูลสาขา...</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navigator from '@/components/Navigator.vue';

const router = useRouter();

// ✅ Interface
interface Branch {
  branch_ID: number;
  branch_name: string;
  branch_address: string;
  branch_tel: string;
  latitude: number | null;
  longitude: number | null;
  map_url: string | null;
  is_active: boolean;
  distance?: number;
}

interface UserLocation {
  lat: number;
  lng: number;
}

// ✅ State
const branches = ref<Branch[]>([]);
const selectedBranch = ref<Branch | null>(null);
const userLocation = ref<UserLocation | null>(null);
const isLoading = ref(false);

// ✅ Computed - เรียงตามระยะทาง
const sortedBranches = computed(() => {
  if (!branches.value || branches.value.length === 0) return [];
  
  const branchesCopy = [...branches.value];
  
  return branchesCopy.sort((a, b) => {
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    return 0;
  });
});

// ✅ Load Branches
const loadBranches = async () => {
  isLoading.value = true;
  
  try {
    const response = await axios.get('http://localhost:3000/api/branch/all');
    
    if (response.data.success) {
      branches.value = response.data.branches;
      
      console.log('✅ Loaded branches:', branches.value.length);
      
      if (userLocation.value) {
        calculateDistances();
      }
      
      if (!selectedBranch.value && branches.value.length > 0) {
        selectedBranch.value = branches.value[0];
      }
    }
  } catch (error: any) {
    console.error('❌ Error loading branches:', error);
    
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลสาขาได้',
      icon: 'error',
      confirmButtonColor: '#dc2626',
      background: 'rgba(30, 30, 30, 0.98)',
      color: '#ffffff'
    });
  } finally {
    isLoading.value = false;
  }
};

// ✅ Get User Location
const getUserLocation = () => {
  if (!('geolocation' in navigator)) {
    console.log('⚠️ Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('✅ User location:', userLocation.value);
      calculateDistances();
    },
    (error) => {
      console.log('⚠️ Geolocation error:', error.message);
    },
    {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    }
  );
};

// ✅ Calculate Distances
const calculateDistances = () => {
  if (!userLocation.value) {
    console.log('⚠️ No user location');
    return;
  }

  let calculated = 0;

  branches.value.forEach(branch => {
    if (branch.latitude && branch.longitude) {
      branch.distance = calculateDistance(
        userLocation.value!.lat,
        userLocation.value!.lng,
        branch.latitude,
        branch.longitude
      );
      calculated++;
    }
  });

  console.log(`✅ Calculated distances for ${calculated} branches`);
};

// ✅ Haversine Formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  
  return Math.round(d * 10) / 10;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// ✅ Select Branch
const selectBranchCard = (branch: Branch) => {
  selectedBranch.value = branch;
  console.log('✅ Selected branch:', branch.branch_name);
  
  const mapSection = document.querySelector('.map-section');
  if (mapSection) {
    mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// ✅ View on Map
const viewOnMap = (branch: Branch) => {
  if (branch.map_url) {
    window.open(branch.map_url, '_blank');
  } else if (branch.latitude && branch.longitude) {
    window.open(`https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`, '_blank');
  }
};

// ✅ Confirm Branch
const confirmBranch = async () => {
  if (!selectedBranch.value) return;

  localStorage.setItem('selectedBranch', JSON.stringify(selectedBranch.value));
  
  console.log('✅ Branch saved to localStorage');
  
  await Swal.fire({
    title: 'เลือกสาขาสำเร็จ!',
    html: `
      <div style="text-align: center; padding: 1rem;">
        <p style="font-size: 1.2rem; margin-bottom: 0.5rem; color: rgba(255,255,255,0.7);">คุณเลือกสาขา</p>
        <p style="font-size: 1.8rem; font-weight: 700; color: #dc2626; margin-bottom: 1rem;">
          ${selectedBranch.value.branch_name}
        </p>
        <p style="font-size: 0.95rem; color: rgba(255,255,255,0.6);">
          ${selectedBranch.value.branch_address}
        </p>
      </div>
    `,
    icon: 'success',
    iconColor: '#10b981',
    confirmButtonText: 'ไปจองบริการ',
    confirmButtonColor: '#dc2626',
    background: 'rgba(30, 30, 30, 0.98)',
    color: '#ffffff'
  });

  router.push('/booking');
};

// ✅ Lifecycle
onMounted(() => {
  loadBranches();
  getUserLocation();
  
  const savedBranchStr = localStorage.getItem('selectedBranch');
  if (savedBranchStr) {
    try {
      selectedBranch.value = JSON.parse(savedBranchStr);
      console.log('✅ Loaded saved branch:', selectedBranch.value.branch_name);
    } catch (error) {
      console.error('❌ Error parsing saved branch:', error);
      localStorage.removeItem('selectedBranch');
    }
  }
});
</script>

<style scoped>
/* ... เก็บ CSS เดิมทั้งหมด + เพิ่ม ... */

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #dc2626;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.empty-state .icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-state p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Map Container */
.map-container {
  height: 500px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}

.map-container iframe {
  display: block;
}

.map-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.map-placeholder .icon {
  font-size: 5rem;
  opacity: 0.3;
}

.map-placeholder p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Branch Info Card */
.branch-info-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.branch-info-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.info-row .icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.info-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
}

.btn-map,
.btn-select {
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-map {
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid rgba(59, 130, 246, 0.4);
  color: #3b82f6;
}

.btn-map:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.btn-select {
  background: linear-gradient(135deg, #dc2626, #991b1b);
  border: none;
  color: #fff;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.3);
}

.btn-select:hover {
  background: linear-gradient(135deg, #b91c1c, #7f1d1d);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(220, 38, 38, 0.5);
}

/* Branches Grid */
.branches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.branch-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.branch-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.5);
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.2);
}

.branch-card.selected {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.15), rgba(139, 0, 0, 0.15));
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
}

.distance {
  padding: 0.4rem 1rem;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #10b981;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.address,
.phone {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.address .icon,
.phone .icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.card-actions {
  display: flex;
  gap: 1rem;
}

.btn-view {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.btn-view:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .map-section {
    grid-template-columns: 1fr;
  }
  
  .map-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .branches-grid {
    grid-template-columns: 1fr;
  }
  
  .map-container {
    height: 300px;
  }
}
</style>
