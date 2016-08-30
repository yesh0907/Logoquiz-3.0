'use strict';

const express = require('express');
// Setup Express App
const app = express();
// Body Parser
const bodyParser = require('body-parser');
// Get Router
const router = require('./backend/routes/routes.js');
// Setup HTTP Server
const http = require('http').Server(app);
// Listen for IO Stream
const io = require('socket.io')(http);
// Connect to Databse
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/logoquiz');
const db = mongoose.connection;
// Express Session
const session = require('express-session');

// Get Secret Keys
const secret = require('./backend/secrets/secrets.js');

// Get Models
const Team = require('./backend/models/Team.js');
const Answer = require('./backend/models/Answer.js');
const Position = require('./backend/models/Position.js');

// Middleware
app.set('trust proxy', 1);
app.use(session({
	secret: secret['COOKIE_SECRET_KEY'],
	resave: false,
	saveUninitialized: true,
	cookie: {}
}));
app.use(bodyParser.json());								// Support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));		// Support URL-encoded bodies

// Setup Static Files
app.use(express.static('./public'));

// Set up Router
app.use('/', router);

// Listen for connection.
io.on('connection', (socket) => {
	// Store all Team Names
	let teams = {};

	// Create Team
	socket.on('new team', (teamName) => {
		let newTeam = new Team({ name: teamName })
		newTeam.save((err, team) => {
			if (err) {
				console.log(err);
			}
			else {
				let name = newTeam.name;
				// Tell Client that team is ready.
				io.emit("team ready", name);
			}
		});
	});

	// Add Team that is ready to array of teams that are ready.
	socket.on('team is ready', (team) => {
		teams[team] = {
			'ready': true
		}
	});

	// Execute if all teams are ready!
	socket.on('all teams ready', (teams) => {
		socket.broadcast.emit('all teams are ready', teams);
	});

	// Recieved New Answer
	socket.on('received new answer', (data) => {
		let first = data['first'];
		let answer = data['answer'];
		socket.broadcast.emit('new answer', answer);

		if (first) {
			Answer.remove({}, (err, documents) => {
				if (err) {
					console.log(err);
				}
			});
			let currentAnswer = new Answer( { currentAnswer: answer });
			currentAnswer.save((err) => {
				if (err) {
					console.log(err);
				}
			});
		}
		else {
			Answer.findOne({}, (err, doc) => {
				if (err) {
					console.log(err);
				}
				else {
					doc.currentAnswer = answer;
					doc.save((err, d) => {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		}
	});

	// Game Over message
	socket.on('game is over', (status) => {
		socket.broadcast.emit('game over', true);

		// Get the positions
		let teams = [];
		Team.find({}, (err, t) => {
			if (err) {
				console.log(err);
			}
			else {
				t.forEach((team) => {
					teams.push([team.name, team.points]);
				});

				teams.sort((a, b) => {
					return b[1] - a[1];
				});

				Position.remove({}, (err, docs) => {
					if (err) {
						console.log(err);
					}
				});

				const pos = new Position({ positions: teams });
				pos.save((err, doc) => {
					if (err) {
						console.log(err);
					}
					else {
						// console.log(doc);
					}
				});
			}
		});

		socket.emit("positions", teams);
	});
});

// Setup HTTP Server Listen
http.listen(8677, '10.132.4.187', () => {
	console.log('Listening on http://localhost:8080');
});
