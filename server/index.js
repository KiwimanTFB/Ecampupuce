require("dotenv").config();
const express = require("express");
const path = require("path");

// NOUVEAU : On importe sqlite3 et le wrapper de promesses sqlite
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
app.use(express.json());

// --- 1. BASE DE DONNÉES SÉCURISÉE (SQLITE) ---
let db;
async function initDB() {
  db = await open({
    // Adapte ce chemin selon où se trouve ton index.js par rapport au dossier bdd !
    // S'ils sont dans le même dossier : './bdd/structure.sqlite'
    filename: path.join(__dirname, "../bdd/structure.sqlite"), 
    driver: sqlite3.Database
  });
  console.log("✅ Connecté à SQLite avec succès !");
  
  // Active les clés étrangères (très important pour SQLite)
  await db.exec("PRAGMA foreign_keys = ON;");
}

// On lance la connexion au démarrage
initDB().catch(err => console.error("❌ Erreur SQLite :", err));


// --- 2. API RESTful ---
app.get("/api/health", (req, res) => res.json({ ok: true }));

// GET : Récupérer toutes les SAE
app.get("/api/sae", async (req, res) => {
  try {
    // CORRECTION : on utilise db.all() et on a directement les rows
    const rows = await db.all("SELECT * FROM sae ORDER BY annee_univ DESC, semestre ASC");
    res.json(rows);
  } catch (error) {
    console.error("Erreur GET /api/sae:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST : Créer une annonce
app.post("/api/annonces", async (req, res) => {
  try {
    const { id_sae, id_auteur, titre, contenu } = req.body;
    // Format ISO pour la date, c'est ce que SQLite préfère
    const date_publi = new Date().toISOString(); 
    
    // CORRECTION : on utilise db.run() pour les INSERT/UPDATE/DELETE
    const result = await db.run(
      "INSERT INTO annonces (id_sae, id_auteur, titre, contenu, date_publi) VALUES (?, ?, ?, ?, ?)",
      [id_sae, id_auteur, titre, contenu, date_publi]
    );
    
    // CORRECTION : l'ID généré s'appelle result.lastID avec SQLite
    res.status(201).json({ message: "Annonce ajoutée", id: result.lastID });
  } catch (error) {
    console.error("Erreur POST /api/annonces:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// --- 3. VUE BUILD (Client/dist) - NE PAS TOUCHER ---
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get(/.*/, (req, res) => {
 res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});


// --- 4. LANCEMENT ---
const PORT = process.env.PORT || 3000; // J'ai ajouté un fallback sur 3000 au cas où PORT soit vide
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express démarré sur le port ${PORT}`);
});