$(document).ready(() => {
	var socket = io();
	var teams = [];

	$('.all-teams-ready').click(gameReady);

	function gameReady() {
		$('.status').text("The Game is about to start!");
		socket.emit('all teams ready', teams);
		setTimeout(() => {
			window.location.href = "/master/game";
		}, 2000);
	}

	$(document).keypress((e) => {
		if (e.which == 13) {
			gameReady();
		}
	})

	socket.on('team ready', (team) => {
		teams.push(team);
		$('.teams').append(`<li>${team}</li>`);
	});
});