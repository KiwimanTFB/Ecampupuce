<template>
  <div class="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 transition-colors duration-500">
    <main class="pt-40 pb-32">

      <!-- ── Hero Manifeste ── -->
      <section class="container mx-auto px-6 mb-28">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div class="animate-fade-in">
            <p class="text-neutral-500 dark:text-stone-500 tracking-[0.3em] uppercase text-xs mb-8 font-bold">Manifeste</p>
            <h1 class="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-none tracking-tighter text-neutral-950 dark:text-white">
              Le Studio<br /><span class="font-light italic text-neutral-400 dark:text-stone-500">MMI.</span>
            </h1>
          </div>
          <div class="lg:pt-20 animate-fade-in animation-delay-200">
            <p class="text-neutral-600 dark:text-stone-400 text-lg leading-relaxed mb-8 max-w-md font-light">
              Nous formons l'élite de la création numérique. Des profils hybrides capables de concevoir, développer et promouvoir des expériences web hors du commun.
            </p>
            <div class="h-px w-full bg-neutral-200 dark:bg-white/10 mb-8"></div>
            <div class="flex flex-wrap gap-10 text-xs uppercase tracking-[0.15em] text-neutral-500 dark:text-stone-500">
              <div class="flex flex-col gap-2">
                <span class="text-neutral-900 dark:text-white font-bold">Programme</span>
                <span>3 Ans Intensifs</span>
              </div>
              <div class="flex flex-col gap-2">
                <span class="text-neutral-900 dark:text-white font-bold">Format</span>
                <span>Présentiel · Alternance</span>
              </div>
              <div class="flex flex-col gap-2">
                <span class="text-neutral-900 dark:text-white font-bold">Campus</span>
                <span>Vélizy-Villacoublay</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Image break ── -->
      <section class="w-full mb-28 relative group overflow-hidden animate-on-scroll" style="height:55vh;">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop"
             class="w-full h-full object-cover filter grayscale-[20%] contrast-110 group-hover:scale-105 transition-transform duration-[2.5s] ease-out"
             alt="Studio MMI Vélizy" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div class="absolute bottom-8 left-6 right-6 flex justify-between items-end">
          <p class="text-white text-[10px] uppercase tracking-widest font-bold opacity-70">MMI Vélizy — IUT Paris-Saclay</p>
          <p class="text-white text-[10px] uppercase tracking-widest font-bold opacity-70">Depuis 2003</p>
        </div>
      </section>

      <!-- ── Expertises — layout chiffres romains ── -->
      <section class="container mx-auto px-6 mb-36">
        <h2 class="text-3xl font-black tracking-tighter mb-16 animate-on-scroll text-neutral-950 dark:text-white">L'Expertise.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 border-t border-neutral-200 dark:border-white/10">
          <article
            v-for="(exp, i) in EXPERTISES" :key="exp.title"
            class="py-12 animate-on-scroll group border-b md:border-b-0"
            :class="i < 2 ? 'md:border-r border-neutral-200 dark:border-white/10 md:pr-12' : ''"
            :style="`animation-delay:${i * 150}ms`"
          >
            <span class="font-serif text-4xl mb-8 block italic text-neutral-200 dark:text-stone-800 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-500">{{ exp.roman }}</span>
            <h3 class="text-xs uppercase tracking-[0.2em] font-bold text-neutral-900 dark:text-white mb-4">{{ exp.title }}</h3>
            <p class="text-neutral-500 dark:text-stone-400 leading-relaxed text-sm">{{ exp.desc }}</p>
          </article>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════
           SECTION ÉQUIPE — 4 colonnes desktop, 2 tablette, 1 mobile
           ▶ Pour ajouter/retirer un membre : modifier TEAM_MEMBERS
      ═══════════════════════════════════════════════════════ -->
      <section class="container mx-auto px-6 mb-36" id="equipe">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 animate-on-scroll">
          <div>
            <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-4">Intervenants</p>
            <h2 class="text-3xl md:text-4xl font-black tracking-tighter text-neutral-950 dark:text-white">Notre Équipe.</h2>
          </div>
          <p class="text-neutral-500 dark:text-stone-500 text-sm max-w-xs leading-relaxed">
            Enseignants-chercheurs et professionnels du numérique qui transmettent leur expertise terrain.
          </p>
        </div>

        <!-- Grille 4 colonnes desktop -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <article
            v-for="(member, i) in TEAM_MEMBERS"
            :key="member.nom"
            class="team-card animate-on-scroll group"
            :style="`animation-delay:${i * 60}ms`"
          >
            <!-- Photo -->
            <div class="team-card__photo">
              <img
                :src="member.photo || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(member.prenom + ' ' + member.nom)}&backgroundColor=2563eb,7c3aed,1d4ed8&backgroundType=gradientLinear&fontFamily=Inter&fontWeight=700&fontSize=38&textColor=ffffff`"
                :alt="`Photo de ${member.prenom} ${member.nom}`"
                class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
            </div>
            <!-- Corps -->
            <div class="team-card__body">
              <h3 class="team-card__name">{{ member.prenom }} {{ member.nom }}</h3>
              <p class="team-card__role">{{ member.role }}</p>
              <p v-if="member.specialite" class="team-card__spec">{{ member.specialite }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════
           SECTION "ET APRÈS ?" — Layout éditorial pur
           Remplace les "double box" par une liste numérotée
           avec ligne fine et whitespace généreux
      ═══════════════════════════════════════════════════════ -->
      <section id="apres" class="border-t border-neutral-100 dark:border-white/5 py-28">
        <div class="container mx-auto px-6">

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            <!-- Titre collé à gauche -->
            <div class="lg:col-span-4 animate-on-scroll lg:sticky lg:top-32">
              <p class="text-neutral-400 dark:text-stone-600 tracking-[0.3em] uppercase text-xs font-bold mb-6">Débouchés</p>
              <h2 class="text-3xl md:text-4xl font-black tracking-tighter text-neutral-950 dark:text-white leading-tight mb-8">
                Et après<br />le BUT ?
              </h2>
              <p class="text-neutral-500 dark:text-stone-500 text-sm leading-relaxed">
                Le BUT MMI ouvre des perspectives larges dans les métiers du numérique, de la communication et du design.
              </p>
            </div>

            <!-- Liste éditoriale avec grands numéros -->
            <div class="lg:col-span-8">
              <div
                v-for="(path, i) in AFTER_BUT"
                :key="path.title"
                class="after-item animate-on-scroll"
                :style="`animation-delay:${i * 80}ms`"
              >
                <span class="after-item__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="after-item__content">
                  <h3 class="after-item__title">{{ path.title }}</h3>
                  <p class="after-item__desc">{{ path.desc }}</p>
                </div>
                <span class="after-item__arrow">→</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ── Témoignages ── -->
      <section class="py-28 bg-neutral-950 dark:bg-[#030303] border-t border-white/5">
        <div class="container mx-auto px-6">
          <p class="text-center text-[10px] text-stone-600 uppercase tracking-widest font-bold mb-16 animate-on-scroll">Ce qu'ils en disent</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 max-w-4xl mx-auto">
            <article v-for="(testi, i) in TESTIMONIALS" :key="i" class="animate-on-scroll" :style="`animation-delay:${i * 200}ms`">
              <p class="font-serif text-xl md:text-2xl font-light text-white leading-relaxed mb-8 italic opacity-90">
                "{{ testi.quote }}"
              </p>
              <div class="flex items-center gap-4">
                <img :src="testi.photo" :alt="testi.name" class="w-10 h-10 rounded-full object-cover filter grayscale" />
                <div>
                  <p class="text-xs text-white font-black uppercase tracking-wide">{{ testi.name }}</p>
                  <p class="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">{{ testi.role }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// ══════════════════════════════════════════════════════════════
//  ÉQUIPE — DATA-DRIVEN
//  ▶ Ajouter un membre : créer un nouvel objet dans ce tableau
//  ▶ Retirer un membre : supprimer l'objet correspondant
//  ▶ Champs requis   : prenom, nom, role
//  ▶ Champs optionnels: specialite, photo (URL)
//     → Si photo est null/absent : avatar DiceBear auto-généré
// ══════════════════════════════════════════════════════════════
const TEAM_MEMBERS = [
  {
    prenom: 'Marie',
    nom: 'Lefebvre',
    role: 'Responsable du département',
    specialite: 'UX Design & Ergonomie Web',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&fit=crop'
  },
  {
    prenom: 'Thomas',
    nom: 'Bernard',
    role: 'Enseignant-chercheur',
    specialite: 'Développement Web & Architecture',
    photo: 'https://images.unsplash.com/photo-1502767089025-6572583495b9?q=80&w=400&h=400&fit=crop'
  },
  {
    prenom: 'Julie',
    nom: 'Moreau',
    role: 'Enseignante',
    specialite: 'Motion Design & After Effects',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&h=400&fit=crop'
  },
  {
    prenom: 'Pierre',
    nom: 'Dubois',
    role: 'Intervenant pro',
    specialite: 'Stratégie de Communication',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&h=400&fit=crop'
  },
  {
    prenom: 'Sophie',
    nom: 'Martin',
    role: 'Enseignante',
    specialite: 'Infographie & Direction Artistique',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&h=400&fit=crop'
  },
  {
    prenom: 'Lucas',
    nom: 'Petit',
    role: 'Intervenant pro',
    specialite: '3D, Jeux Vidéo & Unreal Engine',
    photo: null
  },
  {
    prenom: 'Amélie',
    nom: 'Gauthier',
    role: 'Enseignante',
    specialite: 'Photographie & Retouche',
    photo: null
  },
  {
    prenom: 'Romain',
    nom: 'Girard',
    role: 'Enseignant-chercheur',
    specialite: 'Réseaux Sociaux & Stratégie Digitale',
    photo: null
  }
];

// ══════════════════════════════════════════════════════════════
//  EXPERTISES (section 3 colonnes romaines)
// ══════════════════════════════════════════════════════════════
const EXPERTISES = [
  {
    roman: 'I.',
    title: 'Design System & UI/UX',
    desc: "Création d'interfaces utilisateur élégantes centrées sur l'accessibilité. Grilles, typographie et microanimations."
  },
  {
    roman: 'II.',
    title: 'Creative Coding',
    desc: "Développement front-end avancé. Animation, WebGL et optimisation des performances pour un rendu pur et fluide."
  },
  {
    roman: 'III.',
    title: 'Direction Artistique',
    desc: "Identité de marque, motion design et production de contenus visuels. Du concept à la mise en ligne."
  }
];

// ══════════════════════════════════════════════════════════════
//  APRÈS LE BUT — liste éditoriale numérotée
//  ▶ Modifier title et desc pour mettre à jour le contenu
// ══════════════════════════════════════════════════════════════
const AFTER_BUT = [
  {
    title: 'Master & Licence Pro',
    desc: 'Poursuites en Licence Design, Master MIAGE, Master Communication numérique, Master Game Design, MSc Marketing digital…'
  },
  {
    title: 'Marchés du travail',
    desc: 'Développeur front-end, Designer UI/UX, Directeur Artistique, Motion Designer, Chef de projet digital, Consultant SEO/SEA…'
  },
  {
    title: 'Mobilité internationale',
    desc: "Programmes d'échanges Erasmus, double-diplômes européens et stages à l'international avec accompagnement de l'IUT."
  },
  {
    title: 'Entrepreneuriat',
    desc: "De nombreux anciens ont fondé leur agence, studio de création ou startup numérique dès la sortie de la formation."
  }
];

// ══════════════════════════════════════════════════════════════
//  TÉMOIGNAGES
// ══════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  {
    quote: "L'hybridation des compétences m'a permis de pousser des concepts visuels que je peux moi-même coder et optimiser.",
    name: 'Sophie L.',
    role: 'Creative Developer · Promo 2023',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop'
  },
  {
    quote: "On ne forge pas seulement des compétences — on forge une exigence esthétique permanente.",
    name: 'Thomas M.',
    role: 'Art Director · Promo 2024',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&fit=crop'
  }
];

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
@keyframes fadeInUp { from { opacity: 0; transform: translateY(36px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { opacity: 0; animation: fadeInUp 1.1s cubic-bezier(0.16,1,0.3,1) forwards; }
.animation-delay-200 { animation-delay: 0.2s; }
.animate-on-scroll { opacity: 0; transform: translateY(28px); transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1); }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

/* ── Team Cards — 4 colonnes ── */
.team-card {
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: 12px; border: 1px solid #ebebeb; background: #fff;
  transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
}
.dark .team-card { border-color: rgba(255,255,255,0.08); background: #0f0f0f; }
.team-card:hover { border-color: rgba(37,99,235,0.35); transform: translateY(-4px); box-shadow: 0 16px 40px -12px rgba(37,99,235,0.12); }
.dark .team-card:hover { border-color: rgba(37,99,235,0.3); }

.team-card__photo { width: 100%; aspect-ratio: 1/1; overflow: hidden; background: #f5f5f5; flex-shrink: 0; }
.dark .team-card__photo { background: #111; }

.team-card__body { padding: 16px 18px 20px; display: flex; flex-direction: column; gap: 3px; }
.team-card__name { font-size: 14px; font-weight: 900; letter-spacing: -0.01em; color: #171717; line-height: 1.2; }
.dark .team-card__name { color: #f0f0f0; }
.team-card__role { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563eb; margin-top: 2px; }
.dark .team-card__role { color: #3b82f6; }
.team-card__spec { font-size: 11px; color: #a3a3a3; margin-top: 4px; line-height: 1.4; }
.dark .team-card__spec { color: #57534e; }

/* ── After BUT — List éditoriale ── */
.after-item {
  display: flex; align-items: flex-start; gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s;
}
.dark .after-item { border-bottom-color: rgba(255,255,255,0.06); }
.after-item:last-child { border-bottom: none; }
.after-item:hover .after-item__num { color: #2563eb; }
.dark .after-item:hover .after-item__num { color: #60a5fa; }

.after-item__num {
  font-size: 11px; font-weight: 900; color: #d4d4d4; letter-spacing: 0.05em;
  min-width: 28px; padding-top: 4px; flex-shrink: 0;
  transition: color 0.2s;
}
.dark .after-item__num { color: #404040; }

.after-item__content { flex: 1; }
.after-item__title { font-size: 17px; font-weight: 900; letter-spacing: -0.02em; color: #171717; margin-bottom: 6px; }
.dark .after-item__title { color: #f0f0f0; }
.after-item__desc { font-size: 13px; color: #737373; line-height: 1.65; }
.dark .after-item__desc { color: #57534e; }

.after-item__arrow {
  font-size: 18px; color: #d4d4d4; flex-shrink: 0; padding-top: 2px;
  transition: color 0.2s, transform 0.2s;
}
.dark .after-item__arrow { color: #262626; }
.after-item:hover .after-item__arrow { color: #2563eb; transform: translateX(4px); }
.dark .after-item:hover .after-item__arrow { color: #60a5fa; }
</style>
