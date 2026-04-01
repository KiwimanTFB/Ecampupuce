<template>
  <div class="admin-dashboard">
    <div class="header" style="display: flex; gap: 1rem; align-items: center; justify-content: space-between;">
        <h2 style="margin: 0; white-space: nowrap;">Espace Administrateur</h2>
        <div style="display: flex; gap: 1rem; align-items: center; flex: 1;">
            <button @click="currentTab = 'validation'" :class="['btn', currentTab === 'validation' ? 'btn-primary' : 'btn-outline']" style="min-width: 220px; padding: 10px 16px; font-size: 14px; justify-content: center;">Validation des Demandes</button>
            <button @click="currentTab = 'gestion'" :class="['btn', currentTab === 'gestion' ? 'btn-primary' : 'btn-outline']" style="min-width: 220px; padding: 10px 16px; font-size: 14px; justify-content: center;">Gestion de la Plateforme</button>
            <button @click="currentTab = 'vitrine'" :class="['btn', currentTab === 'vitrine' ? 'btn-primary' : 'btn-outline']" style="min-width: 220px; padding: 10px 16px; font-size: 14px; justify-content: center;">Gestion de la Vitrine</button>
            <button @click="logout" class="btn btn-outline" style="border-color: #ef4444; color: #ef4444; margin-left: auto; padding: 10px 16px; font-size: 14px;">Se déconnecter</button>
        </div>
    </div>

    <!-- ONGLET: VALIDATION DES DEMANDES -->
    <div v-show="currentTab === 'validation'">
        <div class="header-small">
            <h3>Demandes de création de compte</h3>
        </div>
        <div v-if="demandes.length === 0" class="empty-state">Aucune demande en attente.</div>
        <table v-else class="demandes-table">
          <thead>
            <tr>
              <th>Nom / Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>N° Étudiant</th>
              <th>Date</th>
              <th>Attribution Groupe & Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in demandes" :key="d.id_demande">
              <td><strong>{{ d.nom }}</strong> <br>{{ d.prenom }}</td>
              <td>{{ d.email }}</td>
              <td>{{ d.telephone }}</td>
              <td><span :class="'badge ' + d.role">{{ d.role }}</span></td>
              <td>{{ d.numero_etudiant || '-' }}</td>
              <td>{{ new Date(d.date_demande).toLocaleDateString() }}</td>
              <td>
                <div v-if="d.role === 'student'" style="margin-bottom:8px; display:flex; gap:4px; flex-direction:column; max-width: 150px;">
                   <select v-model="d.selYear" @change="d.selSub=''; d.selFinal=''" class="form-control" style="padding:4px; font-size:12px;">
                       <option value="">-- Année --</option>
                       <option value="MMI1">MMI1</option>
                       <option value="MMI2">MMI2</option>
                       <option value="MMI3">MMI3</option>
                   </select>
                   <select v-if="d.selYear" v-model="d.selSub" @change="d.selFinal=''" class="form-control" style="padding:4px; font-size:12px;">
                       <option value="">-- TD --</option>
                       <option value="A">A</option>
                       <option value="B">B</option>
                   </select>
                   <select v-if="d.selSub" v-model="d.selFinal" class="form-control" style="padding:4px; font-size:12px;">
                       <option value="">-- TP --</option>
                       <option value="1">1</option>
                       <option value="2">2</option>
                   </select>
                </div>
                
                <div style="display:flex; gap:8px;">
                    <button class="btn btn-primary btn-sm" :disabled="d.role === 'student' && !d.selFinal" 
                            @click="valider(d)" :style="{ opacity: (d.role === 'student' && !d.selFinal) ? 0.5 : 1 }">
                            Valider
                    </button>
                    <button class="btn btn-danger btn-sm" @click="rejeter(d.id_demande)">Rejeter</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="header-small" style="margin-top: 50px;">
            <h3>Demandes de création de SAE</h3>
        </div>

        <div v-if="saesEnAttente.length === 0" class="empty-state">Aucune SAE en attente.</div>
        <table v-else class="demandes-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Professeur auteur</th>
              <th>Date de début</th>
              <th>Code SAE à attribuer *</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sae in saesEnAttente" :key="sae.id_sae">
              <td><strong>{{ sae.titre }}</strong></td>
              <td>{{ sae.prof_nom }} {{ sae.prof_prenom }}</td>
              <td>{{ new Date(sae.date_debut).toLocaleDateString() }}</td>
              <td>
                <input type="text" v-model="sae.adminCode" placeholder="Ex: 4.01" style="width: 100px; padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
                <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">
                  Semestre attendu : {{ sae.semestre || '?' }}<br>
                  <span v-if="sae.semestre && sae.adminCode && !sae.adminCode.startsWith(sae.semestre.replace('S', ''))" style="color: #ef4444;">Le premier chiffre devrait être {{ sae.semestre.replace('S', '') }}</span>
                </div>
              </td>
              <td>
                <button class="btn btn-outline btn-sm" @click="openEditModal(sae)" style="margin-right:8px; border-color:var(--accent-blue); color:var(--accent-blue);">Détails/Éditer</button>
                <button :disabled="!sae.adminCode || sae.adminCode.trim() === ''" :style="{ opacity: (!sae.adminCode || sae.adminCode.trim() === '') ? 0.5 : 1, cursor: (!sae.adminCode || sae.adminCode.trim() === '') ? 'not-allowed' : 'pointer' }" class="btn btn-primary btn-sm" @click="approuverSAE(sae)" style="margin-right:8px;">Approuver</button>
                <button class="btn btn-danger btn-sm" @click="refuserSAE(sae.id_sae)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
    </div>

    <!-- ONGLET: GESTION DE LA PLATEFORME -->
    <div v-show="currentTab === 'gestion'">
        <div class="header-small">
            <h3>Liste des Utilisateurs</h3>
            <div style="display:flex; gap:8px;">
                <select v-model="filterUserRole" class="form-control" style="width:150px; padding:6px; font-size:13px;">
                   <option value="">Tous les rôles</option>
                   <option value="student">Étudiants</option>
                   <option value="teacher">Professeurs</option>
                   <option value="admin">Administrateurs</option>
                </select>
            </div>
        </div>
        <table class="demandes-table">
          <thead>
            <tr>
              <th @click="sortBy('nom')" style="cursor:pointer; user-select:none;">Nom / Prénom <span class="sort-icon">{{ sortKey==='nom' ? (sortAsc?'▲':'▼') : '↕' }}</span></th>
              <th @click="sortBy('email')" style="cursor:pointer; user-select:none;">Email <span class="sort-icon">{{ sortKey==='email' ? (sortAsc?'▲':'▼') : '↕' }}</span></th>
              <th @click="sortBy('role')" style="cursor:pointer; user-select:none;">Rôle <span class="sort-icon">{{ sortKey==='role' ? (sortAsc?'▲':'▼') : '↕' }}</span></th>
              <th @click="sortBy('groupe_td')" style="cursor:pointer; user-select:none;">Groupe <span class="sort-icon">{{ sortKey==='groupe_td' ? (sortAsc?'▲':'▼') : '↕' }}</span></th>
              <th @click="sortBy('statut')" style="cursor:pointer; user-select:none;">Statut <span class="sort-icon">{{ sortKey==='statut' ? (sortAsc?'▲':'▼') : '↕' }}</span></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in sortedUsers" :key="user.id_user">
              <td><strong>{{ user.nom }}</strong> {{ user.prenom }}</td>
              <td>{{ user.email }}</td>
              <td><span :class="'badge ' + user.role">{{ user.role }}</span></td>
              <td>{{ user.groupe_td || '-' }}</td>
              <td>
                <span :class="['badge', user.statut === 'Validé' ? 'student' : 'admin']" 
                      :style="user.statut !== 'Validé' ? 'background:#fee2e2; color:#ef4444;' : ''">
                  {{ user.statut }}
                </span>
              </td>
              <td>
                <button v-if="user.statut === 'Validé'" class="btn btn-outline btn-sm" @click="openEditUserModal(user)">Éditer</button>
                <button v-if="user.statut === 'Validé'" class="btn btn-danger btn-sm" @click="deleteUser(user.id_user)" style="margin-left:8px;">Supprimer</button>
                <button v-else class="btn btn-primary btn-sm" @click="currentTab = 'validation'">Voir Demande</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="header-small" style="margin-top: 40px;">
            <h3>Publier une Annonce Globale</h3>
        </div>
        <div class="card" style="padding: 24px; margin-bottom: 40px;">
            <div class="form-group">
                <label class="form-label">Titre de l'annonce</label>
                <input type="text" v-model="newAnnouncement.titre" class="form-control" placeholder="Ex: Maintenance prévue ce soir">
            </div>
            <div class="form-group">
                <label class="form-label">Cible (Destinataires)</label>
                <select v-model="newAnnouncement.destinataires" class="form-control">
                    <option value="Tous">Tous les utilisateurs</option>
                    <option value="Étudiants">Étudiants uniquement</option>
                    <option value="Enseignants">Enseignants uniquement</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Contenu du message</label>
                <textarea v-model="newAnnouncement.message" class="form-control" rows="4" placeholder="Votre message..."></textarea>
            </div>
            <div style="display: flex; justify-content: flex-end;">
                <button class="btn btn-primary" @click="publishAnnouncement" :disabled="isPublishingAnnouncement">
                    {{ isPublishingAnnouncement ? 'Publication...' : 'Publier l\'annonce' }}
                </button>
            </div>
        </div>

        <div class="header-small" style="margin-top: 40px;">
            <h3>Annonces Actives</h3>
        </div>
        <div v-if="activeAnnonces.length === 0" class="empty-state" style="margin-bottom: 40px;">Aucune annonce active.</div>
        <table v-else class="demandes-table" style="margin-bottom: 40px;">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Message</th>
              <th>Destinataires</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="annonce in activeAnnonces" :key="annonce.id">
              <td><strong>{{ annonce.titre }}</strong></td>
              <td>{{ annonce.contenu }}</td>
              <td>{{ annonce.destinataires }}</td>
              <td>{{ new Date(annonce.date_publication).toLocaleDateString() }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="deleteAnnonce(annonce.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- GESTION DES NOTIFICATIONS -->
        <div class="header-small" style="margin-top: 40px;">
            <h3>Envoyer une Notification (Cloche)</h3>
        </div>
        <div class="card" style="padding: 24px; margin-bottom: 40px;">
            <div class="form-group">
                <label class="form-label">Destinataire</label>
                <select v-model="newNotification.user_id" class="form-control">
                    <option value="all">Tous les utilisateurs</option>
                    <option v-for="u in usersList" :key="u.id_user" :value="u.id_user">{{ u.nom }} {{ u.prenom }} ({{ u.role }})</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Message</label>
                <textarea v-model="newNotification.message" class="form-control" rows="2" placeholder="Ex: N'oubliez pas de rendre votre projet SAE..."></textarea>
            </div>
            <div style="display: flex; justify-content: flex-end;">
                <button class="btn btn-primary" @click="sendNotification" :disabled="isSendingNotif">
                    {{ isSendingNotif ? 'Envoi...' : 'Envoyer la notification' }}
                </button>
            </div>
        </div>

        <div class="header-small" style="margin-top: 40px;">
            <h3>Notifications en cours</h3>
        </div>
        <div v-if="activeNotifs.length === 0" class="empty-state" style="margin-bottom: 40px;">Aucune notification.</div>
        <table v-else class="demandes-table" style="margin-bottom: 40px;">
          <thead>
            <tr>
              <th>Destinataire</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="notif in activeNotifs" :key="notif.id">
              <td>
                  <span v-if="notif.user_id">{{ notif.nom }} {{ notif.prenom }}</span>
                  <span v-else>Tous (Broadcast)</span>
              </td>
              <td>{{ notif.message }}</td>
              <td>{{ new Date(notif.created_at).toLocaleDateString() }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="deleteNotif(notif.id)">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="header-small" style="margin-top: 40px;">
            <h3>Toutes les SAEs Validées</h3>
            <div style="display:flex; gap:8px;">
                <input type="text" v-model="filterSaeAnnee" class="form-control" placeholder="Année (ex: 2023)" style="width:150px; padding:6px; font-size:13px;">
                <select v-model="filterSaeSemestre" class="form-control" style="width:150px; padding:6px; font-size:13px;">
                    <option value="">Tous les semestres</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="S4">S4</option>
                    <option value="S5">S5</option>
                    <option value="S6">S6</option>
                </select>
                <input type="text" v-model="filterSaeGroupe" class="form-control" placeholder="Groupe (ex: MMI2)" style="width:150px; padding:6px; font-size:13px;">
            </div>
        </div>
        <table class="demandes-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Titre</th>
              <th>Professeur auteur</th>
              <th>Semestre</th>
              <th>Groupe</th>
              <th>Année Univ.</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sae in filteredAllSaes" :key="sae.id_sae">
              <td><strong>{{ sae.code || 'N/A' }}</strong></td>
              <td>{{ sae.titre }}</td>
              <td>{{ sae.prof_nom }} {{ sae.prof_prenom }}</td>
              <td>{{ sae.semestre }}</td>
              <td>{{ sae.groupe }}</td>
              <td>{{ sae.annee_univ }}</td>
              <td>
                <button class="btn btn-outline btn-sm" @click="openEditModal(sae)" style="border-color:var(--accent-blue); color:var(--accent-blue);">Éditer</button>
              </td>
            </tr>
          </tbody>
        </table>
    </div>

    <!-- ONGLET: GESTION DE LA VITRINE -->
    <div v-show="currentTab === 'vitrine'">
        <div class="header-small">
            <h3>Projets Actuellement en Vitrine</h3>
        </div>
        <div v-if="vitrineProjects.length === 0" class="empty-state">Aucun projet dans la vitrine.</div>
        <table v-else class="demandes-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>SAE / Auteur</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vp in vitrineProjects" :key="vp.id">
              <td><img :src="getFileUrl(vp.image)" @error="(e) => e.target.src = 'https://placehold.co/600x400?text=Image+Introuvable'" style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-light);" /></td>
              <td><strong>{{ vp.titre }}</strong><br/><span style="font-size:11px;color:#64748b;">{{ vp.domaine_activite }}</span></td>
              <td>{{ vp.sae_titre }}<br/>Par: {{ vp.etudiant }}</td>
              <td style="max-width:250px; font-size:12px; white-space:normal;">{{ vp.description }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="retirerDeVitrine(vp.id)">Retirer</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="header-small" style="margin-top: 50px;">
            <h3>Ajouter à la Vitrine (Rendus Évalués / Notés)</h3>
        </div>
        <div v-if="rendusEligibles.length === 0" class="empty-state">Aucun rendu éligible disponible.</div>
        <table v-else class="demandes-table">
          <thead>
            <tr>
              <th>SAE</th>
              <th>Étudiant / Fichier</th>
              <th>Date de dépôt</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rendusEligibles" :key="r.id_rendu">
              <td><strong>{{ r.sae_titre }}</strong><br/><span style="font-size:11px;color:#64748b;">{{ r.semestre }} - {{ r.niveau }}</span></td>
              <td>{{ r.etudiant }}<br/><a :href="getFileUrl(r.chemin_fichier)" target="_blank" style="font-size:11px; color:var(--accent-blue);">Voir le rendu</a></td>
              <td>{{ new Date(r.date_depot).toLocaleDateString() }}</td>
              <td>{{ r.note !== null ? r.note + '/20' : 'Non noté' }}</td>
              <td>
                <button class="btn btn-primary btn-sm" @click="openVitrineModal(r)">Mettre en vitrine</button>
              </td>
            </tr>
          </tbody>
        </table>
    </div>

    <!-- MODAL EDITION UTILISATEUR -->
    <div class="modal-overlay" :class="{ active: isEditUserModalOpen }" @click.self="closeEditUserModal">
      <div class="modal-content" style="max-width: 500px;">
          <h2 class="modal-title">Éditer un Utilisateur</h2>
          
          <div class="form-group">
              <label class="form-label">Nom</label>
              <input type="text" v-model="editingUser.nom" class="form-control">
          </div>
          <div class="form-group">
              <label class="form-label">Prénom</label>
              <input type="text" v-model="editingUser.prenom" class="form-control">
          </div>
          <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" v-model="editingUser.email" class="form-control">
          </div>
          <div class="form-group">
              <label class="form-label">Numéro Étudiant (Optionnel)</label>
              <input type="text" v-model="editingUser.numero_etudiant" class="form-control">
          </div>
          <div class="form-group">
              <label class="form-label">Rôle</label>
              <select v-model="editingUser.role" class="form-control">
                  <option value="student">Étudiant</option>
                  <option value="teacher">Professeur</option>
                  <option value="admin">Administrateur</option>
              </select>
          </div>
          <div class="form-group">
              <label class="form-label">Groupe terminal</label>
              <select v-model="editingUser.groupe_td" class="form-control">
                  <option value="">Aucun</option>
                  <option v-for="grp in groupList" :key="grp" :value="grp">{{ grp }}</option>
              </select>
          </div>
          <div class="form-group">
              <label class="form-label">Nouveau mot de passe (laisser vide pour ne pas modifier)</label>
              <input type="password" v-model="editingUser.mot_de_passe" class="form-control">
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;">
              <button class="btn btn-outline" @click="closeEditUserModal">Annuler</button>
              <button class="btn btn-primary" @click="submitEditUser" :disabled="isEditingUser">
                  {{ isEditingUser ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
          </div>
      </div>
    </div>

    <!-- MODAL EDITION SAE ADMIN -->
    <div class="modal-overlay" :class="{ active: isEditModalOpen }" @click.self="closeEditModal">
      <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
          <h2 class="modal-title">Éditer/Consulter la SAE (Admin)</h2>

          <div class="form-group">
              <label class="form-label">Titre de la SAE *</label>
              <input type="text" v-model="editingSae.titre" class="form-control" placeholder="Titre...">
          </div>

          <!-- Affichage vignette actuelle si exste -->
          <div class="form-group" v-if="editingSae.vignette_path">
              <label class="form-label">Vignette actuelle :</label>
              <img :src="getFileUrl(editingSae.vignette_path)" @error="(e) => e.target.src = 'https://placehold.co/600x400?text=Image+Introuvable'" style="max-width:150px; border-radius:4px; border:1px solid #ccc; margin-bottom: 8px;">
          </div>

          <div class="form-group">
              <label class="form-label">Nouvelle Vignette (laisser vide pour conserver l'actuelle)</label>
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
                      <div style="font-size:12px; color:var(--text-secondary); margin-bottom:4px;">Fichiers existants :</div>
                      <div v-for="(f, i) in editingSae.existingConsignes" :key="'ex-'+i" style="display: flex; justify-content: space-between; align-items:center; font-size: 13px; padding: 6px 10px; background: var(--bg-app); margin-bottom: 4px; border-radius: var(--radius-sm);">
                          <a :href="getFileUrl(f)" target="_blank" style="text-decoration:none; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
                              <span style="font-size: 16px;">{{ getFileIcon(f) }}</span>
                              {{ getFileName(f) }}
                          </a>
                          <span @click.stop="removeExistingConsigne(i)" style="color: var(--status-danger-text); cursor: pointer; font-weight: bold;">✕</span>
                      </div>
                  </div>

                  <div class="upload-zone" style="padding: 20px; text-align: center; border: 2px dashed #e2e8f0; cursor: pointer; border-radius:4px;"
                       @dragover.prevent @drop.prevent="handleEditDrop" @click="$refs.editFileInput.click()">
                      <div style="font-size: 13px; color: #64748b;">
                          <span>Glissez de nouveaux fichiers pour les joindre</span>
                      </div>
                      <input type="file" ref="editFileInput" @change="handleEditFileSelect" accept=".pdf,.zip,.jpeg,.jpg,.png,.mp4" multiple style="display: none;">
                  </div>
                  <div v-if="editingSae.uploadFiles && editingSae.uploadFiles.length > 0" style="margin-top: 12px;">
                      <div v-for="(f, i) in editingSae.uploadFiles" :key="'e-'+i" style="display: flex; justify-content: space-between; font-size: 13px; padding: 6px 10px; background: #f8fafc; margin-bottom: 4px; border-radius: 4px; border: 1px solid #e2e8f0;">
                          <span>{{ f.name }}</span>
                          <span @click.stop="removeEditFile(i)" style="color: #ef4444; cursor: pointer; font-weight: bold;">✕</span>
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
                  <div v-if="editingSae.semestre" style="margin-top: 4px; font-size: 12px; color: #64748b;">
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

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">

          <div class="form-group" v-if="editingSae.competences">
              <label class="form-label">Compétences évaluées *</label>
              <div>
                  <div v-for="(comp, idx) in editingSae.competences" :key="'c-'+idx" style="display: flex; gap: 12px; margin-bottom: 12px;">
                      <input type="text" v-model="editingSae.competences[idx]" class="form-control" placeholder="Intitulé de la compétence" required>
                      <button class="btn btn-outline" style="border-color: #ef4444; color: #ef4444;" @click="removeEditCompetence(idx)" v-if="editingSae.competences.length > 1">X</button>
                  </div>
              </div>
              <button class="btn btn-outline" style="margin-top: 8px;" @click="addEditCompetence">
                  Ajouter une compétence
              </button>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;">
              <button class="btn btn-outline" @click="closeEditModal">Fermer / Annuler</button>
              <button class="btn btn-primary" @click="submitEditSae" :disabled="isEditingSae">
                  {{ isEditingSae ? 'Enregistrement...' : 'Mettre à jour' }}
              </button>
          </div>
      </div>
    </div>

    <!-- MODAL AJOUT VITRINE -->
    <div class="modal-overlay" :class="{ active: isVitrineModalOpen }" @click.self="closeVitrineModal">
      <div class="modal-content" style="max-width: 600px;">
          <h2 class="modal-title">Ajouter à la Vitrine Publique</h2>
          <div class="form-group">
              <label class="form-label">Titre public (affiché en très grand)</label>
              <input type="text" v-model="newVitrineEntry.titre" class="form-control" placeholder="Titre percutant...">
          </div>
          <div class="form-group">
              <label class="form-label">Description (facultative mais recommandée)</label>
              <textarea v-model="newVitrineEntry.description" class="form-control" rows="3" placeholder="Ce projet consiste à..."></textarea>
          </div>
          <div class="form-group">
              <label class="form-label">Auteur (affiché publiquement)</label>
              <input type="text" v-model="newVitrineEntry.eleve_nom" class="form-control">
          </div>
          <div class="form-group">
              <label class="form-label">Catégorie / Domaine</label>
              <input type="text" v-model="newVitrineEntry.domaine_activite" class="form-control" placeholder="Ex: Développement Web, Design...">
          </div>
          <div class="form-group">
              <label class="form-label">URL de l'image / Chemin upload</label>
              <input type="text" v-model="newVitrineEntry.image_url" class="form-control" placeholder="Ex: https://... ou uploads/vignettes/...">
          </div>
          <div class="form-group" style="display:flex; gap:12px;">
              <div style="flex:1;">
                  <label class="form-label">Formation *</label>
                  <select v-model="newVitrineEntry.formation" class="form-control" required>
                      <option value="MMI1">MMI 1</option>
                      <option value="MMI2">MMI 2</option>
                      <option value="MMI3">MMI 3</option>
                  </select>
              </div>
              <div style="flex:1;">
                  <label class="form-label">Lien du projet (Optionnel)</label>
                  <input type="text" v-model="newVitrineEntry.lien_externe" class="form-control" placeholder="Ex: https://mon-super-site.com">
              </div>
              <div style="width: 120px;">
                  <label class="form-label">Année *</label>
                  <input type="number" v-model="newVitrineEntry.annee" class="form-control" placeholder="2024" required>
              </div>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;">
              <button class="btn btn-outline" @click="closeVitrineModal">Annuler</button>
              <button class="btn btn-primary" @click="submitToVitrine" :disabled="isSubmittingVitrine">
                  {{ isSubmittingVitrine ? 'Ajout...' : 'Mettre en vitrine' }}
              </button>
          </div>
      </div>
    </div>

    <!-- TOAST -->
    <div v-if="toastMsg" class="toast" :class="toastType">
        {{ toastMsg }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const demandes = ref([])
const saesEnAttente = ref([])
const usersList = ref([])
const allSaesList = ref([])

const currentTab = ref('validation')

// Filtering states
const filterUserRole = ref('')
const filterSaeAnnee = ref('')
const filterSaeSemestre = ref('')
const filterSaeGroupe = ref('')

// Sorting states for User table
const sortKey = ref('nom')
const sortAsc = ref(true)

const toastMsg = ref('')
const toastType = ref('success')

const newAnnouncement = ref({ titre: '', destinataires: 'Tous', message: '' })
const isPublishingAnnouncement = ref(false)

const activeAnnonces = ref([])
const activeNotifs = ref([])
const newNotification = ref({ user_id: 'all', message: '' })
const isSendingNotif = ref(false)

const vitrineProjects = ref([])
const rendusEligibles = ref([])

const isVitrineModalOpen = ref(false)
const newVitrineEntry = ref({})
const isSubmittingVitrine = ref(false)

const fetchVitrineProjects = async () => {
    try {
        const { data } = await axios.get('/api/vitrine')
        vitrineProjects.value = data
    } catch(e) { console.error(e) }
}

const fetchRendusEligibles = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        const { data } = await axios.get('/api/admin/rendus-eligibles', { headers: { Authorization: `Bearer ${token}` }})
        rendusEligibles.value = data
    } catch(e) { console.error(e) }
}

const openVitrineModal = (rendu) => {
    newVitrineEntry.value = {
        rendu_id: rendu.id_rendu,
        titre: rendu.sae_titre + ' - ' + rendu.etudiant,
        description: '',
        eleve_nom: rendu.etudiant,
        domaine_activite: 'Général',
        image_url: rendu.vignette_path || rendu.image_url || '',
        lien_externe: '',
        annee: new Date().getFullYear().toString(),
        formation: 'MMI1'
    }
    isVitrineModalOpen.value = true
}

const closeVitrineModal = () => {
    isVitrineModalOpen.value = false
    newVitrineEntry.value = {}
}

const submitToVitrine = async () => {
    if(!newVitrineEntry.value.titre || !newVitrineEntry.value.image_url || !newVitrineEntry.value.formation || !newVitrineEntry.value.annee) {
        showToast("Titre, Image, Formation et Année sont obligatoires.", "error")
        return
    }
    isSubmittingVitrine.value = true
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.post('/api/admin/vitrine', newVitrineEntry.value, { headers: { Authorization: `Bearer ${token}` }})
        showToast("Projet ajouté à la vitrine publique !", "success")
        fetchVitrineProjects()
        closeVitrineModal()
    } catch(e) {
        showToast(e.response?.data?.error || "Erreur lors de l'ajout.", "error")
    } finally {
        isSubmittingVitrine.value = false
    }
}

const retirerDeVitrine = async (id) => {
    if(!confirm("Retirer ce projet de la vitrine publique ?")) return;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.delete(`/api/admin/vitrine/${id}`, { headers: { Authorization: `Bearer ${token}` }})
        showToast("Projet retiré avec succès.", "success")
        fetchVitrineProjects()
    } catch(e) { showToast("Erreur lors du retrait.", "error") }
}

const publishAnnouncement = async () => {
    if (!newAnnouncement.value.titre || !newAnnouncement.value.message) {
        showToast("Le titre et le message sont requis.", "error");
        return;
    }
    isPublishingAnnouncement.value = true;
    try {
        const token = localStorage.getItem('jwt_token');
        await axios.post('/api/annonces', newAnnouncement.value, {
            headers: { Authorization: `Bearer ${token}` }
        });
        showToast("Annonce publiée avec succès !", "success");
        newAnnouncement.value = { titre: '', destinataires: 'Tous', message: '' };
    } catch (e) {
        showToast("Erreur lors de la publication.", "error");
    } finally {
        isPublishingAnnouncement.value = false;
    }
};

let pollingInterval = null;

const showToast = (msg, type = 'success') => {
    toastMsg.value = msg
    toastType.value = type
    setTimeout(() => { toastMsg.value = '' }, 4000)
}

function getFileUrl(path) {
    if (!path) return '';
    path = path.replace('http://localhost:3000', '');
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL || '';
    if (path.includes('/rendus/')) {
        const tempPath = path.replace(/^\/?uploads\//, '');
        const filename = tempPath.split('/').pop();
        const token = localStorage.getItem('jwt_token') || '';
        return `${baseUrl}/uploads/rendus/${filename}?token=${token}`;
    }
    if (path.startsWith('/uploads/')) return baseUrl + path;
    if (path.startsWith('uploads/')) return baseUrl + '/' + path;
    return baseUrl + '/uploads/' + path;
}

const groupList = [
    "MMI1A1", "MMI1A2", "MMI1B1", "MMI1B2",
    "MMI2A1", "MMI2A2", "MMI2B1", "MMI2B2",
    "MMI3_GR1", "MMI3_GR2", "MMI3-FA", "MMI3-FA-CN"
]

const fetchDemandes = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        const { data } = await axios.get('/api/admin/demandes', { headers: { Authorization: `Bearer ${token}` }})
        demandes.value = data.map(d => {
            // retain selection local state if already there
            const existing = demandes.value.find(e => e.id_demande === d.id_demande)
            return {
                ...d,
                selYear: existing ? existing.selYear : '',
                selSub: existing ? existing.selSub : '',
                selFinal: existing ? existing.selFinal : ''
            }
        })
    } catch(e) { console.error(e) }
}

const fetchSAEsEnAttente = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        const { data } = await axios.get('/api/admin/saes/pending', { headers: { Authorization: `Bearer ${token}` }})
        saesEnAttente.value = data.map(sae => {
            const existing = saesEnAttente.value.find(e => e.id_sae === sae.id_sae)
            return { ...sae, adminCode: existing ? existing.adminCode : '' }
        })
    } catch(e) { console.error(e) }
}

const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        const { data } = await axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` }})
        usersList.value = data
    } catch(e) { console.error(e) }
}

const fetchAllSaes = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        const { data } = await axios.get('/api/admin/saes/all', { headers: { Authorization: `Bearer ${token}` }})
        allSaesList.value = data.filter(s => s.statut === 'Validé')
    } catch(e) { console.error(e) }
}

const deleteUser = async (id) => {
    if(!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.")) return;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` }})
        showToast("Utilisateur supprimé.", "success")
        fetchUsers()
    } catch(e) { showToast("Erreur suppression utilisateur", "error") }
}

const fetchAnnonces = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        const { data } = await axios.get('/api/annonces', { headers: { Authorization: `Bearer ${token}` }})
        activeAnnonces.value = data
    } catch(e) { console.error(e) }
}

const deleteAnnonce = async (id) => {
    if(!window.confirm("Supprimer cette annonce ?")) return;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.delete(`/api/admin/annonces/${id}`, { headers: { Authorization: `Bearer ${token}` }})
        showToast("Annonce supprimée.", "success")
        fetchAnnonces()
    } catch(e) { showToast("Erreur suppression annonce", "error") }
}

const fetchAdminNotifs = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        const { data } = await axios.get('/api/admin/notifications', { headers: { Authorization: `Bearer ${token}` }})
        activeNotifs.value = data
    } catch(e) { console.error(e) }
}

const sendNotification = async () => {
    if(!newNotification.value.message) { showToast("Message requis.", "error"); return; }
    isSendingNotif.value = true
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.post('/api/admin/notifications', newNotification.value, { headers: { Authorization: `Bearer ${token}` }})
        showToast("Notification envoyée !", "success")
        newNotification.value.message = ''
        fetchAdminNotifs()
    } catch(e) { showToast("Erreur envoi notification.", "error") }
    isSendingNotif.value = false
}

const deleteNotif = async (id) => {
    if(!window.confirm("Supprimer la notification ?")) return;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.delete(`/api/admin/notifications/${id}`, { headers: { Authorization: `Bearer ${token}` }})
        fetchAdminNotifs()
        showToast("Notification supprimée.", "success")
    } catch(e) { showToast("Erreur suppression notif.", "error") }
}

// ---------------- USER SORTING & FILTERING
const sortBy = (key) => {
    if (sortKey.value === key) {
        sortAsc.value = !sortAsc.value
    } else {
        sortKey.value = key
        sortAsc.value = true
    }
}

const filteredUsers = computed(() => {
    return usersList.value.filter(u => {
        return !filterUserRole.value || u.role === filterUserRole.value;
    })
})

const sortedUsers = computed(() => {
    return [...filteredUsers.value].sort((a, b) => {
        let valA = a[sortKey.value] || ''
        let valB = b[sortKey.value] || ''
        if (typeof valA === 'string') valA = valA.toLowerCase()
        if (typeof valB === 'string') valB = valB.toLowerCase()

        if (valA < valB) return sortAsc.value ? -1 : 1
        if (valA > valB) return sortAsc.value ? 1 : -1
        return 0
    })
})

// ---------------- SAE FILTERING
const filteredAllSaes = computed(() => {
    return allSaesList.value.filter(s => {
        const matchAnn = !filterSaeAnnee.value || (s.annee_univ && s.annee_univ.includes(filterSaeAnnee.value));
        const matchSem = !filterSaeSemestre.value || s.semestre === filterSaeSemestre.value;
        const matchGrp = !filterSaeGroupe.value || (s.groupe && s.groupe.toLowerCase().includes(filterSaeGroupe.value.toLowerCase()));
        return matchAnn && matchSem && matchGrp;
    })
})

// ---------------- ADMIN ACTIONS
const valider = async (d) => {
    let finalGroup = null;
    if (d.role === 'student') {
        finalGroup = d.selYear + d.selSub + d.selFinal;
        if(!d.selFinal) return;
    }

    if(!confirm("Valider ce compte avec le groupe terminal " + (finalGroup || 'Aucun') + " ?")) return;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.post(`/api/admin/demandes/${d.id_demande}/valider`, { groupe: finalGroup }, { headers: { Authorization: `Bearer ${token}` }})
        showToast("Compte validé !", "success")
        fetchDemandes()
        fetchUsers()
    } catch(e) { showToast("Erreur", "error"); }
}

const rejeter = async (id) => {
    if(!confirm("Rejeter définitivement cette demande ?")) return;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.post(`/api/admin/demandes/${id}/rejeter`, {}, { headers: { Authorization: `Bearer ${token}` }})
        showToast("Compte rejeté.", "success")
        fetchDemandes()
    } catch(e) { showToast("Erreur", "error"); }
}

const approuverSAE = async (sae) => {
    if(!sae.adminCode || sae.adminCode.trim() === '') return;
    if(!confirm(`Approuver cette SAE avec le code ${sae.adminCode} ?`)) return;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.put(`/api/admin/saes/${sae.id_sae}/approve`, { code: sae.adminCode }, { headers: { Authorization: `Bearer ${token}` }})
        showToast("SAE validée avec succès !", "success")
        fetchSAEsEnAttente()
        fetchAllSaes()
    } catch(e) {
        if(e.response?.status === 409) {
            showToast("Ce code SAE est déjà utilisé.", "error");
        } else {
            showToast("Erreur lors de la validation.", "error");
        }
    }
}

const refuserSAE = async (id) => {
    if(!confirm("Supprimer cette demande de SAE ?")) return;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.delete(`/api/admin/saes/${id}`, { headers: { Authorization: `Bearer ${token}` }})
        showToast("SAE supprimée", "success")
        fetchSAEsEnAttente()
    } catch(e) { showToast("Erreur de suppression", "error") }
}

// ---------------- USER EDIT LOGIC
const isEditUserModalOpen = ref(false)
const editingUser = ref({})
const isEditingUser = ref(false)

const openEditUserModal = (user) => {
    editingUser.value = { ...user }
    isEditUserModalOpen.value = true
}

const closeEditUserModal = () => {
    isEditUserModalOpen.value = false
    editingUser.value = {}
}

const submitEditUser = async () => {
    if (!editingUser.value.nom || !editingUser.value.email) {
        showToast("Informations manquantes", "error");
        return;
    }
    isEditingUser.value = true;
    try {
        const token = localStorage.getItem('jwt_token')
        await axios.put(`/api/admin/users/${editingUser.value.id_user}`, editingUser.value, { 
            headers: { Authorization: `Bearer ${token}` }
        })
        showToast("Utilisateur mis à jour !", "success");
        fetchUsers();
        closeEditUserModal();
    } catch (e) {
        showToast(e.response?.data?.error || "Erreur lors de la modification", "error");
    } finally {
        isEditingUser.value = false;
    }
}

// ---------------- SAE EDIT LOGIC (Admin)
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

const removeExistingConsigne = (idx) => { editingSae.value.existingConsignes.splice(idx, 1); }
const removeEditFile = (idx) => { editingSae.value.uploadFiles.splice(idx, 1); }
const addEditCompetence = () => { editingSae.value.competences.push('') }
const removeEditCompetence = (idx) => { editingSae.value.competences.splice(idx, 1) }

const validateFileType = (file) => {
    const allowed = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'video/mp4'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.zip')) {
        showToast("Fichier invalide.", "error");
        return false;
    }
    return true;
}

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
        try { existingConsignes = typeof sae.consignes_paths === 'string' ? JSON.parse(sae.consignes_paths) : sae.consignes_paths; } catch(e) {}
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
        if (editingSae.value.description) formData.append('description', editingSae.value.description);
        formData.append('semestre', editingSae.value.semestre);
        formData.append('groupe', editingSae.value.groupe);
        if (editingSae.value.annee_univ) formData.append('annee_univ', editingSae.value.annee_univ);
        formData.append('date_debut', editingSae.value.date_debut);
        if (editingSae.value.date_fin) formData.append('date_fin', editingSae.value.date_fin);
        
        const validCompetences = editingSae.value.competences.filter(c => c && c.trim() !== '');
        formData.append('competences', JSON.stringify(validCompetences));

        // existingConsignes override behavior (Mission 3 requires handling deletes)
        formData.append('existingConsignes', JSON.stringify(editingSae.value.existingConsignes));

        if (editingSae.value.vignette) formData.append('vignette', editingSae.value.vignette);
        if (editingSae.value.uploadFiles) {
            editingSae.value.uploadFiles.forEach(file => formData.append('consignes', file));
        }

        const token = localStorage.getItem('jwt_token')
        await axios.put(`/api/admin/saes/${editingSae.value.id_sae || editingSae.value.id}`, formData, { 
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        })
        
        showToast("SAE écrasée avec succès !", "success");
        fetchSAEsEnAttente();
        fetchAllSaes();
        closeEditModal();
    } catch (e) {
        showToast(e.response?.data?.error || "Erreur lors de la modification", "error");
    } finally {
        isEditingSae.value = false;
    }
}

const logout = () => {
    clearInterval(pollingInterval);
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_role')
    router.push('/login/admin')
}

onMounted(() => {
    fetchDemandes()
    fetchSAEsEnAttente()
    fetchUsers()
    fetchAllSaes()
    fetchAnnonces()
    fetchAdminNotifs()
    fetchVitrineProjects()
    fetchRendusEligibles()

    // MISSION 4: ZERO REFRESH POLLING
    pollingInterval = setInterval(() => {
        fetchDemandes()
        fetchSAEsEnAttente()
        fetchUsers()
        fetchAllSaes()
        fetchAnnonces()
        fetchAdminNotifs()
    }, 5000);
})
</script>

<style scoped>
.admin-dashboard { padding: 40px; max-width: 1200px; margin: 0 auto; min-height: 100vh; }
.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 20px; margin-bottom: 20px; }
.header-small { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; margin-bottom: 16px; border-bottom: 1px solid var(--border-light); }
.header-small h3 { font-size: 1.25rem; color: var(--text-primary); margin: 0; }
.empty-state { padding: 40px; text-align: center; color: var(--text-secondary); background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-light); }
.demandes-table { width: 100%; border-collapse: collapse; background: var(--bg-surface); box-shadow: var(--shadow-sm); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 20px; border: 1px solid var(--border-light); }
.demandes-table th { background: var(--bg-app); color: var(--text-primary); font-weight: 600; text-align: left; padding: 16px; border-bottom: 1px solid var(--border-light); transition: background 0.2s;}
.demandes-table th:hover { background: var(--bg-surface); }
.demandes-table td { padding: 16px; border-bottom: 1px solid var(--border-light); color: var(--text-secondary); }
.btn-sm { padding: 6px 12px; font-size: 13px; }
.badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
.badge.student { background: var(--status-info-bg); color: var(--status-info-text); text-transform: capitalize; border: 1px solid var(--status-info-border); }
.badge.teacher { background: var(--status-warning-bg); color: var(--status-warning-text); text-transform: capitalize; border: 1px solid var(--status-warning-border); }
.badge.admin { background: var(--status-danger-bg); color: var(--status-danger-text); text-transform: capitalize; border: 1px solid var(--status-danger-border); }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; z-index: 9999; }
.modal-overlay.active { opacity: 1; pointer-events: auto; }
.modal-content { background: var(--bg-surface); padding: 32px; border-radius: 16px; width: 90%; max-width: 500px; transform: translateY(20px); transition: transform 0.3s ease; box-shadow: var(--shadow-card); border: 1px solid var(--border-light); }
.modal-overlay.active .modal-content { transform: translateY(0); }
.modal-title { margin-top: 0; margin-bottom: 24px; color: var(--text-primary); font-size: 20px; }
.form-group { margin-bottom: 16px; }
.form-label { display: block; margin-bottom: 6px; color: var(--text-secondary); font-size: 13px; font-weight: 500; }
.grid { display: grid; }
.sort-icon { display:inline-block; margin-left:8px; font-size:10px; color: var(--text-secondary); }

.toast { position: fixed; top: 20px; right: 20px; padding: 16px 24px; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-light); box-shadow: var(--shadow-card); z-index: 10000; font-weight: bold; animation: slideIn 0.3s ease-out forwards; color: var(--text-primary); }
.toast.success { border-left: 4px solid var(--status-success-text); }
.toast.error { border-left: 4px solid var(--status-danger-text); }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>
