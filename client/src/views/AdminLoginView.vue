<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Connexion Administrateur</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <input type="email" v-model="email" class="form-control" placeholder="Email admin" required>
        <input type="password" v-model="password" class="form-control" placeholder="Mot de passe" required>
        <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
        <button type="submit" class="btn btn-primary" style="margin-top: 20px;">Se connecter</button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const router = useRouter()

const handleLogin = async () => {
    try {
        const { data } = await axios.post('/api/login/admin', { email: email.value, password: password.value })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user_role', data.user.role)
        router.push('/admin/dashboard')
    } catch(err) {
        errorMsg.value = err.response?.data?.error || 'Erreur de connexion'
    }
}
</script>
<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; width: 100%; background: var(--bg-app); font-family: sans-serif; }
.login-card { background:white; padding:40px; border-radius:8px; width:400px; box-shadow:0 4px 6px rgba(0,0,0,0.1); text-align:center; border: 1px solid var(--border-light); }
.login-form { display:flex; flex-direction:column; gap:15px; margin-top:20px; text-align: left; }
.form-control { padding: 12px; border-radius: 6px; border: 1px solid #ccc; width: 100%; box-sizing: border-box; }
.error-message { color:#ef4444; font-size: 14px; margin-top: 5px; text-align: center; }
.btn-primary { width: 100%; justify-content: center; }
</style>
