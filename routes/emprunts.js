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
// Notifier les retards (admin)
router.post('/notifier-retards', require('../middleware/auth'), async (req, res) => {
  // Optionnel: vérifier que l'utilisateur est admin ici
  // if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Accès refusé' });
  const controller = require('../controllers/empruntController');
  return controller.notifierRetards(req, res);
});
