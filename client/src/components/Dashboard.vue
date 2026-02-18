<template>
  <div class="dashboard">
    <h1>Tableau de Bord Étudiant</h1>
    <p class="subtitle">Vue d'ensemble de tes projets</p>
    
    <div class="stats-row">
      <div class="stat-box blue">
        <span class="label">En cours</span>
        <span class="value">{{ stats.enCours || 0 }}</span>
      </div>
      <div class="stat-box orange">
        <span class="label">À venir</span>
        <span class="value">{{ stats.aVenir || 0 }}</span>
      </div>
      <div class="stat-box green">
        <span class="label">Terminées</span>
        <span class="value">{{ stats.rendues || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardHome',
  data() {
    return {
      stats: {}
    }
  },
  mounted() {
    fetch('http://localhost:3000/api/dashboard')
      .then(res => res.json())
      .then(data => this.stats = data)
      .catch(err => console.error("Erreur Dashboard:", err));
  }
}
</script>

<style scoped>
.dashboard { padding: 20px; text-align: center; }
.subtitle { color: #7f8c8d; margin-bottom: 30px; }
.stats-row { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
.stat-box { width: 180px; padding: 25px; border-radius: 15px; color: white; display: flex; flex-direction: column; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.value { font-size: 3rem; font-weight: 800; }
.label { text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; }

.blue { background: linear-gradient(135deg, #3498db, #2980b9); }
.orange { background: linear-gradient(135deg, #f39c12, #d35400); }
.green { background: linear-gradient(135deg, #2ecc71, #27ae60); }
</style>