<template>
  <div class="sae-container">
    <h2>Liste des SAE (Semestres & Années)</h2>
    
    <div v-for="sae in saes" :key="sae.id" class="sae-card">
      <h3>{{ sae.titre }} <span class="badge">{{ sae.semestre }}</span></h3>
      <p>{{ sae.description }}</p>
      <p><strong>À rendre le :</strong> {{ sae.dateRendu }}</p>
      <button>Voir détails</button> </div>
  </div>
</template>

<script>
export default {
  name: 'SaeListe',
  data() {
    return {
      saes: [] // Liste vide au départ
    }
  },
  mounted() {
    // Appel à l'API Express au chargement de la page 
    fetch('http://localhost:3000/api/saes')
      .then(response => response.json())
      .then(data => {
        this.saes = data; // On remplit la liste avec les données du serveur
      })
      .catch(error => console.error('Erreur:', error));
  }
}
</script>

<style scoped>
.sae-container {
  max-width: 800px;
  margin: 0 auto;
}
.sae-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.badge {
  background-color: #42b983;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8em;
}
</style>