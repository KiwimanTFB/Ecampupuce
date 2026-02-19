-- Activation des clés étrangères pour SQLite
PRAGMA foreign_keys = ON;

-- 1. Table utilisateurs (créée en premier car d'autres tables en dépendent)
CREATE TABLE utilisateurs (
  id_user INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mot_de_passe TEXT NOT NULL,
  role TEXT NOT NULL,
  groupe_td TEXT
);

-- 2. Table sae
CREATE TABLE sae (
  id_sae INTEGER PRIMARY KEY AUTOINCREMENT,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  semestre TEXT NOT NULL,
  annee_univ TEXT NOT NULL,
  date_debut DATETIME NOT NULL,
  consignes TEXT,
  image_mise_en_avant TEXT
);

-- 3. Table livrables
CREATE TABLE livrables (
  id_livrable INTEGER PRIMARY KEY AUTOINCREMENT,
  id_sae INTEGER NOT NULL,
  titre_livrable TEXT NOT NULL,
  date_limite DATETIME NOT NULL,
  FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE
);

-- 4. Table annonces
CREATE TABLE annonces (
  id_annonce INTEGER PRIMARY KEY AUTOINCREMENT,
  id_sae INTEGER,
  id_auteur INTEGER NOT NULL,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  date_publi DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE,
  FOREIGN KEY (id_auteur) REFERENCES utilisateurs (id_user) ON DELETE CASCADE
);

-- 5. Table documents
CREATE TABLE documents (
  id_document INTEGER PRIMARY KEY AUTOINCREMENT,
  id_sae INTEGER NOT NULL,
  id_user INTEGER NOT NULL,
  id_livrable INTEGER,
  nom_fichier TEXT NOT NULL,
  chemin_fichier TEXT NOT NULL,
  type_doc TEXT NOT NULL,
  date_depot DATETIME DEFAULT CURRENT_TIMESTAMP,
  est_public INTEGER DEFAULT 0,
  annee_promo INTEGER,
  FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE,
  FOREIGN KEY (id_user) REFERENCES utilisateurs (id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_livrable) REFERENCES livrables (id_livrable) ON DELETE SET NULL
);

-- 6. Table suivi_etudiant_sae
CREATE TABLE suivi_etudiant_sae (
  id_suivi INTEGER PRIMARY KEY AUTOINCREMENT,
  id_user INTEGER NOT NULL,
  id_sae INTEGER NOT NULL,
  nom_groupe TEXT,
  etat TEXT DEFAULT 'à venir',
  note_attribuee REAL,
  UNIQUE (id_user, id_sae),
  FOREIGN KEY (id_user) REFERENCES utilisateurs (id_user) ON DELETE CASCADE,
  FOREIGN KEY (id_sae) REFERENCES sae (id_sae) ON DELETE CASCADE
);