const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Charger les données mock
const saesDataPath = path.join(__dirname, 'saes.json');

app.get('/api/test', (req, res) => {
    res.json({ message: "L'API de SaeTrack fonctionne correctement !" });
});

// GET /api/saes
app.get('/api/saes', (req, res) => {
    fs.readFile(saesDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la lecture des données' });
        }
        res.json(JSON.parse(data));
    });
});

// GET /api/saes/:id
app.get('/api/saes/:id', (req, res) => {
    const saeId = parseInt(req.params.id, 10);
    fs.readFile(saesDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la lecture des données' });
        }
        const saes = JSON.parse(data);
        const sae = saes.find(s => s.id === saeId);
        
        if (sae) {
            res.json(sae);
        } else {
            res.status(404).json({ error: 'SAE non trouvée' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
