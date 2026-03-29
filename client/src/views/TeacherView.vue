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
                              
                              <div v-for="sae in saes" :key="sae.id_sae" class="list-item" style="margin-bottom: 8px;">
                                  <div class="item-info">
                                      <div class="item-title">{{ sae.titre }}</div>
                                      <div class="item-meta">{{ sae.niveau || 'Non spécifié' }} • Début : {{ formatDate(sae.date_debut) }} • {{ sae.semestre || 'S1' }} {{ sae.annee_univ || '' }}</div>
                                  </div>
                                  
                                  <span v-if="sae.statut === 'En attente'" class="badge badge-warning" style="background:#fef3c7; color:#d97706; border-color:#fde68a;">En attente de validation</span>
                                  <span v-else-if="sae.statut === 'urgent'" class="badge badge-warning" style="background:#fef3c7; color:#d97706; border-color:#fde68a;">PROCHE ÉCHÉANCE</span>
                                  <span v-else-if="sae.statut === 'done'" class="badge badge-success" style="background:var(--status-success-bg); color:var(--status-success-text); border-color:var(--status-success-border);">TERMINÉ</span>
                                  <span v-else-if="sae.statut === 'Validé'" class="badge badge-success" style="background:var(--status-success-bg); color:var(--status-success-text); border-color:var(--status-success-border);">VALIDÉ</span>
                                  
                                  <div class="btn-group" style="display: flex; gap: 8px;">
                                      <button class="btn btn-outline" @click="openEditModal(sae)">Éditer</button>
                                      <button class="btn btn-outline" style="border-color: var(--status-danger-border); color: var(--status-danger-text);" @click="deleteSae(sae.id_sae)">Supprimer</button>
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
                              <div v-for="sae in saes" :key="'prog-'+sae.id_sae" class="progress-block" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--border-light);">
                                  <div style="font-size: 14px; font-weight: 500; color: var(--text-primary);">
                                      {{ sae.titre }}
                                  </div>
                                  <div style="font-size: 13px; font-weight: 600; padding: 4px 12px; border-radius: 99px;"
                                       :style="{ backgroundColor: (sae.progress_count && sae.progress_count > 0) ? 'var(--status-success-bg)' : 'var(--bg-app)', color: (sae.progress_count && sae.progress_count > 0) ? 'var(--status-success-text)' : 'var(--text-secondary)' }">
                                      {{ sae.progress_count || 0 }} rendu(s) déposé(s)
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
                              <div v-for="sae in saes.filter(s => s.statut !== 'archived')" :key="'cor-'+sae.id_sae" class="list-item" style="padding: 12px; border-color: var(--status-warning-border);">
                                  <div class="item-info">
                                      <div class="item-title">{{ sae.titre }} : {{ sae.progress_count || 0 }} rendu(s) détecté(s)</div>
                                  </div>
                                  <button class="btn btn-primary" style="padding: 6px 12px;" @click="switchView('grading', sae.id_sae)">Ouvrir</button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div v-if="currentView === 'create-sae'" class="view-section active">
              <div class="card" style="max-width: 800px;">
                  <div class="card-header">Proposition d'une nouvelle SAE</div>
                  <div class="card-body">

                      <div class="form-group">
                          <label class="form-label">Titre de la SAE *</label>
                          <input type="text" v-model="saeForm.titre" class="form-control" placeholder="Ex: Développement d'une application mobile">
                      </div>

                      <div class="form-group">
                          <label class="form-label">Vignette de la SAE (Image de garde) *</label>
                          <input type="file" @change="handleVignetteSelect" accept="image/jpeg, image/png, image/webp" class="form-control" style="padding: 8px;">
                      </div>
                      
                      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                          <div>
                              <label class="form-label">Description *</label>
                              <textarea v-model="saeForm.description" class="form-control" placeholder="Description générale" rows="3"></textarea>
                          </div>
                          <div>
                              <label class="form-label">Documents joints (Consignes) :</label>
                              <div class="upload-zone" style="padding: 20px; text-align: center; border: 2px dashed var(--border-light); cursor: pointer;"
                                   @dragover.prevent @drop.prevent="handleDrop" @click="$refs.fileInput.click()">
                                  <svg style="width: 24px; height: 24px; color: var(--text-secondary); margin-bottom: 8px;" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                  <div style="font-size: 13px; color: var(--text-secondary);">
                                      <span>Glissez vos fichiers (PDF, ZIP, médias) ou cliquez pour parcourir</span>
                                  </div>
                                  <input type="file" ref="fileInput" @change="handleFileSelect" accept=".pdf,.zip,.jpeg,.jpg,.png,.mp4" multiple style="display: none;">
                              </div>
                              <div v-if="saeForm.uploadFiles.length > 0" style="margin-top: 12px;">
                                  <div v-for="(f, i) in saeForm.uploadFiles" :key="i" style="display: flex; justify-content: space-between; font-size: 13px; padding: 6px 10px; background: var(--bg-app); margin-bottom: 4px; border-radius: 4px; border: 1px solid var(--border-light);">
                                      <span>{{ f.name }}</span>
                                      <span @click.stop="removeFile(i)" style="color: var(--status-warning-text); cursor: pointer; font-weight: bold;">✕</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="grid" style="grid-template-columns: 1fr; gap: 16px; margin-bottom: 20px;">
                          <div>
                              <label class="form-label">Groupe concerné *</label>
                              <select v-model="saeForm.groupe" class="form-control">
                                  <option value="">Sélectionnez un groupe</option>
                                  <option v-for="grp in groupList" :key="grp" :value="grp">{{ grp }}</option>
                              </select>
                              <div v-if="saeForm.semestre" style="margin-top: 4px; font-size: 12px; color: var(--text-secondary);">
                                  Semestre calculé : {{ saeForm.semestre }}
                              </div>
                          </div>
                      </div>
                      
                      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                          <div>
                              <label class="form-label">Date de début *</label>
                              <input type="date" v-model="saeForm.date_debut" class="form-control">
                          </div>
                          <div>
                              <label class="form-label">Date de fin</label>
                              <input type="date" v-model="saeForm.date_fin" class="form-control">
                          </div>
                      </div>

                      <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 32px 0;">

                      <div class="form-group">
                          <label class="form-label">Compétences évaluées * <span style="font-weight:normal; color:var(--text-secondary);">(La saisie des compétences est requise)</span></label>
                          <div id="skills-container">
                              <div class="skill-row" v-for="(comp, idx) in saeForm.competences" :key="idx" style="display: flex; gap: 12px; margin-bottom: 12px;">
                                  <input type="text" v-model="saeForm.competences[idx]" class="form-control" placeholder="Intitulé de la compétence" required>
                                  <button class="btn btn-outline" style="border-color: var(--status-danger-border); color: var(--status-danger-text);" @click="removeCompetence(idx)" v-if="saeForm.competences.length > 1">X</button>
                              </div>
                          </div>
                          <button class="btn btn-outline" style="margin-top: 8px;" @click="addCompetence">
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

          <div v-if="currentView === 'grading'" class="view-section active">
              <div v-if="gradingStatus" class="status-msg" :class="isGradingError ? 'error-message' : 'success-message'">
                  {{ gradingStatus }}
              </div>
              
              <div v-for="sae in saes.filter(s => s.statut !== 'archived')" :key="'grade-'+sae.id_sae" class="accordion">
                  <div class="accordion-header" :class="{ active: activeAccordion === sae.id_sae }" @click="toggleAccordion(sae.id_sae)">
                      {{ sae.titre }}
                      <div style="display:flex; align-items:center; gap: 16px;">
                          <span v-if="!sae.progress_count" class="badge badge-success">AUCUN RENDU</span>
                          <span v-else class="badge badge-warning">{{ sae.progress_count }} RENDU(S) DÉPOSÉ(S)</span>
                          <svg class="icon-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                  </div>
                  <div class="accordion-body" :class="{ active: activeAccordion === sae.id_sae }">
                      
                      <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px;">
                          Date début : {{ formatDate(sae.date_debut) }}.
                      </div>

                      <div v-if="isFetchingRendus" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">Chargement des rendus...</div>
                      
                      <div v-else-if="saeRendus[sae.id_sae]">
                              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-light);">
                                  <span style="font-size: 13px; color: var(--text-secondary);">{{ saeRendus[sae.id_sae].length }} rendus disponibles</span>
                                  
                                  <div style="display: flex; gap: 12px;">
                                      <button class="btn btn-outline" style="color: var(--accent-blue); border-color: var(--status-info-border);" @click="downloadAll(sae.id_sae)">
                                          <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; margin-right: 4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                          Télécharger tout (ZIP)
                                      </button>
                                      <button class="btn btn-outline" style="color: var(--status-success-text); border-color: var(--status-success-border);" @click="markAllEvaluated(sae.id_sae)">
                                          <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; margin-right: 4px;"><polyline points="20 6 9 17 4 12"/></svg>
                                          Tout marquer comme évalué
                                      </button>
                                  </div>
                              </div>

                              <div v-if="saeRendus[sae.id_sae].length === 0" style="color: var(--text-secondary); font-size: 14px;">Aucun rendu déposé pour cette SAE.</div>

                              <div class="rendus-grid-header" style="display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 16px; padding: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 2px solid var(--border-light); font-size: 13px; text-transform: uppercase;">
                                  <div>Étudiant / Fichier</div>
                                  <div>Date de dépôt</div>
                                  <div>Statut</div>
                                  <div style="text-align: right;">Actions / Notation</div>
                              </div>

                              <div v-for="rendu in saeRendus[sae.id_sae]" :key="rendu.id_rendu" class="list-item" :class="{ evaluated: rendu.est_evalue }" style="display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 16px; align-items: center; padding: 16px 12px;">
                                  <div class="item-info">
                                      <div class="item-title" style="font-weight: 600;">{{ rendu.etudiant_nom }}</div>
                                      <div class="item-meta" style="font-size: 12px; color: var(--text-secondary);">{{ rendu.nom_fichier || 'Fichier' }}</div>
                                  </div>
                                  
                                  <div style="font-size: 13px; color: var(--text-secondary);">
                                      {{ formatDate(rendu.date_depot) }}
                                  </div>

                                  <div>
                                      <span v-if="rendu.est_evalue === 1" class="badge badge-success" @click="toggleEvaluatedStatus(rendu)" style="font-size: 11px; cursor: pointer;">NOTÉ ({{ rendu.note_attribuee || rendu.note }}/20)</span>
                                      <span v-else class="badge badge-warning" @click="toggleEvaluatedStatus(rendu)" style="font-size: 11px; cursor: pointer;">À NOTER</span>
                                  </div>
                                  
                                  <div style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
                                      <a :href="getFileUrl(rendu.chemin_fichier)" target="_blank" class="btn btn-outline" style="padding: 4px 8px; font-size: 12px; text-decoration: none;">Voir</a>
                                      
                                      <input type="number" min="0" max="20" step="0.5" v-model="rendu.inputNote" class="form-control" style="width: 60px; height: 32px; text-align: center; padding: 4px; font-size: 13px;" placeholder="--">
                                      <input type="text" v-model="rendu.inputComment" class="form-control" style="width: 120px; height: 32px; padding: 4px; font-size: 12px;" placeholder="Commentaire">
                                      <button class="btn btn-primary" style="padding: 4px 12px; height: 32px; font-size: 12px;" @click="submitInlineGrade(rendu, sae.id_sae)" :disabled="rendu.isSaving">
                                          {{ rendu.isSaving ? '...' : 'Valider' }}
                                      </button>
                                  </div>
                              </div>
                      </div> 
                  </div>
              </div>
          </div>

          <div v-if="currentView === 'announcements'" class="view-section active">
               <div class="card" style="max-width: 800px;">
                  <div class="card-header">Rédiger une nouvelle annonce</div>
                  <div class="card-body">

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

          <div v-if="showSuccessScreen" class="success-screen">
              <div class="success-content">
                  <div class="checkmark-circle">
                      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
                  </div>
                  <h2 style="font-size: 32px; margin-bottom: 16px;">Action réussie !</h2>
                  <p style="font-size: 18px; color: #cbd5e1;">{{ successScreenMessage }}</p>
                  <div style="display:flex; gap:16px; margin-top:32px; justify-content:center; flex-wrap:wrap;">
                      <button class="btn btn-outline" style="padding: 12px 24px; font-size: 16px; border-color:#60a5fa; color:#60a5fa;" @click="closeSuccessScreen('create-sae')">+ Créer une autre SAE</button>
                      <button class="btn btn-primary" style="padding: 12px 24px; font-size: 16px;" @click="closeSuccessScreen('dashboard')">Retour au Tableau de bord</button>
                  </div>
              </div>
          </div>

      </div> <!-- Fin workspace -->
  </main>

  <div class="modal-overlay" :class="{ active: isEditModalOpen }" @click.self="closeEditModal">
      <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
          <h2 class="modal-title">Éditer la SAE</h2>

          <div class="form-group">
              <label class="form-label">Titre de la SAE *</label>
              <input type="text" v-model="editingSae.titre" class="form-control" placeholder="Ex: Développement d'une application mobile">
          </div>

          <div class="form-group">
              <label class="form-label">Vignette de la SAE (laisser vide pour conserver l'actuelle)</label>
              <input type="file" @change="handleEditVignetteSelect" accept="image/jpeg, image/png, image/webp" class="form-control" style="padding: 8px;">
          </div>
          
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <div>
                  <label class="form-label">Description *</label>
                  <textarea v-model="editingSae.description" class="form-control" placeholder="Description générale" rows="3"></textarea>
              </div>
                <div>
                  <label class="form-label">Documents joints (Ajouts) :</label>
                  <div v-if="editingSae.existingConsignes && editingSae.existingConsignes.length > 0" style="margin-bottom:12px;">
                      <div style="font-size:12px; color:#64748b; margin-bottom:4px;">Fichiers actuels :</div>
                      <div v-for="(f, i) in editingSae.existingConsignes" :key="'ex-'+i" style="display: flex; justify-content: space-between; align-items:center; font-size: 13px; padding: 6px 10px; background: #f1f5f9; margin-bottom: 4px; border-radius: 4px;">
                          <a :href="getFileUrl(f)" target="_blank" style="text-decoration:none; color:#334155; display:flex; align-items:center; gap:8px;">
                              <span style="font-size: 16px;" v-html="getFileIcon(f)"></span>
                              {{ getFileName(f) }}
                          </a>
                          <span @click.stop="removeExistingConsigne(i)" style="color: #ef4444; cursor: pointer; font-weight: bold;" title="Supprimer">✕</span>
                      </div>
                  </div>
                  <div class="upload-zone" style="padding: 20px; text-align: center; border: 2px dashed var(--border-light); cursor: pointer;"
                       @dragover.prevent @drop.prevent="handleEditDrop" @click="$refs.editFileInput.click()">
                      <svg style="width: 24px; height: 24px; color: var(--text-secondary); margin-bottom: 8px;" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <div style="font-size: 13px; color: var(--text-secondary);">
                          <span>Glissez vos nouveaux fichiers ou cliquez pour parcourir</span>
                      </div>
                      <input type="file" ref="editFileInput" @change="handleEditFileSelect" accept=".pdf,.zip,.jpeg,.jpg,.png,.mp4" multiple style="display: none;">
                  </div>
                  <div v-if="editingSae.uploadFiles && editingSae.uploadFiles.length > 0" style="margin-top: 12px;">
                      <div v-for="(f, i) in editingSae.uploadFiles" :key="'e-'+i" style="display: flex; justify-content: space-between; font-size: 13px; padding: 6px 10px; background: var(--bg-app); margin-bottom: 4px; border-radius: 4px; border: 1px solid var(--border-light);">
                          <span>{{ f.name }}</span>
                          <span @click.stop="removeEditFile(i)" style="color: var(--status-warning-text); cursor: pointer; font-weight: bold;">✕</span>
                      </div>
                  </div>
              </div>
          </div>

          <div class="grid" style="grid-template-columns: 1fr; gap: 16px; margin-bottom: 20px;">
              <div>
                  <label class="form-label">Groupe concerné *</label>
                  <select v-model="editingSae.groupe" class="form-control">
                      <option value="">Sélectionnez un groupe</option>
                      <option v-for="grp in groupList" :key="grp" :value="grp">{{ grp }}</option>
                  </select>
                  <div v-if="editingSae.semestre" style="margin-top: 4px; font-size: 12px; color: var(--text-secondary);">
                      Semestre calculé : {{ editingSae.semestre }}
                  </div>
              </div>
          </div>
          
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <div>
                  <label class="form-label">Date de début *</label>
                  <input type="date" v-model="editingSae.date_debut" class="form-control">
              </div>
              <div>
                  <label class="form-label">Date de fin</label>
                  <input type="date" v-model="editingSae.date_fin" class="form-control">
              </div>
          </div>

          <hr style="border: 0; border-top: 1px solid var(--border-light); margin: 32px 0;">

          <div class="form-group" v-if="editingSae.competences">
              <label class="form-label">Compétences évaluées *</label>
              <div id="edit-skills-container">
                  <div class="skill-row" v-for="(comp, idx) in editingSae.competences" :key="'c-'+idx" style="display: flex; gap: 12px; margin-bottom: 12px;">
                      <input type="text" v-model="editingSae.competences[idx]" class="form-control" placeholder="Intitulé de la compétence" required>
                      <button class="btn btn-outline" style="border-color: var(--status-danger-border); color: var(--status-danger-text);" @click="removeEditCompetence(idx)" v-if="editingSae.competences.length > 1">X</button>
                  </div>
              </div>
              <button class="btn btn-outline" style="margin-top: 8px;" @click="addEditCompetence">
                  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Ajouter une compétence
              </button>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;">
              <button class="btn btn-outline" @click="closeEditModal">Annuler</button>
              <button class="btn btn-primary" @click="submitEditSae" :disabled="isEditingSae">
                  {{ isEditingSae ? 'Enregistrement...' : 'Mettre à jour' }}
              </button>
          </div>
      </div>
  </div>

  <div v-if="toastMsg" class="toast" :class="toastType">
      {{ toastMsg }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import Sidebar from '../components/teacher/Sidebar.vue'
import Header from '../components/teacher/Header.vue'

const route = useRoute()
const router = useRouter()
const currentView = computed(() => route.params.view || 'dashboard')
const saes = ref([])

// Success Screen Logic
const showSuccessScreen = ref(false)
const successScreenMessage = ref('')

// Toasts Logic
const toastMsg = ref('')
const toastType = ref('success')

const showToast = (msg, type = 'success') => {
    toastMsg.value = msg
    toastType.value = type
    setTimeout(() => { toastMsg.value = '' }, 3500)
}

const groupList = [
    "MMI1", "MMI1A", "MMI1A1", "MMI1A2", 
    "MMI1B", "MMI1B1", "MMI1B2",
    "MMI2", "MMI2A", "MMI2A1", "MMI2A2", "MMI2B", "MMI2B1", "MMI2B2",
    "MMI3", "MMI3_GR1", "MMI3_GR2", "MMI3-FA", "MMI3-FA-CN", 
    "MMI3-FA-CN-A1", "MMI3-FA-CN-A2", "MMI3-FA-DW", "MMI3-FA-DW-A1", 
    "MMI3-FA-DW-A2", "MMI3-FI", "MMI3-FI-CN", "MMI3-FI-CN-A1", "MMI3-FI-CN-A2"
]

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
const saeForm = ref({ titre: '', description: '', consignes: '', semestre: '', groupe: '', annee_univ: '2023-2024', date_debut: '', date_fin: '', competences: ['', ''], uploadFiles: [], vignette: null })
const isCreatingSae = ref(false)

const fileInput = ref(null)

const handleDrop = (e) => {
    Array.from(e.dataTransfer.files).forEach(file => {
        if (validateFileType(file)) saeForm.value.uploadFiles.push(file);
    });
}

const handleFileSelect = (e) => {
    Array.from(e.target.files).forEach(file => {
        if (validateFileType(file)) saeForm.value.uploadFiles.push(file);
    });
}

const handleVignetteSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        saeForm.value.vignette = file;
    } else {
        alert("Veuillez sélectionner une image valide pour la vignette.");
    }
}

const removeFile = (idx) => { saeForm.value.uploadFiles.splice(idx, 1); }
const removeEditFile = (idx) => { editingSae.value.uploadFiles.splice(idx, 1); }
const removeExistingConsigne = (idx) => { editingSae.value.existingConsignes.splice(idx, 1); }

const getFileName = (path) => {
    if (!path) return "Fichier";
    const parts = path.split('/');
    let name = parts[parts.length - 1];
    const match = name.match(/^\d+-(.+)$/);
    if (match) return match[1];
    return name;
}

const getFileIcon = (path) => {
    if (!path) return '📄';
    const ext = path.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📕';
    if (ext === 'zip' || ext === 'rar') return '📦';
    if (['jpg','jpeg','png','webp','gif'].includes(ext)) return '🖼️';
    if (['mp4','webm'].includes(ext)) return '🎞️';
    if (['doc','docx'].includes(ext)) return '📘';
    return '📄';
}

const validateFileType = (file) => {
    const allowed = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'video/mp4'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.zip')) {
        alert("Type de fichier non autorisé. Utilisez PDF, ZIP, JPEG, PNG ou MP4.");
        return false;
    }
    return true;
}

const addCompetence = () => { saeForm.value.competences.push('') }
const removeCompetence = (idx) => { saeForm.value.competences.splice(idx, 1) }

// Auto-Semestre watch
watch(() => [saeForm.value.date_debut, saeForm.value.groupe], ([newDate, newGrp]) => {
    if (newDate && newGrp) {
        const month = new Date(newDate).getMonth() + 1;
        const isAutumn = month >= 8 || month <= 1;
        let sem = '';
        if (newGrp.startsWith('MMI1')) sem = isAutumn ? 'S1' : 'S2';
        else if (newGrp.startsWith('MMI2')) sem = isAutumn ? 'S3' : 'S4';
        else if (newGrp.startsWith('MMI3')) sem = isAutumn ? 'S5' : 'S6';
        saeForm.value.semestre = sem;
    } else {
        saeForm.value.semestre = '';
    }
})

const submitSae = async () => {
    if (!saeForm.value.titre || !saeForm.value.date_debut || !saeForm.value.description) {
        showToast("Veuillez remplir tous les champs obligatoires (Titre, Description, Date de début).", "error");
        return
    }
    if (!saeForm.value.vignette) {
        showToast("La vignette de la SAE est obligatoire.", "error");
        return
    }
    isCreatingSae.value = true
    try {
        const formData = new FormData();
        formData.append('titre', saeForm.value.titre);
        const cleanDesc = saeForm.value.description ? saeForm.value.description.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') : '';
        formData.append('description', cleanDesc);
        formData.append('semestre', saeForm.value.semestre);
        formData.append('groupe', saeForm.value.groupe);
        formData.append('annee_univ', saeForm.value.annee_univ);
        formData.append('date_debut', saeForm.value.date_debut);
        if (saeForm.value.date_fin) formData.append('date_fin', saeForm.value.date_fin);
        const validCompetences = saeForm.value.competences.filter(c => c.trim() !== '');
        formData.append('competences', JSON.stringify(validCompetences));
        formData.append('vignette', saeForm.value.vignette);
        saeForm.value.uploadFiles.forEach((file) => {
            formData.append('consignes', file);
        });
        await axios.post('/api/saes', formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('jwt_token')}` }})
        saeForm.value = { titre: '', description: '', consignes: '', semestre: '', groupe: '', annee_univ: '2023-2024', date_debut: '', date_fin: '', competences: ['', ''], uploadFiles: [], vignette: null }
        if (fileInput.value) fileInput.value.value = '';
        successScreenMessage.value = "La SAE a été soumise à l'administration pour validation.";
        showSuccessScreen.value = true;
    } catch (error) {
        showToast(error.response?.data?.error || "Erreur lors de la création de la SAE.", "error");
    } finally {
        isCreatingSae.value = false
    }
}

// Fonctionnalité : Éditer & Supprimer
const isEditModalOpen = ref(false)
const editingSae = ref({})
const isEditingSae = ref(false)
const editFileInput = ref(null)

const handleEditDrop = (e) => { Array.from(e.dataTransfer.files).forEach(file => { if (validateFileType(file)) editingSae.value.uploadFiles.push(file); }); }
const handleEditFileSelect = (e) => { Array.from(e.target.files).forEach(file => { if (validateFileType(file)) editingSae.value.uploadFiles.push(file); }); }
const handleEditVignetteSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) editingSae.value.vignette = file;
    else showToast("Veuillez sélectionner une image valide pour la vignette.", "error");
}
const addEditCompetence = () => { editingSae.value.competences.push('') }
const removeEditCompetence = (idx) => { editingSae.value.competences.splice(idx, 1) }

watch(() => [editingSae.value?.date_debut, editingSae.value?.groupe], ([newDate, newGrp]) => {
    if (newDate && newGrp && isEditModalOpen.value) {
        const month = new Date(newDate).getMonth() + 1;
        const isAutumn = month >= 8 || month <= 1;
        let sem = '';
        if (newGrp.startsWith('MMI1')) sem = isAutumn ? 'S1' : 'S2';
        else if (newGrp.startsWith('MMI2')) sem = isAutumn ? 'S3' : 'S4';
        else if (newGrp.startsWith('MMI3')) sem = isAutumn ? 'S5' : 'S6';
        editingSae.value.semestre = sem;
    }
})

const openEditModal = (sae) => {
    let comps = ['', ''];
    if (sae.competences) {
        try { comps = typeof sae.competences === 'string' ? JSON.parse(sae.competences) : sae.competences; } catch(e) {}
    }
    if(comps.length === 0) comps = ['', ''];
    let existingConsignes = [];
    if (sae.consignes_paths) {
        try { existingConsignes = JSON.parse(sae.consignes_paths) } catch(e) {}
    }
    editingSae.value = { ...sae, uploadFiles: [], vignette: null, competences: comps, existingConsignes }
    isEditModalOpen.value = true
}

const closeEditModal = () => {
    isEditModalOpen.value = false
    editingSae.value = {}
}

const submitEditSae = async () => {
    if (!editingSae.value.titre || !editingSae.value.date_debut) {
        showToast("Informations manquantes", "error");
        return;
    }
    isEditingSae.value = true;
    try {
        const formData = new FormData();
        formData.append('titre', editingSae.value.titre);
        if (editingSae.value.description) {
            const cleanDescEdit = editingSae.value.description.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            formData.append('description', cleanDescEdit);
        }
        formData.append('semestre', editingSae.value.semestre);
        formData.append('groupe', editingSae.value.groupe);
        if (editingSae.value.annee_univ) formData.append('annee_univ', editingSae.value.annee_univ);
        formData.append('date_debut', editingSae.value.date_debut);
        if (editingSae.value.date_fin) formData.append('date_fin', editingSae.value.date_fin);
        const validCompetences = editingSae.value.competences.filter(c => c && c.trim() !== '');
        formData.append('competences', JSON.stringify(validCompetences));
        if (editingSae.value.vignette) formData.append('vignette', editingSae.value.vignette);
        if (editingSae.value.uploadFiles) {
            editingSae.value.uploadFiles.forEach(file => formData.append('consignes', file));
        }
        if (editingSae.value.existingConsignes) {
            formData.append('existingConsignes', JSON.stringify(editingSae.value.existingConsignes));
        }
        await axios.put(`/api/saes/${editingSae.value.id_sae || editingSae.value.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('jwt_token')}` }})
        closeEditModal();
        successScreenMessage.value = "La SAE a correctement été mise à jour.";
        showSuccessScreen.value = true;
    } catch (e) {
        showToast(e.response?.data?.error || "Erreur lors de la modification", "error");
    } finally {
        isEditingSae.value = false;
    }
}

const deleteSae = async (id) => {
    if(!confirm("Voulez-vous vraiment supprimer cette SAE ? Tous les rendus associés seront perdus.")) return;
    try {
        await axios.delete(`/api/saes/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt_token')}` }})
        showToast("SAE supprimée", "success");
        fetchData();
    } catch (e) {
        showToast(e.response?.data?.error || "Erreur lors de la suppression", "error");
    }
}

const annonceForm = ref({ titre: '', message: '', destinataires: 'Tous' })
const isPosting = ref(false)

const postAnnonce = async () => {
    if (!annonceForm.value.titre || !annonceForm.value.message) {
        showToast("Le titre et le message sont requis.", "error");
        return
    }
    isPosting.value = true
    try {
        await axios.post('/api/annonces', annonceForm.value, { headers: { Authorization: `Bearer ${localStorage.getItem('jwt_token')}` }})
        showToast("Annonce publiée avec succès !", "success");
        annonceForm.value = { titre: '', message: '', destinataires: 'Tous' }
    } catch (error) {
        showToast(error.response?.data?.error || "Erreur de publication.", "error");
    } finally {
        isPosting.value = false
    }
}

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
            const token = localStorage.getItem('jwt_token')
            const res = await axios.get(`/api/rendus/${saeId}`, { headers: { Authorization: `Bearer ${token}` }})
            saeRendus.value[saeId] = res.data.map(r => {
                const path = r.chemin_fichier || r.file_path || '';
                const parts = path.split('/');
                const fileName = parts[parts.length - 1] || 'rendu';
                return {
                    ...r,
                    etudiant_nom: `${r.prenom} ${r.nom}`,
                    nom_fichier: fileName,
                    chemin_fichier: path,
                    est_evalue: r.est_evalue === 1 ? 1 : 0,
                    inputNote: r.est_evalue === 1 ? (r.note_attribuee || r.note) : '',
                    inputComment: r.commentaire_prof || r.feedback || '',
                    isSaving: false
                };
            })
        } catch (error) {
            console.error("Erreur récupération rendus:", error)
        } finally {
            isFetchingRendus.value = false
        }
    }
}

const toggleEvaluatedStatus = async (rendu) => {
    const newStatus = rendu.est_evalue === 1 ? 0 : 1;
    rendu.est_evalue = newStatus;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.put(`/api/rendus/${rendu.id_rendu}/status`, { est_evalue: newStatus }, { headers: { Authorization: `Bearer ${token}` }})
    } catch (err) {
        console.error("Erreur statut:", err)
        rendu.est_evalue = newStatus === 1 ? 0 : 1;
    }
}

const markAllEvaluated = async (saeId) => {
    const rendus = saeRendus.value[saeId]
    if (!rendus) return
    for (const r of rendus) {
        if (r.est_evalue !== 1) {
            r.est_evalue = 1
            const token = localStorage.getItem('jwt_token')
            await axios.put(`/api/rendus/${r.id_rendu}/status`, { est_evalue: 1 }, { headers: { Authorization: `Bearer ${token}` }}).catch(console.error)
        }
    }
}

const downloadAll = async (saeId) => {
    try {
        const token = localStorage.getItem('jwt_token');
        showToast("Préparation du téléchargement...", "info");
        const response = await axios.get(`/api/rendus/zip/${saeId}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const sae = saes.value.find(s => s.id_sae === saeId);
        const safeTitle = sae ? sae.titre.replace(/[^a-zA-Z0-9]/g, '_') : 'SAE_Rendus';
        link.setAttribute('download', `Rendus_${safeTitle}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        showToast("Erreur ou aucun rendu disponible.", "error");
    }
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getFileUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads/')) return 'http://localhost:3000' + path;
    if (path.startsWith('uploads/')) return 'http://localhost:3000/' + path;
    return 'http://localhost:3000/uploads/' + path;
}

const gradingStatus = ref('')
const isGradingError = ref(false)

const submitInlineGrade = async (rendu, saeId) => {
    if (rendu.inputNote === '' || rendu.inputNote === null) {
        gradingStatus.value = "Veuillez entrer une note valide avant de valider."
        isGradingError.value = true
        setTimeout(() => { gradingStatus.value = '' }, 3000)
        return
    }
    rendu.isSaving = true
    try {
        const payload = { note: rendu.inputNote, commentaire: rendu.inputComment }
        const token = localStorage.getItem('jwt_token')
        await axios.put(`/api/rendus/${rendu.id_rendu}/evaluation`, payload, { headers: { Authorization: `Bearer ${token}` }})
        gradingStatus.value = `Note enregistrée pour ${rendu.etudiant_nom} !`
        isGradingError.value = false
        rendu.note_attribuee = rendu.inputNote
        rendu.commentaire_prof = rendu.inputComment
        rendu.est_evalue = 1
    } catch (error) {
        console.error("Erreur évaluation:", error)
        gradingStatus.value = error.response?.data?.error || "Erreur lors de l'évaluation."
        isGradingError.value = true
    } finally {
        rendu.isSaving = false
        setTimeout(() => { gradingStatus.value = '' }, 4000)
    }
}

let pollingInterval = null;
const fetchData = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        if (!token) return;
        const opts = { headers: { Authorization: `Bearer ${token}` }}
        const [resSaes, resAnnonces] = await Promise.all([
            axios.get('/api/saes', opts).catch(() => ({data:[]})),
            axios.get('/api/annonces', opts).catch(() => ({data:[]}))
        ])
        if (resSaes.data.length > 0) saes.value = resSaes.data;
    } catch (error) { console.error("Erreur Sync:", error); }
}

const closeSuccessScreen = (destination = 'dashboard') => {
    showSuccessScreen.value = false;
    successScreenMessage.value = '';
    switchView(destination);
}

onMounted(() => {
    fetchData()
    pollingInterval = setInterval(fetchData, 5000);
})
</script>

<style scoped>
.success-screen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0f172a; display: flex; align-items: center; justify-content: center; z-index: 10000; color: white; text-align: center; }
.checkmark-circle { width: 80px; height: 80px; margin: 0 auto 24px; }
.checkmark { width: 80px; height: 80px; border-radius: 50%; display: block; stroke-width: 2; stroke: #10b981; stroke-miterlimit: 10; margin: 10% auto; box-shadow: inset 0px 0px 0px #10b981; animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both; }
.checkmark__circle { stroke-dasharray: 166; stroke-dashoffset: 166; stroke-width: 2; stroke-miterlimit: 10; stroke: #10b981; fill: none; animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards; }
.checkmark__check { transform-origin: 50% 50%; stroke-dasharray: 48; stroke-dashoffset: 48; animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards; }
@keyframes stroke { 100% { stroke-dashoffset: 0; } }
@keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.1, 1.1, 1); } }
@keyframes fill { 100% { box-shadow: inset 0px 0px 0px 80px rgba(16, 185, 129, 0.1); } }

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

.toast { position: fixed; top: 24px; right: 24px; padding: 16px 24px; border-radius: 12px; background: #10b981; color: white; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); z-index: 99999; animation: slideIn 0.3s ease-out; display: flex; align-items: center; gap: 12px; border-left: 4px solid #059669; }
.toast.error { background: #ef4444; border-left-color: #dc2626; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>