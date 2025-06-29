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
