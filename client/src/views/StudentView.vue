<template>
  <Sidebar />
  
  <main>
      <Header />

      <div class="workspace">
          <div class="page-title">
              <h1>{{ pageTitle }}</h1>
              <p>{{ pageDesc }}</p>
          </div>

          <!-- DASHBOARD -->
          <div v-if="currentView === 'dashboard'" class="view-section active">
              <div class="grid">
                  <div>
                      <div class="section-title">Échéances prioritaires (&lt; 7 jours)</div>
                      <div v-if="urgentSaes.length === 0" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">Aucune échéance prioritaire.</div>
                      <div v-for="sae in urgentSaes" :key="sae.id_sae" class="sae-item urgent" @click="viewSaeDetail(sae)" style="cursor: pointer;">
                          <div class="sae-header">
                              <div class="sae-title">{{ sae.titre }}</div>
                              <span class="badge badge-danger">URGENT</span>
                          </div>
                          <div class="sae-meta">À rendre le {{ formatDate(sae.date_fin || sae.date_debut) }} • {{ sae.groupe || 'Travail de groupe' }}</div>
                          <div class="sae-desc" style="font-size: 13px; color: var(--text-primary); margin-bottom: 8px;">{{ sae.description }}</div>
                      </div>

                      <div class="section-title">Échéances normales</div>
                      <div v-if="ongoingSaes.length === 0" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">Aucune échéance en cours.</div>
                      <div v-for="sae in ongoingSaes" :key="sae.id_sae" class="sae-item ongoing" @click="viewSaeDetail(sae)" style="cursor: pointer;">
                          <div class="sae-header">
                              <div class="sae-title">{{ sae.titre }}</div>
                              <span class="badge badge-info">EN COURS</span>
                          </div>
                          <div class="sae-meta">À rendre le {{ formatDate(sae.date_fin || sae.date_debut) }} • {{ sae.groupe || 'Non spécifié' }}</div>
                          <div class="sae-desc" style="font-size: 13px; color: var(--text-primary); margin-bottom: 8px;">{{ sae.description }}</div>
                      </div>
                  </div>

                  <div>
                      <div class="card">
                          <div class="card-header">
                              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              Annonces récentes
                          </div>
                          <div class="card-body">
                              <div v-if="annonces.length === 0" style="color: var(--text-secondary); font-size: 14px; padding: 12px;">
                                  Aucune annonce publiée.
                              </div>
                              <div v-for="(annonce, index) in annonces" :key="annonce.id_annonce" class="feed-item" :class="{ 'active': index === 0 }">
                                  <div class="feed-header">
                                      <div class="feed-title">{{ annonce.titre }}</div>
                                      <div class="feed-time">{{ formatDate(annonce.date_publi || annonce.date_creation) }}</div>
                                  </div>
                                  <div class="feed-body">
                                      {{ annonce.contenu || annonce.message }}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- PROJECTS GALLERY -->
          <div v-if="currentView === 'projects'" class="view-section active">
              <div v-if="saes.length === 0" style="color: var(--text-secondary); font-size: 14px;">Aucune SAE pour le moment</div>
              
              <div v-for="sae in saes" :key="sae.id_sae" class="sae-item ongoing" @click="viewSaeDetail(sae)" style="cursor: pointer;">
                  <div class="sae-header">
                      <div class="sae-title">{{ sae.titre }}</div>
                  </div>
                  <div class="sae-desc">{{ sae.description }}</div>
                  <div class="sae-details">
                      <div class="detail-item">Affecté au groupe : {{ sae.groupe }}</div>
                      <div class="detail-item">Semestre : {{ sae.semestre }}</div>
                  </div>
              </div>
          </div>
          
           <!-- SAE DETAIL (New View) -->
          <div v-if="currentView === 'sae-detail'" class="view-section active">
              <button class="btn btn-outline" @click="currentView = 'projects'" style="margin-bottom: 20px;">&larr; Retour aux SAEs</button>
              
              <div v-if="selectedSaeDetails" class="grid" style="grid-template-columns: 2fr 1fr; gap: 24px;">
                  <div>
                      <div class="card">
                          <div class="card-header" style="font-size: 18px; display: flex; align-items: center; justify-content: space-between;">
                              <div>
                                  {{ selectedSaeDetails.titre }}
                                  <span class="badge badge-info" v-if="selectedSaeDetails.code" style="margin-left: 8px;">{{ selectedSaeDetails.code }}</span>
                              </div>
                          </div>
                          
                          <div class="card-body">
                              <img v-if="selectedSaeDetails.vignette_path" :src="getFileUrl(selectedSaeDetails.vignette_path)" @error="(e) => e.target.src = 'https://placehold.co/600x400?text=Image+Introuvable'" style="width:100%; max-height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
                              
                              <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #374151;">{{ selectedSaeDetails.description }}</p>
                              
                              <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px; color: #475569;">
                                  <div style="margin-bottom: 8px;"><strong>📅 Période :</strong> {{ formatDateDayOnly(selectedSaeDetails.date_debut) }} - {{ formatDateDayOnly(selectedSaeDetails.date_fin) }}</div>
                                  <div style="margin-bottom: 8px;"><strong>👥 Groupe ciblé :</strong> {{ selectedSaeDetails.groupe || 'Tous' }}</div>
                                  <div v-if="selectedSaeDetails.semestre"><strong>🎓 Semestre :</strong> {{ selectedSaeDetails.semestre }}</div>
                              </div>
                          </div>
                      </div>

                      <div class="card" style="margin-top: 24px;" v-if="selectedSaeDetails.parsedConsignes && selectedSaeDetails.parsedConsignes.length > 0">
                          <div class="card-header">Fichiers joints</div>
                          <div class="card-body" style="display: flex; gap: 12px; flex-wrap: wrap;">
                              <div v-for="(file, idx) in selectedSaeDetails.parsedConsignes" :key="idx">
                                  <a :href="getFileUrl(file)" target="_blank" class="btn btn-outline btn-sm" style="display:inline-flex; align-items:center; gap:8px;">
                                      📄 {{ getFileName(file) }}
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div>
                      <div class="card">
                          <div class="card-header">{{ hasExistingRendu ? 'Modifier mon rendu' : 'Déposer mon rendu' }}</div>
                          <div class="card-body" v-if="!isDeadlinePassed">
                              <div v-if="hasExistingRendu" class="alert alert-info" style="margin-bottom: 16px; padding: 12px; border-radius: 4px; font-size: 13px; text-align:center; background: rgba(37,99,235,0.1); color: var(--accent-blue);">
                                  Vous avez déjà déposé un fichier. Déposer un nouveau fichier écrasera l'ancien.
                              </div>
                              <div class="form-group" style="margin-bottom: 16px;">
                                  <label class="form-label" style="font-weight: bold; margin-bottom: 8px; display: block;">Notes / Liens (optionnel)</label>
                                  <textarea v-model="commentaireRendu" class="form-control" rows="3" placeholder="Lien Trello, GitHub, ou notes pour l'enseignant..." style="resize: vertical;"></textarea>
                              </div>

                              <div class="upload-zone" @click="triggerFileInput" style="cursor: pointer; position: relative; padding: 30px 16px; border: 2px dashed #9ca3af; border-radius:8px; text-align:center; background:#f9fafb; transition: background 0.2s;">
                                  <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #374151; word-break: break-all;">
                                      {{ selectedFileName || 'Cliquez ou glissez votre rendu ici' }}
                                  </div>
                                  <div style="font-size: 12px; color: #6b7280;">Format ZIP ou PDF</div>
                                  <input type="file" ref="fileInput" @change="handleFileSelect" accept=".zip,.pdf" hidden>
                              </div>

                              <div v-if="uploadMessage" :class="['alert', isUploadSuccess ? 'alert-success' : 'alert-danger']" style="margin-top: 16px; padding: 12px; border-radius: 4px; font-size: 13px; text-align:center;">
                                  {{ uploadMessage }}
                              </div>

                              <button class="btn btn-primary" @click="submitUpload" :disabled="!selectedFile || isUploading" style="margin-top: 16px; width: 100%; justify-content: center; padding: 12px; font-weight: bold;">
                                  {{ isUploading ? 'Envoi en cours...' : (hasExistingRendu ? 'Modifier mon rendu' : 'Envoyer mon rendu') }}
                              </button>
                          </div>
                          <div class="card-body" v-else>
                              <div class="alert alert-danger" style="margin-top:0; padding:16px; text-align:center; background:#fee2e2; color:#991b1b; border-radius:8px;">
                                  <div style="font-size: 24px; margin-bottom:8px;">⏳</div>
                                  <strong style="font-size: 15px;">Délai expiré</strong><br>
                                  <div style="margin-top: 8px; font-size: 13px;">La date limite pour ce rendu a été atteinte. Vous ne pouvez plus déposer ni modifier de fichiers.</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- DOCUMENTS -->
          <div v-if="currentView === 'deliverables'" class="view-section active">
              <div v-if="mesDocuments.length === 0" style="color: var(--text-secondary); font-size: 14px;">Aucun document déposé pour le moment.</div>
              
              <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                  <div v-for="doc in mesDocuments" :key="doc.id_rendu" class="card">
                      <div class="card-body" style="padding: 20px;">
                          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                              <div style="font-weight: bold; color: var(--text-primary); font-size: 16px;">{{ doc.sae_titre }}</div>
                              <span class="badge badge-info">Déposé</span>
                          </div>
                          <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                              Fichier : {{ doc.chemin_fichier }}
                          </div>
                          <div style="font-size: 12px; color: #9ca3af; margin-bottom: 16px;">
                              Date : {{ formatDate(doc.date_depot) }}
                          </div>
                          <a :href="getFileUrl(doc.chemin_fichier)" target="_blank" class="btn btn-primary" style="width: 100%; text-align: center; text-decoration: none;">
                              Télécharger
                          </a>
                      </div>
                  </div>
              </div>
          </div>

          <!-- GRADES -->
          <div v-if="currentView === 'grades'" class="view-section active">
              <div v-if="mesNotes.length === 0" style="color: var(--text-secondary); font-size: 14px;">Aucune évaluation disponible pour le moment.</div>
              
              <div v-for="note in mesNotes" :key="note.id_rendu" class="feedback-card">
                  <div class="grade-box" style="border-color: var(--status-success-border);">
                      <div class="grade-score">{{ note.note !== null ? note.note : '?' }}<span style="font-size: 18px; color: var(--text-secondary);">/20</span></div>
                      <div class="grade-label">Note Finale</div>
                  </div>
                  <div class="feedback-content">
                      <div class="feedback-title">{{ note.titre }} <span class="badge badge-info" v-if="note.code">{{ note.code }}</span></div>
                      <div class="feedback-comment">
                          "{{ note.commentaire_prof || 'Aucun commentaire du correcteur.' }}"
                      </div>
                      <div style="font-size: 11px; color: #9ca3af; margin-top: 8px;">
                          Document rendu déposé le : {{ formatDate(note.date_depot) }}
                      </div>
                  </div>
              </div>
          </div>

      </div>
      
      <div v-if="toastMsg" class="toast" :class="toastType">
          {{ toastMsg }}
      </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Sidebar from '../components/student/Sidebar.vue'
import Header from '../components/student/Header.vue'

const route = useRoute()
const currentView = ref(route.params.view || 'dashboard')
watch(() => route.params.view, (newVal) => { if(newVal) currentView.value = newVal })

const saes = ref([])
const annonces = ref([])
const mesNotes = ref([])
const mesDocuments = ref([])

const selectedSaeDetails = ref(null)
const fileInput = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const commentaireRendu = ref('')
const isUploading = ref(false)
const uploadMessage = ref('')
const isUploadSuccess = ref(false)

const toastMsg = ref('')
const toastType = ref('success')
const showToast = (msg, type = 'success') => {
    toastMsg.value = msg
    toastType.value = type
    setTimeout(() => { toastMsg.value = '' }, 4000)
}

let pollingInterval = null;

const pageInfo = {
  'dashboard': { title: "Vue d'ensemble", desc: "Suivi de vos situations d'apprentissage et d'évaluation en cours." },
  'projects': { title: "Projets SAE", desc: "Consultez et gérez vos projets du semestre actuel." },
  'sae-detail': { title: "Détail de la SAE", desc: "Consultez le sujet et déposez votre travail." },
  'deliverables': { title: "Mon Espace Documents", desc: "Consultez et téléchargez l'historique de vos dépôts." },
  'grades': { title: "Notes & Retours", desc: "Consultez vos évaluations et les commentaires de vos enseignants." }
}

const pageTitle = computed(() => pageInfo[currentView.value]?.title || "Espace Étudiant")
const pageDesc = computed(() => pageInfo[currentView.value]?.desc || "")


function getFileName(path) {
    if (!path) return "Fichier";
    const parts = path.split('/');
    let name = parts[parts.length - 1];
    const match = name.match(/^\d+-(.+)$/);
    if (match) return match[1];
    return name;
}

const isDeadlinePassed = computed(() => {
    if (!selectedSaeDetails.value || !selectedSaeDetails.value.date_fin) return false;
    const deadline = new Date(selectedSaeDetails.value.date_fin);
    deadline.setHours(23, 59, 59, 999);
    return new Date() > deadline;
})

const hasExistingRendu = computed(() => {
    if (!selectedSaeDetails.value) return false;
    return mesDocuments.value.some(doc => doc.id_sae === selectedSaeDetails.value.id_sae);
})

const urgentSaes = computed(() => saes.value.filter(s => isUrgent(s.date_fin || s.date_debut)))
const ongoingSaes = computed(() => saes.value.filter(s => !isUrgent(s.date_fin || s.date_debut)))

function isUrgent(due_date) {
    if (!due_date) return false
    const now = new Date()
    const due = new Date(due_date)
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
}

function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit'
    }).format(date)
}

function formatDateDayOnly(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
    }).format(date)
}

function viewSaeDetail(sae) {
    let parsedConsignes = []
    if (sae.consignes_paths) {
        try { parsedConsignes = JSON.parse(sae.consignes_paths) } catch(e) {}
    }
    selectedSaeDetails.value = { ...sae, parsedConsignes }
    selectedFile.value = null
    selectedFileName.value = ''
    commentaireRendu.value = ''
    uploadMessage.value = ''
    currentView.value = 'sae-detail'
}

function triggerFileInput() {
    fileInput.value.click()
}

function handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) {
        if (!file.name.endsWith('.zip') && file.type !== 'application/pdf') {
            uploadMessage.value = 'Format non autorisé. ZIP ou PDF uniquement.';
            isUploadSuccess.value = false;
            return;
        }
        selectedFile.value = file
        selectedFileName.value = file.name
        uploadMessage.value = ''
    }
}

async function submitUpload() {
    if (!selectedFile.value || !selectedSaeDetails.value) return

    isUploading.value = true
    uploadMessage.value = ''

    const formData = new FormData()
    formData.append('document', selectedFile.value)
    formData.append('saeId', selectedSaeDetails.value.id_sae)
    if (commentaireRendu.value) formData.append('commentaire', commentaireRendu.value)

    try {
        const token = localStorage.getItem('token')
        await axios.post('/api/rendus', formData, {
            headers: { Authorization: `Bearer ${token}` }
        })

        isUploadSuccess.value = true
        uploadMessage.value = "Document déposé avec succès !"
        showToast("Rendu déposé.", "success")
        
        selectedFile.value = null
        selectedFileName.value = ''
        if (fileInput.value) fileInput.value.value = ''
        
    } catch (error) {
        console.error("ERREUR UPLOAD:", error);
        isUploadSuccess.value = false
        const serverError = error.response?.data?.error || error.response?.data?.details;
        uploadMessage.value = serverError || "Erreur lors de l'envoi du fichier. Merci de contacter un administrateur.";
        showToast(uploadMessage.value, "error")
    } finally {
        isUploading.value = false
    }
}

const fetchData = async () => {
    try {
        const token = localStorage.getItem('token')
        const opts = { headers: { Authorization: `Bearer ${token}` } }
        
        const [resSaes, resAnnonces, resNotes, resDocs] = await Promise.all([
            axios.get('/api/saes', opts).catch(() => ({data: []})),
            axios.get('/api/annonces', opts).catch(() => ({data: []})),
            axios.get('/api/mes-notes', opts).catch(() => ({data: []})),
            axios.get('/api/mes-documents', opts).catch(() => ({data: []}))
        ])
        
        if(resSaes.data.length > 0) saes.value = resSaes.data.filter(s => s.statut === 'Validé');
        if(resAnnonces.data) annonces.value = resAnnonces.data;
        if(resNotes.data) mesNotes.value = resNotes.data;
        if(resDocs.data) {
            mesDocuments.value = resDocs.data;
            console.log("Documents récupérés :", resDocs.data);
        }
    } catch (e) { console.error("Erreur Sync", e) }
}

onMounted(() => {
    fetchData()
    // MISSION 4: ZERO REFRESH POLLING
    pollingInterval = setInterval(fetchData, 5000);
});
</script>

<style scoped>
.sae-item { border: 1px solid var(--border-light); padding: 16px; border-radius: var(--radius-md); margin-bottom: 12px; transition: transform 0.2s, box-shadow 0.2s; background: var(--bg-surface); }
.sae-item:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }
.toast { position: fixed; top: 20px; right: 20px; padding: 16px 24px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-light); box-shadow: var(--shadow-card); z-index: 10000; font-weight: bold; animation: slideIn 0.3s ease-out forwards; color: var(--text-primary); }
.toast.success { border-left: 4px solid var(--status-success-text); }
.toast.error { border-left: 4px solid var(--status-danger-text); }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.badge { padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; }
.badge-danger { background: var(--status-danger-bg); color: var(--status-danger-text); border: 1px solid var(--status-danger-border); }
.badge-info { background: var(--status-info-bg); color: var(--status-info-text); border: 1px solid var(--status-info-border); }
.alert { border: 1px solid transparent; padding: 12px; border-radius: var(--radius-sm); margin-bottom: 12px; }
.alert-success { background: var(--status-success-bg); color: var(--status-success-text); border-color: var(--status-success-border); }
.alert-danger { background: var(--status-danger-bg); color: var(--status-danger-text); border-color: var(--status-danger-border); }
</style>
