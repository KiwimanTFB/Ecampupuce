<template>
  <div class="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 transition-colors duration-500">
    <main class="pt-40 pb-32">

      <!-- ── Hero Manifeste ── -->
      <section class="container mx-auto px-6 mb-28">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div class="animate-fade-in">
            <p class="text-neutral-500 dark:text-stone-500 tracking-[0.3em] uppercase text-xs mb-8 font-bold">En savoir plus sur</p>
            <h1 class="text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-none tracking-tighter text-neutral-950 dark:text-white">
              LE BUT<br /><span class="font-light italic text-neutral-400 dark:text-stone-500">À VÉLIZY.</span>
            </h1>
          </div>
          <div class="lg:pt-20 animate-fade-in animation-delay-200">
            <p class="text-neutral-600 dark:text-stone-400 text-lg leading-relaxed mb-8 max-w-md font-light">
              C’est un diplôme en trois ans, qui forme des professionnel.les du multimédia.
            </p>
            <div class="h-px w-full bg-neutral-200 dark:bg-white/10 mb-8"></div>
            <div class="flex flex-wrap gap-10 text-xs uppercase tracking-[0.15em] text-neutral-500 dark:text-stone-500">
              <div class="flex flex-col gap-2">
                <span class="text-neutral-900 dark:text-white font-bold">Programme</span>
                <span>3 Ans</span>
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
        <img src="https://imgs.search.brave.com/TtftU6zs9lmoVW44ITTILDaRjlwYjfrx-kLEf8_OWS8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bW1pLXZlbGl6eS5m/ci93cC1jb250ZW50/L3VwbG9hZHMvMjAy/My8wMS9CVVQtTU1J/LVZlbGl6eS0wOC0x/MDI0eDY4My5qcGc"
             class="w-full h-full object-cover filter grayscale-[20%] contrast-110 group-hover:scale-105 transition-transform duration-[2.5s] ease-out"
             alt="Studio MMI Vélizy" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        <div class="absolute bottom-8 left-6 right-6 flex justify-between items-end">
          <p class="text-white text-[10px] uppercase tracking-widest font-bold opacity-70">MMI Vélizy — IUT Paris-Saclay</p>
          <p class="text-white text-[10px] uppercase tracking-widest font-bold opacity-70">10-12 avenue de l'Europe</p>
        </div>
      </section>

      <!-- ── Expertises — layout chiffres romains ── -->
      <section class="container mx-auto px-6 mb-36">
        <h2 class="text-3xl font-black tracking-tighter mb-16 animate-on-scroll text-neutral-950 dark:text-white">C'est quoi MMI?</h2>
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
            <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-4">Enseignants</p>
            <h2 class="text-3xl md:text-4xl font-black tracking-tighter text-neutral-950 dark:text-white">Notre Équipe.</h2>
          </div>
          <p class="text-neutral-500 dark:text-stone-500 text-sm max-w-xs leading-relaxed">
            Nos enseignants pédagogiques sont des professionnel·le·s en activité, des chercheur·euse·s et des enseignant·e·s-chercheur·euse·s.
          </p>
        </div>

        <!-- Grille 4 colonnes desktop -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <article
            v-for="(member, i) in TEAM_DATA"
            :key="member.email || member.nom"
            class="team-card animate-on-scroll"
            :style="`animation-delay:${i * 55}ms`"
          >
            <!-- Photo ratio 1:1 strict -->
            <div class="team-card__photo">
              <img
                :src="member.photo || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(member.prenom + ' ' + member.nom)}&backgroundColor=2563eb,7c3aed,1d4ed8&backgroundType=gradientLinear&fontWeight=700&fontSize=38&textColor=ffffff`"
                :alt="`Photo de ${member.prenom} ${member.nom}`"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <!-- Infos -->
            <div class="team-card__body">
              <h3 class="team-card__name">{{ member.prenom }} {{ member.nom }}</h3>
              <p class="team-card__role">{{ member.role }}</p>
              <a
                v-if="member.email"
                :href="`mailto:${member.email}`"
                class="team-card__email"
                :aria-label="`Envoyer un email à ${member.prenom} ${member.nom}`"
              >{{ member.email }}</a>
            </div>
          </article>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════
           SECTION CRITÈRES D'ADMISSION — Layout magazine
      ═══════════════════════════════════════════════════════ -->
      <section id="criteres" class="border-t border-neutral-100 dark:border-white/5 py-28">
        <div class="container mx-auto px-6">

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            <div class="lg:col-span-4 animate-on-scroll lg:sticky lg:top-32">
              <p class="text-neutral-400 dark:text-stone-600 tracking-[0.3em] uppercase text-xs font-bold mb-6">Sélection</p>
              <h2 class="text-3xl md:text-4xl font-black tracking-tighter text-neutral-950 dark:text-white leading-tight mb-8">
                Critères<br />d'admission.
              </h2>
              <p class="text-neutral-500 dark:text-stone-500 text-sm leading-relaxed">
                Le recrutement se fait sur dossier. Nous privilégions les profils curieux, engagés et ayant une appétence forte pour le numérique.
              </p>
            </div>

            <div class="lg:col-span-8">
              <div
                v-for="(critere, i) in CRITERES"
                :key="critere.title"
                class="mag-item animate-on-scroll"
                :style="`animation-delay:${i * 80}ms`"
              >
                <span class="mag-item__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="mag-item__content">
                  <h3 class="mag-item__title">{{ critere.title }}</h3>
                  <p class="mag-item__desc">{{ critere.desc }}</p>
                </div>
              </div>
            </div>

          </div>
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
                class="mag-item animate-on-scroll"
                :style="`animation-delay:${i * 80}ms`"
              >
                <span class="mag-item__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <div class="mag-item__content">
                  <h3 class="mag-item__title">{{ path.title }}</h3>
                  <p class="mag-item__desc">{{ path.desc }}</p>
                </div>
                <span class="mag-item__arrow">→</span>
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
//  TEAM_DATA — ÉQUIPE (données éditables)
//  ▶ Champs requis   : prenom, nom, role, email
//  ▶ Champs optionnels: photo (URL ou null)
//     → Si photo = null : avatar DiceBear auto-généré avec initiales
// ══════════════════════════════════════════════════════════════
const TEAM_DATA = [
  { prenom: 'Soufian',   nom: 'Lefebvre', role: 'responsable des enseignements en informatique',   email: 'soufian.ben-amor@uvsq.fr',  photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Soufian.jpg' },
  { prenom: 'Olivier',  nom: 'Le Cadet',  role: 'responsable des enseignements de mathématiques et de développement web. Directeur des études',          email: 'lecadet@iut-velizy.uvsq.fr',   photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Olivier.jpg' },
  { prenom: 'Jean-Marie',   nom: 'Clech',   role: 'Professionnel, Graphic Design, infographie',  email: 'jean-marie.clech@uvsq.fr',    photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Jean-Marie-277x300.jpg' },
  { prenom: 'Sylvie',  nom: 'Fabre',   role: 'Enseignante en communication, PPP et gestion de projet, responsable des stages et de la poursuite d’études. Cheffe de département MMI',     email: 'sylvie.fabre@uvsq.fr',    photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Sylvie-277x300.jpg' },
  { prenom: 'Cédric',  nom: 'Fournerie',   role: 'Enseignant Réseaux et télécoms', email: 'cedric.fournerie@uvsq.fr',    photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Cedric-277x300.jpg' },
  { prenom: 'Xavier',   nom: 'Hautbois',    role: 'Maître de conférences en art (MCF), responsable des enseignements de musique, esthétique et interactivité',     email: 'xavier.hautbois@orange.fr',     photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Xavier-277x300.jpg' },
  { prenom: 'Thérèse',  nom: 'Lepage', role: 'Professeure agrégée d’anglais (PRAG), responsable des enseignements d’anglais',                   email: 'therese.crosnier@uvsq.fr',  photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Therese-277x300.jpg' },
  { prenom: 'Michel',  nom: 'Pinosa',   role: 'Professionnel, Arts plastiques, Graphic Design & Web Design',          email: 'mmi@michelpinosa.com',    photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Michel-277x300.jpg' },
  { prenom: 'Fred',  nom: 'Pirat',   role: 'Professionnel et responsable des enseignements en audiovisuel',          email: 'frederic.pirat@uvsq.fr',    photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Fred-277x300.jpg' },
  { prenom: 'Vincent',  nom: 'Wable',   role: 'Responsable audiovisuel et enseignant en audiovisuel',          email: 'pas de mail disponible',    photo: 'https://www.mmi-velizy.fr/wp-content/uploads/2023/01/Vincent-277x300.jpg' },

];

// ══════════════════════════════════════════════════════════════
//  EXPERTISES (section 3 colonnes romaines)
// ══════════════════════════════════════════════════════════════
const EXPERTISES = [
  {
    roman: 'I.',
    title: 'Le BUT « Métiers du multimédia et de l’Internet »',
    desc: `Permet de se forger une solide culture du numérique et de développer une connaissance de ses différents métiers, avant de choisir une spécialisation. Cette polyvalence est très appréciée des entreprises.`
  },
  {
    roman: 'II.',
    title: 'Le BUT MMI mêle théorie et pratique :',
    desc: `Un socle de connaissances nourri des avancées de la recherche tout au long du cursus, des projets exigeants à chaque semestre, des stages chaque année, et une troisième année proposée en apprentissage.`
  },
  {
    roman: 'III.',
    title: 'La formation repose sur un socle de 5 compétences: comprendre, concevoir, développer, exprimer et entreprendre.',
    desc: `Ces compétences sont travaillées de manière individuelle et collaborative, que ce soit au moyen de cours et d’exercices ciblés ou à partir de projets transversaux. L’apprentissage par projet (et donc la capacité à planifier, organiser, coordonner des tâches diverses, et à rendre compte des résultats obtenus dans le respect des délais) est un aspect important de la formation.`
  }
];

// ══════════════════════════════════════════════════════════════
//  CRITÈRES DE SÉLECTION
// ══════════════════════════════════════════════════════════════
const CRITERES = [
  {
    title: 'Notes scolaires',
    desc: `Bulletins de 1ʳᵉ et Terminale. Une attention toute particulière est portée aux matières analytiques et aux spécialités.`
  },
  {
    title: 'Lettre de motivation (Projet motivé)',
    desc: `La cohérence de votre projet professionnel, votre niveau d'expression et votre véritable intérêt pour la création numérique.`
  },
  {
    title: 'Portfolio / Projets personnels',
    desc: `Tout projet personnel : site web, compte de curation, chaine vidéo, design, photo, investissement associatif... est un réel atout.`
  },
  {
    title: 'Appréciations & Savoir-être',
    desc: `Assiduité, comportement et avis du chef d'établissement constituent un critère non négligeable pour un travail en équipe.`
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
    quote: "La qualité  de l' enseignement m'a vraiment permis d'avoir une meilleur vision graphique.",
    name: 'Samuel R.',
    role: 'Étudiant · Promo 24-27',
    photo: 'https://portfolio.ralaikoa.com/samuel.png'
  },
  {
    quote: "J’ai appris beaucoup plus que ce que je pensais être capable de faire en termes de développement web. On y apprend à façonner des interfaces exactement comme on les imagine.",
    name: 'Jahnik L.',
    role: 'Étudiant · Promo 24-27',
    photo: 'https://jahnik.labry.mmi-velizy.fr/portfolio/images/photo.svg'
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
  background: transparent;
  transition: transform 0.3s;
}
.team-card:hover { transform: translateY(-4px); }

.team-card__photo { width: 100%; aspect-ratio: 1/1; overflow: hidden; flex-shrink: 0; }
.dark .team-card__photo { }

.team-card__body { padding: 16px 0 20px; display: flex; flex-direction: column; gap: 3px; }
.team-card__name { font-size: 14px; font-weight: 900; letter-spacing: -0.01em; color: #171717; line-height: 1.2; }
.dark .team-card__name { color: #f0f0f0; }
.team-card__role { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #2563eb; margin-top: 2px; }
.dark .team-card__role { color: #3b82f6; }
.team-card__email {
  font-size: 11px; color: #a3a3a3; text-decoration: none; margin-top: 6px; display: block;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: color 0.2s;
}
.team-card__email:hover { color: #2563eb; }
.dark .team-card__email { color: #57534e; }
.dark .team-card__email:hover { color: #60a5fa; }

/* ── Listes Éditoriales (Critères et Après) ── */
.mag-item {
  display: flex; align-items: flex-start; gap: 24px;
  padding: 28px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s;
}
.dark .mag-item { border-bottom-color: rgba(255,255,255,0.06); }
.mag-item:last-child { border-bottom: none; }
.mag-item:hover .mag-item__num { color: #2563eb; }
.dark .mag-item:hover .mag-item__num { color: #60a5fa; }

.mag-item__num {
  font-size: 11px; font-weight: 900; color: #d4d4d4; letter-spacing: 0.05em;
  min-width: 28px; padding-top: 4px; flex-shrink: 0;
  transition: color 0.2s;
}
.dark .mag-item__num { color: #404040; }

.mag-item__content { flex: 1; }
.mag-item__title { font-size: 17px; font-weight: 900; letter-spacing: -0.02em; color: #171717; margin-bottom: 6px; }
.dark .mag-item__title { color: #f0f0f0; }
.mag-item__desc { font-size: 13px; color: #737373; line-height: 1.65; }
.dark .mag-item__desc { color: #57534e; }

.mag-item__arrow {
  font-size: 18px; color: #d4d4d4; flex-shrink: 0; padding-top: 2px;
  transition: color 0.2s, transform 0.2s;
}
.dark .mag-item__arrow { color: #262626; }
.mag-item:hover .mag-item__arrow { color: #2563eb; transform: translateX(4px); }
.dark .mag-item:hover .mag-item__arrow { color: #60a5fa; }
</style>
