<template>
  <footer class="bg-[#0a0a0a] pt-32 pb-12 border-t border-white/5 relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-stone-500/30 to-transparent"></div>
    <div class="max-w-[1400px] mx-auto px-6 md:px-12">
      
      <div class="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
        <div class="max-w-2xl">
           <h2 class="text-5xl md:text-7xl font-serif text-white font-light tracking-tighter leading-tight mb-8">
             Créons, <br/><span class="italic text-stone-400">ensemble.</span>
           </h2>
           <p class="text-stone-400 font-light text-lg max-w-md leading-relaxed font-sans">
             La vitrine d'excellence MMI. Une approche avant-gardiste de la création numérique, du code et de l'image.
           </p>
        </div>
        
        <div class="flex gap-16 text-sm font-sans">
          <div>
            <h4 class="text-white font-medium uppercase tracking-[0.2em] mb-6 text-xs">Navigation</h4>
            <ul class="space-y-4 font-light text-stone-400">
              <li><router-link to="/accueil" class="hover:text-white hover:italic transition-all">Accueil</router-link></li>
              <li><router-link to="/vitrine" class="hover:text-white hover:italic transition-all">Projets</router-link></li>
              <li><router-link to="/but" class="hover:text-white hover:italic transition-all">Studio</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-medium uppercase tracking-[0.2em] mb-6 text-xs">Social</h4>
            <ul class="space-y-4 font-light text-stone-400">
              <li><a href="#" class="hover:text-white hover:italic transition-all">Awwwards</a></li>
              <li><a href="#" class="hover:text-white hover:italic transition-all">Instagram</a></li>
              <li><a href="#" class="hover:text-white hover:italic transition-all">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-stone-500 text-[10px] tracking-widest uppercase font-sans">
        <p>&copy; 2026 e.campupuce</p>
        <div class="mt-4 md:mt-0 flex space-x-8">
          <a href="#" class="hover:text-white transition-colors">Mentions légales</a>
          <a href="#" class="hover:text-white transition-colors">Confidentialité</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
