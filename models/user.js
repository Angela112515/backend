const db = require('../database');

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], callback);
  },
  findById: (id, callback) => {
    db.query('SELECT * FROM utilisateurs WHERE id = ?', [id], callback);
  },
  create: (user, callback) => {
    db.query('INSERT INTO utilisateurs SET ?', user, callback);
  },
  findAll: (callback) => {
    db.query('SELECT * FROM utilisateurs', callback);
  },
  update: (id, user, callback) => {
    db.query('UPDATE utilisateurs SET ? WHERE id = ?', [user, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM utilisateurs WHERE id = ?', [id], callback);
  },
};

module.exports = User;
