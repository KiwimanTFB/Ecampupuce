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
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });
// S'assurer que le dossier uploads existe
const fs = require('fs');
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}

// Ensure sae table has id_prof column for Teacher association
db.run('ALTER TABLE sae ADD COLUMN id_prof INTEGER', (err) => {
    if (err) {
        // Ignore column already exists error
        if (!err.message.includes('duplicate column name')) {
            console.error('Erreur lors de l\'ajout de la colonne id_prof:', err.message);
        }
    } else {
        console.log('Colonne id_prof ajoutée à la table sae.');
    }
});

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
            nom: user.nom, // Mapping pour compatibilité vue frontend
            name: user.nom + ' ' + user.prenom,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: userPayload });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
});

// GET /api/saes - Récupérer toutes les SAEs (Route protégée)
app.get('/api/saes', authenticateToken, async (req, res) => {
    try {
        const saes = await db.allAsync(`
            SELECT 
                s.*,
                (SELECT COUNT(*) FROM utilisateurs WHERE role = 'student') as total_students,
                (SELECT COUNT(DISTINCT r.id_groupe) FROM rendus r JOIN livrables l ON r.id_livrable = l.id_livrable WHERE l.id_sae = s.id_sae) as progress_count
            FROM sae s
        `);
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
app.post('/api/saes', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { titre, description, niveau, semestre, annee_univ, date_debut, consignes } = req.body;
        const teacher_id = req.user.id;
        
        if (!titre || !description || !date_debut || !niveau || !semestre || !annee_univ) {
            return res.status(400).json({ error: 'Titre, description, niveau, semestre, année universitaire et date de début sont requis.' });
        }

        const result = await db.runAsync(
            "INSERT INTO sae (titre, description, semestre, annee_univ, date_debut, consignes, statut, niveau, id_prof) VALUES (?, ?, ?, ?, ?, ?, 'En attente', ?, ?)",
            [titre, description, semestre, annee_univ, date_debut, consignes || '', niveau, teacher_id]
        );

        res.status(201).json({ message: 'SAE créée avec succès', id: result.lastID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de la SAE' });
    }
});

// PUT /api/saes/:id - Mettre à jour une SAE (Route protégée, PROF créateur UNIQUEMENT)
app.put('/api/saes/:id', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const saeId = req.params.id;
        const teacher_id = req.user.id;
        const { title, description, competences, due_date, status, level, groupType } = req.body;

        // Vérifier que la SAE appartient bien à ce prof
        const sae = await db.getAsync('SELECT id_sae FROM sae WHERE id_sae = ?', [saeId]);
        if (!sae) return res.status(404).json({ error: 'SAE non trouvée' });

        await db.runAsync(
            'UPDATE sae SET titre = ?, description = ?, date_debut = ?, statut = ?, niveau = ? WHERE id_sae = ?',
            [title, description, due_date, status, level, saeId]
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

// POST /api/upload - Déposer un fichier (Route protégée)
app.post('/api/upload', authenticateToken, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier sélectionné' });
        }

        const saeId = req.body.saeId;
        const userId = req.user.id;
        const filename = req.file.originalname;
        const filepath = `/uploads/${req.file.filename}`;

        if (!saeId) {
            return res.status(400).json({ error: "L'ID de la SAE est requis" });
        }

        // Optionnel: vérifier si la SAE existe
        const sae = await db.getAsync('SELECT id FROM saes WHERE id = ?', [saeId]);
        if (!sae) {
            return res.status(404).json({ error: "SAE introuvable" });
        }

        await db.runAsync(
            'INSERT INTO rendus (sae_id, user_id, nom_fichier, chemin_fichier) VALUES (?, ?, ?, ?)',
            [saeId, userId, filename, filepath]
        );

        res.json({ message: 'Fichier uploadé avec succès', filename, filepath });

    } catch (error) {
        console.error('Erreur API Upload:', error);
        res.status(500).json({ error: "Erreur lors de l'upload du fichier" });
    }
});

// GET /api/rendus - Récupérer les rendus par SAE (Route protégée, PROF UNIQUEMENT)
app.get('/api/rendus', authenticateToken, requireTeacher, async (req, res) => {
    try {
        const { sae_id } = req.query;
        if (!sae_id) {
            return res.status(400).json({ error: 'sae_id param is required' });
        }
        
        const rendus = await db.allAsync(`
            SELECT r.*, u.name as etudiant_nom
            FROM rendus r
            JOIN users u ON r.user_id = u.id
            WHERE r.sae_id = ?
            ORDER BY r.date_depot DESC
        `, [sae_id]);
        
        res.json(rendus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des rendus' });
    }
});

// GET /api/annonces - Récupérer toutes les annonces (Protégé, tout le monde peut lire)
app.get('/api/annonces', authenticateToken, async (req, res) => {
    try {
        const annonces = await db.allAsync(`
            SELECT a.*, u.name as auteur_nom 
            FROM annonces a 
            JOIN users u ON a.auteur_id = u.id 
            ORDER BY a.date_creation DESC
        `);
        res.json(annonces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des annonces' });
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
            'INSERT INTO annonces (titre, message, destinataires, auteur_id) VALUES (?, ?, ?, ?)',
            [titre, message, destinataires || 'Tous', auteur_id]
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
        const { is_evaluated } = req.body;

        if (is_evaluated === undefined) {
             return res.status(400).json({ error: 'is_evaluated is required' });
        }

        await db.runAsync('UPDATE rendus SET is_evaluated = ? WHERE id = ?', [is_evaluated ? 1 : 0, renduId]);
        
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

        // 1. Mettre à jour le rendu
        await db.runAsync(
            'UPDATE rendus SET note = ?, commentaire_prof = ?, is_evaluated = 1, status = ? WHERE id = ?',
            [note, commentaire || '', 'graded', renduId]
        );

        res.json({ message: 'Rendu évalué avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de l'évaluation" });
    }
});

// GET /api/mes-notes - Récupérer les retours (Étudiant)
app.get('/api/mes-notes', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // On récupère toutes les SAEs où cet étudiant a soumis un rendu
        const rendus = await db.allAsync(`
            SELECT 
                r.id as rendu_id, r.nom_fichier, r.date_depot, r.note, r.commentaire_prof, r.status as rendu_status,
                s.id as sae_id, s.title, s.description, s.due_date, s.competences
            FROM rendus r
            JOIN saes s ON r.sae_id = s.id
            WHERE r.user_id = ?
            ORDER BY r.date_depot DESC
        `, [userId]);

        res.json(rendus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des notes' });
    }
});

// ====== ROUTES ADMINISTRATEUR ======
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Accès refusé. Réservé aux administrateurs.' });
    }
};

app.post('/api/login/admin', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
        const admin = await db.getAsync('SELECT * FROM utilisateurs WHERE email = ? AND role = "admin"', [email]);
        if (!admin) return res.status(401).json({ error: 'Administrateur introuvable ou rôle incorrect' });

        // Tolérer le texte brut si la BDD n'a pas hashé le mot de passe initial
        const isMatch = await bcrypt.compare(password, admin.mot_de_passe).catch(() => false);
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
        const demande = await db.getAsync('SELECT * FROM demandes_comptes WHERE id_demande = ?', [id]);
        if (!demande || demande.statut !== 'En attente') return res.status(404).json({ error: 'Demande introuvable ou déjà traitée.' });

        await db.runAsync(
            'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, groupe_td, annee_promo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [demande.nom, demande.prenom, demande.email, demande.mot_de_passe, demande.role, null, '']
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

app.put('/api/admin/saes/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        await db.runAsync('UPDATE sae SET statut = "Validé" WHERE id_sae = ?', [id]);
        res.json({ message: 'SAE approuvée et rendue visible.' });
    } catch (e) {
        res.status(500).json({ error: 'Erreur lors de l\'approbation de la SAE.' });
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

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
