<template>
  <header>
      <div style="display: flex; align-items: center; gap: 16px;">
          <button class="burger-menu-btn" @click="$emit('toggle-sidebar')" aria-label="Ouvrir le menu">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div class="search-wrapper">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Rechercher une SAE, un document...">
          </div>
      </div>
      <div class="header-actions" style="display: flex; gap: 20px; align-items: center;">
          
          <!-- Cloche de notification -->
          <div class="notif-wrapper" @click="toggleNotifMenu" ref="notifRef" style="position: relative; cursor: pointer; display: flex; align-items: center;">
              <svg viewBox="0 0 24 24" width="22" height="22" style="stroke: var(--text-secondary); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span v-if="unreadNotifs.length > 0" class="notif-badge">{{ unreadNotifs.length }}</span>
              
              <div v-show="isNotifMenuOpen" class="notif-dropdown" @click.stop="">
                  <div class="dropdown-header">
                      <div class="dropdown-name">Notifications</div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div v-if="unreadNotifs.length === 0" style="padding: 12px 20px; font-size: 13px; color: var(--text-secondary); text-align: center;">Aucune nouvelle notification</div>
                  <div v-else class="notif-list">
                      <div v-for="notif in unreadNotifs" :key="notif.id" class="notif-item">
                          <div class="notif-text">{{ notif.message }}</div>
                          <button class="notif-close" @click.stop="markAsRead(notif.id)" title="Marquer comme lu">✕</button>
                      </div>
                  </div>
              </div>
          </div>

          <div class="user-profile" @click="toggleMenu" ref="profileRef">
              <span>{{ user.nom }} (Étudiant)</span>
              <div class="avatar">{{ userInitials }}</div>
              
              <div v-show="isMenuOpen" class="profile-dropdown">
                  <div class="dropdown-header">
                      <div class="dropdown-name">{{ user.nom }}</div>
                      <div class="dropdown-email">{{ user.email }}</div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item text-danger" @click="handleLogout">
                      <svg viewBox="0 0 24 24" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Se déconnecter
                  </button>
              </div>
          </div>
      </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const isMenuOpen = ref(false)
const profileRef = ref(null)

const isNotifMenuOpen = ref(false)
const notifRef = ref(null)
const unreadNotifs = ref([])

const user = ref({ nom: 'Étudiant', email: '' })

let notifInterval = null

const fetchNotifs = async () => {
    try {
        const token = localStorage.getItem('jwt_token')
        if(!token) return
        const res = await axios.get('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
        unreadNotifs.value = res.data
    } catch(e) { console.error('Erreur notifs', e) }
}

onMounted(() => {
    const savedUser = localStorage.getItem('user_info')
    if (savedUser) {
        try {
            user.value = JSON.parse(savedUser)
        } catch (e) {
            console.error(e)
        }
    }
    document.addEventListener('click', closeMenuOnOutsideClick)
    
    fetchNotifs()
    notifInterval = setInterval(fetchNotifs, 10000)
})

onUnmounted(() => {
    document.removeEventListener('click', closeMenuOnOutsideClick)
    clearInterval(notifInterval)
})

const userInitials = computed(() => {
    if (!user.value.nom) return 'ET'
    const parts = user.value.nom.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return user.value.nom.substring(0, 2).toUpperCase()
})

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
    if(isMenuOpen.value) isNotifMenuOpen.value = false
}

const toggleNotifMenu = () => {
    isNotifMenuOpen.value = !isNotifMenuOpen.value
    if(isNotifMenuOpen.value) isMenuOpen.value = false
}

const closeMenuOnOutsideClick = (e) => {
    if (profileRef.value && !profileRef.value.contains(e.target)) isMenuOpen.value = false
    if (notifRef.value && !notifRef.value.contains(e.target)) isNotifMenuOpen.value = false
}

const markAsRead = async (id) => {
    try {
        const token = localStorage.getItem('token')
        await axios.put(`/api/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } })
        unreadNotifs.value = unreadNotifs.value.filter(n => n.id !== id)
    } catch(e) { console.error(e) }
}

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_info')
    router.push('/login')
}
</script>

<style scoped>
.burger-menu-btn {
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    margin-left: -8px; 
}

@media (min-width: 769px) {
    .burger-menu-btn {
        display: none;
    }
}

.user-profile {
    position: relative;
    cursor: pointer;
    user-select: none;
}

.profile-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: 240px;
    background: var(--bg-surface);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
    padding: 8px 0;
    z-index: 100;
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
    padding: 12px 20px;
}

.dropdown-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
    margin-bottom: 4px;
}

.dropdown-email {
    color: var(--text-secondary);
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dropdown-divider {
    height: 1px;
    background: var(--border-light);
    margin: 8px 0;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    text-align: left;
    transition: background-color 0.2s;
}

.dropdown-item:hover {
    background: var(--bg-app);
}

.text-danger {
    color: var(--status-danger-text);
}

.text-danger svg {
    stroke: currentColor;
    fill: none;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.notif-badge { position: absolute; top: -4px; right: -4px; background: var(--status-danger-text); color: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid var(--bg-surface); }
.notif-dropdown { position: absolute; top: calc(100% + 16px); right: -10px; width: 320px; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); box-shadow: var(--shadow-card); padding: 8px 0; z-index: 100; animation: fadeIn 0.2s ease-out; cursor: default; }
.notif-list { max-height: 300px; overflow-y: auto; }
.notif-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 12px 20px; transition: background-color 0.2s; border-bottom: 1px solid var(--border-light); }
.notif-item:last-child { border-bottom: none; }
.notif-item:hover { background-color: var(--bg-app); }
.notif-text { font-size: 13px; color: var(--text-primary); line-height: 1.4; padding-right: 12px; }
.notif-close { background: transparent; border: none; font-size: 12px; color: var(--text-secondary); cursor: pointer; padding: 4px; display:flex; align-items:center; justify-content:center; border-radius:4px; }
.notif-close:hover { color: var(--status-danger-text); background: var(--status-danger-bg); }
</style>
