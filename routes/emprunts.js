const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');


const auth = require('../middleware/auth');

// Liste des emprunts avec jointure livre + utilisateur + totaux
router.get('/', empruntController.getAllEmpruntsWithStats);
// Liste des emprunts de l'utilisateur connecté
router.get('/mes', auth, empruntController.getUserEmprunts);
// Retourner un livre (emprunt)
router.put('/retour/:id', auth, empruntController.retournerLivre);

module.exports = router;
