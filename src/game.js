$(document).ready(() => {
	const socket = io();

	let images;
	let counter = 0;
	let currentImage = '';
	let currentAnswer = '';
	let time = 10;
	updateTimerLabel(time);

	let interval;

	$.ajax({
		type: 'POST',
		url: '/master/images',
		success: (data) => {
			getImages(data);
			loadImage(images[counter]);
			currentImage = images[counter];
			currentAnswer = getAnswer(currentImage, true);
		}
	});

	startTimer();

	$('.next-image').click(() => {
		nextImage(counter);
	});

	function getImages(imgs) {
		images = imgs;
	}

	function loadImage(img) {
		let imageSRC = `/img/${img}`;
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
			setTimeout(function() {
				window.location.href = "/master/game-over";
			}, 800);
			return 0;
		}
		loadImage(images[counter]);
		currentImage = images[counter];
		currentAnswer = getAnswer(currentImage);
	}

	function getAnswer(name, first=false) {
		const cleanedName = name.replace(/_/g, " ");
		let prefix = 2;
		let suffix = cleanedName.indexOf('.png');
		let answer = cleanedName.substring(prefix, suffix);
		socket.emit('received new answer', { answer: answer, first: first });
		return answer;
	}

	function startTimer() {
		interval = setInterval(count, 1000);
	}

	function resetTimer() {
		nextImage(counter);
		if (counter > images.length - 1)
			clearInterval(interval);
		time = 10;
		updateTimerLabel(time);
		startTimer();
	}

	function count() {
		if (time <= 0) {
			time = 0;
			clearInterval(interval);
			setTimeout(() => {
				resetTimer();
				clearInterval(this);
				return 0;
			}, 1000);
		}
		else {
			--time;
			updateTimerLabel(time);
		}
	}

	function updateTimerLabel(t) {
		$('.time').text(t);
	}

	$(document).keypress((e) => {
		if (e.which == 13) {
			nextImage(counter);
		}
	});
});