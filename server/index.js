require("dotenv").config(); // Charge le fichier .env
const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();

// TRÈS IMPORTANT : Permet à Express de lire le JSON envoyé par Vue (pour le POST)
app.use(express.json());

// --- 1. BASE DE DONNÉES SÉCURISÉE ---
// C'est ICI la correction : on utilise process.env pour lire ton fichier .env !
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Petit test de connexion au démarrage
pool.getConnection()
  .then(() => console.log("✅ Connecté à MySQL avec succès !"))
  .catch((err) => console.error("❌ Erreur MySQL :", err.message || err));


// --- 2. API RESTful ---
app.get("/api/health", (req, res) => res.json({ ok: true }));

// GET : Récupérer toutes les SAE
app.get("/api/sae", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM sae ORDER BY annee_univ DESC, semestre ASC");
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
    const date_publi = new Date();
    
    const [result] = await pool.query(
      "INSERT INTO annonces (id_sae, id_auteur, titre, contenu, date_publi) VALUES (?, ?, ?, ?, ?)",
      [id_sae, id_auteur, titre, contenu, date_publi]
    );
    res.status(201).json({ message: "Annonce ajoutée", id: result.insertId });
  } catch (error) {
    console.error("Erreur POST /api/annonces:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// --- 3. VUE BUILD (Client/dist) - NE PAS TOUCHER ---
app.use(express.static(path.join(__dirname, "../client/dist")));

// CORRECTION ICI : /.*/ est une RegExp pure, SANS guillemets
app.get(/.*/, (req, res) => {
 res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// --- 4. LANCEMENT ---
// Écoute le port Hostinger (ou 3000 en local sur ton PC)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express démarré sur le port ${PORT}`);
});