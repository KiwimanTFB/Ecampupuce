<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 pt-36 pb-32 transition-colors duration-500">
    <main class="container mx-auto px-6">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-neutral-400 dark:text-stone-600 uppercase tracking-widest mb-16 animate-fade-in" aria-label="Fil d'ariane">
        <router-link to="/" class="hover:text-blue-600 transition-colors">Accueil</router-link>
        <span>/</span>
        <span class="text-neutral-900 dark:text-white font-bold">Journée d'intégration</span>
      </nav>

      <!-- Hero cinématique -->
      <div class="relative mb-32 animate-fade-in">
        <div class="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/5 dark:bg-blue-600/10 rounded-full filter blur-[80px] pointer-events-none"></div>
        <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-6">Bienvenue</p>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[1.02] text-neutral-950 dark:text-white mb-8 max-w-3xl">
          Journée<br /><span class="font-light italic text-neutral-400 dark:text-stone-500">d'intégration.</span>
        </h1>
        <p class="text-neutral-600 dark:text-stone-400 text-lg leading-relaxed max-w-xl">
          Félicitations pour votre admission au BUT MMI ! Cette journée est votre première immersion dans la culture unique du département. Voici tout ce que vous devez savoir.
        </p>
      </div>

      <!-- Compteur / Date clé -->
      <section class="mb-32">
        <div class="date-banner animate-on-scroll">
          <div class="text-center">
            <p class="text-xs uppercase tracking-widest font-bold text-blue-400 mb-3">Prochaine journée d'intégration</p>
            <p class="text-4xl md:text-6xl font-black text-white tracking-tighter">Septembre 2026</p>
            <p class="text-stone-400 text-sm mt-3">Date exacte communiquée à la rentrée</p>
          </div>
        </div>
      </section>

      <!-- Programme de la journée -->
      <section class="mb-32">
        <h2 class="section-heading mb-16 animate-on-scroll">Le programme</h2>
        <div class="flex flex-col gap-3 max-w-3xl">
          <div v-for="(item, i) in programme" :key="i"
               class="programme-item animate-on-scroll"
               :style="`animation-delay: ${i * 60}ms`">
            <div class="programme-item__time">{{ item.time }}</div>
            <div class="programme-item__content">
              <h3 class="programme-item__title">{{ item.title }}</h3>
              <p class="programme-item__desc">{{ item.desc }}</p>
            </div>
            <div v-if="item.highlight" class="programme-item__badge">✨</div>
          </div>
        </div>
      </section>

      <!-- Ce que vous découvrirez -->
      <section class="mb-32">
        <h2 class="section-heading mb-12 animate-on-scroll">Ce que vous découvrirez</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="(item, i) in decouvertes" :key="item.title"
               class="decouverte-card animate-on-scroll"
               :style="`animation-delay: ${i * 70}ms`">
            <span class="text-3xl mb-4 block">{{ item.emoji }}</span>
            <h3 class="font-black text-neutral-900 dark:text-white mb-2 text-sm">{{ item.title }}</h3>
            <p class="text-xs text-neutral-500 dark:text-stone-400 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Ce qu'il faut apporter -->
      <section class="mb-32 animate-on-scroll">
        <div class="max-w-3xl flex flex-col md:flex-row gap-8">
          <div class="checklist-box flex-1">
            <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6">À apporter</h2>
            <ul class="flex flex-col gap-3">
              <li v-for="item in apporter" :key="item" class="flex items-center gap-3 text-sm text-neutral-700 dark:text-stone-300">
                <span class="w-5 h-5 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold shrink-0">✓</span>
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="checklist-box flex-1">
            <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6">À ne pas oublier</h2>
            <ul class="flex flex-col gap-3">
              <li v-for="item in oublier" :key="item" class="flex items-center gap-3 text-sm text-neutral-700 dark:text-stone-300">
                <span class="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">!</span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- CTA final -->
      <section class="animate-on-scroll">
        <div class="cta-final">
          <div>
            <h2 class="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Des questions avant la rentrée ?</h2>
            <p class="text-stone-400 text-sm">Notre équipe est disponible pour vous accompagner.</p>
          </div>
          <router-link to="/campus#contact" class="btn-cta shrink-0">
            Nous contacter →
          </router-link>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const programme = [
  { time: '08h30', title: 'Accueil & Café de bienvenue', desc: "Rendez-vous dans le hall principal de l'IUT. Les tuteurs de promo vous accueillent.", highlight: false },
  { time: '09h00', title: 'Discours de bienvenue', desc: "Allocution du chef de département et présentation officielle de la formation BUT MMI.", highlight: false },
  { time: '09h45', title: 'Visite du campus & des équipements', desc: "Plateau cinéma, labos informatiques (Mac & PC), FabLab, espaces créatifs... Un tour complet.", highlight: true },
  { time: '11h00', title: 'Présentation des outils & de la plateforme', desc: "Découvrez Ecampupuce, votre plateforme de suivi pédagogique, et configurez vos accès.", highlight: false },
  { time: '12h30', title: 'Déjeuner collectif', desc: "Moment convivial avec vos futurs camarades et certains enseignants.", highlight: false },
  { time: '14h00', title: 'Workshop créatif en équipe', desc: "Premier projet collaboratif de 2h pour briser la glace et découvrir les dynamiques de groupe.", highlight: true },
  { time: '16h00', title: 'Q&A & pot de fin de journée', desc: "Questions libres avec l'équipe pédagogique. Échanges informels autour d'un verre.", highlight: false }
];

const decouvertes = [
  { emoji: '👥', title: "Vos futurs camarades", desc: "~30 étudiants avec des profils variés — designers, développeurs, communicants — que vous côtoierez pendant 3 ans." },
  { emoji: '🏫', title: "Les espaces de travail", desc: "Salles machines sur-équipées, studio de tournage, espace coworking, FabLab avec impression 3D." },
  { emoji: '📚', title: "Le contenu des cours", desc: "Programme détaillé semestre par semestre, modalités d'évaluation, SAE et projets professionnalisants." },
  { emoji: '🎓', title: "Le corps enseignant", desc: "Enseignants-chercheurs et intervenants professionnels qui accompagneront votre parcours." },
  { emoji: '💻', title: "La plateforme Ecampupuce", desc: "Votre outil central pour suivre vos SAE, rendre vos projets et consulter vos évaluations." },
  { emoji: '🤝', title: "Les délégués & associations", desc: "Comprenez comment s'organise la vie étudiante et comment vous impliquer dans la promo." }
];

const apporter = [
  "Pièce d'identité (CNI ou Passeport)",
  "Attestation d'inscription validée",
  "Ordinateur portable si vous en possédez un",
  "Carnet de notes ou bloc-notes",
  "De quoi déjeuner (ou monnaie pour la cafétéria)"
];

const oublier = [
  "Votre enthousiasme et votre curiosité",
  "Vos identifiants universitaires (email ENT)",
  "Vos questions pour l'équipe enseignante",
  "Une tenue confortable (journée longue & décontractée)"
];

onMounted(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.07 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
});
</script>

<style scoped>
@keyframes fadeInUp { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { opacity: 0; animation: fadeInUp 1s cubic-bezier(0.16,1,0.3,1) forwards; }
.animate-on-scroll { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
.section-heading { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 900; letter-spacing: -0.03em; color: #171717; }
.dark .section-heading { color: #fff; }

/* Date Banner */
.date-banner {
  position: relative; padding: 48px 24px; border-radius: 16px; text-align: center; overflow: hidden;
  background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1);
}
@media(min-width: 768px) { .date-banner { padding: 80px; } }

/* Programme */
.programme-item {
  display: flex; align-items: flex-start; gap: 20px; padding: 20px; border-radius: 12px;
  border: 1px solid #f5f5f5; background: #fafafa; transition: border-color 0.2s;
}
.dark .programme-item { border-color: rgba(255,255,255,0.05); background: #0f0f0f; }
.programme-item:hover { border-color: rgba(37,99,235,0.3); }

.programme-item__time { font-weight: 900; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #2563eb; width: 56px; flex-shrink: 0; padding-top: 2px; }
.dark .programme-item__time { color: #60a5fa; }
.programme-item__title { font-weight: 900; font-size: 13px; color: #171717; margin-bottom: 4px; }
.dark .programme-item__title { color: #fff; }
.programme-item__desc { font-size: 11px; color: #737373; line-height: 1.6; }
.dark .programme-item__desc { color: #78716c; }
.programme-item__badge { font-size: 20px; flex-shrink: 0; }

/* Découvertes */
.decouverte-card {
  padding: 24px; border-radius: 16px; border: 1px solid #e5e5e5; background: #fff;
  transition: all 0.3s;
}
.dark .decouverte-card { border-color: rgba(255,255,255,0.1); background: #0f0f0f; }
.decouverte-card:hover { border-color: rgba(37,99,235,0.4); transform: translateY(-2px); }

/* Checklists */
.checklist-box {
  padding: 28px; border-radius: 16px; border: 1px solid #e5e5e5; background: #fafafa;
}
.dark .checklist-box { border-color: rgba(255,255,255,0.1); background: #0f0f0f; }

/* CTA Final */
.cta-final {
  display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between;
  gap: 32px; padding: 40px; border-radius: 16px;
  background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1);
}
@media(min-width: 768px) { .cta-final { flex-direction: row; align-items: center; padding: 56px; } }
.btn-cta {
  display: inline-block; padding: 16px 32px; background: #fff; color: #171717;
  font-size: 13px; font-weight: 900; border-radius: 6px; cursor: pointer;
  text-decoration: none; transition: all 0.3s;
}
.btn-cta:hover { background: #eff6ff; transform: translateY(-2px); }
</style>
