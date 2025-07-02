const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');
const empruntController = require('../controllers/empruntController');
const auth = require('../middleware/auth');

router.get('/', livreController.getAllLivres);
router.get('/:id', livreController.getLivreById);
// Ajout d'un livre avec upload d'image
router.post('/', livreController.uploadLivreImage, livreController.createLivre);
// Modification d'un livre avec ou sans image
router.put('/:id', livreController.uploadLivreImage, livreController.updateLivre);
router.delete('/:id', livreController.deleteLivre);
router.post('/:id/emprunter', auth, empruntController.emprunterLivre);

module.exports = router;
