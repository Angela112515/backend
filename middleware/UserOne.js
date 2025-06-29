

var mysql = require("mysql");
var connection = require("../database");
// const log = require('log-to-file');



module.exports = function(req, res) {
  const id = req.params.id;
  const sql = 'SELECT * FROM `utilisateurs` WHERE id = ?';

  connection.query(sql, [id], function(err, rows) {
    if (err) {
      return res.status(500).json({ Error: true, Message: "Error executing MySQL query", Details: err });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ Error: true, Message: "Utilisateur non trouvé" });
    }
    // Retourne l'utilisateur trouvé (objet unique)
    res.json(rows[0]);
  });
};



