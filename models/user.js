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
};

module.exports = User;
