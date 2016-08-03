$(document).ready(() => {
	const socket = io();
	let positions = [];

	$.ajax({
		type: "POST",
		url: "/master/positions",
		success: function (data) {
			positions = data;
			for (let pos in positions) {
				let team = positions[pos];
				$('.rankings').append(`<li>${team[0]} with ${team[1]} points!</li>`);
			}
			const winner = positions[0];
			$('.winner').text(`The Winner is ${winner[0]} with ${winner[1]} points!`);
			$('.winner').css('color', 'green');
			$('.winner').show();
		}
	})

	socket.on('positions', (teams) => {
		positions = teams;
	});
});