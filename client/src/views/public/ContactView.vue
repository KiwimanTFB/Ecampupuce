<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 pt-36 pb-32 transition-colors duration-500">
    <main class="container mx-auto px-6">

      <!-- ── Intro éditoriale ── -->
      <section class="mb-24 animate-fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end max-w-5xl">
          <div>
            <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-6">Contact</p>
            <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[1.0] text-neutral-950 dark:text-white">
              Parlons<br /><span class="font-light italic text-neutral-400 dark:text-stone-500">ensemble.</span>
            </h1>
          </div>
          <div class="animate-fade-in animation-delay-200">
            <p class="text-neutral-500 dark:text-stone-400 text-base leading-relaxed">
              Une question sur la formation, une demande de partenariat ou simplement envie d'en savoir plus sur le département MMI ? Notre équipe pédagogique et administrative est là pour vous répondre sous 48h.
            </p>
            <div class="flex flex-wrap gap-8 mt-10 text-xs uppercase tracking-[0.14em] text-neutral-400 dark:text-stone-600">
              <div class="flex flex-col gap-1">
                <span class="text-neutral-900 dark:text-white font-bold text-sm">48h</span>
                <span>Délai de réponse</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-neutral-900 dark:text-white font-bold text-sm">Lun – Ven</span>
                <span>09:00 – 17:00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Ligne de séparation -->
      <div class="h-px w-full bg-neutral-100 dark:bg-white/8 mb-24 animate-fade-in animation-delay-300"></div>

      <!-- ── Formulaire + Coordonnées ── -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">

        <!-- Gauche : Formulaire style underline -->
        <div class="animate-on-scroll">
          <p class="text-xs text-neutral-400 dark:text-stone-600 uppercase tracking-widest font-bold mb-10">Envoyer un message</p>

          <form @submit.prevent="submitContact" novalidate class="flex flex-col gap-0">

            <div class="cform-field">
              <label for="cf-name" class="cform-label">Votre nom complet</label>
              <input id="cf-name" v-model="form.name" type="text" required autocomplete="name"
                     class="cform-input" placeholder="Marie Dupont" />
            </div>

            <div class="cform-field">
              <label for="cf-email" class="cform-label">Adresse email</label>
              <input id="cf-email" v-model="form.email" type="email" required autocomplete="email"
                     class="cform-input" placeholder="marie@email.fr" />
            </div>

            <div class="cform-field">
              <label for="cf-subject" class="cform-label">Sujet</label>
              <select id="cf-subject" v-model="form.subject" class="cform-input cform-select">
                <option value="" disabled>Choisissez un sujet…</option>
                <option value="parcoursup">Informations Parcoursup</option>
                <option value="candidature">Candidature spontanée / transfert</option>
                <option value="partenariat">Partenariat & stage</option>
                <option value="presse">Presse & communication</option>
                <option value="alumni">Réseau Alumni</option>
                <option value="autre">Autre question</option>
              </select>
            </div>

            <div class="cform-field">
              <label for="cf-message" class="cform-label">Message</label>
              <textarea id="cf-message" v-model="form.message" required rows="5"
                        class="cform-input cform-textarea" placeholder="Décrivez votre demande…"></textarea>
            </div>

            <div class="mt-10 flex flex-col gap-4">
              <button type="submit" class="cform-submit" :disabled="sending">
                <span v-if="!sending">Envoyer le message</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/>
                    <path d="M21 12a9 9 0 00-9-9"/>
                  </svg>
                  Envoi en cours…
                </span>
              </button>

              <transition name="fade">
                <div v-if="sent" class="flex items-center gap-3 text-green-600 dark:text-green-400 text-sm font-bold py-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Message envoyé. Nous vous répondons sous 48h.
                </div>
              </transition>
            </div>

          </form>
        </div>

        <!-- Droite : Coordonnées éditoriales -->
        <div class="animate-on-scroll lg:pt-10" style="animation-delay:150ms;">

          <p class="text-xs text-neutral-400 dark:text-stone-600 uppercase tracking-widest font-bold mb-10">Coordonnées</p>

          <div v-for="coord in COORDONNEES" :key="coord.label" class="coord-block">
            <p class="coord-label">{{ coord.label }}</p>
            <a v-if="coord.href" :href="coord.href" class="coord-value coord-link">{{ coord.value }}</a>
            <address v-else-if="coord.address" class="not-italic">
              <p v-for="line in coord.value" :key="line" class="coord-value">{{ line }}</p>
            </address>
            <p v-else class="coord-value">{{ coord.value }}</p>
          </div>

          <!-- Séparateur -->
          <div class="h-px bg-neutral-100 dark:bg-white/8 my-10"></div>

          <!-- Réseaux sociaux -->
          <p class="text-xs text-neutral-400 dark:text-stone-600 uppercase tracking-widest font-bold mb-6">Réseaux</p>
          <div class="flex gap-6">
            <a v-for="social in SOCIALS" :key="social.name"
               :href="social.href" target="_blank" rel="noopener"
               :aria-label="`MMI Vélizy sur ${social.name}`"
               class="social-link">
              <span v-html="social.svg"></span>
              <span class="text-xs font-bold">{{ social.name }}</span>
            </a>
          </div>

        </div>

      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// ══════════════════════════════════════════════════════════════
//  COORDONNÉES — données éditables
// ══════════════════════════════════════════════════════════════
const COORDONNEES = [
  {
    label: 'Adresse',
    address: true,
    value: ['10-12 Avenue de l\'Europe', '78140 Vélizy-Villacoublay']
  },
  {
    label: 'Email',
    href: 'mailto:mmi-velizy@iut.fr',
    value: 'mmi-velizy@iut.fr'
  },
  {
    label: 'Téléphone',
    href: 'tel:+33139254700',
    value: '+33 (0)1 39 25 47 00'
  },
  {
    label: 'Horaires',
    value: 'Lun – Ven, 09:00 – 17:00'
  },
];

const SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/',
    svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>`
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    svg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`
  },
];

// ══════════════════════════════════════════════════════════════
//  FORMULAIRE
// ══════════════════════════════════════════════════════════════
const form = ref({ name: '', email: '', subject: '', message: '' });
const sending = ref(false);
const sent = ref(false);

const submitContact = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) return;
  sending.value = true;
  // ▶ Remplacer par l'appel API réel : await fetch('/api/contact', { method:'POST', body: JSON.stringify(form.value) })
  await new Promise(r => setTimeout(r, 1400));
  sending.value = false;
  sent.value = true;
  form.value = { name: '', email: '', subject: '', message: '' };
  setTimeout(() => { sent.value = false; }, 8000);
};

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
@keyframes fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { opacity: 0; animation: fadeInUp 0.95s cubic-bezier(0.16,1,0.3,1) forwards; }
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-300 { animation-delay: 0.3s; }
.animate-on-scroll { opacity: 0; transform: translateY(22px); transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1); }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

/* ── Formulaire style underline ── */
.cform-field {
  display: flex; flex-direction: column; gap: 6px;
  padding: 20px 0 4px;
  border-bottom: 1px solid #e5e5e5;
}
.dark .cform-field { border-bottom-color: rgba(255,255,255,0.08); }

.cform-label {
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700; color: #a3a3a3;
}
.dark .cform-label { color: #57534e; }

.cform-input {
  width: 100%; padding: 6px 0 10px; font-size: 15px; font-family: inherit; font-weight: 500;
  background: transparent; border: none; outline: none; color: #171717;
}
.dark .cform-input { color: #f5f5f5; }
.cform-input::placeholder { color: #d4d4d4; font-weight: 400; }
.dark .cform-input::placeholder { color: #404040; }
.cform-select {
  cursor: pointer; appearance: none;
  /* Force la couleur du texte — évite le bug dark-mode sur les <option> */
  color: #171717;
}
.dark .cform-select { color: #f5f5f5; }
/* Les <option> elles-mêmes ont un fond explicite pour éviter le texte invisible */
.cform-select option {
  background: #ffffff;
  color: #171717;
}
.dark .cform-select option {
  background: #171717;
  color: #f5f5f5;
}
.cform-textarea { resize: none; line-height: 1.65; }

.cform-submit {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px 32px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  background: #171717; color: #fff; border: none; border-radius: 4px; cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  align-self: flex-start;
}
.dark .cform-submit { background: #fff; color: #171717; }
.cform-submit:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); }
.dark .cform-submit:hover:not(:disabled) { background: #2563eb; color: #fff; }
.cform-submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Coordonnées éditoriales ── */
.coord-block { padding: 18px 0; border-bottom: 1px solid #f0f0f0; }
.dark .coord-block { border-bottom-color: rgba(255,255,255,0.06); }
.coord-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700; color: #a3a3a3; margin-bottom: 6px; }
.dark .coord-label { color: #57534e; }
.coord-value { font-size: 16px; font-weight: 700; color: #171717; display: block; }
.dark .coord-value { color: #f0f0f0; }
.coord-link { text-decoration: none; transition: color 0.2s; }
.coord-link:hover { color: #2563eb; }
.dark .coord-link:hover { color: #60a5fa; }

/* ── Réseaux ── */
.social-link {
  display: flex; align-items: center; gap: 6px;
  color: #a3a3a3; text-decoration: none;
  transition: color 0.2s, transform 0.2s;
}
.dark .social-link { color: #57534e; }
.social-link:hover { color: #171717; transform: translateY(-1px); }
.dark .social-link:hover { color: #f0f0f0; }

/* ── Spinner ── */
.spin-icon { animation: spin 0.8s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
