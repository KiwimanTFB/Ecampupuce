const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
    try {
        console.log('Tentative de connexion à MySQL (XAMPP)...');
        // Connexion sans base de données pour pouvoir la créer
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Connexion réussie ! Création de la base de données saetrack_db...');
        await connection.query('CREATE DATABASE IF NOT EXISTS saetrack_db');
        
        console.log('Sélection de la base de données saetrack_db...');
        await connection.query('USE saetrack_db');

        console.log('Création de la table users...');
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query(`
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nom VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('student', 'teacher') NOT NULL
            )
        `);

        console.log('Création de la table saes...');
        await connection.query('DROP TABLE IF EXISTS saes');
        await connection.query(`
            CREATE TABLE saes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                deadline DATE,
                status ENUM('urgent', 'ongoing', 'done', 'archived'),
                groupType VARCHAR(100),
                level VARCHAR(50),
                deliveryStatus VARCHAR(255),
                isEvaluated BOOLEAN DEFAULT FALSE,
                grade DECIMAL(4,2),
                comment TEXT
            )
        `);

        console.log('Insertion des utilisateurs de test...');
        // Les mots de passe sont tous 'password123' encryptés via bcrypt
        await connection.query(`
            INSERT INTO users (id, nom, email, password_hash, role) VALUES 
            (1, 'Alexandre D.', 'etudiant@univ.fr', '$2b$10$8pAnYQaWsswHwySvOFcJnunCG1AkFn1ci91JHbXY3k/aMwvVl.rYG', 'student'),
            (2, 'Mme Dubois', 'prof@univ.fr', '$2b$10$8pAnYQaWsswHwySvOFcJnunCG1AkFn1ci91JHbXY3k/aMwvVl.rYG', 'teacher')
        `);

        console.log('Insertion des SAEs de test...');
        await connection.query(`
            INSERT IGNORE INTO saes (id, title, description, deadline, status, groupType, level, deliveryStatus, isEvaluated, grade, comment) VALUES 
            (1, 'SAE 4.03 - Architecture Découplée', 'Développement d\\'une plateforme avec séparation stricte Front-end / Back-end et communication via requêtes HTTP JSON.', '2026-03-15', 'urgent', 'Projet de groupe (3)', 'BUT2', 'Aucun document déposé', FALSE, NULL, NULL),
            (2, 'SAE 4.02 - Portfolio Professionnel', 'Mise à jour du portfolio en ligne pour intégrer les travaux de deuxième année en vue de la recherche de stage.', '2026-03-28', 'ongoing', 'Projet individuel', 'BUT2', 'En attente de dépôt', FALSE, NULL, NULL),
            (3, 'SAE 4.01 - Ergonomie et Web Design', 'Conception d\\'une interface utilisateur cohérente, accessible et ergonomique selon le cahier des charges.', '2026-03-01', 'done', 'Projet de groupe (2 à 3)', 'BUT2', 'Rendu déposé le 28 Fév 2026 à 14h22', TRUE, 15.5, 'Excellent travail sur l\\'accessibilité des couleurs et la hiérarchie de l\\'information. La maquette est très intuitive.')
        `);

        console.log("✅ Initialisation terminée avec succès !");
        await connection.end();

    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation de la BDD:", error);
    }
}

initDB();
