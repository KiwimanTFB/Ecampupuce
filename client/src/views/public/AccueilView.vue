<template>
  <div class="text-neutral-900 dark:text-stone-200 bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
    <main>
      <!-- Hero Section Minimalist & Scrollytelling -->
      <section class="relative flex flex-col justify-center pt-40 pb-24 container mx-auto px-6">
        
        <!-- Background Blob / Glow -->
        <div class="absolute top-1/4 left-1/4 w-[50rem] h-[50rem] bg-blue-500/5 dark:bg-stone-800/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>

        <!-- Parallax Floating Images -->
        <div class="absolute inset-0 pointer-events-none hidden md:block z-0">
           <!-- Image 1 : Top Right -->
           <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600" 
                class="absolute top-[15%] right-[10%] w-[250px] aspect-[3/4] object-cover filter grayscale-[30%] opacity-30 dark:opacity-80 transition-opacity duration-500"
                :style="{ transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * 0.02}deg)` }" />
           
           <!-- Image 2 : Bottom Left -->
           <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600" 
                class="absolute bottom-[10%] left-[5%] w-[320px] aspect-video object-cover filter grayscale-[40%] opacity-20 dark:opacity-60 transition-opacity duration-500"
                :style="{ transform: `translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.01}deg)` }" />
                
           <!-- Image 3 : Center Right (très lent) -->
           <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600" 
                class="absolute top-[50%] right-[30%] w-[200px] aspect-square object-cover filter grayscale-[50%] opacity-15 dark:opacity-40 mix-blend-screen transition-opacity duration-500"
                :style="{ transform: `translateY(${scrollY * -0.5}px)` }" />
        </div>

        <div class="relative z-10 w-full mt-24 flex flex-col gap-12">
           <p class="text-blue-600 dark:text-blue-400 tracking-[0.3em] uppercase text-xs opacity-0 animate-fade-in-up font-sans font-bold">Département MMI</p>
           
           <!-- Titre Tech IUT -->
           <h1 class="text-5xl md:text-7xl lg:text-[7rem] font-sans font-extrabold leading-[1.05] tracking-tighter opacity-0 animate-fade-in-up animation-delay-300 max-w-5xl text-neutral-950 dark:text-white transition-colors duration-500">
             Repousser les limites du <br/>
             <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">numérique.</span>
           </h1>
           
           <!-- Clutter visuel tech: bouton plein et bordure gradient -->
           <div class="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 opacity-0 animate-fade-in-up animation-delay-600 max-w-3xl my-12 border-l-4 border-blue-600/20 dark:border-blue-500/30 pl-8">
              <p class="font-sans text-neutral-600 dark:text-neutral-300 text-sm md:text-base leading-relaxed max-w-md font-medium transition-colors duration-500">
                 Une synergie pure entre ingénierie complexe et design d'avant-garde. Nous formons les talents qui façonnent l'avenir du web productif.
              </p>
              
              <router-link to="/vitrine" class="group flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-xs uppercase tracking-wider font-sans font-bold hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1 transition-all duration-300 shrink-0" aria-label="Explorer nos Projets">
                 Explorer nos Projets
                 <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </router-link>
           </div>
        </div>
      </section>

      <!-- Manifesto Scrollytelling -->
      <section class="py-40 border-t border-neutral-200 dark:border-white/5 relative z-10 flex flex-col items-center transition-colors duration-500">
        <div class="container mx-auto px-6 flex flex-col items-center">
            
            <div class="h-40 w-[2px] bg-gradient-to-b from-blue-600/30 dark:from-blue-500/50 to-transparent mb-16 animate-on-scroll"></div>

            <h2 class="text-3xl md:text-5xl lg:text-5xl font-sans font-extrabold leading-tight text-center max-w-5xl mx-auto animate-on-scroll cursor-default text-neutral-900 dark:text-white transition-colors duration-500">
               Nous concevons un web <span class="text-blue-600 dark:text-blue-400">intelligent</span>, immersif et méticuleusement architecturé, où chaque ligne de code porte une intention.
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-16 mt-40 w-full border-t border-neutral-200 dark:border-white/5 pt-20 transition-colors duration-500">
               <article class="animate-on-scroll flex flex-col items-start group cursor-default">
                  <span class="text-neutral-300 dark:text-neutral-800 font-sans font-black text-6xl tracking-tighter mb-6 block group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-500">01.</span>
                  <h3 class="text-xs uppercase tracking-widest font-sans font-bold text-neutral-900 dark:text-white mb-6">Esthétisme</h3>
                  <p class="text-neutral-600 dark:text-stone-400 font-sans font-medium dark:font-normal leading-relaxed text-sm">Le refus du compromis visuel. Une direction artistique pointue, inspirée par le modernisme et les interfaces ergonomiques contemporaines.</p>
               </article>
               <article class="animate-on-scroll flex flex-col items-start group cursor-default" style="animation-delay: 150ms;">
                  <span class="text-neutral-300 dark:text-neutral-800 font-sans font-black text-6xl tracking-tighter mb-6 block group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-500">02.</span>
                  <h3 class="text-xs uppercase tracking-widest font-sans font-bold text-neutral-900 dark:text-white mb-6">Ingénierie</h3>
                  <p class="text-neutral-600 dark:text-stone-400 font-sans font-medium dark:font-normal leading-relaxed text-sm">Des architectures front-end robustes, des stacks JavaScript réactives et un code pur pensé exclusivement pour la performance et la scalabilité.</p>
               </article>
               <article class="animate-on-scroll flex flex-col items-start group cursor-default" style="animation-delay: 300ms;">
                  <span class="text-neutral-300 dark:text-neutral-800 font-sans font-black text-6xl tracking-tighter mb-6 block group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-500">03.</span>
                  <h3 class="text-xs uppercase tracking-widest font-sans font-bold text-neutral-900 dark:text-white mb-6">Data & Logique</h3>
                  <p class="text-neutral-600 dark:text-stone-400 font-sans font-medium dark:font-normal leading-relaxed text-sm">L'art de l'intégration continue, des bases de données complexes et de la sécurité. Répondant aux standards les plus stricts de l'industrie.</p>
               </article>
            </div>
            
        </div>
      </section>
      
      <!-- Section Stats Dashboard -->
      <section class="py-32 bg-neutral-50 dark:bg-[#050505] border-t border-neutral-200 dark:border-white/5 relative z-10 w-full stats-section animate-on-scroll transition-colors duration-500">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             <!-- Card 1 -->
             <article class="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors shadow-sm dark:shadow-none flex flex-col items-center justify-center gap-4">
                <span class="text-6xl font-sans font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"><span v-text="count1"></span></span>
                <h3 class="uppercase tracking-widest text-xs font-bold text-neutral-500 dark:text-neutral-500">SAE Professionnalisantes</h3>
             </article>

             <!-- Card 2 -->
             <article class="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors shadow-sm dark:shadow-none flex flex-col items-center justify-center gap-4">
                <span class="text-6xl font-sans font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"><span v-text="count2"></span></span>
                <h3 class="uppercase tracking-widest text-xs font-bold text-neutral-500 dark:text-neutral-500">Années d'innovation</h3>
             </article>

             <!-- Card 3 -->
             <article class="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors shadow-sm dark:shadow-none flex flex-col items-center justify-center gap-4">
                <span class="text-6xl font-sans font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"><span v-text="count3"></span>%</span>
                <h3 class="uppercase tracking-widest text-xs font-bold text-neutral-500 dark:text-neutral-500">Tech-Forward</h3>
             </article>

          </div>
        </div>
      </section>
      
      <!-- Outro Section Découverte Tech -->
      <section class="py-20 bg-neutral-50 dark:bg-[#050505] border-t border-neutral-200 dark:border-white/5 relative z-10 w-full flex flex-col items-center text-center px-6 transition-colors duration-500">
        <h2 class="text-4xl md:text-6xl font-sans font-extrabold text-neutral-950 dark:text-white tracking-tighter mb-10 animate-on-scroll transition-colors duration-500">
          L'expérience continue.
        </h2>
        <router-link to="/vitrine" class="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-md hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 animate-on-scroll" style="animation-delay: 200ms;" aria-label="Explorer la Vitrine Web MMI">
          Explorer la Vitrine Web
        </router-link>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const scrollY = ref(0);
const statsVisible = ref(false);
const count1 = ref(0);
const count2 = ref(0);
const count3 = ref(0);

const animateValue = (obj, start, end, duration) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.value = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        if (entry.target.classList.contains('stats-section') && !statsVisible.value) {
           statsVisible.value = true;
           animateValue(count1, 0, 8, 2000);
           animateValue(count2, 0, 3, 2000);
           animateValue(count3, 0, 100, 2000);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(-30px, 50px) scale(1.1); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 15s infinite alternate ease-in-out;
}
.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-600 { animation-delay: 0.6s; }
</style>
