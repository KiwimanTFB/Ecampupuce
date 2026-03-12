<template>
  <Sidebar />
  
  <main>
      <Header />

      <div class="workspace">
          <div class="page-title">
              <div>
                  <h1>{{ pageTitle }}</h1>
                  <p>{{ pageDesc }}</p>
              </div>
          </div>

          <!-- DASHBOARD -->
          <div v-if="currentView === 'dashboard'" class="view-section active">
              <div class="grid">
                  <div>
                      <div class="card">
                          <div class="card-header">
                              <div class="card-header-title">
                                  <svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                  Mes projets (Semestre Actuel)
                              </div>
                          </div>
                          <div class="card-body" style="padding: 16px;">
                              
                              <div v-if="saes.length === 0" style="color: var(--text-secondary); font-size: 14px;">Chargement des SAE de l'API...</div>
                              
                              <div v-for="sae in saes" :key="sae.id" class="list-item" style="margin-bottom: 8px;">
                                  <div class="item-info">
                                      <div class="item-title">{{ sae.title }}</div>
                                      <div class="item-meta">{{ sae.level }} • Échéance : {{ sae.deadline }} • {{ sae.groupType }}</div>
                                  </div>
                                  
                                  <span v-if="sae.status === 'urgent'" class="badge badge-warning" style="background:#fef3c7; color:#d97706; border-color:#fde68a;">PROCHE ÉCHÉANCE</span>
                                  <span v-else-if="sae.status === 'done'" class="badge badge-success" style="background:var(--status-success-bg); color:var(--status-success-text); border-color:var(--status-success-border);">TERMINÉ</span>
                                  <button v-else class="btn btn-outline">Éditer</button>
                              </div>

                          </div>
                      </div>

                      <div class="card">
                          <div class="card-header">
                              <div class="card-header-title">
                                  <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> Avancement des rendus
                              </div>
                          </div>
                          <div class="card-body">
                              <div v-for="sae in saes" :key="'prog-'+sae.id" class="progress-block">
                                  <div class="progress-header">
                                      <span>{{ sae.title }}</span>
                                      <span :style="{ color: sae.status === 'done' ? 'var(--status-success-text)' : 'var(--text-secondary)' }">
                                        {{ sae.status === 'done' ? '15 / 15 Groupes' : 'En cours...' }}
                                      </span>
                                  </div>
                                  <div class="progress-track">
                                      <div class="progress-fill" :style="{ width: sae.status === 'done' ? '100%' : '50%', backgroundColor: sae.status === 'done' ? 'var(--status-success-text)' : 'var(--accent-blue)' }"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div>
                      <div class="card">
                          <div class="card-header">
                              <div class="card-header-title">
                                  <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> À corriger
                              </div>
                          </div>
                          <div class="card-body" style="padding: 16px;">
                              <div v-for="sae in saes.filter(s => s.status === 'done')" :key="'cor-'+sae.id" class="list-item" style="padding: 12px; border-color: var(--status-warning-border);">
                                  <div class="item-info">
                                      <div class="item-title">{{ sae.title }} : 15 rendus en attente</div>
                                  </div>
                                  <button class="btn btn-primary" style="padding: 6px 12px;" @click="switchView('grading')">Évaluer</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- CREATE SAE -->
          <div v-if="currentView === 'create-sae'" class="view-section active">
              <div class="card" style="max-width: 800px;">
                  <div class="card-header">Proposition d'une nouvelle SAE</div>
                  <div class="card-body">
                      <div class="form-group">
                          <label class="form-label">Titre de la SAE *</label>
                          <input type="text" class="form-control" placeholder="Ex: SAE 4.04 - Réalité Virtuelle">
                      </div>
                      <div class="form-group">
                          <label class="form-label">Description et consignes *</label>
                          <textarea class="form-control" placeholder="Objectifs pédagogiques, livrables attendus..."></textarea>
                      </div>
                      <div style="background: var(--bg-app); padding: 16px; border-radius: var(--radius-sm); margin-top: 32px;">
                          <button class="btn btn-primary" @click="switchView('dashboard')">Soumettre pour validation</button>
                      </div>
                  </div>
              </div>
          </div>

          <!-- GRADING -->
          <div v-if="currentView === 'grading'" class="view-section active">
              <div v-for="sae in saes.filter(s => s.status === 'done')" :key="'grade-'+sae.id" class="accordion">
                  <div class="accordion-header active">
                      {{ sae.title }}
                      <div style="display:flex; align-items:center; gap: 16px;">
                          <span class="badge badge-warning">15 À CORRIGER</span>
                      </div>
                  </div>
                  <div class="accordion-body active">
                      <div class="list-item" id="row-group-a">
                          <div class="item-info">
                              <div class="item-title">Groupe A (Alexandre D., Marie L., Thomas B.)</div>
                              <div class="item-meta">Déposé le {{ sae.deadline }} • Maquette_Figma_VFinale.pdf</div>
                          </div>
                          <div style="display: flex; align-items: center; gap: 24px;">
                              <label class="checkbox-wrapper">
                                  <input type="checkbox" class="eval-checkbox"> Déjà évalué
                              </label>
                              <div class="btn-group">
                                  <button class="btn btn-outline">Télécharger</button>
                                  <button class="btn btn-primary">Saisir la note</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- ANNOUNCEMENTS -->
          <div v-if="currentView === 'announcements'" class="view-section active">
               <div class="card" style="max-width: 800px;">
                  <div class="card-header">Rédiger une nouvelle annonce</div>
                  <div class="card-body">
                      <div class="form-group">
                          <label class="form-label">Titre de l'annonce :</label>
                          <input type="text" class="form-control" placeholder="Ex: Modification des consignes...">
                      </div>
                      <div class="form-group">
                          <label class="form-label">Message :</label>
                          <textarea class="form-control" placeholder="Rédigez votre message ici..."></textarea>
                      </div>
                      <button class="btn btn-primary">Envoyer l'annonce</button>
                  </div>
              </div>
          </div>

      </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Sidebar from '../components/teacher/Sidebar.vue'
import Header from '../components/teacher/Header.vue'

const route = useRoute()
const currentView = computed(() => route.params.view || 'dashboard')
const saes = ref([])

const pageInfo = {
  'dashboard': { title: "Vue globale de l'avancement", desc: "Supervision de vos projets du semestre et suivi des rendus." },
  'create-sae': { title: "Création d'une SAE", desc: "Remplissez le formulaire de compétences pour soumettre votre projet." },
  'grading': { title: "Évaluation des rendus", desc: "Consultez, téléchargez et évaluez les livrables par SAE." },
  'announcements': { title: "Publier une annonce", desc: "Communiquez avec vos étudiants et partagez des ressources." }
}

const pageTitle = computed(() => pageInfo[currentView.value]?.title || "Vue")
const pageDesc = computed(() => pageInfo[currentView.value]?.desc || "")

// currentView géré par le routeur

onMounted(async () => {
    try {
        const resSaes = await axios.get('/api/saes');
        saes.value = resSaes.data;
    } catch (error) {
        console.error("Erreur API:", error);
    }
})
</script>
