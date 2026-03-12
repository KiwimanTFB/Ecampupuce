require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
    const { email, password } = req.body;
    
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

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
