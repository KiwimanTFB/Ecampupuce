<template>
  <div class="bg-[#0a0a0a] text-stone-200">
    <main class="pt-40 pb-32">
      
      <!-- Header Studio -->
      <section class="min-h-screen py-20 container mx-auto px-6 mb-40">
         <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div class="animate-fade-in-up">
               <p class="text-stone-500 tracking-[0.3em] uppercase text-xs mb-8 font-sans font-medium">Manifeste</p>
               <h1 class="text-6xl md:text-8xl font-serif font-light leading-none tracking-tighter mb-12">
                 Le Studio <br><span class="italic text-stone-400">MMI.</span>
               </h1>
            </div>
            <div class="lg:pt-24 animate-fade-in-up" style="animation-delay: 200ms;">
               <p class="font-sans text-stone-400 text-lg leading-relaxed font-light mb-8 max-w-md">
                 Nous formons l'élite de la création numérique. Des profils hybrides capables de concevoir, développer et promouvoir des expériences web hors du commun.
               </p>
               <div class="h-px w-full bg-white/10 mb-8"></div>
               <div class="flex gap-12 font-sans text-xs uppercase tracking-[0.15em] text-stone-500">
                  <div class="flex flex-col gap-2">
                     <span class="text-white font-medium">Programme</span>
                     <span>3 Ans Intensifs</span>
                  </div>
                  <div class="flex flex-col gap-2">
                     <span class="text-white font-medium">Format</span>
                     <span>Alternance & Studio</span>
                  </div>
               </div>
            </div>
         </div>
      </section>
      
      <!-- Image Break -->
      <section class="w-full h-[70vh] mb-40 relative group overflow-hidden">
         <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop" class="w-full h-full object-cover filter grayscale-[30%] contrast-125 group-hover:scale-105 transition-transform duration-[2s] ease-out" alt="Studio MMI">
         <div class="absolute inset-0 bg-[#0a0a0a]/30"></div>
      </section>

      <!-- Expertises -->
      <section class="min-h-screen py-20 container mx-auto px-6 mb-40">
         <h2 class="text-3xl font-serif font-light tracking-tighter mb-20 animate-on-scroll">L'Expertise.</h2>
         
         <div class="grid grid-cols-1 md:grid-cols-3 border-t border-white/10">
            <!-- Col 1 -->
            <article class="py-12 md:pr-12 md:border-r border-white/10 border-b md:border-b-0 animate-on-scroll group">
               <span class="text-stone-600 font-serif text-4xl mb-8 block italic group-hover:text-white transition-colors duration-500">I.</span>
               <h3 class="text-xs uppercase tracking-[0.2em] font-sans font-medium text-white mb-6">Design System & UI/UX</h3>
               <p class="text-stone-400 font-sans font-light leading-relaxed text-sm">
                 Création d'interfaces utilisateur élégantes, minimalistes et centrées sur l'accessibilité. Maîtrise des grilles, de la typographie et du mouvement.
               </p>
            </article>
            <!-- Col 2 -->
            <article class="py-12 md:px-12 md:border-r border-white/10 border-b md:border-b-0 animate-on-scroll group" style="animation-delay: 150ms;">
               <span class="text-stone-600 font-serif text-4xl mb-8 block italic group-hover:text-white transition-colors duration-500">II.</span>
               <h3 class="text-xs uppercase tracking-[0.2em] font-sans font-medium text-white mb-6">Creative Coding</h3>
               <p class="text-stone-400 font-sans font-light leading-relaxed text-sm">
                 Développement front-end avancé. Animation, WebGL, et optimisation absolue des performances pour un rendu pur et fluide.
               </p>
            </article>
            <!-- Col 3 -->
            <article class="py-12 md:pl-12 animate-on-scroll group" style="animation-delay: 300ms;">
               <span class="text-stone-600 font-serif text-4xl mb-8 block italic group-hover:text-white transition-colors duration-500">III.</span>
               <h3 class="text-xs uppercase tracking-[0.2em] font-sans font-medium text-white mb-6">Direction Artistique</h3>
               <p class="text-stone-400 font-sans font-light leading-relaxed text-sm">
                 Supervision visuelle globale, identité de marque, motion design et production de contenus visuels de haute volée.
               </p>
            </article>
         </div>
      </section>
      
      <!-- Témoignages Style Awwwards -->
      <section class="min-h-screen py-20 bg-[#0f0f0f] border-y border-white/5">
         <div class="container mx-auto px-6">
            <h2 class="text-xl md:text-3xl font-serif font-light tracking-tighter mb-24 text-center italic text-stone-400 animate-on-scroll">"Une vision audacieuse de l'art numérique."</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-24">
               <!-- Témoignage 1 -->
               <article class="animate-on-scroll cursor-default group">
                  <div class="font-serif text-2xl md:text-3xl font-light text-white leading-snug mb-12 relative">
                     <span class="absolute -left-8 -top-4 text-stone-700 text-6xl italic group-hover:text-stone-500 transition-colors duration-500 opacity-50">"</span>
                     L'hybridation des compétences m'a permis de pousser des concepts visuels que je peux moi-même coder et optimiser.
                  </div>
                  <div class="flex items-center gap-6">
                     <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&auto=format&fit=crop" alt="Sophie L." class="w-12 h-12 rounded-full object-cover filter grayscale" />
                     <div class="font-sans text-[10px] uppercase tracking-[0.2em]">
                        <p class="text-white font-medium mb-1">Sophie L.</p>
                        <p class="text-stone-500">Creative Developer</p>
                     </div>
                  </div>
               </article>
               
               <!-- Témoignage 2 -->
               <article class="animate-on-scroll cursor-default group" style="animation-delay: 200ms;">
                  <div class="font-serif text-2xl md:text-3xl font-light text-white leading-snug mb-12 relative">
                     <span class="absolute -left-8 -top-4 text-stone-700 text-6xl italic group-hover:text-stone-500 transition-colors duration-500 opacity-50">"</span>
                     Nous n'apprenons pas seulement des outils, nous forgeons une culture esthétique et une exigence quasi obsessionnelle.
                  </div>
                  <div class="flex items-center gap-6">
                     <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&h=150&auto=format&fit=crop" alt="Thomas M." class="w-12 h-12 rounded-full object-cover filter grayscale" />
                     <div class="font-sans text-[10px] uppercase tracking-[0.2em]">
                        <p class="text-white font-medium mb-1">Thomas M.</p>
                        <p class="text-stone-500">Art Director</p>
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

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});
</script>

<style scoped>
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-on-scroll {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
