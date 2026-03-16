const db = require('./db');

function initDB() {
    console.log('Initialisation de la base SQLite...');

    db.serialize(() => {
        // Activer les foreign keys
        db.run('PRAGMA foreign_keys = ON');

        // Création de la table users
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nom TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('student', 'teacher'))
            )
        `, (err) => {
            if (err) console.error('❌ Erreur table users:', err.message);
            else console.log('✅ Table users prête.');
        });

        // Création de la table saes
        db.run(`
            CREATE TABLE IF NOT EXISTS saes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                deadline TEXT,
                status TEXT CHECK(status IN ('urgent', 'ongoing', 'done', 'archived')),
                groupType TEXT,
                level TEXT,
                deliveryStatus TEXT,
                isEvaluated INTEGER DEFAULT 0,
                grade REAL,
                comment TEXT,
                promo TEXT,
                semestre TEXT,
                annee INTEGER,
                domaine TEXT,
                is_public INTEGER DEFAULT 0
            )
        `, (err) => {
            if (err) console.error('❌ Erreur table saes:', err.message);
            else console.log('✅ Table saes prête.');
        });

        // Création de la table rendus
        db.run(`
            CREATE TABLE IF NOT EXISTS rendus (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sae_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                nom_fichier TEXT NOT NULL,
                chemin_fichier TEXT NOT NULL,
                date_depot TEXT DEFAULT (datetime('now')),
                note REAL,
                commentaire_prof TEXT,
                is_evaluated INTEGER DEFAULT 0,
                FOREIGN KEY (sae_id) REFERENCES saes(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) console.error('❌ Erreur table rendus:', err.message);
            else console.log('✅ Table rendus prête.');
        });

        // Création de la table annonces
        db.run(`
            CREATE TABLE IF NOT EXISTS annonces (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titre TEXT NOT NULL,
                message TEXT NOT NULL,
                destinataires TEXT DEFAULT 'Tous',
                date_creation TEXT DEFAULT (datetime('now')),
                auteur_id INTEGER NOT NULL,
                FOREIGN KEY (auteur_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `, (err) => {
            if (err) console.error('❌ Erreur table annonces:', err.message);
            else console.log('✅ Table annonces prête.');
        });

        console.log('✅ Initialisation SQLite terminée !');
    });
}

// Exécuter si lancé directement (node init-db.js)
if (require.main === module) {
    initDB();
}

module.exports = initDB;
