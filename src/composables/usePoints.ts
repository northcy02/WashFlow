// src/composables/usePoints.ts

import { ref } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/constants';

export function usePoints() {
  const isRefreshing = ref(false);

  const refreshPoints = async (customerId: number) => {
    if (isRefreshing.value) {
      console.log('⏳ Already refreshing points...');
      return null;
    }
    
    isRefreshing.value = true;

    try {
      console.log('🔄 Refreshing points for customer:', customerId);
      
      const response = await axios.get(`${API_BASE_URL}/api/auth/profile/${customerId}`);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const merged = {
          ...currentUser,
          totalPoints: updatedUser.totalPoints,
          availablePoints: updatedUser.availablePoints,
          totalSpent: updatedUser.totalSpent,
          tierName: updatedUser.tier_name,
          tierIcon: updatedUser.tier_icon,
          tierColor: updatedUser.tier_color
        };
        
        localStorage.setItem('user', JSON.stringify(merged));
        
        // Notify all components
        window.dispatchEvent(new CustomEvent('pointsUpdated', { 
          detail: { 
            availablePoints: updatedUser.availablePoints,
            totalPoints: updatedUser.totalPoints
          }
        }));
        
        console.log('✅ Points refreshed:', updatedUser.availablePoints);
        
        return updatedUser;
      }
    } catch (error) {
      console.error('❌ Error refreshing points:', error);
      return null;
    } finally {
      isRefreshing.value = false;
    }
  };

  return {
    refreshPoints,
    isRefreshing
  };
}
