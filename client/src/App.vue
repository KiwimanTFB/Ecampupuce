<template>
  <div id="app">
    <header>
      <h1>Ecampupuce - Gestion des SAE</h1>
    </header>
    <main>
      <SaeListe />
    </main>
  </div>
</template>

<script>
import SaeListe from './components/SaeListe.vue'

export default {
  name: 'App',
  components: {
    SaeListe
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>