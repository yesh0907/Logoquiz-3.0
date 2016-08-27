'use strict';

$(document).ready(function () {
	var socket = io();

	// Socket functions
	socket.on('all teams are ready', function (teams) {
		$('.status').text("All Teams Are Ready!");
		console.log("All Teams are ready.");
		setTimeout(function () {
			window.location.href = "/client";
		}, 1300);
	});
});