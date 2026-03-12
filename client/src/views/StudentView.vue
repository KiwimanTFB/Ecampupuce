<template>
  <Sidebar :currentView="currentView" @switchView="switchView" />
  
  <main>
      <Header />

      <div class="workspace">
          <div class="page-title">
              <h1>{{ pageTitle }}</h1>
              <p>{{ pageDesc }}</p>
              
              <!-- Ajout d'une zone pour tester l'API -->
              <div v-if="apiMessage" style="color: var(--status-success-text); margin-top: 10px; font-weight: 500;">
                  Message de l'API : {{ apiMessage }}
              </div>
          </div>

          <!-- DASHBOARD -->
          <div v-if="currentView === 'dashboard'" class="view-section active">
              <div class="grid">
                  <div>
                      <div class="section-title">Échéances prioritaires (&lt; 7 jours)</div>
                      <div class="sae-item urgent">
                          <div class="sae-header">
                              <div class="sae-title">SAE 4.03 - Architecture Découplée</div>
                              <span class="badge badge-danger">URGENT - J-4</span>
                          </div>
                          <div class="sae-meta">À rendre le 15 Mars 2026 • Projet de groupe</div>
                          <div class="btn-group">
                              <button class="btn btn-primary" @click="switchView('deliverables')">Déposer maintenant</button>
                          </div>
                      </div>

                      <div class="section-title">Échéances normales</div>
                      <div class="sae-item ongoing">
                          <div class="sae-header">
                              <div class="sae-title">SAE 4.02 - Portfolio Professionnel</div>
                              <span class="badge badge-info">EN COURS</span>
                          </div>
                          <div class="sae-meta">À rendre le 28 Mars 2026 • Projet individuel</div>
                      </div>
                  </div>

                  <div>
                      <div class="card">
                          <div class="card-header">
                              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              Annonces récentes
                          </div>
                          <div class="card-body">
                              <div class="feed-item active">
                                  <div class="feed-header">
                                      <div class="feed-title">Soutenance SAE 4.01</div>
                                      <div class="feed-time">10:30</div>
                                  </div>
                                  <div class="feed-body">
                                      Les notes et les retours de la SAE 4.01 sont désormais disponibles sur votre espace.
                                  </div>
                              </div>
                              <div class="feed-item">
                                  <div class="feed-header">
                                      <div class="feed-title">Modification SAE 4.03</div>
                                      <div class="feed-time">Hier</div>
                                  </div>
                                  <div class="feed-body">
                                      Le format JSON est exigé pour tous les retours de l'API RESTful.
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- PROJECTS -->
          <div v-if="currentView === 'projects'" class="view-section active">
              <div class="sae-item ongoing">
                  <div class="sae-header">
                      <div class="sae-title">SAE 4.02 - Portfolio Professionnel</div>
                      <span class="badge badge-info">EN COURS</span>
                  </div>
                  <div class="sae-desc">Mise à jour du portfolio en ligne pour intégrer les travaux de deuxième année en vue de la recherche de stage.</div>
                  <div class="sae-details">
                      <div class="detail-item">Échéance : 28 Mars 2026</div>
                      <div class="detail-item">Travail individuel</div>
                  </div>
              </div>
          </div>

          <!-- DELIVERABLES -->
          <div v-if="currentView === 'deliverables'" class="view-section active">
              <div class="grid">
                  <div>
                      <div class="card">
                          <div class="card-header">Nouveau dépôt</div>
                          <div class="card-body">
                              <div class="upload-zone">
                                  <svg class="upload-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                  <div style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">Glissez vos fichiers ici</div>
                              </div>
                              <button class="btn btn-primary" style="margin-top: 16px; width: 100%; justify-content: center;">Confirmer le dépôt</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- GRADES -->
          <div v-if="currentView === 'grades'" class="view-section active">
              <div class="section-title">Semestre 4</div>
              <div class="feedback-card">
                  <div class="grade-box">
                      <div class="grade-score">15.5<span style="font-size: 18px; color: var(--text-secondary);">/20</span></div>
                      <div class="grade-label">Note Finale</div>
                  </div>
                  <div class="feedback-content">
                      <div class="feedback-title">SAE 4.01 - Ergonomie et Web Design</div>
                      <div class="feedback-comment">
                          "Excellent travail sur l'accessibilité des couleurs et la hiérarchie de l'information."
                      </div>
                  </div>
              </div>
          </div>

      </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../components/student/Sidebar.vue'
import Header from '../components/student/Header.vue'

const currentView = ref('dashboard')
const apiMessage = ref('')

const pageInfo = {
  'dashboard': { title: "Vue d'ensemble", desc: "Suivi de vos situations d'apprentissage et d'évaluation en cours." },
  'projects': { title: "Projets SAE (Semestre 4)", desc: "Consultez et gérez vos projets du semestre actuel." },
  'deliverables': { title: "Espace Documents", desc: "Déposez vos travaux et consultez l'historique de vos rendus." },
  'grades': { title: "Notes & Retours", desc: "Consultez vos évaluations et les commentaires de vos enseignants." },
  'archives': { title: "Anciens semestres", desc: "Consultez l'historique de vos SAE des années et semestres passés." }
}

const pageTitle = computed(() => pageInfo[currentView.value]?.title || "Vue")
const pageDesc = computed(() => pageInfo[currentView.value]?.desc || "")

function switchView(viewId) {
  currentView.value = viewId
}

onMounted(async () => {
    try {
        const response = await axios.get('/api/test');
        apiMessage.value = response.data.message;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'API:", error);
    }
})
</script>
