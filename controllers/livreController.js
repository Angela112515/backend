const Livre = require('../models/livre');

exports.getAllLivres = (req, res) => {
  Livre.findAll((err, livres) => {
    if (err) return res.status(500).json({ message: 'Erreur récupération livres', err });
    res.json(livres);
  });
};

exports.getLivreById = (req, res) => {
  Livre.findById(req.params.id, (err, livres) => {
    if (err || !livres || livres.length === 0) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(livres[0]);
  });
};

exports.createLivre = (req, res) => {
  Livre.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur création livre', err });
    res.status(201).json({ message: 'Livre ajouté' });
  });
};

exports.updateLivre = (req, res) => {
  Livre.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur modification livre', err });
    res.json({ message: 'Livre modifié' });
  });
};

exports.deleteLivre = (req, res) => {
  Livre.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur suppression livre', err });
    res.json({ message: 'Livre supprimé' });
  });
};
