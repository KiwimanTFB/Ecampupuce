<template>
  <aside>
      <div class="sidebar-header">
          <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          SaeTrack <span style="font-size: 10px; background: var(--accent-purple); padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: 600;">PRO</span>
      </div>
      
      <div class="nav-group">
          <div class="nav-label">Gestion Pédagogique</div>
          <nav>
              <a @click="$emit('switchView', 'dashboard')" :class="{ active: currentView === 'dashboard' }">
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                  Vue globale
              </a>
              <a @click="$emit('switchView', 'create-sae')" :class="{ active: currentView === 'create-sae' }">
                  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Créer une SAE
              </a>
              <a @click="$emit('switchView', 'grading')" :class="{ active: currentView === 'grading' }">
                  <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  Évaluation des rendus
              </a>
          </nav>
      </div>

      <div class="nav-group">
          <div class="nav-label">Communication</div>
          <nav>
              <a @click="$emit('switchView', 'announcements')" :class="{ active: currentView === 'announcements' }">
                  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Publier une annonce
              </a>
          </nav>
      </div>
      
      <div class="nav-group" style="margin-top: auto; padding-bottom: 24px;">
          <router-link to="/student" style="color: var(--status-info-text)">
              Basculer vers Étudiant
          </router-link>
      </div>
  </aside>
</template>

<script setup>
defineProps({
  currentView: String
})
defineEmits(['switchView'])
</script>
