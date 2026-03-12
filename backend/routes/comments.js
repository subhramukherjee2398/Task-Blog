const express = require('express');
const router = express.Router();
const {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  getMyComments
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');


router.get('/post/:postId', getCommentsByPost);


router.get('/my-comments', protect, getMyComments);
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
