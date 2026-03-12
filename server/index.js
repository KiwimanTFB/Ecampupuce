require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('./db');

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
        // Ajout d'un timestamp pour éviter les écrasements de noms
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


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

app.get('/api/test', (req, res) => {
    res.json({ message: "L'API de SaeTrack fonctionne correctement !" });
});

// POST /api/login - Authentification et génération du JWT
app.post('/api/login', async (req, res) => {
    console.log("Body reçu :", req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
        console.log("Erreur : email ou password manquant dans le body");
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Utilisateur introuvable' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        // Créer le payload JWT
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
        const [saes] = await db.query('SELECT * FROM saes');
        
        // Formater les booléens (MySQL renvoie 0 ou 1)
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

// GET /api/saes/:id - Récupérer une SAE spécifique (Route protégée)
app.get('/api/saes/:id', authenticateToken, async (req, res) => {
    const saeId = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM saes WHERE id = ?', [saeId]);
        const sae = rows[0];
        
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
            return res.status(400).json({ error: 'L\'ID de la SAE est requis' });
        }

        // Insertion du rendu dans la table MySQL
        await db.query(
            'INSERT INTO rendus (sae_id, user_id, nom_fichier, chemin_fichier) VALUES (?, ?, ?, ?)',
            [saeId, userId, filename, filepath]
        );

        // Optionnel : Mettre à jour le statut "deliveryStatus" de la SAE
        await db.query(
            'UPDATE saes SET deliveryStatus = ? WHERE id = ?',
            [`Rendu déposé le ${new Date().toLocaleDateString('fr-FR')}`, saeId]
        );

        res.json({ message: 'Fichier uploadé avec succès', filename, filepath });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'upload du fichier' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
