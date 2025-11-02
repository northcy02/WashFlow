<!-- src/components/LoadingSkeleton.vue -->

<template>
  <div class="skeleton-wrapper">
    <div v-for="n in count" :key="n" class="skeleton-item" :class="type">
      <div class="skeleton-shimmer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'card' | 'list' | 'text';
  count?: number;
}>();
</script>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-item {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  overflow: hidden;
}

.skeleton-item.card {
  height: 300px;
}

.skeleton-item.list {
  height: 100px;
}

.skeleton-item.text {
  height: 30px;
  width: 60%;
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  to {
    left: 100%;
  }
}
</style>