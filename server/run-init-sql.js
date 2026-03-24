const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    try {
        console.log('Connexion serveur MySQL...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true // Permet d'exécuter plusieurs requêtes d'un coup
        });

        console.log('Lecture du fichier init.sql...');
        const sqlParams = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

        console.log('Exécution du script init.sql...');
        await connection.query(sqlParams);
        
        console.log('Base de données initialisée avec succès !');
        await connection.end();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la BDD:', error);
    }
}

initDB();
