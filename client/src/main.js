import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Configurer Axios pour inclure le JWT HTTP dans toutes les requêtes 
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const app = createApp(App)
app.use(router)
app.mount('#app')
