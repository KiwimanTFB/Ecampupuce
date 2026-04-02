<template>
  <div class="text-neutral-900 dark:text-stone-200 bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
    <main>

      <!-- ══ 1. HERO SECTION ════════════════════════════════════════ -->
      <section class="relative flex flex-col justify-center pt-40 pb-24 min-h-[90vh] container mx-auto px-6 overflow-hidden">

        <!-- Glow blob -->
        <div class="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full filter blur-[120px] animate-blob pointer-events-none"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-600/8 rounded-full filter blur-[100px] animate-blob-slow pointer-events-none"></div>

        <!-- Parallax images (desktop) -->
        <div class="absolute inset-0 pointer-events-none hidden lg:block z-0">
          <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600"
               class="absolute top-[15%] right-[8%] w-[220px] aspect-[3/4] object-cover opacity-25 dark:opacity-60 transition-opacity duration-500"
               :style="{ transform: `translateY(${scrollY * -0.28}px) rotate(2deg)` }"
               alt="" aria-hidden="true" />
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600"
               class="absolute bottom-[12%] left-[3%] w-[280px] aspect-video object-cover opacity-15 dark:opacity-50"
               :style="{ transform: `translateY(${scrollY * -0.12}px) rotate(-1deg)` }"
               alt="" aria-hidden="true" />
        </div>

        <!-- Content -->
        <div class="relative z-10 w-full mt-12 flex flex-col gap-10">
          <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold opacity-0 animate-fade-in">
            IUT Vélizy — Département MMI
          </p>

          <h1 class="text-5xl md:text-7xl lg:text-[6.5rem] font-black leading-[1.02] tracking-tighter opacity-0 animate-fade-in animation-delay-200 max-w-5xl text-neutral-950 dark:text-white">
            Envie de découvrir la <br />
            formation <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">MMI?</span>
          </h1>

          <div class="flex flex-col md:flex-row items-start md:items-center gap-8 opacity-0 animate-fade-in animation-delay-500 max-w-3xl border-l-4 border-blue-600/20 dark:border-blue-500/30 pl-8">
            <p class="font-sans text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed max-w-sm">
              Bienvenue sur le site officiel du département « Métiers du Multimédia et de l’Internet » de l’IUT de Vélizy.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 shrink-0">
              <router-link to="/projets" class="btn-primary" aria-label="Explorer nos projets">
                Explorer nos projets
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </router-link>
              <router-link to="/inscription/parcoursup" class="btn-secondary" aria-label="Rejoindre le BUT MMI">
                Rejoindre le BUT
              </router-link>
            </div>
          </div>

          <!-- Tags tech -->
          <div class="flex flex-wrap gap-2 opacity-0 animate-fade-in animation-delay-700">
            <span v-for="tag in techTags" :key="tag" class="tech-tag">{{ tag }}</span>
          </div>
        </div>
      </section>

      <!-- ══ 2. APERÇU PROJETS ══════════════════════════════════════ -->
      <section class="py-32 border-t border-neutral-100 dark:border-white/5 transition-colors duration-500">
        <div class="container mx-auto px-6">

          <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 animate-on-scroll">
            <div>
              <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-4">Sélection de</p>
              <h2 class="text-4xl md:text-6xl font-black tracking-tighter text-neutral-950 dark:text-white leading-[1.05]">
                Nos meilleurs<br /><span class="text-neutral-400 dark:text-stone-600">projets.</span>
              </h2>
            </div>
            <router-link to="/projets" class="btn-text shrink-0 animate-on-scroll">
              Voir tous les projets →
            </router-link>
          </div>

          <!-- Skeleton -->
          <div v-if="loadingProjects" class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="i in 3" :key="i" class="aspect-[3/4] bg-neutral-100 dark:bg-[#111] rounded-2xl animate-pulse"></div>
          </div>

          <!-- Grid projets -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
              v-for="(project, i) in featuredProjects"
              :key="project.id"
              class="project-card animate-on-scroll group cursor-pointer"
              :style="{ animationDelay: `${i * 100}ms` }"
              @click="openModal(project)"
              :aria-label="`Voir le projet ${project.titre}`"
              tabindex="0"
              @keyup.enter="openModal(project)"
            >
              <div class="relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-[#111]" :class="['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[1/1]'][i % 3]">
                <img :src="project.image" :alt="'Vignette du projet ' + project.titre + ' par ' + project.etudiant"
                     class="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <span class="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">{{ project.sae_titre }}</span>
                  <h2 class="text-white text-xl font-black tracking-tight">{{ project.titre }}</h2>
                  <p class="text-stone-400 text-xs mt-1">{{ formatSemestre(project) }}</p>

                  <a v-if="project.lien_externe" :href="project.lien_externe" target="_blank" @click.stop class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-bold rounded hover:bg-blue-500 transition-colors w-max">Visiter le projet</a>
                </div>
              </div>
            </article>
          </div>

          <!-- Pas de projets -->
          <div v-if="!loadingProjects && featuredProjects.length === 0" class="text-center py-20">
            <p class="text-neutral-400 dark:text-stone-500 text-sm">Aucun projet public disponible pour le moment.</p>
          </div>

        </div>
      </section>

      <!-- ══ 3. SECTION FORMATION & ÉQUIPE ═════════════════════════ -->
      <section class="py-32 bg-neutral-50 dark:bg-[#050505] border-t border-neutral-100 dark:border-white/5 transition-colors duration-500">
        <div class="container mx-auto px-6">

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

            <!-- Bloc Formation -->
            <div class="animate-on-scroll">
              <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-6">Formation</p>
              <h2 class="text-4xl md:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white mb-8 leading-[1.05]">
                Le BUT MMI<br /><span class="font-light italic text-neutral-500 dark:text-stone-500">en 3 ans.</span>
              </h2>
              <p class="text-neutral-600 dark:text-stone-400 leading-relaxed mb-10">
                Le département forme en trois ans des professionnel·le·s de la conception et de la réalisation de projets multimédias.
Il propose deux parcours :
“Création numérique” et “Développement web et dispositifs interactifs.”
À la fois créatif·ve·s et compétent·e·s techniquement, les diplômé·e·s de notre département sont polyvalent·e·s dans le domaine des médias, du web et des nouvelles technologies.
              </p>

              <!-- Parcours -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <div v-for="parcours in parcoursList" :key="parcours.code" class="parcours-card">
                  <span class="text-2xl font-black text-blue-600 dark:text-blue-500 mb-2 block">{{ parcours.code }}</span>
                  <p class="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">{{ parcours.nom }}</p>
                  <p class="text-xs text-neutral-500 dark:text-stone-500 mt-1 leading-relaxed">{{ parcours.desc }}</p>
                </div>
              </div>

              <router-link to="/but" class="btn-primary inline-flex">
                Découvrir le BUT MMI
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </router-link>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 animate-on-scroll stats-block">
              <div v-for="stat in stats" :key="stat.label" class="stat-card">
                <span class="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 block mb-2">
                  {{ stat.value }}
                </span>
                <p class="text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-stone-500">{{ stat.label }}</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ══ 4. SECTION CONTACT & INSCRIPTION ══════════════════════ -->
      <section class="py-32 border-t border-neutral-100 dark:border-white/5 transition-colors duration-500">
        <div class="container mx-auto px-6">

          <div class="text-center mb-20 animate-on-scroll">
            <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-6">Rejoindre la promo</p>
            <h2 class="text-4xl md:text-6xl font-black tracking-tighter text-neutral-950 dark:text-white mb-6 leading-[1.05]">
              Prêt à intégrer<br />le département ?
            </h2>
            <p class="text-neutral-600 dark:text-stone-400 max-w-xl mx-auto leading-relaxed">
              Plusieurs voies d'accès selon votre profil. Découvrez comment rejoindre le BUT MMI et façonner votre avenir numérique.
            </p>
          </div>

          <!-- CTA Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-on-scroll">
            <router-link
              v-for="cta in ctaCards"
              :key="cta.route"
              :to="cta.route"
              class="cta-card group"
              :aria-label="cta.title"
            >
              <div class="cta-card__number">{{ cta.number }}</div>
              <h3 class="cta-card__title">{{ cta.title }}</h3>
              <p class="cta-card__desc">{{ cta.desc }}</p>
              <span class="cta-card__arrow">→</span>
            </router-link>
          </div>

          <!-- Contact rapide -->
          <div class="text-center mt-20 animate-on-scroll">
            <p class="text-neutral-500 dark:text-stone-500 text-sm mb-4">Une question ?</p>
            <router-link to="/contact" class="btn-text text-lg">
              Nous contacter directement &rarr;
            </router-link>
          </div>

        </div>
      </section>

    </main>

    <!-- Modale projet -->
    <transition name="modal">
      <div v-if="selectedProject" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 md:p-12" @click.self="closeModal">
        <div class="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-200 dark:border-white/10 z-10" @click.stop>
          <button @click="closeModal" class="absolute top-4 right-4 z-20 text-neutral-500 hover:text-neutral-900 dark:text-stone-400 dark:hover:text-white p-2 bg-white/70 dark:bg-black/70 rounded-full backdrop-blur-sm border border-neutral-200 dark:border-white/10" aria-label="Fermer">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <div class="w-full md:w-1/2 h-[40vh] md:h-auto min-h-[350px] relative bg-neutral-100 dark:bg-[#111]">
            <img :src="selectedProject.image" :alt="selectedProject.titre" class="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <span class="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500 mb-4 block">{{ selectedProject.sae_titre }}</span>
            <h2 class="text-3xl md:text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-4 leading-tight">{{ selectedProject.titre }}</h2>
            <div class="flex flex-wrap gap-2 mb-6">
              <span class="chip">{{ selectedProject.niveau }}</span>
              <span class="chip">{{ selectedProject.annee }}</span>
              <span v-if="selectedProject.domaine_activite" class="chip chip--blue">{{ selectedProject.domaine_activite }}</span>
            </div>
            <p class="text-xs text-neutral-400 dark:text-stone-500 uppercase tracking-widest font-bold mb-2">Réalisé par</p>
            <p class="text-lg font-bold text-neutral-900 dark:text-white">{{ selectedProject.etudiant }}</p>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrollY = ref(0);
const loadingProjects = ref(true);
const featuredProjects = ref([]);
const selectedProject = ref(null);

// ══════════════════════════════════════════════════════════
//  Vitrine Dynamique
// ══════════════════════════════════════════════════════════

const techTags = ['Développement Web', 'Audiovisuel', 'Graphisme', '3D & Jeux', 'Communication'];

const parcoursList = [
  { code: 'DW', nom: 'Développement Web', desc: 'Front-end, APIs, Frameworks, VR' },
  { code: 'CN', nom: 'Création Numérique', desc: 'Motion design, 3D, identité visuelle, Campagnes de communication' },
];
 a
const stats = [
  { value: '6', label: 'Semestres' },
  { value: '2', label: 'Parcours' },
  { value: '1', label: 'Année en alternance' },
  { value: '~50', label: 'Étudiants/promo' }
];

const ctaCards = [
  {
    number: '01',
    title: 'Parcoursup',
    desc: 'Vous êtes lycéen ? Retrouvez notre fiche et tous les critères de sélection.',
    route: '/inscription/parcoursup'
  },
  {
    number: '02',
    title: 'Candidature spontanée',
    desc: 'Transfert, étudiant étranger ou reconversion ? Candidatez directement. Les profils atypiques nous intéressent !',
    route: '/inscription/candidature'
  },
  {
    number: '03',
    title: 'Journée d\'intégration',
    desc: 'Vous voulez découvrir la formation de plus près ? Venez découvrir le campus, rencontrer les étudiants et décvourir le BUT depuis l'intérieur !',
    route: '/inscription/integration'
  }
];

// ── Formatage semestre pour les projets
const formatSemestre = (project) => {
  if (!project.semestre) return project.niveau || '';
  const sem = project.semestre.toUpperCase();
  const semNum = parseInt(sem.replace('S', ''));
  if (semNum >= 4 && project.domaine_activite) {
    return `${sem} | ${project.domaine_activite}`;
  }
  return `${sem} — ${project.niveau || ''}`;
};

const openModal = (project) => {
  selectedProject.value = project;
  document.body.style.overflow = 'hidden';
};
const closeModal = () => {
  selectedProject.value = null;
  document.body.style.overflow = '';
};

const handleScroll = () => { scrollY.value = window.scrollY; };

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Intersection observer pour les animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // Fetch des projets de la vitrine
  try {
    const res = await fetch('/api/vitrine');
    if (res.ok) {
      const data = await res.json();
      featuredProjects.value = data.slice(0, 6);
    } else {
      featuredProjects.value = [];
    }
  } catch {
    featuredProjects.value = [];
  } finally {
    loadingProjects.value = false;
    // Re-déclenche les animations sur les nouvelles cartes
    setTimeout(() => {
      const obs2 = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs2.unobserve(e.target); } });
      }, { threshold: 0 });
      document.querySelectorAll('.project-card:not(.is-visible)').forEach(el => obs2.observe(el));
    }, 30);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});
</script>

<style scoped>
@keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes blob { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,30px) scale(1.08); } }
@keyframes blobSlow { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-20px) scale(1.05); } }

.animate-fade-in { opacity: 0; animation: fadeIn 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-500 { animation-delay: 0.5s; }
.animation-delay-700 { animation-delay: 0.7s; }
.animate-blob { animation: blob 14s infinite alternate ease-in-out; }
.animate-blob-slow { animation: blobSlow 18s infinite alternate ease-in-out; }
.animate-on-scroll { opacity: 0; transform: translateY(36px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  color: #fff; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;
  border-radius: 6px; text-decoration: none; border: none; cursor: pointer;
  transition: box-shadow 0.3s, transform 0.2s;
}
.btn-primary:hover { box-shadow: 0 12px 30px -6px rgba(37,99,235,0.35); transform: translateY(-2px); }

.btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  border: 1px solid #d4d4d4; color: #262626;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;
  border-radius: 6px; text-decoration: none; background: transparent;
  transition: border-color 0.2s, color 0.2s;
}
.dark .btn-secondary { border-color: rgba(255,255,255,0.2); color: #fff; }
.btn-secondary:hover { border-color: #2563eb; color: #2563eb; }

.btn-text { font-size: 13px; font-weight: 700; color: #737373; text-decoration: none; transition: color 0.2s; }
.btn-text:hover { color: #2563eb; }
.dark .btn-text { color: #a8a29e; }
.dark .btn-text:hover { color: #60a5fa; }

.tech-tag {
  padding: 4px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;
  border: 1px solid #e5e5e5; border-radius: 99px; color: #737373; background: #fafafa;
}
.dark .tech-tag { border-color: rgba(255,255,255,0.1); color: #78716c; background: rgba(255,255,255,0.05); }

.project-card { transition: transform 0.3s ease; }
.project-card:hover { transform: translateY(-4px); }

.parcours-card {
  padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;
  background: #fff; transition: border-color 0.3s;
}
.dark .parcours-card { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
.parcours-card:hover { border-color: rgba(37,99,235,0.5); }

.stat-card {
  padding: 24px; border: 1px solid #e5e5e5; border-radius: 16px;
  background: #fff; display: flex; flex-direction: column; justify-content: center;
}
.dark .stat-card { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }

.cta-card {
  display: flex; flex-direction: column; gap: 12px;
  padding: 32px; border: 1px solid #e5e5e5; border-radius: 16px;
  background: #fff; text-decoration: none;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.dark .cta-card { border-color: rgba(255,255,255,0.1); background: #0f0f0f; }
.cta-card:hover { border-color: rgba(37,99,235,0.4); box-shadow: 0 20px 40px -15px rgba(37,99,235,0.1); transform: translateY(-4px); }
.cta-card__number { font-size: 48px; font-weight: 900; color: #f5f5f5; line-height: 1; margin-bottom: 8px; }
.dark .cta-card__number { color: #262626; }
.cta-card__title { font-size: 17px; font-weight: 900; color: #171717; letter-spacing: -0.02em; }
.dark .cta-card__title { color: #fff; }
.cta-card__desc { font-size: 13px; color: #737373; line-height: 1.6; flex-grow: 1; }
.dark .cta-card__desc { color: #78716c; }
.cta-card__arrow { color: #2563eb; font-weight: 700; margin-top: 8px; display: inline-block; transition: transform 0.2s; }
.cta-card:hover .cta-card__arrow { transform: translateX(4px); }

.chip { padding: 4px 12px; font-size: 12px; font-weight: 700; letter-spacing: 0.02em; border-radius: 99px; background: #f5f5f5; color: #525252; }
.dark .chip { background: rgba(255,255,255,0.1); color: #d4d4d4; }
.chip--blue { background: #eff6ff; color: #1d4ed8; }
.dark .chip--blue { background: rgba(37,99,235,0.2); color: #93c5fd; }

.modal-enter-active, .modal-leave-active { transition: all 0.35s cubic-bezier(0.16,1,0.3,1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.97); }
</style>
