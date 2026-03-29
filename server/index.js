require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('./db');
const initDB = require('./init-db');

const JWT_SECRET = process.env.JWT_SECRET || 'default_super_secret_key_123!';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Accès public aux fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'vignette') {
            cb(null, 'uploads/vignettes/');
        } else if (file.fieldname === 'consignes') {
            cb(null, 'uploads/consignes/');
        } else if (file.fieldname === 'document') {
            cb(null, 'uploads/rendus/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'));
    }
});
const upload = multer({ storage });
const saeUpload = upload.fields([
    { name: 'vignette', maxCount: 1 },
    { name: 'consignes', maxCount: 10 }
]);

// S'assurer que les dossiers uploads existent
const fs = require('fs');
const mkdirSyncSafe = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
mkdirSyncSafe(path.join(__dirname, 'uploads'));
mkdirSyncSafe(path.join(__dirname, 'uploads', 'vignettes'));
mkdirSyncSafe(path.join(__dirname, 'uploads', 'consignes'));
mkdirSyncSafe(path.join(__dirname, 'uploads', 'rendus'));

// Ensure table has new columns
const addColumnUsers = (colName, colType) => {
    db.run(`ALTER TABLE utilisateurs ADD COLUMN ${colName} ${colType}`, (err) => {
        if (err && !err.message.includes('duplicate column name')) console.error(`Erreur ajout colonne ${colName} utils:`, err.message);
    });
};
addColumnUsers('numero_etudiant', 'TEXT');

// Ensure sae table has new columns for SAE advanced creation
const addColumn = (colName, colType) => {
    db.run(`ALTER TABLE sae ADD COLUMN ${colName} ${colType}`, (err) => {
        if (err && !err.message.includes('duplicate column name')) console.error(`Erreur ajout colonne ${colName}:`, err.message);
    });
};
addColumn('id_prof', 'INTEGER');
addColumn('date_fin', 'DATETIME');
addColumn('date_limite', 'DATETIME');
addColumn('type_groupe', 'TEXT');
addColumn('niveau', 'TEXT');

const addColumnRendus = (colName, colType) => {
    db.run(`ALTER TABLE rendus ADD COLUMN ${colName} ${colType}`, (err) => {
        if (err && !err.message.includes('duplicate column name')) console.error(`Erreur ajout colonne ${colName} rendus:`, err.message);
    });
};
addColumnRendus('id_user', 'INTEGER');
addColumnRendus('id_sae', 'INTEGER');
addColumnRendus('file_path', 'TEXT');
addColumnRendus('note', 'REAL');
addColumnRendus('feedback', 'TEXT');
addColumn('groupe', 'TEXT');
addColumn('competences', 'TEXT');
addColumn('vignette_path', 'TEXT');
addColumn('consignes_paths', 'TEXT');
addColumn('code', 'TEXT');

// Initialiser les tables au démarrage
// initDB(); // <-- DISABLED for persistence

// Middleware d'authentification JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'Token manquant' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalide' });
        req.user = user;
        next();
    });
};

// Middleware vérifiant que l'utilisateur est un professeur
const requireTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        res.status(403).json({ error: 'Accès refusé. Réservé aux professeurs.' });
    }
};

app.get('/api/test', (req, res) => {
    res.json({ message: "L'API de SaeTrack fonctionne correctement !" });
});

// POST /api/register - Demande de création de compte
app.post('/api/register', async (req, res) => {
    const { nom, prenom, email, telephone, password, role, numero_etudiant } = req.body;

    if (!nom || !prenom || !email || !telephone || !password || !role) {
        return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
    }

    if (role === 'student' && !numero_etudiant) {
        return res.status(400).json({ error: 'Le numéro étudiant est requis pour un étudiant' });
    }

    if (role !== 'student' && role !== 'teacher') {
        return res.status(400).json({ error: 'Le rôle doit être "student" ou "teacher"' });
    }

    try {
        // Vérifier dans utilisateurs et demandes_comptes
        const existingUser = await db.getAsync('SELECT id_user FROM utilisateurs WHERE email = ?', [email]);
        const existingDemande = await db.getAsync('SELECT id_demande FROM demandes_comptes WHERE email = ?', [email]);
        if (existingUser || existingDemande) {
            return res.status(409).json({ error: 'Un compte ou une demande avec cet email existe déjà' });
        }

        // Hasher le mot de passe
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insérer la demande
        const result = await db.runAsync(
            'INSERT INTO demandes_comptes (nom, prenom, email, telephone, mot_de_passe, role, numero_etudiant) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nom, prenom, email, telephone, password_hash, role, numero_etudiant || null]
        );

        res.status(201).json({ message: 'Demande envoyée avec succès', demandeId: result.lastID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la demande d'inscription" });
    }
});

// POST /api/login - Authentification et génération du JWT
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
        const user = await db.getAsync('SELECT * FROM utilisateurs WHERE email = ?', [email]);

        if (!user) {
            return res.status(400).json({ error: 'Utilisateur introuvable' });
        }

        const validPassword = await bcrypt.compare(password, user.mot_de_passe);
        if (!validPassword) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        const userPayload = {
            id: user.id_user,
            id_user: user.id_user,
            nom: user.nom,
            name: user.nom + ' ' + user.prenom,
            email: user.email,
            role: user.role,
            groupe_td: user.groupe_td || null
        };

        const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: userPayload });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
});

// GET /api/saes - Récupérer les SAEs (avec filtrage par groupe pour les étudiants)
app.get('/api/saes', authenticateToken, async (req, res) => {
    try {
        const { role, groupe_td } = req.user;

        let saes;
        if (role === 'admin' || role === 'teacher') {
            // Admins et profs voient tout avec des infos de progression
            saes = await db.allAsync(`
                SELECT 
                    s.*, 
                    u.nom as prof_nom, 
                    u.prenom as prof_prenom,
                    (SELECT COUNT(DISTINCT id_user) FROM rendus r WHERE r.id_sae = s.id_sae) as progress_count,
                    (SELECT COUNT(*) FROM utilisateurs ut WHERE ut.role = 'student' AND (ut.groupe_td = s.groupe OR s.groupe = '' OR s.groupe IS NULL)) as total_students
                FROM sae s 
                LEFT JOIN utilisateurs u ON s.id_prof = u.id_user
            `);
        } else {
            // Étudiants : filtrage par héritage de groupe
            const visibleGroups = getGroupAncestors(groupe_td);

            if (visibleGroups.length === 0) {
                // Pas de groupe assigné : on ne montre que les SAE sans groupe spécifique
                saes = await db.allAsync(`SELECT s.* FROM sae s WHERE (s.groupe IS NULL OR s.groupe = '') AND s.statut = 'Valié'`);
            } else {
                // Construire la clause IN dynamiquement
                const placeholders = visibleGroups.map(() => '?').join(', ');
                saes = await db.allAsync(
                    `SELECT s.* FROM sae s WHERE s.statut = 'Validé' AND (s.groupe IS NULL OR s.groupe = '' OR s.groupe IN (${placeholders}))`,
                    visibleGroups
                );
            }
        }
        res.json(saes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des SAEs' });
    }
});

// GET /api/public/saes - Route publique pour la vitrine (Landing Page)
app.get('/api/public/saes', async (req, res) => {
    try {
        const { promo, semestre, annee, domaine } = req.query;
        let query = 'SELECT * FROM sae WHERE 1 = 1';
        let queryParams = [];

        if (semestre) {
            query += ' AND semestre = ?';
            queryParams.push(semestre);
        }
        if (annee) {
            query += ' AND annee_univ = ?';
            queryParams.push(String(annee));
        }

        query += " AND statut = 'Validé'";

        const saes = await db.allAsync(query, queryParams);

        const formattedSaes = saes.map(sae => ({
            ...sae,
            isEvaluated: !!sae.isEvaluated,
            is_public: !!sae.is_public
        }));

        res.json(formattedSaes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des SAEs publiques' });
    }
});

// GET /api/saes/:id - Récupérer une SAE spécifique (Route protégée)
app.get('/api/saes/:id', authenticateToken, async (req, res) => {
    const saeId = req.params.id;
    try {
        const sae = await db.getAsync('SELECT * FROM sae WHERE id_sae = ?', [saeId]);

        if (sae) {
            sae.isEvaluated = !!sae.isEvaluated;
            res.json(sae);
        } else {
            res.status(404).json({ error: 'SAE non trouvée' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de la SAE' });
    }
});

// POST /api/saes - Créer une nouvelle SAE (Route protégée, PROF UNIQUEMENT)
app.post('/api/saes', authenticateToken, requireTeacher, upload.fields([{ name: 'vignette', maxCount: 1 }, { name: 'consignes', maxCount: 10 }]), async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: "Données manquantes" });
        const { titre, description, semestre, annee_univ, date_debut, date_fin, groupe, competences, consignes } = req.body;
        const teacher_id = req.user.id;

        if (!titre || !description || !date_debut || !semestre || !annee_univ) {
            return res.status(400).json({ error: 'Titre, description, semestre, année universitaire et date de début sont requis.' });
        }

        const vignette = req.files && req.files['vignette'] ? `/uploads/vignettes/${req.files['vignette'][0].filename}` : null;
        if (!vignette) {
            return res.status(400).json({ error: 'La vignette est obligatoire.' });
        }

        const consignesFiles = req.files && req.files['consignes'] ? req.files['consignes'].map(f => `/uploads/consignes/${f.filename}`) : [];

        let parsedCompetences = competences;
        if (typeof competences === 'string') {
            try { parsedCompetences = JSON.parse(competences); } catch (e) { parsedCompetences = []; }
        }

        const competencesJSON = JSON.stringify(parsedCompetences || []);
        const consignesJSON = JSON.stringify(consignesFiles);

        const result = await db.runAsync(
            "INSERT INTO sae (titre, description, semestre, annee_univ, date_debut, date_fin, groupe, competences, consignes, statut, id_prof, vignette_path, consignes_paths) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'En attente', ?, ?, ?)",
            [titre, description, semestre, annee_univ, date_debut, date_fin || null, groupe || '', competencesJSON, consignes || '', teacher_id, vignette, consignesJSON]
        );

        res.status(201).json({ message: 'SAE créée avec succès', id: result.lastID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de la SAE' });
    }
});

// PUT /api/saes/:id - Mettre à jour une SAE (Route protégée, PROF créateur UNIQUEMENT)
app.put('/api/saes/:id', authenticateToken, requireTeacher, upload.fields([{ name: 'vignette', maxCount: 1 }, { name: 'consignes', maxCount: 10 }]), async (req, res) => {
    try {
        const saeId = req.params.id;
        const teacher_id = req.user.id;
        const { titre, description, competences, date_debut, date_fin, semestre, annee_univ, groupe } = req.body;

        const sae = await db.getAsync('SELECT id_sae, vignette_path, consignes_paths FROM sae WHERE id_sae = ?', [saeId]);
        if (!sae) return res.status(404).json({ error: 'SAE non trouvée' });

        let parsedCompetences = competences;
        if (typeof competences === 'string') {
            try { parsedCompetences = JSON.parse(competences); } catch (e) { parsedCompetences = []; }
        }
        const competencesJSON = JSON.stringify(parsedCompetences || []);

        const vignette = req.files && req.files['vignette'] ? `/uploads/vignettes/${req.files['vignette'][0].filename}` : sae.vignette_path;

        let existingConsignes = sae.consignes_paths ? JSON.parse(sae.consignes_paths) : [];
        if (req.body.existingConsignes) {
            try { existingConsignes = JSON.parse(req.body.existingConsignes); } catch (e) { }
        }

        let consignesJSON = JSON.stringify(existingConsignes);
        if (req.files && req.files['consignes']) {
            const consignesFiles = req.files['consignes'].map(f => `/uploads/consignes/${f.filename}`);
            consignesJSON = JSON.stringify([...existingConsignes, ...consignesFiles]);
        }

        await db.runAsync(
            'UPDATE sae SET titre = ?, description = ?, date_debut = ?, date_fin = ?, groupe = ?, semestre = ?, annee_univ = ?, competences = ?, vignette_path = ?, consignes_paths = ? WHERE id_sae = ? AND id_prof = ?',
            [titre, description, date_debut, date_fin || null, groupe || '', semestre || '', annee_univ || '2023-2024', competencesJSON, vignette, consignesJSON, saeId, teacher_id]
        );

        res.json({ message: 'SAE mise à jour avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la SAE' });
    }
});

// DELETE /api/saes/:id - Supprimer une SAE (Route protégée, PROF créateur UNIQUEMENT)
app.delete('/api/saes/:id', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const saeId = req.params.id;
        const teacher_id = req.user.id;

        const sae = await db.getAsync('SELECT id_sae FROM sae WHERE id_sae = ?', [saeId]);
        if (!sae) return res.status(404).json({ error: 'SAE non trouvée' });

        await db.runAsync('DELETE FROM sae WHERE id_sae = ?', [saeId]);
        res.json({ message: 'SAE supprimée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression de la SAE' });
    }
});

// (Legacy upload and rendus GET routes removed)
// GET /api/annonces - Récupérer toutes les annonces (Protégé, tout le monde peut lire)
app.get('/api/annonces', authenticateToken, async (req, res) => {
    try {
        const annonces = await db.allAsync(`
            SELECT a.*, (u.nom || ' ' || u.prenom) as auteur_nom 
            FROM annonces a 
            JOIN utilisateurs u ON a.auteur_id = u.id_user 
            ORDER BY a.date_publication DESC
        `);
        res.json(annonces);
    } catch (error) {
        console.error("ERREUR RÉCUPÉRATION ANNONCES:", error.message);
        res.status(500).json({
            error: 'Erreur lors de la récupération des annonces.',
            details: error.message.includes('no such column') ? 'Erreur de schéma de base de données' : 'Erreur interne'
        });
    }
});

// POST /api/annonces - Créer une annonce (Protégé, PROF UNIQUEMENT)
app.post('/api/annonces', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { titre, message, destinataires } = req.body;
        const auteur_id = req.user.id;

        if (!titre || !message) {
            return res.status(400).json({ error: 'Le titre et le message sont requis' });
        }

        await db.runAsync(
            'INSERT INTO annonces (titre, contenu, auteur_id, destinataires) VALUES (?, ?, ?, ?)',
            [titre, message, auteur_id, destinataires || 'Tous']
        );

        res.status(201).json({ message: 'Annonce publiée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de la publication de l'annonce" });
    }
});

// PUT /api/rendus/:id/status - Marquer un rendu comme évalué ou non (Protégé, PROF UNIQUEMENT)
app.put('/api/rendus/:id/status', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const renduId = req.params.id;
        const { est_evalue } = req.body;

        if (est_evalue === undefined) {
            return res.status(400).json({ error: 'est_evalue is required' });
        }

        await db.runAsync('UPDATE rendus SET est_evalue = ? WHERE id_rendu = ?', [est_evalue ? 1 : 0, renduId]);

        res.json({ message: 'Statut du rendu mis à jour' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du statut' });
    }
});

// PUT /api/rendus/:id/evaluation - Évaluer un rendu (Protégé, PROF UNIQUEMENT)
app.put('/api/rendus/:id/evaluation', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const renduId = req.params.id;
        const { note, commentaire } = req.body;

        if (note === undefined) {
            return res.status(400).json({ error: 'La note est requise' });
        }

        await db.runAsync(
            'UPDATE rendus SET note_attribuee = ?, commentaire_prof = ?, est_evalue = 1 WHERE id_rendu = ?',
            [note, commentaire || '', renduId]
        );

        res.json({ message: 'Rendu évalué avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de l'évaluation" });
    }
});

// PUT /api/notes/:id_suivi - Alias pour l'évaluation d'un rendu (Protégé, PROF UNIQUEMENT)
app.put('/api/notes/:id_suivi', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const renduId = req.params.id_suivi;
        const { note, commentaire } = req.body;

        if (note === undefined) {
            return res.status(400).json({ error: 'La note est requise' });
        }

        await db.runAsync(
            'UPDATE rendus SET note_attribuee = ?, commentaire_prof = ?, est_evalue = 1 WHERE id_rendu = ?',
            [note, commentaire || '', renduId]
        );

        res.json({ message: 'Note et commentaire enregistrés avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de l'enregistrement de la note" });
    }
});

// GET /api/mes-notes - Récupérer les retours (Étudiant)
app.get('/api/mes-notes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // On récupère toutes les SAEs où cet étudiant a soumis un rendu
        const rendus = await db.allAsync(`
            SELECT 
                r.id_rendu as rendu_id, r.chemin_fichier as nom_fichier, r.date_depot, r.note_attribuee as note, r.commentaire_prof, r.est_evalue as rendu_status,
                s.id_sae as sae_id, s.titre as title, s.description, s.date_fin as due_date, s.competences
            FROM rendus r
            JOIN sae s ON r.id_sae = s.id_sae
            WHERE r.id_user = ?
            ORDER BY r.date_depot DESC
        `, [userId]);

        res.json(rendus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des notes' });
    }
});

// GET /api/mes-documents - Liste des rendus de l'étudiant (Espace Documents)
app.get('/api/mes-documents', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`[DEBUG] Récupération des documents pour l'user: ${userId}`);

        const documents = await db.allAsync(`
            SELECT r.*, s.titre as sae_titre 
            FROM rendus r 
            LEFT JOIN sae s ON r.id_sae = s.id_sae 
            WHERE r.id_user = ? 
            ORDER BY r.date_depot DESC
        `, [userId]);

        console.log(`[DEBUG] ${documents.length} documents trouvés.`);
        res.json(documents);
    } catch (error) {
        console.error("Erreur mes-documents:", error);
        res.status(500).json({ error: 'Erreur lors de la récupération de vos documents.' });
    }
});

// ====== ROUTES ADMINISTRATEUR ======
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') next();
    else res.status(403).json({ error: 'Accès refusé. Réservé aux administrateurs.' });
};

// ============================================
// ARBORESCENCE DES GROUPES MMI
// ============================================
// Chaque clé est un parent, ses valeurs sont ses enfants directs.
// Un étudiant en MMI1A1 verra les SAE de: MMI1A1 + MMI1A + MMI1
const GROUP_TREE = {
    'MMI1': ['MMI1A', 'MMI1B'],
    'MMI1A': ['MMI1A1', 'MMI1A2'],
    'MMI1B': ['MMI1B1', 'MMI1B2'],
    'MMI2': ['MMI2A', 'MMI2B'],
    'MMI2A': ['MMI2A1', 'MMI2A2'],
    'MMI2B': ['MMI2B1', 'MMI2B2'],
    'MMI3': ['MMI3_GR1', 'MMI3_GR2', 'MMI3-FI', 'MMI3-FA'],
    'MMI3-FA': ['MMI3-FA-CN', 'MMI3-FA-DW'],
    'MMI3-FA-CN': ['MMI3-FA-CN-A1', 'MMI3-FA-CN-A2'],
    'MMI3-FA-DW': ['MMI3-FA-DW-A1', 'MMI3-FA-DW-A2'],
};

/**
 * Retourne le groupe lui-même + TOUS ses ancêtres dans GROUP_TREE.
 * Ex: 'MMI1A1' => ['MMI1A1', 'MMI1A', 'MMI1']
 */
function getGroupAncestors(groupe) {
    if (!groupe) return [];
    const result = [groupe];
    // Chercher parmi tous les parents celui qui contient ce groupe
    for (const [parent, children] of Object.entries(GROUP_TREE)) {
        if (children.includes(groupe)) {
            // Remonter récursivement
            result.push(...getGroupAncestors(parent));
            break;
        }
    }
    return [...new Set(result)];
}
app.post('/api/login/admin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
        const admin = await db.getAsync('SELECT * FROM utilisateurs WHERE email = ? AND role = "admin"', [email]);
        if (!admin || !admin.mot_de_passe) {
            return res.status(401).json({ error: 'Administrateur introuvable ou rôle incorrect' });
        }

        // Tolérer le texte brut si la BDD n'a pas hashé le mot de passe initial
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, admin.mot_de_passe);
        } catch (bcryptErr) {
            // Ignorer l'erreur si le hash est invalide (ex: texte brut)
            console.warn("Bcrypt compare error (possibly plain text password):", bcryptErr.message);
        }

        const validPassword = isMatch || (password === admin.mot_de_passe);

        if (!validPassword) return res.status(401).json({ error: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: admin.id_user, role: admin.role, nom: admin.nom, email: admin.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: admin.id_user, nom: admin.nom, role: admin.role, email: admin.email } });
    } catch (e) {
        console.error("ERREUR LOGIN ADMIN:", e);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.get('/api/admin/demandes', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const demandes = await db.allAsync('SELECT * FROM demandes_comptes WHERE statut = "En attente" ORDER BY date_demande DESC');
        res.json(demandes);
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de la récupération des demandes.' });
    }
});

app.post('/api/admin/demandes/:id/valider', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { groupe } = req.body;
        const demande = await db.getAsync('SELECT * FROM demandes_comptes WHERE id_demande = ?', [id]);
        if (!demande || demande.statut !== 'En attente') return res.status(404).json({ error: 'Demande introuvable ou déjà traitée.' });

        await db.runAsync(
            'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, groupe_td, annee_promo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [demande.nom, demande.prenom, demande.email, demande.mot_de_passe, demande.role, groupe || null, '']
        );
        await db.runAsync('UPDATE demandes_comptes SET statut = "Approuvée" WHERE id_demande = ?', [id]);

        res.json({ message: 'Compte validé et créé avec succès.' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la validation.' });
    }
});

app.post('/api/admin/demandes/:id/rejeter', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        await db.runAsync('UPDATE demandes_comptes SET statut = "Rejetée" WHERE id_demande = ?', [id]);
        res.json({ message: 'Demande rejetée.' });
    } catch (e) {
        res.status(500).json({ error: 'Erreur.' });
    }
});

app.get('/api/admin/saes/pending', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const saes = await db.allAsync(`
            SELECT s.*, u.nom as prof_nom, u.prenom as prof_prenom
            FROM sae s
            LEFT JOIN utilisateurs u ON s.id_prof = u.id_user
            WHERE s.statut = 'En attente'
            ORDER BY s.date_debut ASC
        `);
        res.json(saes);
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de la récupération des demandes de SAE.' });
    }
});

app.get('/api/admin/saes/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const saes = await db.allAsync(`
            SELECT s.*, u.nom as prof_nom, u.prenom as prof_prenom
            FROM sae s
            LEFT JOIN utilisateurs u ON s.id_prof = u.id_user
            ORDER BY s.date_debut DESC
        `);
        res.json(saes);
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de la récupération de toutes les SAEs.' });
    }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await db.allAsync('SELECT id_user, nom, prenom, email, role, numero_etudiant, groupe_td, annee_promo FROM utilisateurs ORDER BY nom ASC');
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
});

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { nom, prenom, email, role, groupe_td, numero_etudiant, mot_de_passe } = req.body;

        let query = 'UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, role = ?, groupe_td = ?, numero_etudiant = ?';
        let params = [nom, prenom, email, role, groupe_td || null, numero_etudiant || null];

        if (mot_de_passe && mot_de_passe.trim() !== '') {
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
            query += ', mot_de_passe = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id_user = ?';
        params.push(id);

        await db.runAsync(query, params);
        res.json({ message: 'Utilisateur mis à jour avec succès.' });
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur.' });
    }
});

// DELETE /api/admin/users/:id - Supprimer un utilisateur (ADMIN UNIQUEMENT)
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        await db.runAsync('DELETE FROM utilisateurs WHERE id_user = ?', [id]);
        res.json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (e) {
        console.error("ERREUR SUPPRESSION USER:", e);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur.' });
    }
});

app.put('/api/admin/saes/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const { code } = req.body;
        if (!code || code.trim() === '') return res.status(400).json({ error: 'Le code SAE est obligatoire.' });

        const existing = await db.getAsync('SELECT id_sae FROM sae WHERE code = ? AND id_sae != ?', [code, id]);
        if (existing) {
            return res.status(409).json({ error: 'Ce code SAE est déjà utilisé.' });
        }

        await db.runAsync('UPDATE sae SET statut = "Validé", code = ? WHERE id_sae = ?', [code, id]);
        res.json({ message: 'SAE approuvée et rendue visible.' });
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de l\'approbation de la SAE.' });
    }
});

app.put('/api/admin/saes/:id', authenticateToken, requireAdmin, upload.fields([{ name: 'vignette', maxCount: 1 }, { name: 'consignes', maxCount: 10 }]), async (req, res) => {
    try {
        const saeId = req.params.id;
        const { titre, description, competences, date_debut, date_fin, semestre, annee_univ, groupe } = req.body;

        const sae = await db.getAsync('SELECT id_sae, vignette_path, consignes_paths FROM sae WHERE id_sae = ?', [saeId]);
        if (!sae) return res.status(404).json({ error: 'SAE non trouvée' });

        let parsedCompetences = competences;
        if (typeof competences === 'string') {
            try { parsedCompetences = JSON.parse(competences); } catch (e) { parsedCompetences = []; }
        }
        const competencesJSON = JSON.stringify(parsedCompetences || []);

        const vignette = req.files && req.files['vignette'] ? `/uploads/vignettes/${req.files['vignette'][0].filename}` : sae.vignette_path;

        let existingConsignes = sae.consignes_paths ? JSON.parse(sae.consignes_paths) : [];
        if (req.body.existingConsignes) {
            try { existingConsignes = JSON.parse(req.body.existingConsignes); } catch (e) { }
        }

        let consignesJSON = JSON.stringify(existingConsignes);
        if (req.files && req.files['consignes']) {
            const consignesFiles = req.files['consignes'].map(f => `/uploads/consignes/${f.filename}`);
            consignesJSON = JSON.stringify([...existingConsignes, ...consignesFiles]);
        }

        await db.runAsync(
            'UPDATE sae SET titre = ?, description = ?, date_debut = ?, date_fin = ?, groupe = ?, semestre = ?, annee_univ = ?, competences = ?, vignette_path = ?, consignes_paths = ? WHERE id_sae = ?',
            [titre, description, date_debut, date_fin || null, groupe || '', semestre || '', annee_univ || '2023-2024', competencesJSON, vignette, consignesJSON, saeId]
        );

        res.json({ message: 'SAE modifiée avec succès par l\'administrateur' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la SAE' });
    }
});


app.delete('/api/admin/saes/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        await db.runAsync('DELETE FROM sae WHERE id_sae = ?', [id]);
        res.json({ message: 'La demande de SAE a été refusée et supprimée.' });
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la SAE.' });
    }
});

// ============================================
// CYCLE DE VIE DES RENDUS (SAEs)
// ============================================

// Étudiant: Déposer un rendu (Nouveau format demandé)
app.post('/api/rendu', authenticateToken, upload.single('fichier'), async (req, res) => {
    try {
        if (req.user.role !== 'student') return res.status(403).json({ error: 'Accès réservé aux étudiants.' });

        const saeId = req.body.saeId;
        const userId = req.user.id_user;
        const commentaire = req.body.commentaire || '';

        console.log(`[DEBUG] Dépôt rendu: User=${userId}, SAE=${saeId}`);

        if (!saeId) return res.status(400).json({ error: 'ID de SAE manquant.' });
        if (!req.file) return res.status(400).json({ error: 'Fichier manquant.' });

        const sae = await db.getAsync('SELECT date_fin, date_limite FROM sae WHERE id_sae = ?', [saeId]);
        if (!sae) return res.status(404).json({ error: 'SAE introuvable.' });

        const limitDate = sae.date_limite || sae.date_fin;
        if (limitDate && new Date() > new Date(limitDate)) {
            return res.status(403).json({ error: 'La date limite pour ce rendu est dépassée.' });
        }

        const filePath = `/uploads/rendus/${req.file.filename}`;

        // Mettre à jour suivi_etudiant_sae
        const existingSuivi = await db.getAsync('SELECT id_suivi FROM suivi_etudiant_sae WHERE id_user = ? AND id_sae = ?', [userId, saeId]);
        if (existingSuivi) {
            await db.runAsync(
                'UPDATE suivi_etudiant_sae SET fichier_path = ?, commentaire = ?, date_depot = CURRENT_TIMESTAMP, statut = "Déposé" WHERE id_suivi = ?',
                [filePath, commentaire, existingSuivi.id_suivi]
            );
        } else {
            await db.runAsync(
                'INSERT INTO suivi_etudiant_sae (id_user, id_sae, fichier_path, commentaire, date_depot, statut) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, "Déposé")',
                [userId, saeId, filePath, commentaire]
            );
        }

        // Garder la compatibilité avec la table rendus (CRITIQUE pour la vue Prof)
        const existingRendu = await db.getAsync('SELECT id_rendu FROM rendus WHERE id_user = ? AND id_sae = ?', [userId, saeId]);
        if (existingRendu) {
            await db.runAsync(
                'UPDATE rendus SET chemin_fichier = ?, date_depot = CURRENT_TIMESTAMP, est_evalue = 0 WHERE id_rendu = ?',
                [filePath, existingRendu.id_rendu]
            );
        } else {
            await db.runAsync(
                'INSERT INTO rendus (id_user, id_sae, chemin_fichier, date_depot, est_evalue) VALUES (?, ?, ?, CURRENT_TIMESTAMP, 0)',
                [userId, saeId, filePath]
            );
        }

        res.json({ message: 'Rendu déposé avec succès.', filePath });
    } catch (e) {
        console.error("ERREUR DÉPÔT RENDU:", e);
        res.status(500).json({ error: 'Erreur lors du dépôt du fichier.' });
    }
});

// Étudiant: Déposer un rendu (Alias pour l'ancien chemin)
app.post('/api/rendus', authenticateToken, upload.single('document'), async (req, res) => {
    // Redirige vers le nouveau format si possible ou traite séparément
    req.body.fichier = req.file;
    // Simplement déléguer ou garder le code existant mais corrigé
    try {
        if (req.user.role !== 'student') return res.status(403).json({ error: 'Accès réservé.' });
        const saeId = req.body.saeId;
        const userId = req.user.id_user;
        if (!req.file) return res.status(400).json({ error: 'Fichier manquant.' });
        const filePath = `/uploads/rendus/${req.file.filename}`;
        const existing = await db.getAsync('SELECT id_rendu FROM rendus WHERE id_user = ? AND id_sae = ?', [userId, saeId]);
        if (existing) {
            await db.runAsync('UPDATE rendus SET chemin_fichier = ?, date_depot = CURRENT_TIMESTAMP WHERE id_rendu = ?', [filePath, existing.id_rendu]);
        } else {
            await db.runAsync('INSERT INTO rendus (id_user, id_sae, chemin_fichier) VALUES (?, ?, ?)', [userId, saeId, filePath]);
        }
        res.json({ message: 'Rendu déposé avec succès.' });
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors du dépôt.' });
    }
});

// Étudiant: Voir ses notes
app.get('/api/mes-notes', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'student') return res.status(403).json({ error: 'Accès réservé.' });
        const notes = await db.allAsync(`
            SELECT r.*, s.titre, s.code 
            FROM rendus r
            JOIN sae s ON r.id_sae = s.id_sae
            WHERE r.id_user = ? AND r.est_evalue = 1
            ORDER BY r.date_depot DESC
        `, [req.user.id_user]);
        res.json(notes);
    } catch (e) {
        res.status(500).json({ error: 'Erreur Serveur.' });
    }
});

// Étudiant: Liste de tous ses documents/rendus
app.get('/api/mes-documents', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'student') return res.status(403).json({ error: 'Accès réservé.' });
        const docs = await db.allAsync(`
            SELECT r.*, s.titre 
            FROM rendus r
            JOIN sae s ON r.id_sae = s.id_sae
            WHERE r.id_user = ?
            ORDER BY r.date_depot DESC
        `, [req.user.id_user]);
        res.json(docs);
    } catch (e) {
        res.status(500).json({ error: 'Erreur récupération documents.' });
    }
});

// Statistiques SAE : Rendus par rapport au total étudiants
app.get('/api/saes/:id/stats', authenticateToken, async (req, res) => {
    try {
        const saeId = req.params.id;
        const sae = await db.getAsync('SELECT groupe FROM sae WHERE id_sae = ?', [saeId]);
        if (!sae) return res.status(404).json({ error: 'SAE introuvable' });

        const stats = await db.getAsync(`
            SELECT 
                (SELECT COUNT(*) FROM rendus WHERE id_sae = ?) as progress_count,
                (SELECT COUNT(*) FROM utilisateurs WHERE role = 'student' AND (groupe_td = ? OR ? = '' OR ? IS NULL)) as total_students
        `, [saeId, sae.groupe, sae.groupe, sae.groupe]);

        res.json(stats);
    } catch (e) {
        console.error("Erreur stats:", e);
        res.status(500).json({ error: 'Erreur lors du calcul des statistiques.' });
    }
});

// Professeur/Admin: Récupérer les rendus d'une SAE
app.get('/api/rendus/:saeId', authenticateToken, async (req, res) => {
    try {
        if (req.user.role === 'student') return res.status(403).json({ error: 'Accès réservé.' });
        const saeId = req.params.saeId;
        console.log(`[DEBUG] Requête rendus reçue pour SAE: ${saeId}`);

        const rendus = await db.allAsync(`
            SELECT r.*, u.nom, u.prenom, s.titre as sae_titre 
            FROM rendus r 
            LEFT JOIN utilisateurs u ON r.id_user = u.id_user 
            LEFT JOIN sae s ON r.id_sae = s.id_sae
            WHERE r.id_sae = ?
        `, [saeId]);

        console.log(`[DEBUG] Données envoyées au front (${rendus.length} lignes):`, rendus);
        res.json(rendus);
    } catch (e) {
        res.status(500).json({ error: 'Erreur récupération.' });
    }
});

// Professeur/Admin: Noter un rendu
app.put('/api/rendus/:id/note', authenticateToken, async (req, res) => {
    try {
        if (req.user.role === 'student') return res.status(403).json({ error: 'Accès réservé.' });
        const { note, commentaire } = req.body;
        const id_rendu = req.params.id;
        await db.runAsync(
            'UPDATE rendus SET note_attribuee = ?, commentaire_prof = ?, est_evalue = 1 WHERE id_rendu = ?',
            [note !== undefined ? note : null, commentaire || '', id_rendu]
        );
        res.json({ message: 'Note enregistrée.' });
    } catch (e) {
        res.status(500).json({ error: 'Erreur de notation.' });
    }
});

// --- CONFIGURATION FRONT-END (VUE.JS) ---

// 1. On indique le chemin vers le build de la vitrine
const distPath = path.join(__dirname, '..', 'client', 'dist');

// 2. On sert les fichiers statiques (JS, CSS, images)
app.use(express.static(distPath));

// 3. Le fameux "Catch-all" version Express 5 (sans astérisque)
app.use((req, res, next) => {
    // Si c'est un appel vers l'API, on ne s'en occupe pas ici
    if (req.path.startsWith('/api')) {
        return next();
    }
    
    // Pour toutes les autres URL (navigation sur le site), on envoie index.html
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
            console.error("Erreur d'envoi du fichier HTML :", err);
            res.status(500).send("Le frontend n'est pas encore compilé (dossier dist introuvable).");
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});
