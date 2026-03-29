<template>
  <div class="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 pt-36 pb-32 transition-colors duration-500">
    <main class="container mx-auto px-6">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-neutral-400 dark:text-stone-600 uppercase tracking-widest mb-16 animate-fade-in" aria-label="Fil d'ariane">
        <router-link to="/" class="hover:text-blue-600 transition-colors">Accueil</router-link>
        <span>/</span>
        <span class="text-neutral-900 dark:text-white font-bold">Candidature spontanée</span>
      </nav>

      <!-- Hero -->
      <div class="mb-32 animate-fade-in">
        <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs font-bold mb-6">Hors Parcoursup</p>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-[1.02] text-neutral-950 dark:text-white mb-8 max-w-3xl">
          Candidature<br /><span class="font-light italic text-neutral-400 dark:text-stone-500">spontanée.</span>
        </h1>
        <p class="text-neutral-600 dark:text-stone-400 text-lg leading-relaxed max-w-xl">
          Transfert depuis un autre IUT, étudiant étranger, reconversion professionnelle ou profil atypique ? Vous pouvez candidater directement auprès du département.
        </p>
      </div>

      <!-- Profils éligibles -->
      <section class="mb-32">
        <h2 class="section-heading mb-12 animate-on-scroll">Qui peut candidater ?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div v-for="(profil, i) in profils" :key="profil.title"
               class="profil-card animate-on-scroll"
               :style="`animation-delay: ${i * 70}ms`">
            <span class="text-3xl mb-4 block">{{ profil.emoji }}</span>
            <h3 class="font-black text-neutral-900 dark:text-white mb-2">{{ profil.title }}</h3>
            <p class="text-sm text-neutral-500 dark:text-stone-400 leading-relaxed">{{ profil.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Processus -->
      <section class="mb-32">
        <h2 class="section-heading mb-16 animate-on-scroll">Le processus</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="(step, i) in process" :key="i"
               class="process-step animate-on-scroll"
               :style="`animation-delay: ${i * 100}ms`">
            <div class="process-step__num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="process-step__title">{{ step.title }}</h3>
            <p class="process-step__desc">{{ step.desc }}</p>
          </div>
        </div>
      </section>

      <!-- Formulaire de contact / prise de contact -->
      <section class="animate-on-scroll">
        <div class="max-w-2xl mx-auto text-center mb-12">
          <h2 class="section-heading mb-4">Prenez contact avec nous</h2>
          <p class="text-neutral-500 dark:text-stone-400 text-sm leading-relaxed">
            Avant de déposer un dossier, nous vous conseillons de nous contacter pour vérifier votre éligibilité et obtenir les documents requis.
          </p>
        </div>

        <div class="max-w-xl mx-auto bg-neutral-50 dark:bg-[#0f0f0f] rounded-2xl border border-neutral-200 dark:border-white/10 p-8 md:p-12">
          <form @submit.prevent="submitForm" class="flex flex-col gap-5" novalidate>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="form-field">
                <label for="prenom" class="form-label">Prénom *</label>
                <input id="prenom" v-model="form.prenom" type="text" required class="form-input" placeholder="Marie" />
              </div>
              <div class="form-field">
                <label for="nom" class="form-label">Nom *</label>
                <input id="nom" v-model="form.nom" type="text" required class="form-input" placeholder="Dupont" />
              </div>
            </div>

            <div class="form-field">
              <label for="email" class="form-label">Email *</label>
              <input id="email" v-model="form.email" type="email" required class="form-input" placeholder="marie.dupont@email.fr" />
            </div>

            <div class="form-field">
              <label for="profil" class="form-label">Mon profil *</label>
              <select id="profil" v-model="form.profil" required class="form-input form-select">
                <option value="" disabled>Sélectionnez votre situation...</option>
                <option value="transfert">Transfert depuis un autre IUT/licence</option>
                <option value="etranger">Étudiant étranger</option>
                <option value="reconversion">Reconversion professionnelle</option>
                <option value="autre">Autre profil atypique</option>
              </select>
            </div>

            <div class="form-field">
              <label for="message" class="form-label">Message *</label>
              <textarea id="message" v-model="form.message" required rows="4" class="form-input form-textarea"
                placeholder="Présentez-vous brièvement, indiquez votre parcours actuel et précisez pour quelle semestre/année vous souhaitez candidater..."></textarea>
            </div>

            <button type="submit" class="btn-primary w-full justify-center mt-2" :disabled="submitting">
              <span v-if="!submitting">Envoyer ma demande</span>
              <span v-else>Envoi en cours...</span>
            </button>

            <transition name="fade">
              <p v-if="submitted" class="text-center text-sm text-green-600 dark:text-green-400 font-bold">
                ✓ Votre message a été envoyé. Nous revenons vers vous sous 48h.
              </p>
            </transition>

          </form>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const form = ref({ prenom: '', nom: '', email: '', profil: '', message: '' });
const submitting = ref(false);
const submitted = ref(false);

const submitForm = async () => {
  submitting.value = true;
  // Simulation d'envoi (à connecter à une vraie route API si besoin)
  await new Promise(r => setTimeout(r, 1200));
  submitting.value = false;
  submitted.value = true;
  form.value = { prenom: '', nom: '', email: '', profil: '', message: '' };
  setTimeout(() => { submitted.value = false; }, 6000);
};

const profils = [
  { emoji: '🔄', title: 'Transfert inter-IUT / Licence', desc: 'Vous êtes actuellement inscrit dans une autre formation supérieure et souhaitez intégrer le BUT MMI en cours de cursus.' },
  { emoji: '🌍', title: 'Étudiant étranger', desc: 'Vous êtes ressortissant hors UE ou en programme d\'échange. Des procédures spécifiques s\'appliquent selon votre pays d\'origine.' },
  { emoji: '💡', title: 'Reconversion professionnelle', desc: 'Vous êtes en activité et souhaitez vous former au numérique. Le BUT peut être suivi en alternance dès la 2ᵉ année.' },
  { emoji: '✨', title: 'Profil atypique', desc: 'DAEU, VAP, VAE... Tout profil méritant est étudié. Contactez-nous pour évaluer ensemble votre situation.' }
];

const process = [
  { title: 'Prise de contact', desc: 'Envoyez-nous un message via le formulaire pour vérifier votre éligibilité.' },
  { title: 'Dossier demandé', desc: 'Si votre profil correspond, nous vous envoyons la liste des documents requis.' },
  { title: 'Étude du dossier', desc: 'Le jury examine votre candidature lors de la prochaine commission (mensuelle).' },
  { title: 'Réponse & intégration', desc: "Vous recevez une décision sous 15 jours et, si admis, les informations d'intégration." }
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

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  color: #fff; font-size: 13px; font-weight: 700; border-radius: 6px;
  cursor: pointer; border: none; transition: box-shadow 0.3s, transform 0.2s;
}
.btn-primary:hover { box-shadow: 0 12px 30px -6px rgba(37,99,235,0.35); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.profil-card {
  padding: 28px; border-radius: 16px; border: 1px solid #e5e5e5; background: #fff;
  transition: all 0.3s;
}
.dark .profil-card { border-color: rgba(255,255,255,0.1); background: #0f0f0f; }
.profil-card:hover { border-color: rgba(37,99,235,0.4); transform: translateY(-2px); }

.process-step { padding: 24px; border-radius: 16px; border: 1px solid #e5e5e5; background: #fafafa; display: flex; flex-direction: column; gap: 12px; }
.dark .process-step { border-color: rgba(255,255,255,0.1); background: #0f0f0f; }
.process-step__num { font-size: 48px; font-weight: 900; color: #f5f5f5; line-height: 1; }
.dark .process-step__num { color: #262626; }
.process-step__title { font-size: 13px; font-weight: 900; color: #171717; }
.dark .process-step__title { color: #fff; }
.process-step__desc { font-size: 11px; color: #737373; line-height: 1.6; }
.dark .process-step__desc { color: #78716c; }

.form-field { display: flex; flex-direction: column; gap: 8px; }
.form-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #737373; }
.dark .form-label { color: #78716c; }
.form-input {
  width: 100%; padding: 12px 16px; border-radius: 10px;
  border: 1px solid #e5e5e5; background: #fff; color: #171717; font-size: 13px;
  transition: all 0.2s; font-family: inherit;
}
.dark .form-input { border-color: rgba(255,255,255,0.12); background: #1a1a1a; color: #fff; }
.form-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
.form-input::placeholder { color: #a3a3a3; }
.form-select { appearance: none; cursor: pointer; }
.form-textarea { resize: vertical; min-height: 120px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
