const User = require('../models/user');

exports.getMe = (req, res) => {
  const userId = req.user.user_id;
  User.findById(userId, (err, users) => {
    if (err || !users || users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const user = users[0];
    res.json({ id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, telephone: user.telephone, sexe: user.sexe });
  });
};

// Liste tous les étudiants (utilisateurs)
exports.getAllUsers = (req, res) => {
  User.findAll((err, users) => {
    if (err) return res.status(500).json({ message: 'Erreur récupération utilisateurs', err });
    res.json(users);
  });
};

// Ajout d'un étudiant
exports.createUser = (req, res) => {
  const userData = req.body;
  User.create(userData, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur création utilisateur', err });
    res.status(201).json({ message: 'Utilisateur ajouté' });
  });
};

// Modification d'un étudiant
exports.updateUser = (req, res) => {
  const userData = req.body;
  User.update(req.params.id, userData, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur modification utilisateur', err });
    res.json({ message: 'Utilisateur modifié' });
  });
};

// Suppression d'un étudiant
exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur suppression utilisateur', err });
    res.json({ message: 'Utilisateur supprimé' });
  });
};
