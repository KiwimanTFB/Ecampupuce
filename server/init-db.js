const db = require('./db');

function initDB() {
    console.log('Initialisation de la base SQLite...');

    db.serialize(() => {
        // Activer les foreign keys
        db.run('PRAGMA foreign_keys = ON');

        // Création des tables v2
        const tables = [
            `CREATE TABLE IF NOT EXISTS utilisateurs (id_user INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, prenom TEXT NOT NULL, email TEXT NOT NULL UNIQUE, mot_de_passe TEXT NOT NULL, role TEXT NOT NULL, groupe_td TEXT, annee_promo TEXT);`,
            `CREATE TABLE IF NOT EXISTS sae (id_sae INTEGER PRIMARY KEY AUTOINCREMENT, titre TEXT NOT NULL, description TEXT NOT NULL, semestre TEXT NOT NULL, annee_univ TEXT NOT NULL, date_debut DATETIME NOT NULL, date_fin DATETIME, groupe TEXT, competences TEXT, consignes TEXT, image_mise_en_avant TEXT, statut TEXT DEFAULT 'En attente', niveau TEXT, vignette_path TEXT, consignes_paths TEXT, code TEXT);`,
            `CREATE TABLE IF NOT EXISTS competences (id_competence INTEGER PRIMARY KEY AUTOINCREMENT, nom_competence TEXT NOT NULL);`,
            `CREATE TABLE IF NOT EXISTS sae_competences (id_sae INTEGER NOT NULL, id_competence INTEGER NOT NULL, PRIMARY KEY (id_sae, id_competence), FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE, FOREIGN KEY (id_competence) REFERENCES competences (id_competence) ON DELETE CASCADE);`,
            `CREATE TABLE IF NOT EXISTS groupes (id_groupe INTEGER PRIMARY KEY AUTOINCREMENT, id_sae INTEGER NOT NULL, nom_groupe TEXT NOT NULL, FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE);`,
            `CREATE TABLE IF NOT EXISTS groupe_etudiants (id_groupe INTEGER NOT NULL, id_user INTEGER NOT NULL, PRIMARY KEY (id_groupe, id_user), FOREIGN KEY (id_groupe) REFERENCES groupes (id_groupe) ON DELETE CASCADE, FOREIGN KEY (id_user) REFERENCES utilisateurs (id_user) ON DELETE CASCADE);`,
            `CREATE TABLE IF NOT EXISTS livrables (id_livrable INTEGER PRIMARY KEY AUTOINCREMENT, id_sae INTEGER NOT NULL, titre_livrable TEXT NOT NULL, date_limite DATETIME NOT NULL, FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE);`,
            `CREATE TABLE IF NOT EXISTS rendus (id_rendu INTEGER PRIMARY KEY AUTOINCREMENT, id_livrable INTEGER NOT NULL, id_groupe INTEGER NOT NULL, chemin_fichier TEXT NOT NULL, date_depot DATETIME DEFAULT CURRENT_TIMESTAMP, est_evalue INTEGER DEFAULT 0, note_attribuee REAL, commentaire_prof TEXT, est_public INTEGER DEFAULT 0, tags TEXT, domaine_activite TEXT, FOREIGN KEY (id_livrable) REFERENCES livrables (id_livrable) ON DELETE CASCADE, FOREIGN KEY (id_groupe) REFERENCES groupes (id_groupe) ON DELETE CASCADE);`,
            `CREATE TABLE IF NOT EXISTS documents (id_document INTEGER PRIMARY KEY AUTOINCREMENT, id_sae INTEGER NOT NULL, nom_fichier TEXT NOT NULL, chemin_fichier TEXT NOT NULL, type_doc TEXT NOT NULL, FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE);`,
            `CREATE TABLE IF NOT EXISTS annonces (id_annonce INTEGER PRIMARY KEY AUTOINCREMENT, id_auteur INTEGER NOT NULL, titre TEXT NOT NULL, contenu TEXT NOT NULL, date_publi DATETIME DEFAULT CURRENT_TIMESTAMP, cible_type TEXT, cible_id INTEGER, media_joint TEXT, FOREIGN KEY (id_auteur) REFERENCES utilisateurs (id_user) ON DELETE CASCADE);`,
            `CREATE TABLE IF NOT EXISTS demandes_comptes (id_demande INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, prenom TEXT NOT NULL, email TEXT NOT NULL UNIQUE, telephone TEXT NOT NULL, mot_de_passe TEXT NOT NULL, role TEXT NOT NULL, numero_etudiant TEXT, statut TEXT DEFAULT 'En attente', date_demande DATETIME DEFAULT CURRENT_TIMESTAMP);`
        ];

        tables.forEach((query, index) => {
            db.run(query, (err) => {
                if (err) console.error(`❌ Erreur création table (index ${index}):`, err.message);
                else console.log(`✅ Table créée (index ${index}).`);
            });
        });

        // Insert Default Admin User
        const password_hash = require('bcrypt').hashSync('admin123', 10);
        db.run(`INSERT OR IGNORE INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES ('Super', 'Admin', 'admin@ecampupuce.fr', ?, 'admin')`, [password_hash], (err) => {
            if (err) console.error("❌ Erreur de création de l'administrateur :", err.message);
            else console.log("✅ Administrateur par défaut injecté / vérifié.");
        });

        console.log('✅ Initialisation SQLite terminée !');
    });
}

// Exécuter si lancé directement (node init-db.js)
if (require.main === module) {
    initDB();
}

module.exports = initDB;
