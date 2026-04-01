# Rapport Technique Ecampupuce : Analyse et Architecture Système

## 1. Analyse du Besoin & Solution Apportée

Le département Métiers du Multimédia et de l'Internet (MMI) fait face à un défi logistique important : la fragmentation des informations relatives aux Situations d'Apprentissage et d'Évaluation (SAE). Historiquement, les consignes, les échéances et les dépôts de livrables étaient éparpillés entre les mails, différentes plateformes d'apprentissage (LMS classiques) ou des serveurs de fichiers réseau.

**Solution :**
La création d'**Ecampupuce**, une plateforme interne sur-mesure (suivi d'un module "Vitrine" public).
Ce système centralise :
1. **Les informations académiques :** Chaque SAE possède une fiche détaillée (titre, semestre, année, description, compétences visées, consignes PDF, et vignettes).
2. **Les échéances (Deadlines) :** Uniformisation du suivi dans le temps.
3. **Les dépôts de livrables (Rendus) :** Les étudiants déposent directement leurs archives depuis un espace sécurisé, avec un contrôle strict des dates limites.

L'objectif principal est de réduire la charge cognitive des étudiants concernant l'organisation ("Que dois-je rendre et pour quand ?") et de fluidifier l'évaluation pour les équipes pédagogiques (téléchargement par lots d'archives .zip).

## 2. Architecture Logicielle

Le projet adopte une architecture dite "Monorepo" avec une séparation nette des responsabilités entre le client lourd (Front-End) et l'API (Back-End).

### 2.1. Structure Monorepo
Le dépôt contient deux entités indépendantes qui communiquent via des appels HTTP REST.
- Dossier `client/` : Contient l'application front-end (Single Page Application - SPA).
- Dossier `server/` : Contient l'API RESTful exposée au client et la gestion de la base de données.

Cette approche permet une évolution séparée des deux stacks. Sur l'environnement de production (Hostinger), le Back-End sert également les fichiers statiques compilés du Front-End.

### 2.2. Technologies Choisies : Vue.js 3 et Express 5

**Front-End : Vue.js 3 (Composition API & Vite)**
- **Vue.js 3** a été choisi pour sa réactivité fine via la Composition API, offrant un code plus modulaire que l'Options API.
- **Vite** est utilisé en tant que bundler en remplacement de Webpack/Vue CLI, permettant des temps de rechargement à chaud (HMR) quasi-instantanés.
- **Vue Router (v5)** gère la navigation SPA avec des guards de navigation (Routage protégé par rôles).

**Back-End : Node.js avec Express 5**
- **Express 5** apporte un avantage majeur : un support natif des Promesses (`async/await`) dans les middlewares et les gestionnaires de routes, ce qui évite les crashs silencieux liés aux Promesses non rattrapées et élimine le besoin de librairies tierces comme `express-async-errors`.
- **SQLite 3** est utilisé comme système de base de données relationnelle. Le choix s'explique par sa légèreté, l'absence de processus serveur complexe à configurer sur un hébergement mutualisé, et sa persistance locale via le module `sqlite3`.

---

## 3. Détail des Fonctionnalités et Explications du Code

### 3.1. Gestion des SAE et Fiches Détaillées

La gestion des SAE constitue le cœur du système. Les professeurs créent des événements avec un titre, des descriptions (stockées avec un formatage) et uploade des fichiers liés (Vignettes, PDFs de consignes).

**Code Back-End (`server/index.js`) :**
La création d'une SAE utilise `multer` combiné au stockage sur disque.

```javascript
const saeUpload = upload.fields([
    { name: 'vignette', maxCount: 1 },
    { name: 'consignes', maxCount: 10 }
]);

app.post('/api/saes', authenticateToken, requireTeacher, saeUpload, async (req, res) => {
    // ... Extraction du corps ...
    const vignette = req.files && req.files['vignette'] ? `vignettes/${req.files['vignette'][0].filename}` : null;
    const consignesFiles = req.files && req.files['consignes'] ? req.files['consignes'].map(f => `consignes/${f.filename}`) : [];
    
    // Sérialisation des tableaux pour SQLite
    const competencesJSON = JSON.stringify(parsedCompetences || []);
    const consignesJSON = JSON.stringify(consignesFiles);

    // Insertion
    await db.runAsync("INSERT INTO sae (titre, description, vignette_path, consignes_paths...) VALUES (?, ?, ?, ?...)", [...]);
});
```
*Analyse :* SQLite ne possédant pas de format Array natif, les listes (consignes et compétences) sont encapsulées en JSON strings. L'upload multiple est sécurisé par des contraintes sur le nombre de fichiers via `maxCount`.

### 3.2. Tableau de Bord (Vues Étudiant vs Enseignant et Filtrage)

L'expérience diffère diamétralement selon le profil de l'utilisateur.
- **Professeurs / Admins** : Accès global. Les profs voient une barre de progression reflétant le taux de dépôt (nbre de rendus / nbre total d'étudiants d'un groupe assigné).
- **Étudiants** : Vue filtrée selon le concept "d'héritage de groupes".

**L'algorithme de filtrage des groupes MMI :**
Un étudiant en "MMI1A1" (TD) doit voir non seulement les SAEs exclusives à "MMI1A1" mais aussi les SAEs de la promotion entière "MMI1" ou du demi-groupe "MMI1A".

```javascript
// server/index.js
const GROUP_TREE = {
    'MMI1': ['MMI1A', 'MMI1B'],
    'MMI1A': ['MMI1A1', 'MMI1A2'],
    // ...
};

function getGroupAncestors(groupe) {
    if (!groupe) return [];
    const result = [groupe];
    for (const [parent, children] of Object.entries(GROUP_TREE)) {
        if (children.includes(groupe)) {
            result.push(...getGroupAncestors(parent));
            break; // Remontée récursive
        }
    }
    return [...new Set(result)];
}
```
*Analyse :* Avant la requête SQL, l'API construit dynamiquement la liste des ancêtres. Lors du `GET /api/saes`, la clause `WHERE groupe IN (?, ?, ?)` est injectée dynamiquement avec des placeholders de la taille du tableau renvoyé par cet arbre. C'est une méthode d'inclusion très performante.

### 3.3. Module d'Annonces Chronologiques et Gestion Documentaire

Le tableau de bord dispose d'un flux de type "Timeline". Les informations pédagogiques y sont publiées. L'API renvoie ces données via une route protégée `/api/annonces` où le Back-End exécute un `JOIN` entre la table `annonces` et `utilisateurs` pour récupérer la concaténation de `auteur_nom`.

Côté documents virtuels, le flux d'upload étudiant (route `POST /api/rendu`) applique une surcouche de sécurité temporelle :
```javascript
const limitDate = sae.date_limite || sae.date_fin;
if (limitDate && new Date() > new Date(limitDate)) {
    return res.status(403).json({ error: 'La date limite pour ce rendu est dépassée.' });
}
```
Cette logique s'assure (côté serveur) qu'aucune tentative de contournement (bypass Front-End) ne permet de déposer un devoir après la clôture. Toute interaction "upload" implique la mise à jour (upsert logiciel) : si la ligne de suivi de l'étudiant (`suivi_etudiant_sae`) existe déjà, Express purge le vieux fichier via `fs.unlinkSync` sur le système de fichiers pour limiter la montée en charge du disque Hostinger, puis met à jour l'entrée SQL.

### 3.4. Vue Publique Vitrine

Afin de valoriser la formation, un système de vitrine publique est exposé (routes non-authentifiées).
Dans le back-end, `GET /api/public/saes` permet d'obtenir uniquement les éléments validés :
```javascript
        if (semestre) {
            query += ' AND semestre = ?';
            queryParams.push(semestre);
        }
        // ...
        query += " AND statut = 'Validé'";
```
Sur le client Vue (`PublicShowcaseView`), cette data alimente un filtrage multi-critères en Grid/Masonry CSS pour mettre en avant les réalisations étudiantes. L'API protège ses détails, ne renvoyant pas de données sensibles sur l'authentification ni sur les étudiants, mais uniquement la vitrine du projet.

---

## 4. Défis Techniques & Résolution de Problèmes

### 4.1. Migration Express 5 et le Fallback `path-to-regexp`

L'un des plus grands défis de conception reposait sur l'intégration du routeur frontal Vue.js avec l'API Back-Node.js. Dans une SPA, toutes les URL n'appartenant pas à des routes API (ex: `/student`, `/login`) doivent être redirigées par Express vers `index.html`, pour que Vue gère l'affichage correct (HTML5 History Mode).

**Le Problème Express 4 vers 5 :**
Dans Express 4, la syntaxe historique était `app.get('*', (req, res) => res.sendFile(...))`.
Avec l'évolution vers Express 5, la bibliothèque sous-jacente `path-to-regexp` (de la version 0.1 à la v7/v8) a fondamentalement changé la manière dont elle parse les wildcards (astérisques). `*` seul est désormais invalide ou provoque des défaillances de mapping paramétrique stricte (`Missing parameter name`). L'application crachait une `TypeError: Expected parameter name`.

**La Résolution :**
Nous avons abandonné le routing wildcard et implémenté un Middleware d'interception (Catch-All Middleware) universel à la fin du cycle de vie Express, *après* la déclaration du répertoire statique :

```javascript
app.use(express.static(distPath));

// Le fameux "Catch-all" version Express 5 (sans astérisque)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next(); // Laisse les API gérer ou renvoyer 404
    }
    // Pour toutes les autres requêtes, fournir le frontend
    res.sendFile(path.join(distPath, 'index.html'));
});
```
Cette technique assure une flexibilité et une excellente robustesse sans dépendre de l'implémentation instable du wildcard regex.

### 4.2. Sensibilité à la Casse (Case Sensitivity) sous Hostinger (Linux)

**Le Problème :**
Initialement développé sous Windows, le système ne se souciait pas de la casse lors des appels (ex: `import Menu from './menu.vue'` alors que le fichier était `Menu.vue`). Lors du portage sur le serveur VPS Hostinger (qui repose sur un écosystème GNU/Linux), l'application a subi un incident critique où Vite et Node.js renvoyaient des erreurs `module not found`. De plus, les chemins des fichiers uploadés (Vignettes.jpg vs vignettes.jpg) causaient des erreurs 404 sur les URLs générées.

**La Résolution :**
Une vaste harmonisation des nomenclatures a été entreprise.
1. Les `import` Vue.js ont été audités pour forcer la synchronisation stricte avec l'arborescence (ex: composant majuscule `LoginView.vue`).
2. Du côté base de données, l'upload stocke les chemins toujours en minuscules stricte (ex: `/uploads/vignettes/`), et la fonction `path.join(__dirname, 'uploads')` gère le séparateur OS, sécurisant le flux entre Windows et Linux.
3. Git a dû être reconfiguré (parfois localement via `git config core.ignorecase false`) pour forcer les committers à versionner correctement la case des répertoires.

### 4.3. Implémentation du SMTP avec Nodemailer

La plateforme intègre un système d'email pour pouvoir contacter le département ou valider des flux.

**Le Défi :**
Envoyer un mail de manière sécurisée sans bloquer le thread Node.js principal et en empêchant les spams automatiques.

**La Résolution :**
Implémentation dans `server/index.js` (`POST /api/contact`) de `Nodemailer`. Le transport SMTP utilise les clés d'environnements injectées via `dotenv` :
```javascript
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
```
Pour la sécurité, un encodage sémantique HTML direct est envoyé. La route attend via l'async/await un retour du broker (Hostinger mailer server) puis répond un succès ou l'erreur réseau (500), notifiée directement au client HTTP (Axios intercepté par le front-end).

---

## 5. Qualité, Optimisation UX et Interface

L'application a été élaborée en suivant les directives de conception modernes (Studio MMI).
1. **Stratégie Responsive :** Le front-end repose sur l'utilisation poussée des flexbox et de CSS Grid (notamment de la grille Masonry pure pour la vitrine publique `PublicShowcaseView`). L'affichage fluide sur Tablettes et Mobile est accompli grâce aux media-queries injectées dans les Single-File Components (.vue).
2. **Accessibilité (A11y) :** Les formulaires adoptent la balise `<label>` liée stricto-sensu aux interactivités de `<input>`, favorisant les lecteurs d'écrans. Le contraste des modes sombre et le choix typographique (Inter) ciblent également la lisibilité optimale.
3. **Architecture de Navigation (Guard) :** La protection des données UX est masquée aux utilisateurs sans privilège. L'implémentation de `router.beforeEach` dans le client vérifie le rôle stocké en pair avec un token JWT et procède à une expulsion en cas d'usurpation de rôle constatée, garantissant que le système n'expose pas l'UI Admin au premier venu. L'utilisation logicielle s'en trouve ainsi saine et sécurisée.
