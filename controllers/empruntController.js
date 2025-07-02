// PUT /api/emprunts/retour/:id : retour d'un livre
exports.retournerLivre = (req, res) => {
  const empruntId = req.params.id;
  const utilisateurId = req.user?.id || req.user?.user_id || req.user?.utilisateur_id;
  if (!empruntId || !utilisateurId) {
    return res.status(400).json({ message: 'Paramètres manquants' });
  }
  // Vérifier que l'emprunt appartient à l'utilisateur et n'est pas déjà retourné
  const selectSql = 'SELECT * FROM emprunts WHERE id = ? AND utilisateur_id = ? AND (statut IS NULL OR statut != "retourné")';
  const updateSql = 'UPDATE emprunts SET statut = "retourné", date_retour = NOW() WHERE id = ?';
  const updateLivreSql = 'UPDATE livres SET statut = "disponible", utilisateur_id = NULL WHERE id = ?';
  const getLivreIdSql = 'SELECT livre_id FROM emprunts WHERE id = ?';
  const db = require('../database');
  db.query(selectSql, [empruntId, utilisateurId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Erreur SQL', err });
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Emprunt non trouvé ou déjà retourné' });
    }
    db.query(updateSql, [empruntId], (err2) => {
      if (err2) return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'emprunt', err2 });
      // Rendre le livre disponible
      db.query(getLivreIdSql, [empruntId], (err3, result) => {
        if (err3 || !result || !result[0]) return res.status(500).json({ message: 'Erreur récupération livre', err3 });
        const livreId = result[0].livre_id;
        db.query(updateLivreSql, [livreId], (err4) => {
          if (err4) return res.status(500).json({ message: 'Erreur lors de la mise à jour du livre', err4 });
          res.json({ message: 'Livre rendu avec succès' });
        });
      });
    });
  });
};

// GET /api/emprunts/mes : liste des emprunts de l'utilisateur connecté
exports.getUserEmprunts = (req, res) => {
  const utilisateurId = req.user?.id || req.user?.user_id || req.user?.utilisateur_id;
  if (!utilisateurId) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }
  const sql = `
    SELECT e.id, e.date_emprunt, e.date_retour, e.statut,
           l.id AS livre_id, l.titre AS livre_titre, l.auteur AS livre_auteur, l.genre AS livre_genre, l.image AS livre_image
    FROM emprunts e
    JOIN livres l ON e.livre_id = l.id
    WHERE e.utilisateur_id = ?
    ORDER BY e.date_emprunt DESC
  `;
  db.query(sql, [utilisateurId], (err, emprunts) => {
    if (err) return res.status(500).json({ message: 'Erreur SQL', err });
    res.json(emprunts);
  });
};
const db = require('../database');

exports.emprunterLivre = (req, res) => {
  const livreId = req.params.id;
  const utilisateurId = req.user.user_id;

  // Vérifier que le livre est disponible
  db.query('SELECT * FROM livres WHERE id = ? AND statut = "disponible"', [livreId], (err, livres) => {
    if (err) return res.status(500).json({ message: 'Erreur SQL', err });
    if (!livres || livres.length === 0) {
      return res.status(400).json({ message: 'Livre non disponible ou déjà emprunté.' });
    }
    // Créer l’emprunt
    db.query('INSERT INTO emprunts (utilisateur_id, livre_id) VALUES (?, ?)', [utilisateurId, livreId], (err2) => {
      if (err2) return res.status(500).json({ message: 'Erreur lors de la création de l\'emprunt', err2 });
      // Mettre à jour le statut du livre
      db.query('UPDATE livres SET statut = "emprunté", utilisateur_id = ? WHERE id = ?', [utilisateurId, livreId], (err3) => {
        if (err3) return res.status(500).json({ message: 'Erreur lors de la mise à jour du livre', err3 });
        res.json({ message: 'Livre emprunté avec succès !' });
      });
    });
  });
};

// GET /api/emprunts : liste des emprunts avec jointure livre + utilisateur + totaux
exports.getAllEmpruntsWithStats = (req, res) => {
  // Récupérer tous les emprunts avec infos livre et utilisateur
  const sql = `
    SELECT e.id, e.date_emprunt, e.date_retour, e.statut,
           l.titre AS livre_titre, l.auteur AS livre_auteur, l.genre AS livre_genre,
           u.nom AS etudiant_nom, u.prenom AS etudiant_prenom, u.email AS etudiant_email
    FROM emprunts e
    JOIN livres l ON e.livre_id = l.id
    JOIN utilisateurs u ON e.utilisateur_id = u.id
    ORDER BY e.date_emprunt DESC
  `;
  db.query(sql, (err, emprunts) => {
    if (err) return res.status(500).json({ message: 'Erreur SQL', err });
    // Calculer les totaux
    let totalEmpruntes = 0, totalRetard = 0, totalActifs = 0;
    emprunts.forEach(e => {
      if (e.statut === 'en_cours' || e.statut === 'en_retard') totalEmpruntes++;
      if (e.statut === 'en_retard') totalRetard++;
      if (e.statut === 'en_cours') totalActifs++;
    });
    res.json({
      emprunts,
      stats: {
        totalEmpruntes,
        totalRetard,
        totalActifs
      }
    });
  });
};
