$(document).ready(() => {
	const socket = io();
	let currentAnswer;
	let gotAnswer = false;
	let score = 0;
	let time;
	let answered = '';

	$('.message').hide();
	updateScore(score);

	if (!gotAnswer) {
		$.ajax({
			type: 'POST',
			url: '/client/answer',
			success: (data) => {
				currentAnswer = data;
				gotAnswer = true;
			}
		});
	}

	$('form').submit(() => {
		let userAnswer = $('.answer').val().toLowerCase();
		$('.answer').val("");

		if (answered == currentAnswer) {
			message("You Already Answered This Question!", "error");
			return false;
		}

		if (userAnswer === currentAnswer) {
			message("Correct!", "success");
			score += 2;
			updateScore(score);
			updateDBScore();
		}
		else {
			message("Incorrect!", "error");
		}
		answered = currentAnswer;
		return false;
	});

	function message(text, type) {
		if (type == "success") {
			$('.message').css('color', 'green');
			$('.message').text(text);
			$('.message').fadeIn("slow");
			setTimeout(() => {
				$('.message').fadeOut("slow");
			}, 800);
		}
		else if (type == "error") {
			$('.message').css('color', 'red');
			$('.message').text(text);
			$('.message').fadeIn("slow");
			setTimeout(() => {
				$('.message').fadeOut("slow");
			}, 800);
		}
	}

	function updateScore(score) {
		$('.score').text(`Points: ${score}`);
	}

	function updateDBScore() {
		$.ajax({
			type: "POST",
			url: '/client/update-points',
		});
	}

	// Socket Functions
	socket.on('new answer', (answer) => {
		currentAnswer = answer;
	});

	socket.on('game over', (status) => {
		if (status) {
			window.location.href = "/client/game-over";
		}
	});
});