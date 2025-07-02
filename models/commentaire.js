const db = require('../database');

const Commentaire = {
  create: (utilisateur_id, livre_id, commentaire, note) => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO commentaires (utilisateur_id, livre_id, commentaire, note) VALUES (?, ?, ?, ?)',
        [utilisateur_id, livre_id, commentaire, note],
        (err, result) => {
          if (err) return reject(err);
          resolve({ id: result.insertId, utilisateur_id, livre_id, commentaire, note });
        }
      );
    });
  },
  getByLivre: (livre_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT c.*, u.nom as utilisateur_nom FROM commentaires c JOIN utilisateurs u ON c.utilisateur_id = u.id WHERE c.livre_id = ? ORDER BY c.date_commentaire DESC',
        [livre_id],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },
  getByUser: (utilisateur_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT c.*, l.titre as livre_titre FROM commentaires c JOIN livres l ON c.livre_id = l.id WHERE c.utilisateur_id = ? ORDER BY c.date_commentaire DESC',
        [utilisateur_id],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }
};

module.exports = Commentaire;
