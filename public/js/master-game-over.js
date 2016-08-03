"use strict";

$(document).ready(function () {
	var socket = io();
	var positions = [];

	$.ajax({
		type: "POST",
		url: "/master/positions",
		success: function success(data) {
			positions = data;
			for (var pos in positions) {
				var team = positions[pos];
				$('.rankings').append("<li>" + team[0] + " with " + team[1] + " points!</li>");
			}
			var winner = positions[0];
			$('.winner').text("The Winner is " + winner[0] + " with " + winner[1] + " points!");
			$('.winner').css('color', 'green');
			$('.winner').show();
		}
	});

	socket.on('positions', function (teams) {
		positions = teams;
	});
});