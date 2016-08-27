'use strict';

$(document).ready(function () {
	var socket = io();
	var teams = [];

	$('.all-teams-ready').click(gameReady);

	function gameReady() {
		$('.status').text("The game is starting now!");
		socket.emit('all teams ready', teams);
		setTimeout(function () {
			window.location.href = "/master/game";
		}, 2000);
	}

	$(document).keypress(function (e) {
		if (e.which == 13) {
			gameReady();
		}
	});

	socket.on('team ready', function (team) {
		teams.push(team);
		$('.teams').append('<li><p class="lead">' + team + '</p></li>');
	});
});