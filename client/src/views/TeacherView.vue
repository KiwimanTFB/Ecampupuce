<template>
  <Sidebar :currentView="currentView" @switchView="switchView" />
  
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
                              <div class="list-item" style="margin-bottom: 8px;">
                                  <div class="item-info">
                                      <div class="item-title">SAE 4.04 - Réalité Virtuelle</div>
                                      <div class="item-meta">BUT2 • Proposition envoyée le 11 Mars</div>
                                  </div>
                                  <span class="badge badge-warning" style="background:#fef3c7; color:#d97706; border-color:#fde68a;">EN ATTENTE VALIDATION</span>
                              </div>

                              <div class="list-item" style="margin-bottom: 8px;">
                                  <div class="item-info">
                                      <div class="item-title">SAE 4.03 - Architecture Découplée</div>
                                      <div class="item-meta">BUT2 • Échéance : 15 Mars 2026 • Groupes de 3</div>
                                  </div>
                                  <button class="btn btn-outline">Éditer</button>
                              </div>
                          </div>
                      </div>

                      <div class="card">
                          <div class="card-header">
                              <div class="card-header-title">
                                  <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                                  Avancement des rendus
                              </div>
                          </div>
                          <div class="card-body">
                              <div class="progress-block">
                                  <div class="progress-header">
                                      <span>SAE 4.03 - Architecture Découplée</span>
                                      <span style="color: var(--text-secondary);">12 / 15 Groupes</span>
                                  </div>
                                  <div class="progress-track">
                                      <div class="progress-fill" style="width: 80%;"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div>
                      <div class="card">
                          <div class="card-header">
                              <div class="card-header-title">
                                  <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                  À corriger
                              </div>
                          </div>
                          <div class="card-body" style="padding: 16px;">
                              <div class="list-item" style="padding: 12px; border-color: var(--status-warning-border);">
                                  <div class="item-info">
                                      <div class="item-title">SAE 4.01 : 15 rendus en attente</div>
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
              <div class="accordion">
                  <div class="accordion-header active">
                      SAE 4.01 - Ergonomie et Web Design
                      <div style="display:flex; align-items:center; gap: 16px;">
                          <span class="badge badge-warning">15 À CORRIGER</span>
                      </div>
                  </div>
                  <div class="accordion-body active">
                      <div class="list-item" id="row-group-a">
                          <div class="item-info">
                              <div class="item-title">Groupe A (Alexandre D., Marie L., Thomas B.)</div>
                              <div class="item-meta">Déposé le 28 Fév à 14h22 • Maquette_Figma_VFinale.pdf</div>
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
import { ref, computed } from 'vue'
import Sidebar from '../components/teacher/Sidebar.vue'
import Header from '../components/teacher/Header.vue'

const currentView = ref('dashboard')

const pageInfo = {
  'dashboard': { title: "Vue globale de l'avancement", desc: "Supervision de vos projets du semestre et suivi des rendus." },
  'create-sae': { title: "Création d'une SAE", desc: "Remplissez le formulaire de compétences pour soumettre votre projet." },
  'grading': { title: "Évaluation des rendus", desc: "Consultez, téléchargez et évaluez les livrables par SAE." },
  'announcements': { title: "Publier une annonce", desc: "Communiquez avec vos étudiants et partagez des ressources." }
}

const pageTitle = computed(() => pageInfo[currentView.value]?.title || "Vue")
const pageDesc = computed(() => pageInfo[currentView.value]?.desc || "")

function switchView(viewId) {
  currentView.value = viewId
}
</script>
