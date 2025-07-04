const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
  const { nom, prenom, email, password, telephone, sexe, role } = req.body;
  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ message: 'Champs obligatoires manquants' });
  }
  User.findByEmail(email, async (err, users) => {
    if (users && users.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }
    const hash = await bcrypt.hash(password, 10);
    // Par défaut, role = 'etudiant' sauf si précisé (pour création admin manuelle)
    const newUser = { nom, prenom, email, password: hash, telephone, sexe, role: role || 'etudiant' };
    User.create(newUser, (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur création utilisateur', err });
      res.status(201).json({ message: 'Inscription réussie' });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET non défini sur le serveur' });
  }
  User.findByEmail(email, async (err, users) => {
    if (err || !users || users.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    const payload = { user_id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  });
};
