const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');

// Setup Router
const router = express.Router();

// Models
const Team = require('../models/Team.js');
const Answer = require('../models/Answer.js');
const Position = require('../models/Position.js');
const User = require('../models/User.js');

// Root directory for html files that are going to be sent.
const rootDir = "./public/"

// Index
router.get('/logoquiz/', (req, res) => {
	res.redirect('/logoquiz/client/new-team');
});

/* =============================================
				Game Master Interface
   ============================================= */
router.get('/logoquiz/master/', (req, res) => {
	let session = req.session;
	let active = session.active;

	if (!active) {
		res.redirect('/logoquiz/master/login');
		return 0;
	}
	res.sendFile("master.html", { root: rootDir });
});

// Login
router.get('/logoquiz/master/login', (req, res) => {
	let session = req.session;
	let active = session.active;

	if (active) {
		res.redirect('/logoquiz/master');
		return 0;
	}
	res.sendFile("login.html", { root: rootDir });
});
router.post('/logoquiz/master/login', (req, res) => {
	let session = req.session;

	let username = req.body.username;
	let password = req.body.password;

	User.findOne({ username: username }, (err, user) => {
		if (err) {
			console.log("ERROR:", err);
			res.redirect("/logoquiz/master/login");
		}
		else {
			let hash = user.password;
			bcrypt.compare(password, hash, (err, match) => {
				if (match) {
					session.active = true;
					console.log("Logged In!");
					res.redirect('/logoquiz/master');
				}
				else {
					console.log("Failed to Login");
					res.redirect('/logoquiz/master/login');
				}
			});
		}
	});
});
router.post('/logoquiz/master/signup', (req, res) => {
	let hash = bcrypt.hashSync("r5crudRe0389221", 10);
	const newUser = new User({ username: 'root', password: hash });
	newUser.save((err, user) => {
		if (err)
			console.log("ERROR:", err);
		else {
			console.log("User created!");
		}
	})
});

// Game
router.get('/logoquiz/master/game', (req, res) => {
	let session = req.session;
	let active = session.active;

	if (!active) {
		res.redirect('/logoquiz/master');
		return 0;
	}
	res.sendFile('game.html', { root: rootDir });
});

// Read all Image Files
router.post('/logoquiz/master/images', (req, res) => {
	fs.readdir('./public/img', (err, files) => {
		const pics = files.filter((val) => {
			return val.indexOf('.png') > -1
		});
		res.send(pics);
	});
});

// Game Over
router.get('/logoquiz/master/game-over', (req, res) => {
	let session = req.session;
	let active = session.active;

	if (!active) {
		res.redirect('/logoquiz/master');
		return 0;
	}
	res.sendFile('master-game-over.html', { root: rootDir });
});

// Get Positions
router.post('/logoquiz/master/positions', (req, res) => {
	let session = req.session;
	let active = session.active;

	if (!active) {
		res.sendStatus(401);
		return 0;
	}

	Position.find({}, (err, doc) => {
		if (err) {
			console.log(err);
		}
		else {
			res.send(doc[0]["positions"]);
		}
	});
});

// Reset Game
router.get('/logoquiz/master/reset', (req, res) => {
	let session = req.session;
	let active = session.active;

	if (!active) {
		res.sendStatus(404);
		return 0;
	}

	Team.remove({}, (err) => {
		if (err) {
			console.log(err);
			res.sendStatus(401);
			return 0;
		}
	});

	Answer.remove({}, (err) => {
		if (err) {
			console.log(err);
			res.sendStatus(401);
			return 0;
		}
	});

	Position.remove({}, (err) => {
		if (err) {
			console.log(err);
			res.sendStatus(401);
			return 0;
		}
	});

	console.log("Database Cleared");

	res.redirect("/logoquiz/master");
});
/* ======================================= */


/* =============================================
				Game Client Interface
   ============================================= */

// Client Interface
router.get('/logoquiz/client', (req, res) => {
	let session = req.session;
	let validTeam = session.validTeam;

	if (!validTeam) {
		res.redirect('/logoquiz/client/new-team');
		return 0;
	}
	res.sendFile("client.html", { root: rootDir });
});

// New Team
router.get('/logoquiz/client/new-team', (req, res) => {
	res.sendFile("new-team.html", { root: rootDir });
});
router.post('/logoquiz/client/new-team', (req, res) => {
	let session = req.session;
	session.validTeam = true;
	session.teamName = req.body.name;
	if (session.validTeam)
		res.send({ validTeam: true });
	else
		res.send({ validTeam: false });
});

// Watiting for all players.
router.get('/logoquiz/client/waiting', (req, res) => {
	let session = req.session;
	let validTeam = session.validTeam;

	if (!validTeam) {
		res.redirect('/logoquiz/client/new-team');
		return 0;
	}
	res.sendFile("waiting.html", { root: rootDir });
});

// Get the current Answer
router.post('/logoquiz/client/answer', (req, res) => {
	Answer.findOne({}, (err, doc) => {
		if (err) {
			console.log(err);
		}
		else {
			res.send(doc.currentAnswer);
		}
	});
});

// Update the clients points in the databse
router.post('/logoquiz/client/update-points', (req, res) => {
	let session = req.session;
	let validTeam = session.validTeam;

	if (!validTeam) {
		res.sendStatus(401);
		return 0;
	}

	let teamName = session.teamName;

	Team.findOne({ name: teamName }, (err, team) => {
		if (err) {
			console.log(err);
		}
		else {
			team.points += 2;
			team.save();
			res.sendStatus(200);
		}
	});
});

// Game over
router.get('/logoquiz/client/game-over', (req, res) => {
	let session = req.session;
	let validTeam = session.validTeam;

	if (!validTeam) {
		res.redirect('/client/new-team');
		return 0;
	}

	res.sendFile("client-game-over.html", { root: rootDir });
});

// Get Team Name
router.post('/logoquiz/client/team-name', (req, res) => {
	let session = req.session;
	let validTeam = session.validTeam;

	if (!validTeam) {
		res.sendStatus(401);
		return 0;
	}

	let teamName = session.teamName;
	res.send(teamName);
});

// Get Positions
router.post('/logoquiz/client/positions', (req, res) => {
	let session = req.session;
	let validTeam = session.validTeam;

	if (!validTeam) {
		res.sendStatus(401);
		return 0;
	}

	Position.find({}, (err, doc) => {
		if (err) {
			console.log(err);
		}
		else {
			res.send(doc[0]["positions"]);
		}
	});
});
/* ======================================= */

module.exports = router;