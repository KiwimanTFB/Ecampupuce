<template>
  <header 
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b font-sans w-full"
    :class="[
      scrolled 
        ? 'bg-white/90 dark:bg-[#050505]/80 backdrop-blur-2xl border-neutral-200 dark:border-white/10 py-5 shadow-xl' 
        : 'bg-transparent dark:bg-[#0a0a0a]/50 backdrop-blur-md border-transparent dark:border-white/5 py-6'
    ]"
  >
    <div class="container mx-auto px-8 md:px-12 w-full">
      <div class="flex items-center justify-between w-full">
        
        <!-- Logo Tech/IUT -->
        <router-link to="/" class="group flex items-center relative z-50">
          <span class="text-2xl font-sans font-black tracking-tight text-neutral-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-neutral-300">
             Ecampupuce<span class="text-blue-600 dark:text-blue-500">.</span>
          </span>
        </router-link>
        
        <!-- Menu Desktop (Tech Minimaliste) -->
        <nav class="hidden md:flex items-center space-x-10 relative z-50">
          <router-link 
             v-for="link in links" 
             :key="link.path" 
             :to="link.path" 
             class="relative group py-2 flex flex-col items-center"
             active-class="is-active"
          >
             <span class="text-sm uppercase tracking-wider font-sans font-bold text-neutral-500 dark:text-stone-400 group-hover:text-blue-600 dark:group-hover:text-white transition-colors duration-300">
               {{ link.name }}
             </span>
             <span class="absolute -bottom-1 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300 ease-out rounded-full"></span>
          </router-link>
          
          <div class="w-px h-5 bg-neutral-300 dark:bg-white/10 mx-2"></div>
          
          <!-- Bouton Theme Toggle -->
          <button @click="toggleTheme" class="relative items-center justify-center flex p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white transition-colors focus:outline-none">
             <!-- Sun icon -->
             <svg v-if="!isDarkMode" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
             <!-- Moon icon -->
             <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          </button>
          
          <!-- Bouton Accent Tech -->
          <div class="flex items-center ml-2">
            <router-link to="/auth/login" class="group relative overflow-hidden text-xs uppercase tracking-wider font-sans font-bold text-white px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 rounded-md">
              <span class="relative z-10 flex items-center gap-2">
                 Portail Pro
                 <svg class="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                 </svg>
              </span>
            </router-link>
          </div>
        </nav>

        <!-- Toggle Mobile & Menu Burger -->
        <div class="md:hidden flex items-center gap-4">
          <button @click="toggleTheme" class="relative items-center justify-center flex p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors focus:outline-none">
             <svg v-if="!isDarkMode" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
             <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          </button>
          
          <button class="w-8 h-8 flex flex-col items-center justify-center gap-1.5 group">
             <span class="w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 origin-center"></span>
             <span class="w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 group-hover:w-4"></span>
             <span class="w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 origin-center"></span>
          </button>
        </div>
        
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrolled = ref(false);
const isDarkMode = ref(true);

const links = [
  { path: '/', name: 'Accueil' },
  { path: '/vitrine', name: 'Projets' },
  { path: '/but', name: 'Studio MMI' },
  { path: '/campus', name: 'Campus' }
];

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  if (localStorage.getItem('theme') === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  } else {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

html {
  font-family: 'Inter', sans-serif;
  scroll-behavior: smooth;
  background-color: #ffffff; /* Default base */
}

html.dark {
  background-color: #0a0a0a;
}

body {
  background-color: transparent !important;
}

.font-serif {
  font-family: 'Playfair Display', serif !important;
}

.font-sans {
  font-family: 'Inter', sans-serif !important;
}

::selection {
  background: #3b82f6;
  color: #fff;
}

.is-active span:first-child {
  color: #2563eb !important; 
}
.dark .is-active span:first-child {
  color: #ffffff !important;
}
</style>
