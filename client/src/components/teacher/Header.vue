<template>
  <header>
      <div class="search-wrapper">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Rechercher un étudiant, un groupe, un rendu...">
      </div>
      <div class="header-actions">
          <div class="user-profile" @click="toggleMenu" ref="profileRef">
              <span>{{ user.nom }} (Enseignant)</span>
              <div class="avatar purple">{{ userInitials }}</div>
              
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isMenuOpen = ref(false)
const profileRef = ref(null)

const user = ref({ nom: 'Enseignant', email: '' })

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
})

onUnmounted(() => {
    document.removeEventListener('click', closeMenuOnOutsideClick)
})

const userInitials = computed(() => {
    if (!user.value.nom) return 'PR'
    const parts = user.value.nom.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return user.value.nom.substring(0, 2).toUpperCase()
})

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeMenuOnOutsideClick = (e) => {
    if (profileRef.value && !profileRef.value.contains(e.target)) {
        isMenuOpen.value = false
    }
}

const handleLogout = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_info')
    router.push('/login')
}
</script>

<style scoped>
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
    border-radius: var(--radius-lg);
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
    background-color: var(--bg-app);
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
</style>
