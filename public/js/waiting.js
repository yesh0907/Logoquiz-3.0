$(document).ready(() => {
	const socket = io();

	socket.on('all teams are ready', (teams) => {
		$('.status').text("All Teams Are Ready!");
		console.log("All Teams are ready.");
		setTimeout(() => {
			window.location.href = "/client";
		}, 1300);
	});
});