<template>
  <div class="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 transition-colors duration-500">
    <main class="pt-40 pb-32">

      <!-- ── Hero ── -->
      <section class="container mx-auto px-6 mb-24">
        <div class="animate-fade-in">
          <p class="text-neutral-400 dark:text-stone-600 tracking-[0.3em] uppercase text-xs mb-6 font-bold">Vélizy-Villacoublay</p>
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter text-neutral-950 dark:text-white mb-8">
            Le <span class="font-light italic text-neutral-400 dark:text-stone-500">Campus.</span>
          </h1>
          <p class="text-neutral-500 dark:text-stone-400 max-w-md text-sm leading-relaxed">
            Situé au cœur de la technopole de Vélizy-Villacoublay, le département MMI bénéficie d'un environnement taillé pour la création numérique de haut niveau.
          </p>
        </div>
      </section>

      <!-- ── Image principale ── -->
      <section class="w-full mb-24 overflow-hidden group" style="height: 60vh;">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop"
             alt="Campus IUT Vélizy-Villacoublay"
             class="w-full h-full object-cover filter grayscale-[20%] contrast-110 group-hover:scale-[1.02] transition-transform duration-[3s] ease-out"
             loading="eager" />
      </section>

      <!-- ── Infos pratiques ── -->
      <section class="container mx-auto px-6 mb-28">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-neutral-100 dark:border-white/8 rounded-xl overflow-hidden">
          <div v-for="(info, i) in INFOS_PRATIQUES" :key="info.label"
               class="info-bloc animate-on-scroll"
               :class="i < 2 ? 'border-b lg:border-b-0 lg:border-r border-neutral-100 dark:border-white/8' : ''"
               :style="`animation-delay:${i * 100}ms`">
            <p class="info-bloc__label">{{ info.label }}</p>
            <p class="info-bloc__value">{{ info.value }}</p>
            <p v-if="info.sub" class="info-bloc__sub">{{ info.sub }}</p>
          </div>
        </div>
      </section>

      <!-- ── Espaces & Équipements ── -->
      <section class="container mx-auto px-6 mb-28">

        <div class="mb-14 animate-on-scroll">
          <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-4">Équipements</p>
          <h2 class="text-3xl md:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white leading-tight">
            Des espaces<br />taillés pour créer.
          </h2>
        </div>

        <!-- Galerie asymétrique -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">

          <!-- Grande image -->
          <article class="md:col-span-7 animate-on-scroll group">
            <div class="relative overflow-hidden bg-neutral-100 dark:bg-[#0f0f0f]" style="aspect-ratio:4/3;">
              <img src="https://images.unsplash.com/photo-1598425237654-4fb05a4151a6?q=80&w=1200&auto=format&fit=crop"
                   class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[2s] ease-out"
                   alt="Plateau tournage MMI" loading="lazy" />
            </div>
            <div class="mt-4 flex justify-between items-start border-t border-neutral-100 dark:border-white/8 pt-3">
              <h3 class="text-sm font-black text-neutral-900 dark:text-white">Plateau Tournage</h3>
              <span class="text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest">Cinéma & Lumières</span>
            </div>
          </article>

          <!-- Colonne droite -->
          <div class="md:col-span-5 flex flex-col gap-6">
            <article class="animate-on-scroll group" style="animation-delay:100ms;">
              <div class="relative overflow-hidden bg-neutral-100 dark:bg-[#0f0f0f]" style="aspect-ratio:16/9;">
                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop"
                     class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[2s] ease-out"
                     alt="Laboratoires créatifs" loading="lazy" />
              </div>
              <div class="mt-4 flex justify-between items-start border-t border-neutral-100 dark:border-white/8 pt-3">
                <h3 class="text-sm font-black text-neutral-900 dark:text-white">Laboratoires Créatifs</h3>
                <span class="text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest">Mac & PC Pro</span>
              </div>
            </article>

            <article class="animate-on-scroll group" style="animation-delay:200ms;">
              <div class="relative overflow-hidden bg-neutral-100 dark:bg-[#0f0f0f]" style="aspect-ratio:16/9;">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
                     class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[2s] ease-out"
                     alt="FabLab 3D" loading="lazy" />
              </div>
              <div class="mt-4 flex justify-between items-start border-t border-neutral-100 dark:border-white/8 pt-3">
                <h3 class="text-sm font-black text-neutral-900 dark:text-white">FabLab & 3D</h3>
                <span class="text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest">Impression 3D & VR</span>
              </div>
            </article>
          </div>

        </div>
      </section>

      <!-- ── Équipements liste ── -->
      <section class="border-t border-neutral-100 dark:border-white/5 py-24">
        <div class="container mx-auto px-6">

          <p class="text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest font-bold mb-10 animate-on-scroll">Matériels disponibles</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-neutral-100 dark:border-white/8">
            <div
              v-for="(equip, i) in EQUIPEMENTS"
              :key="equip.nom"
              class="equip-item animate-on-scroll"
              :style="`animation-delay:${i * 50}ms`"
            >
              <span class="equip-item__icon">{{ equip.emoji }}</span>
              <div>
                <p class="equip-item__nom">{{ equip.nom }}</p>
                <p class="equip-item__detail">{{ equip.detail }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Vie étudiante ── -->
      <section class="py-24 bg-neutral-50 dark:bg-[#060606] border-t border-neutral-100 dark:border-white/5">
        <div class="container mx-auto px-6">

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div class="animate-on-scroll">
              <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-6">Vie étudiante</p>
              <h2 class="text-3xl md:text-4xl font-black tracking-tighter text-neutral-950 dark:text-white mb-8 leading-tight">
                Plus qu'une formation,<br />une communauté.
              </h2>
              <p class="text-neutral-500 dark:text-stone-400 text-sm leading-relaxed mb-8">
                Les étudiants MMI forment une communauté active : associations étudiantes, projets inter-promos, événements culturels et soirées de lancement de projets rythment l'année universitaire.
              </p>
              <router-link to="/contact" class="cta-link">
                Nous poser une question &rarr;
              </router-link>
            </div>

            <div class="grid grid-cols-2 gap-4 animate-on-scroll" style="animation-delay:150ms;">
              <div v-for="(vie, i) in VIE_ETUDIANTE" :key="vie.titre" class="vie-card" :style="`animation-delay:${i*80}ms`">
                <span class="text-2xl mb-3 block">{{ vie.emoji }}</span>
                <p class="vie-card__titre">{{ vie.titre }}</p>
                <p class="vie-card__desc">{{ vie.desc }}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ── Accès ── -->
      <section class="py-24 border-t border-neutral-100 dark:border-white/5">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            <div class="animate-on-scroll">
              <p class="text-neutral-400 dark:text-stone-600 tracking-[0.3em] uppercase text-xs font-bold mb-6">Accès</p>
              <h2 class="text-2xl md:text-3xl font-black tracking-tighter text-neutral-950 dark:text-white mb-10 leading-tight">Comment nous rejoindre ?</h2>

              <div v-for="transport in TRANSPORTS" :key="transport.mode" class="transport-item">
                <span class="transport-item__mode">{{ transport.mode }}</span>
                <p class="transport-item__desc">{{ transport.desc }}</p>
              </div>
            </div>

            <div class="animate-on-scroll" style="animation-delay:100ms;">
              <address class="not-italic mb-8">
                <p class="text-xs text-neutral-400 dark:text-stone-600 uppercase tracking-widest font-bold mb-3">Adresse</p>
                <p class="text-lg font-bold text-neutral-900 dark:text-white">10-12 Avenue de l'Europe</p>
                <p class="text-lg font-bold text-neutral-900 dark:text-white">78140 Vélizy-Villacoublay</p>
              </address>
              <!-- Carte Maps -->
              <div class="overflow-hidden rounded-xl border border-neutral-200 dark:border-white/10" style="aspect-ratio:16/9;">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2630.0!2d2.071!3d48.783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e67b3f85ff3b8f%3A0x1b9d5c1eb3f8b8e0!2s10-12%20Av.%20de%20l'Europe%2C%2078140%20V%C3%A9lizy-Villacoublay!5e0!3m2!1sfr!2sfr!4v1710000000000!5m2!1sfr!2sfr"
                  width="100%" height="100%" style="border:0; filter: grayscale(60%);" allowfullscreen="" loading="lazy"
                  title="Campus MMI Vélizy sur Google Maps"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// ══════════════════════════════════════════════════════════════
//  DONNÉES — toutes éditables ici
// ══════════════════════════════════════════════════════════════

const INFOS_PRATIQUES = [
  { label: 'Adresse', value: '10-12 Avenue de l\'Europe', sub: '78140 Vélizy-Villacoublay' },
  { label: 'Horaires secrétariat', value: 'Lun – Ven, 09:00 – 17:00', sub: 'Fermé jours fériés' },
  { label: 'Accès RER', value: 'RER C — Chaville Vélizy', sub: 'Navette campus depuis la gare' },
];

const EQUIPEMENTS = [
  { emoji: '🖥️', nom: 'Stations Apple (Mac Studio)', detail: 'Suite Adobe, Figma, Blender' },
  { emoji: '🎬', nom: 'Caméras & Lumières Cinéma', detail: 'Canon EOS C70, Sony FX3, Aputure' },
  { emoji: '🖨️', nom: 'Imprimantes 3D', detail: 'FDM, résine, découpe laser' },
  { emoji: '🎙️', nom: 'Studio Audio', detail: 'Cabine insonorisée, micros Rode' },
  { emoji: '🥽', nom: 'Casques VR / AR', detail: 'Meta Quest 3, HoloLens 2' },
  { emoji: '📡', nom: 'Wi-Fi Campus', detail: 'Eduroam — 10 Gbit/s sur site' },
];

const VIE_ETUDIANTE = [
  { emoji: '🎨', titre: 'Associations', desc: 'BDE MMI, club jeux vidéo, ciné-club' },
  { emoji: '🤝', titre: 'Projets inter-promos', desc: 'Collaborations MMI1, 2 et 3' },
  { emoji: '🌍', titre: 'Erasmus', desc: 'Échanges en Europe & international' },
  { emoji: '🚀', titre: 'Hackathons', desc: '24h créa, Game Jam annuelle' },
];

const TRANSPORTS = [
  { mode: 'RER C', desc: 'Station Chaville-Vélizy, puis navette ou 15 min à pied via l\'Espace Technologique.' },
  { mode: 'Bus', desc: 'Lignes 289, 411, 469 — arrêt IUT (Réseau Sqybus / Transdev).' },
  { mode: 'Vélo', desc: 'Piste cyclable depuis Versailles. Parking vélo sécurisé sur site.' },
  { mode: 'Voiture', desc: 'Autoroute A86, sortie 36 Vélizy. Parking gratuit sur le campus.' },
];

// ══════════════════════════════════════════════════════════════
//  ANIMATIONS
// ══════════════════════════════════════════════════════════════
onMounted(() => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.04 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => obs.observe(el));
});
</script>

<style scoped>
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { opacity: 0; animation: fadeInUp 1s cubic-bezier(0.16,1,0.3,1) forwards; }
.animate-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

/* ── Info bloc ── */
.info-bloc { padding: 28px 32px; }
.info-bloc__label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700; color: #a3a3a3; margin-bottom: 8px; }
.dark .info-bloc__label { color: #57534e; }
.info-bloc__value { font-size: 16px; font-weight: 900; color: #171717; letter-spacing: -0.01em; }
.dark .info-bloc__value { color: #f0f0f0; }
.info-bloc__sub { font-size: 12px; color: #a3a3a3; margin-top: 3px; }
.dark .info-bloc__sub { color: #57534e; }

/* ── Equipements ── */
.equip-item {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 20px 0; border-bottom: 1px solid #f5f5f5;
}
.dark .equip-item { border-bottom-color: rgba(255,255,255,0.05); }
.equip-item__icon { font-size: 22px; flex-shrink: 0; margin-top: 1px; }
.equip-item__nom { font-size: 13px; font-weight: 800; color: #171717; margin-bottom: 2px; }
.dark .equip-item__nom { color: #f0f0f0; }
.equip-item__detail { font-size: 11px; color: #a3a3a3; }
.dark .equip-item__detail { color: #57534e; }

/* ── Vie étudiante cards ── */
.vie-card { padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px; background: #fff; }
.dark .vie-card { border-color: rgba(255,255,255,0.07); background: #0f0f0f; }
.vie-card__titre { font-size: 13px; font-weight: 900; color: #171717; margin-bottom: 4px; }
.dark .vie-card__titre { color: #f0f0f0; }
.vie-card__desc { font-size: 11px; color: #a3a3a3; line-height: 1.5; }
.dark .vie-card__desc { color: #57534e; }

/* ── Transports ── */
.transport-item { display: flex; align-items: flex-start; gap: 20px; padding: 16px 0; border-bottom: 1px solid #f5f5f5; }
.dark .transport-item { border-bottom-color: rgba(255,255,255,0.05); }
.transport-item__mode { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; color: #2563eb; min-width: 50px; flex-shrink: 0; padding-top: 3px; }
.dark .transport-item__mode { color: #60a5fa; }
.transport-item__desc { font-size: 13px; color: #525252; line-height: 1.6; }
.dark .transport-item__desc { color: #78716c; }

/* ── CTA ── */
.cta-link { font-size: 13px; font-weight: 700; color: #737373; text-decoration: none; transition: color 0.2s; }
.cta-link:hover { color: #2563eb; }
.dark .cta-link { color: #78716c; }
.dark .cta-link:hover { color: #60a5fa; }
</style>
