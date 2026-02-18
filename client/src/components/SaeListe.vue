<template>
  <div class="page-container">
    <header class="header">
      <h2>📚 Mes Projets (SAE)</h2>
      <button class="filter-btn">Filtrer par semestre 🔽</button>
    </header>

    <div v-if="loading" class="loader">Chargement...</div>

    <transition-group name="list" tag="div" class="grid">
      <div v-for="sae in saes" :key="sae.id_sae" class="card">
        <div class="card-top">
          <span class="badge" :class="getStatusClass(sae.semestre)">{{ sae.semestre }}</span>
          <span class="date">📅 {{ formatDate(sae.date_debut) }}</span>
        </div>
        
        <h3>{{ sae.titre }}</h3>
        <p class="desc">{{ sae.description || 'Aucune description' }}</p>
        
        <div class="card-bottom">
          <div class="meta">
            <span class="univ">{{ sae.annee_univ }}</span>
          </div>
          <button class="btn-details">Voir détails →</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'SaeListe',
  data() {
    return { saes: [], loading: true }
  },
  mounted() {
    // Adapter l'URL selon que ton pote a fini l'API ou pas
    fetch('http://localhost:3000/api/saes')
      .then(res => res.json())
      .then(data => {
        this.saes = data;
        this.loading = false;
      })
      .catch(err => console.error(err));
  },
  methods: {
    // Fonction pour colorer les badges selon le semestre (S1, S2...)
    getStatusClass(semestre) {
      if (semestre === 'S1') return 'badge-purple';
      if (semestre === 'S2') return 'badge-blue';
      return 'badge-gray';
    },
    formatDate(dateString) {
      if (!dateString) return 'Date inconnue';
      return new Date(dateString).toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.page-container { max-width: 1200px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.header h2 { font-size: 2rem; color: #1e293b; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }

.card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex; flex-direction: column; justify-content: space-between;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: #38bdf8;
}

.card-top { display: flex; justify-content: space-between; margin-bottom: 15px; }
.badge { padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
.badge-purple { background: #ede9fe; color: #7c3aed; }
.badge-blue { background: #e0f2fe; color: #0284c7; }
.badge-gray { background: #f1f5f9; color: #64748b; }

.date { font-size: 0.8rem; color: #94a3b8; }

h3 { font-size: 1.25rem; margin-bottom: 10px; color: #0f172a; }
.desc { color: #64748b; font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px; }

.card-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #f1f5f9; }
.univ { font-size: 0.8rem; font-weight: 600; color: #cbd5e1; }
.btn-details { background: none; border: none; color: #38bdf8; font-weight: bold; cursor: pointer; transition: gap 0.2s; display: flex; align-items: center; gap: 5px;}
.btn-details:hover { gap: 10px; color: #0284c7; }

/* Animation d'apparition de la liste */
.list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(30px); }
</style>