<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderPublic from './components/public/HeaderPublic.vue'
import FooterPublic from './components/public/FooterPublic.vue'

const route = useRoute()

// Liste des routes utilisant le layout public (les noms dans router/index.js)
const publicRoutes = ['accueil', 'vitrine', 'notre-but', 'campus']
const isPublicRoute = computed(() => publicRoutes.includes(route.name))
</script>

<template>
  <!-- Layout Public - Vitrine -->
  <div v-if="isPublicRoute" class="vitrine-layout min-h-screen flex flex-col bg-[#0a0a0a] overflow-x-hidden w-full">
    <HeaderPublic />
    <div class="flex-grow w-full">
      <router-view></router-view>
    </div>
    <FooterPublic />
  </div>
  
  <!-- Layout Privé/Système - Préservation du CSS existant (style.css) -->
  <router-view v-else></router-view>
</template>

<style scoped>
</style>
