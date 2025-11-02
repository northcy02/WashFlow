// src/constants/index.ts

export const CAR_TYPES = [
  { id: 'sedan', name: 'รถเก๋ง', desc: 'Sedan', size: 'M', multiplier: 1.00, icon: '🚗', image: '/icons/sedan.svg' },
  { id: 'pickup', name: 'รถกระบะ', desc: 'Pickup', size: 'L', multiplier: 1.20, icon: '🚙', image: '/icons/pickup.svg' },
  { id: 'sports', name: 'รถสปอร์ต', desc: 'Sports', size: 'M', multiplier: 1.50, icon: '🏎️', image: '/icons/sports.svg' },
  { id: 'van', name: 'รถตู้', desc: 'Van', size: 'XL', multiplier: 1.30, icon: '🚐', image: '/icons/van.svg' },
  { id: 'motorcycle', name: 'มอเตอร์ไซค์', desc: 'Bike', size: 'S', multiplier: 0.80, icon: '🏍️', image: '/icons/motorcycle.svg' }
] as const;

export const SERVICES = [
  { id: 'wash', name: 'ล้างรถ', price: 200, time: '30 นาที', duration: 30, hot: true, popular: true, image: '/icons/wash.svg' },
  { id: 'coating', name: 'เคลือบสีรถ', price: 150, time: '15 นาที', duration: 15, hot: false, popular: false, image: '/icons/coating.svg' },
  { id: 'polish', name: 'ขัดสี', price: 1000, time: '60 นาที', duration: 60, hot: true, popular: false, image: '/icons/polish.svg' },
  { id: 'vacuum', name: 'ดูดฝุ่น', price: 80, time: '20 นาที', duration: 20, hot: false, popular: true, image: '/icons/vacuum.svg' },
  { id: 'interior', name: 'ซักเบาะ', price: 2000, time: '90 นาที', duration: 90, hot: false, popular: false, image: '/icons/interior.svg' }
] as const;

export const BUSINESS_HOURS = {
  open: '09:00',
  close: '18:00',
  slotDuration: 30 // minutes
} as const;

export const STATUS_MAP = {
  pending: { text: 'รอดำเนินการ', color: '#fbbf24', icon: '⏳' },
  confirmed: { text: 'ยืนยันแล้ว', color: '#3b82f6', icon: '✅' },
  in_progress: { text: 'กำลังดำเนินการ', color: '#a855f7', icon: '🔄' },
  completed: { text: 'เสร็จสิ้น', color: '#10b981', icon: '✓' },
  cancelled: { text: 'ยกเลิกแล้ว', color: '#ef4444', icon: '✕' }
} as const;

export const PAYMENT_METHODS = {
  cash: { text: 'เงินสด', icon: '💵' },
  card: { text: 'บัตร', icon: '💳' },
  qr: { text: 'QR Code', icon: '📱' }
} as const;

export const API_BASE_URL = 'http://localhost:3000';