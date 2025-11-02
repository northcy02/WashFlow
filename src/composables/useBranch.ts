// src/composables/useBranch.ts

import { ref } from 'vue';

interface Branch {
  branch_ID: number;
  branch_name: string;
  branch_address: string;
  branch_tel: string;
  latitude?: number | null;
  longitude?: number | null;
  map_url?: string | null;
}

export function useBranch() {
  const selectedBranch = ref<Branch | null>(null);

  const loadSelectedBranch = (): Branch | null => {
    const savedBranch = localStorage.getItem('selectedBranch');
    if (savedBranch) {
      try {
        selectedBranch.value = JSON.parse(savedBranch);
        console.log('✅ Loaded saved branch:', selectedBranch.value?.branch_name);
        return selectedBranch.value;
      } catch (error) {
        console.error('Error loading branch:', error);
        localStorage.removeItem('selectedBranch');
      }
    }
    return null;
  };

  const saveBranch = (branch: Branch) => {
    selectedBranch.value = branch;
    localStorage.setItem('selectedBranch', JSON.stringify(branch));
    console.log('✅ Branch saved:', branch.branch_name);
  };

  const clearBranch = () => {
    selectedBranch.value = null;
    localStorage.removeItem('selectedBranch');
    console.log('🗑️ Branch cleared');
  };

  return {
    selectedBranch,
    loadSelectedBranch,
    saveBranch,
    clearBranch
  };
}
