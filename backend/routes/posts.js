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


router.post('/', protect, createPost);


router.get('/', optionalAuth, getPosts);
router.get('/my-posts', protect, getMyPosts);


router.route('/:idOrSlug')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
