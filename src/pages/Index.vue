<!-- src/pages/index.vue -->
<template>
  <div class="home-page">
    <h1>WASHFLOW - หน้าแรก</h1>
    <router-link to="/register">
      <button>ไปหน้าสมัครสมาชิก</button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 2rem;
}

h1 {
  font-size: 3rem;
  color: #dc2626;
}

button {
  background: #dc2626;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background: #b91c1c;
  transform: translateY(-2px);
}
</style>
