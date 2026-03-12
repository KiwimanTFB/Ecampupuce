<template>
  <Sidebar />
  
  <main>
      <Header />

      <div class="workspace">
          <div class="page-title">
              <h1>{{ pageTitle }}</h1>
              <p>{{ pageDesc }}</p>
              
              <div v-if="apiMessage" style="color: var(--status-success-text); margin-top: 10px; font-weight: 500;">
                  Message de l'API : {{ apiMessage }}
              </div>
          </div>

          <!-- DASHBOARD -->
          <div v-if="currentView === 'dashboard'" class="view-section active">
              <div class="grid">
                  <div>
                      <div class="section-title">Échéances prioritaires (&lt; 7 jours)</div>
                      <div v-if="urgentSaes.length === 0" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">Aucune échéance prioritaire.</div>
                      <div v-for="sae in urgentSaes" :key="sae.id" class="sae-item urgent">
                          <div class="sae-header">
                              <div class="sae-title">{{ sae.title }}</div>
                              <span class="badge badge-danger">URGENT</span>
                          </div>
                          <div class="sae-meta">À rendre le {{ sae.deadline }} • {{ sae.groupType }}</div>
                          <div class="btn-group">
                              <button class="btn btn-primary" @click="switchView('deliverables')">Déposer maintenant</button>
                          </div>
                      </div>

                      <div class="section-title">Échéances normales</div>
                      <div v-if="ongoingSaes.length === 0" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">Aucune échéance en cours.</div>
                      <div v-for="sae in ongoingSaes" :key="sae.id" class="sae-item ongoing">
                          <div class="sae-header">
                              <div class="sae-title">{{ sae.title }}</div>
                              <span class="badge badge-info">EN COURS</span>
                          </div>
                          <div class="sae-meta">À rendre le {{ sae.deadline }} • {{ sae.groupType }}</div>
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
                                      <div class="feed-title">Modification consignes</div>
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
              <div v-if="saes.length === 0" style="color: var(--text-secondary); font-size: 14px;">Chargement des projets...</div>
              
              <div v-for="sae in saes" :key="sae.id" :class="['sae-item', sae.status]">
                  <div class="sae-header">
                      <div class="sae-title">{{ sae.title }}</div>
                      <span v-if="sae.status === 'urgent'" class="badge badge-danger">URGENT</span>
                      <span v-else-if="sae.status === 'ongoing'" class="badge badge-info">EN COURS</span>
                      <span v-else-if="sae.status === 'done'" class="badge badge-success">TERMINÉ</span>
                  </div>
                  <div class="sae-desc">{{ sae.description }}</div>
                  <div class="sae-details">
                      <div class="detail-item">Échéance : {{ sae.deadline }}</div>
                      <div class="detail-item">{{ sae.groupType }}</div>
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
                              <div class="form-group" style="margin-bottom: 20px;">
                                  <label class="form-label">Sélectionnez la SAE concernée</label>
                                  <select v-model="selectedSaeId" class="form-control">
                                      <option value="" disabled>-- Choisir une SAE --</option>
                                      <option v-for="sae in saes" :key="sae.id" :value="sae.id">
                                          {{ sae.title }}
                                      </option>
                                  </select>
                              </div>

                              <div class="upload-zone" @click="triggerFileInput" style="cursor: pointer; position: relative;">
                                  <svg class="upload-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                  <div style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">
                                      {{ selectedFileName || 'Cliquez ou glissez vos fichiers ici' }}
                                  </div>
                                  <input type="file" ref="fileInput" @change="handleFileSelect" hidden>
                              </div>

                              <div v-if="uploadMessage" :class="['alert', isUploadSuccess ? 'alert-success' : 'alert-danger']" style="margin-top: 16px; padding: 12px; border-radius: 4px; font-size: 14px;" :style="{ backgroundColor: isUploadSuccess ? 'var(--status-success-bg)' : 'var(--status-danger-bg)', color: isUploadSuccess ? 'var(--status-success-text)' : 'var(--status-danger-text)' }">
                                  {{ uploadMessage }}
                              </div>

                              <button class="btn btn-primary" @click="submitUpload" :disabled="!selectedFile || !selectedSaeId || isUploading" style="margin-top: 16px; width: 100%; justify-content: center;">
                                  {{ isUploading ? 'Envoi en cours...' : 'Confirmer le dépôt' }}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- GRADES -->
          <div v-if="currentView === 'grades'" class="view-section active">
              <div class="section-title">Semestre 4</div>
              
              <div v-if="evaluatedSaes.length === 0" style="color: var(--text-secondary); font-size: 14px;">Aucune évaluation disponible pour le moment.</div>
              
              <div v-for="sae in evaluatedSaes" :key="sae.id" class="feedback-card">
                  <div class="grade-box">
                      <div class="grade-score">{{ sae.grade }}<span style="font-size: 18px; color: var(--text-secondary);">/20</span></div>
                      <div class="grade-label">Note Finale</div>
                  </div>
                  <div class="feedback-content">
                      <div class="feedback-title">{{ sae.title }}</div>
                      <div class="feedback-comment">
                          "{{ sae.comment }}"
                      </div>
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
import Sidebar from '../components/student/Sidebar.vue'
import Header from '../components/student/Header.vue'

const route = useRoute()
const currentView = computed(() => route.params.view || 'dashboard')
const apiMessage = ref('')
const saes = ref([])

// Champs Upload
const fileInput = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const selectedSaeId = ref('')
const isUploading = ref(false)
const uploadMessage = ref('')
const isUploadSuccess = ref(false)

const pageInfo = {
  'dashboard': { title: "Vue d'ensemble", desc: "Suivi de vos situations d'apprentissage et d'évaluation en cours." },
  'projects': { title: "Projets SAE (Semestre 4)", desc: "Consultez et gérez vos projets du semestre actuel." },
  'deliverables': { title: "Espace Documents", desc: "Déposez vos travaux et consultez l'historique de vos rendus." },
  'grades': { title: "Notes & Retours", desc: "Consultez vos évaluations et les commentaires de vos enseignants." },
  'archives': { title: "Anciens semestres", desc: "Consultez l'historique de vos SAE des années et semestres passés." }
}

const pageTitle = computed(() => pageInfo[currentView.value]?.title || "Vue")
const pageDesc = computed(() => pageInfo[currentView.value]?.desc || "")

const urgentSaes = computed(() => saes.value.filter(s => s.status === 'urgent'))
const ongoingSaes = computed(() => saes.value.filter(s => s.status === 'ongoing'))
const doneSaes = computed(() => saes.value.filter(s => s.status === 'done'))
const evaluatedSaes = computed(() => saes.value.filter(s => s.isEvaluated))

// currentView géré par le routeur

function triggerFileInput() {
    fileInput.value.click()
}

function handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        selectedFileName.value = file.name
        uploadMessage.value = ''
    }
}

async function submitUpload() {
    if (!selectedFile.value || !selectedSaeId.value) return

    isUploading.value = true
    uploadMessage.value = ''

    const formData = new FormData()
    formData.append('document', selectedFile.value)
    formData.append('saeId', selectedSaeId.value)

    try {
        const response = await axios.post('/api/upload', formData, {
            // Le Content-Type multipart/form-data est géré automatiquement par Axios + FormData
            // L'intercepteur global ajoute déjà le Authorization: Bearer
        })

        isUploadSuccess.value = true
        uploadMessage.value = "Document déposé avec succès !"
        
        // Réinitialiser le form
        selectedFile.value = null
        selectedFileName.value = ''
        if (fileInput.value) fileInput.value.value = ''
        
        // Rafraîchir les SAEs pour voir le changement de statut
        const resSaes = await axios.get('/api/saes')
        saes.value = resSaes.data
        
    } catch (error) {
        isUploadSuccess.value = false
        uploadMessage.value = error.response?.data?.error || "Erreur lors de l'envoi du fichier"
    } finally {
        isUploading.value = false
    }
}

onMounted(async () => {
    try {
        const resTest = await axios.get('/api/test');
        apiMessage.value = resTest.data.message;

        const resSaes = await axios.get('/api/saes');
        saes.value = resSaes.data;
    } catch (error) {
        console.error("Erreur API:", error);
    }
})
</script>
