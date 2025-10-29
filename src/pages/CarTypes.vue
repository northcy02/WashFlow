<!-- src/pages/cartypes.vue -->
<template>
  <div class="car-types-page">
    <Navigator />

    <section class="main">
      <div class="container">
        <div class="header">
          <h1>ประเภทรถ</h1>
          <p>เลือกประเภทรถของคุณเพื่อเริ่มจองบริการ</p>
        </div>

        <div class="grid">
          <div 
            v-for="car in carTypes" 
            :key="car.id"
            class="card"
            @click="selectCarType(car.id)"
          >
            <div class="image-wrapper">
              <img :src="car.image" :alt="car.name" class="car-image">
            </div>
            <h3>{{ car.name }}</h3>
            <p>{{ car.desc }}</p>
            <div class="price-badge">
              <span class="price">฿{{ car.basePrice.toLocaleString() }}</span>
              <span class="price-label">เริ่มต้น</span>
            </div>
            <span class="badge">{{ car.size }}</span>
          </div>
        </div>

        <div class="info">
          <p>💡 ราคาบริการแตกต่างตามประเภทรถและแพ็กเกจที่เลือก</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Navigator from '../components/Navigator.vue';
import Swal from 'sweetalert2';

const router = useRouter();

const carTypes = [
  { 
    id: 'sedan', 
    name: 'รถเก๋ง', 
    desc: 'Sedan', 
    size: 'M',
    basePrice: 250,
    image: '/icons/sedan.svg'
  },
  { 
    id: 'pickup', 
    name: 'รถกระบะ', 
    desc: 'Pickup', 
    size: 'L',
    basePrice: 300,
    image: '/icons/pickup.svg'
  },
  { 
    id: 'sports', 
    name: 'รถสปอร์ต', 
    desc: 'Sports', 
    size: 'M',
    basePrice: 500,
    image: '/icons/sports.svg'
  },
  { 
    id: 'van', 
    name: 'รถตู้', 
    desc: 'Van', 
    size: 'XL',
    basePrice: 400,
    image: '/icons/van.svg'
  },
  { 
    id: 'motorcycle', 
    name: 'มอเตอร์ไซค์', 
    desc: 'Bike', 
    size: 'S',
    basePrice: 150,
    image: '/icons/motorcycle.svg'
  }
];

const selectCarType = (type: string) => {
  const car = carTypes.find(c => c.id === type);
  
  Swal.fire({
    title: `เลือก${car?.name}`,
    html: `
      <div style="text-align: left; padding: 1rem;">
        <p style="margin-bottom: 0.5rem;">ราคาเริ่มต้น: <strong style="color: #dc2626;">฿${car?.basePrice.toLocaleString()}</strong></p>
        <p style="color: #6b7280; font-size: 0.9rem;">*ราคาจริงขึ้นอยู่กับแพ็กเกจที่เลือก</p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ไปจองเลย',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push({
        path: '/booking',
        query: { 
          carType: type,
          basePrice: car?.basePrice
        }
      });
    }
  });
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.car-types-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'Kanit', sans-serif;
}

/* Main */
.main {
  margin-top: 80px;
  padding: 4rem 2rem;
  min-height: calc(100vh - 80px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #dc2626;
}

.header p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.card:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.3);
}

/* Image Wrapper */
.image-wrapper {
  width: 100%;
  height: 120px;
  margin-bottom: 1rem;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
  filter: brightness(0.8) contrast(1.1);
}

.card:hover .car-image {
  transform: scale(1.1);
  filter: brightness(1) contrast(1.2);
}

.card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
}

/* Price Badge */
.price-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(220, 38, 38, 0.2);
  transition: all 0.3s;
}

.card:hover .price-badge {
  background: rgba(220, 38, 38, 0.2);
  border-color: rgba(220, 38, 38, 0.4);
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
  line-height: 1;
}

.price-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #dc2626;
}

.card:hover .badge {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}

/* Info */
.info {
  text-align: center;
  padding: 1.5rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 12px;
}

.info p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  
  .header p {
    font-size: 1rem;
  }
  
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }
  
  .image-wrapper {
    height: 100px;
  }
  
  .card h3 {
    font-size: 1.1rem;
  }

  .price {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .main {
    padding: 3rem 1rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .price {
    font-size: 1.2rem;
  }

  .price-badge {
    padding: 0.5rem;
  }
}
</style>