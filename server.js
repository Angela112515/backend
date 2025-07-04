// Planification automatique des notifications de retard (cron)
const cron = require('node-cron');
const empruntController = require('./controllers/empruntController');

// Tous les jours à 7h du matin
cron.schedule('0 7 * * *', () => {
  console.log('[CRON] Déclenchement de la notification automatique des retards...');
  // Appel direct du contrôleur (req, res simulés)
  empruntController.notifierRetards(
    { user: { role: 'admin', id: 0 } },
    { json: (msg) => console.log('[CRON][Résultat]', msg), status: () => ({ json: (msg) => console.log('[CRON][Erreur]', msg) }) }
  );
});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const livreRoutes = require('./routes/livres');
const userRoutes = require('./routes/users');
const empruntRoutes = require('./routes/emprunts');
const commentaireRoutes = require('./routes/commentaires');
const auth = require('./middleware/auth');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Rendre le dossier uploads accessible en statique
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('Bienvenue sur l’API Bibliothèque !'));

app.use('/api/auth', authRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/commentaires', commentaireRoutes);

// Exemple de route protégée :
// app.get('/api/protected', auth, (req, res) => res.json({ message: 'Accès autorisé', user: req.user }));

const port = process.env.PORT || 4400;
app.listen(port, () => {
  console.log('Démarrage et écoute sur le port ' + port);
});
