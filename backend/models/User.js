const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	username: String,
	password: String
});

const User = mongoose.model('User', userSchema);

exports = module.exports = User;