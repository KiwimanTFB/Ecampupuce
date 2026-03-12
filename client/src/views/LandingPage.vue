<template>
  <div class="landing-page">
    <header class="public-navbar" :class="{'scrolled': isScrolled}">
      <div class="nav-brand">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        SaeTrack
      </div>
      <nav class="nav-links">
        <a href="#hero" class="active">Accueil</a>
        <a href="#projects">La Vitrine</a>
        <a href="#stats">Notre BUT</a>
        <a href="#contact">Campus</a>
      </nav>
      <div class="nav-auth">
        <router-link to="/login" class="btn btn-primary login-btn">
          <span>Connexion E-campus</span>
          <svg viewBox="0 0 24 24" class="icon-arrow"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </router-link>
      </div>
    </header>

    <main class="landing-content">
      <!-- HERO SECTION -->
      <section id="hero" class="hero-section">
        <div class="hero-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
        <div class="hero-content fade-in-up">
          <div class="badge-new">Nouveau ✨ Découvrez les projets 2026</div>
          <h1>L'excellence par la<br><span class="gradient-text">Pratique et l'Innovation</span></h1>
          <p>La vitrine officielle des Situations d'Apprentissage et d'Évaluation (SAE) du BUT Métiers du Multimédia et de l'Internet. Explorez les talents de nos étudiants.</p>
          <div class="hero-actions">
            <a href="#projects" class="btn btn-primary btn-lg">Explorer la galerie</a>
            <a href="#stats" class="btn btn-secondary btn-lg">Découvrir la formation</a>
          </div>
        </div>
      </section>

      <!-- STATS SECTION -->
      <section id="stats" class="stats-section">
        <div class="stats-grid stagger-fade-in" ref="statsRef">
          <div class="stat-card">
            <div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div class="stat-number">250+</div>
            <div class="stat-label">Étudiants Actifs</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
            <div class="stat-number">120</div>
            <div class="stat-label">Projets Finalisés</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
            <div class="stat-number">5</div>
            <div class="stat-label">Domaines d'Expertise</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
            <div class="stat-number">100%</div>
            <div class="stat-label">Professionnalisant</div>
          </div>
        </div>
      </section>

      <!-- GALLERY SECTION -->
      <section id="projects" class="gallery-section">
        <div class="section-header text-center">
          <h2 class="section-title">Galerie des Projets</h2>
          <p class="section-subtitle">Filtrez les travaux par semestre, promotion ou spécialité pour découvrir l'étendue des compétences MMI.</p>
        </div>

        <div class="filters-container box-shadow-hover">
          <div class="filter-group">
            <label>Promotion</label>
            <div class="select-wrapper">
              <select v-model="filters.promo" @change="fetchPublicSaes">
                <option value="">Toutes les promos</option>
                <option value="MMI1">MMI1</option>
                <option value="MMI2">MMI2</option>
                <option value="MMI3">MMI3</option>
              </select>
            </div>
          </div>
          <div class="filter-group">
            <label>Semestre</label>
            <div class="select-wrapper">
              <select v-model="filters.semestre" @change="fetchPublicSaes">
                <option value="">Tous les semestres</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
                <option value="S4">S4</option>
                <option value="S5">S5</option>
                <option value="S6">S6</option>
              </select>
            </div>
          </div>
          <div class="filter-group">
            <label>Expertise métier</label>
            <div class="select-wrapper">
              <select v-model="filters.domaine" @change="fetchPublicSaes">
                <option value="">Tous les domaines</option>
                <option value="Dév web">Développement Web</option>
                <option value="Design">UX/UI & Design</option>
                <option value="Communication">Stratégie & Comm'</option>
                <option value="Créations Audiovisuelles">Audiovisuel</option>
                <option value="3D & Jeux">3D & Jeux Vidéos</option>
              </select>
            </div>
          </div>
          
          <button class="btn btn-outline reset-btn" @click="resetFilters" :class="{ 'visible': hasActiveFilters }">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
            Réinitialiser
          </button>
        </div>

        <div v-if="isLoading" class="loader-container">
          <div class="spinner"></div>
          <p>Récupération des créations...</p>
        </div>
        
        <div v-else-if="saes.length === 0" class="empty-state fade-in">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h3>Aucun résultat trouvé</h3>
          <p>Nous n'avons trouvé aucune SAE correspondant à ces critères précis.</p>
          <button class="btn btn-secondary mt-3" @click="resetFilters">Voir tous les projets</button>
        </div>
        
        <div v-else class="sae-grid">
          <div v-for="(sae, index) in saes" :key="sae.id" class="sae-public-card" :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="card-glass-top"></div>
            <div class="sae-card-header">
              <span class="badge" :class="getBadgeColor(sae.domaine)">{{ sae.domaine }}</span>
              <span class="badge-outline">{{ sae.promo }} - {{ sae.semestre }}</span>
            </div>
            <div class="sae-card-body">
              <h3 class="sae-card-title">{{ sae.title }}</h3>
              <p class="sae-card-desc">{{ sae.description }}</p>
            </div>
            <div class="sae-card-footer">
              <div class="flex-center gap-2">
                <svg viewBox="0 0 24 24" width="14" height="14" class="text-secondary"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span class="annee">{{ sae.annee }}</span>
              </div>
              <div class="flex-center gap-2">
                <svg viewBox="0 0 24 24" width="14" height="14" class="text-secondary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span class="group-type">{{ sae.groupType }}</span>
              </div>
            </div>
            
            <div class="hover-overlay">
              <button class="btn btn-primary btn-round">
                <svg viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section id="contact" class="cta-section">
        <div class="cta-card">
          <h2>Vous êtes étudiant ou enseignant au BUT MMI ?</h2>
          <p>Rejoignez la plateforme SaeTrack pour suivre vos projets, déposer vos livrables ou évaluer vos cohortes dans un environnement centralisé et intuitif.</p>
          <router-link to="/login" class="btn btn-primary btn-lg cta-btn">
            Accéder à l'E-campus
          </router-link>
        </div>
      </section>
    </main>

    <footer class="public-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="nav-brand">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            SaeTrack
          </div>
          <p>La plateforme officielle de gestion centralisée des Situations d'Apprentissage et d'Évaluation.</p>
        </div>
        <div class="footer-links">
          <div class="link-col">
            <h4>Ressources</h4>
            <a href="#">Portail MMI national</a>
            <a href="#">Syllabus officiel</a>
            <a href="#">Bibliothèque</a>
          </div>
          <div class="link-col">
            <h4>Support</h4>
            <a href="#">Aide technique</a>
            <a href="#">Contact admin</a>
            <a href="#">Mentions légales</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Université - BUT MMI. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const saes = ref([])
const isLoading = ref(true)
const isScrolled = ref(false)

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

function getBadgeColor(domaine) {
  const map = {
    'Dév web': 'badge-brand',
    'Design': 'badge-purple',
    'Communication': 'badge-orange',
    'Créations Audiovisuelles': 'badge-red',
    '3D & Jeux': 'badge-green',
  }
  return map[domaine] || 'badge-primary'
}

async function fetchPublicSaes() {
  isLoading.value = true
  
  try {
    const params = new URLSearchParams()
    if (filters.value.promo) params.append('promo', filters.value.promo)
    if (filters.value.semestre) params.append('semestre', filters.value.semestre)
    if (filters.value.annee) params.append('annee', filters.value.annee)
    if (filters.value.domaine) params.append('domaine', filters.value.domaine)
    
    // Léger délai artificiel pour montrer la belle animation de chargement
    await new Promise(r => setTimeout(r, 400))
    const response = await axios.get(`/api/public/saes?${params.toString()}`)
    saes.value = response.data
  } catch (error) {
    console.error("Erreur de récupération des SAEs publiques:", error)
  } finally {
    isLoading.value = false
  }
}

function resetFilters() {
  filters.value = { promo: '', semestre: '', annee: '', domaine: '' }
  fetchPublicSaes()
}

function handleScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  fetchPublicSaes()
  window.addEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* =========== VARIABLES THEMATIQUES ============ */
.landing-page {
  --primary: #4F46E5;
  --primary-hover: #4338CA;
  --secondary: #0F172A;
  --accent: #38BDF8;
  --bg-color: #F8FAFC;
  --bg-surface: #FFFFFF;
  --text-dark: #0F172A;
  --text-gray: #64748B;
  --border: #E2E8F0;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 25px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-glow: 0 0 20px rgba(79, 70, 229, 0.4);

  min-height: 100vh;
  background-color: var(--bg-color);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  color: var(--text-dark);
}

/* =========== UTILS ============ */
.text-center { text-align: center; }
.mt-3 { margin-top: 1rem; }
.flex-center { display: flex; align-items: center; }
.gap-2 { gap: 0.5rem; }
.text-secondary { stroke: var(--text-gray); }

/* =========== ANIMATIONS ============ */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.fade-in { animation: scaleIn 0.3s ease-out forwards; }

.sae-public-card {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* =========== NAVBAR ============ */
.public-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5%;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.public-navbar.scrolled {
  height: 70px;
  background-color: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 800;
  color: var(--text-dark);
  letter-spacing: -0.5px;
}

.nav-brand svg {
  width: 32px;
  height: 32px;
  color: var(--primary);
  fill: currentColor;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  color: var(--text-gray);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s;
  position: relative;
}

.nav-links a:hover, .nav-links a.active {
  color: var(--primary);
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary);
  border-radius: 2px;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 99px !important;
  padding: 10px 24px !important;
  font-weight: 600 !important;
}

.icon-arrow {
  width: 18px;
  height: 18px;
  stroke: white;
  stroke-width: 2;
  fill: none;
  transition: transform 0.2s;
}

.login-btn:hover .icon-arrow {
  transform: translateX(4px);
}

/* =========== BUTTONS ============ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  border: none;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 12px;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.25);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
}

.btn-secondary {
  background-color: var(--bg-surface);
  color: var(--text-dark);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  background-color: #F1F5F9;
  border-color: #CBD5E1;
  transform: translateY(-2px);
}

.btn-outline {
  background-color: transparent;
  color: var(--text-gray);
  border: 1px solid var(--border);
}

.btn-outline:hover {
  background-color: var(--bg-surface);
  color: var(--text-dark);
  border-color: #CBD5E1;
}

.btn-round {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 0;
}
.btn-round svg {
  width: 24px;
  height: 24px;
  stroke: white;
  stroke-width: 2;
  fill: none;
}

/* =========== HERO SECTION ============ */
.hero-section {
  position: relative;
  padding: 180px 5% 120px;
  text-align: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  animation: float 10s ease-in-out infinite;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: rgba(79, 70, 229, 0.15);
  top: -100px;
  right: 15%;
  animation-delay: 0s;
}

.shape-2 {
  width: 500px;
  height: 500px;
  background: rgba(56, 189, 248, 0.15);
  bottom: -200px;
  left: 10%;
  animation-delay: -5s;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 0 auto;
}

.badge-new {
  display: inline-block;
  background: rgba(79, 70, 229, 0.1);
  color: var(--primary);
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 99px;
  margin-bottom: 32px;
  border: 1px solid rgba(79, 70, 229, 0.2);
}

.hero-section h1 {
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 800;
  color: var(--secondary);
  line-height: 1.1;
  letter-spacing: -2px;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-section p {
  font-size: 20px;
  color: var(--text-gray);
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 48px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* =========== STATS SECTION ============ */
.stats-section {
  padding: 0 5% 80px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.stat-card {
  background: var(--bg-surface);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-8px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  stroke: var(--primary);
  stroke-width: 2;
  fill: none;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 4px;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 15px;
  color: var(--text-gray);
  font-weight: 500;
}

/* =========== GALLERY SECTION ============ */
.gallery-section {
  padding: 80px 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 64px;
}

.section-title {
  font-size: 40px;
  font-weight: 800;
  color: var(--secondary);
  letter-spacing: -1px;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--text-gray);
  max-width: 600px;
  margin: 0 auto;
}

/* FILTERS */
.filters-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  background: var(--bg-surface);
  padding: 20px 32px;
  border-radius: 99px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  margin-bottom: 48px;
  position: relative;
  z-index: 20;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234F46E5' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  pointer-events: none;
  transition: transform 0.2s;
}

.filter-group select {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid transparent;
  border-radius: 99px;
  background-color: var(--bg-color);
  color: var(--text-dark);
  font-size: 14px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  appearance: none;
  transition: all 0.2s;
}

.filter-group select:hover {
  background-color: #F1F5F9;
}

.filter-group select:focus {
  border-color: var(--primary);
  background-color: var(--bg-surface);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.reset-btn {
  border-radius: 99px;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.9);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  gap: 8px;
}

.reset-btn svg {
  stroke: currentColor;
  fill: none;
}

.reset-btn.visible {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

/* CARDS */
.sae-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 32px;
}

.sae-public-card {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.card-glass-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
  z-index: 1;
  pointer-events: none;
}

.sae-public-card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-xl);
  border-color: #CBD5E1;
}

.sae-card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}

.badge {
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.badge-outline {
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--border);
  color: var(--text-gray);
  background: var(--bg-surface);
}

/* Colors for domains */
.badge-brand { background: rgba(79, 70, 229, 0.1); color: var(--primary); }
.badge-purple { background: rgba(168, 85, 247, 0.1); color: #A855F7; }
.badge-orange { background: rgba(249, 115, 22, 0.1); color: #F97316; }
.badge-red { background: rgba(239, 68, 68, 0.1); color: #EF4444; }
.badge-green { background: rgba(34, 197, 94, 0.1); color: #22C55E; }
.badge-primary { background: var(--bg-color); color: var(--text-dark); }

.sae-card-body {
  flex: 1;
  position: relative;
  z-index: 2;
}

.sae-card-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 12px;
  line-height: 1.3;
}

.sae-card-desc {
  font-size: 15px;
  color: var(--text-gray);
  line-height: 1.6;
}

.sae-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  position: relative;
  z-index: 2;
}

/* Hover action overlay */
.hover-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 5;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.sae-public-card:hover .hover-overlay {
  opacity: 1;
}

.hover-overlay button {
  transform: translateY(20px);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.sae-public-card:hover .hover-overlay button {
  transform: translateY(0);
}

/* =========== UTILS STATES ============ */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: var(--text-gray);
  font-weight: 500;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: var(--bg-surface);
  border-radius: 24px;
  border: 1px dashed var(--border);
}

.empty-state svg {
  width: 48px;
  height: 48px;
  stroke: var(--text-gray);
  fill: none;
  stroke-width: 1.5;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-gray);
}

/* =========== CTA & FOOTER ============ */
.cta-section {
  padding: 80px 5%;
  margin-bottom: 40px;
}

.cta-card {
  background: linear-gradient(135deg, var(--secondary) 0%, #1E293B 100%);
  border-radius: 32px;
  padding: 80px 40px;
  text-align: center;
  color: white;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.5);
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -20%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 60%);
  pointer-events: none;
}

.cta-card h2 {
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 24px;
  position: relative;
  z-index: 2;
}

.cta-card p {
  font-size: 18px;
  color: #94A3B8;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

.cta-btn {
  background: white;
  color: var(--secondary);
  box-shadow: none;
  position: relative;
  z-index: 2;
}

.cta-btn:hover {
  background: #F8FAFC;
  box-shadow: 0 10px 25px -5px rgba(255, 255, 255, 0.2);
}

.public-footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border);
  padding: 60px 5% 24px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto 60px;
}

.footer-brand .nav-brand {
  margin-bottom: 16px;
}

.footer-brand p {
  color: var(--text-gray);
  max-width: 300px;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  gap: 80px;
}

.link-col h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.link-col a {
  display: block;
  color: var(--text-gray);
  text-decoration: none;
  margin-bottom: 12px;
  font-size: 15px;
  transition: color 0.2s;
}

.link-col a:hover {
  color: var(--primary);
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
  text-align: center;
  color: var(--text-gray);
  font-size: 14px;
}
</style>
