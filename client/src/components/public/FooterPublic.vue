<template>
  <footer class="w-full bg-[#050505] border-t border-white/8 font-sans">
    <!-- Ligne principale -->
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 py-7">

        <!-- Logo -->
        <router-link to="/" class="text-white font-black tracking-tight hover:text-blue-400 transition-colors whitespace-nowrap" aria-label="Ecampupuce — Accueil">
          Ecampupuce<span class="text-blue-500">.</span>
        </router-link>

        <!-- Navigation rapide -->
        <nav class="flex flex-wrap items-center justify-center gap-x-7 gap-y-2" aria-label="Navigation rapide - pied de page">
          <router-link to="/"                   class="footer-link">Accueil</router-link>
          <router-link to="/projets"             class="footer-link">Projets</router-link>
          <router-link to="/but"                 class="footer-link">Le BUT</router-link>
          <router-link to="/inscription/parcoursup" class="footer-link">Inscription</router-link>
          <router-link to="/campus#contact"      class="footer-link">Contact</router-link>
        </nav>

        <!-- Réseaux + légal -->
        <div class="flex items-center gap-5">
          <!-- Réseaux sociaux — icônes stroke (plus légères) -->
          <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram MMI" class="social-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn MMI" class="social-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a href="https://github.com/" target="_blank" rel="noopener" aria-label="GitHub MMI" class="social-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
            </svg>
          </a>

          <span class="w-px h-4 bg-white/15 hidden sm:block"></span>

          <!-- Mentions légales -->
          <a href="#" class="text-[10px] text-white/25 hover:text-white/60 uppercase tracking-widest font-medium transition-colors">Légal</a>
        </div>
      </div>
    </div>

    <!-- Ligne de copyright -->
    <div class="border-t border-white/5">
      <div class="container mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p class="text-[10px] text-white/20 tracking-wide">© {{ currentYear }} Ecampupuce — IUT Paris-Saclay · Département MMI Vélizy</p>
        <p class="text-[10px] text-white/15 tracking-wide hidden sm:block">Fait avec ♥ par et pour les étudiants MMI</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer-link {
  font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
  color: rgba(255,255,255,0.35); text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover { color: rgba(255,255,255,0.85); }

.social-icon {
  color: rgba(255,255,255,0.3);
  transition: color 0.2s, transform 0.2s;
  display: flex; align-items: center;
}
.social-icon:hover { color: rgba(255,255,255,0.85); transform: translateY(-1px); }
</style>
