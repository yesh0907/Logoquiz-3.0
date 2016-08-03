const mongoose = require('mongoose');

let teamSchema = mongoose.Schema({
	name: String,
	points: { type: Number, default: 0 }
});

const Team = mongoose.model('Team', teamSchema);

exports = module.exports = Team;