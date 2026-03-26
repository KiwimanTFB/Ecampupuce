const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
app.use(express.json());

/* ─────────────────────────────────────────────────────────────
   ROUTES API
───────────────────────────────────────────────────────────── */

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

/* ─── ROUTE PUBLIQUE (sans JWT) ──────────────────────────────
   GET /api/public/projets
   Query params optionnels :
     ?niveau=MMI1&semestre=S4&annee=2025&domaine=Design&limit=6
──────────────────────────────────────────────────────────── */
app.get("/api/public/projets", async (req, res) => {
  try {
    const { niveau, semestre, annee, domaine, limit } = req.query;

    // Construction dynamique des clauses WHERE
    const conditions = ["r.est_public = 1"];
    const params = [];

    if (niveau) {
      // MMI1 → BUT 1, MMI2 → BUT 2, MMI3 → BUT 3
      const niveauMap = { MMI1: "BUT 1", MMI2: "BUT 2", MMI3: "BUT 3" };
      const niveauDB = niveauMap[niveau] || niveau;
      conditions.push("s.niveau = ?");
      params.push(niveauDB);
    }
    if (semestre) {
      conditions.push("s.semestre = ?");
      params.push(semestre);
    }
    if (annee) {
      conditions.push("s.annee_univ = ?");
      params.push(annee);
    }
    if (domaine) {
      conditions.push("LOWER(r.domaine_activite) LIKE LOWER(?)");
      params.push(`%${domaine}%`);
    }

    const whereClause = conditions.join(" AND ");
    const limitClause = limit ? `LIMIT ${parseInt(limit, 10)}` : "";

    const sql = `
      SELECT
        r.id_rendu          AS id,
        r.chemin_fichier    AS image,
        COALESCE(r.tags, s.titre)  AS titre,
        r.domaine_activite,
        s.titre             AS sae_titre,
        s.semestre,
        s.niveau,
        s.annee_univ        AS annee,
        GROUP_CONCAT(u.prenom || ' ' || u.nom, ', ') AS etudiant
      FROM rendus r
      JOIN livrables  l  ON r.id_livrable = l.id_livrable
      JOIN sae        s  ON l.id_sae      = s.id_sae
      JOIN groupes    g  ON r.id_groupe   = g.id_groupe
      JOIN groupe_etudiants ge ON g.id_groupe = ge.id_groupe
      JOIN utilisateurs     u  ON ge.id_user  = u.id_user
      WHERE ${whereClause}
      GROUP BY r.id_rendu
      ORDER BY s.annee_univ DESC, r.id_rendu DESC
      ${limitClause}
    `;

    const rows = await db.allAsync(sql, params);

    // Post-traitement : calcul de l'aspectClass pour la Masonry Grid
    const aspectClasses = [
      "aspect-[4/5]",
      "aspect-[16/9]",
      "aspect-[1/1]",
      "aspect-[3/4]",
      "aspect-[16/9]",
      "aspect-[4/5]",
    ];
    const projects = rows.map((row, i) => ({
      ...row,
      aspectClass: aspectClasses[i % aspectClasses.length],
    }));

    res.json(projects);
  } catch (err) {
    console.error("❌ Erreur /api/public/projets :", err.message);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────
   ROUTES AUTH (routes privées existantes, à ajouter ici si besoin)
   Exemple placeholder :
───────────────────────────────────────────────────────────── */
// app.use('/api/auth', require('./routes/auth'));

/* ─────────────────────────────────────────────────────────────
   STATIC — Vue build (client/dist)
───────────────────────────────────────────────────────────── */
app.use(express.static(path.join(__dirname, "../client/dist")));

// SPA fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

/* ─────────────────────────────────────────────────────────────
   LANCEMENT
───────────────────────────────────────────────────────────── */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express démarré sur le port ${PORT}`);
});