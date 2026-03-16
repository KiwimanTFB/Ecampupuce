const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');

// Ouvrir (ou créer) la base SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Erreur ouverture SQLite:', err.message);
    } else {
        console.log('✅ Connexion SQLite établie (fichier: database.sqlite)');
        // Activer les foreign keys (désactivées par défaut dans SQLite)
        db.run('PRAGMA foreign_keys = ON');
    }
});

// Wrapper promisifié pour db.all (SELECT)
db.allAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Wrapper promisifié pour db.run (INSERT, UPDATE, DELETE)
db.runAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

// Wrapper promisifié pour db.get (SELECT une seule ligne)
db.getAsync = function (sql, params = []) {
    return new Promise((resolve, reject) => {
        this.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = db;
