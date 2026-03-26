<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b font-sans w-full"
    :class="[
      scrolled
        ? 'bg-white/95 dark:bg-[#050505]/95 backdrop-blur-2xl border-neutral-200 dark:border-white/10 py-4 shadow-sm'
        : 'bg-transparent dark:bg-transparent backdrop-blur-md border-transparent dark:border-white/5 py-6'
    ]"
  >
    <div class="container mx-auto px-6 w-full">
      <div class="flex items-center justify-between w-full">

        <!-- Logo -->
        <router-link to="/" class="group flex items-center relative z-50" aria-label="Retour à l'accueil Ecampupuce">
          <span class="text-xl font-black tracking-tight text-neutral-900 dark:text-white transition-colors duration-300">
            Ecampupuce<span class="text-blue-600 dark:text-blue-500">.</span>
          </span>
        </router-link>

        <!-- Nav Desktop -->
        <nav class="hidden md:flex items-center gap-8 relative z-50" role="navigation" aria-label="Navigation principale">

          <!-- Accueil -->
          <router-link to="/" class="nav-link" :class="{'nav-link--active': $route.name === 'accueil'}">
            <span>Accueil</span>
          </router-link>

          <div class="relative" @mouseenter="openDropdown('but')" @mouseleave="closeDropdown('but')">
            <router-link
              to="/but"
              class="nav-link flex items-center gap-1.5"
              :class="{'nav-link--active': isButActive}"
              :aria-expanded="activeDropdown === 'but'"
              aria-haspopup="true"
              id="btn-but"
            >
              <span>LE BUT</span>
              <svg class="w-3 h-3 transition-transform duration-300" :class="activeDropdown === 'but' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </router-link>

            <transition name="dropdown">
              <div v-if="activeDropdown === 'but'" class="dropdown-panel" role="menu" aria-labelledby="btn-but">
                <router-link to="/projets" class="dropdown-item" role="menuitem" @click="closeDropdown('but')">
                  <span class="dropdown-item__icon">→</span>
                  <div>
                    <span class="dropdown-item__title">Nos Projets</span>
                    <span class="dropdown-item__desc">Galerie des créations MMI</span>
                  </div>
                </router-link>
                <router-link to="/but#equipe" class="dropdown-item" role="menuitem" @click="closeDropdown('but')">
                  <span class="dropdown-item__icon">→</span>
                  <div>
                    <span class="dropdown-item__title">Notre Équipe</span>
                    <span class="dropdown-item__desc">Enseignants & intervenants</span>
                  </div>
                </router-link>
                <router-link to="/but#apres" class="dropdown-item" role="menuitem" @click="closeDropdown('but')">
                  <span class="dropdown-item__icon">→</span>
                  <div>
                    <span class="dropdown-item__title">Et après le BUT ?</span>
                    <span class="dropdown-item__desc">Débouchés & poursuites</span>
                  </div>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Inscription Dropdown -->
          <div class="relative" @mouseenter="openDropdown('inscription')" @mouseleave="closeDropdown('inscription')">
            <button
              class="nav-link flex items-center gap-1.5"
              :class="{'nav-link--active': isInscriptionActive}"
              :aria-expanded="activeDropdown === 'inscription'"
              aria-haspopup="true"
              id="btn-inscription"
            >
              <span>Inscription</span>
              <svg class="w-3 h-3 transition-transform duration-300" :class="activeDropdown === 'inscription' ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <transition name="dropdown">
              <div v-if="activeDropdown === 'inscription'" class="dropdown-panel" role="menu" aria-labelledby="btn-inscription">
                <router-link to="/inscription/parcoursup" class="dropdown-item" role="menuitem" @click="closeDropdown('inscription')">
                  <span class="dropdown-item__icon">→</span>
                  <div>
                    <span class="dropdown-item__title">Informations Parcoursup</span>
                    <span class="dropdown-item__desc">Guide & calendrier lycéens</span>
                  </div>
                </router-link>
                <router-link to="/inscription/candidature" class="dropdown-item" role="menuitem" @click="closeDropdown('inscription')">
                  <span class="dropdown-item__icon">→</span>
                  <div>
                    <span class="dropdown-item__title">Candidature spontanée</span>
                    <span class="dropdown-item__desc">Hors Parcoursup & transferts</span>
                  </div>
                </router-link>
                <router-link to="/inscription/integration" class="dropdown-item" role="menuitem" @click="closeDropdown('inscription')">
                  <span class="dropdown-item__icon">→</span>
                  <div>
                    <span class="dropdown-item__title">Journée d'intégration</span>
                    <span class="dropdown-item__desc">Bienvenue dans la promo MMI</span>
                  </div>
                </router-link>
              </div>
            </transition>
          </div>

          <!-- Le Campus -->
          <router-link to="/le-campus" class="nav-link" :class="{'nav-link--active': $route.name === 'le-campus'}">
            <span>Le Campus</span>
          </router-link>

          <!-- Nous contacter -->
          <router-link to="/contact" class="nav-link" :class="{'nav-link--active': $route.name === 'contact'}">
            <span>Contacter</span>
          </router-link>

          <div class="w-px h-5 bg-neutral-300 dark:bg-white/10 mx-1"></div>

          <!-- Theme Toggle -->
          <button @click="toggleTheme" class="theme-btn" aria-label="Basculer le thème sombre/clair">
            <svg v-if="!isDarkMode" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Portail Pro -->
          <router-link to="/login" class="btn-portal" aria-label="Accéder au portail">
            Portail Pro
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:14px;height:14px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </router-link>
        </nav>

        <!-- Mobile Controls -->
        <div class="md:hidden flex items-center gap-3 relative z-50">
          <button @click="toggleTheme" class="theme-btn" aria-label="Basculer le thème">
            <svg v-if="!isDarkMode" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          <button @click="toggleMobile" class="burger-btn" :aria-expanded="mobileOpen" aria-label="Menu">
            <span :class="mobileOpen ? 'rotate-45 translate-y-[7px]' : ''" class="burger-line"></span>
            <span :class="mobileOpen ? 'opacity-0 scale-x-0' : ''" class="burger-line"></span>
            <span :class="mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''" class="burger-line"></span>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="mobile-menu">
      <div v-if="mobileOpen" class="mobile-overlay" role="dialog" aria-modal="true">
        <nav class="container mx-auto px-6 py-8 flex flex-col">

          <router-link to="/" class="mobile-link" @click="closeMobile">Accueil</router-link>

          <div class="mobile-group">
            <div class="mobile-group__header flex justify-between items-center w-full">
              <router-link to="/but" class="flex-1 text-left font-black" @click="closeMobile">LE BUT</router-link>
              <button @click="mobileSubOpen = mobileSubOpen === 'but' ? '' : 'but'" class="p-2" aria-label="Ouvrir le sous-menu LE BUT">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;" :class="mobileSubOpen === 'but' ? 'rotate-180 transition-transform' : 'transition-transform'">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <transition name="accordion">
              <div v-if="mobileSubOpen === 'but'" class="mobile-sub">
                <router-link to="/projets" class="mobile-sub__link" @click="closeMobile">Nos Projets</router-link>
                <router-link to="/but#equipe" class="mobile-sub__link" @click="closeMobile">Notre Équipe</router-link>
                <router-link to="/but#apres" class="mobile-sub__link" @click="closeMobile">Et après le BUT ?</router-link>
              </div>
            </transition>
          </div>

          <div class="mobile-group">
            <button class="mobile-group__header" @click="mobileSubOpen = mobileSubOpen === 'inscription' ? '' : 'inscription'">
              <span>Inscription</span>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width:16px;height:16px;" :style="mobileSubOpen === 'inscription' ? 'transform:rotate(180deg)' : ''">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <transition name="accordion">
              <div v-if="mobileSubOpen === 'inscription'" class="mobile-sub">
                <router-link to="/inscription/parcoursup" class="mobile-sub__link" @click="closeMobile">Informations Parcoursup</router-link>
                <router-link to="/inscription/candidature" class="mobile-sub__link" @click="closeMobile">Candidature spontanée</router-link>
                <router-link to="/inscription/integration" class="mobile-sub__link" @click="closeMobile">Journée d'intégration</router-link>
              </div>
            </transition>
          </div>

          <router-link to="/le-campus" class="mobile-link" @click="closeMobile">Le Campus</router-link>
          <router-link to="/contact" class="mobile-link" @click="closeMobile">Nous contacter</router-link>

          <div style="margin-top:32px;padding-top:32px;border-top:1px solid rgba(0,0,0,0.08);">
            <router-link to="/login" class="btn-portal" style="display:flex;justify-content:center;" @click="closeMobile">
              Portail Pro →
            </router-link>
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const scrolled = ref(false);
const isDarkMode = ref(true);
const activeDropdown = ref('');
const mobileOpen = ref(false);
const mobileSubOpen = ref('');

const isButActive = computed(() => ['nos-projets', 'notre-but'].includes(route.name));
const isInscriptionActive = computed(() => ['parcoursup', 'candidature', 'integration'].includes(route.name));

const openDropdown = (name) => { activeDropdown.value = name; };
const closeDropdown = (name) => { if (activeDropdown.value === name) activeDropdown.value = ''; };
const toggleMobile = () => {
  mobileOpen.value = !mobileOpen.value;
  document.body.style.overflow = mobileOpen.value ? 'hidden' : '';
};
const closeMobile = () => {
  mobileOpen.value = false;
  mobileSubOpen.value = '';
  document.body.style.overflow = '';
};
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
  else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
};
const handleScroll = () => { scrolled.value = window.scrollY > 20; };
const handleClickOutside = (e) => { if (!e.target.closest('header')) activeDropdown.value = ''; };

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleClickOutside);
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || (!saved && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    isDarkMode.value = false; document.documentElement.classList.remove('dark');
  } else { isDarkMode.value = true; document.documentElement.classList.add('dark'); }
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
  document.body.style.overflow = '';
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
html { font-family: 'Inter', sans-serif; scroll-behavior: smooth; }
html.dark { background-color: #0a0a0a; }
body { background-color: transparent !important; }
::selection { background: #2563eb; color: #fff; }
</style>

<style scoped>
/* ── Nav Links ── */
.nav-link {
  position: relative;
  padding: 8px 0;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #737373;
  transition: color 0.2s;
  background: transparent;
  border: 0;
  cursor: pointer;
  outline: none;
  text-decoration: none;
}
.dark .nav-link { color: #a8a29e; }
.nav-link:hover { color: #171717; }
.dark .nav-link:hover { color: #fff; }
.nav-link--active { color: #171717 !important; }
.dark .nav-link--active { color: #fff !important; }
.nav-link--active::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0; right: 0;
  height: 2px;
  background: #2563eb;
  border-radius: 2px;
}

/* ── Theme Button ── */
.theme-btn {
  padding: 8px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #525252;
  border: none;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dark .theme-btn { background: #262626; color: #a3a3a3; }
.theme-btn:hover { color: #2563eb; }
.dark .theme-btn:hover { color: #fff; }

/* ── Portal Button ── */
.btn-portal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: #fff;
  padding: 10px 20px;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  border-radius: 6px;
  text-decoration: none;
  transition: box-shadow 0.3s, transform 0.2s;
}
.btn-portal:hover { box-shadow: 0 10px 25px -5px rgba(37,99,235,0.35); transform: translateY(-1px); }

/* ── Dropdown Panel ── */
.dropdown-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.12);
  padding: 8px;
  z-index: 100;
}
.dark .dropdown-panel { background: #111; border-color: rgba(255,255,255,0.1); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);}

.dropdown-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.15s;
  cursor: pointer;
}
.dropdown-item:hover { background: #f5f5f5; }
.dark .dropdown-item:hover { background: rgba(255,255,255,0.05); }

.dropdown-item__icon { color: #a3a3a3; font-size: 13px; font-weight: 700; line-height: 1.4; flex-shrink: 0; }
.dropdown-item:hover .dropdown-item__icon { color: #2563eb; }
.dark .dropdown-item:hover .dropdown-item__icon { color: #60a5fa; }

.dropdown-item__title { display: block; font-size: 13px; font-weight: 700; color: #262626; line-height: 1.3; margin-bottom: 2px; }
.dark .dropdown-item__title { color: #e5e5e5; }
.dropdown-item__desc { display: block; font-size: 11px; color: #a3a3a3; line-height: 1.4; }

/* ── Burger ── */
.burger-btn {
  width: 32px; height: 32px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 5px;
  background: transparent; border: none; cursor: pointer;
}
.burger-line {
  display: block; width: 22px; height: 1.5px;
  background: currentColor;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
  transform-origin: center;
}

/* ── Mobile Overlay ── */
.mobile-overlay {
  position: fixed;
  inset: 0;
  top: 0;
  padding-top: 80px;
  background: #fff;
  z-index: 40;
  overflow-y: auto;
}
.dark .mobile-overlay { background: #080808; }

.mobile-link {
  display: block;
  padding: 18px 0;
  font-size: 22px;
  font-weight: 900;
  color: #171717;
  border-bottom: 1px solid #f5f5f5;
  text-decoration: none;
  transition: color 0.2s;
}
.dark .mobile-link { color: #fff; border-bottom-color: rgba(255,255,255,0.06); }
.mobile-link:hover { color: #2563eb; }

.mobile-group { border-bottom: 1px solid #f5f5f5; }
.dark .mobile-group { border-bottom-color: rgba(255,255,255,0.06); }
.mobile-group__header {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 18px 0;
  font-size: 22px; font-weight: 900;
  color: #171717; background: transparent; text-align: left;
  transition: color 0.2s;
}
.dark .mobile-group__header { color: #fff; }

.mobile-sub { padding-bottom: 12px; padding-left: 16px; display: flex; flex-direction: column; gap: 2px; }
.mobile-sub__link {
  display: block; padding: 10px 0;
  font-size: 15px; font-weight: 600;
  color: #737373; text-decoration: none;
  transition: color 0.2s;
}
.dark .mobile-sub__link { color: #a3a3a3; }
.mobile-sub__link:hover { color: #2563eb; }
.dark .mobile-sub__link:hover { color: #60a5fa; }

/* ── Transitions ── */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateX(-50%) translateY(-8px); }
.dropdown-enter-to { transform: translateX(-50%) translateY(0); }

.mobile-menu-enter-active, .mobile-menu-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1); }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-12px); }

.accordion-enter-active, .accordion-leave-active { transition: all 0.25s ease; overflow: hidden; max-height: 240px; }
.accordion-enter-from, .accordion-leave-to { opacity: 0; max-height: 0; }
</style>
