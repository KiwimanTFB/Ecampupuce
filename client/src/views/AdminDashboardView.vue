<template>
  <div class="admin-dashboard">
    <div class="header">
        <h2>Espace Administrateur - Demandes de création de compte</h2>
        <button @click="logout" class="btn btn-outline">Se déconnecter</button>
    </div>

    <div v-if="demandes.length === 0" class="empty-state">
        Aucune demande en attente.
    </div>

    <table v-else class="demandes-table">
      <thead>
        <tr>
          <th>Nom / Prénom</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Rôle</th>
          <th>N° Étudiant</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in demandes" :key="d.id_demande">
          <td><strong>{{ d.nom }}</strong> {{ d.prenom }}</td>
          <td>{{ d.email }}</td>
          <td>{{ d.telephone }}</td>
          <td><span :class="'badge ' + d.role">{{ d.role }}</span></td>
          <td>{{ d.numero_etudiant || '-' }}</td>
          <td>{{ new Date(d.date_demande).toLocaleDateString() }}</td>
          <td>
            <button class="btn btn-primary btn-sm" @click="valider(d.id_demande)" style="margin-right:8px;">Valider</button>
            <button class="btn btn-danger btn-sm" @click="rejeter(d.id_demande)">Rejeter</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const demandes = ref([])
const router = useRouter()

const fetchDemandes = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        const { data } = await axios.get('/api/admin/demandes', { headers: { Authorization: `Bearer ${token}` }})
        demandes.value = data
    } catch(e) {
        console.error(e)
    }
}

const valider = async (id) => {
    if(!confirm("Valider ce compte et l'insérer dans les utilisateurs actifs ?")) return;
    const token = localStorage.getItem('jwt_token')
    await axios.post(`/api/admin/demandes/${id}/valider`, {}, { headers: { Authorization: `Bearer ${token}` }})
    fetchDemandes()
}

const rejeter = async (id) => {
    if(!confirm("Rejeter définitivement cette demande ?")) return;
    const token = localStorage.getItem('jwt_token')
    await axios.post(`/api/admin/demandes/${id}/rejeter`, {}, { headers: { Authorization: `Bearer ${token}` }})
    fetchDemandes()
}

const logout = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_role')
    router.push('/login/admin')
}

onMounted(() => fetchDemandes())
</script>

<style scoped>
.admin-dashboard { padding: 40px; max-width: 1200px; margin: 0 auto; font-family: sans-serif; background: white; min-height: 100vh; }
.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
.empty-state { padding: 40px; text-align: center; color: #666; background: #f9fafb; border-radius: 8px; }
.demandes-table { width: 100%; border-collapse: collapse; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
.demandes-table th { background: #f3f4f6; color: #374151; font-weight: 600; text-align: left; padding: 16px; border-bottom: 2px solid #e5e7eb; }
.demandes-table td { padding: 16px; border-bottom: 1px solid #e5e7eb; color: #4b5563; }
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-danger { background-color: #ef4444; color: white; border: none; }
.btn-danger:hover { background-color: #dc2626; }
.badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
.badge.student { background: #e0f2fe; color: #0284c7; }
.badge.teacher { background: #fef3c7; color: #d97706; }
</style>
