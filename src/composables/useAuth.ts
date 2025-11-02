// src/composables/useAuth.ts

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const user = ref<any>(null);

  const isLoggedIn = computed(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const loadUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      user.value = JSON.parse(userStr);
    }
    return user.value;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    user.value = null;
    window.dispatchEvent(new CustomEvent('loginStatusChanged'));
    router.push('/');
  };

  const requireAuth = () => {
    if (!isLoggedIn.value) {
      router.push('/login');
      return false;
    }
    return true;
  };

  return {
    user,
    isLoggedIn,
    loadUser,
    logout,
    requireAuth
  };
}
