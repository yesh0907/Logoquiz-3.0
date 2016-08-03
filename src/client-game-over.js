$(document).ready(() => {
	const socket = io();
	let teamName;
	let positions = [];

	$.ajax({
		type: 'POST',
		url: '/client/team-name',
		success: (data) => {
			teamName = data;
		}
	});

	$.ajax({
		type: 'POST',
		url: '/client/positions',
		success: (data) => {
			positions = data;
			findPosition(positions, teamName);
		}
	});

	function findPosition(positions, teamName) {
		let i = 1;
		for (let pos in positions) {
			let currentPos = positions[pos];

			if (teamName == currentPos[0]) {
				let points = currentPos[1];
				switch (i) {
					case 1: {
						i = "1st";
						break;
					}
					case 2: {
						i = "2nd";
						break;
					}
					case 3: {
						i = "3rd";
						break;
					}
					default: {
						i = `${i}th`;
						break;
					}
				}
				$('.message').css('color', 'green');
				$('.message').text(`Your Team, ${teamName}, came in ${i} place with ${points} points!`);
				return 0;
			}
			i++;
		}
	}

	socket.on('positions', (teams) => {
		positions = teams;
	});
});