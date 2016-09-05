$(document).ready(() => {
	const socket = io();
	let positions = [];

	$.ajax({
		type: "POST",
		url: "/logoquiz/master/positions",
		success: function (data) {
			positions = data;
			for (let pos in positions) {
				let team = positions[pos];
				let p =  parseInt(pos) + 1;
				if (pos == 0)
					$('.rankings').append(`<li class="list-group-item list-group-item-success">${p}. ${team[0]} with ${team[1]} points!</li>`);
				else
					$('.rankings').append(`<li class="list-group-item">${p}. ${team[0]} with ${team[1]} points!</li>`);
			}
			const winner = positions[0];
			$('.winner').text(`The Winner is ${winner[0]} with ${winner[1]} points!`);
			$('.winner').show();
		}
	})

	socket.on('positions', (teams) => {
		positions = teams;
	});
});