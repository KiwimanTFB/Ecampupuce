const db = require('./db');

function initDB() {
    console.log('Initialisation de la base SQLite...');

    db.serialize(() => {
        // Activer les foreign keys
        // Suppression des tables pour forcer la mise à jour du schéma (PRÉCAUTION MISSION)
        db.run('DROP TABLE IF EXISTS rendus');
        db.run('DROP TABLE IF EXISTS suivi_etudiant_sae');

        db.run('PRAGMA foreign_keys = ON');

        // Création des tables v2
        const tables = {
            "utilisateurs": `CREATE TABLE IF NOT EXISTS utilisateurs (id_user INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, prenom TEXT NOT NULL, email TEXT NOT NULL UNIQUE, mot_de_passe TEXT NOT NULL, role TEXT NOT NULL, groupe_td TEXT, annee_promo TEXT);`,
            "sae": `CREATE TABLE IF NOT EXISTS sae (id_sae INTEGER PRIMARY KEY AUTOINCREMENT, titre TEXT NOT NULL, description TEXT NOT NULL, semestre TEXT NOT NULL, annee_univ TEXT NOT NULL, date_debut DATETIME NOT NULL, date_fin DATETIME, date_limite DATETIME, type_groupe TEXT, groupe TEXT, competences TEXT, consignes TEXT, image_mise_en_avant TEXT, statut TEXT DEFAULT 'En attente', niveau TEXT, vignette_path TEXT, consignes_paths TEXT, code TEXT);`,
            "competences": `CREATE TABLE IF NOT EXISTS competences (id_competence INTEGER PRIMARY KEY AUTOINCREMENT, nom_competence TEXT NOT NULL);`,
            "sae_competences": `CREATE TABLE IF NOT EXISTS sae_competences (id_sae INTEGER NOT NULL, id_competence INTEGER NOT NULL, PRIMARY KEY (id_sae, id_competence), FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE, FOREIGN KEY (id_competence) REFERENCES competences (id_competence) ON DELETE CASCADE);`,
            "groupes": `CREATE TABLE IF NOT EXISTS groupes (id_groupe INTEGER PRIMARY KEY AUTOINCREMENT, id_sae INTEGER NOT NULL, nom_groupe TEXT NOT NULL, FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE);`,
            "groupe_etudiants": `CREATE TABLE IF NOT EXISTS groupe_etudiants (id_groupe INTEGER NOT NULL, id_user INTEGER NOT NULL, PRIMARY KEY (id_groupe, id_user), FOREIGN KEY (id_groupe) REFERENCES groupes (id_groupe) ON DELETE CASCADE, FOREIGN KEY (id_user) REFERENCES utilisateurs (id_user) ON DELETE CASCADE);`,
            "livrables": `CREATE TABLE IF NOT EXISTS livrables (id_livrable INTEGER PRIMARY KEY AUTOINCREMENT, id_sae INTEGER NOT NULL, titre_livrable TEXT NOT NULL, date_limite DATETIME NOT NULL, FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE);`,
            "rendus": `CREATE TABLE IF NOT EXISTS rendus (id_rendu INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER NOT NULL, id_sae INTEGER NOT NULL, chemin_fichier TEXT NOT NULL, date_depot DATETIME DEFAULT CURRENT_TIMESTAMP, note_attribuee REAL, commentaire_prof TEXT, est_evalue INTEGER DEFAULT 0, FOREIGN KEY (id_user) REFERENCES utilisateurs (id_user) ON DELETE CASCADE, FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE);`,
            "documents": `CREATE TABLE IF NOT EXISTS documents (id_document INTEGER PRIMARY KEY AUTOINCREMENT, id_sae INTEGER NOT NULL, nom_fichier TEXT NOT NULL, chemin_fichier TEXT NOT NULL, type_doc TEXT NOT NULL, FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE);`,
            "annonces": `CREATE TABLE IF NOT EXISTS annonces (id INTEGER PRIMARY KEY AUTOINCREMENT, titre TEXT NOT NULL, contenu TEXT NOT NULL, auteur_id INTEGER NOT NULL, destinataires TEXT DEFAULT 'Tous', date_publication DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (auteur_id) REFERENCES utilisateurs (id_user) ON DELETE CASCADE);`,
            "suivi_etudiant_sae": `CREATE TABLE IF NOT EXISTS suivi_etudiant_sae (id_suivi INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER NOT NULL, id_sae INTEGER NOT NULL, statut TEXT DEFAULT 'En cours', note REAL, commentaire TEXT, date_depot DATETIME, fichier_path TEXT, FOREIGN KEY (id_user) REFERENCES utilisateurs (id_user) ON DELETE CASCADE, FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE);`,
            "demandes_comptes": `CREATE TABLE IF NOT EXISTS demandes_comptes (id_demande INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, prenom TEXT NOT NULL, email TEXT NOT NULL UNIQUE, telephone TEXT NOT NULL, mot_de_passe TEXT NOT NULL, role TEXT NOT NULL, numero_etudiant TEXT, statut TEXT DEFAULT 'En attente', date_demande DATETIME DEFAULT CURRENT_TIMESTAMP);`
        };

        Object.keys(tables).forEach((tableName) => {
            db.run(tables[tableName], (err) => {
                if (err) console.error(`❌ Erreur création table [${tableName}]:`, err.message);
                else console.log(`✅ Table [${tableName}] créée ou déjà présente.`);
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
