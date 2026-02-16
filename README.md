<div align="center">

  <img src="https://img.icons8.com/dusk/128/000000/university.png" alt="logo" width="100" height="100" />

  # 🎓 Ecampupuce
  
  **La plateforme centralisée de gestion des SAE pour le département MMI.**
  
  *Un projet d'application Full-Stack réalisé avec passion.*
  <br>
  
  > *"Dédicace à Samuel pour le nom"* 🤝

  <p>
    <a href="#-fonctionnalités">Fonctionnalités</a> •
    <a href="#-stack-technique">Technologies</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-équipe">L'Équipe</a>
  </p>

  ![Status](https://img.shields.io/badge/Status-En_Développement-orange?style=for-the-badge)
  ![License](https://img.shields.io/badge/Licence-MIT-blue?style=for-the-badge)
  ![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)

</div>

---

## 📖 À propos du projet

Dans le cadre du **BUT Métiers du Multimédia et de l’Internet (MMI)**, les Situations d’Apprentissage et d’Évaluation (SAE) structurent la progression des étudiants. Cependant, le suivi est souvent dispersé.

**Ecampupuce** est une solution web interne conçue pour répondre à ce besoin réel. Elle centralise :
1.  **La Gestion :** Suivi des consignes, livrables et échéances.
2.  **L'Archivage :** Une vitrine des travaux des promotions précédentes.
3.  **La Communication :** Un module d'annonces dédié.

L'objectif est d'offrir une expérience utilisateur (UX/UI) cohérente, accessible et ergonomique pour les étudiants et les enseignants.

---

## ✨ Fonctionnalités

### 👨‍🎓 Espace Étudiant
* **Tableau de bord synthétique :** Vue immédiate sur les SAE en cours, à venir et rendues.
* **Gestion du temps :** Indicateurs visuels pour les échéances proches.
* **Dépôt de documents :** Interface pour consulter les consignes et déposer les livrables.

### 👨‍🏫 Espace Enseignant
* **Vue Globale :** Suivi de l'avancement par SAE et par groupe.
* **Gestion Administrative :** Création de SAE, modification des consignes.
* **Filtres Avancés :** Tri par semestre, groupe ou état d'avancement.
* **Communication :** Publication d'annonces (rappels, infos urgentes).

### 🌍 Espace Public (Vitrine)
* **Showcase Graphique :** Présentation élégante des travaux des promotions précédentes.
* **Historique :** Filtrage des projets par année.

---

## 🛠 Stack Technique

Ce projet respecte une architecture **API RESTful** avec une séparation stricte entre le client et le serveur.

| Domaine | Technologie | Rôle |
| :--- | :--- | :--- |
| **Front-End** | `[React / Vue / Angular]` | Interface Utilisateur & Interactions |
| **Back-End** | `[Symfony / Node / Laravel]` | API REST & Logique métier |
| **Base de données** | `[MySQL / PostgreSQL]` | Persistance des données |
| **Design / CSS** | `[Tailwind / Bootstrap / Sass]` | UI & Responsive Design |
| **Versioning** | Git / GitHub | Gestion de versions et travail d'équipe |

---

## 📸 Aperçu (Screenshots)

| Dashboard Étudiant | Vue Enseignant |
|:---:|:---:|
| <img src="https://via.placeholder.com/600x400?text=Dashboard+Student" width="100%"> | <img src="https://via.placeholder.com/600x400?text=Dashboard+Teacher" width="100%"> |

---

## 🚀 Installation et Démarrage

Suivez ces étapes pour déployer le projet en local.

### Pré-requis
* Node.js & NPM
* [Autre pré-requis Back-end, ex: PHP / Python]
* [SGBD, ex: MySQL]

### 1. Cloner le dépôt
```bash
git clone [https://github.com/votre-username/ecampupuce.git](https://github.com/votre-username/ecampupuce.git)
cd ecampupuce
2. Installation du Back-end (/api)Bashcd backend
# Installation des dépendances
[commande install, ex: composer install]

# Configuration de l'environnement
cp .env.example .env
# (Configurer la connexion BDD dans le fichier .env)

# Lancement du serveur
[commande start, ex: symfony server:start]
3. Installation du Front-end (/client)Bashcd ../frontend
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev
📂 Structure du ProjetPlaintextEcampupuce/
├── backend/         # API et Logique serveur
├── frontend/        # Application Client Web
├── docs/            # Rapports, Maquettes et Documentation
└── README.md        # Documentation générale
👥 L'ÉquipeProjet réalisé par le groupe [Nom du Groupe ou Numéro] :MembreRôleGitHub[Nom Étudiant 1][Rôle ex: Lead Dev Front]@pseudo[Nom Étudiant 2][Rôle ex: Lead Dev Back]@pseudo[Nom Étudiant 3][Rôle ex: UI/UX Designer]@pseudo📄 LicenceCe projet est réalisé dans un cadre pédagogique au sein du département MMI.Distribué sous la licence MIT.
