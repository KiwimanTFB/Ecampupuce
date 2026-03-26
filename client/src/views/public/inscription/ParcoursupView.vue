<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 pt-36 pb-32 transition-colors duration-500">
    <main class="container mx-auto px-6">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest mb-16 animate-fade-in" aria-label="Fil d'ariane">
        <router-link to="/" class="hover:text-blue-600 transition-colors">Accueil</router-link>
        <span class="opacity-40">/</span>
        <span class="text-neutral-900 dark:text-white font-bold">Parcoursup</span>
      </nav>

      <!-- ── Hero ── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-28">
        <div class="animate-fade-in">
          <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-6">Candidature</p>
          <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[1.0] text-neutral-950 dark:text-white mb-8">
            Parcoursup<span class="text-blue-600">.</span>
          </h1>
          <p class="text-neutral-600 dark:text-stone-400 text-base leading-relaxed max-w-md">
            Vous souhaitez intégrer le département MMI de l'IUT Paris-Saclay via Parcoursup ? Voici toutes les informations pour préparer votre candidature.
          </p>
        </div>

        <!-- Fiche rapide -->
        <div class="info-card animate-fade-in animation-delay-300">
          <p class="text-[10px] uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400 mb-5">Fiche formation</p>
          <div>
            <div v-for="item in FICHE_RAPIDE" :key="item.label" class="info-row">
              <span class="info-row__label">{{ item.label }}</span>
              <span class="info-row__value">{{ item.value }}</span>
            </div>
          </div>
          <a href="https://www.parcoursup.fr" target="_blank" rel="noopener noreferrer"
             class="cta-btn mt-6 block text-center" aria-label="Accéder à Parcoursup (nouvelle fenêtre)">
            Accéder à Parcoursup ↗
          </a>
        </div>
      </div>

      <!-- ── Calendrier ── -->
      <section class="mb-28 animate-on-scroll">
        <h2 class="section-h mb-14">Calendrier <span class="text-neutral-300 dark:text-stone-700">2026</span></h2>
        <div class="flex flex-col max-w-2xl">
          <div
            v-for="(step, i) in CALENDRIER"
            :key="i"
            class="timeline-item animate-on-scroll"
            :style="`animation-delay:${i * 70}ms`"
          >
            <div class="timeline-item__dot" :class="step.active ? 'tl-dot--active' : ''"></div>
            <div class="timeline-item__body">
              <p class="tl-date">{{ step.date }}</p>
              <h3 class="tl-title">{{ step.title }}</h3>
              <p class="tl-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Critères de sélection — Layout éditorial ── -->
      <section class="mb-28 animate-on-scroll">
        <h2 class="section-h mb-14">Critères de sélection</h2>

        <!-- Liste éditoriale : ligne fine + numéro + texte -->
        <div class="max-w-3xl">
          <div
            v-for="(critere, i) in CRITERES"
            :key="critere.title"
            class="critere-item animate-on-scroll"
            :style="`animation-delay:${i * 70}ms`"
          >
            <!-- Poids badge -->
            <div class="critere-item__left">
              <span class="critere-poids" :class="critere.poidsClass">{{ critere.poids }}</span>
            </div>
            <!-- Contenu -->
            <div class="critere-item__content">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xl">{{ critere.emoji }}</span>
                <h3 class="critere-item__title">{{ critere.title }}</h3>
              </div>
              <p class="critere-item__desc">{{ critere.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── FAQ avec "Voir plus" ── -->
      <section class="animate-on-scroll">
        <div class="flex items-end justify-between gap-4 mb-10">
          <h2 class="section-h">Questions fréquentes</h2>
          <span class="text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest font-bold">
            {{ showAllFaqs ? FAQS.length : FAQ_VISIBLE_COUNT }} / {{ FAQS.length }}
          </span>
        </div>

        <!-- FAQs visibles par défaut -->
        <div class="flex flex-col max-w-3xl">
          <details
            v-for="(faq, i) in visibleFaqs"
            :key="faq.q"
            class="faq-item animate-on-scroll"
            :style="`animation-delay:${i * 50}ms`"
          >
            <summary class="faq-q">
              <span>{{ faq.q }}</span>
              <span class="faq-arrow" aria-hidden="true">+</span>
            </summary>
            <p class="faq-a">{{ faq.a }}</p>
          </details>
        </div>

        <!-- FAQs supplémentaires avec transition -->
        <transition name="faq-expand">
          <div v-if="showAllFaqs" class="flex flex-col max-w-3xl mt-0">
            <details
              v-for="(faq, i) in hiddenFaqs"
              :key="faq.q"
              class="faq-item animate-on-scroll is-visible"
            >
              <summary class="faq-q">
                <span>{{ faq.q }}</span>
                <span class="faq-arrow" aria-hidden="true">+</span>
              </summary>
              <p class="faq-a">{{ faq.a }}</p>
            </details>
          </div>
        </transition>

        <!-- Bouton Voir plus / moins -->
        <button
          v-if="FAQS.length > FAQ_VISIBLE_COUNT"
          @click="showAllFaqs = !showAllFaqs"
          class="voir-plus-btn mt-8 animate-on-scroll is-visible"
        >
          <span>{{ showAllFaqs ? 'Réduire' : `Voir ${FAQS.length - FAQ_VISIBLE_COUNT} question${FAQS.length - FAQ_VISIBLE_COUNT > 1 ? 's' : ''} de plus` }}</span>
          <span class="voir-plus-icon" :class="showAllFaqs ? 'rotate-180' : ''">↓</span>
        </button>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// ══════════════════════════════════════════════════════════════
//  DONNÉES — toutes éditables ici
// ══════════════════════════════════════════════════════════════

const FICHE_RAPIDE = [
  { label: 'Formation',             value: 'BUT MMI — Vélizy' },
  { label: 'Durée',                  value: '3 ans (6 semestres)' },
  { label: 'Capacité',              value: '~30 places / promo' },
  { label: 'Sélectivité',           value: 'Formation sélective' },
  { label: 'Alternance',            value: 'Oui (dès S4)' },
  { label: 'Mobilité int.',         value: 'Erasmus disponible' }
];

const CALENDRIER = [
  {
    date: 'Janv. — Fév. 2026',
    title: 'Inscription sur Parcoursup',
    desc: 'Créez votre compte et ajoutez le BUT MMI Vélizy à vos vœux.',
    active: false
  },
  {
    date: 'Fév. — Avr. 2026',
    title: 'Constitution du dossier',
    desc: 'CV, lettre de motivation, bulletins de notes et portfolio numérique (recommandé).',
    active: true
  },
  {
    date: '27 Mars 2026',
    title: 'Clôture des candidatures',
    desc: 'Date limite. Après cette date, aucune modification du dossier n\'est possible.',
    active: false
  },
  {
    date: 'Avr. — Mai 2026',
    title: 'Analyse par le jury',
    desc: 'Le département étudie les dossiers selon les critères publiés sur Parcoursup.',
    active: false
  },
  {
    date: 'Juin — Juil. 2026',
    title: 'Résultats & réponses',
    desc: 'Décisions communiquées. Répondez dans les délais. Phase complémentaire en juillet.',
    active: false
  }
];

// Critères avec poidsClass pour colorer le badge différemment
const CRITERES = [
  {
    emoji: '📊',
    title: 'Notes scolaires',
    poids: 'Prioritaire',
    poidsClass: 'poids--red',
    desc: 'Bulletins de 1ʳᵉ et Terminale. Attention particulière aux matières analytiques et créatives.'
  },
  {
    emoji: '✍️',
    title: 'Lettre de motivation',
    poids: 'Important',
    poidsClass: 'poids--blue',
    desc: 'Cohérence de votre projet professionnel, intérêt pour le numérique et la créativité.'
  },
  {
    emoji: '🎨',
    title: 'Portfolio / Projets perso',
    poids: 'Valorisé',
    poidsClass: 'poids--green',
    desc: 'Tout projet personnel (site web, montage vidéo, design, photo) est un réel atout.'
  },
  {
    emoji: '📋',
    title: 'Profil & Bac',
    poids: 'Indicatif',
    poidsClass: 'poids--gray',
    desc: 'Bac général ou techno. NSI, Arts, SES, LLCE appréciés. Maths non obligatoires.'
  }
];

// FAQ — les FAQ_VISIBLE_COUNT premières sont affichées, les autres cachées derrière "Voir plus"
const FAQ_VISIBLE_COUNT = 4;

const FAQS = [
  {
    q: 'Faut-il obligatoirement un portfolio ?',
    a: "Non, il n'est pas obligatoire. Mais si vous avez des projets numériques — même personnels — il est fortement conseillé de les présenter. Ils témoignent de votre curiosité réelle pour le domaine."
  },
  {
    q: 'Quelle spécialité de Terminale est recommandée ?',
    a: "NSI est un très bon atout mais pas obligatoire. Arts, LLCE, SES, Humanités sont également bien vus selon le parcours visé."
  },
  {
    q: 'Puis-je intégrer le BUT MMI avec un Bac techno ?',
    a: "Oui. Les Bac STD2A, STI2D, STMG sont acceptés. Des dispositifs d'accompagnement peuvent être proposés."
  },
  {
    q: 'Y a-t-il des journées Portes Ouvertes ?',
    a: "Oui. Consultez le site de l'IUT Paris-Saclay pour les dates. Vous pouvez aussi assister à notre Journée d'intégration si vous êtes admis."
  },
  {
    q: 'Peut-on faire le BUT MMI en alternance ?',
    a: "L'alternance est disponible à partir de la 2ᵉ année (S4). Elle permet de concilier formation et expérience professionnelle rémunérée en entreprise."
  },
  {
    q: 'Quelles sont les débouchés des diplômés ?',
    a: "Développeur front-end, Designer UI/UX, Directeur Artistique, Motion Designer, Chef de projet digital, Consultant SEO/SEA, Community Manager senior…"
  },
  {
    q: 'Le BUT MMI prépare-t-il à la création d\'entreprise ?',
    a: "Oui. De nombreux anciens ont créé leur agence ou startup. Le programme inclut des modules d'entrepreneuriat et de gestion de projet."
  }
];

// ══════════════════════════════════════════════════════════════
//  STATE & COMPUTED
// ══════════════════════════════════════════════════════════════
const showAllFaqs = ref(false);
const visibleFaqs = computed(() => FAQS.slice(0, FAQ_VISIBLE_COUNT));
const hiddenFaqs = computed(() => FAQS.slice(FAQ_VISIBLE_COUNT));

// ══════════════════════════════════════════════════════════════
//  ANIMATIONS
// ══════════════════════════════════════════════════════════════
onMounted(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.05 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
});
</script>

<style scoped>
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { opacity: 0; animation: fadeInUp 1s cubic-bezier(0.16,1,0.3,1) forwards; }
.animation-delay-300 { animation-delay: 0.3s; }
.animate-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

.section-h { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 900; letter-spacing: -0.03em; color: #171717; }
.dark .section-h { color: #fff; }

/* ── Info Card ── */
.info-card { border: 1px solid #ebebeb; border-radius: 14px; background: #fafafa; padding: 24px; }
.dark .info-card { border-color: rgba(255,255,255,0.08); background: #0f0f0f; }
.info-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f0f0f0; }
.dark .info-row { border-bottom-color: rgba(255,255,255,0.05); }
.info-row:last-child { border-bottom: none; }
.info-row__label { font-size: 10px; color: #a3a3a3; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
.dark .info-row__label { color: #57534e; }
.info-row__value { font-size: 13px; font-weight: 700; color: #171717; }
.dark .info-row__value { color: #f0f0f0; }

.cta-btn {
  display: block; text-align: center; padding: 12px 24px; margin-top: 20px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  background: #171717; color: #fff; border-radius: 5px; text-decoration: none;
  transition: background 0.2s, transform 0.2s;
}
.dark .cta-btn { background: #fff; color: #171717; }
.cta-btn:hover { background: #2563eb; transform: translateY(-1px); }
.dark .cta-btn:hover { background: #2563eb; color: #fff; }

/* ── Timeline ── */
.timeline-item {
  display: flex; gap: 20px; padding: 20px 0;
  border-bottom: 1px solid #f5f5f5;
}
.dark .timeline-item { border-bottom-color: rgba(255,255,255,0.05); }

.timeline-item__dot {
  width: 8px; height: 8px; border-radius: 50%; background: #d4d4d4;
  flex-shrink: 0; margin-top: 6px;
}
.dark .timeline-item__dot { background: #404040; }
.tl-dot--active { background: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.2); }

.timeline-item__body { flex: 1; }
.tl-date { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #2563eb; font-weight: 700; margin-bottom: 4px; }
.dark .tl-date { color: #60a5fa; }
.tl-title { font-size: 15px; font-weight: 900; color: #171717; margin-bottom: 4px; letter-spacing: -0.01em; }
.dark .tl-title { color: #f0f0f0; }
.tl-desc { font-size: 12px; color: #737373; line-height: 1.6; }
.dark .tl-desc { color: #57534e; }

/* ── Critères — layout éditorial ── */
.critere-item {
  display: flex; align-items: flex-start; gap: 20px;
  padding: 22px 0; border-bottom: 1px solid #f5f5f5;
}
.dark .critere-item { border-bottom-color: rgba(255,255,255,0.05); }
.critere-item:last-child { border-bottom: none; }

.critere-item__left { min-width: 90px; flex-shrink: 0; padding-top: 3px; }
.critere-poids {
  display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; padding: 3px 8px; border-radius: 99px;
}
.poids--red { background: #fff1f2; color: #e11d48; }
.dark .poids--red { background: rgba(225,29,72,0.12); color: #fb7185; }
.poids--blue { background: #eff6ff; color: #1d4ed8; }
.dark .poids--blue { background: rgba(37,99,235,0.12); color: #60a5fa; }
.poids--green { background: #f0fdf4; color: #16a34a; }
.dark .poids--green { background: rgba(22,163,74,0.12); color: #4ade80; }
.poids--gray { background: #f5f5f5; color: #737373; }
.dark .poids--gray { background: rgba(255,255,255,0.06); color: #78716c; }

.critere-item__content { flex: 1; }
.critere-item__title { font-size: 15px; font-weight: 900; letter-spacing: -0.01em; color: #171717; }
.dark .critere-item__title { color: #f0f0f0; }
.critere-item__desc { font-size: 12px; color: #737373; line-height: 1.65; margin-top: 4px; }
.dark .critere-item__desc { color: #57534e; }

/* ── FAQ ── */
.faq-item {
  border-bottom: 1px solid #f0f0f0;
  overflow: hidden;
}
.dark .faq-item { border-bottom-color: rgba(255,255,255,0.05); }

.faq-q {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  padding: 18px 0; cursor: pointer; list-style: none;
  font-size: 14px; font-weight: 700; color: #171717; user-select: none;
  transition: color 0.15s;
}
.dark .faq-q { color: #f0f0f0; }
.faq-q:hover { color: #2563eb; }
.dark .faq-q:hover { color: #60a5fa; }
.faq-q::-webkit-details-marker { display: none; }

.faq-arrow {
  font-size: 18px; color: #d4d4d4; flex-shrink: 0; line-height: 1; transition: transform 0.25s;
  font-weight: 300;
}
.dark .faq-arrow { color: #404040; }
details[open] .faq-arrow { transform: rotate(45deg); color: #a3a3a3; }

.faq-a { padding: 0 0 16px; font-size: 13px; color: #737373; line-height: 1.7; }
.dark .faq-a { color: #57534e; }

/* ── Bouton Voir plus ── */
.voir-plus-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  border: 1px solid #e5e5e5; border-radius: 99px; color: #737373; background: transparent;
  cursor: pointer; transition: all 0.2s;
}
.dark .voir-plus-btn { border-color: rgba(255,255,255,0.12); color: #78716c; }
.voir-plus-btn:hover { border-color: #2563eb; color: #2563eb; }
.dark .voir-plus-btn:hover { border-color: #3b82f6; color: #60a5fa; }

.voir-plus-icon { display: inline-block; transition: transform 0.3s; }
.voir-plus-icon.rotate-180 { transform: rotate(180deg); }

/* ── Transitions FAQ expand ── */
.faq-expand-enter-active { animation: expandDown 0.35s cubic-bezier(0.16,1,0.3,1); }
.faq-expand-leave-active { animation: expandDown 0.25s cubic-bezier(0.16,1,0.3,1) reverse; }
@keyframes expandDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>
