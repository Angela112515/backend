const Livre = require('../models/livre');
const multer = require('multer');
const path = require('path');

// Configurer multer pour l'upload d'image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
exports.uploadLivreImage = upload.single('image');

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

// Ajout d'un livre (supporte form-data et JSON)
exports.createLivre = (req, res) => {
  let livreData = {};
  if (req.is('multipart/form-data')) {
    livreData.titre = req.body.titre;
    livreData.auteur = req.body.auteur;
    livreData.genre = req.body.genre;
    if (req.file) {
      livreData.image = '/uploads/' + req.file.filename;
    }
  } else {
    livreData = req.body;
  }
  Livre.create(livreData, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur création livre', err });
    res.status(201).json({ message: 'Livre ajouté', image: livreData.image });
  });
};

// Modification d'un livre (supporte form-data et JSON)
exports.updateLivre = (req, res) => {
  let livreData = {};
  if (req.is('multipart/form-data')) {
    livreData.titre = req.body.titre;
    livreData.auteur = req.body.auteur;
    livreData.genre = req.body.genre;
    if (req.file) {
      livreData.image = '/uploads/' + req.file.filename;
    }
  } else {
    livreData = req.body;
  }
  Livre.update(req.params.id, livreData, (err, result) => {
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
