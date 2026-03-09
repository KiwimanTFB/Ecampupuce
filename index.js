require("dotenv").config();
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();

// TRÈS IMPORTANT : Permet à Express de lire les requêtes POST/PUT
app.use(express.json()); 

// --- 1. CONNEXION À LA BASE DE DONNÉES ---
let db;
async function initDB() {
  db = await open({
    filename: path.join(__dirname, "../bdd/structure.sqlite"), 
    driver: sqlite3.Database
  });
  console.log("✅ Connecté à SQLite avec succès !");
  await db.exec("PRAGMA foreign_keys = ON;");
}
initDB().catch(err => console.error("❌ Erreur SQLite :", err));

// --- 2. API RESTful ---

app.get("/api/health", (req, res) => res.json({ ok: true }));

// ==========================================
// ROUTES : UTILISATEURS
// ==========================================

// 1. READ ALL (GET)
app.get("/api/utilisateurs", async (req, res) => {
  try {
    const utilisateurs = await db.all("SELECT id_user, nom, prenom, email, role, groupe_td FROM utilisateurs");
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

// 2. READ ONE (GET)
app.get("/api/utilisateurs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const utilisateur = await db.get("SELECT id_user, nom, prenom, email, role, groupe_td FROM utilisateurs WHERE id_user = ?", [id]);
    if (!utilisateur) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 3. CREATE (POST)
app.post("/api/utilisateurs", async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, role, groupe_td } = req.body;
    const result = await db.run(
      "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, groupe_td) VALUES (?, ?, ?, ?, ?, ?)",
      [nom, prenom, email, mot_de_passe, role, groupe_td]
    );
    res.status(201).json({ message: "Utilisateur créé avec succès", id_user: result.lastID });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: "Cet email est déjà utilisé." });
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
});

// 4. UPDATE (PUT)
app.put("/api/utilisateurs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { nom, prenom, email, role, groupe_td } = req.body;
    const result = await db.run(
      "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, role = ?, groupe_td = ? WHERE id_user = ?",
      [nom, prenom, email, role, groupe_td, id]
    );
    if (result.changes === 0) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// 5. DELETE (DELETE)
app.delete("/api/utilisateurs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.run("DELETE FROM utilisateurs WHERE id_user = ?", [id]);
    if (result.changes === 0) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});


// --- 3. VUE BUILD (Client/dist) ---
// (À remettre ici si tu l'avais effacé)
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get(/.*/, (req, res) => {
 res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});


// --- 4. LANCEMENT DU SERVEUR (TOUJOURS À LA FIN !) ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express démarré sur le port ${PORT}`);
});
