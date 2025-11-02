// src/services/api.ts

import axios from 'axios';
import { API_BASE_URL } from '@/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ========================================
// Booking API
// ========================================
export const bookingAPI = {
  create: (data: any) => api.post('/booking/create', data),
  getHistory: (customerId: number) => api.get(`/booking/history/${customerId}`),
  getActiveBookings: (params?: any) => api.get('/booking/all-bookings', { params }),
  cancel: (id: number) => api.put(`/booking/cancel/${id}`)
};

// ========================================
// Auth API
// ========================================
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/unified-login', data),
  getProfile: (id: number) => api.get(`/auth/profile/${id}`),
  updateProfile: (id: number, data: any) => api.put(`/auth/profile/${id}`, data),
  changePassword: (id: number, data: any) => api.put(`/auth/change-password/${id}`, data),
  deleteAccount: (id: number, data: any) => api.delete(`/auth/delete/${id}`, { data })
};

// ========================================
// Branch API
// ========================================
export const branchAPI = {
  getAll: () => api.get('/branch/all'),
  getById: (id: number) => api.get(`/branch/${id}`)
};

// ========================================
// Membership API
// ========================================
export const membershipAPI = {
  getInfo: (customerId: number) => api.get(`/membership/info/${customerId}`),
  getPointHistory: (customerId: number, limit = 20) => 
    api.get(`/membership/points/${customerId}`, { params: { limit } }),
  getAllTiers: () => api.get('/membership/tiers'),
  redeemPoints: (data: any) => api.post('/membership/redeem', data)
};

export default api;
