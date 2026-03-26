<template>
  <div class="bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-stone-200 transition-colors duration-500">
    <main class="pt-40 pb-0">

      <!-- ── Campus Hero ── -->
      <section class="container mx-auto px-6 mb-28">
        <p class="text-neutral-500 dark:text-stone-500 tracking-[0.3em] uppercase text-xs mb-8 font-bold animate-fade-in">L'Espace</p>
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter text-neutral-950 dark:text-white mb-8 animate-fade-in animation-delay-100">
          Le <span class="font-light italic text-neutral-400 dark:text-stone-500">Campus.</span>
        </h1>
      </section>

      <!-- ── Galerie Asymétrique ── -->
      <section class="container mx-auto px-6 mb-36">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">

          <article class="md:col-span-7 animate-on-scroll group cursor-default">
            <div class="relative overflow-hidden bg-neutral-100 dark:bg-[#0f0f0f]" style="aspect-ratio:4/3;">
              <img src="https://images.unsplash.com/photo-1598425237654-4fb05a4151a6?q=80&w=1200&auto=format&fit=crop"
                   class="w-full h-full object-cover filter grayscale-[30%] contrast-110 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                   alt="Plateau Tournage MMI" loading="lazy" />
            </div>
            <div class="mt-5 flex justify-between items-start border-t border-neutral-100 dark:border-white/8 pt-4">
              <h3 class="text-sm font-black text-neutral-900 dark:text-white">Plateau Tournage</h3>
              <span class="text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest text-right">Cinéma & Lumières</span>
            </div>
          </article>

          <div class="md:col-span-5 flex flex-col justify-center animate-on-scroll" style="animation-delay:150ms">
            <p class="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold mb-6">Nos espaces</p>
            <h2 class="text-2xl md:text-3xl font-black tracking-tighter text-neutral-950 dark:text-white mb-6 leading-tight">
              Où l'espace devient<br/>matière à création.
            </h2>
            <p class="text-neutral-500 dark:text-stone-400 text-sm leading-relaxed">
              Des salles machines sur-équipées aux espaces de coworking minimalistes, chaque mètre carré est pensé pour stimuler la rigueur et l'imagination.
            </p>
          </div>

          <article class="md:col-span-5 md:mt-20 animate-on-scroll group cursor-default" style="animation-delay:200ms">
            <div class="relative overflow-hidden bg-neutral-100 dark:bg-[#0f0f0f]" style="aspect-ratio:1/1;">
              <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop"
                   class="w-full h-full object-cover filter grayscale-[30%] contrast-110 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                   alt="Laboratoires Créatifs" loading="lazy" />
            </div>
            <div class="mt-5 flex justify-between items-start border-t border-neutral-100 dark:border-white/8 pt-4">
              <h3 class="text-sm font-black text-neutral-900 dark:text-white">Laboratoires Créatifs</h3>
              <span class="text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest text-right">Stations Apple & PC</span>
            </div>
          </article>

          <article class="md:col-span-7 animate-on-scroll group cursor-default" style="animation-delay:100ms">
            <div class="relative overflow-hidden bg-neutral-100 dark:bg-[#0f0f0f]" style="aspect-ratio:16/9;">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop"
                   class="w-full h-full object-cover filter grayscale-[30%] contrast-110 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                   alt="FabLab 3D" loading="lazy" />
            </div>
            <div class="mt-5 flex justify-between items-start border-t border-neutral-100 dark:border-white/8 pt-4">
              <h3 class="text-sm font-black text-neutral-900 dark:text-white">FabLab & 3D</h3>
              <span class="text-[10px] text-neutral-400 dark:text-stone-600 uppercase tracking-widest text-right">Impression 3D & UX Labs</span>
            </div>
          </article>

        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════
           SECTION CONTACT — ancre #contact utilisée par le header
      ═══════════════════════════════════════════════════════════ -->
      <section
        id="contact"
        class="bg-neutral-50 dark:bg-[#060606] border-t border-neutral-100 dark:border-white/5 py-28 md:py-36"
      >
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">

            <!-- Gauche : Formulaire minimaliste -->
            <div class="animate-on-scroll">
              <p class="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold mb-6">Écrire</p>
              <h2 class="text-3xl md:text-5xl font-black tracking-tighter text-neutral-950 dark:text-white mb-12 leading-tight">
                Nous<br/>contacter.
              </h2>

              <form @submit.prevent="submitContact" class="flex flex-col gap-0" novalidate>

                <div class="contact-field">
                  <label for="c-name" class="contact-label">Votre nom</label>
                  <input id="c-name" v-model="contactForm.name" type="text" required class="contact-input" placeholder="Marie Dupont" />
                </div>

                <div class="contact-field">
                  <label for="c-email" class="contact-label">Email</label>
                  <input id="c-email" v-model="contactForm.email" type="email" required class="contact-input" placeholder="marie@email.fr" />
                </div>

                <div class="contact-field">
                  <label for="c-subject" class="contact-label">Sujet</label>
                  <select id="c-subject" v-model="contactForm.subject" class="contact-input contact-select">
                    <option value="" disabled>Choisissez un sujet…</option>
                    <option value="parcoursup">Informations Parcoursup</option>
                    <option value="candidature">Candidature spontanée</option>
                    <option value="partenariat">Partenariat / Stage</option>
                    <option value="presse">Presse & Communication</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div class="contact-field">
                  <label for="c-message" class="contact-label">Message</label>
                  <textarea id="c-message" v-model="contactForm.message" required rows="4" class="contact-input contact-textarea"
                    placeholder="Votre message…"></textarea>
                </div>

                <div class="mt-8">
                  <button type="submit" class="contact-submit" :disabled="sending">
                    <span v-if="!sending">Envoyer le message</span>
                    <span v-else class="flex items-center gap-2">
                      <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/>
                        <path d="M21 12a9 9 0 00-9-9"/>
                      </svg>
                      Envoi…
                    </span>
                  </button>
                </div>

                <transition name="fade">
                  <div v-if="sent" class="mt-6 flex items-center gap-3 text-green-600 dark:text-green-400 text-sm font-bold">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Message envoyé. Nous revenons vers vous sous 48h.
                  </div>
                </transition>

              </form>
            </div>

            <!-- Droite : Infos de contact éditoriales -->
            <div class="animate-on-scroll lg:pt-28" style="animation-delay:150ms">

              <!-- Adresse -->
              <div class="contact-info-block">
                <p class="contact-info-label">Adresse</p>
                <address class="not-italic">
                  <p class="contact-info-value">10-12 Avenue de l'Europe</p>
                  <p class="contact-info-value">78140 Vélizy-Villacoublay</p>
                </address>
              </div>

              <!-- Email -->
              <div class="contact-info-block">
                <p class="contact-info-label">Email</p>
                <a href="mailto:mmi-velizy@iut.fr" class="contact-info-value contact-info-link">mmi-velizy@iut.fr</a>
              </div>

              <!-- Téléphone -->
              <div class="contact-info-block">
                <p class="contact-info-label">Téléphone</p>
                <a href="tel:+33139254700" class="contact-info-value contact-info-link">+33 (0)1 39 25 47 00</a>
              </div>

              <!-- Horaires -->
              <div class="contact-info-block border-b-0 pb-0">
                <p class="contact-info-label">Horaires secrétariat</p>
                <p class="contact-info-value">Lun – Ven, 09:00 — 17:00</p>
              </div>

              <!-- Carte discrète -->
              <div class="mt-10 overflow-hidden rounded-xl border border-neutral-200 dark:border-white/10" style="aspect-ratio:16/9;">
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
import { ref, onMounted } from 'vue';

// ══════════════════════════════════════════════════════════════
//  FORMULAIRE DE CONTACT — données éditables
// ══════════════════════════════════════════════════════════════

const contactForm = ref({ name: '', email: '', subject: '', message: '' });
const sending = ref(false);
const sent = ref(false);

const submitContact = async () => {
  sending.value = true;
  await new Promise(r => setTimeout(r, 1400)); // Simule l'envoi (remplacer par vraie API)
  sending.value = false;
  sent.value = true;
  contactForm.value = { name: '', email: '', subject: '', message: '' };
  setTimeout(() => { sent.value = false; }, 7000);
};

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
.animation-delay-100 { animation-delay: 0.1s; }
.animate-on-scroll { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

/* ── Formulaire minimaliste — style "underline" ── */
.contact-field {
  display: flex; flex-direction: column; gap: 6px;
  padding: 20px 0 4px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 0;
}
.dark .contact-field { border-bottom-color: rgba(255,255,255,0.08); }

.contact-label {
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700;
  color: #a3a3a3;
}
.dark .contact-label { color: #57534e; }

.contact-input {
  width: 100%; padding: 6px 0 10px; font-size: 15px; font-family: inherit;
  background: transparent; border: none; outline: none;
  color: #171717; font-weight: 500;
}
.dark .contact-input { color: #f5f5f5; }
.contact-input::placeholder { color: #d4d4d4; font-weight: 400; }
.dark .contact-input::placeholder { color: #404040; }
.contact-select { cursor: pointer; appearance: none; }
.contact-textarea { resize: none; line-height: 1.6; }

.contact-submit {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  background: #171717; color: #fff; border: none; border-radius: 3px; cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.dark .contact-submit { background: #fff; color: #171717; }
.contact-submit:hover { background: #2563eb; transform: translateY(-1px); }
.dark .contact-submit:hover { background: #2563eb; color: #fff; }
.contact-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ── Infos éditoriales ── */
.contact-info-block {
  padding: 20px 0; border-bottom: 1px solid #f0f0f0;
}
.dark .contact-info-block { border-bottom-color: rgba(255,255,255,0.06); }

.contact-info-label {
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; font-weight: 700;
  color: #a3a3a3; margin-bottom: 6px;
}
.dark .contact-info-label { color: #57534e; }

.contact-info-value {
  font-size: 16px; font-weight: 700; letter-spacing: -0.01em;
  color: #171717; display: block;
}
.dark .contact-info-value { color: #f0f0f0; }

.contact-info-link { text-decoration: none; transition: color 0.2s; }
.contact-info-link:hover { color: #2563eb; }
.dark .contact-info-link:hover { color: #60a5fa; }

.animate-spin { animation: spin 0.8s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
