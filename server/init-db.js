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

        console.log('Nettoyage des tables existantes (Foreign Keys)...');
        await connection.query('DROP TABLE IF EXISTS annonces');
        await connection.query('DROP TABLE IF EXISTS rendus');
        await connection.query('DROP TABLE IF EXISTS saes');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Création de la table users...');
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
                comment TEXT,
                promo VARCHAR(50),
                semestre VARCHAR(10),
                annee INT,
                domaine VARCHAR(100),
                is_public BOOLEAN DEFAULT FALSE
            )
        `);

        console.log('Création de la table rendus...');
        await connection.query(`
            CREATE TABLE rendus (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sae_id INT NOT NULL,
                user_id INT NOT NULL,
                nom_fichier VARCHAR(255) NOT NULL,
                chemin_fichier VARCHAR(500) NOT NULL,
                date_depot DATETIME DEFAULT CURRENT_TIMESTAMP,
                note DECIMAL(4,2),
                commentaire_prof TEXT,
                FOREIGN KEY (sae_id) REFERENCES saes(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('Création de la table annonces...');
        await connection.query(`
            CREATE TABLE annonces (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titre VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                destinataires VARCHAR(100) DEFAULT 'Tous',
                date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
                auteur_id INT NOT NULL,
                FOREIGN KEY (auteur_id) REFERENCES users(id) ON DELETE CASCADE
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
            INSERT INTO saes (id, title, description, deadline, status, groupType, level, deliveryStatus, isEvaluated, grade, comment, promo, semestre, annee, domaine, is_public) VALUES 
            (1, 'SAE 4.03 - Architecture Découplée', 'Développement d\\'une plateforme avec séparation stricte Front-end / Back-end.', '2026-03-15', 'urgent', 'Projet de groupe (3)', 'BUT2', 'Aucun document déposé', FALSE, NULL, NULL, 'MMI2', 'S4', 2026, 'Dév web', TRUE),
            (2, 'SAE 4.02 - Portfolio Professionnel', 'Mise à jour du portfolio en ligne pour intégrer les travaux de deuxième année.', '2026-03-28', 'ongoing', 'Projet individuel', 'BUT2', 'En attente de dépôt', FALSE, NULL, NULL, 'MMI2', 'S4', 2026, 'Communication', TRUE),
            (3, 'SAE 4.01 - Ergonomie et Web Design', 'Conception d\\'une interface utilisateur cohérente, accessible et ergonomique.', '2026-03-01', 'done', 'Projet de groupe (2 à 3)', 'BUT2', 'Rendu déposé le 28 Fév 2026', TRUE, 15.5, 'Excellent travail.', 'MMI2', 'S4', 2026, 'Design', TRUE),
            (4, 'SAE 3.01 - Vidéo Institutionnelle', 'Tournage et montage d\\'une vidéo de présentation pour une entreprise réelle.', '2025-12-15', 'archived', 'Groupe (4)', 'BUT2', 'Évalué', TRUE, 16, 'Super montage, rythme très pro.', 'MMI2', 'S3', 2025, 'Créations Audiovisuelles', TRUE),
            (5, 'SAE 1.05 - Modélisation 3D', 'Réalisation d\\'un objet low-poly texturé sous Blender ou C4D.', '2025-10-10', 'archived', 'Individuel', 'BUT1', 'Évalué', TRUE, 14, 'Texturing à améliorer mais modèle propre.', 'MMI1', 'S1', 2025, '3D & Jeux', TRUE),
            (6, 'SAE 5.01 - Projet Inter-Mentions', 'Projet global mixant Dev, Crea et Stratégie avec contraintes réelles.', '2027-01-10', 'ongoing', 'Groupe (6)', 'BUT3', 'En attente', FALSE, NULL, NULL, 'MMI3', 'S5', 2026, 'Dév web', FALSE)
        `);

        console.log("Insertion de rendus de test...");
        await connection.query(`
            INSERT INTO rendus (sae_id, user_id, nom_fichier, chemin_fichier) VALUES 
            (3, 1, 'Maquette_Figma_VFinale.pdf', '/uploads/Maquette_Figma_VFinale.pdf'),
            (3, 1, 'Rendu_Ergonomie_GB.pdf', '/uploads/Rendu_Ergonomie_GB.pdf')
        `);

        console.log("Insertion d'une annonce de test...");
        await connection.query(`
            INSERT INTO annonces (titre, message, destinataires, auteur_id) VALUES 
            ('Bienvenue sur SaeTrack', 'L\\'application de gestion des SAE est désormais en ligne et opérationnelle. Vous pouvez déposer vos rendus.', 'Tous', 2),
            ('Rappel Deadline SAE 4.03', 'N\\'oubliez pas que le rendu de la SAE 4.03 est prévu pour la fin de la semaine. Bon courage à tous.', 'M2', 2)
        `);

        console.log("✅ Initialisation terminée avec succès !");
        await connection.end();

    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation de la BDD:", error);
    }
}

initDB();
