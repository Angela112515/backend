const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const livreRoutes = require('./routes/livres');
const userRoutes = require('./routes/users');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Bienvenue sur l’API Bibliothèque !'));
app.use('/api/auth', authRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/users', userRoutes);

// Exemple de route protégée :
// app.get('/api/protected', auth, (req, res) => res.json({ message: 'Accès autorisé', user: req.user }));

const port = process.env.PORT || 4400;
app.listen(port, () => {
  console.log('Démarrage et écoute sur le port ' + port);
});
