const db = require('../database');

const Livre = {
  findAll: (callback) => {
    db.query('SELECT * FROM livres', callback);
  },
  findById: (id, callback) => {
    db.query('SELECT * FROM livres WHERE id = ?', [id], callback);
  },
  create: (livre, callback) => {
    db.query('INSERT INTO livres SET ?', livre, callback);
  },
  update: (id, livre, callback) => {
    db.query('UPDATE livres SET ? WHERE id = ?', [livre, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM livres WHERE id = ?', [id], callback);
  },
};

module.exports = Livre;
