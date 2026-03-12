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
                      
                      <div v-if="createSaeStatus" class="status-msg" :class="isCreateSaeError ? 'error-message' : 'success-message'">
                          {{ createSaeStatus }}
                      </div>

                      <div class="form-group">
                          <label class="form-label">Titre de la SAE *</label>
                          <input type="text" v-model="saeForm.title" class="form-control" placeholder="Ex: SAE 4.04 - Réalité Virtuelle">
                      </div>
                      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                          <div>
                              <label class="form-label">Semestre *</label>
                              <select v-model="saeForm.semestre" class="form-control">
                                  <option value="S1">Semestre 1</option>
                                  <option value="S2">Semestre 2</option>
                                  <option value="S3">Semestre 3</option>
                                  <option value="S4">Semestre 4</option>
                                  <option value="S5">Semestre 5</option>
                                  <option value="S6">Semestre 6</option>
                              </select>
                          </div>
                          <div>
                              <label class="form-label">Date limite de rendu *</label>
                              <input type="date" v-model="saeForm.deadline" class="form-control">
                          </div>
                      </div>
                      <div class="form-group">
                          <label class="form-label">Description et consignes *</label>
                          <textarea v-model="saeForm.description" class="form-control" placeholder="Objectifs pédagogiques, livrables attendus..."></textarea>
                      </div>

                      <div class="form-group">
                          <label class="form-label">Documents joints (Sujet, ressources, grille d'évaluation) :</label>
                          <div class="upload-zone" @click="triggerSaeFileInput" style="padding: 20px; cursor: pointer;">
                              <svg style="width: 24px; height: 24px; color: var(--text-secondary); margin-bottom: 8px;" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <div style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">
                                  {{ selectedSaeFileName || 'Glissez vos fichiers (PDF, ZIP, médias) ou cliquez pour parcourir' }}
                              </div>
                              <input type="file" ref="saeFileInput" @change="handleSaeFileSelect" hidden>
                          </div>
                      </div>

                      <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 32px 0;">

                      <div class="form-group">
                          <label class="form-label">Compétences évaluées * <span style="font-weight:normal; color:var(--text-secondary);">(La saisie des compétences est requise)</span></label>
                          
                          <div id="skills-container">
                              <div v-for="(skill, index) in skills" :key="index" class="skill-row" style="display: flex; gap: 12px; margin-bottom: 12px;">
                                  <input type="text" v-model="skills[index]" class="form-control" placeholder="Intitulé de la compétence (ex: Qualité UX/UI)" required>
                                  <button v-if="skills.length > 1" @click="removeSkill(index)" class="btn btn-outline" style="padding: 8px; color: var(--status-danger-text);">✖</button>
                              </div>
                          </div>
                          
                          <button class="btn btn-outline" style="margin-top: 8px;" @click="addSkill">
                              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                              Ajouter une compétence
                          </button>
                      </div>

                      <div style="background: var(--bg-app); padding: 16px; border-radius: var(--radius-sm); margin-top: 32px;">
                          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">Une fois soumise, la SAE devra être validée par l'administration avant d'être visible par les étudiants.</p>
                          <button class="btn btn-primary" @click="submitSae" :disabled="isCreatingSae">
                              {{ isCreatingSae ? 'Soumission...' : 'Soumettre pour validation' }}
                          </button>
                      </div>
                  </div>
              </div>
          </div>

          <!-- GRADING -->
          <div v-if="currentView === 'grading'" class="view-section active">
              <div v-if="gradingStatus" class="status-msg" :class="isGradingError ? 'error-message' : 'success-message'">
                  {{ gradingStatus }}
              </div>
              
              <div v-for="sae in saes.filter(s => s.status !== 'archived')" :key="'grade-'+sae.id" class="accordion">
                  <div class="accordion-header" :class="{ active: activeAccordion === sae.id }" @click="toggleAccordion(sae.id)">
                      {{ sae.title }}
                      <div style="display:flex; align-items:center; gap: 16px;">
                          <span v-if="sae.status === 'urgent' || sae.status === 'ongoing'" class="badge badge-success">EN ATTENTE (Projet en cours)</span>
                          <span v-else class="badge badge-warning">À CORRIGER</span>
                          <svg class="icon-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                  </div>
                  <div class="accordion-body" :class="{ active: activeAccordion === sae.id }">
                      
                      <!-- SAE en cours -->
                      <p v-if="sae.status === 'urgent' || sae.status === 'ongoing'" style="font-size: 14px; color: var(--text-secondary);">
                          Les rendus ne sont pas encore clôturés. Date limite : {{ sae.deadline }}.
                      </p>

                      <!-- SAE avec rendus -->
                      <template v-else>
                          <div v-if="isFetchingRendus" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">Chargement des rendus...</div>
                          <template v-else-if="saeRendus[sae.id]">
                              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-light);">
                                  <span style="font-size: 13px; color: var(--text-secondary);">{{ saeRendus[sae.id].length }} rendus disponibles</span>
                                  
                                  <div style="display: flex; gap: 12px;">
                                      <button class="btn btn-outline" style="color: var(--status-success-text); border-color: var(--status-success-border);" @click="markAllEvaluated(sae.id)">
                                          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                          Tout marquer comme évalué
                                      </button>
                                      <button class="btn btn-outline" style="color: var(--accent-purple); border-color: var(--accent-purple);">
                                          <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                          Tout télécharger (.zip)
                                      </button>
                                  </div>
                              </div>

                              <div v-if="saeRendus[sae.id].length === 0" style="color: var(--text-secondary); font-size: 14px;">Aucun rendu déposé pour cette SAE.</div>

                              <div v-for="rendu in saeRendus[sae.id]" :key="rendu.id" class="list-item" :class="{ evaluated: rendu.is_evaluated }">
                                  <div class="item-info">
                                      <div class="item-title">Rendu de {{ rendu.etudiant_nom }}</div>
                                      <div class="item-meta">Déposé le {{ formatDate(rendu.date_depot) }} • {{ rendu.nom_fichier }}</div>
                                  </div>
                                  <div style="display: flex; align-items: center; gap: 24px;">
                                      <label class="checkbox-wrapper">
                                          <input type="checkbox" class="eval-checkbox" :checked="rendu.is_evaluated" @change="toggleEvaluatedStatus(rendu)"> Déjà évalué
                                      </label>
                                      
                                      <div class="btn-group" style="display: flex; gap: 8px;">
                                          <a :href="'http://localhost:3000' + rendu.chemin_fichier" target="_blank" class="btn btn-outline" style="text-decoration: none;">Télécharger</a>
                                          <button class="btn btn-primary" @click="openGradeModal(rendu, sae.title)">Saisir la note</button>
                                      </div>
                                  </div>
                              </div>
                          </template>
                      </template>
                  </div>
              </div>
          </div>

          <!-- ANNOUNCEMENTS -->
          <div v-if="currentView === 'announcements'" class="view-section active">
               <div class="card" style="max-width: 800px;">
                  <div class="card-header">Rédiger une nouvelle annonce</div>
                  <div class="card-body">
                      
                      <div v-if="annonceStatus" class="status-msg" :class="isAnnonceError ? 'error-message' : 'success-message'">
                          {{ annonceStatus }}
                      </div>

                      <div class="form-group">
                          <label class="form-label">Titre de l'annonce : *</label>
                          <input type="text" v-model="annonceForm.titre" class="form-control" placeholder="Ex: Modification des consignes...">
                      </div>
                      <div class="form-group">
                          <label class="form-label">Message : *</label>
                          <textarea v-model="annonceForm.message" class="form-control" placeholder="Rédigez votre message ici..." rows="4"></textarea>
                      </div>
                      <div class="form-group">
                          <label class="form-label">Destinataires :</label>
                          <select v-model="annonceForm.destinataires" class="form-control">
                              <option value="Tous">Tous les étudiants</option>
                              <option value="MMI1">Promotion MMI 1</option>
                              <option value="MMI2">Promotion MMI 2</option>
                              <option value="MMI3">Promotion MMI 3</option>
                          </select>
                      </div>
                      <button class="btn btn-primary" @click="postAnnonce" :disabled="isPosting">
                          {{ isPosting ? 'Publication...' : "Publier l'annonce" }}
                      </button>
                  </div>
              </div>
          </div>

      </div>
  </main>

  <!-- MODAL -->
  <div class="modal-overlay" :class="{ active: isGradeModalOpen }" @click.self="closeGradeModal">
      <div class="modal-content">
          <h2 class="modal-title">Évaluer le rendu</h2>
          <div class="modal-subtitle" v-if="targetRendu">Rendu de {{ targetRendu.etudiant_nom }} • {{ targetRendu.saeTitle }}</div>
          
          <label class="form-label">Note obtenue :</label>
          <div class="grade-input-wrapper" style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
              <input type="number" min="0" max="20" step="0.5" placeholder="--" v-model="gradeForm.note" style="width: 80px; font-size: 24px; font-weight: 700; text-align: center; padding: 8px; border: 2px solid var(--border-light); border-radius: var(--radius-sm); outline: none;">
              <span>/ 20</span>
          </div>

          <div class="form-group">
              <label class="form-label">Commentaire pour les étudiants :</label>
              <textarea class="form-control" v-model="gradeForm.commentaire" placeholder="Détaillez votre retour pédagogique, les points forts, les axes d'amélioration..."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;">
              <button class="btn btn-outline" @click="closeGradeModal">Annuler</button>
              <button class="btn btn-primary" @click="submitGrade" :disabled="isGrading">
                  {{ isGrading ? 'Enregistrement...' : "Enregistrer l'évaluation" }}
              </button>
          </div>
      </div>
  </div>
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

// Fonctionnalité : Créer une SAE
const saeForm = ref({ title: '', semestre: 'S4', deadline: '', description: '' })
const skills = ref(['', '']) // Deux compétences par défaut
const saeFileInput = ref(null)
const selectedSaeFile = ref(null)
const selectedSaeFileName = ref('')
const isCreatingSae = ref(false)
const createSaeStatus = ref('')
const isCreateSaeError = ref(false)

const triggerSaeFileInput = () => { saeFileInput.value.click() }
const handleSaeFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedSaeFile.value = file
        selectedSaeFileName.value = file.name
    }
}
const addSkill = () => { skills.value.push('') }
const removeSkill = (index) => { skills.value.splice(index, 1) }

const submitSae = async () => {
    if (!saeForm.value.title || !saeForm.value.semestre || !saeForm.value.deadline || !saeForm.value.description || skills.value.some(s => !s.trim())) {
        createSaeStatus.value = "Veuillez remplir tous les champs obligatoires et compétences."
        isCreateSaeError.value = true
        return
    }
    
    isCreatingSae.value = true
    createSaeStatus.value = ''
    
    try {
        // Ajouter la SAE
        const saePayload = { ...saeForm.value, skills: skills.value } // Le backend ignorera les skills en DB pour l'instant (MVP)
        const response = await axios.post('/api/saes', saePayload)
        
        const newSaeId = response.data.id;

        // Uploader le fichier si présent
        if (selectedSaeFile.value) {
            const formData = new FormData()
            formData.append('document', selectedSaeFile.value)
            formData.append('saeId', newSaeId)
            await axios.post('/api/upload', formData)
        }

        createSaeStatus.value = "SAE soumise avec succès !"
        isCreateSaeError.value = false
        
        // Reset form
        saeForm.value = { title: '', semestre: 'S4', deadline: '', description: '' }
        skills.value = ['', '']
        selectedSaeFile.value = null
        selectedSaeFileName.value = ''
        
        // Refresh dashboard
        const resSaes = await axios.get('/api/saes');
        saes.value = resSaes.data;
        
    } catch (error) {
        createSaeStatus.value = error.response?.data?.error || "Erreur lors de la création de la SAE."
        isCreateSaeError.value = true
    } finally {
        isCreatingSae.value = false
        setTimeout(() => { createSaeStatus.value = '' }, 5000)
    }
}

// Fonctionnalité : Annonces
const annonceForm = ref({ titre: '', message: '', destinataires: 'Tous' })
const isPosting = ref(false)
const annonceStatus = ref('')
const isAnnonceError = ref(false)

const postAnnonce = async () => {
    if (!annonceForm.value.titre || !annonceForm.value.message) {
        annonceStatus.value = "Le titre et le message sont requis."
        isAnnonceError.value = true
        return
    }
    
    isPosting.value = true
    annonceStatus.value = ''
    
    try {
        await axios.post('/api/annonces', annonceForm.value)
        annonceStatus.value = "Annonce publiée avec succès !"
        isAnnonceError.value = false
        annonceForm.value = { titre: '', message: '', destinataires: 'Tous' }
    } catch (error) {
        annonceStatus.value = error.response?.data?.error || "Erreur de publication."
        isAnnonceError.value = true
    } finally {
        isPosting.value = false
        setTimeout(() => { annonceStatus.value = '' }, 5000)
    }
}

// Fonctionnalité : Évaluations
const activeAccordion = ref(null)
const saeRendus = ref({})
const isFetchingRendus = ref(false)

const toggleAccordion = async (saeId) => {
    if (activeAccordion.value === saeId) {
        activeAccordion.value = null
        return
    }
    activeAccordion.value = saeId
    
    if (!saeRendus.value[saeId]) {
        isFetchingRendus.value = true
        try {
            const res = await axios.get(`/api/rendus?sae_id=${saeId}`)
            saeRendus.value[saeId] = res.data
        } catch (error) {
            console.error("Erreur récupération rendus:", error)
        } finally {
            isFetchingRendus.value = false
        }
    }
}

const toggleEvaluatedStatus = async (rendu) => {
    const newStatus = !rendu.is_evaluated
    rendu.is_evaluated = newStatus // mise à jour optimiste OR juste visuelle
    try {
        await axios.put(`/api/rendus/${rendu.id}/status`, { is_evaluated: newStatus })
    } catch (error) {
        console.error("Erreur statut:", error)
        rendu.is_evaluated = !newStatus // rollback en cas d'erreur
    }
}

const markAllEvaluated = async (saeId) => {
    const rendus = saeRendus.value[saeId]
    if (!rendus) return
    
    for (const r of rendus) {
        if (!r.is_evaluated) {
            r.is_evaluated = true
            await axios.put(`/api/rendus/${r.id}/status`, { is_evaluated: true }).catch(console.error)
        }
    }
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Modale de notation
const isGradeModalOpen = ref(false)
const targetRendu = ref(null)
const gradeForm = ref({ note: '', commentaire: '' })
const isGrading = ref(false)
const gradingStatus = ref('')
const isGradingError = ref(false)

const openGradeModal = (rendu, saeTitle) => {
    targetRendu.value = { ...rendu, saeTitle }
    gradeForm.value.note = rendu.note !== null ? rendu.note : ''
    gradeForm.value.commentaire = rendu.commentaire_prof || ''
    isGradeModalOpen.value = true
}

const closeGradeModal = () => {
    isGradeModalOpen.value = false
    targetRendu.value = null
    gradeForm.value = { note: '', commentaire: '' }
}

const submitGrade = async () => {
    if (!gradeForm.value.note) {
        gradingStatus.value = "Veuillez entrer une note."
        isGradingError.value = true
        
        // Timeout pour effacer le statut d'erreur global (affiché au dessus des accordéons)
        setTimeout(() => { gradingStatus.value = '' }, 3000)
        return
    }
    
    isGrading.value = true
    
    try {
        const payload = { note: gradeForm.value.note, commentaire: gradeForm.value.commentaire }
        await axios.put(`/api/rendus/${targetRendu.value.id}/evaluation`, payload)
        
        gradingStatus.value = "Note et commentaires enregistrés !"
        isGradingError.value = false
        
        // Mettre à jour localement le rendu évalué
        const renduToUpdate = saeRendus.value[targetRendu.value.sae_id].find(r => r.id === targetRendu.value.id)
        if (renduToUpdate) {
            renduToUpdate.note = gradeForm.value.note
            renduToUpdate.commentaire_prof = gradeForm.value.commentaire
            renduToUpdate.is_evaluated = true
        }

        closeGradeModal()
    } catch (error) {
        console.error("Erreur évaluation:", error)
        gradingStatus.value = error.response?.data?.error || "Erreur lors de l'évaluation."
        isGradingError.value = true
    } finally {
        isGrading.value = false
        setTimeout(() => { gradingStatus.value = '' }, 5000)
    }
}


onMounted(async () => {
    try {
        const resSaes = await axios.get('/api/saes');
        saes.value = resSaes.data;
    } catch (error) {
        console.error("Erreur API:", error);
    }
})
</script>

<style scoped>
.status-msg {
    padding: 12px;
    border-radius: var(--radius-sm);
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 500;
}
.error-message {
    color: var(--status-danger-text);
    background-color: var(--status-danger-bg);
    border: 1px solid var(--status-danger-border);
}
.success-message {
    color: var(--status-success-text);
    background-color: var(--status-success-bg);
    border: 1px solid var(--status-success-border);
}
</style>
