<template>
  <div class="min-h-screen bg-[#0a0a0a] text-stone-200">
    <main class="pt-40 pb-0">
      
      <section class="max-w-[1400px] mx-auto px-6 md:px-12 mb-32">
         <p class="text-stone-500 tracking-[0.3em] uppercase text-xs mb-8 font-sans font-medium animate-fade-in-up">L'Espace</p>
         <h1 class="text-6xl md:text-8xl font-serif font-light leading-none tracking-tighter mb-12 animate-fade-in-up" style="animation-delay: 100ms;">
           Le <span class="italic text-stone-400">Campus.</span>
         </h1>
      </section>

      <!-- Galerie Awwwards Parallaxe Asymétrique -->
      <section class="max-w-[1400px] mx-auto px-6 md:px-12 mb-40">
         <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            
            <!-- Image 1 -->
            <div class="md:col-span-7 animate-on-scroll group cursor-default">
               <div class="relative overflow-hidden aspect-[4/3] bg-[#0f0f0f]">
                  <img src="https://images.unsplash.com/photo-1598425237654-4fb05a4151a6?q=80&w=1200&auto=format&fit=crop" class="w-full h-full object-cover filter grayscale-[40%] contrast-125 transform group-hover:scale-105 transition-transform duration-[2s] ease-out" alt="Studio" />
               </div>
               <div class="mt-6 flex justify-between items-start font-sans border-t border-white/10 pt-4">
                  <h3 class="text-lg text-white font-medium">Plateau Tournage</h3>
                  <span class="text-[10px] text-stone-500 uppercase tracking-[0.2em] w-1/2 text-right">Équipement Cinéma & Lumières</span>
               </div>
            </div>
            
            <!-- Context Text -->
            <div class="md:col-span-5 flex flex-col justify-center animate-on-scroll" style="animation-delay: 200ms;">
               <h2 class="text-3xl font-serif font-light italic text-white mb-8">Où l'espace devient matière à création.</h2>
               <p class="font-sans text-stone-400 text-sm leading-relaxed font-light mb-12">
                 Des salles machines sur-équipées aux espaces de coworking minimalistes, chaque mètre carré du campus est pensé pour stimuler la rigueur et l'imagination.
               </p>
            </div>
            
            <!-- Image 2 -->
            <div class="md:col-span-5 md:mt-24 animate-on-scroll group cursor-default">
               <div class="relative overflow-hidden aspect-square bg-[#0f0f0f]">
                  <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover filter grayscale-[40%] contrast-125 transform group-hover:scale-105 transition-transform duration-[2s] ease-out" alt="Macs" />
               </div>
               <div class="mt-6 flex justify-between items-start font-sans border-t border-white/10 pt-4">
                  <h3 class="text-lg text-white font-medium">Laboratoires Créatifs</h3>
                  <span class="text-[10px] text-stone-500 uppercase tracking-[0.2em] w-1/2 text-right">Stations Apple & PC</span>
               </div>
            </div>
            
            <!-- Image 3 -->
            <div class="md:col-span-7 animate-on-scroll group cursor-default">
               <div class="relative overflow-hidden aspect-[16/9] bg-[#0f0f0f]">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop" class="w-full h-full object-cover filter grayscale-[40%] contrast-125 transform group-hover:scale-105 transition-transform duration-[2s] ease-out" alt="FabLab" />
               </div>
               <div class="mt-6 flex justify-between items-start font-sans border-t border-white/10 pt-4">
                  <h3 class="text-lg text-white font-medium">FabLab & 3D</h3>
                  <span class="text-[10px] text-stone-500 uppercase tracking-[0.2em] w-1/2 text-right">Impression 3D & UX Labs</span>
               </div>
            </div>

         </div>
      </section>

      <!-- Minimal Map Section -->
      <section class="bg-[#050505] py-32 border-t border-white/5 relative">
         <div class="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <div class="animate-on-scroll">
               <h2 class="text-4xl md:text-5xl font-serif font-light tracking-tighter mb-12">Situation.</h2>
               <div class="h-px w-full bg-white/10 mb-12"></div>
               
               <div class="flex flex-col gap-12 font-sans">
                  <div>
                     <h4 class="text-[10px] text-stone-500 uppercase tracking-[0.2em] mb-4 font-bold">Adresse</h4>
                     <p class="text-white text-lg font-light leading-relaxed">
                        123 Avenue de l'Innovation<br/>
                        75000 Tech City, <span class="italic text-stone-400">France</span>
                     </p>
                  </div>
                  <div>
                     <h4 class="text-[10px] text-stone-500 uppercase tracking-[0.2em] mb-4 font-bold">Horaires</h4>
                     <p class="text-white text-lg font-light leading-relaxed">
                        08:00 — 19:00<br/>
                        <span class="italic text-stone-400">Lundi au Vendredi</span>
                     </p>
                  </div>
               </div>
            </div>
            
            <div class="relative h-[600px] w-full bg-[#0f0f0f] overflow-hidden grayscale animate-on-scroll opacity-80 hover:opacity-100 transition-opacity duration-1000 border border-white/5">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.991625693759!2d2.2922926156743895!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1647864359235!5m2!1sfr!2sfr" width="100%" height="100%" style="border:0; filter: contrast(120%);" allowfullscreen="" loading="lazy"></iframe>
                <!-- Minimal Override Pin -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                   <div class="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center bg-[#0a0a0a]/50 backdrop-blur-md animate-pulse">
                      <div class="w-2 h-2 bg-white rounded-full"></div>
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
