'use strict';

$(document).ready(function () {
	var socket = io();
	$('form').submit(function () {
		var teamName = $('.team-name').val();
		socket.emit('new team', teamName);
		$('.team-name').val('');
		$('.success-message').fadeIn('slow');
		$('.success-message').fadeOut('slow');
		$.ajax({
			type: 'POST',
			url: '/logoquiz/client/new-team',
			data: { name: teamName }
		});
		setTimeout(function () {
			window.location.href = "/logoquiz/client/waiting";
		}, 1300);
		return false;
	});

	socket.on('team ready', function (team) {
		socket.emit('team is ready', team);
	});
});