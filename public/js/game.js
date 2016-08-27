'use strict';

$(document).ready(function () {
	var socket = io();

	var images = void 0;
	var counter = 0;
	var currentImage = '';
	var currentAnswer = '';
	var time = 10;
	updateTimerLabel(time);

	var interval = void 0;

	$.ajax({
		type: 'POST',
		url: '/master/images',
		success: function success(data) {
			getImages(data);
			loadImage(images[counter]);
			currentImage = images[counter];
			currentAnswer = getAnswer(currentImage, true);
		}
	});

	startTimer();

	$('.next-image').click(function () {
		nextImage(counter);
	});

	function getImages(imgs) {
		images = imgs;
	}

	function loadImage(img) {
		var imageSRC = '/img/' + img;
		$('.image').attr('src', imageSRC);
	}

	function nextImage() {
		counter++;
		if (counter > images.length - 1) {
			$('.gameStatus').text("Game Over!");
			$('.gameStatus').css('color', 'green');
			$('.gameStatus').show();
			clearInterval(interval);
			updateTimerLabel(0);
			socket.emit('game is over', true);
			setTimeout(function () {
				window.location.href = "/master/game-over";
			}, 800);
			return 0;
		}
		loadImage(images[counter]);
		currentImage = images[counter];
		currentAnswer = getAnswer(currentImage);
	}

	function getAnswer(name) {
		var first = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

		var cleanedName = name.replace(/_/g, " ");
		var prefix = 2;
		var suffix = cleanedName.indexOf('.png');
		var answer = cleanedName.substring(prefix, suffix);
		socket.emit('received new answer', { answer: answer, first: first });
		return answer;
	}

	function startTimer() {
		interval = setInterval(count, 1000);
	}

	function resetTimer() {
		nextImage(counter);
		if (counter > images.length - 1) clearInterval(interval);
		time = 10;
		updateTimerLabel(time);
		startTimer();
	}

	function count() {
		var _this = this;

		if (time <= 0) {
			time = 0;
			clearInterval(interval);
			setTimeout(function () {
				resetTimer();
				clearInterval(_this);
				return 0;
			}, 1000);
		} else {
			--time;
			updateTimerLabel(time);
		}
	}

	function updateTimerLabel(t) {
		$('.time').text(t);
	}

	$(document).keypress(function (e) {
		if (e.which == 13) {
			nextImage(counter);
		}
	});
});