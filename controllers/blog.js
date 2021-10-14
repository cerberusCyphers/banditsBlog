const fs = require('fs');
const blogPost = require('../models/blogPost');
const BlogPost = require('../models/blogPost');

const ENTRIES_PER_PAGE = 3;

exports.getLanding = (req, res, next) => {
	res.render('blog/landing', {
		pageTitle: " Bandit's Outdoors",
		path: '/',
	});
};

exports.getBlog = (req, res, next) => {
	const page = +req.query.page || 1;
	let totalEntries;

	BlogPost.find()
		.countDocuments()
		.then(qtyPosts => {
			totalEntries = qtyPosts;
			return BlogPost.find()
				.sort({ date: 'descending' })
				.skip((page - 1) * ENTRIES_PER_PAGE)
				.limit(ENTRIES_PER_PAGE);
		})
		.then(blogPosts => {
			res.render('blog/blog', {
				blogs: blogPosts,
				pageTitle: "Bandit's Blog",
				path: '/blog',
				currentPage: page,
				hasNextPage: ENTRIES_PER_PAGE * page < totalEntries,
				hasPrevPage: page > 1,
				nextPage: page + 1,
				prevPage: page - 1,
				lastPage: Math.ceil(totalEntries / ENTRIES_PER_PAGE),
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.likeBlog = (req, res, next) => {
	const likeUser = req.user;

	BlogPost.likes.push(likeUser);
};
//TODO 1. if User.likedPosts.includes(blogPostId) ? ionicon.setAttribute('name', 'thumbs-up') : 'thumbs-up-outline';
//TODO 2. click button => User.likedPosts.push(blogPostId); ionicon.setAttribute('name', 'thumbs-up');
//? https://stackoverflow.com/questions/9447439/change-html-name-attribute-using-javascript
