const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	likes: {
		type: Array,
	},
});

module.exports = mongoose.model('BlogPosts', blogPostSchema);
