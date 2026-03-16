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
                              
                              <div v-if="saes.length === 0" style="color: var(--text-secondary); font-size: 14px;">Aucune donnée disponible.</div>
                              
                              <div v-for="sae in saes" :key="sae.id" class="list-item" style="margin-bottom: 8px;">
                                  <div class="item-info">
                                      <div class="item-title">{{ sae.title }}</div>
                                      <div class="item-meta">{{ sae.level || 'Non spécifié' }} • Échéance : {{ formatDate(sae.due_date) }} • {{ sae.groupType || 'Non spécifié' }}</div>
                                  </div>
                                  
                                  <span v-if="sae.status === 'urgent'" class="badge badge-warning" style="background:#fef3c7; color:#d97706; border-color:#fde68a;">PROCHE ÉCHÉANCE</span>
                                  <span v-else-if="sae.status === 'done'" class="badge badge-success" style="background:var(--status-success-bg); color:var(--status-success-text); border-color:var(--status-success-border);">TERMINÉ</span>
                                  
                                  <div class="btn-group" style="display: flex; gap: 8px;">
                                      <button class="btn btn-outline" @click="openEditModal(sae)">Éditer</button>
                                      <button class="btn btn-outline" style="border-color: var(--status-danger-border); color: var(--status-danger-text);" @click="deleteSae(sae.id)">Supprimer</button>
                                  </div>
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
                                        {{ sae.progress_count }} / {{ sae.total_students }} rendus
                                      </span>
                                  </div>
                                  <div class="progress-track">
                                      <div class="progress-fill" :style="{ width: (sae.progress_count / sae.total_students * 100) + '%', backgroundColor: sae.progress_count === sae.total_students ? 'var(--status-success-text)' : 'var(--accent-blue)' }"></div>
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
                              <div v-for="sae in saes.filter(s => s.status !== 'archived')" :key="'cor-'+sae.id" class="list-item" style="padding: 12px; border-color: var(--status-warning-border);">
                                  <div class="item-info">
                                      <div class="item-title">{{ sae.title }} : {{ sae.progress_count }} rendu(s) détecté(s)</div>
                                  </div>
                                  <button class="btn btn-primary" style="padding: 6px 12px;" @click="switchView('grading', sae.id)">Ouvrir</button>
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
                              <label class="form-label">Date limite de rendu *</label>
                              <input type="date" v-model="saeForm.due_date" class="form-control">
                          </div>
                          <div>
                              <label class="form-label">Niveau (ex: B.U.T. 2)</label>
                              <input type="text" v-model="saeForm.level" class="form-control" placeholder="B.U.T. 2">
                          </div>
                      </div>
                      
                      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                          <div>
                              <label class="form-label">Statut initial</label>
                              <select v-model="saeForm.status" class="form-control">
                                  <option value="ongoing">En cours</option>
                                  <option value="urgent">Urgent (< 7 jours)</option>
                                  <option value="done">Terminé</option>
                              </select>
                          </div>
                          <div>
                              <label class="form-label">Type de groupe</label>
                              <select v-model="saeForm.groupType" class="form-control">
                                  <option value="Non spécifié">Non spécifié</option>
                                  <option value="Travail individuel">Travail individuel</option>
                                  <option value="Travail de groupe">Travail de groupe</option>
                              </select>
                          </div>
                      </div>
                      <div class="form-group">
                          <label class="form-label">Description et consignes *</label>
                          <textarea v-model="saeForm.description" class="form-control" placeholder="Objectifs pédagogiques, livrables attendus..." rows="4"></textarea>
                      </div>

                      <div class="form-group">
                          <label class="form-label">Compétences évaluées *</label>
                          <textarea v-model="saeForm.competences" class="form-control" placeholder="Ex: Développer des interfaces utilisateur, Optimiser les requêtes SQL..."></textarea>
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
                          <span v-if="sae.progress_count === 0" class="badge badge-success">AUCUN RENDU</span>
                          <span v-else class="badge badge-warning">{{ sae.progress_count }} RENDU(S) DÉPOSÉ(S)</span>
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
                                      <span v-if="rendu.status === 'graded'" class="badge badge-success">NOTÉ ({{ rendu.note }}/20)</span>
                                      <span v-else class="badge badge-warning">À NOTER</span>
                                      
                                      <div class="btn-group" style="display: flex; gap: 8px;">
                                          <a :href="'http://localhost:3000' + rendu.chemin_fichier" target="_blank" class="btn btn-outline" style="text-decoration: none;">Télécharger</a>
                                          <button class="btn btn-primary" @click="openGradeModal(rendu, sae.title)">
                                              {{ rendu.status === 'graded' ? 'Modifier la note' : 'Saisir la note' }}
                                          </button>
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
  <!-- EDIT SAE MODAL -->
  <div class="modal-overlay" :class="{ active: isEditModalOpen }" @click.self="closeEditModal">
      <div class="modal-content" style="max-width: 600px;">
          <h2 class="modal-title">Éditer la SAE</h2>
          
          <div v-if="editStatus" class="status-msg" :class="isEditError ? 'error-message' : 'success-message'" style="margin-bottom: 16px;">
              {{ editStatus }}
          </div>

          <div class="form-group">
              <label class="form-label">Titre de la SAE *</label>
              <input type="text" v-model="editingSae.title" class="form-control">
          </div>
          <div class="form-group">
              <label class="form-label">Date limite de rendu *</label>
              <input type="date" v-model="editingSae.due_date" class="form-control">
          </div>
          <div class="form-group">
              <label class="form-label">Statut</label>
              <select v-model="editingSae.status" class="form-control">
                  <option value="ongoing">En cours</option>
                  <option value="urgent">Urgent</option>
                  <option value="done">Terminé</option>
              </select>
          </div>
          <div class="form-group">
              <label class="form-label">Description</label>
              <textarea v-model="editingSae.description" class="form-control" rows="3"></textarea>
          </div>
          <div class="form-group">
              <label class="form-label">Compétences</label>
              <textarea v-model="editingSae.competences" class="form-control" rows="2"></textarea>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;">
              <button class="btn btn-outline" @click="closeEditModal">Annuler</button>
              <button class="btn btn-primary" @click="submitEditSae" :disabled="isEditingSae">
                  {{ isEditingSae ? 'Enregistrement...' : 'Mettre à jour' }}
              </button>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import Sidebar from '../components/teacher/Sidebar.vue'
import Header from '../components/teacher/Header.vue'

const route = useRoute()
const router = useRouter()
const currentView = computed(() => route.params.view || 'dashboard')
const saes = ref([])

const switchView = (viewName, saeId = null) => {
    router.push(`/teacher/${viewName}`)
    if (saeId) {
        setTimeout(() => { toggleAccordion(saeId) }, 200)
    }
}

const pageInfo = {
  'dashboard': { title: "Vue globale de l'avancement", desc: "Supervision de vos projets du semestre et suivi des rendus." },
  'create-sae': { title: "Création d'une SAE", desc: "Remplissez le formulaire de compétences pour soumettre votre projet." },
  'grading': { title: "Évaluation des rendus", desc: "Consultez, téléchargez et évaluez les livrables par SAE." },
  'announcements': { title: "Publier une annonce", desc: "Communiquez avec vos étudiants et partagez des ressources." }
}

const pageTitle = computed(() => pageInfo[currentView.value]?.title || "Vue")
const pageDesc = computed(() => pageInfo[currentView.value]?.desc || "")

// Fonctionnalité : Créer une SAE
const saeForm = ref({ title: '', due_date: '', description: '', competences: '', status: 'ongoing', level: 'B.U.T. 2', groupType: 'Travail de groupe' })
const isCreatingSae = ref(false)
const createSaeStatus = ref('')
const isCreateSaeError = ref(false)

const submitSae = async () => {
    if (!saeForm.value.title || !saeForm.value.due_date || !saeForm.value.description || !saeForm.value.competences) {
        createSaeStatus.value = "Veuillez remplir tous les champs obligatoires (Titre, Description, Compétences, Date de rendu)."
        isCreateSaeError.value = true
        return
    }
    
    isCreatingSae.value = true
    createSaeStatus.value = ''
    
    try {
        await axios.post('/api/saes', saeForm.value)
        
        createSaeStatus.value = "SAE soumise avec succès !"
        isCreateSaeError.value = false
        
        // Reset form
        saeForm.value = { title: '', due_date: '', description: '', competences: '', status: 'ongoing', level: 'B.U.T. 2', groupType: 'Travail de groupe' }
        
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

// Fonctionnalité : Éditer & Supprimer
const isEditModalOpen = ref(false)
const editingSae = ref({})
const isEditingSae = ref(false)
const editStatus = ref('')
const isEditError = ref(false)

const openEditModal = (sae) => {
    editingSae.value = { ...sae }
    isEditModalOpen.value = true
    editStatus.value = ''
}

const closeEditModal = () => {
    isEditModalOpen.value = false
    editingSae.value = {}
}

const submitEditSae = async () => {
    if (!editingSae.value.title || !editingSae.value.due_date) return;
    isEditingSae.value = true;
    try {
        await axios.put(`/api/saes/${editingSae.value.id}`, editingSae.value)
        const resSaes = await axios.get('/api/saes');
        saes.value = resSaes.data;
        closeEditModal();
    } catch (e) {
        editStatus.value = e.response?.data?.error || "Erreur lors de la modification";
        isEditError.value = true;
    } finally {
        isEditingSae.value = false;
    }
}

const deleteSae = async (id) => {
    if(!confirm("Voulez-vous vraiment supprimer cette SAE ? Tous les rendus associés seront perdus.")) return;
    try {
        await axios.delete(`/api/saes/${id}`)
        const resSaes = await axios.get('/api/saes');
        saes.value = resSaes.data;
    } catch (e) {
        alert(e.response?.data?.error || "Erreur lors de la suppression")
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
    gradeForm.value.note = (rendu.status === 'graded' && rendu.note !== null) ? rendu.note : ''
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
            renduToUpdate.status = 'graded'
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
