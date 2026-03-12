<template>
  <div class="landing-page">
    <header class="public-navbar">
      <div class="nav-brand">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        SaeTrack
      </div>
      <nav class="nav-links">
        <a href="#" class="active">Accueil</a>
        <a href="#">En savoir plus sur le BUT</a>
        <a href="#">Contactez-nous</a>
        <a href="#">Informations Parcoursup</a>
        <a href="#">Campus</a>
      </nav>
      <div class="nav-auth">
        <router-link to="/login" class="btn btn-primary">Connexion (E-campus)</router-link>
      </div>
    </header>

    <main class="landing-content">
      <section class="hero-section">
        <h1>Découvrez les projets de nos étudiants</h1>
        <p>Explorez les Situations d'Apprentissage et d'Évaluation (SAE) réalisées par les étudiants du BUT Métiers du Multimédia et de l'Internet.</p>
      </section>

      <section class="filters-section">
        <div class="filters-container">
          <div class="filter-group">
            <label>Promo</label>
            <select v-model="filters.promo" @change="fetchPublicSaes">
              <option value="">Toutes</option>
              <option value="MMI1">MMI1</option>
              <option value="MMI2">MMI2</option>
              <option value="MMI3">MMI3</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Semestre</label>
            <select v-model="filters.semestre" @change="fetchPublicSaes">
              <option value="">Tous</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
              <option value="S4">S4</option>
              <option value="S5">S5</option>
              <option value="S6">S6</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Année</label>
            <select v-model="filters.annee" @change="fetchPublicSaes">
              <option value="">Toutes</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Domaine</label>
            <select v-model="filters.domaine" @change="fetchPublicSaes">
              <option value="">Tous</option>
              <option value="Dév web">Dév web</option>
              <option value="Design">Design</option>
              <option value="Communication">Communication</option>
              <option value="Créations Audiovisuelles">Créations Audiovisuelles</option>
              <option value="3D & Jeux">3D & Jeux</option>
            </select>
          </div>
          
          <button class="btn btn-secondary reset-btn" @click="resetFilters" v-if="hasActiveFilters">
            Réinitialiser
          </button>
        </div>
      </section>

      <section class="gallery-section">
        <div v-if="isLoading" class="loading-state">
          Chargement des projets...
        </div>
        <div v-else-if="saes.length === 0" class="empty-state">
          Aucune SAE publique ne correspond à vos critères de recherche.
        </div>
        <div v-else class="sae-grid">
          <div v-for="sae in saes" :key="sae.id" class="sae-public-card">
            <div class="sae-card-header">
              <span class="badge badge-info">{{ sae.domaine }}</span>
              <span class="badge">{{ sae.promo }} - {{ sae.semestre }}</span>
            </div>
            <h3 class="sae-card-title">{{ sae.title }}</h3>
            <p class="sae-card-desc">{{ sae.description }}</p>
            <div class="sae-card-footer">
              <span class="annee">{{ sae.annee }}</span>
              <span class="group-type">{{ sae.groupType }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const saes = ref([])
const isLoading = ref(true)

const filters = ref({
  promo: '',
  semestre: '',
  annee: '',
  domaine: ''
})

const hasActiveFilters = computed(() => {
  return filters.value.promo !== '' || 
         filters.value.semestre !== '' || 
         filters.value.annee !== '' || 
         filters.value.domaine !== ''
})

async function fetchPublicSaes() {
  isLoading.value = true
  
  try {
    // Construction de la query string dynamiquement
    const params = new URLSearchParams()
    if (filters.value.promo) params.append('promo', filters.value.promo)
    if (filters.value.semestre) params.append('semestre', filters.value.semestre)
    if (filters.value.annee) params.append('annee', filters.value.annee)
    if (filters.value.domaine) params.append('domaine', filters.value.domaine)
    
    const response = await axios.get(`/api/public/saes?${params.toString()}`)
    saes.value = response.data
  } catch (error) {
    console.error("Erreur de récupération des SAEs publiques:", error)
  } finally {
    isLoading.value = false
  }
}

function resetFilters() {
  filters.value = {
    promo: '',
    semestre: '',
    annee: '',
    domaine: ''
  }
  fetchPublicSaes()
}

onMounted(() => {
  fetchPublicSaes()
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background-color: var(--bg-app);
  display: flex;
  flex-direction: column;
}

.public-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 80px;
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-light);
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.nav-brand svg {
  width: 32px;
  height: 32px;
  color: var(--accent-brand);
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.active {
  color: var(--accent-brand);
}

.landing-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.hero-section {
  text-align: center;
  padding: 80px 20px 60px;
  max-width: 800px;
  margin: 0 auto;
}

.hero-section h1 {
  font-size: 48px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 24px;
  line-height: 1.2;
  letter-spacing: -1px;
}

.hero-section p {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.filters-section {
  padding: 0 40px;
  margin-bottom: 40px;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px;
  background: var(--bg-surface);
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-card);
  max-width: 1200px;
  margin: 0 auto;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  flex: 1;
}

.filter-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-group select {
  padding: 12px 16px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background-color: var(--bg-app);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
}

.filter-group select:focus {
  border-color: var(--accent-brand);
}

.reset-btn {
  height: 44px;
  padding: 0 24px;
  white-space: nowrap;
}

.gallery-section {
  padding: 0 40px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.sae-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.sae-public-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sae-public-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
  border-color: var(--border-hover);
}

.sae-card-header {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.sae-card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  line-height: 1.4;
}

.sae-card-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
  flex: 1;
}

.sae-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
  font-size: 16px;
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-light);
}
</style>
