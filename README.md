# Ecampupuce — Plateforme Pédagogique MMI

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.25-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org/)

## Présentation du Projet

**Ecampupuce** est une plateforme sur-mesure développée pour le département Métiers du Multimédia et de l'Internet (MMI). L'application joue le rôle d'intranet pédagogique centralisé, remplaçant la fragmentation des historiques d'échanges de mails et de dépôts de documents. 

Le système offre :
- **Une gestion structurée des SAE** (Situations d'Apprentissage et d'Évaluation) par les professeurs.
- **Un espace Étudiant ciblé**, présentant uniquement les travaux assignés grâce à une gestion fine d'héritage de groupes (ex: MMI1 / MMI1A / MMI1A1).
- **Un module de dépôt (Rendus) protégé**, imposant un respect des dates limites fixées.
- **Une interface d'administration** pour la validation des inscriptions manuelles ou automatiques.
- **Une Vitrine Publique** valorisant les meilleures réalisations de la formation.

![Aperçu de la Vitrine Ecampupuce]([placeholder_screenshot.png](https://raw.githubusercontent.com/KiwimanTFB/Ecampupuce/refs/heads/main/vitrine.png))

---

## Architecture et Arborescence

Le projet est construit sur une architecture **Monorepo** scindant le backend (API Rest) et le frontend (Single Page Application SPA).

```text
Ecampupuce/
├── client/                     # Application Frontend (Vue.js 3 / Vite)
│   ├── package.json            # Dépendances Vite, Vue, Vue-Router, Axios
│   ├── index.html              # Point d'entrée HTML
│   ├── public/                 # Assets statiques globaux
│   └── src/
│       ├── App.vue             # Composant racine
│       ├── main.js             # Initialisation de l'instance Vue
│       ├── router/             # Gestion du Routing (Privé & Public)
│       ├── components/         # Composants réutilisables (Nav, Filtres, Modal)
│       └── views/              # Vues de pages (Login, Dashboard, Public Showcase)
│
├── server/                     # API RESTful (Express 5 / Node.js)
│   ├── package.json            # Dépendances Node (bcrypt, jsonwebtoken, multer, nodemailer, sqlite3)
│   ├── index.js                # Point d'entrée serveur, définition des Routes API
│   ├── db.js                   # Wrapper SQLite Async
│   ├── init-db.js              # Initialisation du schéma de la BDD
│   └── uploads/                # Répertoire des médias et rendus étudiants (Généré au vol)
│
├── .gitignore
├── rapport.md                  # Analyse Technique de l'architecture
└── README.md                   # Documentation projet (Ce fichier)
```

---

## 🚀 Installation & Configuration Locale

### 1. Prérequis
- Node.js version **18.x** ou supérieure.
- NPM (généralement distribué avec Node.js).

### 2. Cloner le Dépôt
Commencez par récupérer le code source sur votre machine locale :
```bash
git clone https://github.com/KiwimanTFB/Ecampupuce.git
cd Ecampupuce
```

### 3. Installation des Dépendances
Le projet possédant une structure bi-dossier, il vous faudra installer les packages NPM pour chaque partie indépendamment.

```bash
# Dans le dossier client
cd client
npm install

# Dans le dossier serveur
cd ../server
npm install
```

### 4. Variables d'Environnement (Backend)
Dans le dossier `/server`, créez un fichier `.env` basé sur les clés requises pour la sécurité JWT et l'envoi de mails Nodemailer :

```env
PORT=3000
JWT_SECRET=votre_clef_secrete_ultra_robuste
SMTP_HOST=votre_serveur_smtp
SMTP_PORT=votre_port_smtp
SMTP_USER=votre@email.com
SMTP_PASS=votre_mot_de_passe_email
```

---

## 💻 Démarrage en Développement

Pour faciliter le développement (Rechargement à chaud), lancez simultanément les deux serveurs dans deux fenêtres de terminal séparées :

**Terminal 1 (Backend - Serveur) :**
```bash
cd server
npm run dev
# Lance nodemon index.js (API disponible sur http://localhost:3000)
```

**Terminal 2 (Frontend - Client) :**
```bash
cd client
npm run dev
# Lance Vite (SPA disponible pour le développement)
```

L'application Frontend sera joignable typiquement sur `http://localhost:5173`. L'API (`http://localhost:3000/api`) sera exploitée par le front.

---

## 🌍 Déploiement Production (Hostinger VPS / Linux)

Sur le serveur de production, le backend Express certifie les routes et offre également statiquement l'interface compilée de Vue.js.

1. **Compilation du Client :**
   ```bash
   cd client
   npm run build
   ```
   *Ce processus crées le répertoire `client/dist` avec les binaires finaux compressés.*

2. **Démarrage Serveur :**
   ```bash
   cd server
   npm start
   # Ou mieux : utilisez 'pm2 start index.js --name Ecampupuce' pour un daemon Linux.
   ```
   *L'API montera les routes `/api` et utilisera un middleware catch-all pour acheminer tout autre trafic web vers `/client/dist/index.html`.*

> **⚠️ Avertissement de Casse (Linux Case-Sensitivity Protocol)**
> Contrairement à Windows, les serveurs de production sur des distributions GNU/Linux requièrent une stricte exactitude sur la casse des fichiers. Assurez-vous que vos imports (`import MonComposant from './MonComposant.vue'`) correspondent parfaitement au nom du fichier réel sur disque pour prévenir d'une erreur 404 (Module not found).

---
*Ce projet est un devoir universitaire.*
