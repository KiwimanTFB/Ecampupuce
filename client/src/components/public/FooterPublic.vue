<template>
  <footer class="w-full bg-neutral-950 py-12 border-t border-white/10 font-sans">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        <!-- Col 1 : Identité -->
        <div class="flex flex-col gap-4 text-neutral-400">
          <router-link to="/" class="text-2xl font-black tracking-tight text-white transition-colors duration-300 hover:text-blue-500 inline-block" aria-label="Retour à l'accueil Ecampupuce">
             Ecampupuce<span class="text-blue-600">.</span>
          </router-link>
          <p class="text-sm leading-relaxed">
            L'excellence numérique du département MMI Vélizy.
          </p>
          <div class="flex items-center gap-4 mt-2">
            <a href="#" aria-label="GitHub" class="hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg></a>
            <a href="#" aria-label="LinkedIn" class="hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            <a href="#" aria-label="Instagram" class="hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            <a href="#" aria-label="Discord" class="hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg></a>
          </div>
        </div>

        <!-- Col 2 : Navigation -->
        <div class="flex flex-col text-neutral-400">
          <h2 class="text-white font-bold mb-4 font-sans tracking-wide">Explorer</h2>
          <nav aria-label="Menu du pied de page - Explorer" class="flex flex-col gap-3">
            <router-link to="/" class="hover:text-white transition-colors text-sm" aria-label="Aller à l'Accueil">Accueil</router-link>
            <router-link to="/vitrine" class="hover:text-white transition-colors text-sm" aria-label="Découvrir les Projets">Vitrine</router-link>
            <router-link to="/campus" class="hover:text-white transition-colors text-sm" aria-label="Découvrir le Campus">Campus</router-link>
            <router-link to="/but" class="hover:text-white transition-colors text-sm" aria-label="Découvrir le BUT">Notre BUT</router-link>
          </nav>
        </div>

        <!-- Col 3 : Légal -->
        <div class="flex flex-col text-neutral-400">
          <h2 class="text-white font-bold mb-4 font-sans tracking-wide">Légal</h2>
          <nav aria-label="Menu du pied de page - Légal" class="flex flex-col gap-3">
            <a href="#" class="hover:text-white transition-colors text-sm" aria-label="Consulter les mentions légales">Mentions légales</a>
            <a href="#" class="hover:text-white transition-colors text-sm" aria-label="Consulter la confidentialité">Confidentialité</a>
            <a href="#" class="hover:text-white transition-colors text-sm" aria-label="Consulter l'accessibilité">Accessibilité</a>
          </nav>
        </div>

        <!-- Col 4 : Localisation -->
        <div class="flex flex-col sm:col-span-2 lg:col-span-1 text-neutral-400 lg:items-start items-start">
          <h2 class="text-white font-bold mb-4 font-sans tracking-wide">Campus Vélizy</h2>
          <address class="not-italic text-sm leading-relaxed mb-4">
            10-12 Avenue de l'Europe <br>
            78140 Vélizy-Villacoublay
          </address>
          <a href="https://maps.google.com/?q=IUT+de+Velizy+10-12+Avenue+de+l'Europe+78140+Velizy-Villacoublay" 
             target="_blank" 
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs hover:bg-white/5 hover:border-white/30 text-white transition-all duration-300 w-max bg-neutral-900"
             aria-label="Nous trouver sur Google Maps">
             📍 Itinéraire
          </a>
        </div>
        
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
