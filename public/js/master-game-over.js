"use strict";

$(document).ready(function () {
	var socket = io();
	var positions = [];

	$.ajax({
		type: "POST",
		url: "/logoquiz/master/positions",
		success: function success(data) {
			positions = data;
			for (var pos in positions) {
				var team = positions[pos];
				var p = parseInt(pos) + 1;
				if (pos == 0) $('.rankings').append("<li class=\"list-group-item list-group-item-success\">" + p + ". " + team[0] + " with " + team[1] + " points!</li>");else $('.rankings').append("<li class=\"list-group-item\">" + p + ". " + team[0] + " with " + team[1] + " points!</li>");
			}
			var winner = positions[0];
			$('.winner').text("The Winner is " + winner[0] + " with " + winner[1] + " points!");
			$('.winner').show();
		}
	});

	socket.on('positions', function (teams) {
		positions = teams;
	});
});