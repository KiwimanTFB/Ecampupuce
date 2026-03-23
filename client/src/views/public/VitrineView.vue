<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 pt-40 pb-32 transition-colors duration-500">
    
    <main class="max-w-[1400px] mx-auto px-6 md:px-12">
      <!-- Entête Ultra Minimaliste -->
      <div class="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12 animate-fade-in-up">
        <div>
           <p class="text-blue-600 dark:text-stone-500 tracking-[0.3em] uppercase text-xs mb-6 font-sans font-bold">Archive</p>
           <h1 class="text-5xl md:text-8xl lg:text-[7rem] font-sans font-black tracking-tighter leading-[0.9] text-neutral-950 dark:text-white">
             Fonds <br><span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Visuel.</span>
           </h1>
        </div>
        <p class="font-sans text-neutral-600 dark:text-stone-400 max-w-sm text-sm font-medium leading-relaxed">
          Sélection drastique des créations du département MMI. Des expériences interactives, des identités de marque et des architectures repoussant les frontières.
        </p>
      </div>

      <!-- Filtres Elite (Typo Sans-Serif Bold & Centrés) -->
      <div class="flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-40 animate-fade-in-up animation-delay-300">
         <button 
           v-for="filter in filters" :key="filter.value"
           @click="activeFilter = filter.value"
           class="group relative text-lg md:text-2xl font-sans font-bold text-center transition-all duration-500 tracking-wide bg-transparent border-0 outline-none focus:outline-none"
           :class="activeFilter === filter.value ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-stone-500 hover:text-neutral-800 dark:hover:text-neutral-300'"
         >
           {{ filter.label }}
           <span class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
                 :class="activeFilter === filter.value ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-8 group-hover:opacity-100'"></span>
         </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-32">
        <div class="w-px h-16 bg-neutral-300 dark:bg-stone-700 animate-pulse"></div>
      </div>

      <!-- Grille Mansonry Authentique (CSS Columns) -->
      <transition-group 
         name="project-list" 
         tag="div" 
         class="columns-1 md:columns-2 lg:columns-3 gap-12 w-full"
         v-else
      >
        <div v-for="project in displayedProjects" :key="project.id" 
             @click="openProject(project)"
             class="group project-item cursor-pointer break-inside-avoid mb-24 w-full inline-block"> 
             
          <div class="relative overflow-hidden bg-neutral-100 dark:bg-[#0f0f0f] w-full rounded-2xl" :class="project.aspectClass">
             <!-- Image avec transition noir&blanc vers couleur -->
             <img :src="project.image" :alt="project.titre" 
                  class="w-full h-full object-cover filter grayscale contrast-125 transform transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105 opacity-80 dark:opacity-70 group-hover:opacity-100" />
             
             <!-- Overlay Responsive (Fix Mobile) -->
             <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-white/90 via-white/70 dark:from-[#0a0a0a]/90 dark:via-[#0a0a0a]/70 to-transparent backdrop-blur-md 
                         translate-y-0 lg:translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col justify-end z-10 w-full">
                
                <div class="flex justify-between items-end mb-2">
                  <div>
                     <span class="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest font-sans font-bold mb-1 block">{{ project.sae_titre }}</span>
                     <h3 class="text-2xl md:text-3xl font-sans font-black tracking-tighter text-neutral-950 dark:text-white">{{ project.titre }}</h3>
                  </div>
                  <span class="text-neutral-500 dark:text-stone-500 text-xs font-sans font-bold">{{ project.annee }}</span>
                </div>
                
                <div class="h-[2px] w-full bg-neutral-200 dark:bg-white/20 mb-4 mt-2 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-500"></div>
                
                <div class="flex justify-between items-center text-[10px] text-neutral-600 dark:text-stone-300 font-sans tracking-wider uppercase">
                  <span class="font-bold">{{ project.etudiant }}</span>
                  <span class="px-3 py-1 border border-neutral-300 dark:border-white/20 rounded-full bg-neutral-100 dark:bg-black/40 text-neutral-800 dark:text-white font-bold shadow-sm">{{ project.niveau }}</span>
                </div>
                
              </div>
          </div>
        </div>
      </transition-group>

      <!-- Modale de Détail (Tech / IUT) -->
      <transition name="modal">
        <div v-if="selectedProject" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/80 backdrop-blur-xl p-4 md:p-12 overflow-y-auto">
          <!-- Backdrop click to close -->
          <div class="absolute inset-0 cursor-pointer" @click="closeProject"></div>
          
          <!-- Conteneur Modale -->
          <div class="relative w-full max-w-5xl bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-200 dark:border-white/10 z-10" @click.stop>
             
             <!-- Bouton Fermer -->
             <button @click="closeProject" class="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-neutral-500 hover:text-neutral-900 dark:text-stone-400 dark:hover:text-white transition-colors p-2 bg-white/50 dark:bg-black/50 rounded-full backdrop-blur-sm border border-transparent dark:border-white/10">
               <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             
             <!-- Gauche : Image -->
             <div class="w-full md:w-1/2 h-[30vh] md:h-auto min-h-[400px] relative bg-neutral-100 dark:bg-[#0f0f0f]">
               <img :src="selectedProject.image" :alt="selectedProject.titre" class="absolute inset-0 w-full h-full object-cover" />
               <div class="absolute inset-0 bg-gradient-to-t from-black/30 md:from-transparent to-transparent"></div>
             </div>
             
             <!-- Droite : Informations -->
             <div class="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white dark:bg-[#0a0a0a]">
               <span class="text-xs font-sans font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-4 block">{{ selectedProject.sae_titre }}</span>
               <h2 class="text-3xl md:text-5xl font-sans font-black tracking-tighter text-neutral-950 dark:text-white mb-6 leading-tight">{{ selectedProject.titre }}</h2>
               
               <div class="flex items-center gap-4 mb-8">
                  <span class="px-4 py-1.5 bg-neutral-100 dark:bg-white/10 rounded-full text-xs font-sans font-bold text-neutral-800 dark:text-white">{{ selectedProject.niveau }}</span>
                  <span class="text-sm font-sans font-bold text-neutral-500 dark:text-stone-400">{{ selectedProject.annee }}</span>
               </div>
               
               <div class="mb-10">
                 <h4 class="text-[10px] uppercase tracking-widest font-sans font-bold text-neutral-400 dark:text-stone-500 mb-2">Réalisé par</h4>
                 <p class="text-lg font-sans font-bold text-neutral-800 dark:text-stone-200">{{ selectedProject.etudiant }}</p>
               </div>
               
               <div class="prose prose-sm dark:prose-invert font-sans text-neutral-600 dark:text-stone-400 leading-relaxed">
                 <p>Une réalisation exceptionnelle issue du département métier du multimédia et de l'internet. Le projet démontre une combinaison pointue de stratégie, d'ingénierie web et de design interface.</p>
                 <p class="mt-4 text-xs font-medium dark:text-stone-500">Données issues de la route /api/public/projets de l'intranet pédagogique.</p>
               </div>
             </div>
             
          </div>
        </div>
      </transition>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';

const ALL_PROJECTS = ref([]);
const loading = ref(true);
const activeFilter = ref('Tous');
const selectedProject = ref(null);

const openProject = (project) => {
  selectedProject.value = project;
  document.body.style.overflow = 'hidden'; // Scroll Lock
};

const closeProject = () => {
  selectedProject.value = null;
  document.body.style.overflow = '';
};

const filters = [
  { label: 'Tous', value: 'Tous' },
  { label: 'BUT 1', value: 'BUT 1' },
  { label: 'BUT 2', value: 'BUT 2' },
  { label: 'BUT 3', value: 'BUT 3' }
];

// OBLIGATOIRE: Computed ne modifiant JAMAIS ALL_PROJECTS
const displayedProjects = computed(() => {
  if (activeFilter.value === 'Tous') {
    return ALL_PROJECTS.value;
  }
  return ALL_PROJECTS.value.filter(p => p.niveau === activeFilter.value);
});

// OBLIGATOIRE: Relancer l'IntersectionObserver sur les nouveaux éléments
const applyObserver = () => {
  nextTick(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
           entry.target.classList.add('is-visible');
           observer.unobserve(entry.target);
         }
      });
    }, { threshold: 0.1, rootMargin: "0px" });

    // Cible spécifiquement les éléments qui viennent d'apparaître
    document.querySelectorAll('.project-item:not(.is-visible)').forEach(el => observer.observe(el));
  });
};

onMounted(async () => {
  try {
    const response = await fetch('/api/public/projets');
    const data = await response.json();
    
    // Au cas où l'API est asynchrone, assigner le tableau final récupéré de la BDD
    ALL_PROJECTS.value = data;
  } catch (error) {
    console.error('Erreur API Vitrine:', error);
  } finally {
    loading.value = false;
    applyObserver();
  }
});

// LE VRAI FIX DU BUG: Quand le filtre change, l'observer doit révéler les projets (CSS opacity 0)
watch(activeFilter, () => {
  applyObserver();
});
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(80px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animation-delay-300 { animation-delay: 0.3s; }

.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.project-list-enter-from,
.project-list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}
.project-list-leave-active {
  position: absolute;
}

.project-item {
  opacity: 0;
  transform: translateY(80px);
  will-change: opacity, transform;
}
.project-item.is-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Grayscale state management pour assurer le N&B strict sans hover */
.filter.grayscale {
  filter: grayscale(100%) contrast(1.1) brightness(0.7);
}
.group:hover .filter.grayscale-0 {
  filter: grayscale(0%) contrast(1.15) brightness(1) !important;
}

/* Modale Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
