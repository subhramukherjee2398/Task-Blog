const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');

// POST route must be before /:idOrSlug to avoid conflicts
router.post('/', protect, createPost);

// Routes that don't require authentication
router.get('/', optionalAuth, getPosts);
router.get('/my-posts', protect, getMyPosts);

// Routes with ID or slug parameter
router.route('/:idOrSlug')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
