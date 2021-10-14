const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blog');

router.get('/', blogController.getLanding);

router.get('/blog', blogController.getBlog);

// router.post('/blog', blogController.postLikeBlog);

module.exports = router;
