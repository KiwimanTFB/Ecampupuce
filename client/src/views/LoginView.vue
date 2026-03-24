<template>
  <div class="login-container">
      <div class="login-card">
          <div class="login-header">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <h2>Connexion à SaeTrack</h2>
              <p>Connectez-vous pour accéder à votre espace.</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                  <label class="form-label">Adresse email</label>
                  <input type="email" v-model="email" class="form-control" placeholder="prenom.nom@univ.fr" required>
              </div>
              
              <div class="form-group">
                  <label class="form-label">Mot de passe</label>
                  <input type="password" v-model="password" class="form-control" placeholder="••••••••" required>
              </div>

              <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
              </div>

              <button type="submit" class="btn btn-primary login-btn" :disabled="isLoading">
                  {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
              </button>
          </form>

          <div class="login-hints">
              <p>Pas encore de compte ? <router-link to="/register" style="color: var(--accent-brand); font-weight: 600; text-decoration: none;">Créer un compte</router-link></p>
              <div style="margin-top: 16px;">
                  <router-link to="/" class="btn btn-outline" style="font-size: 13px; padding: 6px 16px;">Retour à l'accueil</router-link>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
      const response = await axios.post('/api/login', {
          email: email.value,
          password: password.value
      })

      const { token, user } = response.data
      
      // Stockage du token et des infos
      localStorage.setItem('jwt_token', token)
      localStorage.setItem('user_role', user.role)
      localStorage.setItem('user_info', JSON.stringify(user))
      
      // Redirection directionnelle par rôle
      if (user.role === 'student') {
          router.push('/student')
      } else if (user.role === 'teacher') {
          router.push('/teacher')
      }
      
  } catch (error) {
      if (error.response && error.response.data.error) {
          errorMessage.value = error.response.data.error
      } else {
          errorMessage.value = "Erreur de connexion au serveur"
      }
  } finally {
      isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--bg-app);
}

.login-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header svg {
  width: 48px;
  height: 48px;
  color: var(--accent-brand);
  margin-bottom: 16px;
}

.login-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: var(--text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-btn {
  width: 100%;
  justify-content: center;
  padding: 12px;
  font-size: 14px;
  margin-top: 8px;
}

.error-message {
  color: var(--status-danger-text);
  background-color: var(--status-danger-bg);
  border: 1px solid var(--status-danger-border);
  padding: 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.login-hints {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.login-hints code {
  background: var(--bg-app);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
