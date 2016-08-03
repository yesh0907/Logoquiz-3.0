const mongoose = require('mongoose');

let answerSchema = new mongoose.Schema({
	currentAnswer: String
});

const Answer = mongoose.model('Answer', answerSchema);

exports = module.exports = Answer;