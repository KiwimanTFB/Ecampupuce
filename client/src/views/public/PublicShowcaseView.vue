<template>
  <div class="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 pt-36 pb-32 transition-colors duration-500 min-h-screen">
    <main class="container mx-auto px-6">

      <!-- ── En-tête ── -->
      <div class="mb-20 animate-fade-in">
        <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs mb-5 font-bold">Archive / Galerie</p>
        <h1 class="sr-only">Découvrez les projets MMI de l'IUT — département Multimedia &amp; Internet</h1>
        <p aria-hidden="true" class="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[0.95] text-neutral-950 dark:text-white max-w-2xl">
          Nos<br /><span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Projets.</span>
        </p>
        <p class="text-neutral-500 dark:text-stone-400 max-w-sm text-sm leading-relaxed mt-6">
          Créations issues du département MMI Vélizy — développement web, design, communication, audiovisuel et 3D.
        </p>
      </div>

      <!-- ── Filtres Multi-sélection ── -->
      <div class="mb-14 animate-fade-in animation-delay-200">

        <!-- Niveau -->
        <div class="filter-row mb-5">
          <span class="filter-row__label">Niveau</span>
          <div class="filter-row__chips">
            <button
              v-for="f in FILTERS_NIVEAU" :key="f.value"
              @click="toggleFilter('niveau', f.value)"
              class="filter-chip"
              :class="activeFilters.niveau.includes(f.value) ? 'filter-chip--active' : ''"
              :aria-pressed="activeFilters.niveau.includes(f.value)"
            >
              {{ f.label }}
              <span v-if="activeFilters.niveau.includes(f.value)" class="filter-chip__x">×</span>
            </button>
          </div>
        </div>

        <!-- Domaine - multi select -->
        <div class="filter-row mb-5">
          <span class="filter-row__label">Domaine</span>
          <div class="filter-row__chips">
            <button
              v-for="f in FILTERS_DOMAINE" :key="f.value"
              @click="toggleFilter('domaine', f.value)"
              class="filter-chip"
              :class="activeFilters.domaine.includes(f.value) ? 'filter-chip--active' : ''"
              :aria-pressed="activeFilters.domaine.includes(f.value)"
            >
              {{ f.label }}
              <span v-if="activeFilters.domaine.includes(f.value)" class="filter-chip__x">×</span>
            </button>
          </div>
        </div>

        <!-- Année - multi select -->
        <div class="filter-row mb-8">
          <span class="filter-row__label">Année</span>
          <div class="filter-row__chips">
            <button
              v-for="f in FILTERS_ANNEE" :key="f.value"
              @click="toggleFilter('annee', f.value)"
              class="filter-chip"
              :class="activeFilters.annee.includes(f.value) ? 'filter-chip--active' : ''"
              :aria-pressed="activeFilters.annee.includes(f.value)"
            >
              {{ f.label }}
              <span v-if="activeFilters.annee.includes(f.value)" class="filter-chip__x">×</span>
            </button>
          </div>
        </div>

        <!-- Barre résultats + reset -->
        <div class="flex items-center justify-between flex-wrap gap-4">
          <p class="text-xs text-neutral-400 dark:text-stone-600">
            <span class="font-black text-neutral-900 dark:text-white text-sm">{{ displayedProjects.length }}</span>
            <span class="ml-1">projet{{ displayedProjects.length !== 1 ? 's' : '' }}</span>
          </p>
          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="text-[10px] text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold uppercase tracking-widest transition-colors border-b border-red-500/30 hover:border-red-500 pb-px"
          >
            Effacer les filtres
          </button>
        </div>
      </div>

      <!-- ── Masonry Grid ── -->
      <transition name="fade" mode="out-in">

        <!-- Skeleton loading -->
        <div v-if="loading" key="skeleton" class="columns-1 sm:columns-2 lg:columns-3 gap-6 w-full">
          <div v-for="i in 6" :key="`sk-${i}`" class="mb-6 break-inside-avoid w-full">
            <div class="w-full bg-neutral-100 dark:bg-[#111] rounded-xl animate-pulse"
                 :style="{ aspectRatio: skAspects[i % 3] }"></div>
          </div>
        </div>

        <!-- Grille projets -->
        <div v-else key="grid" class="columns-1 sm:columns-2 lg:columns-3 gap-6 w-full">
          <article
            v-for="(project, idx) in displayedProjects"
            :key="project.id"
            @click="openProject(project)"
            @keyup.enter="openProject(project)"
            tabindex="0"
            class="project-item group cursor-pointer break-inside-avoid mb-6 w-full inline-block"
            :style="`animation-delay: ${Math.min(idx, 8) * 60}ms`"
            :aria-label="`Voir le projet ${project.titre}`"
          >
            <div class="relative overflow-hidden bg-neutral-100 dark:bg-[#0f0f0f] w-full rounded-xl" :class="project.aspectClass">
              <img
                :src="project.image"
                :alt="project.titre"
                :loading="idx < 4 ? 'eager' : 'lazy'"
                class="w-full h-full object-cover filter grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
              />
              <!-- Overlay -->
              <div class="absolute inset-x-0 bottom-0 p-5
                          bg-gradient-to-t from-black/90 via-black/40 to-transparent
                          translate-y-0 lg:translate-y-[102%] group-hover:translate-y-0
                          transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
                <p class="text-[9px] text-blue-400 uppercase tracking-widest font-bold mb-1">{{ project.sae_titre }}</p>
                <h3 class="text-base font-black text-white leading-tight mb-3">{{ project.titre }}</h3>
                <div class="h-px w-full bg-white/15 mb-3"></div>
                <div class="flex justify-between items-center text-[9px] uppercase tracking-widest">
                  <span class="text-stone-300 font-bold truncate max-w-[60%]">{{ project.etudiant }}</span>
                  <span class="semestre-badge">{{ formatSemestreLabel(project) }}</span>
                </div>
                <a v-if="project.lien_externe" :href="project.lien_externe" target="_blank" @click.stop class="block mt-4 px-3 py-2 text-center bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md hover:bg-blue-500 transition-colors w-full">Visiter le projet</a>
              </div>
            </div>
          </article>

          <!-- Aucun résultat -->
          <div v-if="displayedProjects.length === 0 && !loading" class="text-center py-32 w-full" style="column-span: all;">
            <p class="text-4xl mb-4">∅</p>
            <p class="text-neutral-500 dark:text-stone-500 font-semibold mb-4">Aucun projet ne correspond à ces filtres.</p>
            <button @click="resetFilters" class="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">Afficher tous les projets</button>
          </div>
        </div>

      </transition>
    </main>

    <!-- ── Modale Projet ── -->
    <transition name="modal">
      <div
        v-if="selectedProject"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-2xl p-4 md:p-12 overflow-y-auto"
        @click.self="closeProject"
      >
        <div
          class="relative w-full max-w-5xl bg-white dark:bg-[#080808] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-200 dark:border-white/8 z-10 my-6"
          @click.stop
        >
          <!-- Close -->
          <button
            @click="closeProject"
            class="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center bg-black/60 rounded-full text-white/60 hover:text-white hover:bg-black/80 backdrop-blur-sm transition-all"
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>

          <!-- Image -->
          <div class="w-full md:w-[55%] h-[40vh] md:h-auto min-h-[380px] relative bg-neutral-100 dark:bg-[#111] flex-shrink-0">
            <img :src="selectedProject.image" :alt="selectedProject.titre" class="absolute inset-0 w-full h-full object-cover" />
          </div>

          <!-- Infos -->
          <div class="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <p class="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-4">{{ selectedProject.sae_titre }}</p>
            <h2 class="text-2xl md:text-3xl font-black tracking-tighter text-neutral-950 dark:text-white mb-6 leading-tight">{{ selectedProject.titre }}</h2>

            <div class="flex flex-wrap gap-2 mb-8">
              <span class="info-badge">{{ formatSemestreLabel(selectedProject) }}</span>
              <span class="info-badge">{{ selectedProject.annee }}</span>
              <span v-if="selectedProject.domaine_activite" class="info-badge info-badge--blue">{{ selectedProject.domaine_activite }}</span>
            </div>

            <div class="mb-6">
              <p class="text-[10px] uppercase tracking-widest font-bold text-neutral-400 dark:text-stone-500 mb-2">Réalisé par</p>
              <p class="text-lg font-black text-neutral-900 dark:text-white">{{ selectedProject.etudiant }}</p>
            </div>

            <div class="h-px w-full bg-neutral-100 dark:bg-white/8 my-6"></div>
            <p class="text-xs text-neutral-400 dark:text-stone-600 leading-relaxed">
              Projet du parcours <strong class="text-neutral-700 dark:text-stone-400">{{ selectedProject.niveau }}</strong> — département MMI Vélizy.
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';

// ══════════════════════════════════════════════════════════════
//  DONNÉES ÉDITABLES — modifier ces constantes pour personnaliser
// ══════════════════════════════════════════════════════════════

const FILTERS_NIVEAU = [
  { label: 'MMI 1', value: 'MMI1' },
  { label: 'MMI 2', value: 'MMI2' },
  { label: 'MMI 3', value: 'MMI3' }
];

const FILTERS_DOMAINE = [
  { label: 'Développement Web', value: 'Développement Web' },
  { label: 'Design', value: 'Design' },
  { label: 'Communication', value: 'Communication' },
  { label: 'Audiovisuel', value: 'Audiovisuel' },
  { label: '3D & Jeux', value: '3D & Jeux' }
];

const FILTERS_ANNEE = [
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' }
];

// Mapping domaine BDD → libellé normalisé
const DOMAINE_LABELS = {
  'dev': 'Développement Web', 'devweb': 'Développement Web',
  'développement web': 'Développement Web', 'développement': 'Développement Web',
  'design': 'Design', 'design graphique': 'Design', 'graphisme': 'Design',
  'ui': 'Design', 'ux': 'Design', 'création numérique': 'Design',
  'com': 'Communication', 'communication': 'Communication', 'médias': 'Communication',
  'audiovisuel': 'Audiovisuel', 'video': 'Audiovisuel', 'vidéo': 'Audiovisuel', 'cinéma': 'Audiovisuel',
  '3d': '3D & Jeux', '3d & jeux': '3D & Jeux', 'jeux': '3D & Jeux', 'game': '3D & Jeux'
};

const FALLBACK_PROJECTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800', titre: 'Campagne 360°', sae_titre: 'SAE 1.01', semestre: 'S1', niveau: 'BUT 1', annee: '2024', etudiant: 'Emma Bernard', domaine_activite: 'Communication', aspectClass: 'aspect-[4/5]' },
  { id: 2, image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800', titre: 'Fintech Dashboard', sae_titre: 'SAE 3.01', semestre: 'S3', niveau: 'BUT 2', annee: '2025', etudiant: 'Lucas Martin', domaine_activite: 'Développement Web', aspectClass: 'aspect-[16/9]' },
  { id: 3, image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800', titre: 'Komorebi Void', sae_titre: 'SAE 5.02', semestre: 'S5', niveau: 'BUT 3', annee: '2025', etudiant: 'Alice Dupont', domaine_activite: '3D & Jeux', aspectClass: 'aspect-[1/1]' },
  { id: 4, image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800', titre: 'Brand Identity', sae_titre: 'SAE 2.01', semestre: 'S2', niveau: 'BUT 1', annee: '2024', etudiant: 'Hugo Renard', domaine_activite: 'Design', aspectClass: 'aspect-[3/4]' },
  { id: 5, image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800', titre: 'Montage Cinéma', sae_titre: 'SAE 4.03', semestre: 'S4', niveau: 'BUT 2', annee: '2025', etudiant: 'Léa Fontaine', domaine_activite: 'Audiovisuel', aspectClass: 'aspect-[16/9]' },
  { id: 6, image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?q=80&w=800', titre: 'Portfolio Pro', sae_titre: 'SAE 6.01', semestre: 'S6', niveau: 'BUT 3', annee: '2026', etudiant: 'Noah Petit', domaine_activite: 'Développement Web', aspectClass: 'aspect-[4/5]' },
  { id: 7, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=800', titre: 'UI System Design', sae_titre: 'SAE 3.02', semestre: 'S3', niveau: 'BUT 2', annee: '2024', etudiant: 'Zoé Lambert', domaine_activite: 'Design', aspectClass: 'aspect-[4/5]' },
  { id: 8, image: 'https://images.unsplash.com/photo-1579547621113-e4bb2a19bdd6?q=80&w=800', titre: 'Podcast Series', sae_titre: 'SAE 2.03', semestre: 'S2', niveau: 'BUT 1', annee: '2025', etudiant: 'Axel Rousseau', domaine_activite: 'Audiovisuel', aspectClass: 'aspect-[16/9]' },
  { id: 9, image: 'https://images.unsplash.com/photo-1535223289429-462106a84e84?q=80&w=800', titre: 'Game Jam Entry', sae_titre: 'SAE 4.04', semestre: 'S4', niveau: 'BUT 2', annee: '2026', etudiant: 'Camille Aubert', domaine_activite: '3D & Jeux', aspectClass: 'aspect-[1/1]' }
];

const ASPECT_CLASSES = ['aspect-[4/5]', 'aspect-[16/9]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[16/9]', 'aspect-[4/5]'];
const skAspects = { 0: '4/5', 1: '16/9', 2: '1/1' };

// ══════════════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════════════

const ALL_PROJECTS = ref([]);
const loading = ref(true);
const selectedProject = ref(null);

// Multi-select : chaque dimension est un tableau de valeurs actives
const activeFilters = ref({ niveau: [], domaine: [], annee: [] });

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════

const getDomaineLabel = (rawDomaine) => {
  if (!rawDomaine) return null;
  return DOMAINE_LABELS[(rawDomaine || '').toLowerCase().trim()] || rawDomaine;
};

const formatSemestreLabel = (project) => {
  if (!project.semestre) return project.niveau || '';
  const sem = project.semestre.toUpperCase();
  const semNum = parseInt(sem.replace('S', ''), 10);
  if (semNum >= 4 && project.domaine_activite) {
    return `${sem} — ${getDomaineLabel(project.domaine_activite)}`;
  }
  return sem;
};

const NIVEAU_MAP = { 'BUT 1': 'MMI1', 'BUT 2': 'MMI2', 'BUT 3': 'MMI3' };

// ══════════════════════════════════════════════════════════════
//  COMPUTED - Filtrage multi-select cumulatif
// ══════════════════════════════════════════════════════════════

const displayedProjects = computed(() => {
  return ALL_PROJECTS.value.filter(project => {
    // Niveau : si des niveaux sont sélectionnés, le projet doit appartenir à l'un d'eux
    if (activeFilters.value.niveau.length > 0) {
      const pNiveau = NIVEAU_MAP[project.niveau] || project.niveau;
      if (!activeFilters.value.niveau.includes(pNiveau)) return false;
    }
    // Domaine : même logique (OU logique entre les domaines)
    if (activeFilters.value.domaine.length > 0) {
      const pDomaine = getDomaineLabel(project.domaine_activite);
      if (!pDomaine || !activeFilters.value.domaine.includes(pDomaine)) return false;
    }
    // Année
    if (activeFilters.value.annee.length > 0) {
      if (!activeFilters.value.annee.includes(String(project.annee))) return false;
    }
    return true;
  });
});

const hasActiveFilters = computed(() =>
  activeFilters.value.niveau.length > 0 ||
  activeFilters.value.domaine.length > 0 ||
  activeFilters.value.annee.length > 0
);

// ══════════════════════════════════════════════════════════════
//  ACTIONS
// ══════════════════════════════════════════════════════════════

const toggleFilter = (dimension, value) => {
  const arr = activeFilters.value[dimension];
  const idx = arr.indexOf(value);
  if (idx === -1) {
    activeFilters.value[dimension] = [...arr, value];
  } else {
    activeFilters.value[dimension] = arr.filter(v => v !== value);
  }
};

const resetFilters = () => {
  activeFilters.value = { niveau: [], domaine: [], annee: [] };
};

const openProject = (project) => {
  selectedProject.value = project;
  document.body.style.overflow = 'hidden';
};
const closeProject = () => {
  selectedProject.value = null;
  document.body.style.overflow = '';
};

// ══════════════════════════════════════════════════════════════
//  ANIMATION REVEAL
// ══════════════════════════════════════════════════════════════

const applyObserver = () => {
  nextTick(() => {
    const els = document.querySelectorAll('.project-item:not(.is-visible)');
    // Révèle immédiatement les éléments déjà dans le viewport
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      }
    });
    // Observer pour les éléments encore hors viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });
    document.querySelectorAll('.project-item:not(.is-visible)').forEach(el => observer.observe(el));
  });
};

// ══════════════════════════════════════════════════════════════
//  FETCH
// ══════════════════════════════════════════════════════════════

onMounted(async () => {
  try {
    const res = await fetch('/api/vitrine');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    ALL_PROJECTS.value = (data.length > 0 ? data : FALLBACK_PROJECTS).map((p, i) => ({
      ...p,
      aspectClass: p.aspectClass || ASPECT_CLASSES[i % ASPECT_CLASSES.length]
    }));
  } catch {
    ALL_PROJECTS.value = FALLBACK_PROJECTS;
  } finally {
    loading.value = false;
    // nextTick garantit que le DOM est peint, puis reveal immédiat
    nextTick(() => applyObserver());
  }
});

watch(() => activeFilters.value, () => { setTimeout(applyObserver, 30); }, { deep: true });
</script>

<style scoped>
@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { opacity: 0; animation: fadeInUp 1s cubic-bezier(0.16,1,0.3,1) forwards; }
.animation-delay-200 { animation-delay: 0.2s; }

/* ── Project cards reveal ── */
.project-item {
  opacity: 0;
  transform: translateY(30px);
  will-change: opacity, transform;
  transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
}
.project-item.is-visible { opacity: 1; transform: translateY(0); }

/* ── Filter row ── */
.filter-row { display: flex; align-items: flex-start; gap: 12px; }
.filter-row__label {
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700;
  color: #a3a3a3; width: 60px; flex-shrink: 0; padding-top: 7px;
}
.dark .filter-row__label { color: #57534e; }
.filter-row__chips { display: flex; gap: 6px; flex-wrap: wrap; }

/* ── Filter chips ── */
.filter-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 14px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
  border-radius: 99px; border: 1px solid #e5e5e5; color: #737373;
  background: transparent; cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.dark .filter-chip { border-color: rgba(255,255,255,0.1); color: #78716c; }
.filter-chip:hover { border-color: #a3a3a3; color: #171717; }
.dark .filter-chip:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
.filter-chip--active { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.dark .filter-chip--active { border-color: #3b82f6; color: #60a5fa; background: rgba(37,99,235,0.12); }
.filter-chip__x { font-size: 13px; line-height: 1; opacity: 0.6; }

/* ── Semestre Badge ── */
.semestre-badge {
  padding: 2px 8px; font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  border-radius: 99px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: #fff;
}

/* ── Info Badges (modale) ── */
.info-badge { padding: 4px 12px; font-size: 11px; font-weight: 700; border-radius: 99px; background: #f5f5f5; color: #525252; }
.dark .info-badge { background: rgba(255,255,255,0.09); color: #d4d4d4; }
.info-badge--blue { background: #eff6ff; color: #1d4ed8; }
.dark .info-badge--blue { background: rgba(37,99,235,0.18); color: #93c5fd; }

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.98); }
</style>
