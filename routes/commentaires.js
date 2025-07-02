const express = require('express');
const router = express.Router();
const commentaireController = require('../controllers/commentaireController');
const verifyToken = require('../middleware/auth');

// Ajouter un commentaire
router.post('/', verifyToken, commentaireController.ajouterCommentaire);
// Récupérer les commentaires d'un livre
router.get('/livre/:livre_id', commentaireController.getCommentairesLivre);
// Récupérer les commentaires de l'utilisateur connecté
router.get('/mes', verifyToken, commentaireController.getCommentairesUser);

module.exports = router;
