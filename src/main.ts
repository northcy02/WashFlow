// src/main.ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './Router/index'
import 'animate.css'
import '@fortawesome/fontawesome-free/css/all.css'

createApp(App).use(router).mount('#app')