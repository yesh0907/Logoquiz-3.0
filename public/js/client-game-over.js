'use strict';

$(document).ready(function () {
	var socket = io();
	var teamName = void 0;
	var positions = [];

	$.ajax({
		type: 'POST',
		url: '/client/team-name',
		success: function success(data) {
			teamName = data;
		}
	});

	$.ajax({
		type: 'POST',
		url: '/client/positions',
		success: function success(data) {
			positions = data;
			findPosition(positions, teamName);
		}
	});

	function findPosition(positions, teamName) {
		var i = 1;
		for (var pos in positions) {
			var currentPos = positions[pos];

			if (teamName == currentPos[0]) {
				var points = currentPos[1];
				switch (i) {
					case 1:
						{
							i = "1st";
							break;
						}
					case 2:
						{
							i = "2nd";
							break;
						}
					case 3:
						{
							i = "3rd";
							break;
						}
					default:
						{
							i = i + 'th';
							break;
						}
				}
				$('.message').css('color', 'green');
				$('.message').text('Your Team, ' + teamName + ', came in ' + i + ' place with ' + points + ' points!');
				return 0;
			}
			i++;
		}
	}

	socket.on('positions', function (teams) {
		positions = teams;
	});
});