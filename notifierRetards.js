// Script Node.js pour notifier les étudiants en retard de livre
require('dotenv').config();
const db = require('./database');
const nodemailer = require('nodemailer');

// Configurer le transporteur d'email (exemple Gmail, à adapter selon .env)
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Récupérer les emprunts en retard
const sql = `
  SELECT e.id AS emprunt_id, e.date_emprunt, e.date_retour, e.statut,
         l.titre AS livre_titre, l.auteur AS livre_auteur,
         u.nom, u.prenom, u.email
  FROM emprunts e
  JOIN livres l ON e.livre_id = l.id
  JOIN utilisateurs u ON e.utilisateur_id = u.id
  WHERE e.statut != 'retourné' AND e.date_retour < NOW()
`;

db.query(sql, async (err, rows) => {
  if (err) {
    console.error('Erreur SQL:', err);
    process.exit(1);
  }
  if (!rows.length) {
    console.log('Aucun emprunt en retard.');
    process.exit(0);
  }
  for (const emprunt of rows) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: emprunt.email,
      subject: `Rappel : Livre en retard - ${emprunt.livre_titre}`,
      text: `Bonjour ${emprunt.nom} ${emprunt.prenom},\n\nVous avez un livre en retard :\n- Titre : ${emprunt.livre_titre}\n- Auteur : ${emprunt.livre_auteur}\n- Date de retour prévue : ${new Date(emprunt.date_retour).toLocaleDateString()}\n\nMerci de le rapporter au plus vite à la bibliothèque.\n\nCeci est un rappel automatique.`
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Notification envoyée à ${emprunt.email} pour le livre "${emprunt.livre_titre}"`);
    } catch (e) {
      console.error(`Erreur envoi email à ${emprunt.email}:`, e.message);
    }
  }
  process.exit(0);
});
