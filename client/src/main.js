import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Configurer Axios pour inclure le JWT HTTP dans toutes les requêtes 
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const app = createApp(App)

app.config.globalProperties.getFileUrl = (path) => {
    if (!path) return '';
    path = path.replace('http://localhost:3000', '');
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const token = localStorage.getItem('token') || '';
    
    if (path.includes('rendus/')) {
        let cleanPath = path.startsWith('/') ? path : '/' + path;
        if (!cleanPath.startsWith('/uploads/')) {
            cleanPath = '/uploads' + cleanPath;
        }
        return `${baseUrl}${cleanPath}?token=${token}`;
    }
    
    if (path.startsWith('/uploads/')) return baseUrl + path;
    if (path.startsWith('uploads/')) return baseUrl + '/' + path;
    return baseUrl + '/uploads/' + path;
};

app.use(router)
app.mount('#app')
