<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderPublic from './components/public/HeaderPublic.vue'
import FooterPublic from './components/public/FooterPublic.vue'

const route = useRoute()

// Toutes les routes publiques (vitrine + inscription)
const publicRoutes = [
  'accueil', 'nos-projets', 'notre-but', 'campus',
  'parcoursup', 'candidature', 'integration'
]
const isPublicRoute = computed(() => publicRoutes.includes(route.name))
</script>

<template>
  <!-- Layout Public - Vitrine -->
  <div v-if="isPublicRoute" class="vitrine-layout flex flex-col bg-white dark:bg-[#0a0a0a] w-full">
    <HeaderPublic />
    <div class="flex-grow w-full">
      <router-view></router-view>
    </div>
    <FooterPublic />
  </div>
  
  <!-- Layout Privé/Système -->
  <router-view v-else></router-view>
</template>

<style>
html, body { 
  height: auto !important; 
  overflow-y: auto !important; 
  overflow-x: hidden !important;
}
</style>
