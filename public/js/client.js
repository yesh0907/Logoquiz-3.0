'use strict';

$(document).ready(function () {
	var socket = io();
	var currentAnswer = void 0;
	var gotAnswer = false;
	var score = 0;
	var time = void 0;
	var answered = '';

	$('.message').hide();
	updateScore(score);

	if (!gotAnswer) {
		$.ajax({
			type: 'POST',
			url: '/client/answer',
			success: function success(data) {
				currentAnswer = data;
				gotAnswer = true;
			}
		});
	}

	$('form').submit(function () {
		var userAnswer = $('.answer').val().toLowerCase();
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
		} else {
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
			setTimeout(function () {
				$('.message').fadeOut("slow");
			}, 800);
		} else if (type == "error") {
			$('.message').css('color', 'red');
			$('.message').text(text);
			$('.message').fadeIn("slow");
			setTimeout(function () {
				$('.message').fadeOut("slow");
			}, 800);
		}
	}

	function updateScore(score) {
		$('.score').text('Points: ' + score);
	}

	function updateDBScore() {
		$.ajax({
			type: "POST",
			url: '/client/update-points'
		});
	}

	// Socket Functions
	socket.on('new answer', function (answer) {
		currentAnswer = answer;
	});

	socket.on('game over', function (status) {
		if (status) {
			window.location.href = "/client/game-over";
		}
	});
});