'use strict';

$(document).ready(function () {
	var socket = io();

	// Typing animation
	$('.answer-input').click(function () {
		replacePlaceholder('Your Answer');
		clearTimeout(timeout);
	});

	var text = "Start Typing Your Answer Here!";
	var len = text.length;

	var timeout;
	var char = 0;
	var times = 0;
	replacePlaceholder('|');

	function typeIt() {
		var humanize = Math.round(Math.random() * (200 - 30)) + 30;
		timeout = setTimeout(function () {
			char++;
			var type = text.substring(0, char);
			replacePlaceholder(type + '|');
			typeIt();

			if (char == len) {
				replacePlaceholder($('.answer-input').attr('placeholder').slice(0, -1));
				clearTimeout(timeout);
				setTimeout(deleteIt, 1000);
			}
		}, humanize);
	};

	typeIt();

	function deleteIt() {
		var humanize = Math.round(Math.random() * (200 - 30)) + 30;
		timeout = setTimeout(function () {
			char--;
			var del = text.substring(0, char);
			replacePlaceholder(del + "|");
			deleteIt();

			if (char == 0) {
				replacePlaceholder('');
				clearTimeout(timeout);
				setTimeout(typeIt, 1500);
			}
		}, humanize);
	};

	function replacePlaceholder(string) {
		$('.answer-input').attr('placeholder', string);
	}

	// Get team name
	$.ajax({
		type: 'POST',
		url: '/logoquiz/client/team-name',
		success: function success(name) {
			$('.team-name').text('Team Name: ' + name);
		}
	});

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
			url: '/logoquiz/client/answer',
			success: function success(data) {
				currentAnswer = data;
				gotAnswer = true;
			}
		});
	}

	$('form').submit(function (e) {
		e.preventDefault();

		var userAnswer = $('.answer-input').val().toLowerCase();
		$('.answer-input').val("");

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
			url: '/logoquiz/client/update-points'
		});
	}

	// Socket Functions
	socket.on('new answer', function (answer) {
		currentAnswer = answer;
	});

	socket.on('game over', function (status) {
		if (status) {
			window.location.href = "/logoquiz/client/game-over";
		}
	});
});