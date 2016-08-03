const mongoose = require('mongoose');

let positionSchema = new mongoose.Schema({
	positions: []
});

const Position = mongoose.model('Position', positionSchema);

exports = module.exports = Position;