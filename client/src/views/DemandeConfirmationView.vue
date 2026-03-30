<template>
  <div class="confirm-container">
      <div class="confirm-card">
          <h2>Demande Envoyée</h2>
          <p>Votre demande de création de compte a bien été enregistrée.</p>
          <p>Elle est en attente de validation par un administrateur. Vous serez averti(e) par la suite.</p>
          <br>
          <router-link to="/" class="btn btn-primary">Retour à l'accueil</router-link>
      </div>
  </div>
</template>
<style scoped>
.confirm-container { display:flex; align-items:center; justify-content:center; min-height: 100vh; flex: 1; width: 100%; background:var(--bg-app); font-family: sans-serif; }
.confirm-card { background: white; padding: 40px; border-radius: 8px; text-align: center; max-width: 500px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; }
h2 { color: var(--accent-brand); margin-bottom: 20px;}
</style>
