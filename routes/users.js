const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Récupérer tous les étudiants
router.get('/', userController.getAllUsers);
// Ajouter un étudiant
router.post('/', userController.createUser);
// Modifier un étudiant
router.put('/:id', userController.updateUser);
// Supprimer un étudiant
router.delete('/:id', userController.deleteUser);


// Statistiques d'évolution du nombre d'utilisateurs (dashboard admin)
router.get('/stats', userController.getUserStats);

// Récupérer son propre profil
router.get('/me', auth, userController.getMe);

module.exports = router;
