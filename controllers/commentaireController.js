const Commentaire = require('../models/commentaire');

exports.ajouterCommentaire = async (req, res) => {
  try {
    const utilisateur_id = req.user.id || req.user.user_id || req.user.utilisateur_id;
    const { livre_id, commentaire, note } = req.body;
    if (!livre_id || !commentaire || commentaire.trim() === '') {
      return res.status(400).json({ message: 'Livre et commentaire requis' });
    }
    // Si note est fourni, il doit être entre 1 et 5, sinon null
    let noteValue = null;
    if (note !== undefined && note !== null && note !== '') {
      if (isNaN(note) || note < 1 || note > 5) {
        return res.status(400).json({ message: 'Note invalide (1 à 5)' });
      }
      noteValue = note;
    }
    const com = await Commentaire.create(utilisateur_id, livre_id, commentaire, noteValue);
    res.status(201).json(com);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du commentaire', error: err.message });
  }
};

exports.getCommentairesLivre = async (req, res) => {
  try {
    const { livre_id } = req.params;
    const commentaires = await Commentaire.getByLivre(livre_id);
    res.json(commentaires);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
};

exports.getCommentairesUser = async (req, res) => {
  try {
    const utilisateur_id = req.user.id;
    const commentaires = await Commentaire.getByUser(utilisateur_id);
    res.json(commentaires);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
};
