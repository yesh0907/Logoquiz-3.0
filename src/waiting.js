$(document).ready(() => {
	const socket = io();

	// Socket functions
	socket.on('all teams are ready', (teams) => {
		$('.status').text("All Teams Are Ready!");
		console.log("All Teams are ready.");
		setTimeout(() => {
			window.location.href = "/logoquiz/client";
		}, 1300);
	});
});