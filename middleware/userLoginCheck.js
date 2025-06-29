
var mysql   = require("mysql2");
var bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
var config = require('../config');
var connection = require("../database");


const userLoginCheck  = async (req, res, next) => {

	try {


	let post  = {
		password:req.body.password,
		email:req.body.email
	}


	let query = "SELECT * FROM ?? WHERE ??=? AND useractive = 1";
	let table = ["utilisateurs", "email", post.email];
	query = mysql.format(query,table);


	connection.query( query, async (err, rows) => {
		if(err) {
			res.json({"Error" : true, "Message" : "Error executing MySQL query " + err});
		}


		if (rows.length === 0) {
			return res.status(401).json({ message: "Email ou mot de passe incorrect" });
		}

		let user = rows[0]; // Récupère l'utilisateur
		console.log('[DEBUG BACKEND] Utilisateur trouvé:', user);
		let hashStored = user.password; // Hash enregistré en base de données

		// 2️⃣ Comparer le mot de passe entré avec le hash stocké
		let isMatch = await bcrypt.compare(post.password, hashStored);

		if (!isMatch) {
			return res.status(401).json({"Error" : true, "Message" : "Email ou mot de passe incorrect"});
		}

		// Ajoute id dans le payload JWT pour le frontend
		let payload = {
		  user_id: user.id, // correspond à la colonne 'id' de ta table
		  id: user.id,      // ajoute aussi id pour compatibilité maximale côté front
		  email: user.email
		};
		console.log('[DEBUG BACKEND] Payload JWT:', payload);

		let token = jwt.sign(payload, config.secret, { expiresIn: '1h' });
		let email = user.email;

		let data  = {
		   user_id: user.id,
		   access_token: token,
		}

   

		let query2 = "INSERT INTO ?? SET ?";
		let table2 = ["access_token", data];
		query2 = mysql.format(query2, table2);

		connection.query(query2, data, function(err, rows2) {
		   if(err) {
			   res.json({"Error" : true, "Message" : "Error executing MySQL query" + err});
		   } else {
			   res.json({
				   success: true,
				   currUser: data.user_id,
				   email: email,
				   message: 'Token generated',
				   token: token
			   });
		   }
		});

		
	});


} catch (error) {
	res.json({"Error" : true, "Message" : error });

}

}

module.exports = userLoginCheck;

