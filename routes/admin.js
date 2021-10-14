const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../midldeware/is-auth');
const isAdmin = require('../midldeware/is-admin');

const router = express.Router();

router.get('/blogs', isAuth, isAdmin, adminController.getBlogs);

router.get('/entry', isAuth, isAdmin, adminController.getAddBlog);

router.post('/entry', isAuth, isAdmin, adminController.postAddBlog);

router.get('/edit/:blogPostId', isAuth, isAdmin, adminController.getEditBlog);

router.post('/edit', isAuth, isAdmin, adminController.postEditBlog);

router.post('/delete', isAuth, isAdmin, adminController.postDeleteBlog);

module.exports = router;

//?  Updated postLogin (auth controller) & app.js to disable admin nav links. Best to remove isAdmin middleware or leave it as a error catch?
