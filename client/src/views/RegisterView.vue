<template>
  <div class="register-container">
      <div class="register-card">
          <div class="register-header">
              <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <h2>Créer un compte SaeTrack</h2>
              <p>Inscrivez-vous pour accéder à votre espace dédié.</p>
          </div>
          
          <form @submit.prevent="handleRegister" class="register-form">
              <div class="form-group">
                  <label class="form-label">Nom complet</label>
                  <input type="text" v-model="name" class="form-control" placeholder="Ex : Jean Dupont" required>
              </div>

              <div class="form-group">
                  <label class="form-label">Adresse email</label>
                  <input type="email" v-model="email" class="form-control" placeholder="prenom.nom@univ.fr" required>
              </div>
              
              <div class="form-group">
                  <label class="form-label">Mot de passe</label>
                  <input type="password" v-model="password" class="form-control" placeholder="••••••••" required minlength="6">
              </div>

              <div class="form-group">
                  <label class="form-label">Je suis :</label>
                  <div class="role-selector">
                      <label class="role-option" :class="{ active: role === 'student' }">
                          <input type="radio" v-model="role" value="student" hidden>
                          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                          <span>Étudiant</span>
                      </label>
                      <label class="role-option" :class="{ active: role === 'teacher' }">
                          <input type="radio" v-model="role" value="teacher" hidden>
                          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          <span>Professeur</span>
                      </label>
                  </div>
              </div>

              <div v-if="errorMessage" class="error-message">
                  {{ errorMessage }}
              </div>

              <div v-if="successMessage" class="success-message">
                  {{ successMessage }}
              </div>

              <button type="submit" class="btn btn-primary register-btn" :disabled="isLoading">
                  {{ isLoading ? 'Inscription en cours...' : "S'inscrire" }}
              </button>
          </form>

          <div class="register-footer">
              <p>Vous avez déjà un compte ? <router-link to="/login">Connectez-vous ici</router-link></p>
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
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('student')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true
  
  try {
      await axios.post('/api/register', {
          name: name.value,
          email: email.value,
          password: password.value,
          role: role.value
      })

      successMessage.value = 'Compte créé avec succès ! Redirection vers la connexion...'
      
      // Redirection après un court délai
      setTimeout(() => {
          router.push('/login')
      }, 1500)
      
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
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--bg-app);
}

.register-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  width: 100%;
  max-width: 440px;
  padding: 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header svg {
  width: 48px;
  height: 48px;
  color: var(--accent-brand);
  margin-bottom: 16px;
}

.register-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.register-header p {
  font-size: 14px;
  color: var(--text-secondary);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.role-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.role-option svg {
  width: 28px;
  height: 28px;
  stroke: var(--text-secondary);
  stroke-width: 2;
  fill: none;
  transition: stroke 0.2s;
}

.role-option span {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.role-option:hover {
  border-color: var(--accent-brand);
  background: rgba(79, 70, 229, 0.03);
}

.role-option.active {
  border-color: var(--accent-brand);
  background: rgba(79, 70, 229, 0.06);
}

.role-option.active svg {
  stroke: var(--accent-brand);
}

.role-option.active span {
  color: var(--accent-brand);
}

.register-btn {
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

.success-message {
  color: var(--status-success-text);
  background-color: var(--status-success-bg);
  border: 1px solid var(--status-success-border);
  padding: 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.register-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
}

.register-footer a {
  color: var(--accent-brand);
  text-decoration: none;
  font-weight: 600;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
