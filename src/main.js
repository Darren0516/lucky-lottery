import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import Vue3Marquee from 'vue3-marquee'

createApp(App).use(Vue3Marquee).use(createPinia()).mount('#app')
