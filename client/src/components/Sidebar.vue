<template>
  <aside class="sidebar">
    <div class="logo">
      <span class="icon">🎓</span>
      <h2>Ecampupuce</h2>
    </div>
    
    <nav class="nav-links">
      <button 
        @click="$emit('change-view', 'DashboardHome')" 
        :class="{ active: currentView === 'DashboardHome' }"
      >
        📊 Tableau de bord
      </button>
      
      <button 
        @click="$emit('change-view', 'SaeListe')" 
        :class="{ active: currentView === 'SaeListe' }"
      >
        📚 Mes SAE
      </button>
      
      <button 
        @click="$emit('change-view', 'SaeForm')" 
        :class="{ active: currentView === 'SaeForm' }"
      >
        ➕ Nouvelle SAE
      </button>
    </nav>

    <div class="user-profile">
      <div class="avatar">K</div>
      <div class="info">
        <p class="name">Kiwiman</p>
        <p class="role">Étudiant MMI</p>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: ['currentView']
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: #1e293b; /* Bleu nuit moderne */
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  left: 0;
  top: 0;
}

.logo { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
.logo h2 { font-size: 1.2rem; font-weight: 700; color: #38bdf8; }

.nav-links { flex: 1; display: flex; flex-direction: column; gap: 10px; }
button {
  background: transparent;
  border: none;
  color: #94a3b8;
  text-align: left;
  padding: 12px 15px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

button:hover { background: #334155; color: white; transform: translateX(5px); }
button.active { background: #38bdf8; color: #0f172a; font-weight: bold; }

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid #334155;
}
.avatar {
  width: 40px; height: 40px;
  background: #38bdf8;
  color: #0f172a;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold;
}
.role { font-size: 0.8rem; color: #94a3b8; }
</style>