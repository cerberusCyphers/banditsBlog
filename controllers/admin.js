const BlogPost = require('../models/blogPost');
const { validationResult } = require('express-validator');

const ENTRIES_PER_PAGE = 3;

exports.getAddBlog = (req, res, next) => {
	res.render('admin/edit-blog', {
		pageTitle: 'Add New Post',
		path: '/admin/entry',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
	});
};

exports.postAddBlog = (req, res, next) => {
	const title = req.body.title;
	const date = req.body.date;
	const message = req.body.message;
	const image = req.file;
	let likes = [];
	if (!image) {
		res.status(422).render('admin/edit-blog', {
			pageTitle: 'Add New Post',
			path: 'admin/edit-blog',
			editing: false,
			hasError: true,
			blogEntry: {
				title: title,
				date: date,
				message: message,
				image: image,
				likes: likes,
			},
			errorMessage: 'Selected file is not an image, please choose again.',
			validationErrors: [],
		});
	}
	console.log(image);
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(422).render('admin/edit-blog', {
			pageTitle: 'Add New Post',
			path: 'admin/edit-blog',
			editing: false,
			hasError: true,
			blogEntry: {
				title: title,
				date: date,
				message: message,
				image: image,
				likes: likes,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	const imageUrl = image.location;

	const blogEntry = new BlogPost({
		title: title,
		date: date,
		message: message,
		imageUrl: imageUrl,
		likes: likes,
		userId: req.user,
	});
	blogEntry
		.save()
		.then(result => {
			console.log('ADDED NEW ENTRY!');
			console.log(imageUrl);
			res.redirect('/admin/blogs');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getBlogs = (req, res, next) => {
	const page = +req.query.page || 1;
	let totalEntries;

	BlogPost.find()
		.countDocuments()
		.then(qtyPosts => {
			totalEntries = qtyPosts;
			return BlogPost.find({ userId: req.user._id })
				.sort({ date: 'descending' })
				.skip((page - 1) * ENTRIES_PER_PAGE)
				.limit(ENTRIES_PER_PAGE);
		})
		.then(blogPosts => {
			res.render('admin/blogs', {
				blogs: blogPosts,
				pageTitle: 'Blog Posts',
				path: '/admin/blogs',
				currentPage: page,
				hasNextPage: ENTRIES_PER_PAGE * page < totalEntries,
				hasPrevPage: page > 1,
				nextPage: page + 1,
				prevPage: page - 1,
				lastPage: Math.ceil(totalEntries / ENTRIES_PER_PAGE),
			});
		})
		.catch(err => console.log(err));
};

exports.getEditBlog = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const blogId = req.params.blogPostId;
	BlogPost.findById(blogId)
		.then(blogPost => {
			if (!blogPost) {
				return res.redirect('/');
			}
			res.render('admin/edit-blog', {
				pageTitle: 'Edit Blog',
				path: '/admin/edit-blog',
				editing: editMode,
				blogPost: blogPost,
				hasError: false,
				errorMessage: null,
				validationErrors: [],
			});
		})
		.catch(err => console.log(err));
};

exports.postEditBlog = (req, res, next) => {
	const blogId = req.body.blogPostId;
	const updatedTitle = req.body.title;
	const updatedDate = req.body.date;
	const updatedMsg = req.body.message;
	const image = req.file;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-blog', {
			pageTitle: 'Edit Blog',
			path: '/admin/edit-blog',
			editing: true,
			hasError: true,
			blogPost: {
				title: updatedTitle,
				date: updatedDate,
				message: updatedMsg,
				imageUrl: updatedImageUrl,
				_id: blogId,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	BlogPost.findById(blogId)
		.then(blogPost => {
			if (blogPost.userId.toString() !== req.user._id.toString()) {
				return res.redirect('/');
			}
			blogPost.title = updatedTitle;
			blogPost.date = updatedDate;
			blogPost.message = updatedMsg;
			if (image) {
				blogPost.imageUrl = image.location;
			}
			return blogPost.save().then(result => {
				console.log('UPDATED BLOG!');
				res.redirect('/admin/blogs');
			});
		})
		.catch(err => console.log(err));
};

exports.postDeleteBlog = (req, res, next) => {
	const blogId = req.body.blogPostId;
	BlogPost.findById(blogId)
		.then(blogPost => {
			if (!blogPost) {
				return next(new Error('Entry not found.'));
			}
			return BlogPost.deleteOne({ _id: blogId, userId: req.user._id });
		})
		.then(() => {
			console.log('DESTROYED BLOG');
			res.redirect('/admin/blogs');
		})
		.catch(err => console.log(err));
};
