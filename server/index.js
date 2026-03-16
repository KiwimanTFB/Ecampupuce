require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('./db');
const initDB = require('./init-db');

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

// Initialiser les tables au démarrage
initDB();

// Middleware d'authentification JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.status(401).json({ error: 'Token manquant' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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

// POST /api/register - Inscription d'un nouvel utilisateur
app.post('/api/register', async (req, res) => {
    const { nom, email, password, role } = req.body;

    if (!nom || !email || !password || !role) {
        return res.status(400).json({ error: 'Tous les champs sont requis (nom, email, password, role)' });
    }

    if (role !== 'student' && role !== 'teacher') {
        return res.status(400).json({ error: 'Le rôle doit être "student" ou "teacher"' });
    }

    try {
        // Vérifier si l'email existe déjà
        const existing = await db.getAsync('SELECT id FROM users WHERE email = ?', [email]);
        if (existing) {
            return res.status(409).json({ error: 'Un compte avec cet email existe déjà' });
        }

        // Hasher le mot de passe
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Insérer l'utilisateur
        const result = await db.runAsync(
            'INSERT INTO users (nom, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [nom, email, password_hash, role]
        );

        res.status(201).json({ message: 'Compte créé avec succès', userId: result.lastID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
    }
});

// POST /api/login - Authentification et génération du JWT
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    try {
        const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(400).json({ error: 'Utilisateur introuvable' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        const userPayload = {
            id: user.id,
            nom: user.nom,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, user: userPayload });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
});

// GET /api/saes - Récupérer toutes les SAEs (Route protégée)
app.get('/api/saes', authenticateToken, async (req, res) => {
    try {
        const saes = await db.allAsync('SELECT * FROM saes');
        
        const formattedSaes = saes.map(sae => ({
            ...sae,
            isEvaluated: !!sae.isEvaluated
        }));
        
        res.json(formattedSaes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des SAEs' });
    }
});

// GET /api/public/saes - Route publique pour la vitrine (Landing Page)
app.get('/api/public/saes', async (req, res) => {
    try {
        const { promo, semestre, annee, domaine } = req.query;
        let query = 'SELECT * FROM saes WHERE is_public = 1';
        let queryParams = [];

        if (promo) {
            query += ' AND promo = ?';
            queryParams.push(promo);
        }
        if (semestre) {
            query += ' AND semestre = ?';
            queryParams.push(semestre);
        }
        if (annee) {
            query += ' AND annee = ?';
            queryParams.push(Number(annee));
        }
        if (domaine) {
            query += ' AND domaine = ?';
            queryParams.push(domaine);
        }

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
        const sae = await db.getAsync('SELECT * FROM saes WHERE id = ?', [saeId]);
        
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
        const { title, description, deadline, semestre, annee = 2026, status = 'ongoing', groupType = 'Non spécifié' } = req.body;
        
        if (!title || !description || !deadline || !semestre) {
            return res.status(400).json({ error: 'Le titre, la description, le semestre et la deadline sont requis' });
        }

        const result = await db.runAsync(
            'INSERT INTO saes (title, description, deadline, semestre, annee, status, groupType) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, deadline, semestre, annee, status, groupType]
        );

        res.status(201).json({ message: 'SAE créée avec succès', id: result.lastID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de la SAE' });
    }
});

// POST /api/upload - Déposer un fichier (Route protégée)
app.post('/api/upload', authenticateToken, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier sélectionné' });
        }

        const { saeId } = req.body;
        const userId = req.user.id;
        const filename = req.file.originalname;
        const filepath = `/uploads/${req.file.filename}`;

        if (!saeId) {
            return res.status(400).json({ error: "L'ID de la SAE est requis" });
        }

        await db.runAsync(
            'INSERT INTO rendus (sae_id, user_id, nom_fichier, chemin_fichier) VALUES (?, ?, ?, ?)',
            [saeId, userId, filename, filepath]
        );

        await db.runAsync(
            'UPDATE saes SET deliveryStatus = ? WHERE id = ?',
            [`Rendu déposé le ${new Date().toLocaleDateString('fr-FR')}`, saeId]
        );

        res.json({ message: 'Fichier uploadé avec succès', filename, filepath });

    } catch (error) {
        console.error(error);
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
            SELECT r.*, u.nom as etudiant_nom
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
            SELECT a.*, u.nom as auteur_nom 
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
            'UPDATE rendus SET note = ?, commentaire_prof = ?, is_evaluated = 1 WHERE id = ?',
            [note, commentaire || '', renduId]
        );

        // 2. Mettre à jour la SAE correspondante
        const rendu = await db.getAsync('SELECT sae_id FROM rendus WHERE id = ?', [renduId]);
        if (rendu) {
            await db.runAsync(
                'UPDATE saes SET isEvaluated = 1, grade = ?, comment = ? WHERE id = ?',
                [note, commentaire || '', rendu.sae_id]
            );
        }

        res.json({ message: 'Rendu évalué avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur lors de l'évaluation" });
    }
});

// GET /api/mes-notes - Récupérer les retours (Étudiant)
app.get('/api/mes-notes', authenticateToken, async (req, res) => {
    try {
        const saes = await db.allAsync('SELECT * FROM saes WHERE isEvaluated = 1');
        const formattedSaes = saes.map(sae => ({
            ...sae,
            isEvaluated: !!sae.isEvaluated
        }));
        res.json(formattedSaes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des notes' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
