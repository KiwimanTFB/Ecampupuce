const express = require("express");
const path = require("path");

const app = express();

// API
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Vue build (client/dist)
app.use(express.static(path.join(__dirname, "../client/dist")));

// CORRECTION ICI : /.*/ est une RegExp pure, SANS guillemets
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Écoute le port Hostinger
app.listen(process.env.PORT);

// --- 4. LANCEMENT ---
const PORT = process.env.PORT || 3000; // J'ai ajouté un fallback sur 3000 au cas où PORT soit vide
app.listen(PORT, () => {
    console.log(`🚀 Serveur Express démarré sur le port ${PORT}`);
});