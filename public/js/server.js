'use strict';

var express = require('express');
// Setup Express App
var app = express();
// Body Parser
var bodyParser = require('body-parser');
// Get Router
var router = require('./backend/routes/routes.js');
// Setup HTTP Server
var http = require('http').Server(app);
// Listen for IO Stream
var io = require('socket.io')(http);
// Connect to Databse
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/logoquiz');
var db = mongoose.connection;
// Express Session
var session = require('express-session');

// Get Secret Keys
var secret = require('./backend/secrets/secrets.js');

// Get Models
var Team = require('./backend/models/Team.js');
var Answer = require('./backend/models/Answer.js');
var Position = require('./backend/models/Position.js');

// Middleware
app.set('trust proxy', 1);
app.use(session({
	secret: secret['COOKIE_SECRET_KEY'],
	resave: false,
	saveUninitialized: true,
	cookie: {}
}));
app.use(bodyParser.json()); // Support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support URL-encoded bodies

// Setup Static Files
app.use(express.static('./public'));

// Set up Router
app.use('/', router);

// Listen for connection.
io.on('connection', function (socket) {
	// Store all Team Names
	var teams = {};

	// Create Team
	socket.on('new team', function (teamName) {
		var newTeam = new Team({ name: teamName });
		newTeam.save(function (err, team) {
			if (err) {
				console.log(err);
			} else {
				var name = newTeam.name;
				// Tell Client that team is ready.
				io.emit("team ready", name);
			}
		});
	});

	// Add Team that is ready to array of teams that are ready.
	socket.on('team is ready', function (team) {
		teams[team] = {
			'ready': true
		};
	});

	// Execute if all teams are ready!
	socket.on('all teams ready', function (teams) {
		socket.broadcast.emit('all teams are ready', teams);
	});

	// Recieved New Answer
	socket.on('received new answer', function (data) {
		var first = data['first'];
		var answer = data['answer'];
		socket.broadcast.emit('new answer', answer);

		if (first) {
			Answer.remove({}, function (err, documents) {
				if (err) {
					console.log(err);
				}
			});
			var currentAnswer = new Answer({ currentAnswer: answer });
			currentAnswer.save(function (err) {
				if (err) {
					console.log(err);
				}
			});
		} else {
			Answer.findOne({}, function (err, doc) {
				if (err) {
					console.log(err);
				} else {
					doc.currentAnswer = answer;
					doc.save(function (err, d) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		}
	});

	// Game Over message
	socket.on('game is over', function (status) {
		socket.broadcast.emit('game over', true);

		// Get the positions
		var teams = [];
		Team.find({}, function (err, t) {
			if (err) {
				console.log(err);
			} else {
				t.forEach(function (team) {
					teams.push([team.name, team.points]);
				});

				teams.sort(function (a, b) {
					return b[1] - a[1];
				});

				Position.remove({}, function (err, docs) {
					if (err) {
						console.log(err);
					}
				});

				var pos = new Position({ positions: teams });
				pos.save(function (err, doc) {
					if (err) {
						console.log(err);
					} else {
						// console.log(doc);
					}
				});
			}
		});

		socket.emit("positions", teams);
	});
});

// Setup HTTP Server Listen
http.listen(8080, function () {
	console.log('Listening on http://localhost:8080');
});