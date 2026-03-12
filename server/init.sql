-- Création de la base de données
CREATE DATABASE IF NOT EXISTS saetrack;
USE saetrack;

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher') NOT NULL
);

-- Table saes
CREATE TABLE IF NOT EXISTS saes (
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
);

-- Données de test (Mots de passe = 'password123' hashés par bcrypt)
-- L'hash a été généré avec bcryptjs (10 rounds): $2a$10$wO36/R4YqRyH3J/x3Z/j/Oc23YI.V2V4g1gY5O4gQj.P.uI68aE3m
INSERT IGNORE INTO users (id, nom, email, password_hash, role) VALUES 
(1, 'Alexandre D.', 'etudiant@univ.fr', '$2a$10$wO36/R4YqRyH3J/x3Z/j/Oc23YI.V2V4g1gY5O4gQj.P.uI68aE3m', 'student'),
(2, 'Mme Dubois', 'prof@univ.fr', '$2a$10$wO36/R4YqRyH3J/x3Z/j/Oc23YI.V2V4g1gY5O4gQj.P.uI68aE3m', 'teacher');

-- SAEs de test (issues du JSON)
INSERT IGNORE INTO saes (id, title, description, deadline, status, groupType, level, deliveryStatus, isEvaluated, grade, comment) VALUES 
(1, 'SAE 4.03 - Architecture Découplée', 'Développement d\'une plateforme avec séparation stricte Front-end / Back-end et communication via requêtes HTTP JSON.', '2026-03-15', 'urgent', 'Projet de groupe (3)', 'BUT2', 'Aucun document déposé', FALSE, NULL, NULL),
(2, 'SAE 4.02 - Portfolio Professionnel', 'Mise à jour du portfolio en ligne pour intégrer les travaux de deuxième année en vue de la recherche de stage.', '2026-03-28', 'ongoing', 'Projet individuel', 'BUT2', 'En attente de dépôt', FALSE, NULL, NULL),
(3, 'SAE 4.01 - Ergonomie et Web Design', 'Conception d\'une interface utilisateur cohérente, accessible et ergonomique selon le cahier des charges.', '2026-03-01', 'done', 'Projet de groupe (2 à 3)', 'BUT2', 'Rendu déposé le 28 Fév 2026 à 14h22', TRUE, 15.5, 'Excellent travail sur l\'accessibilité des couleurs et la hiérarchie de l\'information. La maquette est très intuitive. Attention cependant à la taille des zones cliquables sur la version mobile qui sont parfois un peu trop petites pour respecter les standards (44x44px minimum). Bon projet dans l\'ensemble.');
