CREATE DATABASE Biblio_2ie;

USE Biblio_2ie;

CREATE TABLE users (
  id int PRIMARY KEY AUTO_INCREMENT ,
  nom varchar(50) DEFAULT NULL,
  prenom varchar(50) DEFAULT NULL,
  age int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE utilisateurs (
  id int PRIMARY KEY AUTO_INCREMENT ,
  nom varchar(50) DEFAULT NULL,
  prenom varchar(50) DEFAULT NULL,
  telephone varchar(50) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  password varchar(255) DEFAULT NULL,
  useractive int NOT NULL DEFAULT '1',
  dateMAJ datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE access_token (
  access_token_id int PRIMARY KEY AUTO_INCREMENT,
  user_id int DEFAULT NULL,
  access_token text,
  ip_address varchar(15) DEFAULT NULL,
  DateMAJ datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE access_token
  ADD PRIMARY KEY (access_token_id),
  ADD KEY fk_access_token_1_idx (user_id);

--
-- Index pour la table users
--
ALTER TABLE users
  ADD PRIMARY KEY (id);

--
-- Index pour la table utilisateurs
--
ALTER TABLE utilisateurs
  ADD PRIMARY KEY (id) AUTO_INCREMENT,
  ADD UNIQUE KEY email (email);

ALTER TABLE utilisateurs
ADD COLUMN sexe VARCHAR(10) DEFAULT NULL AFTER prenom;

ALTER TABLE utilisateurs
ADD COLUMN sexe VARCHAR(10) AFTER prenom;

CREATE TABLE livres (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(100) NOT NULL,
  genre VARCHAR(50) DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  statut VARCHAR(20) DEFAULT 'disponible', -- disponible, réservé, emprunté, etc.
  utilisateur_id INT DEFAULT NULL,         -- clé étrangère vers utilisateurs si réservé/emprunté
  date_reservation DATETIME DEFAULT NULL,
  date_emprunt DATETIME DEFAULT NULL,
  date_retour DATETIME DEFAULT NULL,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO livres (titre, auteur, genre, image, statut)
VALUES 
  ('Le Petit Prince', 'Antoine de Saint-Exupéry', 'Roman', '/Assets/livre1.jpg', 'disponible'),
  ('L\'Étranger', 'Albert Camus', 'Roman', '/Assets/livre2.jpg', 'disponible'),
  ('La Peste', 'Albert Camus', 'Roman', '/Assets/livre3.jpg', 'disponible'),
  ('1984', 'George Orwell', 'Science-fiction', '/Assets/livre4.jpg', 'disponible'),
  ('Le Rouge et le Noir', 'Stendhal', 'Classique', '/Assets/livre5.jpg', 'disponible');