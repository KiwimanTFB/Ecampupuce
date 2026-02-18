<template>
  <div id="app">
    <Sidebar :currentView="currentView" @change-view="changerVue" />

    <main class="main-content">
      <transition name="fade" mode="out-in">
        <component :is="currentView" />
      </transition>
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import DashboardHome from './components/Dashboard.vue'
import SaeListe from './components/SaeListe.vue'
import SaeForm from './components/SaeForm.vue'

export default {
  name: 'App',
  components: { Sidebar, DashboardHome, SaeListe, SaeForm },
  data() {
    return { currentView: 'DashboardHome' }
  },
  methods: {
    changerVue(vueName) {
      this.currentView = vueName;
    }
  }
}
</script>

<style>
/* Reset global */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: #f1f5f9; color: #334155; }

/* Décalage du contenu car la sidebar est fixe */
.main-content {
  margin-left: 260px; /* Largeur de la sidebar */
  padding: 40px;
  min-height: 100vh;
}

/* Animations Vue.js (Le fameux "Dynamic") */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>