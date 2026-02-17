const express = require('express');
const cors = require('cors'); // Important pour que le port 8080 parle au 3000
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// DONNÉES FICTIVES (Mock Data) pour respecter la structure demandée 
const saes = [
    {
        id: 1,
        titre: "Plateforme Intranet MMI",
        semestre: "S4",
        description: "Création d'un outil de suivi de SAE",
        dateRendu: "2026-06-15"
    },
    {
        id: 2,
        titre: "Création d'une identité visuelle",
        semestre: "S3",
        description: "Logo, charte graphique et déclinaisons",
        dateRendu: "2026-03-20"
    }
];

// ROUTE API : Récupérer toutes les SAE
app.get('/api/saes', (req, res) => {
    res.json(saes);
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});